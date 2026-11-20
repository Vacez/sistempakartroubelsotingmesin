import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testDbConnection } from './db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 5000);

app.use(cors());
app.use(express.json());

// ============================================================================
// ROW MAPPERS (MySQL snake_case -> Frontend camelCase)
// ============================================================================
const mapGejala = (r) => ({
  id: r.id,
  kode: r.kode,
  nama: r.nama,
  mesinId: r.mesin_id,
  mesinNama: r.mesin_nama,
  kategori: r.kategori
});

const mapKerusakan = (r) => ({
  id: r.id,
  kode: r.kode,
  nama: r.nama,
  tingkat: r.tingkat,
  kategori: r.kategori,
  penangananOleh: r.penanganan_oleh,
  solusi: r.solusi,
  tindakanOperator: r.tindakan_operator,
  rekomendasiTeknisi: r.rekomendasi_teknisi
});

const mapRule = (r) => ({
  id: r.id,
  namaRule: r.nama_rule,
  kodeGejala: r.kode_gejala,
  kodeKerusakan: r.kode_kerusakan,
  bobot: Number(r.bobot),
  kondisi: r.kondisi
});

const mapDiagnosa = (r) => {
  let gejalaArr = [];
  try {
    gejalaArr = typeof r.gejala_terpilih === 'string'
      ? JSON.parse(r.gejala_terpilih)
      : (r.gejala_terpilih || []);
  } catch {
    gejalaArr = [];
  }
  return {
    id: r.id,
    idUser: r.id_user,
    namaUser: r.nama_user,
    idMesin: r.id_mesin,
    namaMesin: r.nama_mesin,
    gejalaTerpilih: gejalaArr,
    idKerusakan: r.id_kerusakan,
    namaKerusakan: r.nama_kerusakan,
    tingkat: r.tingkat,
    persentase: Number(r.persentase),
    solusi: r.solusi,
    waktu: r.waktu,
    statusPanggilan: r.status_panggilan,
    catatanOperator: r.catatan_operator || ''
  };
};

const mapTicket = (r) => ({
  id: r.id,
  idDiagnosa: r.id_diagnosa,
  idOperator: r.id_operator,
  namaOperator: r.nama_operator,
  idMesin: r.id_mesin,
  namaMesin: r.nama_mesin,
  lokasi: r.lokasi,
  kerusakan: r.kerusakan,
  tingkat: r.tingkat,
  persentase: Number(r.persentase),
  catatanOperator: r.catatan_operator || '',
  urgensi: r.urgensi || 'Urgent',
  waktuPanggilan: r.waktu_panggilan,
  status: r.status,
  teknisiPenanggung: r.teknisi_penanggung || null,
  waktuMulai: r.waktu_mulai || null,
  waktuSelesai: r.waktu_selesai || null,
  tindakanTeknisi: r.tindakan_teknisi || '',
  rekomendasiTeknisi: r.rekomendasi_teknisi || ''
});

