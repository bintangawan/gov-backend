# GovSys - Sistem Manajemen Layanan Digital Pemerintahan

**GovSys** adalah platform layanan publik digital berbasis web yang modern dan responsif. Sistem ini dirancang untuk memfasilitasi interaksi antara instansi pemerintahan (Admin) dan masyarakat (Citizen) dalam pengelolaan dan pengajuan layanan publik secara digital.

Sistem ini mendukung **Autentikasi Hybrid** (Google OAuth + Manual Login), **Role-Based Access Control** (RBAC), dan antarmuka yang ramah pengguna.


---

## 🚀 Fitur Utama

### 🔐 Autentikasi & Keamanan
* **Hybrid Login:** Mendukung login menggunakan Akun Google (OAuth) atau Email & Password biasa.
* **JWT Authentication:** Keamanan sesi pengguna berbasis Token (JSON Web Token).
* **Role-Based Access:** Pemisahan hak akses yang ketat antara **Admin** dan **Citizen**.

### 🏛️ Fitur Admin (Pemerintah)
* **Dashboard Statistik:** Ringkasan jumlah layanan aktif dan permohonan masuk.
* **Manajemen Layanan (CRUD):** Menambah, mengedit, dan menghapus jenis layanan publik.
* **Validasi Permohonan:** Menyetujui atau menolak permohonan warga dengan fitur **Feedback Note** menggunakan modal interaktif.
* **Real-time Search & Pagination:** Pencarian data layanan yang cepat tanpa reload.

### 👥 Fitur Citizen (Warga)
* **Katalog Layanan:** Melihat daftar layanan yang tersedia beserta deskripsinya.
* **Pengajuan Permohonan:** Mengajukan permohonan layanan (misal: Izin UMKM, KTP Digital) secara mudah.
* **Pelacakan Status:** Memantau status pengajuan (*Pending*, *Approved*, *Rejected*) dan melihat catatan dari admin.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
* **React.js + Vite:** Framework UI modern dengan performa tinggi.
* **Tailwind CSS:** Styling framework untuk desain responsif dan elegan (Government Blue Theme).
* **SweetAlert2:** Library untuk notifikasi popup dan modal konfirmasi yang cantik.
* **Lucide React:** Koleksi ikon modern dan ringan.
* **Axios:** HTTP Client untuk komunikasi ke API.
* **Google OAuth:** Integrasi login dengan akun Google.

### Backend (Server)
* **Node.js & Express.js:** Runtime environment dan framework server REST API.
* **MySQL:** Database relasional untuk menyimpan data pengguna, layanan, dan permohonan.
* **mysql2:** Driver database dengan dukungan Connection Pool (Scalable).
* **Bcrypt:** Enkripsi password untuk keamanan data pengguna.
* **JWT:** Standar industri untuk autentikasi API.

---

## ⚙️ Panduan Instalasi & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal (Localhost).

### 1. Persiapan Database
Pastikan **XAMPP** (atau MySQL Server) sudah berjalan. Buka phpMyAdmin atau MySQL Workbench dan jalankan query berikut:

```sql
CREATE DATABASE IF NOT EXISTS gov_service_sys;
USE gov_service_sys;

-- 1. Tabel Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    google_id VARCHAR(255) UNIQUE DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    role ENUM('admin', 'staff', 'citizen') DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- 2. Tabel Services (Layanan)
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_by INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Tabel Applications (Permohonan)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    notes TEXT, 
    admin_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

```

> **Tips:** Untuk membuat akun Admin, silakan register sebagai user biasa, lalu ubah kolom `role` menjadi `'admin'` secara manual di database.

---

### 2. Konfigurasi Backend (API)

1. Masuk ke folder backend melalui terminal:
```bash
cd dsms-backend

```


2. Install library yang dibutuhkan:
```bash
npm install

```


3. Buat file `.env` di dalam folder `dsms-backend` dan isi konfigurasi berikut:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=gov_service_sys
JWT_SECRET=rahasia_negara_super_aman_12345
GOOGLE_CLIENT_ID=masukkan_google_client_id_anda.apps.googleusercontent.com

```


4. Jalankan server:
```bash
npm run dev

```


*Server akan berjalan di `http://localhost:5000*`

---

### 3. Konfigurasi Frontend (Tampilan)

1. Ekstrak file frontend (jika berupa zip) dan masuk ke foldernya:
```bash
cd dsms-frontend

```


2. Install library yang dibutuhkan:
```bash
npm install

```


3. **Setup Environment:**
* Cari file `.env.example`, rename menjadi `.env`.
* Isi konfigurasi berikut:


```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=masukkan_google_client_id_anda.apps.googleusercontent.com

```


> **⚠️ PENTING:** `VITE_GOOGLE_CLIENT_ID` di frontend **HARUS SAMA PERSIS** dengan `GOOGLE_CLIENT_ID` di backend. Jangan ada spasi tambahan.


4. Jalankan aplikasi React:
```bash
npm run dev

```


5. Buka browser dan akses URL yang muncul (biasanya `http://localhost:5173`).

---

## 📂 Struktur Folder Proyek

Berikut adalah gambaran struktur folder untuk memudahkan navigasi kode.

```text
gov-project/
│
├── dsms-backend/               # --- BACKEND (Node.js) ---
│   ├── src/
│   │   ├── config/             # Konfigurasi Database (mysql2 pool)
│   │   ├── controllers/        # Logika Bisnis (Auth, Services, Applications)
│   │   ├── middleware/         # Auth Check (JWT & Google Token)
│   │   └── routes/             # Definisi API Endpoints
│   ├── .env                    # Environment Variables Backend
│   └── server.js               # Entry Point Server
│
└── dsms-frontend/              # --- FRONTEND (React) ---
    ├── src/
    │   ├── api/                # Konfigurasi Axios Interceptor
    │   ├── auth/               # Auth Store (Context API)
    │   ├── components/         # Komponen UI (Navbar, Layout, Modal Form)
    │   ├── pages/
    │   │   ├── Admin/          # Halaman Dashboard & Kelola Admin
    │   │   └── Users/          # Halaman Dashboard & Permohonan Warga
    │   ├── App.jsx             # Routing & Protected Routes
    │   └── main.jsx            # Entry Point React
    ├── .env                    # Environment Variables Frontend
    └── package.json            # Daftar Dependencies

```

## 🐛 Troubleshooting Umum

* **Error "Google Token Invalid / Wrong Recipient":**
* Pastikan Client ID di kedua file `.env` sama persis.
* Restart kedua terminal (Backend & Frontend) setelah mengubah file `.env`.


* **Error Login tidak tersimpan (Login Loop):**
* Hapus cache browser atau Local Storage (`Inspect Element` -> `Application` -> `Local Storage` -> `Clear`).


* **Database Error:**
* Pastikan XAMPP/MySQL sudah menyala dan nama database sesuai dengan konfigurasi `.env`.



---

**Dibuat untuk keperluan Sistem Pemerintahan Digital by bintangin.com.**

```

```