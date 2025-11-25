# Inventory Allocation System - Frontend

This is the frontend web application for the Inventory Allocation System, built with Next.js and React. It provides a user interface to view inventory, create purchase requests, and interact with the backend API.

## 🚀 Getting Started

Follow these instructions to get the frontend service up and running on your local machine for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose (for the recommended setup)
-   A code editor like [Visual Studio Code](https://code.visualstudio.com/)

### Setup and Installation

1.  **Clone the Repository**
    If you haven't already, clone the project to your local machine.

2.  **Configure Environment Variables**
    Navigate to the `frontend` directory. Create a `.env.local` file by copying the example file:
    ```bash
    copy .env.local.example .env.local
    ```
    Next, open the newly created `.env.local` file and ensure the `NEXT_PUBLIC_API_URL` points to your running backend service.

### Running the Application

You can run the application in two ways:

#### 1. With Docker Compose (Recommended)

From the **root directory** of the project, run the following command. This will start the frontend, backend, and database services together.
```bash
docker-compose up --build
```
The application will be available at `http://localhost:3001` (or the frontend port specified in the root `.env` file).

#### 2. Running Locally for Development

This setup is ideal for frontend development with hot-reloading. It requires the backend API and database to be running first.

**Prerequisites:**
Before starting the frontend, ensure the database and backend are running. You can follow the **[Backend Development Guide](./../backend/README.md#running-locally-for-development)** to get them started.

**Setup and Run:**
1.  **Configure Environment File**: In the `frontend` directory, create your `.env.local` file. Ensure `NEXT_PUBLIC_API_URL` points to your locally running backend (e.g., `http://localhost:3000/api/v1`).
    ```bash
    copy .env.local.example .env.local
    ```
2.  **Install & Run**:
    ```bash
    # Install dependencies
    npm install

    # Run the development server
    npm run dev
    ```
The application will be available at `http://localhost:3001`.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Library**: [React](https://react.dev/)
-   **Styling**: [PostCSS](https://postcss.org/) & CSS Modules (implied by `postcss.config.mjs` and `globals.css`)
-   **Containerization**: [Docker](https://www.docker.com/)

## 📁 Project Structure

The project uses the Next.js App Router structure.

```
.
├── src/
│   ├── app/                # Main application pages and layouts
│   │   ├── create/         # Page for creating new entries
│   │   └── edit/[id]/      # Dynamic page for editing entries
│   ├── components/         # Reusable React components (Navbar, etc.)
│   └── services/           # API communication layer (api.js)
├── public/                 # Static assets
├── .env.local.example      # Environment variable template
├── Dockerfile              # Docker configuration for the frontend
└── package.json            # Project dependencies and scripts
```

## ⚙️ Environment Variables

The following environment variables are required in your `frontend/.env.local` file:

-   `NEXT_PUBLIC_API_URL`: The base URL for the backend API (e.g., `http://localhost:3000/api/v1`).
