const { Client } = require("pg");

// Use dynamic import for node-fetch (for CommonJS compatibility)
async function fetchUrl(...args) {
  const fetch = (await import("node-fetch")).default;
  return fetch(...args);
}

const TMDB_API_KEY = "6af0647f271b0b8c76515c8a436136aa";
const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`;
const GENRE_LIST_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Database connection details - Replace with your actual details
const dbConfig = {
  user: "spiky",
  host: "localhost", // Or your database host
  database: "project", // Replace with your database name
  password: "spiky", // Replace with your database password
  port: 5431, // Or your database port
};

async function fetchAndPopulateMovies() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log("Connected to the database");

    // Truncate existing movie data
    await client.query("TRUNCATE TABLE movies, shows CASCADE");
    console.log("Truncated existing movie data");

    // Fetch trending movies from TMDB
    const response = await fetchUrl(TRENDING_MOVIES_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch trending movies: ${response.statusText}`
      );
    }
    const data = await response.json();
    const movies = data.results;

    if (!movies || movies.length === 0) {
      console.log("No trending movies found.");
      return;
    }

    // Fetch genre list from TMDB
    const genreResponse = await fetchUrl(GENRE_LIST_URL);
    if (!genreResponse.ok) {
      throw new Error(`Failed to fetch genres: ${genreResponse.statusText}`);
    }
    const genreData = await genreResponse.json();
    const genres = genreData.genres;

    // After fetching genres
    console.log("Fetched genres:", genres);

    if (!genres || genres.length === 0) {
      console.log("No genres found.");
      return;
    }

    // Create an in-memory mapping of genre_id to genre_name
    const genreMap = genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});

    // After creating genre map
    console.log("Genre map:", genreMap);

    console.log(`Fetched ${movies.length} trending movies.`);

    // Prepare data for insertion
    const moviesToInsert = movies.map((movie) => {
      // Convert genre_ids to genre names
      const genreNames = movie.genre_ids
        .map((id) => genreMap[id])
        .filter((name) => name) // Filter out any undefined names (if a genre ID is not found)
        .join(", "); // Join names with comma and space

      // Inside movie mapping
      console.log("Movie genre_ids:", movie.genre_ids);
      console.log("Mapped genre names:", genreNames);

      return {
        title: movie.title,
        poster_url: movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : null,
        description: movie.overview,
        genre: genreNames, // Store comma-separated genre names
        rating: movie.vote_average,
        votes: movie.vote_count,
        duration: null, // TMDB trending endpoint doesn't provide duration directly
        release_date: movie.release_date,
      };
    });

    // Insert movies into the database
    for (const movie of moviesToInsert) {
      const movieQuery = `
                INSERT INTO movies (title, poster_url, description, genre, rating, votes, duration, release_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
      const movieValues = [
        movie.title,
        movie.poster_url,
        movie.description,
        movie.genre, // Use the comma-separated genre names
        movie.rating,
        movie.votes,
        movie.duration,
        movie.release_date,
      ];
      await client.query(movieQuery, movieValues);

      console.log(`Inserted movie: ${movie.title}`);
    }

    console.log("Movie data population complete.");
  } catch (error) {
    console.error("Error fetching or populating movies:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

fetchAndPopulateMovies();