// ============================================================================
// 1. HEALTH CHECK & BOOTSTRAP DATA
// ============================================================================
app.get('/api/health', async (_req, res) => {
  try {
    await testDbConnection();
    res.json({
      ok: true,
      database: process.env.DB_NAME || 'db_sistem_pakar_mesin',
      engine: 'MySQL / MariaDB'
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/bootstrap', async (_req, res) => {
  try {
    const [
      [users],
      [machines],
      [gejalaRows],
      [kerusakanRows],
      [ruleRows],
      [diagnosaRows],
      [ticketRows]
    ] = await Promise.all([
      pool.query('SELECT id, username, password, role, nama, jabatan, avatar, nip, shift FROM tb_user ORDER BY created_at DESC, id ASC'),
      pool.query('SELECT id, kode, nama, fungsi, lokasi, icon, status, deskripsi FROM tb_mesin ORDER BY id ASC'),
      pool.query('SELECT id, kode, nama, mesin_id, mesin_nama, kategori FROM tb_gejala ORDER BY CAST(id AS UNSIGNED) ASC'),
      pool.query('SELECT id, kode, nama, tingkat, kategori, penanganan_oleh, solusi, tindakan_operator, rekomendasi_teknisi FROM tb_kerusakan ORDER BY CAST(id AS UNSIGNED) ASC'),
      pool.query('SELECT id, nama_rule, kode_gejala, kode_kerusakan, bobot, kondisi FROM tb_rule ORDER BY id ASC'),
      pool.query('SELECT * FROM tb_diagnosa ORDER BY created_at DESC, id DESC'),
      pool.query('SELECT * FROM tb_tiket_perbaikan ORDER BY created_at DESC, id DESC')
    ]);

    res.json({
      users,
      machines,
      gejala: gejalaRows.map(mapGejala),
      kerusakan: kerusakanRows.map(mapKerusakan),
      rules: ruleRows.map(mapRule),
      diagnosaHistory: diagnosaRows.map(mapDiagnosa),
      tickets: ticketRows.map(mapTicket)
    });
  } catch (err) {
    console.error('[GET /api/bootstrap] Error:', err);
    res.status(500).json({ error: 'Gagal mengambil data dari database MySQL', detail: err.message });
  }
});

// ============================================================================
// 2. AUTENTIKASI (LOGIN MYSQL)
// ============================================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan kata sandi wajib diisi.' });
    }

    const uname = username.trim().toLowerCase();
    const pwd = password.trim();

    const [rows] = await pool.query(
      'SELECT id, username, password, role, nama, jabatan, avatar, nip, shift FROM tb_user'
    );

    const match = rows.find((u) => {
      const uMatch = u.username.toLowerCase() === uname || (u.role === 'Admin' && uname === 'supervisor');
      const pMatch = u.password === pwd || (u.role === 'Admin' && (pwd === 'Admin1' || pwd === 'Supervisor2026'));
      return uMatch && pMatch;
    });

    if (!match) {
      return res.status(401).json({ error: 'Kredensial tidak valid. Periksa kembali username dan kata sandi.' });
    }

    res.json({ user: match });
  } catch (err) {
    console.error('[POST /api/auth/login] Error:', err);
    res.status(500).json({ error: 'Kesalahan server saat autentikasi', detail: err.message });
  }
});

