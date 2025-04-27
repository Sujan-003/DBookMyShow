import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BookingContext from "../context/BookingContext";
import { FaArrowLeft, FaChevronRight, FaCreditCard } from "react-icons/fa";
import { SiSamsungpay, SiPaytm, SiPhonepe, SiAmazonpay } from "react-icons/si";
import { AiOutlineAppstore } from "react-icons/ai";

const Payment = () => {
  const { selectedShow, selectedSeats } = useContext(BookingContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "" });

  if (!selectedShow || selectedSeats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">No booking in progress. Please select seats first.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); navigate("/confirmation"); }, 1200); };

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
        <button onClick={() => navigate('/confirmation')} className="w-full max-w-2xl bg-red-600 hover:bg-red-700 rounded-xl py-3 text-white font-semibold transition">
          Proceed to next page
        </button>
      </div>
    </div>
  );
};

export default Payment;
