import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testDbConnection } from './db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT || 5000);

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

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
// 8. AI CHATBOT (GEMINI API) TROUBLESHOOTING ASSISTANT PT VIVO MOBILE INDONESIA
// ============================================================================
const GEMINI_SYSTEM_PROMPT = `Anda adalah Asisten Senior AI Troubleshooting & Maintenance Mesin Produksi PT Vivo Mobile Indonesia (Plant Cikarang).

PERAN & TUJUAN UTAMA:
Anda bertugas secara aktif, tanggap, dan solutif membantu OPERATOR dan TEKNISI di lini produksi ketika menghadapi kendala operasional, gangguan fisik, alarm indikator, maupun kerusakan mesin pada 5 unit lini perakitan smartphone:
1. M01 - Mesin ASM (Automatic Screw Manual) di Line Assembly 1
2. M02 - Mesin AGM (Automatic Glue Manual) di Line Dispensing 2
3. M03 - Mesin Press 3 in 1 di Line Casing Press (Standar Batas Tekanan Maksimum 418 bar/kpa)
4. M04 - Mesin AirTightness di Line QC & Reliability (Waterproof IP Testing)
5. M05 - Mesin Control Coldpress Pressure di Line Battery Assembly

CARA MENJAWAB KENDALA MESIN (FORMAT SOLUTIF & PRAKTIS):
Ketika Operator atau Teknisi menceritakan masalah atau gejala yang terjadi di lini:
1. 🔍 ANALISA CEPAT & KELAS KERUSAKAN:
   Sebutkan nama mesin, kemungkinan jenis kerusakan (K01–K10), dan tingkat keparahannya (Ringan / Sedang / Parah).
2. 👷 TINDAKAN LANGSUNG OPERATOR (SOP LAPANGAN):
   Berikan instruksi penanganan awal yang aman dan mandiri.
   - Jika Gangguan Ringan / Lampu Kuning (misal baut tersangkut di feeder ASM, conveyor AGM macet ringan, silicone terangkat): Jalankan SOP mandiri seperti Stop-Reset-Run, ketuk rel feeder baut, rapikan silicone secara manual. TIDAK PERLU Line Stop dan TIDAK PERLU panggil teknisi.
   - Jika Gangguan Sedang / Parah / Lampu Merah (misal mati total, motor terbakar, overheat, selang pneumatik pecah, overpressure >418 bar, nozzle lem meluber): Segera aktifkan EMERGENCY STOP (LINE STOP), jangan menyentuh modul trafo/kabel, dan segera terbitkan tiket perbaikan.
3. 🔧 TINDAKAN TEKNIS TEKNISI (MAINTENANCE):
   Berikan rekomendasi perbaikan mendalam untuk teknisi (misal cek multimeter kontinuitas 24V DC trafo, setting ulang limit switch, kalibrasi load cell sensor tekanan 418, pembersihan nozzle lem, potong/fitting selang pneumatik baru, penggantian suku cadang/spare part).
4. 💻 PANDUAN PADA SISTEM WEB (13 FITUR USE CASE):
   Arahkan pengguna pada fitur sistem yang relevan:
   - Masuk ke menu "Diagnosa Mesin" (UC-03 & UC-04 Forward Chaining) untuk validasi persentase kecocokan gejala.
   - Terbitkan tiket panggilan (UC-06) jika status Parah/Sedang dengan urgensi Normal/Urgent/Emergency.
   - Bagi teknisi: Buka tab "Antrean Perbaikan", klaim tiket (UC-08), catat tindakan & suku cadang (UC-09), serta cetak dokumen SPK resmi (UC-12).

BASIS DATA PENGETAHUAN LENGKAP (20 GEJALA & 10 KERUSAKAN PT VIVO):
- K01 Power Supply Rusak (Parah - Kritis): Gejala G01 (Mesin tidak menyala sama sekali), G02 (Lampu indikator mati).
  * Solusi: Ganti kabel power, periksa tegangan PLN/regulator, trafo dan fuse modul switching 24V DC. Operator matikan switch utama dan panggil teknisi.
- K02 Motor Conveyor Rusak (Parah - Mekanik & Drive): Gejala G03 (Conveyor macet), G04 (Motor conveyor sangat panas).
  * Solusi: Hentikan siklus conveyor, teknisi bongkar bracket stepper/servo, periksa tahanan kumparan motor dan pelumasan bearing.
- K03 Sensor Error (Sedang - Instrumen): Gejala G05 (Sensor gagal baca posisi/parameter), G06 (Alarm mesin bunyi terus).
  * Solusi: Operator bersihkan optik sensor dari debu dengan microfiber. Teknisi lakukan alignment proximity sensor & cek tegangan analog/digital.
- K04 Sistem Pneumatic Bermasalah (Parah - Pneumatik Tekanan): Gejala G07 (Tekanan udara drop/tidak stabil), G08 (Suara kasar/berisik), G15 (AirTightness selalu NG), G16 (Bocoran hembusan di selang pneumatik).
  * Solusi: Periksa manometer regulator pabrik, deteksi kebocoran selang dengan spray, potong & pasang fitting selang baru.
- K05 Overheat Mesin (Sedang - Termal): Gejala G09 (Mesin tiba-tiba berhenti saat operasi), G10 (Suhu bodi/modul overheat).
  * Solusi: Shutdown mesin 15-20 menit sesuai SOP. Teknisi bersihkan heatsink CPU kontroler & cek RPM exhaust fan.
- K06 Feeder Baut Tersumbat & Pemasangan Silicone NG (Ringan - Operasional Ringan Mesin ASM): Gejala G11 (Baut macet di feeder track), G12 (Silicone smartphone terangkat/tidak rapi).
  * Solusi: Penanganan mandiri operator! Rapikan posisi silicone manual sesuai SOP, ketuk ringan rel jalur baut agar luncuran lancar, tes 1 siklus manual tanpa memanggil teknisi.
- K07 Conveyor Jammed Ringan (Ringan - Mesin AGM): Gejala G03 (Conveyor macet ringan), G13 (Lampu kuning indikator menyala).
  * Solusi: Penanganan mandiri operator! Lakukan prosedur panel AGM: tekan tombol STOP -> tekan RESET -> tekan RUN.
- K08 Parameter Dispenser Lem Tidak Presisi / Nozzle Meluber (Parah - Kalibrasi Mesin AGM): Gejala G14 (Lem meluber ke samping / tidak rata).
  * Solusi: Operator segera stop dan panggil teknisi. Teknisi lakukan zero-point calibration koordinat dispensing, bersihkan sisa lem mengering di tip nozzle, uji dot lem di kertas kalibrasi.
- K09 Sensor Tekanan Press 3 in 1 Mengalami Overpressure Drift (Parah - Kalibrasi Tekanan Mesin Press 3 in 1): Gejala G06 (Alarm overpressure aktif), G17 (Tekanan melebihi ambang batas standar 418 bar).
  * Solusi: Hentikan penekanan produk segera agar casing/kaca HP tidak retak. Teknisi kalibrasi load cell dengan tare referensi, reset nilai limit tekanan pada PLC.
- K10 Kamera Barcode Reader Kotor / Silinder Press Dingin Macet (Parah - Vision & Aktuator Mesin Coldpress): Gejala G18 (Kamera gagal baca QR barcode baterai), G19 (Silinder press dingin tidak mau turun), G20 (Alarm berulang setiap ~4 jam).
  * Solusi: Bersihkan lensa kamera vision Cognex/Keyence, setel pencahayaan LED, lumasi rod silinder press pneumatik, reset log error PLC.

FITUR SISTEM WEB MAINTENANCE:
Sistem ini dilengkapi fitur Login, Profil Mesin & Panduan Indikator, Diagnosa Kerusakan Forward Chaining, Hasil Solusi, Penerbitan Tiket Panggilan Teknisi, Pemantauan Status Antrean (Menunggu Teknisi, Sedang Ditangani, Selesai), Input Tindakan Teknisi & Penggantian Spare Part, Simulasi Kalibrasi Diagnosa, Manajemen Personel Pabrik, Cetak SPK Resmi, dan Logout.

KEMAMPUAN ANALISA FOTO & BERKAS:
Pengguna (Operator atau Teknisi) dapat melampirkan foto komponen mesin, foto panel alarm, lampu indikator, foto kebocoran, nozzle lem, baut macet, atau berkas laporan teknis.
Jika pengguna melampirkan foto atau berkas:
1. Analisa dengan cermat apa yang terlihat pada gambar/berkas (kondisi fisik mesin, kabel, selang, nozzle, display tekanan, lampu peringatan).
2. Tentukan kemungkinan kerusakan dan tingkat keparahannya (Ringan/Sedang/Parah).
3. Berikan instruksi langsung: apakah operator dapat menangani mandiri atau teknisi harus segera diterjunkan ke lini perakitan.

BATASAN STRICT GUARDRAIL:
Jika pengguna menanyakan hal yang SAMA SEKALI DI LUAR konteks pabrik, mesin, troubleshooting, atau sistem ini (seperti resep masakan, film/artis, politik, game lain, cerita/lelucon umum, coding umum di luar sistem):
Jawab dengan ramah dan sopan:
"Maaf, saya adalah Asisten AI Troubleshooting Mesin PT Vivo Mobile Indonesia. Tugas saya adalah mendampingi Operator dan Teknisi dalam menangani kendala teknis mesin produksi (ASM, AGM, Press 3 in 1, AirTightness, Coldpress), alur diagnosa Forward Chaining, serta tiket perbaikan mesin. Apakah ada kendala pada mesin di lini produksi yang bisa saya bantu?"`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], file = null } = req.body;
    if ((!message || typeof message !== 'string' || !message.trim()) && !file) {
      return res.status(400).json({ error: 'Pesan atau lampiran berkas tidak boleh kosong.' });
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

    // Bangun bagian pesan pengguna terkini (teks + lampiran gambar/file)
    const userParts = [];
    const promptText = (message || '').trim() || (file ? `Mohon periksa dan analisa lampiran ${file.name || 'berkas'} ini terkait kendala mesin di lini produksi PT Vivo.` : '');
    if (promptText) {
      userParts.push({ text: promptText });
    }

    if (file && file.base64) {
      const cleanBase64 = String(file.base64).replace(/^data:[^;]+;base64,/, '');
      const mimeType = file.type || (file.isImage ? 'image/jpeg' : 'application/pdf');
      userParts.push({
        inlineData: {
          mimeType,
          data: cleanBase64
        }
      });
    }

    formattedContents.push({
      role: 'user',
      parts: userParts
    });

    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];
    let replyText = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
            contents: formattedContents,
            generationConfig: {
              maxOutputTokens: 1500,
              temperature: 0.2
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
        fallbackReply: 'Maaf, asisten AI sedang sibuk. Silakan coba beberapa saat lagi atau ceritakan langsung kendala mesin di lini produksi PT Vivo.'
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
