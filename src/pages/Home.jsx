// Home.js
import React from "react";
import { FiMapPin, FiSearch } from 'react-icons/fi';
import movies from "../data/movies";
import MovieCard from "../components/MovieCard";

const Home = () => {
  return (
    <>
      <header className="w-full h-[72px] bg-background flex items-center justify-between px-6">
        <div className="flex items-center">
          <span className="text-white font-bold text-xl">DBookMyShow</span>
        </div>
        <div className="flex items-center text-iconGray">
          <FiMapPin size={20} className="mr-1" />
          <span className="text-sm">Current City</span>
        </div>
      </header>

      <section className="w-full bg-gradient-to-b from-background to-secondary py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4">Every Great Movie Experience Starts Here</h1>
          <p className="text-lg md:text-xl text-iconGray mb-8">Browse, Book, and Prepare for Cinematic Wonder</p>
          <div className="relative w-full max-w-lg mx-auto">
            <FiSearch size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-iconGray" />
            <input
              type="text"
              placeholder="Search movies, theaters..."
              className="w-[400px] h-[42px] pl-12 pr-4 rounded-lg bg-secondary border border-divider text-white placeholder-iconGray focus:outline-none text-center"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Now Showing</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
