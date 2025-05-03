import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BookingContext from "../context/BookingContext";
import { FaArrowLeft, FaChevronRight, FaCreditCard } from "react-icons/fa";
import { SiSamsungpay, SiPaytm, SiPhonepe, SiAmazonpay } from "react-icons/si";
import { AiOutlineAppstore } from "react-icons/ai";

const CONVENIENCE_FEE = 15; // Updated convenience fee per ticket

const Payment = () => {
  const { selectedShow, selectedSeats, clearBooking } = useContext(BookingContext); // Added clearBooking from context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for handling errors
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "" }); // Keep form state if needed for actual payment processing later

  if (!selectedShow || selectedSeats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">No booking in progress. Please select seats first.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => { // Made handleSubmit async
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    const totalAmount = (selectedSeats.length * (selectedShow?.base_seat_price || 0)) + (selectedSeats.length * CONVENIENCE_FEE);
    const bookingData = {
      showId: selectedShow.show_id, // Use show_id from selectedShow
      seats: selectedSeats.map(seat => seat.id), // Send array of seat identifiers
      totalAmount: totalAmount,
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', { // Call backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      // Booking successful
      console.log("Booking successful:", result);
      // Clear booking context after successful booking
      clearBooking(); // Assuming you have a clearBooking function in your context
      // Navigate to confirmation page, maybe pass bookingId
      navigate(`/confirmation?bookingId=${result.bookingId}`); // Pass bookingId to confirmation page

    } catch (error) {
      console.error("Error creating booking:", error);
      setError(`Booking failed: ${error.message}`); // Set error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-800 transition">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold ml-4">Select Payment Method</h1>
      </div>
      {/* Content */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl p-4 space-y-6">
           {/* Display Error */}
           {error && (
            <div className="bg-red-800 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {/* Recommended Methods */}
          <div>
            <h2 className="text-gray-400 mb-2">Recommended</h2>
            <div className="bg-secondary rounded-xl shadow-md">
              <button className="flex items-center w-full px-4 py-3 hover:bg-gray-700 transition">
                <SiSamsungpay className="text-2xl" />
                <span className="flex-1 ml-4">Samsung Pay UPI</span>
                <FaChevronRight />
              </button>
              <div className="border-b border-gray-700" />
              <button className="flex items-center w-full px-4 py-3 hover:bg-gray-700 transition">
                <SiPaytm className="text-2xl" />
                <span className="flex-1 ml-4">Paytm UPI</span>
                <FaChevronRight />
              </button>
              <div className="border-b border-gray-700" />
              <button className="flex items-center w-full px-4 py-3 hover:bg-gray-700 transition">
                <SiPhonepe className="text-2xl text-purple-600" />
                <span className="flex-1 ml-4">PhonePe UPI</span>
                <FaChevronRight />
              </button>
            </div>
          </div>
          {/* Cards Section */}
          <div>
            <h2 className="text-gray-400 mb-2">Cards</h2>
            <div className="bg-secondary rounded-xl shadow-md p-2">
              <div className="flex items-center justify-between px-4 py-3">
                <FaCreditCard className="text-2xl" />
                <span className="text-gray-400 flex-1 ml-4">Add credit or debit card...</span>
                <button className="px-3 py-1 border border-white text-white uppercase text-sm rounded hover:bg-gray-700 transition">ADD</button>
              </div>
            </div>
          </div>
          {/* UPI Apps Section */}
          <div>
            <h2 className="text-gray-400 mb-2">Pay by any UPI app</h2>
            <div className="bg-secondary rounded-xl shadow-md">
              <button className="flex items-center w-full px-4 py-3 hover:bg-gray-700 transition">
                <SiAmazonpay className="text-2xl" />
                <span className="flex-1 ml-4">Amazon Pay UPI</span>
                <FaChevronRight />
              </button>
              <div className="border-b border-gray-700" />
              <div className="flex items-center justify-between px-4 py-3">
                <AiOutlineAppstore className="text-2xl" />
                <span className="text-gray-400 flex-1 ml-4">Add new UPI ID</span>
                <button className="px-3 py-1 border border-white text-white uppercase text-sm rounded hover:bg-gray-700 transition">ADD</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Action */}
      <div className="flex justify-center p-4">
        {/* Call handleSubmit on button click */}
        <button
          onClick={handleSubmit}
          disabled={selectedSeats.length === 0 || loading} // Disable while loading
          className="w-full max-w-2xl bg-red-600 hover:bg-red-700 rounded-xl py-3 text-white font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Proceed to next page'} {/* Show loading text */}
        </button>
      </div>
    </div>
  );
};

export default Payment;
