// Basis Data Sistem Pakar Troubleshooting Mesin Produksi
// Berdasarkan Dokumen 1 (Normalisasi & UML) dan Dokumen 2 (Logbook Studi Kasus PT Vivo Mobile Indonesia)

export const INITIAL_USERS = [
  {
    id: 'U01',
    username: 'Operator',
    password: 'Operator1',
    role: 'Operator',
    nama: 'Budi Santoso',
    jabatan: 'Operator Lini Assembly (ASM)',
    avatar: 'BS',
    nip: 'EMP-VVO-2024-081',
    shift: 'Shift 1 (Pagi)'
  },
  {
    id: 'U02',
    username: 'Teknisi',
    password: 'Teknisi1',
    role: 'Teknisi',
    nama: 'Rian Kurniawan',
    jabatan: 'Lead Maintenance & Automation Engineer',
    avatar: 'RK',
    nip: 'ENG-VVO-2021-019',
    shift: 'General Maintenance'
  },
  {
    id: 'U03',
    username: 'operator.dispensing',
    password: 'Dispensing2026',
    role: 'Operator',
    nama: 'Dimas Pratama',
    jabatan: 'Operator Lini Dispensing Lem (AGM)',
    avatar: 'DP',
    nip: 'EMP-VVO-2025-112',
    shift: 'Shift 1 (Pagi)'
  },
  {
    id: 'U04',
    username: 'operator.qc',
    password: 'Airtight2026',
    role: 'Operator',
    nama: 'Siti Nurhaliza',
    jabatan: 'Quality Control & AirTightness Tester',
    avatar: 'SN',
    nip: 'QC-VVO-2024-044',
    shift: 'Shift 2 (Siang)'
  },
  {
    id: 'U05',
    username: 'supervisor',
    password: 'Supervisor2026',
    role: 'Supervisor',
    nama: 'Hendra Wijaya',
    jabatan: 'Production Maintenance & Engineering Supervisor',
    avatar: 'HW',
    nip: 'SPV-VVO-2019-003',
    shift: 'All Shifts Oversight'
  }
];

export const INITIAL_MACHINES = [
  {
    id: 'M01',
    kode: 'ASM',
    nama: 'Mesin ASM (Automatic Screw Manual)',
    fungsi: 'Pemasangan baut otomatis pada modul dan casing smartphone',
    lokasi: 'Line Assembly 1 - PT Vivo Mobile Indonesia',
    icon: 'Wrench',
    status: 'Aktif',
    deskripsi: 'Mesin presisi untuk proses screw tightening. Dilengkapi sensor torsi, jalur feeder baut otomatis, dan indikator status OK/NG (kuning/merah).'
  },
  {
    id: 'M02',
    kode: 'AGM',
    nama: 'Mesin AGM (Automatic Glue Manual)',
    fungsi: 'Pemberian dan dispensing lem perekat pada frame smartphone',
    lokasi: 'Line Dispensing 2 - PT Vivo Mobile Indonesia',
    icon: 'Droplets',
    status: 'Aktif',
    deskripsi: 'Mesin dispensing lem berkecepatan tinggi dengan konveyor otomatis dan sistem pemanas nozzle. Sering mengalami kendala konveyor macet atau lem meluber.'
  },
  {
    id: 'M03',
    kode: 'PRESS3IN1',
    nama: 'Mesin Press 3 in 1',
    fungsi: 'Penekanan komponen smartphone sisi depan, belakang, dan samping',
    lokasi: 'Line Casing Press - PT Vivo Mobile Indonesia',
    icon: 'Maximize2',
    status: 'Aktif',
    deskripsi: 'Mesin multi-axis pneumatic press dengan sensor pembaca batas tekanan (standar tekanan maks ~418). Dilengkapi alarm overpressure.'
  },
  {
    id: 'M04',
    kode: 'AIRTIGHT',
    nama: 'Mesin AirTightness',
    fungsi: 'Pengujian ketahanan kedap air (waterproof IP test) pada smartphone',
    lokasi: 'Line QC & Reliability - PT Vivo Mobile Indonesia',
    icon: 'ShieldCheck',
    status: 'Aktif',
    deskripsi: 'Mesin pendeteksi kebocoran melalui tekanan udara negatif/positif. Mendeteksi kebocoran sekecil mikro-bar pada perangkat smartphone.'
  },
  {
    id: 'M05',
    kode: 'COLDPRESS',
    nama: 'Mesin Control Coldpress Pressure',
    fungsi: 'Penekanan dingin baterai smartphone agar melekat presisi',
    lokasi: 'Line Battery Assembly - PT Vivo Mobile Indonesia',
    icon: 'BatteryCharging',
    status: 'Aktif',
    deskripsi: 'Mesin press dingin baterai yang dilengkapi kamera pemindai barcode baterai dan silinder press pneumatik vertikal.'
  }
];

