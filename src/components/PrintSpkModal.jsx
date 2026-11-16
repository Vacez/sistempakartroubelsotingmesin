import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';

export default function PrintSpkModal({ 
  isOpen, 
  onClose, 
  data 
}) {
  if (!isOpen || !data) return null;

  const { machine, diagnosis, selectedGejala, currentUser } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-fadeIn my-6">
        {/* Top Control Bar */}
        <div className="print-hide flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
          <div className="text-xs text-slate-500 font-medium">
            Pratinjau Lembar Kerja Perintah Perbaikan (SPK)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Dokumen
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="border border-slate-300 p-6 rounded text-slate-900 font-sans text-xs space-y-4 bg-white">
          {/* Letterhead */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <div className="text-sm font-extrabold tracking-tight">PT VIVO MOBILE INDONESIA</div>
              <div className="text-[11px] text-slate-600">Departemen Pemeliharaan & Rekayasa Otomasi Pabrik</div>
              <div className="text-[10px] text-slate-500">Lini Manufaktur Perakitan Smartphone</div>
            </div>
            <div className="text-right">
              <span className="inline-block border border-slate-900 px-2 py-0.5 font-mono font-bold text-[10px]">
                SPK-DIAGNOSA
              </span>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                No: SPK-VVO-{new Date().getFullYear()}-{Date.now().toString().slice(-4)}
              </div>
            </div>
          </div>

          <div className="text-center py-0.5">
            <h3 className="font-bold text-xs uppercase underline tracking-wider">
              LEMBAR HASIL DIAGNOSA TROUBLESHOOTING MESIN (FORWARD CHAINING)
            </h3>
          </div>

          {/* Machine & Operator Data */}
          <div className="grid grid-cols-2 gap-3 border border-slate-200 p-3 bg-slate-50/50 rounded">
            <div className="space-y-1">
              <div><strong>Unit Mesin:</strong> {machine?.nama}</div>
              <div><strong>Kode Mesin:</strong> {machine?.id} ({machine?.kode})</div>
              <div><strong>Lokasi Lini:</strong> {machine?.lokasi}</div>
            </div>
            <div className="space-y-1">
              <div><strong>Tanggal Pemeriksaan:</strong> {new Date().toLocaleDateString('id-ID')}</div>
              <div><strong>Waktu:</strong> {new Date().toLocaleTimeString('id-ID')} WIB</div>
              <div><strong>Pemeriksa:</strong> {currentUser?.nama} ({currentUser?.role})</div>
            </div>
          </div>

          {/* Symptoms List */}
          <div className="space-y-1">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
              I. INDIKASI GEJALA LAPANGAN (FACTS ASSERTION):
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px] space-y-0.5">
              {selectedGejala && selectedGejala.length > 0 ? (
                selectedGejala.map((g, idx) => (
                  <div key={idx}>• [{g}] Indikasi terkonfirmasi aktif</div>
                ))
              ) : (
                <div>Tidak ada rincian gejala.</div>
              )}
            </div>
          </div>

          {/* Inference Conclusion */}
          <div className="space-y-1">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
              II. KESIMPULAN INFERENSI FORWARD CHAINING:
            </div>
            <div className="border border-slate-200 p-2.5 rounded space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs">[{diagnosis?.kodeKerusakan}] {diagnosis?.namaKerusakan}</span>
                <span className="font-mono font-bold">Kecocokan: {diagnosis?.percentage}%</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Tingkat Kerusakan: <strong className="uppercase">{diagnosis?.tingkat}</strong> (Penanganan: {diagnosis?.penangananOleh})
              </div>
            </div>
          </div>

          {/* Recommended SOP */}
          <div className="space-y-1">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
              III. REKOMENDASI TINDAKAN & SOLUSI PERBAIKAN:
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-slate-800 text-[11px]">
              <div><strong>Solusi Utama:</strong> {diagnosis?.solusi}</div>
              <div><strong>Tindakan Mandiri:</strong> {diagnosis?.tindakanOperator || '-'}</div>
              <div><strong>Rekomendasi Teknisi:</strong> {diagnosis?.rekomendasiTeknisi || '-'}</div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-center text-xs">
            <div>
              <div className="text-slate-500 mb-10">Operator Pelapor</div>
              <div className="font-bold underline">{currentUser?.nama}</div>
              <div className="text-[10px] text-slate-400 font-mono">{currentUser?.nip || 'EMP-VVO'}</div>
            </div>
            <div>
              <div className="text-slate-500 mb-10">Teknisi Penanggung Jawab</div>
              <div className="font-bold underline">Rian Kurniawan</div>
              <div className="text-[10px] text-slate-400 font-mono">ENG-VVO-2021-019</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
