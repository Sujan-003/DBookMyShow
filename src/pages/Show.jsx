// Show.js
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Remove local data imports
// import shows from "../data/shows";
// import theaters from "../data/theaters";
// import movies from "../data/movies";
import BookingContext from "../context/BookingContext";
import { FiMapPin, FiClock } from 'react-icons/fi';

// Removed SEAT_PRICE constant

const Show = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { selectedShow, setSelectedShow, selectedSeats, setSelectedSeats } = useContext(BookingContext);

  const [showData, setShowData] = useState(null); // State to hold fetched show data and booked seats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [seatGrid, setSeatGrid] = useState([]);
  // Removed local state for theater, screen, movie as they will be part of showData

  // Effect to fetch show details and booked seats
  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/shows/${showId}`); // Call backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setShowData(data); // Set the fetched data

        // Set selected show in context (ensure base_seat_price is included)
        setSelectedShow({
          ...data.show, // Use show data from backend
          // Assuming show object from backend includes movie, theater, screen nested
          base_seat_price: data.show.base_seat_price || 0 // Use base_seat_price from backend
        });

        // Generate 10x10 seat grid (A-J rows, 1-10 columns) - This logic remains the same
        const generatedGrid = [];
        const rows = 10;
        const cols = 10;
        for (let i = 0; i < rows; i++) {
          const rowLetter = String.fromCharCode(65 + i); // A, B, C...
          const rowSeats = [];
          for (let j = 1; j <= cols; j++) {
            rowSeats.push({
              id: `${rowLetter}${j}`, // e.g., A1, A2, B1, B2
              row: rowLetter,
              col: j,
              number: `${rowLetter}${j}` // Use combined identifier for display/booking
            });
          }
          generatedGrid.push({ row: rowLetter, seats: rowSeats });
        }
        setSeatGrid(generatedGrid);

        // Clear selected seats on mount
        setSelectedSeats([]);

      } catch (error) {
        console.error("Error fetching show data:", error);
        setError("Failed to load show details.");
      } finally {
        setLoading(false);
      }
    };
    fetchShowData();
  }, [showId, setSelectedShow, setSelectedSeats]); // Rerun effect if showId changes or context setters change

  // Scroll to top on component mount (and when data is loaded)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showData]); // Scroll to top after showData is loaded

  if (loading) {
    return (
      <div className="bg-background text-iconGray min-h-screen flex items-center justify-center">
        <p>Loading show details...</p>
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

  // Use fetched data
  const show = showData?.show;
  const movie = show?.movie;
  const theater = show?.theater;
  const bookedSeats = showData?.bookedSeats || []; // Use bookedSeats from backend

  if (!show || !movie || !theater || !selectedShow) { // Check selectedShow as it holds base_seat_price
    return (
      <div className="bg-background text-iconGray min-h-screen flex items-center justify-center">
        <p>Show details not found.</p>
      </div>
    );
  }

  // Handle seat selection
  // Use the bookedSeats array from the fetched data
  const isBooked = (seatNumber) => bookedSeats.includes(seatNumber);
  const isSelected = (seatNumber) => selectedSeats.some((s) => s.id === seatNumber);

  const handleSeatClick = (seat) => {
    // seat object now has id like "A1"
    if (isBooked(seat.id)) return;
    if (isSelected(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]); // Store the whole seat object {id: "A1", row: "A", col: 1, number: "A1"}
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <header className="bg-[#1A202C] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1> {/* Use movie from fetched data */}
          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
            <FiMapPin className="text-iconGray" />
            <span>{theater.name}, {theater.location}</span> {/* Use theater from fetched data */}
            <FiClock className="text-iconGray ml-4" />
            <span>{new Date(show.show_time).toLocaleString([], { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span> {/* Use show_time from fetched data */}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#0A0A0A] py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-400 uppercase tracking-widest mb-4">SCREEN THIS WAY</div>
          <div className="w-3/5 mx-auto h-1 bg-[#8B5CF6] rounded mb-8"></div>
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
              {/* Iterate through the generated seatGrid */}
              {seatGrid.map((rowItem) => (
                <div key={rowItem.row} className="flex items-center mb-3">
                  <span className="w-6 text-sm text-gray-400 mr-2">{rowItem.row}</span>
                  <div className="flex gap-3">
                    {rowItem.seats.map((seat) => {
                      const booked = isBooked(seat.id); // Check using seat number like "A1"
                      const selected = isSelected(seat.id); // Check using seat number like "A1"
                      return (
                        <button
                          key={seat.id}
                          disabled={booked}
                          onClick={() => handleSeatClick(seat)}
                          aria-label={`Seat ${seat.id}`} // Use seat.id ("A1") for label
                          className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                            booked
                              ? 'bg-[#1E293B] text-gray-500 cursor-not-allowed'
                              : selected
                              ? 'bg-[#F59E0B] text-white'
                              : 'bg-[#64748B] text-white hover:bg-[#8B5CF6]'
                          }`}
                        >
                          {seat.col} {/* Display column number */}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                  ? selectedSeats.map((s) => s.id).join(', ') + ' selected' // Display seat numbers like "A1"
                  : 'None'}
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm text-gray-400">Total Amount (Base Price)</h3>
              <p className="text-white text-lg font-semibold">
                {/* Use base_seat_price from selectedShow context */}
                ₹{(selectedSeats.length * (selectedShow?.base_seat_price || 0)).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => navigate('/ticket')} // This will navigate to the Ticket page
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
