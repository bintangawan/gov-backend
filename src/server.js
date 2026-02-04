const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import Routes
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARES GLOBAL ===
app.use(helmet()); // Keamanan HTTP Headers
app.use(cors());   // Mengizinkan akses dari Frontend (React Vite)
app.use(express.json()); // Parsing body JSON
app.use(morgan('dev'));  // Logging request ke console

// === ROUTES ===
// Semua API akan diawali dengan /api
// Contoh: http://localhost:5000/api/auth/login
app.use('/api', apiRoutes);

// Route Pengecekan Server
app.get('/', (req, res) => {
    res.send({
        message: 'Server Sistem Layanan Pemerintah Ready!',
        time: new Date()
    });
});

// Handling 404 (Route tidak ditemukan)
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Handling 500 (Error Server Global)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Terjadi kesalahan internal server' });
});

// === START SERVER ===
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});