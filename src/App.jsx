// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Show from "./pages/Show";
import Ticket from "./pages/Ticket";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import { BookingProvider } from "./context/BookingContext";

function App() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background text-white font-sans">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/show/:showId" element={<Show />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </BrowserRouter>
      </div>
    </BookingProvider>
  );
}

export default App;
