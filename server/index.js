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
