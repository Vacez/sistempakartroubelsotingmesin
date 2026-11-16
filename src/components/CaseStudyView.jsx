import React, { useState } from 'react';
import { 
  Factory, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sliders, 
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function CaseStudyView({ machines = [] }) {
  const [selectedMachineTab, setSelectedMachineTab] = useState('M01');

  const machineDetails = {
    M01: {
      nama: 'Mesin ASM (Automatic Screw Manual)',
      tipe: 'Screw Fastener & Torque Control',
      lini: 'Line Assembly 1 - PT Vivo Mobile Indonesia',
      fotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
      gejalaKhas: [
        'Baut tidak dapat keluar dari jalur keluar (feeder macet)',
        'Silicone pada smartphone terangkat / pemasangannya miring',
        'Lampu indikator kuning menyala (Status NG Ringan)',
        'Lampu indikator merah menyala (Gangguan Mekanik Berat)'
      ],
      tindakanOperator: [
        'Jika indikator KUNING: Masalah masih dapat ditangani mandiri tanpa teknisi.',
        'Silicone miring: Pasang kembali silicone secara benar dan rapi sesuai SOP.',
        'Baut macet di jalur: Lakukan pengetukan pada rel jalur baut agar ada getaran pelancar.'
      ],
      tindakanTeknisi: [
        'Jika indikator MERAH: Mesin gagal membaut atau posisi baut melenceng.',
        'Kerusakan sistem mekanik atau limit switch feeder.',
        'Wajib segera panggil teknisi untuk kalibrasi torsi dan reposisi nozzle screw.'
      ],
      kutipanDokumen: 'Dokumen 2 Hal 2-3: "Apabila muncul kondisi NG atau indikator berwarna kuning, umumnya masalah tersebut masih dapat ditangani langsung oleh operator tanpa bantuan teknisi... Namun jika muncul indikator merah, operator harus segera memanggil teknisi."'
    },
    M02: {
      nama: 'Mesin AGM (Automatic Glue Manual)',
      tipe: 'Automated Adhesive Dispenser & Conveyor',
      lini: 'Line Dispensing 2 - PT Vivo Mobile Indonesia',
      fotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
      gejalaKhas: [
        'Conveyor (kompayer) mengalami kemacetan atau motor panas',
        'Alarm berbunyi dan lampu indikator kuning menyala',
        'Hasil lem tidak presisi dan meluber ke sisi samping smartphone',
        'Penyebaran lem tidak merata di alur perekat casing'
      ],
      tindakanOperator: [
        'Kondisi conveyor macet ringan: Ditangani langsung melalui komputer kontrol AGM.',
        'SOP Tombol Kontrol: Tekan tombol STOP → tekan tombol RESET → tekan tombol RUN.',
        'Mesin dapat berjalan normal kembali tanpa perlu menunggu teknisi.'
      ],
      tindakanTeknisi: [
        'Jika lem meluber ke samping atau penyebaran tidak presisi.',
        'Terjadi gangguan error pengaturan program dispenser pada komputer AGM.',
        'Teknisi melakukan kalibrasi koordinat X-Y-Z nozzle, parameter tekanan dispensing lem, dan pembersihan jarum nozzle.'
      ],
      kutipanDokumen: 'Dokumen 2 Hal 3-4: "Operator dapat melakukan penanganan melalui komputer kontrol pada mesin lem dengan memilih tombol stop, kemudian reset, dan setelah itu menekan run... Namun bila lem meluber, operator harus segera memanggil teknisi."'
    },
    M03: {
      nama: 'Mesin Press 3 in 1',
      tipe: 'Multi-Axis Casing & Screen Press',
      lini: 'Line Casing Press - PT Vivo Mobile Indonesia',
      fotoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=700&q=80',
      gejalaKhas: [
        'Tekanan bagian belakang melebihi batas standar (misal standar 418, terbaca lebih tinggi)',
        'Alarm buzzer mesin berbunyi terus-menerus saat penekanan',
        'Sensor pembacaan tekanan (load cell) tidak normal atau drift',
        'Bodi komponen smartphone berisiko retak jika tekanan berlebih'
      ],
      tindakanOperator: [
        'Jika hanya terjadi bunyi indikator sesekali, periksa posisi peletakan moulding smartphone.',
        'Hentikan penekanan jika alarm terus-menerus berbunyi.',
        'Jangan memaksa siklus press jika tekanan di atas 418.'
      ],
      tindakanTeknisi: [
        'Pemeriksaan dan kalibrasi load cell sensor tekanan di dalam mesin.',
        'Setting ulang ambang batas limit tekanan pada PLC kontroler.',
        'Pengecekan katup pneumatic proportional regulator.'
      ],
      kutipanDokumen: 'Dokumen 2 Hal 5-6: "Tekanan yang seharusnya berada pada angka 418 justru menunjukkan nilai yang melebihi batas tersebut sehingga mesin mengeluarkan bunyi indikator... teknisi perlu melakukan kalibrasi komponen sensor."'
    },
    M04: {
      nama: 'Mesin AirTightness',
      tipe: 'Waterproof Leakage Tester (Pneumatic)',
      lini: 'Line QC & Reliability - PT Vivo Mobile Indonesia',
      fotoUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=700&q=80',
      gejalaKhas: [
        'Hasil pengujian kedap air muncul status NG (No Good) terus-menerus',
        'Kebocoran tekanan udara pada selang penyalur mesin',
        'Tekanan udara ruang uji tidak stabil atau fluktuatif',
        'Sensor differensial tekanan udara error'
      ],
      tindakanOperator: [
        'Operator tidak dapat melakukan perbaikan mandiri karena menyangkut sistem sensor utama.',
        'Pastikan seal karet chamber pengujian bersih dari debu atau serpihan.',
        'Segera laporkan dan panggil teknisi maintenance.'
      ],
      tindakanTeknisi: [
        'Mengecek titik kebocoran pada selang dan sambungan fitting pneumatik.',
        'Kalibrasi sensor tekanan diferensial mikrometer.',
        'Menguji ulang sampel smartphone standar (Golden Sample) untuk verifikasi akurasi.'
      ],
      kutipanDokumen: 'Dokumen 2 Hal 4-5: "Mesin AirTightness terkadang mengalami kondisi NG terus-menerus saat pengecekan, disebabkan kebocoran pada selang mesin... operator tidak dapat memperbaiki mandiri sehingga teknisi harus segera dipanggil."'
    },
    M05: {
      nama: 'Mesin Control Coldpress Pressure',
      tipe: 'Battery Cold Press & Vision Barcode Inspector',
      lini: 'Line Battery Assembly - PT Vivo Mobile Indonesia',
      fotoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80',
      gejalaKhas: [
        'Kamera sensor gagal membaca barcode baterai yang diproses',
        'Bagian press dingin tidak mau turun saat siklus dimulai',
        'Alarm gangguan muncul berulang secara berkala (setiap ~4 jam kerja)',
        'Proses pemasangan baterai smartphone terhenti'
      ],
      tindakanOperator: [
        'Cek permukaan barcode baterai dari kotoran atau stiker terlipat.',
        'Karena kerusakan berulang setiap ~4 jam, ini menandakan problem sistematis yang tidak boleh di-bypass operator.',
        'Segera klik tombol "Panggil Teknisi" pada aplikasi.'
      ],
      tindakanTeknisi: [
        'Pengecekan lensa vision camera barcode reader dan tuning parameter exposure.',
        'Kalibrasi limit switch dan selenoid valve silinder penekan baterai.',
        'Pemeriksaan log PLC untuk melacak trigger interupsi siklus 4 jam.'
      ],
      kutipanDokumen: 'Dokumen 2 Hal 6-7: "Permasalahan pada mesin Control Coldpress Pressure dapat muncul setiap beberapa jam kerja, sekitar setiap 4 jam operasional... menunjukkan kerusakan cukup serius dan membutuhkan teknisi."'
    }
  };

  const currentDetail = machineDetails[selectedMachineTab] || machineDetails.M01;

  return (
    <div className="space-y-6">
      {/* Header Studi Kasus */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Karakteristik & Profil Masalah Mesin Pabrik
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Catatan studi kasus lapangan PT Vivo Mobile Indonesia: batasan tindakan mandiri operator vs kriteria pemanggilan teknisi (Dokumen 2).
            </p>
          </div>
        </div>

        {/* Machine Tabs */}
        <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto pb-1 scrollbar-none">
          {machines.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMachineTab(m.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedMachineTab === m.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="font-mono font-bold">{m.kode}</span>
              <span className="hidden sm:inline font-normal">({m.nama.split('(')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Machine Detail Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
                {selectedMachineTab}
              </span>
              <h2 className="text-base font-bold text-slate-900">{currentDetail.nama}</h2>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Tipe: <strong>{currentDetail.tipe}</strong> • Lokasi: <strong>{currentDetail.lini}</strong>
            </div>
          </div>
        </div>

        {/* Kutipan Resmi Dokumen 2 Logbook */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs text-slate-800">
          <div className="font-semibold text-slate-700 text-[11px] mb-1">
            Catatan Observasi Lapangan (Logbook Dokumen 2):
          </div>
          <p className="italic text-slate-600 leading-relaxed font-sans">
            "{currentDetail.kutipanDokumen}"
          </p>
        </div>

        {/* Grid: Gejala Khas vs Penanganan Operator vs Teknisi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kolom 1: Gejala Khas Sering Terjadi */}
          <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
              Gejala yang Sering Terjadi:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentDetail.gejalaKhas.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
                  <span className="font-mono font-bold text-slate-500 text-[10px] shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 2: SOP Tindakan Mandiri Operator */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-lg p-3.5 space-y-2.5">
            <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              SOP Tindakan Mandiri Operator:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentDetail.tindakanOperator.map((to, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-emerald-200/80">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{to}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Penanganan Wajib Teknisi */}
          <div className="bg-rose-50/40 border border-rose-200 rounded-lg p-3.5 space-y-2.5">
            <h3 className="font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-rose-600" />
              Kriteria Wajib Panggil Teknisi:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentDetail.tindakanTeknisi.map((tt, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-rose-200/80">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{tt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ringkasan Manfaat Sistem Pakar untuk Lini Produksi */}
        <div className="bg-slate-900 text-white rounded-lg p-4 text-xs">
          <div className="font-semibold text-slate-200 mb-1.5">
            Target Penurunan Waktu Downtime (PT Vivo Mobile Indonesia):
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Sistem pakar Forward Chaining memotong waktu tunggu teknisi secara signifikan. Masalah operasional ringan 
            seperti conveyor jammed (SOP Stop–Reset–Run), perbaikan letak silicone, atau getaran feeder baut dapat 
            diselesaikan langsung di tempat oleh operator lini dalam hitungan menit tanpa menghentikan produksi utama.
          </p>
        </div>
      </div>
    </div>
  );
}

