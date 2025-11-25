// Helper untuk standarisasi respons API.
const { StatusCodes } = require("http-status-codes");

const responseHelper = {
  // Format respons sukses.
  success: (res, data, message = "Success", code = StatusCodes.OK) => {
    return res.status(code).json({
      success: true,
      message,
      data,
    });
  },

  // Format respons error.
  error: (
    res,
    message = "Internal Server Error",
    code = StatusCodes.INTERNAL_SERVER_ERROR,
    errorDetails = null
  ) => {
    return res.status(code).json({
      success: false,
      message,
      error: errorDetails,
    });
  },
};
module.exports = responseHelper;
