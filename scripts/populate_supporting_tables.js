// scripts/populate_supporting_tables.js

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://spiky:spiky@localhost:5431/project',
});

async function main() {
  try {
    await client.connect();

    // 0. Clear existing data in correct order to avoid FK violations
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM shows');
    await client.query('DELETE FROM screens');
    await client.query('DELETE FROM theaters');

    // 1. Get movie_ids (use all available)
    const moviesRes = await client.query('SELECT movie_id FROM movies');
    const movieIds = moviesRes.rows.map(row => row.movie_id);
    if (movieIds.length < 1) throw new Error('No movies found in movies table.');

    // 2. Insert Bangalore theaters
    const bangaloreTheaters = [
      { name: "PVR Forum Mall", location: "Koramangala, Bangalore", contact: "080-4123xxxx" },
      { name: "INOX Garuda Mall", location: "Magrath Road, Bangalore", contact: "080-2555xxxx" },
      { name: "PVR Orion Mall", location: "Malleshwaram, Bangalore", contact: "080-4747xxxx" },
      { name: "INOX Mantri Square", location: "Malleshwaram, Bangalore", contact: "080-4666xxxx" },
      { name: "Cinepolis Royal Meenakshi Mall", location: "Bannerghatta Road, Bangalore", contact: "080-6726xxxx" },
      { name: "PVR Phoenix Marketcity", location: "Whitefield, Bangalore", contact: "080-6726xxxx" },
      { name: "INOX Central", location: "JP Nagar, Bangalore", contact: "080-4040xxxx" },
      { name: "PVR VR Bengaluru", location: "Whitefield, Bangalore", contact: "080-6726xxxx" }
    ];
    const theaterIds = [];
    for (const t of bangaloreTheaters) {
      const res = await client.query(
        'INSERT INTO theaters (name, location, contact) VALUES ($1, $2, $3) RETURNING theater_id',
        [t.name, t.location, t.contact]
      );
      theaterIds.push(res.rows[0].theater_id);
    }

    // 3. Insert screens (3-4 per theater, all same price, 100 seats)
    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const screenIds = [];
    const theaterBasePrices = [];
    for (let tIdx = 0; tIdx < theaterIds.length; tIdx++) {
      const numScreens = randomInt(3, 4);
      // Pick a single base price for this theater (200–450)
      const base_seat_price = randomInt(200, 450);
      theaterBasePrices.push(base_seat_price);
      for (let s = 1; s <= numScreens; s++) {
        const screen_number = `Screen ${s}`;
        const total_seats = 100;
        const res = await client.query(
          'INSERT INTO screens (theater_id, screen_number, total_seats, base_seat_price) VALUES ($1, $2, $3, $4) RETURNING screen_id',
          [theaterIds[tIdx], screen_number, total_seats, base_seat_price]
        );
        screenIds.push({
          id: res.rows[0].screen_id,
          base_price: base_seat_price,
          theater_id: theaterIds[tIdx],
          total_seats,
          screen_number
        });
      }
    }

    // 4. Insert shows (multiple per day, next 7 days, realistic times)
    const showTimes = [
      { hour: 10, min: 0 },
      { hour: 13, min: 30 },
      { hour: 16, min: 30 },
      { hour: 19, min: 30 },
      { hour: 22, min: 30 }
    ];
    const showIds = [];
    let showCount = 0;
    for (const screen of screenIds) {
      for (let day = 0; day < 7; day++) {
        for (let stIdx = 0; stIdx < showTimes.length; stIdx++) {
          // Pick a movie in round-robin
          const movie_id = movieIds[(showCount + stIdx) % movieIds.length];
          const now = new Date();
          now.setDate(now.getDate() + day);
          now.setHours(showTimes[stIdx].hour, showTimes[stIdx].min, 0, 0);
          // All shows use the theater's base price (no premium/regular distinction)
          const base_price = screen.base_price;
          const res = await client.query(
            'INSERT INTO shows (movie_id, screen_id, theater_id, show_time, base_price) VALUES ($1, $2, $3, $4, $5) RETURNING show_id',
            [movie_id, screen.id, screen.theater_id, now, base_price]
          );
          showIds.push({
            id: res.rows[0].show_id,
            screen_id: screen.id,
            theater_id: screen.theater_id,
            base_price,
            total_seats: screen.total_seats
          });
          showCount++;
        }
      }
    }

    // 5. Insert sample bookings (at least 10, varied seats, spread across shows/theaters)
    function randomBookingCode() {
      return 'BOOK' + Math.floor(100000 + Math.random() * 900000);
    }
    function randomSeats(total, count) {
      // Generate seat labels like A1, A2, ..., B1, B2, ...
      const seats = [];
      let row = 65; // 'A'
      let num = 1;
      for (let i = 0; i < count; i++) {
        seats.push(String.fromCharCode(row) + num);
        num++;
        if (num > 10) { num = 1; row++; }
      }
      return seats;
    }
    const bookingsData = [];
    for (let i = 0; i < 10; i++) {
      const showIdx = randomInt(0, showIds.length - 1);
      const show = showIds[showIdx];
      const seatCount = [1, 2, 4, 5][randomInt(0, 3)];
      const seat_numbers = randomSeats(show.total_seats, seatCount);
      const user_id = (i % 5) + 1; // Simulate 5 users
      const total_amount = (show.base_price + 15) * seatCount;
      bookingsData.push({
        show_id: show.id,
        user_id,
        seat_numbers,
        total_amount
      });
    }
    for (const b of bookingsData) {
      await client.query(
        'INSERT INTO bookings (show_id, user_id, booking_code, seat_numbers, total_amount, cancellation_available) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          b.show_id,
          b.user_id,
          randomBookingCode(),
          b.seat_numbers,
          b.total_amount,
          true
        ]
      );
    }

    console.log('Bangalore theaters, screens, shows, and bookings populated successfully.');
  } catch (err) {
    console.error('Error populating tables:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();