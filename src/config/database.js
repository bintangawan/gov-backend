const mysql = require('mysql2');
require('dotenv').config();

// Buat Connection Pool agar performa tinggi saat banyak user akses
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maksimal koneksi sekaligus
    queueLimit: 0
});

// Menggunakan promise wrapper agar bisa pakai async/await di controller
module.exports = pool.promise();