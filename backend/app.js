// Entry point aplikasi backend.

// Memuat environment variables.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");

// Import modul lokal.
const apiRoutesV1 = require("./routes/api/v1");
const webhookRoutesV1 = require("./routes/webhook/v1/webhook.routes");
const errorHandler = require("./middlewares/errorHandler");
const ApiError = require("./utils/apiError");
const { StatusCodes } = require("http-status-codes");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
// Mengizinkan Cross-Origin Resource Sharing (CORS).
app.use(cors());
// Logger untuk request HTTP.
app.use(morgan("dev"));
// Parser untuk body JSON.
app.use(express.json());
// Parser untuk form data.
app.use(express.urlencoded({ extended: true }));

// --- Health Check Endpoint ---
// Endpoint untuk monitoring status API.
app.get("/", async (req, res) => {
  try {
    // Verifikasi koneksi database.
    await sequelize.authenticate();
    // Respons jika sistem sehat.
    res.status(200).json({
      status: "UP",
      message: "Inventory System API is running and healthy",
      timestamp: new Date().toISOString(),
      database: "Connected",
      version: "1.0.0",
    });
  } catch (error) {
    // Respons jika koneksi database gagal.
    res.status(503).json({
      status: "DOWN",
      message: "Connection failed",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// --- Routes ---
// Main router untuk API v1.
app.use("/api/v1", apiRoutesV1);
app.use("/webhook/v1", webhookRoutesV1);

// --- Error Handling ---
// Menangani route yang tidak ditemukan (404).
app.use((req, res, next) => {
  next(new ApiError("Not found", StatusCodes.NOT_FOUND));
});

// Middleware global untuk menangani semua error.
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    // Cek koneksi DB saat server mulai.
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
});
