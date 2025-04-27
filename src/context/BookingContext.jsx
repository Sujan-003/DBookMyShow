// BookingContext.js
import React, { createContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const clearBooking = () => {
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedShow,
        setSelectedShow,
        selectedSeats,
        setSelectedSeats,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
