import express from 'express';
import cors from 'cors';
import "dotenv/config";

import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js';
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // For parsing JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // For parsing URL-encoded bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Connect to database
connectDB();

// Start cron job
job.start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});