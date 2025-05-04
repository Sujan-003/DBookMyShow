// Ticket.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import BookingContext from "../context/BookingContext";

// Removed SEAT_PRICE constant
const CONVENIENCE_FEE = 15; // Updated convenience fee per ticket

const Ticket = () => {
  const { selectedShow, selectedSeats } = useContext(BookingContext);
  const navigate = useNavigate();

  if (!selectedShow || !selectedShow.movie || !selectedShow.theater || !selectedShow.screen) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">No booking in progress. Please select a show and seats.</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <header className="w-full bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg h-20 flex items-center justify-center shadow-lg">
        <h1 className="text-white text-2xl font-bold font-inter">DBookMyShow</h1>
      </header>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-2xl space-y-6 px-4">
          {/* Movie Info Card */}
          <div className="flex bg-gray-800 rounded-2xl p-4 items-center shadow-md">
            <img src={selectedShow.movie.poster_url} alt="Movie Poster" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div className="ml-4">
              <h2 className="text-white text-xl font-semibold">{selectedShow.movie.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · {new Date(selectedShow.show_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
              <p className="text-gray-400 text-sm">{selectedShow.theater.name}</p>
              <p className="text-gray-400 text-sm">SCREEN {selectedShow.screen.number}</p>
            </div>
          </div>

          {/* Selected Seats Card */}
          <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-white text-lg font-medium">Selected Seats</h3>
            <p className="text-white text-base mt-2">{selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(", ") : 'None'}</p>
            <hr className="border-gray-700 my-3" />
            <p className="text-gray-400 text-sm">Total Seats: {selectedSeats.length}</p>
          </div>

          {/* Bill Details Card */}
          <div className="bg-gray-800 rounded-2xl p-4 shadow-md space-y-4">
            <h3 className="text-white text-lg font-medium">Bill Details</h3>

            <div className="flex justify-between">
              {/* Use base_seat_price from selectedShow context */}
              <span className="text-gray-400 text-sm">Ticket Price ({selectedSeats.length} seats)</span>
              <span className="text-white text-sm">₹{(selectedShow?.base_seat_price || 0)} × {selectedSeats.length}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Convenience Fee ({selectedSeats.length} seats)</span>
              <span className="text-white text-sm">₹{CONVENIENCE_FEE} × {selectedSeats.length}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-gray-700">
              <span className="text-white text-base font-semibold">Total Amount</span>
              {/* Calculate total amount: (seats * base_price) + (seats * convenience_fee) */}
              <span className="text-red-500 text-base font-semibold">₹{(selectedSeats.length * (selectedShow?.base_seat_price || 0)) + (selectedSeats.length * CONVENIENCE_FEE)}</span>
            </div>

            <button
              className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 text-white font-semibold transition hover:scale-105 transform disabled:opacity-50"
              disabled={selectedSeats.length === 0}
              onClick={() => navigate("/payment")}
            >
              Proceed to Payment
            </button>
          </div>

          {/* Important Information Card */}
          <div className="bg-gray-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-3a1 1 0 112 0v2a1 1 0 11-2 0V7zm0 4a1 1 0 000 2h.01a1 1 0 000-2H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-white text-lg font-medium">Important Information</h3>
            </div>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400 text-sm">
              <li>Tickets cannot be cancelled, refunded or exchanged once purchased.</li>
              <li>Outside food and beverages are not allowed inside the cinema.</li>
              <li>Please carry a valid photo ID proof for verification purposes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
