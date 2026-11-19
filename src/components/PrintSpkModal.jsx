import React, { useEffect } from 'react';
import { Printer, X, ArrowLeft } from 'lucide-react';

export default function PrintSpkModal({ 
  isOpen, 
  onClose, 
  data 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const { machine, diagnosis, selectedGejala, currentUser } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-fadeIn my-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="print-hide flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Kembali ke daftar antrean (Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Kembali</span>
            </button>
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              Pratinjau Lembar Kerja SPK
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Dokumen
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              title="Tutup lembar SPK (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Tutup</span>
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

        {/* Bottom Action Footer */}
        <div className="print-hide flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-6 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl">
          <div className="text-[11px] text-slate-500">
            Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-700 shadow-xs">ESC</kbd> atau klik area luar untuk menutup
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-200 bg-white text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Kembali / Tutup</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen SPK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
