export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  if (err.name === "MulterError") {
    statusCode = 400;
  }

  if (message === "Only image files are allowed") {
    statusCode = 400;
  }

  res.status(statusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
