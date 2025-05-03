import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useParams, useNavigate } from "react-router-dom";
// Remove local data imports
// import movies from "../data/movies";
// import theaters from "../data/theaters";
// import shows from "../data/shows";

const Movie = () => {
  const { id } = useParams();
  const movieId = parseInt(id, 10);
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState(null); // State to hold fetched movie and theater/show data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch movie details, theaters, and shows
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${movieId}`); // Call backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovieData(data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]); // Rerun effect if movieId changes

  // Scroll to top on component mount (and when data is loaded)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieData]); // Scroll to top after movieData is loaded

  if (loading) {
    return (
      <div className="bg-background text-iconGray min-h-screen flex items-center justify-center">
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-red-500 min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  // Use fetched movie data
  const movie = movieData?.movie;
  const theaters = movieData?.theaters || [];

  if (!movie) {
    return (
      <div className="bg-background text-iconGray min-h-screen flex items-center justify-center">
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-secondary py-3 px-4 md:px-16">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-primary font-bold font-sans text-xl">DBookMyShow</span>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-iconGray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-primary ml-2 text-sm">Bangalore</span> {/* TODO: Fetch actual city */}
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-background text-primary py-8 px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-start gap-8">
          <img
            src={movie.poster_url} // Use poster_url from backend
            alt={movie.title}
            className="w-36 md:w-56 h-auto object-cover rounded-lg shadow-xl self-center md:self-start"
          />
          <div className="flex-1 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-accent font-bold text-xl mr-2">★</span>
              <span className="text-xl font-semibold">{movie.rating}/10.0</span>
              <span className="text-iconGray ml-2">({movie.votes} votes)</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {/* TODO: Fetch actual formats/languages from backend */}
              <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-medium">2D</span>
              <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-medium">ENGLISH</span>
            </div>
            <p className="text-iconGray text-sm mb-4">
              <span>{movie.duration}</span> |
              <span className="mx-2">{movie.genre}</span> |
              <span className="ml-2">{new Date(movie.release_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}</span> {/* Use release_date from backend */}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-16 py-8">
        {/* About Section */}
        <div className="mb-8 bg-secondary p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-3 text-primary">About the movie</h3>
          <p className="text-iconGray leading-relaxed">{movie.description}</p>
        </div>

        {/* Theaters & Showtimes Section */}
        <div className="bg-secondary p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-6 text-primary">Select Theatres & Show Time</h3>
          <div className="space-y-6">
            {theaters.length > 0 ? (
              theaters.map((theater) => (
                <div
                  key={theater.theater_id} // Use theater_id from backend
                  className="border border-divider rounded-lg p-4 transition-transform duration-200 hover:transform hover:scale-[1.02]"
                >
                  <h4 className="text-lg font-bold mb-4 text-primary">{theater.name}</h4>
                  <div className="flex flex-wrap gap-4">
                    {theater.shows.map((show) => {
                      const isAvailable = true; // TODO: Determine availability based on bookings
                      return (
                        <button
                          key={show.show_id} // Use show_id from backend
                          className={`px-6 py-3 rounded transition-colors duration-150 font-medium text-sm ${
                            isAvailable
                              ? "bg-accent text-background hover:bg-opacity-90"
                              : "bg-[#1F2937] text-iconGray cursor-not-allowed"
                          }`}
                          onClick={() => isAvailable && navigate(`/show/${show.show_id}`)} // Navigate using show_id
                          disabled={!isAvailable}
                        >
                          {new Date(show.show_time).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", hour12: true })} {/* Use show_time */}
                          <span className="block text-xs mt-1">
                            Screen {show.screen ? show.screen.screen_number : "?"} {/* Use screen_number */}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-iconGray">No shows available for this movie at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
