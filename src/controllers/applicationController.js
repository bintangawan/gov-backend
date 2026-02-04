const db = require('../config/database');

// ------------------------------------------
// FITUR WARGA (CITIZEN)
// ------------------------------------------

// 1. Ajukan Permohonan Baru
exports.applyService = async (req, res) => {
    const { service_id, notes } = req.body;
    const user_id = req.user.id; // Dari token

    if (!service_id) return res.status(400).json({ message: "Service ID wajib diisi" });

    try {
        await db.execute(
            'INSERT INTO applications (user_id, service_id, notes) VALUES (?, ?, ?)',
            [user_id, service_id, notes]
        );
        res.status(201).json({ message: "Permohonan berhasil dikirim. Tunggu konfirmasi Admin." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengajukan permohonan" });
    }
};

// 2. Lihat Riwayat Permohonan Saya (Dashboard Warga)
exports.getMyApplications = async (req, res) => {
    const user_id = req.user.id;

    try {
        const query = `
            SELECT a.*, s.service_name, s.category 
            FROM applications a
            JOIN services s ON a.service_id = s.id
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
        `;
        const [rows] = await db.execute(query, [user_id]);
        res.json({ data: rows });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data permohonan" });
    }
};

// ------------------------------------------
// FITUR ADMIN
// ------------------------------------------

// 3. Lihat Semua Permohonan Masuk (Dashboard Admin)
exports.getAllApplications = async (req, res) => {
    try {
        const query = `
            SELECT a.*, s.service_name, u.full_name as applicant_name, u.email
            FROM applications a
            JOIN services s ON a.service_id = s.id
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `;
        const [rows] = await db.execute(query);
        res.json({ data: rows });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data" });
    }
};

// 4. Update Status (ACC / Tolak)
exports.updateApplicationStatus = async (req, res) => {
    const { id } = req.params; // ID Application
    const { status, admin_feedback } = req.body; // 'approved' atau 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: "Status tidak valid" });
    }

    try {
        await db.execute(
            'UPDATE applications SET status = ?, admin_feedback = ? WHERE id = ?',
            [status, admin_feedback || '', id]
        );
        res.json({ message: `Permohonan berhasil diubah menjadi ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Gagal update status" });
    }
};