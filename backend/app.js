import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

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

// TODO: mount routers next
// import authRouter from './routes/auth.routes.js';
// import complaintRouter from './routes/complaint.routes.js';
// app.use('/api/auth', authRouter);
// app.use('/api/complaints', complaintRouter);

export default app;