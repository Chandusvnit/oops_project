import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './utils/error.js';
import authRouter from './routes/auth.routes.js';
import complaintRouter from './routes/complaint.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static for uploaded files (adjust path if needed)
app.use('/uploads', express.static('uploads'));

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Routers
app.use('/api/auth', authRouter);
app.use('/api/complaints', complaintRouter);

// Centralized error handler
app.use(errorHandler);

export default app;

// TODO: mount routers next
// import authRouter from './routes/auth.routes.js';
// import complaintRouter from './routes/complaint.routes.js';
// app.use('/api/auth', authRouter);
// app.use('/api/complaints', complaintRouter);
