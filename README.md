# Sistem Pakar Troubleshooting Mesin Produksi Berbasis Web
**Metode: Forward Chaining | Studi Kasus: PT Vivo Mobile Indonesia**

Aplikasi sistem pakar berbasis React.js dan Tailwind CSS yang dirancang untuk membantu operator dan teknisi dalam melakukan identifikasi awal (troubleshooting) terhadap gangguan atau kerusakan mesin pabrik secara cepat, terstruktur, dan akurat menggunakan penalaran **Forward Chaining (IF–THEN)**.

Aplikasi ini dibangun secara komprehensif berdasarkan **dua dokumen panduan**:
1. **Dokumen 1**: Struktur Normalisasi Database (UNF, 1NF, 2NF, 3NF), Relasi Antar Tabel, Use Case Diagram, ERD, Flowchart Sistem Lama vs Usulan, Activity Diagram (Login, Diagnosa, Panggil Teknisi, Perbaikan), dan Sequence Diagram.
2. **Dokumen 2**: Logbook Pengamatan Lapangan PT Vivo Mobile Indonesia, Rumus Perhitungan Persentase Diagnosa, Kategori Kerusakan (Ringan, Sedang, Parah), serta Karakteristik 5 Mesin Produksi (ASM, AGM, AirTightness, Press 3 in 1, dan Control Coldpress Pressure).

---

## 🚀 Lokasi Instalasi
Aplikasi ini telah disimpan dan di-build secara lengkap di:
```text
D:\sistem-pakar-troubleshooting-mesin\
```

---

## 🛠️ Cara Menjalankan Website

