// Home.js
import React, { useState, useEffect } from "react";
import { FiMapPin, FiSearch, FiMenu, FiX } from "react-icons/fi";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorMovies, setErrorMovies] = useState(null);
  const [errorBookings, setErrorBookings] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);
  const [errorTheaters, setErrorTheaters] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState({ movies: [], theaters: [] });
  const [searching, setSearching] = useState(false);
  const searchInputRef = React.useRef(null);
  const searchDebounceRef = React.useRef(null);

  // Effect to fetch theaters
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/theaters");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTheaters(data);
      } catch (error) {
        console.error("Error fetching theaters:", error);
        setErrorTheaters("Failed to load theaters.");
      } finally {
        setLoadingTheaters(false);
      }
    };
    fetchTheaters();
  }, []);

  // Handle search with debouncing
  const handleSearch = (text) => {
    setSearchText(text);
    setSearching(true);

    // Clear previous timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // If search is empty, clear results
    if (!text.trim()) {
      setSearchResults({ movies: [], theaters: [] });
      setSearching(false);
      return;
    }

    // Set new timeout for search
    searchDebounceRef.current = setTimeout(async () => {
      try {
        // Fetch movies based on search
        const moviesResponse = await fetch(`http://localhost:5000/api/movies?search=${encodeURIComponent(text)}`);
        const moviesData = await moviesResponse.json();
        const formattedMovies = moviesData.map((movie) => ({
          id: movie.movie_id,
          poster: movie.poster_url,
          title: movie.title,
          genre: movie.genre,
          description: movie.description,
          rating: movie.rating,
          votes: movie.votes,
          duration: movie.duration,
          release_date: movie.release_date,
        }));

        // Filter theaters on client side since it's already fetched
        const filteredTheaters = theaters.filter(theater => 
          theater.name.toLowerCase().includes(text.toLowerCase()) ||
          theater.location.toLowerCase().includes(text.toLowerCase())
        ).map(theater => ({
          ...theater,
          screens: { length: theater.screen_count }
        }));

        setSearchResults({
          movies: formattedMovies,
          theaters: filteredTheaters
        });
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setSearching(false);
      }
    }, 300); // 300ms debounce delay
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if the pressed key is '/' and no input/textarea is focused
      if (
        e.key === '/' && 
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Effect to fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedMovies = data.map((movie) => ({
          id: movie.movie_id,
          poster: movie.poster_url,
          title: movie.title,
          genre: movie.genre,
          description: movie.description,
          rating: movie.rating,
          votes: movie.votes,
          duration: movie.duration,
          release_date: movie.release_date,
        }));
        setMovies(formattedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setErrorMovies("Failed to load movies.");
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, []);

  // Effect to fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/details");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedBookings = data.map((booking) => ({
          ...booking,
          show_time: new Date(booking.show_time).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
          booking_date: new Date(booking.booking_date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        }));
        setBookings(formattedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setErrorBookings("Failed to load bookings.");
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <>
      <header className="w-full h-[72px] bg-background flex items-center justify-between px-6">
        <div className="flex items-center">
          <span className="text-white font-bold text-xl">DBookMyShow</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center text-iconGray hover:text-white transition-colors">
            <FiMapPin size={20} className="mr-1" />
            <span className="text-sm">Current City</span>
          </div>
          <div className="relative group">
            <button 
              aria-label="View Bookings"
              className="p-2 -m-2 text-iconGray hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <FiMenu size={20} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-[420px] bg-secondary/95 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-divider/10 backdrop-blur-sm">
              <div className="divide-y divide-divider/10">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-sans text-xl font-semibold">Your Bookings</h2>
                    <div className="flex items-center gap-4">
                      <button className="text-accent hover:text-accent/80 text-sm font-medium transition-colors">
                        View All
                      </button>
                      <button className="p-1 -m-1 text-iconGray hover:text-white transition-colors rounded-full hover:bg-white/5">
                        <FiX size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {loadingBookings && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
                    </div>
                  )}

                  {errorBookings && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-500 text-sm">{errorBookings}</p>
                    </div>
                  )}

                  {!loadingBookings && !errorBookings && bookings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <span className="text-4xl mb-3">🎬</span>
                      <p className="text-iconGray text-sm">No bookings found</p>
                    </div>
                  )}

                  {!loadingBookings && !errorBookings && bookings.length > 0 && (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
                      {bookings.map((booking) => (
                        <div
                          key={booking.booking_id}
                          className="bg-background/40 hover:bg-background/60 p-5 rounded-xl border border-divider/10 transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-white font-semibold text-base truncate">
                                  {booking.movie_title}
                                </h3>
                                <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs font-medium">
                                  #{booking.booking_code}
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center text-iconGray">
                                  <span className="w-5">🏢</span>
                                  <span className="truncate">{booking.theater_name}</span>
                                </div>
                                <div className="flex items-center text-iconGray">
                                  <span className="w-5">🎬</span>
                                  <span>{booking.show_time}</span>
                                </div>
                                <div className="flex items-center text-iconGray">
                                  <span className="w-5">💺</span>
                                  <span>{booking.seat_numbers.join(", ")}</span>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-divider/10">
                                  <span className="text-white font-medium">
                                    ₹{booking.total_amount}
                                  </span>
                                  {booking.cancellation_available && (
                                    <button className="text-red-500 hover:text-red-400 font-medium text-sm transition-colors">
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="w-full bg-gradient-to-b from-background to-secondary py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4">
            Every Great Movie Experience Starts Here
          </h1>
          <p className="text-lg md:text-xl text-iconGray mb-8">
            Browse, Book, and Prepare for Cinematic Wonder
          </p>
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl group-hover:bg-accent/30 transition-colors duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative flex items-center">
                <FiSearch
                  size={22}
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-iconGray group-hover:text-white transition-colors duration-300"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for movies or theaters..."
                  className="w-full h-[52px] pl-14 pr-6 rounded-xl bg-secondary/80 backdrop-blur-xl border border-divider/10 
                    text-white placeholder-iconGray focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20
                    transition-all duration-300"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.target.blur();
                    }
                  }}
                />
              </div>
            </div>
            <div className="absolute top-full left-0 right-0 mt-2 text-center">
              <p className="text-xs text-iconGray">Press '/' to focus search</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchText && (
        <div className="container mx-auto px-4 py-8">
          {searching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
            </div>
          ) : (
            <>
              {searchResults.movies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Movies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {searchResults.theaters.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Theaters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.theaters.map((theater) => (
                  <div 
                    key={theater.id}
                    className="bg-secondary/80 p-6 rounded-xl border border-divider/10 hover:border-accent/50 transition-all duration-300"
                  >
                    <h3 className="text-white text-xl font-semibold mb-2">{theater.name}</h3>
                    <p className="text-iconGray">{theater.location}</p>
                    <p className="text-iconGray mt-2">{theater.screens.length} Screens</p>
                  </div>
                ))}
              </div>
            </div>
          )}

              {searchResults.movies.length === 0 && searchResults.theaters.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-iconGray text-lg">No results found for "{searchText}"</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Now Showing Section */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Now Showing</h1>
        {loadingMovies && <p className="text-iconGray">Loading movies...</p>}
        {errorMovies && <p className="text-red-500">{errorMovies}</p>}
        {!loadingMovies && !errorMovies && movies.length === 0 && (
          <p className="text-iconGray">No movies found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1800px] mx-auto">
          {!loadingMovies &&
            !errorMovies &&
            movies.map((movie) => (
              <MovieCard key={movie.movie_id} movie={movie} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