export const INITIAL_GEJALA = [
  // 10 Gejala Pokok Sesuai Dokumen 1 (G01 - G10)
  {
    id: '1',
    kode: 'G01',
    nama: 'Mesin tidak menyala sama sekali',
    mesinId: 'M01',
    mesinNama: 'Mesin ASM',
    kategori: 'Elektrikal'
  },
  {
    id: '2',
    kode: 'G02',
    nama: 'Lampu indikator mesin mati',
    mesinId: 'M01',
    mesinNama: 'Mesin ASM',
    kategori: 'Elektrikal'
  },
  {
    id: '3',
    kode: 'G03',
    nama: 'Conveyor / kompayer macet atau berhenti',
    mesinId: 'M02',
    mesinNama: 'Mesin AGM',
    kategori: 'Mekanikal'
  },
  {
    id: '4',
    kode: 'G04',
    nama: 'Motor penggerak conveyor terasa sangat panas',
    mesinId: 'M02',
    mesinNama: 'Mesin AGM',
    kategori: 'Motorik'
  },
  {
    id: '5',
    kode: 'G05',
    nama: 'Sensor pembaca gagal membaca posisi atau parameter',
    mesinId: 'M03',
    mesinNama: 'Mesin Press 3 in 1',
    kategori: 'Sensorik'
  },
  {
    id: '6',
    kode: 'G06',
    nama: 'Alarm mesin aktif berbunyi terus menerus',
    mesinId: 'M03',
    mesinNama: 'Mesin Press 3 in 1',
    kategori: 'Sistem'
  },
  {
    id: '7',
    kode: 'G07',
    nama: 'Tekanan udara tidak stabil atau turun drastis',
    mesinId: 'M04',
    mesinNama: 'Mesin AirTightness',
    kategori: 'Pneumatik'
  },
  {
    id: '8',
    kode: 'G08',
    nama: 'Suara mesin terdengar kasar dan berisik',
    mesinId: 'M04',
    mesinNama: 'Mesin AirTightness',
    kategori: 'Mekanikal'
  },
  {
    id: '9',
    kode: 'G09',
    nama: 'Mesin tiba-tiba berhenti saat sedang beroperasi',
    mesinId: 'M01',
    mesinNama: 'Mesin ASM',
    kategori: 'Sistem'
  },
  {
    id: '10',
    kode: 'G10',
    nama: 'Suhu bodi atau modul mesin mengalami overheat',
    mesinId: 'M01',
    mesinNama: 'Mesin ASM',
    kategori: 'Termal'
  },
  // Gejala Tambahan Berdasarkan Dokumen 2 (Hasil Observasi PT Vivo Mobile Indonesia)
  {
    id: '11',
    kode: 'G11',
    nama: 'Baut macet di jalur keluar (feeder track)',
    mesinId: 'M01',
    mesinNama: 'Mesin ASM',
    kategori: 'Mekanikal'
  },
  {
    id: '12',
    kode: 'G12',
    nama: 'Silicone smartphone terangkat atau pemasangan tidak rapi',
    mesinId: 'M01',
    mesinNama: 'Mesin ASM',
    kategori: 'Material'
  },
  {
    id: '13',
    kode: 'G13',
    nama: 'Lampu indikator kuning menyala (Status NG Ringan)',
    mesinId: 'M02',
    mesinNama: 'Mesin AGM',
    kategori: 'Indikator'
  },
  {
    id: '14',
    kode: 'G14',
    nama: 'Hasil lem meluber ke samping / penyebaran tidak presisi',
    mesinId: 'M02',
    mesinNama: 'Mesin AGM',
    kategori: 'Dispenser'
  },
  {
    id: '15',
    kode: 'G15',
    nama: 'Hasil uji AirTightness muncul status NG secara terus-menerus',
    mesinId: 'M04',
    mesinNama: 'Mesin AirTightness',
    kategori: 'Pengujian'
  },
  {
    id: '16',
    kode: 'G16',
    nama: 'Terdapat kebocoran suara hembusan pada selang pneumatik mesin',
    mesinId: 'M04',
    mesinNama: 'Mesin AirTightness',
    kategori: 'Pneumatik'
  },
  {
    id: '17',
    kode: 'G17',
    nama: 'Angka tekanan bagian belakang melebihi batas (di atas standar 418)',
    mesinId: 'M03',
    mesinNama: 'Mesin Press 3 in 1',
    kategori: 'Pneumatik'
  },
  {
    id: '18',
    kode: 'G18',
    nama: 'Kamera sensor tidak dapat membaca barcode pada baterai',
    mesinId: 'M05',
    mesinNama: 'Mesin Control Coldpress Pressure',
    kategori: 'Vision Sensor'
  },
  {
    id: '19',
    kode: 'G19',
    nama: 'Bagian press dingin tidak mau turun saat siklus dimulai',
    mesinId: 'M05',
    mesinNama: 'Mesin Control Coldpress Pressure',
    kategori: 'Aktuator'
  },
  {
    id: '20',
    kode: 'G20',
    nama: 'Alarm gangguan muncul berulang secara berkala (setiap ~4 jam kerja)',
    mesinId: 'M05',
    mesinNama: 'Mesin Control Coldpress Pressure',
    kategori: 'Sistem'
  }
];

