// shows.js
// Mock data for shows

const shows = [
  // PVR Cinemas, Screen 1
  {
    id: 1,
    movieId: 1,
    theaterId: 1,
    screenId: 1,
    time: "2025-04-15T18:00:00",
    bookedSeats: [1, 2, 3, 10, 15, 20],
  },
  {
    id: 2,
    movieId: 2,
    theaterId: 1,
    screenId: 1,
    time: "2025-04-15T21:00:00",
    bookedSeats: [5, 6, 7, 8, 9],
  },
  // PVR Cinemas, Screen 2
  {
    id: 3,
    movieId: 3,
    theaterId: 1,
    screenId: 2,
    time: "2025-04-15T19:00:00",
    bookedSeats: [11, 12, 13, 14, 15],
  },
  // INOX Garuda Mall, Screen 1
  {
    id: 4,
    movieId: 4,
    theaterId: 2,
    screenId: 3,
    time: "2025-04-15T17:30:00",
    bookedSeats: [21, 22, 23, 24],
  },
  // INOX Garuda Mall, Screen 2
  {
    id: 5,
    movieId: 5,
    theaterId: 2,
    screenId: 4,
    time: "2025-04-15T20:00:00",
    bookedSeats: [31, 32, 33],
  },
  // Cinepolis Orion, Screen 1
  {
    id: 6,
    movieId: 1,
    theaterId: 3,
    screenId: 5,
    time: "2025-04-15T18:30:00",
    bookedSeats: [41, 42, 43, 44, 45],
  },
  // Cinepolis Orion, Screen 2
  {
    id: 7,
    movieId: 2,
    theaterId: 3,
    screenId: 6,
    time: "2025-04-15T21:30:00",
    bookedSeats: [51, 52, 53],
  },
];

export default shows;
