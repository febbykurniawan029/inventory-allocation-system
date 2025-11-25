# Inventory Allocation System

This is a full-stack inventory management application designed to handle products, track stock, and process purchase requests. The system is composed of a [Next.js frontend](./frontend/README.md) and a [Node.js backend API](./backend/README.md).

## 🚀 Quick Start

The entire application is containerized and can be launched with a single command using Docker Compose.

### Prerequisites

-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### Running the Full Stack

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd inventory-allocation-system
    ```

2.  **Configure Environment Variables**
    This project requires configuration at both the root level (for Docker Compose) and within each service.
    
    -   **Root**: Create a `.env` file from the example:
        ```bash
        # In the root directory
        copy .env.example .env
        ```
        This file contains ports and other top-level settings for Docker Compose.
        
    -   **Backend**: Create a backend-specific `.env` file:
        ```bash
        # In the backend directory
        cd backend
        copy .env.example .env
        ```
        Fill in your database credentials and vendor API keys here.
        
    -   **Frontend**: Create a frontend-specific `.env.local` file:
        ```bash
        # In the frontend directory
        cd ../frontend
        copy .env.local.example .env.local
        ```
        Ensure `NEXT_PUBLIC_API_URL` points to the backend service.

3.  **Launch the Application**
    From the **root directory** of the project, run:
    ```bash
    docker compose up -d --build
    ```
    This command will build the images (if they don't exist), then start and run all services in the background (`-d` flag for detached mode).

    -   **Frontend** will be available at `http://localhost:3001`
    -   **Backend API** will be available at `http://localhost:3000`

## 👨‍💻 Local Development

If you need to work on a specific service (e.g., developing a new feature on the backend with hot-reloading), you can run the services individually. This setup still uses Docker to run dependencies like the database.

For detailed instructions, please refer to the development guides in each service's documentation:
-   **[Backend Development Guide](./backend/README.md#running-locally-for-development)**
-   **[Frontend Development Guide](./frontend/README.md#running-the-application)**

## 🛠️ Tech Stack

| Area              | Technology                                                 |
| ----------------- | ---------------------------------------------------------- |
| **Frontend**      | [Next.js](https://nextjs.org/), [React](https://react.dev/) |
| **Backend**       | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database**      | [PostgreSQL](https://www.postgresql.org/), [Sequelize](https://sequelize.org/) ORM |
| **Containerization** | [Docker](https://www.docker.com/), Docker Compose          |


## 📁 Project Structure

```
.
├── backend/            # Contains the Node.js backend service
│   └── README.md       # Backend-specific documentation
├── frontend/           # Contains the Next.js frontend application
│   └── README.md       # Frontend-specific documentation
├── .env.example        # Docker Compose environment variables template
├── docker-compose.yml  # Defines and orchestrates all services
└── README.md           # This file
```

## 📚 Detailed Documentation

For more detailed information about the setup, API endpoints, and project structure of each service, please refer to their individual README files:

-   **[Backend Documentation](./backend/README.md)**
-   **[Frontend Documentation](./frontend/README.md)**