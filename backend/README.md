# Inventory Allocation System - Backend API

This is the backend service for the Inventory Allocation System, a robust API built with Node.js, Express, and Sequelize. It handles business logic, data persistence, and communication with a third-party vendor service.

## 🚀 Getting Started

This guide covers two main scenarios: running the entire application via Docker or running only the backend service locally for development.

### 1. Running the Full Stack with Docker Compose

This is the recommended method for running the complete application. All instructions for this method are in the **[root README.md file](../README.md)**. This ensures that the frontend, backend, and database are all launched together correctly.

### 2. Running Locally for Development

This setup is ideal if you are actively developing the backend. It runs the backend service on your local machine with hot-reloading, while still connecting to the PostgreSQL database running in Docker.

**Step 1: Start the Database**
From the **root directory** of the project, start only the database container. It is crucial to run this command from the main project folder, not from within the `backend` directory.
```bash
# Ensure you are in the project's root directory
docker compose up -d db
```
This command starts the PostgreSQL service in the background (`-d` flag).

**Step 2: Configure Environment Variables**
Navigate to the `backend` directory. Create a `.env` file from the example:
```bash
copy .env.example .env
```
Open the `.env` file and ensure the database variables are set to connect to the Docker container from your local machine:
- `DB_HOST` should be `127.0.0.1` or `localhost`.
- `DB_PORT` should be `5433` (this is the port mapped to your host machine in `docker-compose.yml`).
Fill in the vendor API keys as well.

**Step 3: Install Dependencies and Run**
In the `backend` directory, run the following commands:
```bash
# Install dependencies
npm install

# Start the server with hot-reloading
npm run dev
```
The backend API will now be running on `http://localhost:3000` and will automatically restart when you save file changes.

## 🛠️ Tech Stack

-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Sequelize](https://sequelize.org/)
-   **Containerization**: [Docker](https://www.docker.com/)

## 📝 API Endpoints

The API is versioned and structured into two main contexts:

-   `GET /`: Health check endpoint.

**Core API (`/api/v1`)**
-   `GET /api/v1/products`: Retrieves a list of all products.
-   `GET /api/v1/stocks`: Retrieves a list of current stock levels.
-   `POST /api/v1/purchase-requests`: Creates a new purchase request.

**Webhook Handler**
-   `POST /webhook/v1`: Listens for and processes incoming webhook notifications from the vendor.

For detailed endpoint specifications, please refer to the files within the `backend/routes/` directory.

## ⚙️ Environment Variables

The following environment variables are required in your `backend/.env` file:

-   `PORT`: The port the application will run on (e.g., `3000`).
-   `DB_USERNAME`: Database user.
-   `DB_PASSWORD`: Database password.
-   `DB_NAME`: Database name.
-   `DB_HOST`: Database host service name (e.g., `db` when using Docker).
-   `DB_DIALECT`: The SQL dialect (e.g., `postgres`).
-   `VENDOR_API_URL`: The base URL for the third-party vendor API.
-   `VENDOR_SECRET_KEY`: The secret key for authenticating with the vendor API.