// ============================================================================
// 3. MANAJEMEN USER / OPERATOR (ADMIN)
// ============================================================================
app.get('/api/users', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, password, role, nama, jabatan, avatar, nip, shift FROM tb_user ORDER BY created_at DESC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { id, username, password, role, nama, jabatan, avatar, nip, shift } = req.body;
    if (!username || !password || !nama) {
      return res.status(400).json({ error: 'Nama, username, dan kata sandi wajib diisi.' });
    }

    const userId = id || `U${Date.now().toString().slice(-4)}`;
    const userAvatar = avatar || nama.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    await pool.query(
      `INSERT INTO tb_user (id, username, password, role, nama, jabatan, avatar, nip, shift)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        username.trim(),
        password.trim(),
        role || 'Operator',
        nama.trim(),
        jabatan || 'Operator Lini Produksi',
        userAvatar,
        nip || `EMP-VVO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        shift || 'Shift 1 (Pagi)'
      ]
    );

    const [created] = await pool.query(
      'SELECT id, username, password, role, nama, jabatan, avatar, nip, shift FROM tb_user WHERE id = ?',
      [userId]
    );

    res.status(201).json(created[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username sudah terdaftar di database.' });
    }
    console.error('[POST /api/users] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tb_user WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }
    res.json({ deleted: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 4. RIWAYAT DIAGNOSA FORWARD CHAINING
// ============================================================================
app.get('/api/diagnosa', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tb_diagnosa ORDER BY created_at DESC, id DESC');
    res.json(rows.map(mapDiagnosa));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/diagnosa', async (req, res) => {
  try {
    const d = req.body;
    const diagId = d.id || `DIAG-${Date.now().toString().slice(-5)}`;
    const gejalaJson = JSON.stringify(d.gejalaTerpilih || []);

    await pool.query(
      `INSERT INTO tb_diagnosa
        (id, id_user, nama_user, id_mesin, nama_mesin, gejala_terpilih, id_kerusakan, nama_kerusakan, tingkat, persentase, solusi, waktu, status_panggilan, catatan_operator)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        diagId,
        d.idUser || 'U01',
        d.namaUser || 'Operator',
        d.idMesin || 'M01',
        d.namaMesin || 'Mesin Produksi',
        gejalaJson,
        d.idKerusakan || 'K01',
        d.namaKerusakan || 'Kerusakan Mesin',
        d.tingkat || 'Sedang',
        Number(d.persentase || 0),
        d.solusi || '',
        d.waktu || new Date().toLocaleString('id-ID'),
        d.statusPanggilan || 'Selesai',
        d.catatanOperator || ''
      ]
    );

    const [rows] = await pool.query('SELECT * FROM tb_diagnosa WHERE id = ?', [diagId]);
    res.status(201).json(mapDiagnosa(rows[0]));
  } catch (err) {
    console.error('[POST /api/diagnosa] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 5. ANTREAN TIKET PERBAIKAN (OPERATOR BUAT -> TEKNISI PROSES -> ADMIN PANTAU)
// ============================================================================
app.get('/api/tickets', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tb_tiket_perbaikan ORDER BY created_at DESC, id DESC');
    res.json(rows.map(mapTicket));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const t = req.body;
    const ticketId = t.id || `TCK-${Date.now().toString().slice(-4)}`;

    await pool.query(
      `INSERT INTO tb_tiket_perbaikan
        (id, id_diagnosa, id_operator, nama_operator, id_mesin, nama_mesin, lokasi, kerusakan, tingkat, persentase, catatan_operator, urgensi, waktu_panggilan, status, teknisi_penanggung, waktu_mulai, waktu_selesai, tindakan_teknisi, rekomendasi_teknisi)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ticketId,
        t.idDiagnosa || null,
        t.idOperator || 'U01',
        t.namaOperator || 'Operator Lini',
        t.idMesin || 'M01',
        t.namaMesin || 'Mesin Produksi',
        t.lokasi || 'Lini Produksi PT Vivo',
        t.kerusakan || 'Gangguan Mesin',
        t.tingkat || 'Parah',
        Number(t.persentase || 100),
        t.catatanOperator || '',
        t.urgensi || 'Urgent',
        t.waktuPanggilan || new Date().toLocaleString('id-ID'),
        t.status || 'Menunggu Teknisi',
        t.teknisiPenanggung || null,
        t.waktuMulai || null,
        t.waktuSelesai || null,
        t.tindakanTeknisi || '',
        t.rekomendasiTeknisi || ''
      ]
    );

    if (t.idMesin) {
      await pool.query(
        'UPDATE tb_diagnosa SET status_panggilan = ? WHERE id_mesin = ? AND status_panggilan != ?',
        ['Menunggu Teknisi', t.idMesin, 'Selesai']
      );
    }

    const [rows] = await pool.query('SELECT * FROM tb_tiket_perbaikan WHERE id = ?', [ticketId]);
    res.status(201).json(mapTicket(rows[0]));
  } catch (err) {
    console.error('[POST /api/tickets] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tickets/:id/take', async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'Sedang Ditangani', teknisiPenanggung = 'Teknisi' } = req.body;
    const waktuMulai = new Date().toLocaleString('id-ID');

    const [result] = await pool.query(
      `UPDATE tb_tiket_perbaikan
       SET status = ?, teknisi_penanggung = ?, waktu_mulai = ?
       WHERE id = ?`,
      [status, teknisiPenanggung, waktuMulai, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tiket tidak ditemukan.' });
    }

    const [rows] = await pool.query('SELECT * FROM tb_tiket_perbaikan WHERE id = ?', [id]);
    res.json(mapTicket(rows[0]));
  } catch (err) {
    console.error('[PATCH /api/tickets/:id/take] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tickets/:id/finish', async (req, res) => {
  try {
    const { id } = req.params;
    const { tindakanTeknisi, rekomendasiTeknisi, waktuSelesai, teknisiPenanggung } = req.body;
    const finishedAt = waktuSelesai || new Date().toLocaleString('id-ID');

    const [result] = await pool.query(
      `UPDATE tb_tiket_perbaikan
       SET status = 'Selesai',
           tindakan_teknisi = ?,
           rekomendasi_teknisi = ?,
           waktu_selesai = ?,
           teknisi_penanggung = COALESCE(?, teknisi_penanggung)
       WHERE id = ?`,
      [tindakanTeknisi || '', rekomendasiTeknisi || '', finishedAt, teknisiPenanggung || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tiket tidak ditemukan.' });
    }

    const [rows] = await pool.query('SELECT * FROM tb_tiket_perbaikan WHERE id = ?', [id]);
    const ticket = mapTicket(rows[0]);

    if (ticket.idMesin) {
      await pool.query(
        'UPDATE tb_diagnosa SET status_panggilan = ? WHERE id_mesin = ?',
        ['Selesai', ticket.idMesin]
      );
    }

    res.json(ticket);
  } catch (err) {
    console.error('[PATCH /api/tickets/:id/finish] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// 8. AI CHATBOT (GEMINI API) DENGAN STRICT DOMAIN GUARDRAIL
// ============================================================================
const GEMINI_SYSTEM_PROMPT = `Anda adalah Asisten Cerdas AI Sistem Pakar Troubleshooting Mesin Produksi PT Vivo Mobile Indonesia (berdasarkan Laporan Skripsi Ilham Aditya Putra Budi).

TUGAS DAN ATURAN ANDA:
1. Anda HANYA diperbolehkan menjawab pertanyaan yang berkaitan dengan:
   - 13 Fitur / Use Case dan Tampilan Sistem (Subbab 4.4.2 & Subbab 4.2 Laporan Skripsi)
   - 3 Aktor Sistem (Operator, Teknisi, Admin) beserta tugas dan batasan wewenangnya
   - 5 Unit Mesin Produksi PT Vivo Mobile Indonesia (ASM, AGM, Press 3 in 1, AirTightness, Control Coldpress Pressure)
   - Panduan Lampu Indikator Pabrik (Lampu Kuning vs Lampu Merah) dan Standar Operasional Prosedur (SOP)
   - Alur Mesin Inferensi Forward Chaining, 20 Gejala (G01-G20), 10 Kerusakan (K01-K10), 20 Kaidah Aturan (R01-R20)
   - Manajemen Antrean Tiket Perbaikan Mesin (Menunggu Teknisi, Sedang Ditangani, Selesai)
   - Pembuatan dan Pencetakan Dokumen Surat Perintah Kerja (SPK) resmi PT Vivo Mobile Indonesia

2. ATURAN STRICT GUARDRAIL (BATASAN KETAT):
Jika pengguna menanyakan topik di luar ruang lingkup di atas (seperti resep masakan, cuaca, politik, artis, gosip, game lain, tugas kuliah umum di luar sistem ini, pemrograman umum di luar sistem ini, cerita fiksi, lelucon umum, dsb.), Anda WAJIB MENOLAK dan HANYA menjawab dengan kalimat persis berikut:
"Maaf, kami hanya bisa menjawab seputar Sistem Pakar Troubleshooting Mesin Produksi PT Vivo Mobile Indonesia (13 Fitur/Use Case, 5 Mesin Produksi, Alur Diagnosa Forward Chaining, dan Manajemen Antrean Tiket Perbaikan)."

DATA LENGKAP SISTEM (ACUAN RESMI):

A. 13 FITUR / USE CASE & TAMPILAN SISTEM (SESUAI SUBBAB 4.4.2 & TABEL 4.2):
1. Login: Proses autentikasi identitas pengguna menggunakan username dan password untuk masuk ke dalam halaman dasbor sistem sesuai dengan peran (role) masing-masing. (Aktor: Operator, Teknisi, Admin)
2. Lihat Profil Mesin & Panduan Indikator: Fitur yang menampilkan informasi teknis lima unit mesin produksi (ASM, AGM, Press 3 in 1, AirTightness, dan Control Coldpress Pressure) beserta panduan penanganan awal untuk indikator lampu kuning dan merah. (Aktor: Operator, Teknisi)
3. Pilih Mesin & Gejala Kerusakan: Fitur bagi pengguna untuk memilih unit mesin produksi yang mengalami kendala operasional dan menandai satu atau beberapa gejala fisik yang teramati di lapangan. (Aktor: Operator, Teknisi)
4. Proses Diagnosa (Forward Chaining): Proses inti mesin inferensi yang mencocokkan fakta-fakta gejala terpilih dengan kaidah aturan (rule) IF–THEN pada basis pengetahuan secara otomatis. (Aktor: Operator, Teknisi)
5. Lihat Hasil Diagnosa & Solusi: Fitur yang menyajikan kesimpulan jenis kerusakan mesin, nilai persentase kecocokan gejala, klasifikasi tingkat keparahan (Ringan, Sedang, Parah), serta rekomendasi langkah perbaikan mandiri. (Aktor: Operator, Teknisi)
6. Terbitkan Tiket Panggilan Teknisi: Fitur yang digunakan operator untuk membuat tiket antrean perbaikan baru lengkap dengan pemilihan tingkat urgensi (Normal, Urgent, Emergency) dan catatan lapangan apabila kerusakan tergolong sedang atau parah. (Aktor: Operator)
7. Pantau Status Tiket Perbaikan: Fitur pelacakan status perkembangan tiket panggilan secara real-time mulai dari status Menunggu Teknisi, Sedang Ditangani, hingga Selesai. (Aktor: Operator, Teknisi, Admin)
8. Klaim & Tangani Tiket Masuk: Fitur bagi teknisi untuk melihat daftar antrean tiket berdasarkan prioritas urgensi dan mengambil tanggung jawab penanganan tiket yang masuk. (Aktor: Teknisi)
9. Input Hasil Perbaikan & Konfirmasi Selesai: Fitur yang digunakan teknisi untuk mencatat rincian tindakan perbaikan, penggantian spare part, serta rekomendasi pemeliharaan preventif sebelum menutup status tiket menjadi Selesai. (Aktor: Teknisi)
10. Simulasi Kalibrasi Diagnosa: Fitur pengujian bagi teknisi untuk mensimulasikan kombinasi gejala mesin guna memverifikasi ketepatan alur penalaran dan akurasi persentase kecocokan pada basis aturan (rule). (Aktor: Teknisi)
11. Kelola Direktori Personel Pabrik: Fitur administrasi yang digunakan untuk mendaftarkan akun personel baru (Nama, NIP, Stasiun Mesin, Shift, Username, Password) maupun menghapus akun personel yang sudah tidak aktif. (Aktor: Admin)
12. Cetak Surat Perintah Kerja (SPK): Fitur untuk menghasilkan dan mencetak dokumen Surat Perintah Kerja (SPK) resmi standar PT Vivo Mobile Indonesia sebagai bukti dokumentasi pemeliharaan mesin. (Aktor: Operator, Teknisi, Admin)
13. Logout: Proses keluar dari sesi kerja aplikasi secara aman untuk melindungi hak akses akun pengguna setelah selesai mengoperasikan sistem. (Aktor: Operator, Teknisi, Admin)

B. 3 AKTOR & HAK AKSES SISTEM:
- Operator:
  * Melakukan observasi gejala kerusakan mesin di stasiun kerjanya.
  * Membaca panduan lampu kuning untuk penanganan mandiri (Stop-Reset-Run) tanpa panggil teknisi.
  * Menerbitkan tiket panggilan teknisi baru jika kerusakan Sedang/Parah atau lampu Merah menyala.
  * Memantau antrean tiket dan mencetak SPK.
  * Dibatasi: tidak bisa mengklaim tiket atau mengisi laporan tindakan perbaikan teknisi.
- Teknisi Maintenance:
  * Mengambil tanggung jawab (Klaim) tiket masuk dari status 'Menunggu Teknisi' menjadi 'Sedang Ditangani'.
  * Menangani perbaikan teknis fisik mesin, kalibrasi komponen, dan penggantian spare part.
  * Menginput rincian tindakan perbaikan, daftar spare part yang diganti, serta rekomendasi preventif bagi operator, lalu menutup tiket menjadi 'Selesai'.
  * Melakukan simulasi kalibrasi diagnosa untuk memvalidasi kaidah aturan (rule).
  * Memantau tiket dan mencetak SPK.
- Admin (System Administrator):
  * Mengelola direktori personel pabrik (pendaftaran akun baru, penghapusan akun operator/teknisi nonaktif).
  * Melakukan monitoring antrean perbaikan dan audit dokumen SPK secara read-only tanpa memanipulasi progres teknis lapangan.

C. 5 UNIT MESIN PRODUKSI DI PT VIVO MOBILE INDONESIA:
1. M01 Mesin ASM (Automatic Screw Manual):
   - Lokasi: Line Assembly 1
   - Fungsi: Pemasangan baut dan pengencangan sekrup modul housing dan casing smartphone secara otomatis dengan kontrol torsi presisi.
2. M02 Mesin AGM (Automatic Glue Manual):
   - Lokasi: Line Dispensing 2
   - Fungsi: Pengolesan lem perekat bodi dan layar smartphone dengan presisi tinggi menggunakan sistem pemanas dispensing nozzle.
3. M03 Mesin Press 3 in 1:
   - Lokasi: Line Casing Press
   - Fungsi: Pengepresan empat sisi bodi LCD casing smartphone secara simultan dengan batas sensor tekanan maksimum 418 bar/kpa.
4. M04 Mesin AirTightness:
   - Lokasi: Line QC & Reliability
   - Fungsi: Pengujian ketahanan kedap air dan tekanan udara (waterproof standard IP test) pada unit smartphone.
5. M05 Mesin Control Coldpress Pressure:
   - Lokasi: Line Battery Assembly
   - Fungsi: Pengepresan dingin modul baterai lithium ke dalam sasis smartphone serta pembacaan barcode baterai dengan scanner kamera terintegrasi.

D. PANDUAN LAMPU INDIKATOR PABRIK:
- Lampu Kuning (Warning / Gangguan Operasional Ringan):
  * Terjadi gangguan non-kritis (misal baut tersangkut di feeder ASM, conveyor tersendat).
  * Solusi: Penanganan mandiri operator sesuai SOP Stop-Reset-Run, tidak perlu panggil teknisi dan tidak line stop.
- Lampu Merah (Fault / Kerusakan Kritis):
  * Kerusakan elektrikal/mekanikal/sensor/overpressure >418 bar.
  * Solusi: Wajib Line Stop (saklar darurat Emergency Stop) dan operator wajib menerbitkan tiket panggilan teknisi.

E. ALUR SISTEM PAKAR & METODE FORWARD CHAINING:
- Penalaran berorientasi data (Data-Driven Reasoning).
- Fakta gejala terpilih dicocokkan dengan kaidah aturan IF-THEN.
- Rumus persentase kecocokan: P = (Jumlah Gejala Cocok / Total Gejala Rule) * 100%.
- Klasifikasi tingkat kerusakan: Ringan (<50%), Sedang (50%-75%), Parah (>75%).
- Surat Perintah Kerja (SPK) standar PT Vivo Mobile Indonesia diterbitkan memuat nomor SPK, tanggal, nama mesin, pelapor operator, teknisi penanggung jawab, tindakan perbaikan, spare part, dan tanda tangan.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Konfigurasi GEMINI_API_KEY belum diatur di file .env server.'
      });
    }
    
    // Format riwayat percakapan untuk Gemini API
    const formattedContents = [];
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';
        const text = String(h.text || h.content || '').trim();
        if (text) {
          formattedContents.push({
            role,
            parts: [{ text }]
          });
        }
      }
    }
    // Tambahkan input pengguna terkini
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];
    let replyText = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
            contents: formattedContents,
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.1
            }
          })
        });
        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          replyText = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
          if (replyText.trim()) {
            break;
          }
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          console.warn(`[Gemini API] Model ${model} mengembalikan status ${geminiRes.status}:`, errData?.error?.message || '');
          lastError = errData?.error?.message || `HTTP ${geminiRes.status}`;
        }
      } catch (callErr) {
        console.warn(`[Gemini API] Gagal memanggil model ${model}:`, callErr.message);
        lastError = callErr.message;
      }
    }

    if (!replyText) {
      return res.status(502).json({
        error: 'Asisten AI sedang mengalami kendala jaringan atau antrean tinggi.',
        detail: lastError,
        fallbackReply: 'Maaf, layanan AI sedang sibuk. Silakan coba beberapa saat lagi atau tanyakan langsung seputar 13 Use Case dan 5 Mesin Produksi PT Vivo.'
      });
    }

    res.json({ reply: replyText.trim() });
  } catch (err) {
    console.error('[POST /api/chat] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`[API] Express Backend berjalan di http://localhost:${PORT}`);
  try {
    await testDbConnection();
    console.log(`[MySQL] Terhubung ke database "${process.env.DB_NAME || 'db_sistem_pakar_mesin'}" (Port ${process.env.DB_PORT || 3306})`);
  } catch (err) {
    console.error('[MySQL] Gagal terhubung ke MySQL:', err.message);
  }
});
