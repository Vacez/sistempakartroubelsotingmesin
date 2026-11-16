import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Check, 
  GitCommit,
  Table,
  HelpCircle
} from 'lucide-react';
import { NORMALIZATION_DATA } from '../data/initialData';

export default function NormalizationDocView() {
  const [activeStage, setActiveStage] = useState('3nf'); // 'unf' | '1nf' | '2nf' | '3nf' | 'summary'

  const stages = [
    { id: 'unf', label: 'UNF (Unnormalized)', step: 'Tahap Awal', color: 'border-red-400 text-red-600' },
    { id: '1nf', label: '1NF (Atomic Value)', step: 'Bentuk ke-1', color: 'border-amber-400 text-amber-600' },
    { id: '2nf', label: '2NF (No Partial Dep)', step: 'Bentuk ke-2', color: 'border-blue-400 text-blue-600' },
    { id: '3nf', label: '3NF (No Transitive Dep)', step: 'Bentuk ke-3 (Final)', color: 'border-emerald-500 text-emerald-600' },
    { id: 'summary', label: 'Matriks Transformasi', step: 'Analisis Komparasi', color: 'border-indigo-400 text-indigo-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Normalisasi */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Dokumentasi Normalisasi Database Relasional
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Struktur perancangan data relasional sistem pakar dari bentuk awal (UNF) hingga Third Normal Form (3NF) sesuai Dokumen 1.
            </p>
          </div>
        </div>

        {/* Stage Stepper Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          {stages.map((st) => {
            const isActive = activeStage === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`text-[10px] font-mono font-medium ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                  {st.step}
                </div>
                <div className="font-semibold text-xs mt-0.5">{st.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAHAP UNF */}
      {activeStage === 'unf' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Tahap Awal: Unnormalized Form
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">{NORMALIZATION_DATA.unf.judul}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {NORMALIZATION_DATA.unf.deskripsi}
              </p>
            </div>
          </div>

          {/* Tabel UNF Asli Sesuai Dokumen 1 */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-red-50/80 border-b border-red-200 text-slate-800 font-bold">
                  <th className="py-3 px-3">ID Diagnosa</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Mesin Produksi</th>
                  <th className="py-3 px-3 bg-red-100/60 text-red-900">Gejala (Multivalue / Redundan)</th>
                  <th className="py-3 px-3">Kerusakan</th>
                  <th className="py-3 px-3">Solusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {NORMALIZATION_DATA.unf.tabel.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{row.id}</td>
                    <td className="py-3 px-3 font-medium">{row.user}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.mesin}</td>
                    <td className="py-3 px-3 font-medium text-red-700 bg-red-50/30">
                      ⚠️ {row.gejala}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{row.kerusakan}</td>
                    <td className="py-3 px-3 text-slate-600">{row.solusi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Analisis Permasalahan UNF Sesuai Dokumen 1 */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Analisis Permasalahan Bentuk UNF (Dokumen 1 Halaman 1):
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {NORMALIZATION_DATA.unf.kelemahan.map((k, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAHAP 1NF */}
      {activeStage === '1nf' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Tahap 1: First Normal Form (1NF)
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">{NORMALIZATION_DATA.firstNF.judul}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {NORMALIZATION_DATA.firstNF.deskripsi}
            </p>
          </div>

          {/* Tabel 1NF Sesuai Dokumen 1 */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-amber-50/80 border-b border-amber-200 text-slate-800 font-bold">
                  <th className="py-2.5 px-3">ID Diagnosa</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Mesin Produksi</th>
                  <th className="py-2.5 px-3 text-center">Kode Gejala</th>
                  <th className="py-2.5 px-3">Gejala (Atomic)</th>
                  <th className="py-2.5 px-3 text-center">Kode Kerusakan</th>
                  <th className="py-2.5 px-3">Kerusakan</th>
                  <th className="py-2.5 px-3">Solusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {NORMALIZATION_DATA.firstNF.tabel.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-2 px-3 font-mono font-bold text-slate-800">{row.id}</td>
                    <td className="py-2 px-3">{row.user}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{row.mesin}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {row.kodeGejala}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900">{row.gejala}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {row.kodeKerusakan}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold">{row.kerusakan}</td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">{row.solusi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
            <strong>Analisis 1NF:</strong> Meskipun setiap kolom telah bernilai atomik (satu nilai), 
            masih terdapat redundansi data mesin, user, kerusakan, dan solusi yang berulang pada setiap baris gejala. 
            Maka dilanjutkan ke tahap 2NF dengan memisahkan tabel berdasarkan dependensi fungsi.
          </div>
        </div>
      )}

      {/* TAHAP 2NF */}
      {activeStage === '2nf' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Tahap 2: Second Normal Form (2NF)
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">{NORMALIZATION_DATA.secondNF.judul}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {NORMALIZATION_DATA.secondNF.deskripsi}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tabel Operator 2NF */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-blue-600" />
                Tabel Operator (2NF)
              </h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-1 px-2">ID Operator (PK)</th>
                    <th className="py-1 px-2">User</th>
                  </tr>
                </thead>
                <tbody>
                  {NORMALIZATION_DATA.secondNF.tabelOperator.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-1 px-2 font-mono">{row.id}</td>
                      <td className="py-1 px-2">{row.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel Diagnosa 2NF */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-blue-600" />
                Tabel Diagnosa (2NF)
              </h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-1 px-2">ID Diagnosa (PK)</th>
                    <th className="py-1 px-2">ID Operator</th>
                    <th className="py-1 px-2">ID Mesin</th>
                  </tr>
                </thead>
                <tbody>
                  {NORMALIZATION_DATA.secondNF.tabelDiagnosa.map((row) => (
                    <tr key={row.idDiagnosa} className="border-b border-slate-100">
                      <td className="py-1 px-2 font-mono font-bold">{row.idDiagnosa}</td>
                      <td className="py-1 px-2 font-mono">{row.idOperator}</td>
                      <td className="py-1 px-2 font-mono text-blue-600">{row.idMesin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel Gejala 2NF */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-blue-600" />
                Tabel Gejala (2NF)
              </h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-1 px-2">ID Gejala (PK)</th>
                    <th className="py-1 px-2">Nama Gejala</th>
                  </tr>
                </thead>
                <tbody>
                  {NORMALIZATION_DATA.secondNF.tabelGejala.map((row) => (
                    <tr key={row.idGejala} className="border-b border-slate-100">
                      <td className="py-1 px-2 font-mono font-bold text-blue-700">{row.idGejala}</td>
                      <td className="py-1 px-2">{row.namaGejala}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabel Kerusakan 2NF */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-blue-600" />
                Tabel Kerusakan (2NF)
              </h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-1 px-2">ID Kerusakan</th>
                    <th className="py-1 px-2">Nama Kerusakan</th>
                    <th className="py-1 px-2">Solusi</th>
                  </tr>
                </thead>
                <tbody>
                  {NORMALIZATION_DATA.secondNF.tabelKerusakan.map((row) => (
                    <tr key={row.idKerusakan} className="border-b border-slate-100">
                      <td className="py-1 px-2 font-mono font-bold text-amber-700">{row.idKerusakan}</td>
                      <td className="py-1 px-2 font-semibold">{row.namaKerusakan}</td>
                      <td className="py-1 px-2 text-[11px] text-slate-600">{row.solusi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAHAP 3NF (FINAL & DIGUNAKAN SISTEM) */}
      {activeStage === '3nf' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Tahap 3 (Final): Third Normal Form (3NF)
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">{NORMALIZATION_DATA.thirdNF.judul}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {NORMALIZATION_DATA.thirdNF.deskripsi}
              </p>
            </div>
            <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" />
              Optimal untuk Forward Chaining
            </span>
          </div>

          {/* 5 Tabel 3NF Sesuai Dokumen 1 */}
          <div className="space-y-6">
            {/* 1. Tabel User */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>1. Tabel User (Autentikasi & Hak Akses)</span>
                <span className="font-mono text-emerald-400">PK: id_user</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">ID User</th>
                    <th className="py-2 px-3">Username</th>
                    <th className="py-2 px-3">Password (Hash / Default)</th>
                    <th className="py-2 px-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {NORMALIZATION_DATA.thirdNF.tabelUser.map(u => (
                    <tr key={u.idUser} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-blue-600">{u.idUser}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{u.username}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{u.password}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'Teknisi' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. Tabel Gejala 3NF */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>2. Tabel Gejala (Basis Fakta Forward Chaining)</span>
                <span className="font-mono text-blue-400">PK: id_gejala | Unique: kode_gejala</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">ID Gejala</th>
                    <th className="py-2 px-3">Kode Gejala</th>
                    <th className="py-2 px-3">Nama Gejala</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {NORMALIZATION_DATA.thirdNF.tabelGejala.map(g => (
                    <tr key={g.idGejala} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-500">{g.idGejala}</td>
                      <td className="py-2 px-3 font-mono font-bold text-blue-700">{g.kodeGejala}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{g.namaGejala}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. Tabel Kerusakan 3NF */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>3. Tabel Kerusakan (Konklusi & Solusi Perbaikan)</span>
                <span className="font-mono text-amber-400">PK: id_kerusakan | Unique: kode_kerusakan</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Kode Kerusakan</th>
                    <th className="py-2 px-3">Nama Kerusakan</th>
                    <th className="py-2 px-3">Solusi Perbaikan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {NORMALIZATION_DATA.thirdNF.tabelKerusakan.map(k => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-500">{k.id}</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-700">{k.kodeKerusakan}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{k.namaKerusakan}</td>
                      <td className="py-2 px-3 text-slate-700">{k.solusi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Tabel Rule 3NF */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>4. Tabel Rule (Relasi Aturan Forward Chaining IF-THEN)</span>
                <span className="font-mono text-purple-400">FK1: kode_gejala → gejala.kode | FK2: kode_kerusakan → kerusakan.kode</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">ID Rule</th>
                    <th className="py-2 px-3">FK ID Gejala</th>
                    <th className="py-2 px-3">FK ID Kerusakan</th>
                    <th className="py-2 px-3">Interpretasi Forward Chaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                  {NORMALIZATION_DATA.thirdNF.tabelRule.map(r => (
                    <tr key={r.idRule} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-800">{r.idRule}</td>
                      <td className="py-2 px-3 text-blue-700 font-bold">{r.idGejala}</td>
                      <td className="py-2 px-3 text-amber-700 font-bold">{r.idKerusakan}</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">
                        IF gejala adalah <strong className="text-blue-700">{r.idGejala}</strong> THEN kesimpulan kerusakan adalah <strong className="text-amber-700">{r.idKerusakan}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 5. Tabel Diagnosa 3NF */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                <span>5. Tabel Diagnosa (Riwayat Pemeriksaan Operator)</span>
                <span className="font-mono text-cyan-400">FK: id_user, id_mesin, id_kerusakan</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2 px-3">ID Diagnosa</th>
                    <th className="py-2 px-3">FK ID User</th>
                    <th className="py-2 px-3">FK ID Mesin</th>
                    <th className="py-2 px-3">FK ID Kerusakan Terdiagnosa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                  {NORMALIZATION_DATA.thirdNF.tabelDiagnosa.map(d => (
                    <tr key={d.idDiagnosa} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-800">{d.idDiagnosa}</td>
                      <td className="py-2 px-3 text-purple-700">{d.idUser}</td>
                      <td className="py-2 px-3 text-blue-700 font-bold">{d.idMesin}</td>
                      <td className="py-2 px-3 text-amber-700 font-bold">{d.idKerusakan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAHAP SUMMARY / MATRIKS KOMPARASI */}
      {activeStage === 'summary' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Matriks Transformasi & Keuntungan Normalisasi 3NF</h2>
            <p className="text-xs text-slate-600 mt-1">
              Perbandingan kualitas struktur data sebelum vs sesudah normalisasi pada sistem pakar troubleshooting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-bold text-sm text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Sebelum Normalisasi (UNF & 1NF):
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  Redundansi teks nama kerusakan & solusi berulang di setiap baris.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  Anomali peremajaan (update anomaly) bila solusi perbaikan diganti.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  Mesin inferensi Forward Chaining sulit mencocokkan gejala karena kolom multivalue.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  Tidak ada pemisahan hak akses antara Operator dan Teknisi.
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h3 className="font-bold text-sm text-emerald-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Setelah Normalisasi 3NF (Sistem Ini):
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Tabel independen: User, Mesin, Gejala, Kerusakan, Rule, Diagnosa.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Bebas ketergantungan parsial dan transitif, penyimpanan hemat & konsisten.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Pencocokan aturan Forward Chaining berlangsung cepat melalui foreign key kode.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Mendukung alur panggil teknisi dan konfirmasi perbaikan secara modular.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

