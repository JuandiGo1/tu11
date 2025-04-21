import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import salasRoutes from './routes/salas.routes.js';
import socketHandler from './socket.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());

connectDB();

// Rutas
app.use('/api/salas', salasRoutes);

// Socket.io
socketHandler(io);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
