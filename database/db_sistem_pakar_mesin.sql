-- ============================================================================
-- DATABASE SISTEM PAKAR TROUBLESHOOTING MESIN PRODUKSI (3NF)
-- Metode: Forward Chaining | Studi Kasus: PT Vivo Mobile Indonesia
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `db_sistem_pakar_mesin`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_sistem_pakar_mesin`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `tb_tiket_perbaikan`;
DROP TABLE IF EXISTS `tb_diagnosa`;
DROP TABLE IF EXISTS `tb_rule`;
DROP TABLE IF EXISTS `tb_kerusakan`;
DROP TABLE IF EXISTS `tb_gejala`;
DROP TABLE IF EXISTS `tb_mesin`;
DROP TABLE IF EXISTS `tb_user`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. TABEL USER (3 Aktor: Operator, Teknisi, Admin)
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_user` (
  `id` VARCHAR(20) NOT NULL,
  `username` VARCHAR(60) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `role` ENUM('Operator', 'Teknisi', 'Admin') NOT NULL DEFAULT 'Operator',
  `nama` VARCHAR(120) NOT NULL,
  `jabatan` VARCHAR(150) NOT NULL,
  `avatar` VARCHAR(10) NOT NULL DEFAULT 'OP',
  `nip` VARCHAR(40) NOT NULL,
  `shift` VARCHAR(50) NOT NULL DEFAULT 'Shift 1 (Pagi)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_user` (`id`, `username`, `password`, `role`, `nama`, `jabatan`, `avatar`, `nip`, `shift`) VALUES
('U01', 'Operator', 'Operator1', 'Operator', 'Budi Santoso', 'Operator Lini Assembly (ASM)', 'BS', 'EMP-VVO-2024-081', 'Shift 1 (Pagi)'),
('U02', 'Teknisi', 'Teknisi1', 'Teknisi', 'Rian Kurniawan', 'Lead Maintenance & Automation Engineer', 'RK', 'ENG-VVO-2021-019', 'General Maintenance'),
('U03', 'operator.dispensing', 'Dispensing2026', 'Operator', 'Dimas Pratama', 'Operator Lini Dispensing Lem (AGM)', 'DP', 'EMP-VVO-2025-112', 'Shift 1 (Pagi)'),
('U04', 'operator.qc', 'Airtight2026', 'Operator', 'Siti Nurhaliza', 'Quality Control & AirTightness Tester', 'SN', 'QC-VVO-2024-044', 'Shift 2 (Siang)'),
('U05', 'Admin', 'Admin1', 'Admin', 'Hendra Wijaya', 'System Administrator & Plant Engineering Lead', 'HW', 'ADM-VVO-2019-001', 'General / All Shifts');

-- ----------------------------------------------------------------------------
-- 2. TABEL MESIN PRODUKSI (5 Mesin Utama PT Vivo Mobile Indonesia)
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_mesin` (
  `id` VARCHAR(20) NOT NULL,
  `kode` VARCHAR(30) NOT NULL,
  `nama` VARCHAR(120) NOT NULL,
  `fungsi` TEXT NOT NULL,
  `lokasi` VARCHAR(150) NOT NULL,
  `icon` VARCHAR(40) DEFAULT 'Wrench',
  `status` VARCHAR(30) NOT NULL DEFAULT 'Aktif',
  `deskripsi` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_mesin_kode` (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_mesin` (`id`, `kode`, `nama`, `fungsi`, `lokasi`, `icon`, `status`, `deskripsi`) VALUES
('M01', 'ASM', 'Mesin ASM (Automatic Screw Manual)', 'Pemasangan baut otomatis pada modul dan casing smartphone', 'Line Assembly 1 - PT Vivo Mobile Indonesia', 'Wrench', 'Aktif', 'Mesin presisi untuk proses screw tightening. Dilengkapi sensor torsi, jalur feeder baut otomatis, dan indikator status OK/NG (kuning/merah).'),
('M02', 'AGM', 'Mesin AGM (Automatic Glue Manual)', 'Pemberian dan dispensing lem perekat pada frame smartphone', 'Line Dispensing 2 - PT Vivo Mobile Indonesia', 'Droplets', 'Aktif', 'Mesin dispensing lem berkecepatan tinggi dengan konveyor otomatis dan sistem pemanas nozzle. Sering mengalami kendala konveyor macet atau lem meluber.'),
('M03', 'PRESS3IN1', 'Mesin Press 3 in 1', 'Penekanan komponen smartphone sisi depan, belakang, dan samping', 'Line Casing Press - PT Vivo Mobile Indonesia', 'Maximize2', 'Aktif', 'Mesin multi-axis pneumatic press dengan sensor pembaca batas tekanan (standar tekanan maks ~418). Dilengkapi alarm overpressure.'),
('M04', 'AIRTIGHT', 'Mesin AirTightness', 'Pengujian ketahanan kedap air (waterproof IP test) pada smartphone', 'Line QC & Reliability - PT Vivo Mobile Indonesia', 'ShieldCheck', 'Aktif', 'Mesin pendeteksi kebocoran melalui tekanan udara negatif/positif. Mendeteksi kebocoran sekecil mikro-bar pada perangkat smartphone.'),
('M05', 'COLDPRESS', 'Mesin Control Coldpress Pressure', 'Penekanan dingin baterai smartphone agar melekat presisi', 'Line Battery Assembly - PT Vivo Mobile Indonesia', 'BatteryCharging', 'Aktif', 'Mesin press dingin baterai yang dilengkapi kamera pemindai barcode baterai dan silinder press pneumatik vertikal.');

-- ----------------------------------------------------------------------------
-- 3. TABEL GEJALA (G01 - G20)
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_gejala` (
  `id` VARCHAR(20) NOT NULL,
  `kode` VARCHAR(20) NOT NULL,
  `nama` TEXT NOT NULL,
  `mesin_id` VARCHAR(20) NOT NULL,
  `mesin_nama` VARCHAR(120) NOT NULL,
  `kategori` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`kode`),
  KEY `idx_gejala_mesin` (`mesin_id`),
  CONSTRAINT `fk_gejala_mesin` FOREIGN KEY (`mesin_id`) REFERENCES `tb_mesin` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_gejala` (`id`, `kode`, `nama`, `mesin_id`, `mesin_nama`, `kategori`) VALUES
('1', 'G01', 'Mesin tidak menyala sama sekali', 'M01', 'Mesin ASM', 'Elektrikal'),
('2', 'G02', 'Lampu indikator mesin mati', 'M01', 'Mesin ASM', 'Elektrikal'),
('3', 'G03', 'Conveyor / kompayer macet atau berhenti', 'M02', 'Mesin AGM', 'Mekanikal'),
('4', 'G04', 'Motor penggerak conveyor terasa sangat panas', 'M02', 'Mesin AGM', 'Motorik'),
('5', 'G05', 'Sensor pembaca gagal membaca posisi atau parameter', 'M03', 'Mesin Press 3 in 1', 'Sensorik'),
('6', 'G06', 'Alarm mesin aktif berbunyi terus menerus', 'M03', 'Mesin Press 3 in 1', 'Sistem'),
('7', 'G07', 'Tekanan udara tidak stabil atau turun drastis', 'M04', 'Mesin AirTightness', 'Pneumatik'),
('8', 'G08', 'Suara mesin terdengar kasar dan berisik', 'M04', 'Mesin AirTightness', 'Mekanikal'),
('9', 'G09', 'Mesin tiba-tiba berhenti saat sedang beroperasi', 'M01', 'Mesin ASM', 'Sistem'),
('10', 'G10', 'Suhu bodi atau modul mesin mengalami overheat', 'M01', 'Mesin ASM', 'Termal'),
('11', 'G11', 'Baut macet di jalur keluar (feeder track)', 'M01', 'Mesin ASM', 'Mekanikal'),
('12', 'G12', 'Silicone smartphone terangkat atau pemasangan tidak rapi', 'M01', 'Mesin ASM', 'Material'),
('13', 'G13', 'Lampu indikator kuning menyala (Status NG Ringan)', 'M02', 'Mesin AGM', 'Indikator'),
('14', 'G14', 'Hasil lem meluber ke samping / penyebaran tidak presisi', 'M02', 'Mesin AGM', 'Dispenser'),
('15', 'G15', 'Hasil uji AirTightness muncul status NG secara terus-menerus', 'M04', 'Mesin AirTightness', 'Pengujian'),
('16', 'G16', 'Terdapat kebocoran suara hembusan pada selang pneumatik mesin', 'M04', 'Mesin AirTightness', 'Pneumatik'),
('17', 'G17', 'Angka tekanan bagian belakang melebihi batas (di atas standar 418)', 'M03', 'Mesin Press 3 in 1', 'Pneumatik'),
('18', 'G18', 'Kamera sensor tidak dapat membaca barcode pada baterai', 'M05', 'Mesin Control Coldpress Pressure', 'Vision Sensor'),
('19', 'G19', 'Bagian press dingin tidak mau turun saat siklus dimulai', 'M05', 'Mesin Control Coldpress Pressure', 'Aktuator'),
('20', 'G20', 'Alarm gangguan muncul berulang secara berkala (setiap ~4 jam kerja)', 'M05', 'Mesin Control Coldpress Pressure', 'Sistem');

-- ----------------------------------------------------------------------------
-- 4. TABEL KERUSAKAN & SOLUSI (K01 - K10)
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_kerusakan` (
  `id` VARCHAR(20) NOT NULL,
  `kode` VARCHAR(20) NOT NULL,
  `nama` VARCHAR(180) NOT NULL,
  `tingkat` ENUM('Ringan', 'Sedang', 'Parah') NOT NULL,
  `kategori` VARCHAR(60) NOT NULL,
  `penanganan_oleh` VARCHAR(40) NOT NULL,
  `solusi` TEXT NOT NULL,
  `tindakan_operator` TEXT,
  `rekomendasi_teknisi` TEXT,
  PRIMARY KEY (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_kerusakan` (`id`, `kode`, `nama`, `tingkat`, `kategori`, `penanganan_oleh`, `solusi`, `tindakan_operator`, `rekomendasi_teknisi`) VALUES
('1', 'K01', 'Power Supply Rusak', 'Parah', 'Kritis', 'Teknisi', 'Ganti kabel power dan cek tegangan listrik PLN/regulator. Lakukan pengecekan trafo dan fuse internal.', 'Matikan switch utama mesin, jangan menyentuh kabel telanjang, segera laporkan ke teknisi.', 'Uji kontinuitas kabel power menggunakan multimeter, cek modul power switching 24V DC, ganti jika terbakar.'),
('2', 'K02', 'Motor Conveyor Rusak', 'Parah', 'Mekanik & Drive', 'Teknisi', 'Ganti motor conveyor dan cek gearbox mekanis serta bearing penggerak belt.', 'Hentikan siklus conveyor melalui tombol emergency/stop agar beban motor tidak memicu korsleting.', 'Bongkar bracket motor stepper/servo conveyor, periksa tahanan kumparan motor dan pelumasan bearing.'),
('3', 'K03', 'Sensor Error', 'Sedang', 'Instrumen', 'Teknisi', 'Kalibrasi sensor dan cek kabel sensor. Bersihkan optik sensor dari debu atau residu proses.', 'Cek apakah ada benda asing menghalangi sensor, bersihkan perlahan dengan kain microfiber kering.', 'Lakukan alignment sensor jarak/proximity, periksa tegangan output analog/digital sensor, ganti kabel sensor jika putus jepit.'),
('4', 'K04', 'Sistem Pneumatic Bermasalah', 'Parah', 'Pneumatik Tekanan', 'Teknisi', 'Cek tekanan udara utama pabrik dan periksa sambungan selang pneumatic dari kebocoran.', 'Periksa manometer tekanan udara di regulator mesin, jika di bawah standar segera beritahu teknisi.', 'Cari titik kebocoran menggunakan spray deteksi kebocoran, potong dan pasang fitting selang baru, setel regulator ke tekanan kerja standar.'),
('5', 'K05', 'Overheat Mesin', 'Sedang', 'Termal', 'Operator / Teknisi', 'Matikan mesin sementara dan cek kipas pendingin serta ventilasi udara pendingin mesin.', 'Lakukan shutdown mesin sesuai SOP selama 15-20 menit. Pastikan sirkulasi kipas pendingin tidak tertutup box material.', 'Bersihkan heatsink pendingin CPU kontroler, ganti pasta termal jika perlu, dan periksa RPM exhaust fan.'),
('6', 'K06', 'Jalur Feeder Baut Tersumbat & Pemasangan Silicone NG', 'Ringan', 'Operasional Ringan', 'Operator', 'Rapikan posisi silicone secara manual sesuai standar SOP dan lakukan pengetukan ringan pada jalur baut agar getaran melancarkan luncuran baut.', 'Operator dapat menangani mandiri: rapikan silicone, ketuk rel jalur baut, lalu uji 1 siklus manual tanpa memanggil teknisi.', 'Jika kemacetan baut terulang lebih dari 3x berturut-turut, teknisi akan membersihkan debu magnetik pada trek feeder.'),
('7', 'K07', 'Conveyor Jammed Ringan (Mesin AGM)', 'Ringan', 'Operasional Ringan', 'Operator', 'Lakukan prosedur reset pada komputer kontrol mesin: tekan tombol STOP -> tekan RESET -> tekan RUN untuk melanjutkan operasi normal.', 'Bisa langsung ditangani operator tanpa menunggu teknisi. Ikuti menu panel kontrol AGM: Stop -> Reset -> Run.', 'Periksa ketegangan belt conveyor saat waktu maintenance mingguan.'),
('8', 'K08', 'Parameter Dispenser Lem Tidak Presisi / Nozzle Meluber', 'Parah', 'Kalibrasi Presisi', 'Teknisi', 'Lakukan kalibrasi ulang koordinat dispensing lem dan periksa pengaturan tekanan jarum nozzle pada komputer kontrol mesin AGM.', 'Segera tekan stop dan panggil teknisi. Jangan mengubah parameter koordinat program dispenser lem sendiri.', 'Lakukan zero-point calibration, uji dispensasi tes dot lem di lembar kalibrasi, bersihkan sisa lem mengering di tip nozzle.'),
('9', 'K09', 'Sensor Tekanan Press 3 in 1 Mengalami Overpressure Drift', 'Parah', 'Kalibrasi Tekanan', 'Teknisi', 'Lakukan kalibrasi load cell sensor tekanan dan setting ulang ambang batas limit tekanan mesin (standar 418).', 'Hentikan proses press produk untuk mencegah retak pada kaca/casing smartphone, segera panggil teknisi.', 'Ukur tegangan output load cell, lakukan tare kalibrasi dengan anak timbang referensi, reset nilai limit pada PLC.'),
('10', 'K10', 'Kamera Barcode Reader Kotor / Silinder Press Dingin Baterai Macet', 'Parah', 'Vision & Aktuator', 'Teknisi', 'Bersihkan lensa kamera vision, setel fokus pencahayaan LED barcode, dan lakukan kalibrasi limit switch silinder pneumatik press baterai.', 'Kondisi berulang setiap ~4 jam menunjukkan gangguan serius. Hentikan lini dan panggil teknisi segera.', 'Lakukan recalibration exposure kamera Cognex/Keyence, lumasi rod silinder press baterai, reset log error PLC.');

-- ----------------------------------------------------------------------------
-- 5. TABEL RULE FORWARD CHAINING (R01 - R20)
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_rule` (
  `id` VARCHAR(20) NOT NULL,
  `nama_rule` VARCHAR(180) NOT NULL,
  `kode_gejala` VARCHAR(20) NOT NULL,
  `kode_kerusakan` VARCHAR(20) NOT NULL,
  `bobot` DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  `kondisi` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_rule_gejala` (`kode_gejala`),
  KEY `idx_rule_kerusakan` (`kode_kerusakan`),
  CONSTRAINT `fk_rule_gejala` FOREIGN KEY (`kode_gejala`) REFERENCES `tb_gejala` (`kode`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rule_kerusakan` FOREIGN KEY (`kode_kerusakan`) REFERENCES `tb_kerusakan` (`kode`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_rule` (`id`, `nama_rule`, `kode_gejala`, `kode_kerusakan`, `bobot`, `kondisi`) VALUES
('R01', 'Rule 01: Indikasi Power Supply Mati Total', 'G01', 'K01', 1.00, 'IF Mesin tidak menyala sama sekali THEN Power Supply Rusak'),
('R02', 'Rule 02: Indikasi Lampu Indikator Power Hilang', 'G02', 'K01', 1.00, 'IF Lampu indikator mesin mati THEN Power Supply Rusak'),
('R03', 'Rule 03: Indikasi Motor Conveyor Macet', 'G03', 'K02', 1.00, 'IF Conveyor / kompayer macet atau berhenti THEN Motor Conveyor Rusak'),
('R04', 'Rule 04: Indikasi Overheating Motor Conveyor', 'G04', 'K02', 1.00, 'IF Motor penggerak conveyor terasa sangat panas THEN Motor Conveyor Rusak'),
('R05', 'Rule 05: Indikasi Sensor Gagal Membaca Data', 'G05', 'K03', 1.00, 'IF Sensor pembaca gagal membaca posisi atau parameter THEN Sensor Error'),
('R06', 'Rule 06: Indikasi Alarm Peringatan Sensor Aktif', 'G06', 'K03', 1.00, 'IF Alarm mesin aktif berbunyi terus menerus THEN Sensor Error'),
('R07', 'Rule 07: Indikasi Fluktuasi Tekanan Pneumatik', 'G07', 'K04', 1.00, 'IF Tekanan udara tidak stabil atau turun drastis THEN Sistem Pneumatic Bermasalah'),
('R08', 'Rule 08: Indikasi Suara Kasar Komponen Pneumatik', 'G08', 'K04', 1.00, 'IF Suara mesin terdengar kasar dan berisik THEN Sistem Pneumatic Bermasalah'),
('R09', 'Rule 09: Indikasi Interupsi Sistem Akibat Panas', 'G09', 'K05', 1.00, 'IF Mesin tiba-tiba berhenti saat sedang beroperasi THEN Overheat Mesin'),
('R10', 'Rule 10: Indikasi Temperatur Tinggi Modul Mesin', 'G10', 'K05', 1.00, 'IF Suhu bodi atau modul mesin mengalami overheat THEN Overheat Mesin'),
('R11', 'Rule 11: Gangguan Ringan Jalur Feeder Baut ASM', 'G11', 'K06', 0.90, 'IF Baut macet di jalur keluar (feeder track) THEN Jalur Feeder Baut Tersumbat'),
('R12', 'Rule 12: Gangguan Posisi Silicone Smartphone ASM', 'G12', 'K06', 0.90, 'IF Silicone smartphone terangkat atau pemasangan tidak rapi THEN Pemasangan Silicone NG'),
('R13', 'Rule 13: Conveyor Macet Ringan Panel AGM (Stop-Reset-Run)', 'G13', 'K07', 0.85, 'IF Lampu indikator kuning menyala AND Conveyor macet THEN Conveyor Jammed Ringan'),
('R14', 'Rule 14: Lem Meluber & Offset Dispenser AGM', 'G14', 'K08', 1.00, 'IF Hasil lem meluber ke samping / penyebaran tidak presisi THEN Parameter Dispenser Lem Tidak Presisi'),
('R15', 'Rule 15: Kebocoran Selang Pneumatik AirTightness', 'G16', 'K04', 1.00, 'IF Terdapat kebocoran suara hembusan pada selang pneumatik THEN Sistem Pneumatic Bermasalah'),
('R16', 'Rule 16: Indikasi Kerusakan Sensor Pengujian AirTightness', 'G15', 'K03', 0.90, 'IF Hasil uji AirTightness muncul status NG secara terus-menerus THEN Sensor Error'),
('R17', 'Rule 17: Overpressure Sensor Press 3 in 1 (>418)', 'G17', 'K09', 1.00, 'IF Angka tekanan bagian belakang melebihi batas (>418) THEN Sensor Tekanan Overpressure'),
('R18', 'Rule 18: Barcode Camera Error Coldpress Battery', 'G18', 'K10', 1.00, 'IF Kamera sensor tidak dapat membaca barcode pada baterai THEN Kamera Barcode / Silinder Rusak'),
('R19', 'Rule 19: Aktuator Press Tidak Turun Coldpress Battery', 'G19', 'K10', 1.00, 'IF Bagian press dingin tidak mau turun saat siklus dimulai THEN Kamera Barcode / Silinder Rusak'),
('R20', 'Rule 20: Kerusakan Berulang Siklus 4 Jam Coldpress', 'G20', 'K10', 0.95, 'IF Alarm gangguan muncul berulang secara berkala per 4 jam THEN Kamera Barcode / Silinder Rusak');

-- ----------------------------------------------------------------------------
-- 6. TABEL RIWAYAT DIAGNOSA
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_diagnosa` (
  `id` VARCHAR(30) NOT NULL,
  `id_user` VARCHAR(20) NOT NULL,
  `nama_user` VARCHAR(120) NOT NULL,
  `id_mesin` VARCHAR(20) NOT NULL,
  `nama_mesin` VARCHAR(120) NOT NULL,
  `gejala_terpilih` TEXT NOT NULL,
  `id_kerusakan` VARCHAR(20) NOT NULL,
  `nama_kerusakan` VARCHAR(180) NOT NULL,
  `tingkat` VARCHAR(30) NOT NULL,
  `persentase` INT NOT NULL DEFAULT 100,
  `solusi` TEXT,
  `waktu` VARCHAR(50) NOT NULL,
  `status_panggilan` VARCHAR(40) NOT NULL DEFAULT 'Selesai',
  `catatan_operator` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_diag_user` (`id_user`),
  KEY `idx_diag_mesin` (`id_mesin`),
  KEY `idx_diag_kerusakan` (`id_kerusakan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_diagnosa` (`id`, `id_user`, `nama_user`, `id_mesin`, `nama_mesin`, `gejala_terpilih`, `id_kerusakan`, `nama_kerusakan`, `tingkat`, `persentase`, `solusi`, `waktu`, `status_panggilan`, `catatan_operator`) VALUES
('DIAG-001', 'U01', 'Budi Santoso', 'M01', 'Mesin ASM (Automatic Screw Manual)', '["G01","G02"]', 'K01', 'Power Supply Rusak', 'Parah', 100, 'Ganti kabel power dan cek tegangan listrik PLN/regulator.', '2026-11-15 08:30', 'Selesai', 'Mesin mati mendadak saat shift pagi baru dimulai.'),
('DIAG-002', 'U01', 'Budi Santoso', 'M02', 'Mesin AGM (Automatic Glue Manual)', '["G03","G04"]', 'K02', 'Motor Conveyor Rusak', 'Parah', 100, 'Ganti motor conveyor dan cek gearbox mekanis.', '2026-11-15 11:15', 'Sedang Ditangani', 'Terdengar bau sangit dan motor conveyor macet total.'),
('DIAG-003', 'U01', 'Budi Santoso', 'M03', 'Mesin Press 3 in 1', '["G05","G06"]', 'K03', 'Sensor Error', 'Sedang', 100, 'Kalibrasi sensor dan cek kabel sensor.', '2026-11-15 14:00', 'Menunggu Teknisi', 'Alarm berbunyi intermittent saat penekanan bodi smartphone.'),
('DIAG-004', 'U01', 'Budi Santoso', 'M04', 'Mesin AirTightness', '["G07","G08"]', 'K04', 'Sistem Pneumatic Bermasalah', 'Parah', 100, 'Cek tekanan udara dan selang pneumatic.', '2026-11-16 07:45', 'Menunggu Teknisi', 'Tekanan udara ngedrop dari 6 bar ke 2 bar.'),
('DIAG-005', 'U01', 'Budi Santoso', 'M01', 'Mesin ASM', '["G09","G10"]', 'K05', 'Overheat Mesin', 'Sedang', 100, 'Matikan mesin sementara dan cek pendingin.', '2026-11-16 08:05', 'Selesai', 'Bodi kontroler panas tinggi, kipas pendingin kotor.');

-- ----------------------------------------------------------------------------
-- 7. TABEL TIKET PERBAIKAN (ANTREAN MAINTENANCE)
-- ----------------------------------------------------------------------------
CREATE TABLE `tb_tiket_perbaikan` (
  `id` VARCHAR(30) NOT NULL,
  `id_diagnosa` VARCHAR(30) DEFAULT NULL,
  `id_operator` VARCHAR(20) NOT NULL,
  `nama_operator` VARCHAR(120) NOT NULL,
  `id_mesin` VARCHAR(20) NOT NULL,
  `nama_mesin` VARCHAR(120) NOT NULL,
  `lokasi` VARCHAR(150) NOT NULL,
  `kerusakan` VARCHAR(180) NOT NULL,
  `tingkat` VARCHAR(30) NOT NULL DEFAULT 'Parah',
  `persentase` INT NOT NULL DEFAULT 100,
  `catatan_operator` TEXT,
  `urgensi` ENUM('Normal', 'Urgent', 'Emergency') NOT NULL DEFAULT 'Urgent',
  `waktu_panggilan` VARCHAR(50) NOT NULL,
  `status` ENUM('Menunggu Teknisi', 'Sedang Ditangani', 'Selesai') NOT NULL DEFAULT 'Menunggu Teknisi',
  `teknisi_penanggung` VARCHAR(120) DEFAULT NULL,
  `waktu_mulai` VARCHAR(50) DEFAULT NULL,
  `waktu_selesai` VARCHAR(50) DEFAULT NULL,
  `tindakan_teknisi` TEXT,
  `rekomendasi_teknisi` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tiket_operator` (`id_operator`),
  KEY `idx_tiket_mesin` (`id_mesin`),
  KEY `idx_tiket_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_tiket_perbaikan` (`id`, `id_diagnosa`, `id_operator`, `nama_operator`, `id_mesin`, `nama_mesin`, `lokasi`, `kerusakan`, `tingkat`, `persentase`, `catatan_operator`, `urgensi`, `waktu_panggilan`, `status`, `teknisi_penanggung`, `waktu_mulai`, `waktu_selesai`, `tindakan_teknisi`, `rekomendasi_teknisi`) VALUES
('TCK-2026-001', 'DIAG-002', 'U01', 'Budi Santoso (Operator)', 'M02', 'Mesin AGM (Automatic Glue Manual)', 'Line Dispensing 2', 'Motor Conveyor Rusak', 'Parah', 100, 'Conveyor mati total saat proses produksi berlangsung. Motor penggerak panas.', 'Urgent', '2026-11-15 11:20', 'Sedang Ditangani', 'Rian Kurniawan (Teknisi)', '2026-11-15 11:35', NULL, 'Sedang melakukan pelepasan motor servo konveyor dan penggantian unit cadangan.', 'Perlu penggantian motor conveyor baru part #MTR-AGM-04.'),
('TCK-2026-002', 'DIAG-004', 'U01', 'Budi Santoso (Operator)', 'M04', 'Mesin AirTightness', 'Line QC & Reliability', 'Sistem Pneumatic Bermasalah', 'Parah', 100, 'Tekanan udara tidak stabil, pengujian waterproof menghasilkan NG berulang.', 'Emergency', '2026-11-16 07:50', 'Menunggu Teknisi', NULL, NULL, NULL, '', ''),
('TCK-2026-003', 'DIAG-001', 'U01', 'Budi Santoso (Operator)', 'M01', 'Mesin ASM', 'Line Assembly 1', 'Power Supply Rusak', 'Parah', 100, 'Mesin mati mendadak saat awal shift.', 'Urgent', '2026-11-15 08:35', 'Selesai', 'Rian Kurniawan (Teknisi)', '2026-11-15 08:45', '2026-11-15 09:20', 'Penggantian kabel power 3-phase dan perbaikan sekring putus pada unit regulator.', 'Tegangan telah diuji stabil di 220V AC ± 2%. Mesin sudah siap beroperasi normal kembali.');
