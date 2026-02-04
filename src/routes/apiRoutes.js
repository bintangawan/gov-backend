const express = require('express');
const router = express.Router();

// Import Controllers
const authController = require('../controllers/authController');
const serviceController = require('../controllers/serviceController');
const applicationController = require('../controllers/applicationController'); // IMPORT BARU

// Import Middlewares
const { verifyToken, verifyGoogleTokenRaw, verifyAdmin } = require('../middleware/authMiddleware');

// ===========================
// 1. AUTH ROUTES (Public)
// ===========================
router.post('/auth/register', authController.registerManual);
router.post('/auth/login', authController.loginManual);
router.post('/auth/google', verifyGoogleTokenRaw, authController.googleAuth);

// ===========================
// 2. SERVICE ROUTES (Management Layanan)
// ===========================

// GET: Semua orang (Warga & Admin) boleh lihat daftar layanan
router.get('/services', verifyToken, serviceController.getAllServices);
router.get('/services/:id', verifyToken, serviceController.getServiceById);

// CUD (Create, Update, Delete): HANYA ADMIN yang boleh
router.post('/services', verifyToken, verifyAdmin, serviceController.createService);
router.put('/services/:id', verifyToken, verifyAdmin, serviceController.updateService);
router.delete('/services/:id', verifyToken, verifyAdmin, serviceController.deleteService);

// ===========================
// 3. APPLICATION ROUTES (Permohonan Izin) - BARU!
// ===========================

// --- Routes untuk WARGA ---
// Mengajukan permohonan baru
router.post('/applications', verifyToken, applicationController.applyService);
// Melihat riwayat permohonan sendiri
router.get('/my-applications', verifyToken, applicationController.getMyApplications);

// --- Routes untuk ADMIN ---
// Melihat semua permohonan dari seluruh warga
router.get('/admin/applications', verifyToken, verifyAdmin, applicationController.getAllApplications);
// Mengubah status (ACC / Reject)
router.put('/admin/applications/:id', verifyToken, verifyAdmin, applicationController.updateApplicationStatus);

module.exports = router;