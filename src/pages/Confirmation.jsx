// Confirmation.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import BookingContext from "../context/BookingContext";
import { FaCheckCircle, FaReceipt, FaChevronRight } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";

// Removed SEAT_PRICE constant
// Removed generateTicketId function

const Confirmation = () => {
  const { clearBooking } = useContext(BookingContext); // Only need clearBooking here
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access URL query parameters

  const [bookingDetails, setBookingDetails] = useState(null); // State to hold fetched booking details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      const params = new URLSearchParams(location.search);
      const bookingId = params.get('bookingId'); // Get bookingId from URL

      if (!bookingId) {
        setError("Booking ID not found in URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`); // Call backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookingDetails(data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError(`Failed to load booking details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [location.search]); // Rerun effect if URL search params change

  // Scroll to top on component mount (and when data is loaded)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [bookingDetails]); // Scroll to top after bookingDetails is loaded


  if (loading) {
    return (
      <div className="bg-black text-iconGray min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-red-500 min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  // Use fetched booking details
  const booking = bookingDetails;
  const selectedShow = booking?.show;
  const selectedSeats = booking?.seats || []; // Assuming seats is an array in the fetched data

  if (!booking || !selectedShow || !selectedShow.movie || !selectedShow.theater || !selectedShow.screen || selectedSeats.length === 0) {
    return (
      <div className="bg-black text-iconGray min-h-screen flex items-center justify-center">
        <p>Booking details not found or incomplete.</p>
      </div>
    );
  }

  const handleHome = () => {
    clearBooking(); // Clear context on navigating home
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
        <img src={selectedShow.movie.poster_url} alt={selectedShow.movie.title} className="w-32 rounded-lg shadow-md" /> {/* Use poster_url */}
        <div className="flex-1 md:ml-6 mt-4 md:mt-0">
          <h2 className="text-xl font-bold">{selectedShow.movie.title}</h2>
          <p className="text-gray-300 text-sm mt-2">English | 2D | U/A</p> {/* TODO: Fetch actual format/language/rating */}
        </div>
      </div>
      {/* Booking Details Card */}
      <div className="bg-[#1a1a1a]/80 rounded-2xl shadow-lg p-5 mt-6 w-full max-w-3xl">
        <p className="text-gray-200 mb-1">Booking ID: {booking.booking_id}</p> {/* Use booking_id from fetched data */}
        <p className="text-gray-200 mb-3">Booking code: {booking.booking_id}</p> {/* Using booking_id as code for now */}
        <p className="text-white font-semibold text-base">
          {`${new Date(selectedShow.show_time).toLocaleDateString(undefined, { weekday:'short', day:'numeric', month:'short' })} | ${new Date(selectedShow.show_time).toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })}`} {/* Use show_time */}
        </p>
      </div>
      {/* Screening Information Section */}
      <div className="bg-[#1a1a1a]/80 rounded-2xl shadow-lg p-5 mt-6 w-full max-w-3xl">
        <h3 className="text-white font-bold text-lg">AUDI {selectedShow.screen.screen_number}</h3> {/* Use screen_number */}
        <p className="text-gray-300">{selectedSeats.length} tickets</p>
        <p className="text-gray-300">{selectedSeats.join(', ')}</p> {/* selectedSeats is already array of strings */}
        <hr className="border-t border-white opacity-20 my-4" />
        <div className="flex items-center justify-between">
          <p className="text-gray-300">{selectedShow.theater.name}, {selectedShow.theater.location}</p> {/* Use theater name and location */}
          <FiMapPin className="text-gray-300 w-5 h-5" />
        </div>
        <div className="flex items-center mt-2">
          <HiOutlineShieldCheck className="text-green-400 w-5 h-5 mr-2" />
          <p className="text-gray-300">Cancellation available for this booking</p> {/* TODO: Implement cancellation logic */}
        </div>
      </div>
      {/* Order Details Section */}
      <div className="mt-8 w-full max-w-3xl">
        <h3 className="text-white text-lg font-semibold mb-4">Order details</h3>
        <div className="bg-[#1a1a1a]/80 rounded-2xl shadow-lg p-5 flex items-center justify-between hover:bg-[#1a1a1a]/90 transition">
          <div className="flex items-center space-x-3">
            <FaReceipt className="text-white w-6 h-6" />
            <div>
              <p className="text-white font-bold">Total bill ₹{booking.total_amount}</p> {/* Use total_amount from fetched data */}
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
