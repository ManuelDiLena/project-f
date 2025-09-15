import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { verifyToken } from './middlewares/auth.js';
import { requireRole } from './middlewares/roles.js';
import { db } from './config/firestore.js';
import profileRoutes from './routes/profileRoutes.js';
import teamsRoutes from './routes/teamsRoutes.js';
import fieldsRoutes from './routes/fieldsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Protected route test
app.get('/api/v1/private', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}` });
});

// Futbol field admin route test
app.get('/api/v1/fields/admin', verifyToken, requireRole('adminField'), (req, res) => {
  res.json({ message: 'Only field admins can see this' });
});

// Placeholer API v1
app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'API ready 🚀' });
});

app.use('/api/v1', profileRoutes);
app.use('/api/v1', teamsRoutes);
app.use('/api/v1', fieldsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});