export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function errorHandler(err, req, res, next) {
  // Basic error shape
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  // Optional: include stack in development
  const response = { error: message };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(status).json(response);
}