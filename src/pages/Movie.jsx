import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import movies from "../data/movies";
import theaters from "../data/theaters";
import shows from "../data/shows";

const Movie = () => {
  const { id } = useParams();
  const movieId = parseInt(id, 10);
  const movie = movies.find((m) => m.id === movieId);
  const navigate = useNavigate();

  const movieShows = shows.filter((show) => show.movieId === movieId);

  const theaterMap = {};
  movieShows.forEach((show) => {
    if (!theaterMap[show.theaterId]) {
      const theater = theaters.find((t) => t.id === show.theaterId);
      theaterMap[show.theaterId] = {
        ...theater,
        shows: [],
      };
    }
    theaterMap[show.theaterId].shows.push(show);
    theaterMap[show.theaterId].shows.sort((a, b) => new Date(a.time) - new Date(b.time));
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!movie) {
    return (
      <div className="bg-background text-primary px-4 py-8">
        <p className="text-accent text-center">Movie not found.</p>
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
            <span className="text-primary ml-2 text-sm">New York</span>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-background text-primary py-8 px-4 md:px-16">
        <div className="container mx-auto flex flex-col md:flex-row items-start gap-8">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-36 md:w-56 h-auto object-cover rounded-lg shadow-xl self-center md:self-start"
          />
          <div className="flex-1 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-accent font-bold text-xl mr-2">★</span>
              <span className="text-xl font-semibold">{movie.rating}/5.0</span>
              <span className="text-iconGray ml-2">({movie.votes} votes)</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-medium">2D</span>
              <span className="bg-secondary text-primary px-3 py-1 rounded text-sm font-medium">ENGLISH</span>
            </div>
            <p className="text-iconGray text-sm mb-4">
              <span>{movie.duration}</span> |
              <span className="mx-2">{movie.genre}</span> |
              <span className="ml-2">{movie.releaseDate}</span>
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
            {Object.values(theaterMap).map((theater) => (
              <div 
                key={theater.id} 
                className="border border-divider rounded-lg p-4 transition-transform duration-200 hover:transform hover:scale-[1.02]"
              >
                <h4 className="text-lg font-bold mb-4 text-primary">{theater.name}</h4>
                <div className="flex flex-wrap gap-4">
                  {theater.shows.map((show) => {
                    const screen = theater.screens.find((s) => s.id === show.screenId);
                    const isAvailable = true; // This should be determined by your business logic
                    return (
                      <button
                        key={show.id}
                        className={`px-6 py-3 rounded transition-colors duration-150 font-medium text-sm ${
                          isAvailable 
                            ? "bg-accent text-background hover:bg-opacity-90" 
                            : "bg-[#1F2937] text-iconGray cursor-not-allowed"
                        }`}
                        onClick={() => isAvailable && navigate(`/show/${show.id}`)}
                        disabled={!isAvailable}
                      >
                        {new Date(show.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        <span className="block text-xs mt-1">
                          Screen {screen ? screen.number : "?"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.keys(theaterMap).length === 0 && (
              <p className="text-iconGray">No shows available for this movie at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
