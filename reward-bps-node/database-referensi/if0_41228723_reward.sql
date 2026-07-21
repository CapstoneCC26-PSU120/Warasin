-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql309.infinityfree.com
-- Waktu pembuatan: 02 Mar 2026 pada 06.54
-- Versi server: 11.4.10-MariaDB
-- Versi PHP: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_41228723_reward`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `final_vote`
--

CREATE TABLE `final_vote` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `kandidat_id` varchar(100) NOT NULL,
  `sesi_id` int(11) DEFAULT NULL,
  `total_nilai` int(11) NOT NULL DEFAULT 0,
  `jawaban1` int(11) DEFAULT NULL,
  `jawaban2` int(11) DEFAULT NULL,
  `jawaban3` int(11) DEFAULT NULL,
  `jawaban4` int(11) DEFAULT NULL,
  `jawaban5` int(11) DEFAULT NULL,
  `jawaban6` int(11) DEFAULT NULL,
  `jawaban7` int(11) DEFAULT NULL,
  `jawaban8` int(11) DEFAULT NULL,
  `jawaban9` int(11) DEFAULT NULL,
  `jawaban10` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `final_vote`
--

INSERT INTO `final_vote` (`id`, `user_id`, `kandidat_id`, `sesi_id`, `total_nilai`, `jawaban1`, `jawaban2`, `jawaban3`, `jawaban4`, `jawaban5`, `jawaban6`, `jawaban7`, `jawaban8`, `jawaban9`, `jawaban10`) VALUES
(1, 2, '4', 11, 90, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9),
(2, 2, '40', 11, 100, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10),
(3, 2, '15', 11, 60, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6),
(4, 3, '4', 11, 89, 8, 9, 10, 9, 8, 9, 10, 9, 8, 9),
(5, 3, '40', 11, 100, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10),
(6, 3, '15', 11, 77, 8, 8, 8, 8, 8, 8, 7, 7, 7, 8),
(7, 2, '3', 13, 86, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 2, '17', 13, 82, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 2, '5', 13, 81, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 3, '3', 13, 88, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 3, '17', 13, 82, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 3, '5', 13, 80, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 2, '12', 15, 85, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 2, '5', 15, 88, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 2, '4', 15, 85, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 3, '12', 15, 86, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 3, '5', 15, 85, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 3, '4', 15, 77, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kandidat`
--

CREATE TABLE `kandidat` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `divisi` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kandidat`
--

INSERT INTO `kandidat` (`id`, `nama`, `divisi`) VALUES
(1, 'Wiji Nugroho', 'Statistis Ahli Madya'),
(2, 'Musliman', 'INISIAL'),
(3, 'Arifah Nur Ngafiyah', 'INISIAL'),
(4, 'Madya Yogi Prastiwi', 'INISIAL'),
(5, 'Farah Nur Azizah', 'INISIAL'),
(6, 'Esti Suciningtyas Pratiwi', 'INISIAL'),
(7, 'Susanto', 'INISIAL'),
(8, 'Achmad Misbachus Salaf', 'SID'),
(9, 'Istakbal Mohamad', 'SID'),
(10, 'Rizky Aninditha', 'SID'),
(11, 'Fadillah Kurniasih', 'SID'),
(12, 'Ajie Setya Kurniawan', 'SID'),
(13, 'Diah Novita Sari', 'SID'),
(14, 'Ririn Yulianti', 'GADIS'),
(15, 'Mustanginah', 'GADIS'),
(16, 'Wahyu Eka Yulismi Wardani', 'GADIS'),
(17, 'Endah Retno Wahyuningrum', 'GADIS'),
(18, 'Uswatun Khasanah', 'GADIS'),
(19, 'Tumaryono', 'GADIS'),
(20, 'Surono', 'GADIS'),
(21, 'Berta Antikasari', 'INTAN'),
(22, 'Rini Hapsari Cahyaningrum', 'INTAN'),
(23, 'Lili Anisa Fadzila', 'INTAN'),
(24, 'Shinta Karunia Permata Sari', 'INTAN'),
(25, 'Kristiyanto Sambodo', 'INTAN'),
(26, 'Felix Wawan Santoso', 'INTAN'),
(27, 'Visita Arsa Pratiwi', 'EKSIS'),
(28, 'Citra Faya Amanda', 'EKSIS'),
(29, 'Nuniek Sulistyorini', 'EKSIS'),
(30, 'Djoko Wirawan', 'EKSIS'),
(31, 'Dama Pratama', 'EKSIS'),
(32, 'Sahardian Meka Prasmadi', 'SUBAG_UMUM'),
(33, 'Aning Widiarti', 'SUBAG_UMUM'),
(34, 'Bety Riski Tumuning', 'SUBAG_UMUM'),
(35, 'Budi Hartanto', 'SUBAG_UMUM'),
(36, 'Dwi Yulianto', 'SUBAG_UMUM'),
(37, 'Krusmiaji', 'SUBAG_UMUM'),
(38, 'Ade Haryanto', 'SUBAG_UMUM'),
(39, 'Slamet Widodo', 'SUBAG_UMUM'),
(40, 'Nadyatul Febriana', 'SUBAG_UMUM'),
(41, 'Eksi Gumawang', 'SUBAG_UMUM'),
(42, 'Amin Pujianto', 'SUBAG_UMUM'),
(43, 'Tri Mulyono', 'SUBAG_UMUM'),
(44, 'Maryoto', 'SUBAG_UMUM'),
(45, 'Aldi Tri Mardiono', 'SUBAG_UMUM');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penilaian`
--

