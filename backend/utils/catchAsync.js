// Wrapper untuk menangani error di controller asynchronous.
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
module.exports = catchAsync;
