const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware 1: Verifikasi Token Google (Hanya dipakai di Route /auth/google)
// Tugas: Memastikan token yang dikirim frontend benar-benar dari Google Server
exports.verifyGoogleTokenRaw = async (req, res, next) => {
    const { googleToken } = req.body;

    if (!googleToken) {
        return res.status(400).json({ message: "Token Google diperlukan" });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        
        // Simpan data user Google ke request untuk dipakai di Controller
        req.user = {
            google_id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
        
        next();
    } catch (error) {
        console.error("Google Token Invalid:", error.message);
        return res.status(401).json({ message: "Token Google tidak valid" });
    }
};

// Middleware 2: Verifikasi JWT Aplikasi (Dipakai di Route /services)
// Tugas: Melindungi halaman dashboard agar hanya user login yang bisa akses
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Format header harus: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Akses Ditolak. Silakan Login.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Dekode Token menggunakan Kunci Rahasia (.env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Simpan data user (id, role, email) ke request
        req.user = decoded; 
        
        next(); // Lanjut ke controller
    } catch (error) {
        return res.status(403).json({ message: 'Sesi habis atau token tidak valid.' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    // Req.user didapat dari verifyToken sebelumnya
    if (req.user && req.user.role === 'admin') {
        next(); // Boleh lewat
    } else {
        res.status(403).json({ message: "Akses Ditolak. Halaman ini khusus Admin." });
    }
};