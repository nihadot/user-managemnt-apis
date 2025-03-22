import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import userAgent from 'express-useragent';
import routes from '@presentation/routes/v1/index';
import errorHandler from '@presentation/middlewares/errorHandler';

const app: Express = express();

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  app.use(helmet()); // Secure HTTP headers
  // app.use(
  //   cors({
  //     origin: process.env.CLIENT_URL, // Allow only specified domains in production
  //     credentials: true,
  //   })
  // );

  app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174","https://ai-updations-user.vercel.app","https://ai-updations-user.vercel.app/","https://ai-updations-dashboard-91b5.vercel.app/","https://ai-updations-dashboard-91b5.vercel.app"] ,// Adjust based on frontend URL
      credentials: true, // ✅ Required for cookies
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
  }));

} else {
  app.use(cors({ origin: '*', credentials: true }));
}

/** 
 * ✅ Common Middlewares 
 */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** 
 * ✅ Logging & User-Agent Middleware (Enable logging only in Development)
 */
if (!isProduction) {
  app.use(morgan('dev')); // Detailed logs for debugging
}
app.use(userAgent.express());

/** 
 * ✅ Rate Limiting Middleware (Enable only in Production)
 */
if (isProduction) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.',
  });
  app.use(limiter);
}

/** 
 * ✅ API Routes
 */
app.use('/api/v1', routes);

/** 
 * ✅ Error Handling Middleware
 */
app.use(errorHandler);

export default app;
