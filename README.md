# Wesley High School Management System

This repository contains the source code for the Wesley High School Management System, consisting of a Spring Boot backend and a Next.js frontend.

## Project Structure

- `backend/`: Java Spring Boot application with MongoDB.
- `frontend/`: Next.js application with Tailwind CSS (App Router).

## Getting Started

### Backend (Spring Boot)

1. Ensure you have Java 17+ and Maven installed.
2. Ensure you have a local MongoDB instance running on default port `27017` (no auth required for local dev).
3. Navigate to the `backend/` directory.
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend (Next.js)

1. Ensure you have Node.js 18+ installed.
2. Navigate to the `frontend/` directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture

- **Backend**: Layered architecture (Controller, Service, Repository) using Spring Data MongoDB.
- **Frontend**: Feature-based React component structure utilizing modern App Router features.
- **Database**: MongoDB (NoSQL) for document-based, flexible data storage.