CREATE TABLE `penilaian` (
  `id` int(11) NOT NULL,
  `kandidat_id` int(11) DEFAULT NULL,
  `skp` int(11) DEFAULT NULL,
  `kjk` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `penilaian`
--

INSERT INTO `penilaian` (`id`, `kandidat_id`, `skp`, `kjk`, `total`) VALUES
(108, 30, 30, 50, -20),
(109, 3, 45, 67, -22),
(110, 6, 20, 30, -10),
(111, 12, 60, 50, 10);

-- --------------------------------------------------------

--
-- Struktur dari tabel `sesi_final`
--

CREATE TABLE `sesi_final` (
  `id` int(11) NOT NULL,
  `status` enum('buka','tutup') DEFAULT 'tutup',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sesi_final`
--

INSERT INTO `sesi_final` (`id`, `status`, `created_at`) VALUES
(13, 'tutup', '2026-02-27 01:35:51'),
(15, 'tutup', '2026-02-27 01:49:20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','ketua','user') NOT NULL,
  `divisi` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `divisi`) VALUES
(2, 'Wiji Nugroho', '45388af61c9356f4df020dc2d241b005', 'user', 'Statistis Ahli Madya'),
(3, 'Musliman', '8f6a1161872c81894a53a808eb81b68b', 'user', 'INISIAL'),
(4, 'Arifah Nur Ngafiyah', '8aebd79db387f6cc5ab319762892736f', 'user', 'INISIAL'),
(5, 'Madya Yogi Prastiwi', '3d9c01ebb53eaec775262508154d6ad6', 'user', 'INISIAL'),
(6, 'Farah Nur Azizah', '6b7c522b556be567d421b025e8c9bc5d', 'user', 'INISIAL'),
(7, 'Esti Suciningtyas Pratiwi', 'e5a66217ffabcd976f51fc3bbf5790c0', 'user', 'INISIAL'),
(8, 'Susanto', '6da40fe3188dc6c75dce3eba5465c7f3', 'user', 'INISIAL'),
(9, 'Achmad Misbachus Salaf', 'f6241a821ed18575b622da220a94efe6', 'user', 'SID'),
(10, 'Istakbal Mohamad', 'b40ebab27362d932a9d79c39e7583daa', 'user', 'SID'),
(11, 'Rizky Aninditha', '16b020bf6d5ddbea4c05e69cd58c8541', 'user', 'SID'),
(12, 'Fadillah Kurniasih', '00c00ae2ad6752a2111f0b22e4bcd6b0', 'user', 'SID'),
(13, 'Ajie Setya Kurniawan', '4e9897d5b748168f07c280857a1896b1', 'user', 'SID'),
(14, 'Diah Novita Sari', '626e1c53a2ac6430874205103d597a42', 'user', 'SID'),
(15, 'Ririn Yulianti', 'da63c5b6d41e76a973bf5214da376716', 'user', 'GADIS'),
(16, 'Mustanginah', 'cb143a1b181a7ed04c094abb8e5b524f', 'user', 'GADIS'),
(17, 'Wahyu Eka Yulismi Wardani', '6f8ff75c5911900fe2170de60908f0f8', 'user', 'GADIS'),
(18, 'Endah Retno Wahyuningrum', '9d00afafd71693bc0221819de3345218', 'user', 'GADIS'),
(19, 'Uswatun Khasanah', '0f003fc53ccfc454718a4eba77d08efd', 'user', 'GADIS'),
(20, 'Tumaryono', 'a8ea221c94098ddd11dbb45e55a2e10d', 'user', 'GADIS'),
(21, 'Surono', 'a5ac1acfdc76c90c6b978ef76680e893', 'user', 'GADIS'),
(22, 'Berta Antikasari', '47455b4cb6184b18310da8694e3371ee', 'user', 'INTAN'),
(23, 'Rini Hapsari Cahyaningrum', '4f2dfd08d1a9dd82ef2d007d70236280', 'user', 'INTAN'),
(24, 'Lili Anisa Fadzila', 'e45efa6ca6e0f901eae174c0dc46bcfd', 'user', 'INTAN'),
(25, 'Shinta Karunia Permata Sari', 'dea09806fb48cbbef4ae77013bba09db', 'user', 'INTAN'),
(26, 'Kristiyanto Sambodo', '17f2942c28ddc97d191aa3ca95c2b817', 'user', 'INTAN'),
(27, 'Felix Wawan Santoso', 'ae87b0ea9f21664a7cc7fa8f6f5c6342', 'user', 'INTAN'),
(28, 'Visita Arsa Pratiwi', '3abfd8190a79547979df700291a8797f', 'user', 'EKSIS'),
(29, 'Citra Faya Amanda', '36fd56cfa398fed41e16b0751a992260', 'user', 'EKSIS'),
(30, 'Nuniek Sulistyorini', '067673a043415a09be81bae316ee877d', 'user', 'EKSIS'),
(31, 'Djoko Wirawan', 'f465e609052029aea7feab2a037f32cd', 'user', 'EKSIS'),
(32, 'Dama Pratama', '038a326976b9092ab9d383fc33d3cc64', 'user', 'EKSIS'),
(33, 'Sahardian Meka Prasmadi', '459296961b7b29ffbb408f542032d3dc', 'user', 'SUBAG_UMUM'),
(34, 'Aning Widiarti', '2627aadb1132af89939b40791dee7c74', 'user', 'SUBAG_UMUM'),
(35, 'Bety Riski Tumuning', '8a252a4ec5a0f120ce28951f80634e95', 'user', 'SUBAG_UMUM'),
(36, 'Budi Hartanto', '58434a196270becc6fc93f09c351aa0e', 'user', 'SUBAG_UMUM'),
(37, 'Dwi Yulianto', 'c0541012e16ea5947b162398fe3da06f', 'user', 'SUBAG_UMUM'),
(38, 'Krusmiaji', 'af91a281d18a0139598f3a0add19992f', 'user', 'SUBAG_UMUM'),
(39, 'Ade Haryanto', '3c02a4e4b821cc566311f7251f9a80e0', 'user', 'SUBAG_UMUM'),
(40, 'Slamet Widodo', '05e9ff8218adeb4a4f741c77c36f4b41', 'user', 'SUBAG_UMUM'),
(41, 'Nadyatul Febriana', 'bf93edf7faf391cde6a0d489a3d841c6', 'user', 'SUBAG_UMUM'),
(42, 'Eksi Gumawang', '3970c869546065dd18176b530641ea12', 'user', 'SUBAG_UMUM'),
(43, 'Amin Pujianto', '6d08b813d2c53a685dab790cf2d3b3fb', 'user', 'SUBAG_UMUM'),
(44, 'Tri Mulyono', '3b08586dc8c74dd3f498f82957d66bb6', 'user', 'SUBAG_UMUM'),
(45, 'Maryoto', '0143a908b7e39faf975faaf1dfead37c', 'user', 'SUBAG_UMUM'),
(46, 'Aldi Tri Mardiono', 'ca0068262fe822b7f096ae04a8ed33db', 'user', 'SUBAG_UMUM'),
(47, 'SID', '97cbc5f9423905429600954f50e31f5e', 'ketua', 'SID'),
(48, 'GADIS', 'dee4ad225dccf0399371ebe2103078c9', 'ketua', 'GADIS'),
(49, 'INTAN', '46a7357b0b816cb9dd56d70d2a385cfd', 'ketua', 'INTAN'),
(50, 'EKSIS', 'c48b21959ac8d062c4d5b3a6bf566b9f', 'ketua', 'EKSIS'),
(52, 'INISIAL', '4053576055856f1c0f832404261ec6b3', 'ketua', 'INISIAL'),
(64, 'admin', '0192023a7bbd73250516f069df18b500', 'admin', ''),
(72, 'SUBAG_UMUM', '910e2ddd63a867834ed8e703e75030d1', 'ketua', 'SUBAG_UMUM');

-- --------------------------------------------------------

--
-- Struktur dari tabel `voting`
--

CREATE TABLE `voting` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `internal_id` int(11) NOT NULL,
  `eksternal_id` int(11) NOT NULL,
  `skp` int(11) DEFAULT 0,
  `kjk` int(11) DEFAULT 0,
  `total` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `voting`
--

INSERT INTO `voting` (`id`, `user_id`, `internal_id`, `eksternal_id`, `skp`, `kjk`, `total`, `created_at`) VALUES
(27, 52, 3, 30, 0, 0, 0, '2026-02-27 01:55:31'),
(28, 47, 12, 6, 0, 0, 0, '2026-02-27 01:56:04');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `final_vote`
--
ALTER TABLE `final_vote`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kandidat`
--
ALTER TABLE `kandidat`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kandidat_id` (`kandidat_id`);

--
-- Indeks untuk tabel `sesi_final`
--
ALTER TABLE `sesi_final`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `voting`
--
ALTER TABLE `voting`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `final_vote`
--
ALTER TABLE `final_vote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `kandidat`
--
ALTER TABLE `kandidat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT untuk tabel `penilaian`
--
ALTER TABLE `penilaian`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT untuk tabel `sesi_final`
--
ALTER TABLE `sesi_final`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT untuk tabel `voting`
--
ALTER TABLE `voting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
