# Memory Bank

This file serves as a central place for notes, ideas, and important information about the BookMyShow Clone project.

## Project Overview (Simplified)

**What is this project?**
Think of this project as a digital replica or a practice version of a popular movie ticket booking website like BookMyShow. It's a web application built to demonstrate how such a service works, allowing users to perform the essential steps of booking movie tickets online.

**What can users do with it?**
Users interacting with this application can:
1.  **Browse Movies:** See a list of movies currently available, similar to looking at posters at a cinema entrance.
2.  **View Details:** Click on a movie to get more information, such as its story summary, genre (like comedy, action, drama), duration, and ratings.
3.  **Find Showtimes & Theaters:** Select a movie and see which theaters (cinemas) are showing it and at what specific times (showtimes).
4.  **Select Seats:** Choose a specific showtime and theater, then view an interactive map of the cinema hall (screen) to pick their desired seats.
5.  **Book Tickets:** Proceed through a simulated booking process, which includes reviewing the selected movie, showtime, seats, and total cost.
6.  **Mock Payment:** Complete a pretend payment step (no real money is exchanged).
7.  **View Confirmation/Ticket:** Receive a confirmation of the booking, acting like a digital ticket.

**How is it built? (The Technology Behind It)**
The application is made up of several key parts working together:
-   **Frontend (The User Interface):** This is the part you see and interact with in your web browser (like Chrome, Firefox, Edge). It displays the movie lists, seat maps, buttons, etc. It's built using:
    -   `React`: A popular JavaScript library for building interactive user interfaces efficiently.
    -   `Tailwind CSS`: A utility-first CSS framework used to style the application and make it look visually appealing without writing lots of custom style rules.
    -   `Vite`: A modern build tool that helps develop and bundle the frontend code quickly.
-   **Backend (The Server-Side Logic):** This is the "engine" running behind the scenes on a server. It handles requests from the frontend (like when you click "Book Now"), processes logic, interacts with the database to fetch or save information, and sends responses back to the frontend. It's built using:
    -   `Node.js`: A JavaScript runtime environment that allows running JavaScript code outside the browser, perfect for building servers.
    -   `Express.js`: A web framework for Node.js that simplifies building the backend API (Application Programming Interface - the communication channel between frontend and backend).
-   **Database (The Information Store):** This is where all the application's data is permanently stored. This includes details about movies, theaters, screens within theaters, show timings, seat layouts, prices, and user bookings. It uses:
    -   `PostgreSQL`: A powerful and reliable open-source relational database system.
    -   `Knex.js`: A tool (SQL Query Builder) used by the backend to easily construct database queries and manage database structure changes (migrations).
-   **Containerization (Easy Setup):** To make it easy for developers to set up and run the entire project (frontend, backend, database) without complex manual configuration, it uses:
    -   `Docker` & `Docker Compose`: Tools that package the application components and their dependencies into isolated environments called "containers". `docker-compose.yml` defines how these containers work together.

## What This Project Demonstrates (In Simple Steps)

Imagine you want to book a movie ticket using this application:

1.  **Homepage:** You open the website and see a list of movies currently playing.
2.  **Movie Page:** You click on a movie poster (e.g., "Action Movie X"). The page changes to show details: a summary ("A hero saves the day..."), the actors, how long it runs, etc.
3.  **Show Page:** Below the movie details, you see a list of theaters showing "Action Movie X". You pick a theater (e.g., "City Multiplex") and see the available showtimes (e.g., 2:00 PM, 5:00 PM, 8:00 PM). You click on "5:00 PM".
4.  **Seat Selection:** The page now displays a map of the cinema hall for the 5:00 PM show at City Multiplex. You see rows of seats, some available (clickable) and some already booked (greyed out). You click on two seats in the middle row (e.g., G7, G8).
5.  **Booking Summary/Payment:** You click "Proceed". A summary appears: "Action Movie X, City Multiplex, 5:00 PM, Seats G7, G8, Total Price: ₹700". You click "Pay Now". A mock payment form appears (no real card details needed). You click "Confirm Payment".
6.  **Confirmation Page:** A success message appears: "Booking Confirmed! Your ticket details are..."
7.  **Ticket Page:** You might navigate to a separate "My Bookings" or "Ticket" page to see the details of your confirmed booking anytime later.

## Database Schema (Technical Detail)
-   Managed using `Knex.js` migrations located in `server/migrations/`.
-   Key Tables:
    -   `movies`: Stores movie information (title, description, genre, duration, poster URL, etc.).
    -   `theaters`: Stores theater information (name, location).
    -   `screens`: Stores details about individual screens within a theater (screen number, seating capacity - though capacity isn't explicitly modeled via seats table yet).
    -   `shows`: Links movies, screens, and theaters for specific showtimes. Includes `show_time` and `base_seat_price`.
    -   `bookings`: Stores information about completed bookings (user ID - if implemented, show ID, selected seats, booking time, total amount).
    -   *(Seat details per booking might be stored as text/JSON in `bookings` or require a separate `booked_seats` table for more complex queries)*.

## Database Population (Technical Detail)
-   Initial data for `theaters`, `screens`, and `shows` was added using scripts (`scripts/populate_supporting_tables.js`).
-   Movie data was potentially fetched using `scripts/fetch_tmdb_movies.js`.
-   Data includes theaters in Bangalore, assumed screen counts, and representative base seat prices.
-   Show timings were generated to cover different times of the day.
-   Seat prices for shows were adjusted based on time and theater type.

## API Endpoints (Backend Communication Points)
The backend server provides these communication points for the frontend:
-   `GET /api/movies`: Fetches the list of all available movies.
-   `GET /api/movies/:id`: Fetches detailed information for a single movie specified by its ID.
-   `GET /api/theaters/:movieId`: Fetches the list of theaters showing a specific movie.
-   `GET /api/shows/:movieId/:theaterId`: Fetches the available showtimes for a specific movie at a specific theater.
-   `GET /api/seats/:showId`: Fetches the seat layout and availability for a specific show.
-   `POST /api/bookings`: Creates a new booking record in the database based on user selections.
-   `GET /api/booking/:bookingId`: Fetches details of a specific past booking.
*(Note: Authentication for fetching user-specific bookings (`/api/bookings/:userId`) might not be implemented yet)*.

## Key Decisions (Developer Notes)
*(This section is for developers to note important choices made during development)*
-   Using Docker Compose simplifies the development setup significantly.
-   Knex.js provides a structured way to manage database changes.
-   React Context API is used for managing booking state across components.

## Learnings (Developer Notes)
*(This section is for developers to note things learned)*
-   Integrating frontend state management with backend API calls.
-   Designing a relational database schema for a booking system.
-   Setting up a multi-service application using Docker Compose.

## TODOs (Future Work)
-   [ ] Implement user authentication (login/signup).
-   [ ] Connect `GET /api/bookings/:userId` endpoint to fetch bookings for the logged-in user.
-   [ ] Implement actual seat booking logic (preventing double booking).
-   [ ] Refine the UI/UX based on feedback.
-   [ ] Add error handling and loading states more robustly.
-   [ ] Write unit and integration tests.
-   [x] Connect backend API (server.js) to the PostgreSQL database.
-   [x] Update API endpoints to fetch/save data from/to the database.
-   [x] Populate database with initial sample data.
