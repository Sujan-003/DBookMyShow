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
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div>
          <h3 className="text-lg font-semibold mb-1 text-white">{movie.title}</h3>
          <p className="text-sm text-iconGray mb-2">{movie.genre}</p>
        </div>

        {/* New container for Description and Rating */}
        {/* mt-2 adds space below the genre */}
        {/* items-start aligns description top with star top */}
        <div className="flex justify-between items-start mt-2">
          <p className="text-xs text-iconGray line-clamp-2 mr-3 flex-grow">{movie.description}</p>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md">
            <span className="text-accent">★</span>
            <span className="text-sm text-white font-medium">{movie.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
