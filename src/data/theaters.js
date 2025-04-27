// theaters.js
// Mock data for theaters, each with screens and seats

const generateSeats = () => {
  const seats = [];
  let seatId = 1;
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 10; col++) {
      seats.push({
        id: seatId,
        row,
        col,
        number: `${row}-${col}`,
      });
      seatId++;
    }
  }
  return seats;
};

const theaters = [
  {
    id: 1,
    name: "PVR Cinemas",
    location: "Bengaluru",
    screens: [
      {
        id: 1,
        number: 1,
        seats: generateSeats(),
      },
      {
        id: 2,
        number: 2,
        seats: generateSeats(),
      },
    ],
  },
  {
    id: 2,
    name: "INOX Garuda Mall",
    location: "Bengaluru",
    screens: [
      {
        id: 3,
        number: 1,
        seats: generateSeats(),
      },
      {
        id: 4,
        number: 2,
        seats: generateSeats(),
      },
    ],
  },
  {
    id: 3,
    name: "Cinepolis Orion",
    location: "Bengaluru",
    screens: [
      {
        id: 5,
        number: 1,
        seats: generateSeats(),
      },
      {
        id: 6,
        number: 2,
        seats: generateSeats(),
      },
    ],
  },
];

export default theaters;
