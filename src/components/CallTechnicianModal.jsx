import React, { useState } from 'react';
import { Send, MapPin, Wrench, X, AlertCircle } from 'lucide-react';

export default function CallTechnicianModal({ 
  isOpen, 
  onClose, 
  ticketData, 
  currentUser, 
  onSubmitTicket 
}) {
  if (!isOpen || !ticketData) return null;

  const { machine, diagnosis, selectedGejala } = ticketData;

  const [form, setForm] = useState({
    lokasi: machine?.lokasi || 'Line Assembly 1 - PT Vivo Mobile Indonesia',
    urgensi: diagnosis?.tingkat === 'Parah' ? 'Urgent' : 'Normal',
    catatan: `Unit ${machine?.nama} terdeteksi ${diagnosis?.namaKerusakan}. Menunggu tindakan teknisi.`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSubmitTicket) return;

    const newTicket = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      idDiagnosa: `DIAG-${Date.now().toString().slice(-4)}`,
      idOperator: currentUser?.id || 'U01',
      namaOperator: currentUser?.nama || 'Operator Lini',
      idMesin: machine?.id || 'M01',
      namaMesin: machine?.nama || 'Mesin Produksi',
      lokasi: form.lokasi,
      kerusakan: diagnosis?.namaKerusakan || 'Kerusakan Mesin',
      tingkat: diagnosis?.tingkat || 'Parah',
      persentase: diagnosis?.percentage || 100,
      catatanOperator: form.catatan,
      urgensi: form.urgensi,
      waktuPanggilan: new Date().toLocaleString('id-ID'),
      status: 'Menunggu Teknisi',
      teknisiPenanggung: null,
      waktuMulai: null,
      waktuSelesai: null,
      tindakanTeknisi: '',
      rekomendasiTeknisi: ''
    };

    onSubmitTicket(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-slate-800" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Tiket Panggilan Bantuan Maintenance</h3>
              <p className="text-[11px] text-slate-500">Kirim tiket perbaikan langsung ke antrean tim teknisi</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Unit: {machine?.nama}</span>
              <span className="bg-rose-100 text-rose-800 font-mono font-bold px-1.5 py-0.2 rounded text-[10px] border border-rose-200">
                {diagnosis?.tingkat} ({diagnosis?.percentage}%)
              </span>
            </div>
            <div className="text-slate-600">
              Kerusakan: <strong>{diagnosis?.namaKerusakan}</strong>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Gejala: {selectedGejala?.join(', ')}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Lokasi Lini / Stasiun:</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                required
                value={form.lokasi}
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Tingkat Urgensi Produksi:</label>
            <select
              value={form.urgensi}
              onChange={(e) => setForm({ ...form, urgensi: e.target.value })}
              className="w-full p-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900"
            >
              <option value="Normal">Normal (Masih dapat beroperasi parsial)</option>
              <option value="Urgent">Urgent (Menghambat siklus perakitan)</option>
              <option value="Emergency">Emergency (Line Stop / Kritis)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Deskripsi Kondisi Lapangan:</label>
            <textarea
              required
              rows={3}
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900"
              placeholder="Jelaskan kondisi fisik mesin, indikator lampu, atau suara abnormal..."
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Tiket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
