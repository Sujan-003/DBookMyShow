// Show.js
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import shows from "../data/shows";
import theaters from "../data/theaters";
import movies from "../data/movies";
import BookingContext from "../context/BookingContext";
import { FiMapPin, FiClock } from 'react-icons/fi';

const SEAT_PRICE = 200;

const Show = () => {
  const { showId } = useParams();
  const show = shows.find((s) => s.id === parseInt(showId, 10));
  const navigate = useNavigate();
  const { setSelectedShow, selectedSeats, setSelectedSeats } = useContext(BookingContext);

  const [seatGrid, setSeatGrid] = useState([]);
  const [theater, setTheater] = useState(null);
  const [screen, setScreen] = useState(null);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!show) return;
    // Find theater and screen
    const t = theaters.find((th) => th.id === show.theaterId);
    setTheater(t);
    const s = t ? t.screens.find((sc) => sc.id === show.screenId) : null;
    setScreen(s);
    // Find movie
    const m = movies.find((mov) => mov.id === show.movieId);
    setMovie(m);
    // Prepare seat grid
    if (s) {
      setSeatGrid(s.seats);
    }
    // Set selected show in context
    setSelectedShow({
      ...show,
      theater: t,
      screen: s,
      movie: m,
    });
    // Clear selected seats on mount
    setSelectedSeats([]);
    // eslint-disable-next-line
  }, [showId]);

  if (!show || !theater || !screen || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Show not found.</p>
      </div>
    );
  }

  // Handle seat selection
  const isBooked = (seatId) => show.bookedSeats.includes(seatId);
  const isSelected = (seatId) => selectedSeats.some((s) => s.id === seatId);

  const handleSeatClick = (seat) => {
    if (isBooked(seat.id)) return;
    if (isSelected(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="bg-[#1A202C] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
            <FiMapPin className="text-iconGray" />
            <span>{theater.name}, {theater.location}</span>
            <FiClock className="text-iconGray ml-4" />
            <span>{new Date(show.time).toLocaleString([], { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#0A0A0A] py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-400 uppercase tracking-widest mb-4">SCREEN THIS WAY</div>
          <div className="w-3/5 mx-auto h-1 bg-[#8B5CF6] rounded mb-8"></div>
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
              {Array.from({ length: 10 }, (_, i) => {
                const row = i + 1;
                const letter = String.fromCharCode(64 + row);
                const rowSeats = seatGrid.filter((seat) => seat.row === row);
                return (
                  <div key={row} className="flex items-center mb-3">
                    <span className="w-6 text-sm text-gray-400 mr-2">{letter}</span>
                    <div className="flex gap-3">
                      {rowSeats.map((seat) => {
                        const booked = isBooked(seat.id);
                        const selected = isSelected(seat.id);
                        return (
                          <button
                            key={seat.id}
                            disabled={booked}
                            onClick={() => handleSeatClick(seat)}
                            aria-label={`Seat ${seat.number}`}
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                              booked
                                ? 'bg-[#1E293B] text-gray-500 cursor-not-allowed'
                                : selected
                                ? 'bg-[#F59E0B] text-white'
                                : 'bg-[#64748B] text-white hover:bg-[#8B5CF6]'
                            }`}
                          >
                            {seat.col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-[#64748B] rounded"></span>
              <span className="text-sm text-gray-400">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-[#1E293B] rounded"></span>
              <span className="text-sm text-gray-400">Booked</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-[#F59E0B] rounded"></span>
              <span className="text-sm text-gray-400">Selected</span>
            </div>
          </div>
          <div className="bg-[#1A202C] p-6 rounded-lg w-3/5 mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center sm:space-x-8 space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h3 className="text-sm text-gray-400">Selected Seats</h3>
              <p className="text-[#F59E0B] text-lg font-semibold">
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => s.number).join(', ') + ' selected'
                  : 'None'}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm text-gray-400">Total Amount</h3>
              <p className="text-white text-lg font-semibold">
                ₹{(selectedSeats.length * SEAT_PRICE).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => navigate('/ticket')}
              disabled={selectedSeats.length === 0}
              className="w-full sm:w-auto bg-[#E11D48] hover:bg-red-600 text-white py-2 px-6 rounded font-semibold transition-colors disabled:opacity-50"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Show;
