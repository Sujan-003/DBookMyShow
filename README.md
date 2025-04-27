# BookMyShow Clone

A web application that mimics the functionality of BookMyShow, allowing users to browse movies, book tickets, and manage bookings.

## Features

- **Movie Listings**: Browse a collection of movies with details like title, genre, rating, and showtimes.
- **Seat Selection**: Interactive seat map for selecting seats in the theater.
- **Booking Management**: View, modify, and cancel bookings.
- **User Authentication**: Secure login and registration system.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.

## Technologies

- **Frontend**: React.js, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Stripe API

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookmyshow-clone.git
   ```

2. Install dependencies:
   ```bash
   cd bookmyshow-clone
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Screenshots

![Home Page](public/screenshots/home.png)
![Movie Details](public/screenshots/movie.png)
![Booking Page](public/screenshots/booking.png)

## API Reference

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Add new movie (admin)

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `DELETE /api/bookings/:id` - Cancel booking

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/bookmyshow-clone](https://github.com/yourusername/bookmyshow-clone)
