// Confirmation.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingContext from "../context/BookingContext";
import { FaCheckCircle, FaReceipt, FaChevronRight } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";

const SEAT_PRICE = 200;

function generateTicketId() {
  return (
    "TKT-" +
    Math.random().toString(36).substr(2, 6).toUpperCase() +
    "-" +
    Date.now().toString().slice(-4)
  );
}

const Confirmation = () => {
  const { selectedShow, selectedSeats, clearBooking } = useContext(BookingContext);
  const [ticketId, setTicketId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setTicketId(generateTicketId());
    // eslint-disable-next-line
  }, []);

  if (!selectedShow || !selectedShow.movie || !selectedShow.theater || !selectedShow.screen || selectedSeats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">No booking found. Please book a ticket first.</p>
      </div>
    );
  }

  const handleHome = () => {
    clearBooking();
    navigate("/");
  };

  return (
    <div className="min-h-screen font-sans text-white px-6 py-8 flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, #006400 0%, #006400 50%, #000000 100%)' }}>
      {/* Header Section */}
      <div className="flex flex-col items-center space-y-2 mt-6">
        <div className="bg-green-500 rounded-full p-4 shadow-lg animate-pulse">
          <FaCheckCircle className="text-white w-12 h-12" />
        </div>
        <h1 className="text-3xl font-semibold">Booking confirmed</h1>
      </div>
      {/* Movie Information Section */}
      <div className="flex flex-col md:flex-row bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-8 w-full max-w-3xl">
        <img src={selectedShow.movie.poster} alt={selectedShow.movie.title} className="w-32 rounded-lg shadow-md" />
        <div className="flex-1 md:ml-6 mt-4 md:mt-0">
          <h2 className="text-xl font-bold">{selectedShow.movie.title}</h2>
          <p className="text-gray-300 text-sm mt-2">English | 2D | U/A</p>
        </div>
      </div>
      {/* Booking Details Card */}
      <div className="bg-[#1a1a1a]/80 rounded-2xl shadow-lg p-5 mt-6 w-full max-w-3xl">
        <p className="text-gray-200 mb-1">Booking ID: {ticketId}</p>
        <p className="text-gray-200 mb-3">Booking code: {ticketId.split('-').join('')}</p>
        <p className="text-white font-semibold text-base">
          {`${new Date(selectedShow.time).toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short' })} | ${new Date(selectedShow.time).toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })}`}
        </p>
      </div>
      {/* Screening Information Section */}
      <div className="bg-[#1a1a1a]/80 rounded-2xl shadow-lg p-5 mt-6 w-full max-w-3xl">
        <h3 className="text-white font-bold text-lg">AUDI {selectedShow.screen.number}</h3>
        <p className="text-gray-300">{selectedSeats.length} tickets</p>
        <p className="text-gray-300">{selectedSeats.map(s => s.number).join(', ')}</p>
        <hr className="border-t border-white opacity-20 my-4" />
        <div className="flex items-center justify-between">
          <p className="text-gray-300">PVR Phoenix Marketcity Mall, Whitefield Road, Bengaluru</p>
          <FiMapPin className="text-gray-300 w-5 h-5" />
        </div>
        <div className="flex items-center mt-2">
          <HiOutlineShieldCheck className="text-green-400 w-5 h-5 mr-2" />
          <p className="text-gray-300">Cancellation available for this booking</p>
        </div>
      </div>
      {/* Order Details Section */}
      <div className="mt-8 w-full max-w-3xl">
        <h3 className="text-white text-lg font-semibold mb-4">Order details</h3>
        <div className="bg-[#1a1a1a]/80 rounded-2xl shadow-lg p-5 flex items-center justify-between hover:bg-[#1a1a1a]/90 transition">
          <div className="flex items-center space-x-3">
            <FaReceipt className="text-white w-6 h-6" />
            <div>
              <p className="text-white font-bold">Total bill ₹{selectedSeats.length * SEAT_PRICE}</p>
              <p className="text-gray-300 text-sm">Incl. taxes & fees</p>
            </div>
          </div>
          <FaChevronRight className="text-gray-300 w-5 h-5" />
        </div>
      </div>
      <button onClick={handleHome} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition">
        Back to Home
      </button>
    </div>
  );
};

export default Confirmation;
