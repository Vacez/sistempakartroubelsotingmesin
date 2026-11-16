import React, { useState } from 'react';
import { 
  GitFork, 
  Database, 
  Workflow, 
  Activity, 
  FileCheck, 
  ArrowRight, 
  ArrowDown, 
  Layers, 
  UserCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  User,
  Wrench
} from 'lucide-react';

export default function DiagramsView() {
  const [activeDiagram, setActiveDiagram] = useState('usecase'); // 'usecase' | 'erd' | 'flowchart' | 'activity' | 'sequence'
  const [activeFlowchartType, setActiveFlowchartType] = useState('usulan'); // 'usulan' | 'sebelum'
  const [activeActivityType, setActiveActivityType] = useState('diagnosa'); // 'login' | 'diagnosa' | 'panggil' | 'perbaikan'
  const [activeSequenceType, setActiveSequenceType] = useState('diagnosa'); // 'login' | 'diagnosa' | 'panggil' | 'perbaikan'

  return (
    <div className="space-y-6">
      {/* Header Diagram */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Diagram Arsitektur Sistem & Pemodelan UML
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Spesifikasi visual Use Case, Entity Relationship (ERD), Flowchart, Activity, dan Sequence Diagram (Dokumen 1 Hal 10–16).
            </p>
          </div>
        </div>

        {/* Tab Diagram Selection */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {[
            { id: 'usecase', label: 'Use Case Diagram' },
            { id: 'erd', label: 'ERD (Relasi Database)' },
            { id: 'flowchart', label: 'Flowchart Komparasi' },
            { id: 'activity', label: 'Activity Diagrams' },
            { id: 'sequence', label: 'Sequence Diagrams' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDiagram(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                activeDiagram === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. USE CASE DIAGRAM */}
      {activeDiagram === 'usecase' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Use Case Diagram Sistem Pakar</h2>
              <p className="text-xs text-slate-500">
                Interaksi antara 2 aktor utama (Pengguna/Operator dan Teknisi) dengan sistem pakar troubleshooting.
              </p>
            </div>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-lg text-slate-600 font-mono">
              Dokumen 1 Hal 10
            </span>
          </div>

          {/* Interactive Diagram for Use Case */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 overflow-x-auto">
            <div className="min-w-[700px] flex items-center justify-between gap-6 py-4">
              {/* Actor 1: Pengguna / Operator */}
              <div className="w-48 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white mx-auto flex items-center justify-center font-bold border border-slate-700 shadow-sm">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Pengguna (Operator)</div>
                  <div className="text-[10px] text-slate-500">Lini Produksi Smartphone</div>
                </div>
                <div className="space-y-1 text-xs text-left bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Hak Akses:</div>
                  <div className="text-slate-700">• Login Pengguna</div>
                  <div className="text-slate-700">• Pilih Gejala Kerusakan</div>
                  <div className="text-slate-700">• Proses Forward Chaining</div>
                  <div className="text-slate-700">• Lihat Hasil & Solusi</div>
                  <div className="text-slate-700">• Panggil Teknisi</div>
                  <div className="text-slate-700">• Logout</div>
                </div>
              </div>

              {/* System Boundary */}
              <div className="flex-1 bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-2.5">
                <div className="text-center font-bold text-[11px] uppercase tracking-wider text-slate-700 bg-slate-100 py-1 rounded mb-3">
                  Batasan Sistem Pakar Troubleshooting Mesin Produksi
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-center text-slate-800">
                    Login (Pengguna / Teknisi)
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-center text-slate-800">
                    Pilih Gejala Kerusakan
                  </div>
                  <div className="col-span-2 p-2.5 rounded-lg border border-slate-900 bg-slate-900 text-white font-bold text-center flex items-center justify-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    Proses Diagnosa (Forward Chaining)
                    <span className="text-[10px] font-normal text-slate-400 font-mono">«include»</span>
                  </div>
                  <div className="col-span-2 p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-center text-slate-800">
                    Tampilkan Hasil Diagnosa & Solusi «include»
                  </div>
                  <div className="p-2 rounded-lg border border-rose-200 bg-rose-50/60 font-medium text-center text-rose-800">
                    Panggil Teknisi (Trouble Ticket)
                  </div>
                  <div className="p-2 rounded-lg border border-amber-200 bg-amber-50/60 font-medium text-center text-amber-800">
                    Rekomendasi Perbaikan Teknisi
                  </div>
                  <div className="col-span-2 p-2 rounded-lg border border-emerald-200 bg-emerald-50/60 font-semibold text-center text-emerald-800">
                    Konfirmasi Perbaikan Selesai
                  </div>
                </div>
              </div>

              {/* Actor 2: Teknisi */}
              <div className="w-48 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white mx-auto flex items-center justify-center font-bold border border-slate-700 shadow-sm">
                  <Wrench className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Teknisi Mesin</div>
                  <div className="text-[10px] text-slate-500">Maintenance & Repair</div>
                </div>
                <div className="space-y-1 text-xs text-left bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Hak Akses:</div>
                  <div className="text-slate-700">• Login Teknisi</div>
                  <div className="text-slate-700">• Lihat Daftar Permintaan</div>
                  <div className="text-slate-700">• Lihat Hasil Diagnosa</div>
                  <div className="text-slate-700">• Rekomendasi Perbaikan</div>
                  <div className="text-slate-700">• Konfirmasi Perbaikan</div>
                  <div className="text-slate-700">• Logout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ERD DIAGRAM */}
      {activeDiagram === 'erd' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Entity Relationship Diagram (ERD)</h2>
              <p className="text-xs text-slate-500">
                Struktur hubungan antar tabel (1-N) pada basis data sistem pakar Forward Chaining (Dokumen 1 Hal 10).
              </p>
            </div>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-lg text-slate-600 font-mono">
              Dokumen 1 Hal 10
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 overflow-x-auto">
            <div className="min-w-[700px] flex flex-col items-center gap-8 py-4">
              {/* Baris 1: Tabel User & Tabel Mesin */}
              <div className="flex items-center justify-center gap-12 w-full">
                {/* Tabel User */}
                <div className="w-56 bg-amber-50 border-2 border-amber-400 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-amber-500 text-white font-bold text-xs px-3 py-1.5 text-center">
                    User
                  </div>
                  <div className="p-3 text-xs font-mono space-y-1 text-slate-800">
                    <div className="font-bold text-amber-900">🔑 PK id</div>
                    <div>username</div>
                    <div>password</div>
                    <div>role (Operator/Teknisi)</div>
                  </div>
                </div>

                {/* Tabel Mesin */}
                <div className="w-56 bg-blue-50 border-2 border-blue-400 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 text-center">
                    Mesin Produksi
                  </div>
                  <div className="p-3 text-xs font-mono space-y-1 text-slate-800">
                    <div className="font-bold text-blue-900">🔑 PK id_mesin</div>
                    <div>kode (ASM/AGM/Press/dll)</div>
                    <div>nama_mesin</div>
                    <div>lokasi_line</div>
                  </div>
                </div>
              </div>

              {/* Baris 2: Gejala & Kerusakan */}
              <div className="flex items-center justify-center gap-16 w-full">
                {/* Tabel Gejala */}
                <div className="w-60 bg-sky-50 border-2 border-sky-400 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-sky-600 text-white font-bold text-xs px-3 py-1.5 text-center">
                    Gejala
                  </div>
                  <div className="p-3 text-xs font-mono space-y-1 text-slate-800">
                    <div className="font-bold text-sky-900">🔑 PK id_gejala</div>
                    <div className="font-bold text-blue-700">kode (G01 - G10)</div>
                    <div>nama</div>
                    <div>mesin</div>
                  </div>
                </div>

                <div className="text-center font-bold text-slate-400 text-xs">
                  Basis Aturan<br />
                  <span className="text-purple-600 font-mono">1 - N</span>
                </div>

                {/* Tabel Kerusakan */}
                <div className="w-60 bg-rose-50 border-2 border-rose-400 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-rose-600 text-white font-bold text-xs px-3 py-1.5 text-center">
                    Kerusakan
                  </div>
                  <div className="p-3 text-xs font-mono space-y-1 text-slate-800">
                    <div className="font-bold text-rose-900">🔑 PK id_kerusakan</div>
                    <div className="font-bold text-rose-700">kode (K01 - K05)</div>
                    <div>nama</div>
                    <div>solusi</div>
                  </div>
                </div>
              </div>

              {/* Baris 3: Tabel Rule (Tengah Menghubungkan) */}
              <div className="w-72 bg-purple-50 border-2 border-purple-500 rounded-xl overflow-hidden shadow-md">
                <div className="bg-purple-700 text-white font-bold text-xs px-3 py-1.5 text-center">
                  Rule (Basis Pengetahuan)
                </div>
                <div className="p-3 text-xs font-mono space-y-1 text-slate-800">
                  <div className="font-bold text-purple-900">🔑 PK id_rule</div>
                  <div className="text-blue-700">🔗 FK kode_gejala → Gejala.kode</div>
                  <div className="text-rose-700">🔗 FK kode_kerusakan → Kerusakan.kode</div>
                  <div>bobot</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FLOWCHART (SEBELUM VS USULAN) */}
      {activeDiagram === 'flowchart' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Perbandingan Flowchart Sistem</h2>
              <p className="text-xs text-slate-500">
                Alur penanganan mesin sebelum ada aplikasi (manual) vs flowchart usulan dengan sistem pakar Forward Chaining.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveFlowchartType('sebelum')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                  activeFlowchartType === 'sebelum' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sistem Sebelum Aplikasi (Manual)
              </button>
              <button
                onClick={() => setActiveFlowchartType('usulan')}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                  activeFlowchartType === 'usulan' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flowchart Usulan (Forward Chaining)
              </button>
            </div>
          </div>

          {/* Flowchart Sebelum Aplikasi (Manual) */}
          {activeFlowchartType === 'sebelum' && (
            <div className="bg-red-50/40 rounded-2xl p-6 border border-red-200">
              <div className="text-xs font-bold text-red-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Flowchart Sistem Berjalan Sebelum Aplikasi (Dokumen 1 Hal 11) - Risiko Downtime Tinggi
              </div>

              <div className="max-w-md mx-auto space-y-2 text-xs text-center font-medium">
                <div className="p-2 rounded-full bg-slate-800 text-white w-28 mx-auto font-bold">Mulai</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Mesin mengalami gangguan / kerusakan</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Operator memeriksa kondisi mesin</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Operator menjelaskan gejala kerusakan kepada teknisi</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-900 font-semibold shadow-sm">
                  ⚠️ Operator menghubungi / mencari teknisi (Waktu Tunggu Lama)
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Teknisi datang ke lokasi mesin</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Teknisi melakukan pengecekan mesin secara manual</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Teknisi mencari sumber kerusakan mesin</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">Teknisi melakukan perbaikan mesin</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold shadow-sm">
                  Apakah mesin sudah normal?
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold shadow-sm">
                  Mesin kembali beroperasi normal
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2 rounded-full bg-slate-800 text-white w-28 mx-auto font-bold">Selesai</div>
              </div>
            </div>
          )}

          {/* Flowchart Usulan (Forward Chaining) */}
          {activeFlowchartType === 'usulan' && (
            <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Flowchart Usulan Sistem Pakar Berbasis Web (Dokumen 1 Hal 12) - Cepat & Terstruktur
              </div>

              <div className="max-w-lg mx-auto space-y-2 text-xs text-center font-medium">
                <div className="p-2 rounded-full bg-slate-800 text-white w-28 mx-auto font-bold">Mulai</div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                  Pengguna membuka aplikasi maintenance & login (Operator / Teknisi)
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                  Sistem menampilkan Halaman Utama (Dashboard)
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 font-semibold shadow-sm">
                  Operator memilih menu Diagnosa kerusakan & memilih mesin yang akan didiagnosa
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shadow-sm">
                  Sistem menampilkan daftar gejala sesuai mesin & Operator memilih gejala yang dialami
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-3 rounded-xl bg-purple-100 border-2 border-purple-400 text-purple-900 font-bold shadow-md">
                  ⚙️ Sistem melakukan proses diagnosa dengan metode Forward Chaining (Rule, Gejala, Kerusakan)
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-3 rounded-xl bg-white border border-slate-300 shadow-sm text-left">
                  <div className="font-bold text-slate-800 text-center mb-1">Sistem menampilkan hasil diagnosa:</div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>• Jenis Kerusakan terdeteksi</div>
                    <div>• Persentase Kecocokan: (Gejala Cocok / Total Gejala Rule) x 100%</div>
                    <div>• Tingkat Kerusakan: Ringan / Sedang / Parah</div>
                    <div>• Solusi Penanganan Resmi</div>
                  </div>
                </div>
                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-3 rounded-xl bg-amber-100 border border-amber-400 text-amber-900 font-bold shadow-sm">
                  Apakah kerusakan kategori parah?
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-900 shadow-sm">
                    <span className="font-bold text-xs">[YA]:</span> Sistem memberikan rekomendasi untuk penanganan lebih lanjut oleh teknisi (Panggil Teknisi)
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 shadow-sm">
                    <span className="font-bold text-xs">[TIDAK]:</span> Operator melakukan penanganan mandiri sesuai solusi yang diberikan
                  </div>
                </div>

                <ArrowDown className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="p-2 rounded-full bg-slate-800 text-white w-28 mx-auto font-bold">Selesai</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. ACTIVITY DIAGRAMS */}
      {activeDiagram === 'activity' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activity Diagrams (Swimlane Pengguna vs Sistem)</h2>
              <p className="text-xs text-slate-500">
                Alur aktivitas pengguna dan respon sistem otomatis (Dokumen 1 Hal 13 - 14).
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'login', label: 'Activity Login' },
                { id: 'diagnosa', label: 'Activity Diagnosa' },
                { id: 'panggil', label: 'Activity Panggil Teknisi' },
                { id: 'perbaikan', label: 'Activity Perbaikan' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveActivityType(t.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                    activeActivityType === t.id ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Swimlane Container */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            {activeActivityType === 'login' && (
              <div className="space-y-4">
                <div className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Activity Diagram Login (Pengguna/Teknisi & Sistem)
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-blue-700 pb-2 border-b">Pengguna / Teknisi</div>
                    <div className="p-2 bg-slate-50 rounded border">1. Membuka halaman login</div>
                    <div className="p-2 bg-slate-50 rounded border">2. Menginput username dan password</div>
                    <div className="p-2 bg-emerald-50 rounded border text-emerald-800 font-semibold">5. Masuk ke dashboard sesuai role</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-purple-700 pb-2 border-b">Sistem</div>
                    <div className="p-2 bg-slate-50 rounded border">Menampilkan halaman login</div>
                    <div className="p-2 bg-purple-50 rounded border text-purple-900 font-semibold">3. Validasi username dan password</div>
                    <div className="p-2 bg-slate-50 rounded border">4. Valid? Jika Ya → Buka Dashboard; Jika Tidak → Tampilkan Error</div>
                  </div>
                </div>
              </div>
            )}

            {activeActivityType === 'diagnosa' && (
              <div className="space-y-4">
                <div className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Activity Diagram Diagnosa Kerusakan Mesin
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-blue-700 pb-2 border-b">Pengguna (Operator)</div>
                    <div className="p-2 bg-slate-50 rounded border">1. Memilih menu Diagnosa</div>
                    <div className="p-2 bg-slate-50 rounded border">2. Memilih mesin yang akan didiagnosa</div>
                    <div className="p-2 bg-slate-50 rounded border">3. Memilih gejala-gejala yang dialami mesin</div>
                    <div className="p-2 bg-blue-600 text-white rounded font-bold text-center">4. Menekan tombol "Proses Diagnosa"</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-purple-700 pb-2 border-b">Sistem</div>
                    <div className="p-2 bg-slate-50 rounded border">Menampilkan daftar mesin produksi</div>
                    <div className="p-2 bg-slate-50 rounded border">Menampilkan daftar gejala sesuai mesin</div>
                    <div className="p-2 bg-purple-100 rounded border border-purple-300 font-bold text-purple-900">
                      5. Memproses diagnosa menggunakan metode Forward Chaining (IF-THEN)
                    </div>
                    <div className="p-2 bg-emerald-100 rounded border border-emerald-300 font-bold text-emerald-900">
                      6. Menampilkan hasil diagnosa (Kerusakan, Persentase, dan Solusi)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeActivityType === 'panggil' && (
              <div className="space-y-4">
                <div className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Activity Diagram Panggil Teknisi
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-blue-700 pb-2 border-b">Pengguna (Operator)</div>
                    <div className="p-2 bg-slate-50 rounded border">1. Memilih tombol / menu Panggil Teknisi</div>
                    <div className="p-2 bg-slate-50 rounded border">2. Mengisi detail lokasi dan catatan keluhan</div>
                    <div className="p-2 bg-red-600 text-white rounded font-bold text-center">3. Menekan tombol Kirim Permintaan</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-purple-700 pb-2 border-b">Sistem</div>
                    <div className="p-2 bg-purple-50 rounded border">4. Menyimpan permintaan ke tabel tiket</div>
                    <div className="p-2 bg-amber-50 rounded border font-semibold text-amber-900">5. Mengirim notifikasi permintaan ke teknisi</div>
                    <div className="p-2 bg-emerald-50 rounded border text-emerald-900 font-semibold">6. Menampilkan status permintaan ("Menunggu Teknisi")</div>
                  </div>
                </div>
              </div>
            )}

            {activeActivityType === 'perbaikan' && (
              <div className="space-y-4">
                <div className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Activity Diagram Konfirmasi Perbaikan (Teknisi)
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-amber-700 pb-2 border-b">Teknisi Mesin</div>
                    <div className="p-2 bg-slate-50 rounded border">1. Melihat daftar permintaan perbaikan masuk</div>
                    <div className="p-2 bg-slate-50 rounded border">2. Memilih permintaan & datang ke mesin</div>
                    <div className="p-2 bg-slate-50 rounded border">3. Melakukan perbaikan mekanik/elektrik</div>
                    <div className="p-2 bg-slate-50 rounded border">4. Mengisi laporan hasil perbaikan & rekomendasi</div>
                    <div className="p-2 bg-emerald-600 text-white rounded font-bold text-center">5. Menekan tombol Simpan & Selesai</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-center text-purple-700 pb-2 border-b">Sistem</div>
                    <div className="p-2 bg-slate-50 rounded border">Menampilkan detail kerusakan dan diagnosa operator</div>
                    <div className="p-2 bg-purple-50 rounded border">6. Menyimpan hasil perbaikan teknisi ke database</div>
                    <div className="p-2 bg-emerald-50 rounded border font-bold text-emerald-900">7. Mengubah status tiket menjadi "Selesai"</div>
                    <div className="p-2 bg-blue-50 rounded border text-blue-900">8. Mengirim notifikasi perbaikan selesai ke pengguna</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SEQUENCE DIAGRAMS */}
      {activeDiagram === 'sequence' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sequence Diagrams (Interaksi Objek Berurutan)</h2>
              <p className="text-xs text-slate-500">
                Pesan dan urutan waktu antar objek: Pengguna, Boundary Halaman, Controller, Entities, dan Database (Dokumen 1 Hal 15 - 16).
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'login', label: 'Sequence Login' },
                { id: 'diagnosa', label: 'Sequence Diagnosa' },
                { id: 'panggil', label: 'Sequence Panggil Teknisi' },
                { id: 'perbaikan', label: 'Sequence Perbaikan' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveSequenceType(t.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                    activeSequenceType === t.id ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs overflow-x-auto">
            {activeSequenceType === 'diagnosa' && (
              <div className="space-y-3 min-w-[650px]">
                <div className="text-amber-400 font-bold mb-4">
                  # SEQUENCE DIAGRAM DIAGNOSA KERUSAKAN (Dokumen 1 Hal 15)
                </div>
                <div className="text-slate-400">
                  Partisipan: [Pengguna] → [Halaman Diagnosa] → [Controller] → [Gejala] → [Forward Chaining] → [Kerusakan] → [Solusi] → [Database]
                </div>
                <div className="space-y-1.5 pt-3 text-slate-200">
                  <div>1. Pengguna ──( Pilih menu diagnosa )───────────────▶ Halaman Diagnosa</div>
                  <div>2. Halaman Diagnosa ──( Pilih mesin )──────────────▶ Controller</div>
                  <div>3. Controller ──( Ambil daftar gejala sesuai mesin )─▶ Gejala</div>
                  <div>4. Gejala ──( Kembalikan daftar gejala )────────────▶ Halaman Diagnosa</div>
                  <div>5. Pengguna ──( Centang gejala yang dialami )──────▶ Halaman Diagnosa</div>
                  <div>6. Halaman Diagnosa ──( Kirim gejala terpilih )─────▶ Controller</div>
                  <div>7. Controller ──( Proses forward chaining )────────▶ Forward Chaining Engine</div>
                  <div>8. Forward Chaining ──( Cocokkan rule & hitung %)──▶ Kerusakan</div>
                  <div>9. Kerusakan ──( Dapatkan solusi perbaikan )───────▶ Solusi</div>
                  <div>10. Solusi ──( Simpan hasil diagnosa )─────────────▶ Database</div>
                  <div>11. Database ──( Tampilkan hasil diagnosa & solusi )▶ Halaman Diagnosa ──▶ Pengguna</div>
                </div>
              </div>
            )}

            {activeSequenceType === 'login' && (
              <div className="space-y-3 min-w-[650px]">
                <div className="text-amber-400 font-bold mb-4">
                  # SEQUENCE DIAGRAM LOGIN (Dokumen 1 Hal 15)
                </div>
                <div className="text-slate-400">
                  Partisipan: [Pengguna] → [Halaman Login] → [Controller] → [Database]
                </div>
                <div className="space-y-1.5 pt-3 text-slate-200">
                  <div>1. Pengguna ──( Membuka halaman login )────────▶ Halaman Login</div>
                  <div>2. Pengguna ──( Memasukkan username & password )▶ Halaman Login</div>
                  <div>3. Halaman Login ──( Kirim data login )─────────▶ Controller</div>
                  <div>4. Controller ──( Validasi data login )─────────▶ Database</div>
                  <div>5. Database ──( Hasil validasi: Berhasil/Gagal )─▶ Controller</div>
                  <div>6. Controller ──( Status login berhasil )───────▶ Halaman Login</div>
                  <div>7. Halaman Login ──( Menampilkan Dashboard Utama Sesuai Role )──▶ Pengguna</div>
                </div>
              </div>
            )}

            {activeSequenceType === 'panggil' && (
              <div className="space-y-3 min-w-[650px]">
                <div className="text-amber-400 font-bold mb-4">
                  # SEQUENCE DIAGRAM PANGGIL TEKNISI (Dokumen 1 Hal 16)
                </div>
                <div className="text-slate-400">
                  Partisipan: [Pengguna] → [Halaman Panggil Teknisi] → [Controller] → [Database] → [Notifikasi] → [Teknisi]
                </div>
                <div className="space-y-1.5 pt-3 text-slate-200">
                  <div>1. Pengguna ──( Pilih tombol Panggil Teknisi )───▶ Halaman Panggil Teknisi</div>
                  <div>2. Halaman Panggil ──( Kirim detail permintaan )─▶ Controller</div>
                  <div>3. Controller ──( Simpan permintaan tiket )──────▶ Database</div>
                  <div>4. Database ──( Konfirmasi berhasil disimpan )───▶ Controller</div>
                  <div>5. Controller ──( Kirim notifikasi permintaan )──▶ Notifikasi</div>
                  <div>6. Notifikasi ──( Terima notifikasi tiket masuk )▶ Teknisi Mesin</div>
                  <div>7. Notifikasi ──( Notifikasi terkirim )──────────▶ Controller</div>
                  <div>8. Controller ──( Tampilkan status permintaan )──▶ Halaman Panggil ──▶ Pengguna</div>
                </div>
              </div>
            )}

            {activeSequenceType === 'perbaikan' && (
              <div className="space-y-3 min-w-[650px]">
                <div className="text-amber-400 font-bold mb-4">
                  # SEQUENCE DIAGRAM PERBAIKAN (Dokumen 1 Hal 16)
                </div>
                <div className="text-slate-400">
                  Partisipan: [Teknisi] → [Halaman Perbaikan] → [Controller] → [Database] → [Notifikasi] → [Pengguna]
                </div>
                <div className="space-y-1.5 pt-3 text-slate-200">
                  <div>1. Teknisi ──( Pilih menu perbaikan & ambil tiket )▶ Halaman Perbaikan</div>
                  <div>2. Halaman Perbaikan ──( Kirim data perbaikan )───▶ Controller</div>
                  <div>3. Controller ──( Simpan hasil perbaikan )─────────▶ Database</div>
                  <div>4. Database ──( Konfirmasi berhasil disimpan )────▶ Controller</div>
                  <div>5. Controller ──( Kirim notifikasi perbaikan selesai )▶ Notifikasi</div>
                  <div>6. Notifikasi ──( Terima status perbaikan selesai )▶ Pengguna (Operator)</div>
                  <div>7. Notifikasi ──( Notifikasi terkirim )───────────▶ Controller</div>
                  <div>8. Controller ──( Ubah status tiket jadi 'Selesai' )▶ Halaman Perbaikan</div>
                  <div>9. Halaman Perbaikan ──( Tampilkan status perbaikan tuntas )▶ Teknisi</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

