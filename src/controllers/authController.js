const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Fungsi Generate Token JWT (Tiket Masuk Aplikasi)
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token berlaku 1 hari
    );
};

// 1. REGISTER MANUAL (Nama, Email, Password)
exports.registerManual = async (req, res) => {
    const { full_name, email, password } = req.body;

    // Validasi input sederhana
    if (!full_name || !email || !password) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    try {
        // Cek apakah email sudah ada
        const [existingUser] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar!' });
        }

        // Enkripsi Password (Hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke Database
        await db.execute(
            'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
            [full_name, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registrasi berhasil. Silakan login.' });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// 2. LOGIN MANUAL (Email, Password)
exports.loginManual = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cari user berdasarkan email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'Email tidak ditemukan' });
        }

        const user = users[0];

        // Cek jika user ini user Google (tidak punya password manual)
        if (!user.password) {
            return res.status(400).json({ message: 'Akun ini terdaftar via Google. Silakan login menggunakan tombol Google.' });
        }

        // Cek kecocokan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        // Login sukses, beri Token
        const token = generateToken(user);

        res.json({
            message: 'Login Berhasil',
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
                avatar: user.avatar_url
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// 3. LOGIN GOOGLE (Dipanggil setelah middleware validasi token Google)
exports.googleAuth = async (req, res) => {
    // Data user didapat dari middleware authMiddleware.verifyGoogleTokenRaw
    const { google_id, email, name, picture } = req.user; 

    try {
        let user;
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            // Skenario A: User Baru -> Register Otomatis
            await db.execute(
                'INSERT INTO users (google_id, email, full_name, avatar_url) VALUES (?, ?, ?, ?)',
                [google_id, email, name, picture]
            );
            // Ambil data yang baru dibuat
            const [newUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            user = newUser[0];
        } else {
            // Skenario B: User Lama -> Update data Google ID (Link Account)
            user = rows[0];
            if (!user.google_id || user.avatar_url !== picture) {
                await db.execute(
                    'UPDATE users SET google_id = ?, avatar_url = ? WHERE email = ?',
                    [google_id, picture, email]
                );
            }
        }

        // Beri Token JWT Aplikasi kita
        const token = generateToken(user);

        res.json({
            message: 'Login Google Berhasil',
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
                avatar: user.avatar_url // Pakai foto dari Google
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: 'Database Error saat Login Google' });
    }
};