
import { Request, Response, NextFunction } from 'express';

// Custom Error Interface
interface CustomError extends Error {
  status?: number;
}

// Global Error Handler Middleware
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