### Cara Cepat (Windows):
1. Buka folder `D:\sistem-pakar-troubleshooting-mesin\`
2. Klik ganda file **`jalankan_aplikasi.bat`**
3. Buka browser di alamat: [http://localhost:5173](http://localhost:5173)

### Cara Manual via Terminal / PowerShell:
```powershell
cd D:\sistem-pakar-troubleshooting-mesin
npm run dev
```

---

## 👥 Direktori Akun Personel Terdaftar (Autentikasi Produksi)
Berikut adalah daftar akun kredensial yang dapat digunakan untuk masuk ke dalam sistem:

| Role | Username | Password | Nama Personel | NIP / Penugasan | Wewenang & Akses (Pembeda Aktor) |
|---|---|---|---|---|---|
| **Operator** | `Operator` | `Operator1` | Budi Santoso | EMP-VVO-2024-081 (Shift 1) | **Membuat Antrean**: Diagnosa mesin, buat tiket antrean perbaikan (`+ Buat Antrean Baru`), panggil teknisi. *Tidak dapat memproses atau menyelesaikan tiket.* |
| **Teknisi** | `Teknisi` | `Teknisi1` | Rian Kurniawan | ENG-VVO-2021-019 (Lead) | **Memproses Antrean**: Menerima antrean (`Ambil Penanganan`), input tindakan teknisi, input penggantian spare part, dan konfirmasi selesai. *Tidak membuat antrean.* |
| **Operator** | `operator.dispensing` | `Dispensing2026` | Dimas Pratama | EMP-VVO-2025-112 (Shift 1) | **Membuat Antrean**: Operator khusus lini dispensing lem perekat smartphone (Mesin AGM). |
| **Operator** | `operator.qc` | `Airtight2026` | Siti Nurhaliza | QC-VVO-2024-044 (Shift 2) | **Membuat Antrean**: Operator pengujian kedap air & ketahanan tekanan (Mesin AirTightness). |
| **Supervisor** | `supervisor` | `Supervisor2026` | Hendra Wijaya | SPV-VVO-2019-003 (All Shifts) | **Hanya Dapat Melihat (Read-Only)**: Monitoring antrean perbaikan, audit durasi teknisi, dan melihat detail SPK. *Tidak dapat membuat, mengambil, atau mengubah status tiket.* |

---

## ⚙️ Fitur-Fitur Utama Aplikasi

### 1. Mesin Inferensi Forward Chaining Interaktif
- **Pemilihan Mesin**: Memilih salah satu dari 5 mesin produksi smartphone.
- **Daftar Gejala Dinamis**: Checkbox gejala dengan pencarian real-time dan pengelompokan kategori (Elektrikal, Mekanikal, Sensorik, Pneumatik, Termal).
- **Preset Skenario Uji Cepat**: Memungkinkan pengujian instan skenario kerusakan Dokumen 1 (Kasus 1 s/d 5) dan Dokumen 2 (Kasus 6 s/d 8).
- **Perhitungan Rumus Sesuai Dokumen 2**:
  $$\text{Persentase Diagnosa} = \frac{\text{Jumlah Gejala yang Cocok}}{\text{Total Gejala pada Rule Kerusakan}} \times 100\%$$
- **Klasifikasi Kondisi Mesin**:
  - **Ringan** (< 50% atau masalah operasional seperti silicone miring atau conveyor jam ringan: operator dapat mengatasi mandiri sesuai SOP).
  - **Sedang** (50% - 79%: pemeriksaan parameter lanjutan).
  - **Parah** (≥ 80% atau kerusakan mekanik/sensorik berat: sistem otomatis memunculkan tombol **"Panggil Teknisi Sekarang"**).
- **Visualisasi Rantai Penalaran (Reasoning Trace)**: Menampilkan langkah penelusuran fakta (*Fact Gathering → Rule Matching → Conflict Resolution → Inferred Conclusion*).

### 2. Modul Panggilan & Antrean Tiket Perbaikan (Activity & Sequence Diagram)
- **Form Panggil Teknisi**: Operator mengirim detail keluhan, lokasi lini, dan tingkat urgensi produksi (Normal, Urgent, Emergency).
- **Antrean Teknisi**: Menampilkan status real-time (*Menunggu Teknisi*, *Sedang Ditangani*, *Selesai*).
- **Konfirmasi Perbaikan Selesai**: Teknisi menginput tindakan perbaikan mekanik/elektrik, spare part yang diganti, serta rekomendasi pemeliharaan berkala.

## 🖥️ Struktur Menu Operasional Lini Produksi (Clean Industrial UI)
Sesuai arahan untuk efisiensi operator di lantai pabrik, menu navigasi utama difokuskan pada 3 modul esensial:
1. **Diagnosa Mesin (`diagnosa`)**: Input gejala, komputasi Forward Chaining, visualisasi reasoning trace, tindakan SOP mandiri / panggil teknisi, dan cetak SPK resmi.
2. **Antrean Perbaikan (`tiket`)**: Monitoring tiket kerusakan mesin, penugasan teknisi (*Sedang Ditangani*), input penggantian sparepart & konfirmasi selesai (*Selesai*).
3. **Profil Mesin Pabrik (`studi-kasus`)**: Katalog spesifikasi teknis 5 mesin utama PT Vivo Mobile Indonesia (ASM, AGM, AirTightness, Press 3 in 1, Control Coldpress Pressure) beserta SOP penanganan indikator kuning vs merah.

### 5. Profil Studi Kasus 5 Mesin Pabrik PT Vivo Mobile Indonesia
- **Mesin ASM (Automatic Screw Manual)**: Pemasangan baut smartphone, masalah feeder macet, silicone miring, indikator kuning vs merah.
- **Mesin AGM (Automatic Glue Manual)**: Dispenser lem frame smartphone, masalah conveyor macet, SOP Stop–Reset–Run, lem meluber.
- **Mesin AirTightness**: Pengujian kedap air (waterproof IP test), kebocoran selang, fluktuasi tekanan pneumatik, status NG terus-menerus.
- **Mesin Press 3 in 1**: Penekanan 4 sisi bodi smartphone, sensor overpressure (>418), alarm buzzer.
- **Mesin Control Coldpress Pressure**: Press dingin baterai, kamera barcode vision error, silinder tidak turun, alarm berkala per 4 jam operasi.

### 6. Cetak Lembar Kerja / Surat Perintah Kerja (SPK)
- Dokumen SPK standar industri yang siap dicetak langsung (`window.print()`) dengan kop surat PT Vivo Mobile Indonesia, rincian fakta gejala, kesimpulan inferensi, solusi, dan kolom tanda tangan operator serta teknisi.

---

## 📁 Struktur Direktori Proyek
```text
D:\sistem-pakar-troubleshooting-mesin\
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── jalankan_aplikasi.bat
├── README.md
└── src\
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── data\
    │   └── initialData.js           # Basis data 3NF, rules, mesin, gejala, kerusakan, tiket
    ├── utils\
    │   └── forwardChaining.js       # Engine inferensi Forward Chaining & kalkulator persentase
    └── components\
        ├── Navbar.jsx               # Header navigasi, badge tiket, switch role
        ├── DiagnosaView.jsx         # Halaman utama diagnosa operator & reasoning trace
        ├── TiketPerbaikanView.jsx   # Antrean tiket & form input perbaikan teknisi
        ├── KnowledgeBaseView.jsx    # Manajemen CRUD Gejala, Kerusakan, dan Rules
        ├── NormalizationDocView.jsx # Dokumentasi interaktif UNF, 1NF, 2NF, 3NF
        ├── DiagramsView.jsx         # Visualizer Use Case, ERD, Flowchart, Activity, Sequence
        ├── CaseStudyView.jsx        # Profil studi kasus 5 mesin PT Vivo Mobile Indonesia
        ├── CallTechnicianModal.jsx  # Modal form panggil teknisi
        ├── PrintSpkModal.jsx        # Modal preview cetak SPK diagnosa resmi
        └── LoginModal.jsx           # Modal login autentikasi Operator & Teknisi
```
