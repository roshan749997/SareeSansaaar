import { configDotenv } from 'dotenv';
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import headerRoutes from './routes/header.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import addressRoutes from './routes/address.routes.js';

import connectDB from './config/DataBaseConnection.js';
import productRouter from './routes/product.routes.js';

configDotenv();

const server = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://localhost:5173' // Add support for port 5173
];

server.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
server.use(express.json());
server.use(cookieParser());

server.get('/api/health', (req, res) => res.json({ ok: true }));
server.use('/api/auth', authRoutes);
server.use('/api/header', headerRoutes);
server.use('/api',productRouter);
server.use('/api/cart', cartRoutes);
server.use('/api/address', addressRoutes);

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGODB_URI || '');

server.listen(PORT, () => {
  console.log('Server is running at', PORT);
});