export const INITIAL_KERUSAKAN = [
  // 5 Kerusakan Pokok Sesuai Dokumen 1 (K01 - K05)
  {
    id: '1',
    kode: 'K01',
    nama: 'Power Supply Rusak',
    tingkat: 'Parah',
    kategori: 'Kritis',
    penangananOleh: 'Teknisi',
    solusi: 'Ganti kabel power dan cek tegangan listrik PLN/regulator. Lakukan pengecekan trafo dan fuse internal.',
    tindakanOperator: 'Matikan switch utama mesin, jangan menyentuh kabel telanjang, segera laporkan ke teknisi.',
    rekomendasiTeknisi: 'Uji kontinuitas kabel power menggunakan multimeter, cek modul power switching 24V DC, ganti jika terbakar.'
  },
  {
    id: '2',
    kode: 'K02',
    nama: 'Motor Conveyor Rusak',
    tingkat: 'Parah',
    kategori: 'Mekanik & Drive',
    penangananOleh: 'Teknisi',
    solusi: 'Ganti motor conveyor dan cek gearbox mekanis serta bearing penggerak belt.',
    tindakanOperator: 'Hentikan siklus conveyor melalui tombol emergency/stop agar beban motor tidak memicu korsleting.',
    rekomendasiTeknisi: 'Bongkar bracket motor stepper/servo conveyor, periksa tahanan kumparan motor dan pelumasan bearing.'
  },
  {
    id: '3',
    kode: 'K03',
    nama: 'Sensor Error',
    tingkat: 'Sedang',
    kategori: 'Instrumen',
    penangananOleh: 'Teknisi',
    solusi: 'Kalibrasi sensor dan cek kabel sensor. Bersihkan optik sensor dari debu atau residu proses.',
    tindakanOperator: 'Cek apakah ada benda asing menghalangi sensor, bersihkan perlahan dengan kain microfiber kering.',
    rekomendasiTeknisi: 'Lakukan alignment sensor jarak/proximity, periksa tegangan output analog/digital sensor, ganti kabel sensor jika putus jepit.'
  },
  {
    id: '4',
    kode: 'K04',
    nama: 'Sistem Pneumatic Bermasalah',
    tingkat: 'Parah',
    kategori: 'Pneumatik Tekanan',
    penangananOleh: 'Teknisi',
    solusi: 'Cek tekanan udara utama pabrik dan periksa sambungan selang pneumatic dari kebocoran.',
    tindakanOperator: 'Periksa manometer tekanan udara di regulator mesin, jika di bawah standar segera beritahu teknisi.',
    rekomendasiTeknisi: 'Cari titik kebocoran menggunakan spray deteksi kebocoran, potong dan pasang fitting selang baru, setel regulator ke tekanan kerja standar.'
  },
  {
    id: '5',
    kode: 'K05',
    nama: 'Overheat Mesin',
    tingkat: 'Sedang',
    kategori: 'Termal',
    penangananOleh: 'Operator / Teknisi',
    solusi: 'Matikan mesin sementara dan cek kipas pendingin serta ventilasi udara pendingin mesin.',
    tindakanOperator: 'Lakukan shutdown mesin sesuai SOP selama 15-20 menit. Pastikan sirkulasi kipas pendingin tidak tertutup box material.',
    rekomendasiTeknisi: 'Bersihkan heatsink pendingin CPU kontroler, ganti pasta termal jika perlu, dan periksa RPM exhaust fan.'
  },
  // Kerusakan Tambahan Sesuai Dokumen 2 (Studi Kasus PT Vivo Mobile Indonesia)
  {
    id: '6',
    kode: 'K06',
    nama: 'Jalur Feeder Baut Tersumbat & Pemasangan Silicone NG',
    tingkat: 'Ringan',
    kategori: 'Operasional Ringan',
    penangananOleh: 'Operator',
    solusi: 'Rapikan posisi silicone secara manual sesuai standar SOP dan lakukan pengetukan ringan pada jalur baut agar getaran melancarkan luncuran baut.',
    tindakanOperator: 'Operator dapat menangani mandiri: rapikan silicone, ketuk rel jalur baut, lalu uji 1 siklus manual tanpa memanggil teknisi.',
    rekomendasiTeknisi: 'Jika kemacetan baut terulang lebih dari 3x berturut-turut, teknisi akan membersihkan debu magnetik pada trek feeder.'
  },
  {
    id: '7',
    kode: 'K07',
    nama: 'Conveyor Jammed Ringan (Mesin AGM)',
    tingkat: 'Ringan',
    kategori: 'Operasional Ringan',
    penangananOleh: 'Operator',
    solusi: 'Lakukan prosedur reset pada komputer kontrol mesin: tekan tombol STOP -> tekan RESET -> tekan RUN untuk melanjutkan operasi normal.',
    tindakanOperator: 'Bisa langsung ditangani operator tanpa menunggu teknisi. Ikuti menu panel kontrol AGM: Stop -> Reset -> Run.',
    rekomendasiTeknisi: 'Periksa ketegangan belt conveyor saat waktu maintenance mingguan.'
  },
  {
    id: '8',
    kode: 'K08',
    nama: 'Parameter Dispenser Lem Tidak Presisi / Nozzle Meluber',
    tingkat: 'Parah',
    kategori: 'Kalibrasi Presisi',
    penangananOleh: 'Teknisi',
    solusi: 'Lakukan kalibrasi ulang koordinat dispensing lem dan periksa pengaturan tekanan jarum nozzle pada komputer kontrol mesin AGM.',
    tindakanOperator: 'Segera tekan stop dan panggil teknisi. Jangan mengubah parameter koordinat program dispenser lem sendiri.',
    rekomendasiTeknisi: 'Lakukan zero-point calibration, uji dispensasi tes dot lem di lembar kalibrasi, bersihkan sisa lem mengering di tip nozzle.'
  },
  {
    id: '9',
    kode: 'K09',
    nama: 'Sensor Tekanan Press 3 in 1 Mengalami Overpressure Drift',
    tingkat: 'Parah',
    kategori: 'Kalibrasi Tekanan',
    penangananOleh: 'Teknisi',
    solusi: 'Lakukan kalibrasi load cell sensor tekanan dan setting ulang ambang batas limit tekanan mesin (standar 418).',
    tindakanOperator: 'Hentikan proses press produk untuk mencegah retak pada kaca/casing smartphone, segera panggil teknisi.',
    rekomendasiTeknisi: 'Ukur tegangan output load cell, lakukan tare kalibrasi dengan anak timbang referensi, reset nilai limit pada PLC.'
  },
  {
    id: '10',
    kode: 'K10',
    nama: 'Kamera Barcode Reader Kotor / Silinder Press Dingin Baterai Macet',
    tingkat: 'Parah',
    kategori: 'Vision & Aktuator',
    penangananOleh: 'Teknisi',
    solusi: 'Bersihkan lensa kamera vision, setel fokus pencahayaan LED barcode, dan lakukan kalibrasi limit switch silinder pneumatik press baterai.',
    tindakanOperator: 'Kondisi berulang setiap ~4 jam menunjukkan gangguan serius. Hentikan lini dan panggil teknisi segera.',
    rekomendasiTeknisi: 'Lakukan recalibration exposure kamera Cognex/Keyence, lumasi rod silinder press baterai, reset log error PLC.'
  }
];

