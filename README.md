# BookMyShow Clone

Welcome to the BookMyShow Clone project! This application replicates the core functionalities of BookMyShow, allowing users to browse movies, select seats, book tickets, and view their bookings. This guide provides detailed instructions to help you set up and run the project locally.

## Features

- **Movie Listings**: Browse a list of currently playing movies with details like title, genre, rating, duration, and available showtimes.
- **Theater Information**: View theaters showing selected movies.
- **Interactive Seat Selection**: Choose your preferred seats using a visual seat map for the selected showtime and screen.
- **Booking Process**: Step-by-step booking flow, including ticket summary and mock payment.
- **Booking Management**: View details of your confirmed bookings.
- **Responsive Design**: Optimized for viewing on desktop, tablet, and mobile devices.

## Technologies Used

- **Frontend**:
    - React.js (v18+)
    - Tailwind CSS (for styling)
    - Vite (for frontend tooling and development server)
- **Backend**:
    - Node.js (v18+)
    - Express.js (web framework)
- **Database**:
    - PostgreSQL (relational database)
    - Knex.js (SQL query builder and migrations)
- **Containerization**:
    - Docker & Docker Compose (for creating and managing development environment containers)

## Project Structure

```
bookmyshow-clone/
├── .gitignore          # Specifies intentionally untracked files that Git should ignore
├── docker-compose.yml  # Docker Compose configuration for services (app, db)
├── index.html          # Main HTML entry point for Vite
├── package.json        # Frontend dependencies and scripts
├── package-lock.json   # Exact versions for frontend dependencies
├── postcss.config.js   # PostCSS configuration
├── README.md           # This file
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite configuration
├── data/               # Potentially for storing data files (if any, currently empty)
├── memory-bank/        # Contains memory bank files for AI context (if used)
├── public/             # Static assets served directly (icons, logos, etc.)
├── scripts/            # Helper scripts (e.g., database population)
│   ├── fetch_tmdb_movies.js
│   └── populate_supporting_tables.js
├── server/             # Backend Node.js/Express server
│   ├── migrations/     # Knex database migration files
│   ├── package.json    # Backend dependencies and scripts
│   ├── package-lock.json # Exact versions for backend dependencies
│   └── server.js       # Main backend server entry point
└── src/                # Frontend React application source code
    ├── App.jsx         # Main application component with routing
    ├── index.css       # Global CSS styles (including Tailwind imports)
    ├── index.jsx       # Frontend entry point (renders App component)
    ├── components/     # Reusable UI components
    ├── context/        # React Context API providers (e.g., BookingContext)
    ├── data/           # Static frontend data (if any)
    └── pages/          # Page-level components (Home, Movie, Show, etc.)
```

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Git**: For cloning the repository. ([Download Git](https://git-scm.com/downloads))
2.  **Node.js**: JavaScript runtime (v18 or later recommended). This includes `npm` (Node Package Manager). ([Download Node.js](https://nodejs.org/))
3.  **Docker**: For running the application and database in containers. ([Download Docker](https://www.docker.com/products/docker-desktop/))
    *   Ensure Docker Desktop is running before proceeding with the setup.

## Setup and Installation Guide

Follow these steps carefully to get the project running on your local machine:

**Step 1: Clone the Repository**

Open your terminal or command prompt and run the following command to clone the project files:

```bash
git clone https://github.com/yourusername/bookmyshow-clone.git
cd bookmyshow-clone
```
*(Replace `https://github.com/yourusername/bookmyshow-clone.git` with the actual repository URL if it's different)*

**Step 2: Install Frontend Dependencies**

Navigate to the project's root directory (if you aren't already there) and install the necessary Node.js packages for the React frontend:

```bash
# Make sure you are in the 'bookmyshow-clone' directory
npm install
```
This command reads the `package.json` file in the root directory and downloads the required libraries into the `node_modules` folder.

**Step 3: Install Backend Dependencies**

Navigate to the `server` directory and install the dependencies for the Node.js backend:

```bash
cd server
npm install
cd ..
```
This installs packages like Express, Knex, and the PostgreSQL driver, defined in `server/package.json`.

**Step 4: Configure Environment Variables (If Applicable)**

*Currently, this project might not require a separate `.env` file as database connections are configured within `docker-compose.yml` and potentially hardcoded for development in `server/server.js` or Knex config. If environment variables become necessary (e.g., for API keys, database credentials in production), create a `.env` file in the `server` directory and add the required variables.*

**Step 5: Build and Start Docker Containers**

This is the core step to get the application and database running. Make sure Docker Desktop is running on your machine. Then, from the project's root directory (`bookmyshow-clone`), run:

```bash
docker-compose up --build
```

*   `docker-compose up`: This command reads the `docker-compose.yml` file and starts the services defined within it (typically the backend server and the PostgreSQL database).
*   `--build`: This flag tells Docker Compose to build the images before starting the containers. This is important if you've made changes to the Dockerfile or related code.

You will see logs from both the backend server and the database starting up in your terminal.

**Step 6: Run Database Migrations**

Once the containers are running (especially the database container), you need to set up the database schema. Open a *new* terminal window/tab, navigate to the project's root directory, and run the following Docker Compose command to execute the Knex migrations inside the running backend container:

```bash
docker-compose exec server npm run migrate
```

*   `docker-compose exec server`: Executes a command inside the running container named `server`.
*   `npm run migrate`: Runs the `migrate` script defined in `server/package.json`, which typically executes `knex migrate:latest`. This applies all pending migration files located in `server/migrations/`.

**Step 7: Seed the Database (Optional but Recommended)**

To populate the database with initial data (like movies, theaters, screens), run the seeding scripts. Execute these commands one by one from the project's root directory in your *second* terminal:

```bash
# Populate movies (might use fetch_tmdb_movies.js logic internally or similar)
docker-compose exec server node scripts/fetch_tmdb_movies.js

# Populate theaters, screens, shows
docker-compose exec server node scripts/populate_supporting_tables.js
```
*(Note: The exact seeding commands might differ based on how the scripts in `server/package.json` are configured. Check the `scripts` section there if these commands don't work.)*

**Step 8: Access the Application**

Once the containers are running and the database is set up, you can access the frontend application in your web browser:

*   **URL**: [http://localhost:5173](http://localhost:5173) (or the port specified by Vite in the `docker-compose up` logs)

The backend API will be accessible usually via the frontend's proxy or directly if needed (check `vite.config.js` and `server/server.js` for port details, often `http://localhost:3000`).

## Stopping the Application

To stop the running Docker containers:

1.  Go back to the terminal where `docker-compose up` is running.
2.  Press `Ctrl + C`.
3.  You can optionally run `docker-compose down` to remove the containers and network. Add the `-v` flag (`docker-compose down -v`) if you also want to remove the database volume (this deletes all database data).

## Troubleshooting

*   **Port Conflicts**: If you get errors about ports already being in use (e.g., 5173 or 5432), ensure no other applications are using these ports or change the port mappings in `docker-compose.yml`.
*   **Docker Not Running**: Make sure Docker Desktop is running before executing `docker-compose` commands.
*   **Database Connection Errors**: Double-check the database service name, username, password, and database name used in `server/server.js` or your Knex configuration file match those defined in `docker-compose.yml`. Ensure the database container started successfully.
*   **Migration/Seeding Errors**: Check the logs in the terminal where you ran the `docker-compose exec` commands for specific error messages. Ensure the database container is running and accessible.

## API Endpoints (Example)

The backend server provides API endpoints that the frontend consumes.

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get details for a specific movie
- `GET /api/theaters/:movieId` - Get theaters showing a specific movie

### Shows & Screens
- `GET /api/shows/:movieId/:theaterId` - Get showtimes for a movie in a specific theater
- `GET /api/seats/:showId` - Get seat availability for a specific show

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:userId` - Get bookings for a specific user (requires authentication implementation)
- `GET /api/booking/:bookingId` - Get details for a specific booking

*(Note: These are examples. Refer to `server/server.js` or relevant route files for the actual implemented endpoints.)*

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project repository.
2.  Create a new branch for your feature (`git checkout -b feature/YourAmazingFeature`).
3.  Make your changes and commit them (`git commit -m 'Add YourAmazingFeature'`).
4.  Push your changes to your forked repository (`git push origin feature/YourAmazingFeature`).
5.  Open a Pull Request back to the main project repository.

## License

Distributed under the MIT License. See `LICENSE` file for more information (if one exists).
