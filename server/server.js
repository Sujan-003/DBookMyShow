const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.env || 5000;

// Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Database connected:", result.rows[0].now);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Simple root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health Check Endpoint
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({ status: "ok", database_time: result.rows[0].now });
  } catch (err) {
    console.error("Error executing health check query", err.stack);
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

// Endpoint to get all theaters
app.get("/api/theaters", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, COUNT(s.screen_id) as screen_count 
      FROM theaters t
      LEFT JOIN screens s ON t.theater_id = s.theater_id
      GROUP BY t.theater_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching theaters:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get all movies or search movies
app.get("/api/movies", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM movies";
    const params = [];

    if (search) {
      query += " WHERE title ILIKE $1 OR description ILIKE $1";
      params.push(`%${search}%`);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get all bookings with details
app.get("/api/bookings/details", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.booking_id,
        b.booking_code,
        b.seat_numbers,
        b.total_amount,
        b.booking_date,
        b.cancellation_available,
        m.title as movie_title,
        t.name as theater_name,
        s.show_time
      FROM bookings b
      JOIN shows s ON b.show_id = s.show_id
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
      ORDER BY b.booking_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get movie details, theaters, shows, and screens for a specific movie
app.get("/api/movies/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    // Fetch movie details
    const movieResult = await pool.query(
      "SELECT * FROM movies WHERE movie_id = $1",
      [movieId]
    );
    if (movieResult.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const movie = movieResult.rows[0];

    // Fetch shows, theaters, and screens for the movie
    const showsResult = await pool.query(
      `
      SELECT
        s.*,
        t.theater_id,
        t.name as theater_name,
        t.location as theater_location,
        scr.screen_id,
        scr.screen_number
      FROM shows s
      JOIN theaters t ON s.theater_id = t.theater_id
      JOIN screens scr ON s.screen_id = scr.screen_id
      WHERE s.movie_id = $1
      ORDER BY t.name, s.show_time
    `,
      [movieId]
    );

    // Structure the data
    const theatersMap = {};
    showsResult.rows.forEach((row) => {
      if (!theatersMap[row.theater_id]) {
        theatersMap[row.theater_id] = {
          theater_id: row.theater_id,
          name: row.theater_name,
          location: row.theater_location,
          shows: [],
        };
      }
      theatersMap[row.theater_id].shows.push({
        show_id: row.show_id,
        show_time: row.show_time,
        base_seat_price: row.base_seat_price,
        screen: {
          screen_id: row.screen_id,
          screen_number: row.screen_number,
        },
        // Include other show details as needed
      });
    });

    const theaters = Object.values(theatersMap);

    res.json({ movie, theaters });
  } catch (err) {
    console.error("Error fetching movie details and shows:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get details for a specific show, including booked seats
app.get("/api/shows/:showId", async (req, res) => {
  const { showId } = req.params;
  try {
    // Fetch show details, movie, theater, and screen
    const showResult = await pool.query(
      `
      SELECT
        s.*,
        m.movie_id,
        m.title as movie_title,
        m.poster_url as movie_poster_url,
        m.duration as movie_duration,
        m.genre as movie_genre,
        m.rating as movie_rating,
        m.votes as movie_votes,
        m.description as movie_description,
        m.release_date as movie_release_date,
        t.theater_id,
        t.name as theater_name,
        t.location as theater_location,
        scr.screen_id,
        scr.screen_number
      FROM shows s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
      JOIN screens scr ON s.screen_id = scr.screen_id
      WHERE s.show_id = $1
    `,
      [showId]
    );

    if (showResult.rows.length === 0) {
      return res.status(404).json({ error: "Show not found" });
    }

    const showData = showResult.rows[0];

    // Fetch booked seats for this show
    const bookingsResult = await pool.query(
      "SELECT seat_numbers FROM bookings WHERE show_id = $1",
      [showId]
    ); // Use seat_numbers
    const bookedSeats = bookingsResult.rows.reduce((acc, booking) => {
      // Assuming 'seats' column in bookings table is an array of seat identifiers (e.g., TEXT[])
      // If it's a different format (e.g., JSONB), you might need to adjust this.
      if (Array.isArray(booking.seat_numbers)) {
        // Use seat_numbers
        return acc.concat(booking.seat_numbers); // Use seat_numbers
      }
      return acc;
    }, []);

    // Structure the response
    const responseData = {
      show: {
        show_id: showData.show_id,
        show_time: showData.show_time,
        base_seat_price: showData.base_seat_price,
        // Include other show details as needed
        movie: {
          movie_id: showData.movie_id,
          title: showData.movie_title,
          poster_url: showData.movie_poster_url,
          duration: showData.movie_duration,
          genre: showData.movie_genre,
          rating: showData.movie_rating,
          votes: showData.movie_votes,
          description: showData.movie_description,
          release_date: showData.movie_release_date,
        },
        theater: {
          theater_id: showData.theater_id,
          name: showData.theater_name,
          location: showData.theater_location,
        },
        screen: {
          screen_id: showData.screen_id,
          screen_number: showData.screen_number,
        },
      },
      bookedSeats: bookedSeats,
    };

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching show details and booked seats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to create a new booking
app.post("/api/bookings", async (req, res) => {
  const { showId, seats, totalAmount } = req.body;

  // Basic validation
  if (
    !showId ||
    !seats ||
    !Array.isArray(seats) ||
    seats.length === 0 ||
    totalAmount === undefined
  ) {
    return res.status(400).json({ error: "Invalid booking data provided" });
  }

  try {
    // Generate a simple booking code (e.g., random alphanumeric string)
    const bookingCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Generate an 8-char code

    // Insert the new booking into the bookings table
    // Assuming 'seat_numbers' column is TEXT[]
    const result = await pool.query(
      "INSERT INTO bookings (show_id, booking_code, seat_numbers, total_amount) VALUES ($1, $2, $3, $4) RETURNING booking_id", // Include booking_code
      [showId, bookingCode, seats, totalAmount] // Include bookingCode in parameters
    );

    const newBookingId = result.rows[0].booking_id;

    res.status(201).json({ success: true, bookingId: newBookingId, bookingCode: bookingCode }); // Return bookingCode
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get booking details by booking ID
app.get("/api/bookings/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const bookingResult = await pool.query(
      `
      SELECT
        b.booking_id,
        b.booking_code,
        b.seat_numbers AS seats, -- Alias seat_numbers to seats
        b.total_amount,
        b.booking_date,
        b.cancellation_available,
        s.show_id,
        s.show_time,
        s.base_seat_price,
        m.movie_id,
        m.title as movie_title,
        m.poster_url as movie_poster_url,
        t.theater_id,
        t.name as theater_name,
        t.location as theater_location,
        scr.screen_id,
        scr.screen_number
      FROM bookings b
      JOIN shows s ON b.show_id = s.show_id
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN theaters t ON s.theater_id = t.theater_id
      JOIN screens scr ON s.screen_id = scr.screen_id
      WHERE b.booking_id = $1
    `,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const bookingData = bookingResult.rows[0];

    // Structure the response
    const responseData = {
      booking_id: bookingData.booking_id,
      booking_code: bookingData.booking_code, // Include booking_code
      seats: bookingData.seats, // Now correctly mapped from seat_numbers
      total_amount: bookingData.total_amount,
      booking_date: bookingData.booking_date, // Use booking_date
      cancellation_available: bookingData.cancellation_available, // Use cancellation_available
      show: {
        show_id: bookingData.show_id,
        show_time: bookingData.show_time,
        base_seat_price: bookingData.base_seat_price,
        movie: {
          movie_id: bookingData.movie_id,
          title: bookingData.movie_title,
          poster_url: bookingData.movie_poster_url,
          // Include other movie details if needed
        },
        theater: {
          theater_id: bookingData.theater_id,
          name: bookingData.theater_name,
          location: bookingData.theater_location,
          // Include other theater details if needed
        },
        screen: {
          screen_id: bookingData.screen_id,
          screen_number: bookingData.screen_number,
          // Include other screen details if needed
        },
      },
    };

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching booking details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