export const INITIAL_RULES = [
  // Rule Pokok Dokumen 1 (Rule 1 s/d 10)
  {
    id: 'R01',
    namaRule: 'Rule 01: Indikasi Power Supply Mati Total',
    kodeGejala: 'G01',
    kodeKerusakan: 'K01',
    bobot: 1.0,
    kondisi: 'IF Mesin tidak menyala sama sekali THEN Power Supply Rusak'
  },
  {
    id: 'R02',
    namaRule: 'Rule 02: Indikasi Lampu Indikator Power Hilang',
    kodeGejala: 'G02',
    kodeKerusakan: 'K01',
    bobot: 1.0,
    kondisi: 'IF Lampu indikator mesin mati THEN Power Supply Rusak'
  },
  {
    id: 'R03',
    namaRule: 'Rule 03: Indikasi Motor Conveyor Macet',
    kodeGejala: 'G03',
    kodeKerusakan: 'K02',
    bobot: 1.0,
    kondisi: 'IF Conveyor / kompayer macet atau berhenti THEN Motor Conveyor Rusak'
  },
  {
    id: 'R04',
    namaRule: 'Rule 04: Indikasi Overheating Motor Conveyor',
    kodeGejala: 'G04',
    kodeKerusakan: 'K02',
    bobot: 1.0,
    kondisi: 'IF Motor penggerak conveyor terasa sangat panas THEN Motor Conveyor Rusak'
  },
  {
    id: 'R05',
    namaRule: 'Rule 05: Indikasi Sensor Gagal Membaca Data',
    kodeGejala: 'G05',
    kodeKerusakan: 'K03',
    bobot: 1.0,
    kondisi: 'IF Sensor pembaca gagal membaca posisi atau parameter THEN Sensor Error'
  },
  {
    id: 'R06',
    namaRule: 'Rule 06: Indikasi Alarm Peringatan Sensor Aktif',
    kodeGejala: 'G06',
    kodeKerusakan: 'K03',
    bobot: 1.0,
    kondisi: 'IF Alarm mesin aktif berbunyi terus menerus THEN Sensor Error'
  },
  {
    id: 'R07',
    namaRule: 'Rule 07: Indikasi Fluktuasi Tekanan Pneumatik',
    kodeGejala: 'G07',
    kodeKerusakan: 'K04',
    bobot: 1.0,
    kondisi: 'IF Tekanan udara tidak stabil atau turun drastis THEN Sistem Pneumatic Bermasalah'
  },
  {
    id: 'R08',
    namaRule: 'Rule 08: Indikasi Suara Kasar Komponen Pneumatik',
    kodeGejala: 'G08',
    kodeKerusakan: 'K04',
    bobot: 1.0,
    kondisi: 'IF Suara mesin terdengar kasar dan berisik THEN Sistem Pneumatic Bermasalah'
  },
  {
    id: 'R09',
    namaRule: 'Rule 09: Indikasi Interupsi Sistem Akibat Panas',
    kodeGejala: 'G09',
    kodeKerusakan: 'K05',
    bobot: 1.0,
    kondisi: 'IF Mesin tiba-tiba berhenti saat sedang beroperasi THEN Overheat Mesin'
  },
  {
    id: 'R10',
    namaRule: 'Rule 10: Indikasi Temperatur Tinggi Modul Mesin',
    kodeGejala: 'G10',
    kodeKerusakan: 'K05',
    bobot: 1.0,
    kondisi: 'IF Suhu bodi atau modul mesin mengalami overheat THEN Overheat Mesin'
  },
  // Rules Tambahan Berdasarkan Dokumen 2 (Studi Kasus PT Vivo Mobile Indonesia)
  {
    id: 'R11',
    namaRule: 'Rule 11: Gangguan Ringan Jalur Feeder Baut ASM',
    kodeGejala: 'G11',
    kodeKerusakan: 'K06',
    bobot: 0.9,
    kondisi: 'IF Baut macet di jalur keluar (feeder track) THEN Jalur Feeder Baut Tersumbat'
  },
  {
    id: 'R12',
    namaRule: 'Rule 12: Gangguan Posisi Silicone Smartphone ASM',
    kodeGejala: 'G12',
    kodeKerusakan: 'K06',
    bobot: 0.9,
    kondisi: 'IF Silicone smartphone terangkat atau pemasangan tidak rapi THEN Pemasangan Silicone NG'
  },
  {
    id: 'R13',
    namaRule: 'Rule 13: Conveyor Macet Ringan Panel AGM (Stop-Reset-Run)',
    kodeGejala: 'G13',
    kodeKerusakan: 'K07',
    bobot: 0.85,
    kondisi: 'IF Lampu indikator kuning menyala AND Conveyor macet THEN Conveyor Jammed Ringan'
  },
  {
    id: 'R14',
    namaRule: 'Rule 14: Lem Meluber & Offset Dispenser AGM',
    kodeGejala: 'G14',
    kodeKerusakan: 'K08',
    bobot: 1.0,
    kondisi: 'IF Hasil lem meluber ke samping / penyebaran tidak presisi THEN Parameter Dispenser Lem Tidak Presisi'
  },
  {
    id: 'R15',
    namaRule: 'Rule 15: Kebocoran Selang Pneumatik AirTightness',
    kodeGejala: 'G16',
    kodeKerusakan: 'K04',
    bobot: 1.0,
    kondisi: 'IF Terdapat kebocoran suara hembusan pada selang pneumatik THEN Sistem Pneumatic Bermasalah'
  },
  {
    id: 'R16',
    namaRule: 'Rule 16: Indikasi Kerusakan Sensor Pengujian AirTightness',
    kodeGejala: 'G15',
    kodeKerusakan: 'K03',
    bobot: 0.9,
    kondisi: 'IF Hasil uji AirTightness muncul status NG secara terus-menerus THEN Sensor Error'
  },
  {
    id: 'R17',
    namaRule: 'Rule 17: Overpressure Sensor Press 3 in 1 (>418)',
    kodeGejala: 'G17',
    kodeKerusakan: 'K09',
    bobot: 1.0,
    kondisi: 'IF Angka tekanan bagian belakang melebihi batas (>418) THEN Sensor Tekanan Overpressure'
  },
  {
    id: 'R18',
    namaRule: 'Rule 18: Barcode Camera Error Coldpress Battery',
    kodeGejala: 'G18',
    kodeKerusakan: 'K10',
    bobot: 1.0,
    kondisi: 'IF Kamera sensor tidak dapat membaca barcode pada baterai THEN Kamera Barcode / Silinder Rusak'
  },
  {
    id: 'R19',
    namaRule: 'Rule 19: Aktuator Press Tidak Turun Coldpress Battery',
    kodeGejala: 'G19',
    kodeKerusakan: 'K10',
    bobot: 1.0,
    kondisi: 'IF Bagian press dingin tidak mau turun saat siklus dimulai THEN Kamera Barcode / Silinder Rusak'
  },
  {
    id: 'R20',
    namaRule: 'Rule 20: Kerusakan Berulang Siklus 4 Jam Coldpress',
    kodeGejala: 'G20',
    kodeKerusakan: 'K10',
    bobot: 0.95,
    kondisi: 'IF Alarm gangguan muncul berulang secara berkala per 4 jam THEN Kamera Barcode / Silinder Rusak'
  }
];

