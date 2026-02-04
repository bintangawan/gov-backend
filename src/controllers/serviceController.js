const db = require('../config/database');

// READ (GET) - Ambil Semua Layanan (Tanpa Limit, agar Frontend bisa search real-time)
exports.getAllServices = async (req, res) => {
    try {
        const query = `
            SELECT s.*, u.full_name as creator_name 
            FROM services s 
            LEFT JOIN users u ON s.created_by = u.id 
            ORDER BY s.created_at DESC
        `;
        const [rows] = await db.execute(query);
        
        // Kita kirim semua data array ke frontend
        res.json({ 
            message: "Berhasil mengambil data",
            data: rows 
        });
    } catch (error) {
        console.error("Get Services Error:", error);
        res.status(500).json({ message: 'Gagal mengambil data layanan' });
    }
};

// READ (GET) - Ambil Satu Layanan by ID
exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        res.json({ data: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// CREATE (POST)
exports.createService = async (req, res) => {
    const { service_name, description, category, status } = req.body;
    const userId = req.user.id; 

    if (!service_name || !category) {
        return res.status(400).json({ message: 'Nama Layanan dan Kategori wajib diisi' });
    }

    try {
        const query = `
            INSERT INTO services (service_name, description, category, status, created_by)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.execute(query, [service_name, description, category, status || 'active', userId]);
        
        res.status(201).json({ message: 'Layanan berhasil ditambahkan' });
    } catch (error) {
        console.error("Create Service Error:", error);
        res.status(500).json({ message: 'Gagal menambah layanan' });
    }
};

// UPDATE (PUT)
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { service_name, description, category, status } = req.body;

    try {
        const [check] = await db.execute('SELECT id FROM services WHERE id = ?', [id]);
        if (check.length === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });

        const query = `
            UPDATE services 
            SET service_name = ?, description = ?, category = ?, status = ?
            WHERE id = ?
        `;
        await db.execute(query, [service_name, description, category, status, id]);

        res.json({ message: 'Layanan berhasil diperbarui' });
    } catch (error) {
        console.error("Update Service Error:", error);
        res.status(500).json({ message: 'Gagal update layanan' });
    }
};

// DELETE (DELETE)
exports.deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const [check] = await db.execute('SELECT id FROM services WHERE id = ?', [id]);
        if (check.length === 0) return res.status(404).json({ message: 'Layanan tidak ditemukan' });

        await db.execute('DELETE FROM services WHERE id = ?', [id]);
        res.json({ message: 'Layanan berhasil dihapus' });
    } catch (error) {
        console.error("Delete Service Error:", error);
        res.status(500).json({ message: 'Gagal menghapus layanan' });
    }
};