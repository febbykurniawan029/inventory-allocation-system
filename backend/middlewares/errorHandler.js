// Middleware global untuk penanganan error.
const { StatusCodes } = require("http-status-codes");
const responseHelper = require("../utils/responseHelper");

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Default error.
  if (!statusCode) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  // Handle error validasi Sequelize.
  if (err.name === "SequelizeValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.errors.map((e) => e.message).join(", ");
  }

  // Log error server (500).
  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    console.error("ERROR:", err);
  }

  // Kirim stack trace hanya di environment development.
  const errorStack = process.env.NODE_ENV === "development" ? err.stack : null;
  return responseHelper.error(res, message, statusCode, errorStack);
};

module.exports = errorHandler;