export const INITIAL_DIAGNOSA_HISTORY = [
  {
    id: 'DIAG-001',
    idUser: 'U01',
    namaUser: 'Operator',
    idMesin: 'M01',
    namaMesin: 'Mesin ASM (Automatic Screw Manual)',
    gejalaTerpilih: ['G01', 'G02'],
    idKerusakan: 'K01',
    namaKerusakan: 'Power Supply Rusak',
    tingkat: 'Parah',
    persentase: 100,
    solusi: 'Ganti kabel power dan cek tegangan listrik PLN/regulator.',
    waktu: '2026-11-15 08:30',
    statusPanggilan: 'Selesai',
    catatanOperator: 'Mesin mati mendadak saat shift pagi baru dimulai.'
  },
  {
    id: 'DIAG-002',
    idUser: 'U01',
    namaUser: 'Operator',
    idMesin: 'M02',
    namaMesin: 'Mesin AGM (Automatic Glue Manual)',
    gejalaTerpilih: ['G03', 'G04'],
    idKerusakan: 'K02',
    namaKerusakan: 'Motor Conveyor Rusak',
    tingkat: 'Parah',
    persentase: 100,
    solusi: 'Ganti motor conveyor dan cek gearbox mekanis.',
    waktu: '2026-11-15 11:15',
    statusPanggilan: 'Sedang Ditangani',
    catatanOperator: 'Terdengar bau sangit dan motor conveyor macet total.'
  },
  {
    id: 'DIAG-003',
    idUser: 'U01',
    namaUser: 'Operator',
    idMesin: 'M03',
    namaMesin: 'Mesin Press 3 in 1',
    gejalaTerpilih: ['G05', 'G06'],
    idKerusakan: 'K03',
    namaKerusakan: 'Sensor Error',
    tingkat: 'Sedang',
    persentase: 100,
    solusi: 'Kalibrasi sensor dan cek kabel sensor.',
    waktu: '2026-11-15 14:00',
    statusPanggilan: 'Menunggu Teknisi',
    catatanOperator: 'Alarm berbunyi intermittent saat penekanan bodi smartphone.'
  },
  {
    id: 'DIAG-004',
    idUser: 'U01',
    namaUser: 'Operator',
    idMesin: 'M04',
    namaMesin: 'Mesin AirTightness',
    gejalaTerpilih: ['G07', 'G08'],
    idKerusakan: 'K04',
    namaKerusakan: 'Sistem Pneumatic Bermasalah',
    tingkat: 'Parah',
    persentase: 100,
    solusi: 'Cek tekanan udara dan selang pneumatic.',
    waktu: '2026-11-16 07:45',
    statusPanggilan: 'Menunggu Teknisi',
    catatanOperator: 'Tekanan udara ngedrop dari 6 bar ke 2 bar.'
  },
  {
    id: 'DIAG-005',
    idUser: 'U01',
    namaUser: 'Operator',
    idMesin: 'M01',
    namaMesin: 'Mesin ASM',
    gejalaTerpilih: ['G09', 'G10'],
    idKerusakan: 'K05',
    namaKerusakan: 'Overheat Mesin',
    tingkat: 'Sedang',
    persentase: 100,
    solusi: 'Matikan mesin sementara dan cek pendingin.',
    waktu: '2026-11-16 08:05',
    statusPanggilan: 'Selesai',
    catatanOperator: 'Bodi kontroler panas tinggi, kipas pendingin kotor.'
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'TCK-2026-001',
    idDiagnosa: 'DIAG-002',
    idOperator: 'U01',
    namaOperator: 'Budi Santoso (Operator)',
    idMesin: 'M02',
    namaMesin: 'Mesin AGM (Automatic Glue Manual)',
    lokasi: 'Line Dispensing 2',
    kerusakan: 'Motor Conveyor Rusak',
    tingkat: 'Parah',
    persentase: 100,
    catatanOperator: 'Conveyor mati total saat proses produksi berlangsung. Motor penggerak panas.',
    waktuPanggilan: '2026-11-15 11:20',
    status: 'Sedang Ditangani', // 'Menunggu Teknisi' | 'Sedang Ditangani' | 'Selesai'
    teknisiPenanggung: 'Rian Kurniawan (Teknisi)',
    waktuMulai: '2026-11-15 11:35',
    waktuSelesai: null,
    tindakanTeknisi: 'Sedang melakukan pelepasan motor servo konveyor dan penggantian unit cadangan.',
    rekomendasiTeknisi: 'Perlu penggantian motor conveyor baru part #MTR-AGM-04.'
  },
  {
    id: 'TCK-2026-002',
    idDiagnosa: 'DIAG-004',
    idOperator: 'U01',
    namaOperator: 'Budi Santoso (Operator)',
    idMesin: 'M04',
    namaMesin: 'Mesin AirTightness',
    lokasi: 'Line QC & Reliability',
    kerusakan: 'Sistem Pneumatic Bermasalah',
    tingkat: 'Parah',
    persentase: 100,
    catatanOperator: 'Tekanan udara tidak stabil, pengujian waterproof menghasilkan NG berulang.',
    waktuPanggilan: '2026-11-16 07:50',
    status: 'Menunggu Teknisi',
    teknisiPenanggung: null,
    waktuMulai: null,
    waktuSelesai: null,
    tindakanTeknisi: '',
    rekomendasiTeknisi: ''
  },
  {
    id: 'TCK-2026-003',
    idDiagnosa: 'DIAG-001',
    idOperator: 'U01',
    namaOperator: 'Budi Santoso (Operator)',
    idMesin: 'M01',
    namaMesin: 'Mesin ASM',
    lokasi: 'Line Assembly 1',
    kerusakan: 'Power Supply Rusak',
    tingkat: 'Parah',
    persentase: 100,
    catatanOperator: 'Mesin mati mendadak saat awal shift.',
    waktuPanggilan: '2026-11-15 08:35',
    status: 'Selesai',
    teknisiPenanggung: 'Rian Kurniawan (Teknisi)',
    waktuMulai: '2026-11-15 08:45',
    waktuSelesai: '2026-11-15 09:20',
    tindakanTeknisi: 'Penggantian kabel power 3-phase dan perbaikan sekring putus pada unit regulator.',
    rekomendasiTeknisi: 'Tegangan telah diuji stabil di 220V AC ± 2%. Mesin sudah siap beroperasi normal kembali.'
  }
];

