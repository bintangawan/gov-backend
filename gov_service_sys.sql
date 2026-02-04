-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 04, 2026 at 05:26 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gov_service_sys`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `admin_feedback` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `service_id`, `status`, `notes`, `admin_feedback`, `created_at`, `updated_at`) VALUES
(1, 2, 5, 'approved', 'Saya membutuhkan izin untuk UMKM Digital saya', 'Okay, segera di proses ya', '2026-02-04 05:05:58', '2026-02-04 05:10:38'),
(3, 2, 5, 'approved', 'Saya ingin mengajukan perizin untuk UMKM Keripiki saya, dengan nama Kila Keripik', 'Okay, perizinan kamu diterima', '2026-02-04 05:20:53', '2026-02-04 05:21:40');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `service_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive','maintenance') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_name`, `description`, `category`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 'Lapor Pajak Daerah', 'Pelaporan pajak PBB dan Restoran', 'Pajak', 'active', NULL, '2026-02-04 03:56:56', '2026-02-04 03:56:56'),
(4, 'Pembuatan E-KTP', 'Membuat KTP Digital', 'Kependudukan', 'active', 1, '2026-02-04 04:36:15', '2026-02-04 04:36:15'),
(5, 'Izin UMKM Digital', 'Izin UMKM Digital', 'Perizinan', 'active', 3, '2026-02-04 05:03:31', '2026-02-04 05:03:31'),
(6, 'Izin Sosialisasi Narkoba', 'Izin Sosialisasi Narkoba', 'Perizinan', 'active', 3, '2026-02-04 05:13:50', '2026-02-04 05:13:50'),
(7, 'Izin Halal Produk Makanan', 'Izin untuk pengajuan Halal sebuah produk', 'Perizinan', 'active', 3, '2026-02-04 05:22:36', '2026-02-04 05:22:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` text COLLATE utf8mb4_unicode_ci,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','staff','citizen') COLLATE utf8mb4_unicode_ci DEFAULT 'citizen',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `full_name`, `avatar_url`, `google_id`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'jajan@gmail.com', 'jajan', NULL, NULL, '$2b$10$tNjuevYKBISgTcgj3vpZhetAg.z78Qe.KX8zmKBfZnbAmBSG4Prsi', 'citizen', '2026-02-04 04:33:57', '2026-02-04 04:33:57'),
(2, 'sharingbang00@gmail.com', 'Sharing Bang', 'https://lh3.googleusercontent.com/a/ACg8ocLuCsaoV0h7oCHIq4VnNAjxLoGZjQGm-1Rlfje9GEk1Gmop8A=s96-c', '105545648393935266143', NULL, 'citizen', '2026-02-04 04:37:23', '2026-02-04 04:37:23'),
(3, 'admin@sumut.gov.id', 'Admin Sumut', NULL, NULL, '$2a$12$JVlY6xK6jEH90bZpzfUHMeajUI3eEe4QD7WzrUTc6Ia5YXkQfuVHO', 'admin', '2026-02-04 04:58:49', '2026-02-04 04:58:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_google_id` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
