# Memory Bank

This file is for storing notes, ideas, and important information related to the project.

## Project Overview

**Features:**
- Displaying a list of movies (Home page)
- Viewing movie details (Movie page)
- Selecting show times and theaters (Show page)
- Selecting seats (Show page)
- Handling payment (Payment page)
- Displaying booking confirmation (Confirmation page)
- Displaying ticket details (Ticket page)

**Technologies Used:**
- React
- Tailwind CSS (likely)
- Context API for state management
- Node.js (Backend)
- PostgreSQL (Database)
- `node-pg-migrate` (DB Migrations)
- `pg` (Node.js PostgreSQL client)

**API Endpoints:**
- (Currently using local data from `src/data/`. Backend `server.js` has basic setup but no movie/show/booking endpoints yet.)

## Database Schema
- Used `node-pg-migrate` for managing schema changes.
- Schema includes tables: `movies`, `theaters`, `screens`, `shows`, `bookings`.
- `shows` table includes: `show_id`, `movie_id`, `screen_id`, `theater_id`, `show_time`, `base_seat_price`.

## Database Population
- Populated the `theaters` and `screens` tables with data for top multiplexes and single-screen theaters in Bangalore.
- Assumed screen counts for multiplexes (mostly 5 screens) and used available information for single screens (Urvashi Cinema and Mukunda Theater have 1 screen).
- Set initial `base_seat_price` for screens (representative prices: 350 for multiplex screens, 200 for single screens).
- Populated the `shows` table with shows for each screen, ensuring at least one morning, afternoon, evening, and night show.
- Randomly assigned movies from the `movies` table to shows.
- Updated the `base_seat_price` for shows based on show time categories and theater types using provided pricing ranges.
- Used `serper-search-mcp`, `fetch-mcp`, and `execute_command` (psql) tools for this task.

## Key Decisions

## Learnings

## TODOs
- [x] Execute sample data SQL to populate the `theaters`, `screens`, and `shows` tables.
- [x] Execute sample data SQL to populate the remaining tables (`movies`, `bookings`).
- [x] Connect backend API (server.js) to the PostgreSQL database using the `pg` library.
- Update API endpoints to fetch/save data from/to the database instead of local files.