// Data Normalisasi Database Lengkap (UNF, 1NF, 2NF, 3NF) Sesuai Dokumen 1
export const NORMALIZATION_DATA = {
  unf: {
    judul: 'Bentuk Data Belum Ternormalisasi (UNF)',
    deskripsi: 'Data masih disimpan dalam satu tabel dan terdapat penggabungan beberapa nilai dalam satu atribut (multivalue). Gejala dan kerusakan bercampur sehingga menyebabkan redundansi data tinggi.',
    kelemahan: [
      'Satu atribut masih berisi lebih dari satu nilai.',
      'Data gejala masih digabung dalam satu kolom.',
      'Data kerusakan dan solusi masih bercampur dalam satu tabel.',
      'Menyebabkan redundansi data.',
      'Menyulitkan proses pencarian data dan relasi antar tabel.',
      'Tidak efektif untuk implementasi metode Forward Chaining.'
    ],
    tabel: [
      { id: 1, user: 'Operator', mesin: 'Mesin ASM', gejala: 'Mesin tidak menyala, indikator mati', kerusakan: 'Power Supply Rusak', solusi: 'Ganti kabel power dan cek tegangan listrik' },
      { id: 2, user: 'Operator', mesin: 'Mesin AGM', gejala: 'Conveyor macet, motor panas', kerusakan: 'Motor Conveyor Rusak', solusi: 'Ganti motor conveyor' },
      { id: 3, user: 'Operator', mesin: 'Mesin 3 in 1', gejala: 'Sensor gagal membaca, alarm mesin aktif', kerusakan: 'Sensor Error', solusi: 'Kalibrasi sensor dan cek kabel sensor' },
      { id: 4, user: 'Operator', mesin: 'Mesin AirThightness', gejala: 'Tekanan udara tidak stabil, suara mesin kasar', kerusakan: 'Sistem Pneumatic Bermasalah', solusi: 'Cek tekanan udara dan selang pneumatic' },
      { id: 5, user: 'Operator', mesin: 'Mesin Press', gejala: 'Mesin tiba-tiba berhenti, overheat mesin', kerusakan: 'Overheat Mesin', solusi: 'Matikan mesin sementara dan cek pendingin' }
    ]
  },
  firstNF: {
    judul: 'Bentuk Normal Pertama (1NF)',
    deskripsi: 'Setiap atribut memiliki nilai tunggal (atomic value) dan tidak boleh terdapat data ganda dalam satu kolom. Data gejala yang sebelumnya digabung dipisahkan menjadi beberapa baris terpisah.',
    tabel: [
      { id: 1, user: 'Operator', mesin: 'Mesin ASM', kodeGejala: 'G01', gejala: 'Mesin tidak menyala', kodeKerusakan: 'K01', kerusakan: 'Power Supply Rusak', solusi: 'Ganti kabel power dan cek tegangan listrik' },
      { id: 1, user: 'Operator', mesin: 'Mesin ASM', kodeGejala: 'G02', gejala: 'Indikator mati', kodeKerusakan: 'K01', kerusakan: 'Power Supply Rusak', solusi: 'Ganti kabel power dan cek tegangan listrik' },
      { id: 2, user: 'Operator', mesin: 'Mesin AGM', kodeGejala: 'G03', gejala: 'Conveyor macet', kodeKerusakan: 'K02', kerusakan: 'Motor Conveyor Rusak', solusi: 'Ganti motor conveyor' },
      { id: 2, user: 'Operator', mesin: 'Mesin AGM', kodeGejala: 'G04', gejala: 'Motor panas', kodeKerusakan: 'K02', kerusakan: 'Motor Conveyor Rusak', solusi: 'Ganti motor conveyor' },
      { id: 3, user: 'Operator', mesin: 'Mesin 3 in 1', kodeGejala: 'G05', gejala: 'Sensor gagal membaca', kodeKerusakan: 'K03', kerusakan: 'Sensor Error', solusi: 'Kalibrasi sensor dan cek kabel sensor' },
      { id: 3, user: 'Operator', mesin: 'Mesin 3 in 1', kodeGejala: 'G06', gejala: 'Alarm mesin aktif', kodeKerusakan: 'K03', kerusakan: 'Sensor Error', solusi: 'Kalibrasi sensor dan cek kabel sensor' },
      { id: 4, user: 'Operator', mesin: 'Mesin Press', kodeGejala: 'G07', gejala: 'Tekanan udara tidak stabil', kodeKerusakan: 'K04', kerusakan: 'Sistem Pneumatic Bermasalah', solusi: 'Cek tekanan udara dan selang pneumatic' },
      { id: 4, user: 'Operator', mesin: 'Mesin Press', kodeGejala: 'G08', gejala: 'Suara mesin kasar', kodeKerusakan: 'K04', kerusakan: 'Sistem Pneumatic Bermasalah', solusi: 'Cek tekanan udara dan selang pneumatic' },
      { id: 5, user: 'Operator', mesin: 'Mesin ASM', kodeGejala: 'G09', gejala: 'Mesin tiba-tiba berhenti', kodeKerusakan: 'K05', kerusakan: 'Overheat Mesin', solusi: 'Matikan mesin sementara dan cek pendingin' },
      { id: 5, user: 'Operator', mesin: 'Mesin ASM', kodeGejala: 'G10', gejala: 'Overheat mesin', kodeKerusakan: 'K05', kerusakan: 'Overheat Mesin', solusi: 'Matikan mesin sementara dan cek pendingin' }
    ]
  },
  secondNF: {
    judul: 'Bentuk Normal Kedua (2NF)',
    deskripsi: 'Tabel yang masih memiliki redundansi dipisahkan menjadi beberapa tabel berdasarkan dependensi atribut untuk menghilangkan partial dependency. Setiap atribut non-primary key bergantung sepenuhnya pada primary key.',
    tabelOperator: [
      { id: 1, user: 'Operator' },
      { id: 2, user: 'Operator' },
      { id: 3, user: 'Operator' },
      { id: 4, user: 'Operator' },
      { id: 5, user: 'Operator' }
    ],
    tabelGejala: [
      { idGejala: 'G01', namaGejala: 'Mesin tidak menyala' },
      { idGejala: 'G02', namaGejala: 'Indikator mati' },
      { idGejala: 'G03', namaGejala: 'Conveyor macet' },
      { idGejala: 'G04', namaGejala: 'Motor panas' },
      { idGejala: 'G05', namaGejala: 'Sensor gagal membaca' },
      { idGejala: 'G06', namaGejala: 'Alarm mesin aktif' },
      { idGejala: 'G07', namaGejala: 'Tekanan udara tidak stabil' },
      { idGejala: 'G08', namaGejala: 'Suara mesin kasar' },
      { idGejala: 'G09', namaGejala: 'Mesin tiba-tiba berhenti' },
      { idGejala: 'G10', namaGejala: 'Overheat mesin' }
    ],
    tabelKerusakan: [
      { idKerusakan: 'K01', namaKerusakan: 'Power Supply Rusak', solusi: 'Ganti kabel power dan cek tegangan listrik' },
      { idKerusakan: 'K02', namaKerusakan: 'Motor Conveyor Rusak', solusi: 'Ganti motor conveyor' },
      { idKerusakan: 'K03', namaKerusakan: 'Sensor Error', solusi: 'Kalibrasi sensor dan cek kabel sensor' },
      { idKerusakan: 'K04', namaKerusakan: 'Sistem Pneumatic Bermasalah', solusi: 'Cek tekanan udara dan selang pneumatic' },
      { idKerusakan: 'K05', namaKerusakan: 'Overheat Mesin', solusi: 'Matikan mesin sementara dan cek pendingin' }
    ],
    tabelDiagnosa: [
      { idDiagnosa: 1, idOperator: '1', idMesin: 'M01' },
      { idDiagnosa: 2, idOperator: 'OP02', idMesin: 'M02' },
      { idDiagnosa: 3, idOperator: 'OP03', idMesin: 'M03' },
      { idDiagnosa: 4, idOperator: 'OP04', idMesin: 'M04' },
      { idDiagnosa: 5, idOperator: 'OP05', idMesin: 'M01' }
    ],
    tabelRule: [
      { idRule: 1, idGejala: 'G01', idKerusakan: 'K01' },
      { idRule: 2, idGejala: 'G02', idKerusakan: 'K01' },
      { idRule: 3, idGejala: 'G03', idKerusakan: 'K02' },
      { idRule: 4, idGejala: 'G04', idKerusakan: 'K02' },
      { idRule: 5, idGejala: 'G05', idKerusakan: 'K03' },
      { idRule: 6, idGejala: 'G06', idKerusakan: 'K03' },
      { idRule: 7, idGejala: 'G07', idKerusakan: 'K04' },
      { idRule: 8, idGejala: 'G08', idKerusakan: 'K04' },
      { idRule: 9, idGejala: 'G09', idKerusakan: 'K05' },
      { idRule: 10, idGejala: 'G10', idKerusakan: 'K05' }
    ]
  },
  thirdNF: {
    judul: 'Bentuk Normal Ketiga (3NF)',
    deskripsi: 'Dilakukan penghapusan ketergantungan transitif sehingga setiap atribut non-primary key hanya bergantung pada primary key masing-masing tabel. Struktur database menjadi efisien, konsisten, dan siap untuk implementasi sistem pakar.',
    tabelUser: [
      { idUser: 1, username: 'Operator', password: 'Operator1', role: 'Operator' },
      { idUser: 2, username: 'Teknisi', password: 'Teknisi1', role: 'Teknisi' }
    ],
    tabelGejala: [
      { idGejala: 1, kodeGejala: 'G01', namaGejala: 'Mesin tidak menyala' },
      { idGejala: 2, kodeGejala: 'G02', namaGejala: 'Indikator mati' },
      { idGejala: 3, kodeGejala: 'G03', namaGejala: 'Conveyor macet' },
      { idGejala: 4, kodeGejala: 'G04', namaGejala: 'Motor panas' },
      { idGejala: 5, kodeGejala: 'G05', namaGejala: 'Sensor gagal membaca' },
      { idGejala: 6, kodeGejala: 'G06', namaGejala: 'Alarm mesin aktif' },
      { idGejala: 7, kodeGejala: 'G07', namaGejala: 'Tekanan udara tidak stabil' },
      { idGejala: 8, kodeGejala: 'G08', namaGejala: 'Suara mesin kasar' },
      { idGejala: 9, kodeGejala: 'G09', namaGejala: 'Mesin tiba-tiba berhenti' },
      { idGejala: 10, kodeGejala: 'G10', namaGejala: 'Overheat mesin' }
    ],
    tabelKerusakan: [
      { id: 1, kodeKerusakan: 'K01', namaKerusakan: 'Power Supply Rusak', solusi: 'Ganti kabel power dan cek tegangan listrik' },
      { id: 2, kodeKerusakan: 'K02', namaKerusakan: 'Motor Conveyor Rusak', solusi: 'Ganti motor conveyor' },
      { id: 3, kodeKerusakan: 'K03', namaKerusakan: 'Sensor Error', solusi: 'Kalibrasi sensor dan cek kabel sensor' },
      { id: 4, kodeKerusakan: 'K04', namaKerusakan: 'Sistem Pneumatic Bermasalah', solusi: 'Cek tekanan udara dan selang pneumatic' },
      { id: 5, kodeKerusakan: 'K05', namaKerusakan: 'Overheat Mesin', solusi: 'Matikan mesin sementara dan cek pendingin' }
    ],
    tabelRule: [
      { idRule: 1, idGejala: 'G01', idKerusakan: 'K01' },
      { idRule: 2, idGejala: 'G02', idKerusakan: 'K01' },
      { idRule: 3, idGejala: 'G03', idKerusakan: 'K02' },
      { idRule: 4, idGejala: 'G04', idKerusakan: 'K02' },
      { idRule: 5, idGejala: 'G05', idKerusakan: 'K03' },
      { idRule: 6, idGejala: 'G06', idKerusakan: 'K03' },
      { idRule: 7, idGejala: 'G07', idKerusakan: 'K04' },
      { idRule: 8, idGejala: 'G08', idKerusakan: 'K04' },
      { idRule: 9, idGejala: 'G09', idKerusakan: 'K05' },
      { idRule: 10, idGejala: 'G10', idKerusakan: 'K05' }
    ],
    tabelDiagnosa: [
      { idDiagnosa: 1, idUser: 'U01', idMesin: 'M01', idKerusakan: 'K01' },
      { idDiagnosa: 2, idUser: 'U02', idMesin: 'M02', idKerusakan: 'K02' },
      { idDiagnosa: 3, idUser: 'U01', idMesin: 'M03', idKerusakan: 'K03' },
      { idDiagnosa: 4, idUser: 'U02', idMesin: 'M04', idKerusakan: 'K04' },
      { idDiagnosa: 5, idUser: 'U01', idMesin: 'M01', idKerusakan: 'K05' }
    ]
  }
};

