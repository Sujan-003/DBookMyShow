# BookMyShow Clone

A web application that mimics the functionality of BookMyShow, allowing users to browse movies, book tickets, and manage bookings.

## Features

- **Movie Listings**: Browse movies with details like title, genre, rating, and showtimes.
- **Seat Selection**: Interactive seat map for selecting seats in the theater.
- **Booking Management**: View, modify, and cancel bookings.
- **Payment Integration**: Mock payment processing.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.

## Technologies

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker

## Project Structure

```
bookmyshow-clone/
├── data/               # Database files
├── public/             # Static assets
├── scripts/            # Database population scripts
├── server/             # Backend Express server
│   ├── migrations/     # Database migrations
│   └── server.js       # Server entry point
├── src/                # Frontend React application
│   ├── components/     # React components
│   ├── pages/          # React pages
│   └── index.jsx       # Frontend entry point
└── docker-compose.yml  # Docker configuration
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookmyshow-clone.git
   ```

2. Install dependencies:
   ```bash
   cd bookmyshow-clone
   npm install
   cd server
   npm install
   ```

3. Start the development environment:
   ```bash
   docker-compose up
   ```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.
