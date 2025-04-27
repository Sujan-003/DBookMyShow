// MovieCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-secondary rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-200 flex flex-col"
      onClick={() => navigate(`/movie/${movie.id}`)}
      title={movie.title}
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
      <div>
          <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
          <p className="text-sm text-gray-400 mb-2">{movie.genre}</p>
        </div>

        {/* New container for Description and Rating */}
        {/* mt-2 adds space below the genre */}
        {/* items-start aligns description top with star top */}
        <div className="flex justify-between items-start mt-2">
          {/* Description - Allow it to grow and wrap */}
          {/* mr-2 adds space between description and rating */}
          <p className="text-xs text-gray-400 line-clamp-2 mr-2 flex-grow">{movie.description}</p>

          {/* Rating - Removed its own mt-2 */}
          {/* flex-shrink-0 prevents rating from shrinking if description is long */}
          <div className="flex items-center flex-shrink-0">
            {/* This is the selection you provided */}
            <span className="text-yellow-400 font-bold mr-1">★</span>
            <span className="text-sm">{movie.rating}</span>
            {/* End of selection */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
