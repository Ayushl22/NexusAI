const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  const isAIServiceError = err.name === 'AIServiceError';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File is too large for this deployment';
    statusCode = 413;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  if (isAIServiceError) {
    console.error('AI request failed:', {
      code: err.code,
      statusCode,
      retryable: err.retryable,
      causeStatus: err.cause?.status || err.cause?.statusCode || null,
    });
  } else {
    console.error('Request failed:', err);
  }

  const response = {
    success: false,
    message,
  };

  if (isAIServiceError) {
    response.code = err.code;
    response.retryable = err.retryable;
    if (err.retryable) {
      res.set('Retry-After', '5');
    }
  } else if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
