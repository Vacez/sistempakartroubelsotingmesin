import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MapPin, 
  Search,
  Check,
  X,
  Plus,
  Eye,
  FileText,
  ShieldCheck,
  Send,
  SlidersHorizontal
} from 'lucide-react';

export default function TiketPerbaikanView({ 
  tickets = [], 
  currentUser, 
  machines = [],
  onUpdateTicketStatus, 
  onFinishRepair,
  onCreateTicket,
  onPrintSpk
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketForRepair, setSelectedTicketForRepair] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form untuk teknisi menyelesaikan perbaikan
  const [repairForm, setRepairForm] = useState({
    tindakanTeknisi: '',
    rekomendasiTeknisi: '',
    sparePart: ''
  });

  // Form untuk operator membuat tiket antrean baru
  const [createTicketForm, setCreateTicketForm] = useState({
    mesinId: machines[0]?.id || 'M01',
    kerusakan: '',
    tingkat: 'Parah',
    urgensi: 'Urgent',
    catatan: ''
  });

  // Identifikasi peran 3 aktor
  const isOperator = currentUser?.role === 'Operator';
  const isTeknisi = currentUser?.role === 'Teknisi';
  const isSupervisor = currentUser?.role === 'Supervisor';

  const totalTickets = tickets.length;
  const pendingCount = tickets.filter(t => t.status === 'Menunggu Teknisi').length;
  const inProgressCount = tickets.filter(t => t.status === 'Sedang Ditangani').length;
  const completedCount = tickets.filter(t => t.status === 'Selesai').length;

  const filteredTickets = tickets.filter(ticket => {
    const matchStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ticket.namaMesin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ticket.kerusakan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (ticket.catatanOperator && ticket.catatanOperator.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (ticket.teknisiPenanggung && ticket.teknisiPenanggung.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  // Teknisi: Ambil tiket
  const handleTakeTicket = (ticketId) => {
    if (onUpdateTicketStatus) {
      onUpdateTicketStatus(ticketId, 'Sedang Ditangani', currentUser?.nama || 'Teknisi');
    }
  };

  // Teknisi: Buka modal selesai
  const handleOpenFinishModal = (ticket) => {
    setSelectedTicketForRepair(ticket);
    setRepairForm({
      tindakanTeknisi: ticket.tindakanTeknisi || 'Pemeriksaan mekanikal & kelistrikan selesai sesuai standar pemeliharaan pabrik.',
      rekomendasiTeknisi: ticket.rekomendasiTeknisi || 'Kalibrasi parameter normal. Unit mesin siap beroperasi kembali di lini produksi.',
      sparePart: ''
    });
  };

  // Teknisi: Submit konfirmasi selesai
  const handleSubmitFinishRepair = (e) => {
    e.preventDefault();
    if (!selectedTicketForRepair) return;

    if (onFinishRepair) {
      onFinishRepair(selectedTicketForRepair.id, {
        tindakanTeknisi: repairForm.tindakanTeknisi + (repairForm.sparePart ? ` (Penggantian spare part: ${repairForm.sparePart})` : ''),
        rekomendasiTeknisi: repairForm.rekomendasiTeknisi,
        waktuSelesai: new Date().toLocaleString('id-ID'),
        teknisiPenanggung: currentUser?.nama || 'Teknisi Rian'
      });
    }

    setSelectedTicketForRepair(null);
  };

  // Operator: Submit tiket antrean baru
  const handleCreateNewTicket = (e) => {
    e.preventDefault();
    if (!onCreateTicket) return;

    const targetMachine = machines.find(m => m.id === createTicketForm.mesinId) || machines[0];

    const newTicket = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      idDiagnosa: `MANUAL-${Date.now().toString().slice(-4)}`,
      idOperator: currentUser?.id || 'U01',
      namaOperator: currentUser?.nama || 'Operator Lini',
      idMesin: targetMachine.id,
      namaMesin: targetMachine.nama,
      lokasi: targetMachine.lokasi,
      kerusakan: createTicketForm.kerusakan.trim() || 'Gangguan Operasional Lini Perakitan',
      tingkat: createTicketForm.tingkat,
      persentase: 100,
      catatanOperator: createTicketForm.catatan.trim() || `Panggilan perbaikan mendesak dari stasiun ${targetMachine.lokasi}.`,
      urgensi: createTicketForm.urgensi,
      waktuPanggilan: new Date().toLocaleString('id-ID'),
      status: 'Menunggu Teknisi',
      teknisiPenanggung: null,
      waktuMulai: null,
      waktuSelesai: null,
      tindakanTeknisi: '',
      rekomendasiTeknisi: ''
    };

    onCreateTicket(newTicket);
    setIsCreateModalOpen(false);
    setCreateTicketForm({
      mesinId: machines[0]?.id || 'M01',
      kerusakan: '',
      tingkat: 'Parah',
      urgensi: 'Urgent',
      catatan: ''
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. ROLE AUTHORITY BANNER (PEMBEDA HAK AKSES 3 AKTOR) */}
      {isOperator && (
        <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-blue-950 flex items-center gap-2">
                <span>Peran: Operator Lini</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold border border-blue-200">
                  Wewenang: Membuat Antrean
                </span>
              </div>
              <p className="text-blue-800 text-[11px] mt-0.5">
                Anda berwenang membuat antrean tiket panggilan teknisi saat terjadi kendala mesin di lini produksi. Penanganan akan diproses oleh tim Teknisi.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Antrean Tiket Baru</span>
          </button>
        </div>
      )}

      {isTeknisi && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-amber-950 flex items-center gap-2">
              <span>Peran: Teknisi Maintenance</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-semibold border border-amber-200">
                Wewenang: Memproses Antrean
              </span>
            </div>
            <p className="text-amber-800 text-[11px] mt-0.5">
              Anda berwenang mengambil tiket dari antrean (<strong>Ambil Penanganan</strong>) dan mendokumentasikan hasil perbaikan serta penggantian spare part (<strong>Konfirmasi Selesai</strong>).
            </p>
          </div>
        </div>
      )}

      {isSupervisor && (
        <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-4 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-purple-950 flex items-center gap-2">
              <span>Peran: Supervisor Maintenance</span>
              <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-mono font-semibold border border-purple-200">
                Wewenang: Hanya Dapat Melihat (Read-Only)
              </span>
            </div>
            <p className="text-purple-800 text-[11px] mt-0.5">
              Mode pengawasan produksi aktif. Anda memantau seluruh antrean perbaikan, durasi penanganan teknisi, dan rekapitulasi performa lini tanpa izin memodifikasi data tiket.
            </p>
          </div>
        </div>
      )}

      {/* 2. Header & Metrics Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Antrean Permintaan Perbaikan Mesin Pabrik
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              PT Vivo Mobile Indonesia • Sistem Monitoring & Disposisi Tiket Pemeliharaan
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
            <span>Personel Aktif:</span>
            <span className="text-slate-900 font-semibold font-sans">{currentUser?.nama}</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
              {currentUser?.role}
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Tiket</div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">{totalTickets}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Semua riwayat perbaikan</div>
          </div>

          <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50">
            <div className="text-[11px] font-semibold text-rose-800 uppercase flex items-center justify-between">
              <span>Menunggu Teknisi</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </div>
            <div className="text-2xl font-mono font-bold text-rose-900 mt-1 tabular-nums">{pendingCount}</div>
            <div className="text-[10px] text-rose-700 mt-0.5">Memerlukan penanganan</div>
          </div>

          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50">
            <div className="text-[11px] font-semibold text-blue-800 uppercase">Sedang Ditangani</div>
            <div className="text-2xl font-mono font-bold text-blue-900 mt-1 tabular-nums">{inProgressCount}</div>
            <div className="text-[10px] text-blue-700 mt-0.5">Proses perbaikan aktif</div>
          </div>

          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase">Selesai</div>
            <div className="text-2xl font-mono font-bold text-emerald-900 mt-1 tabular-nums">{completedCount}</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Mesin beroperasi normal</div>
          </div>
        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari ID tiket, mesin, kerusakan, atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'Menunggu Teknisi', label: 'Menunggu' },
            { id: 'Sedang Ditangani', label: 'Dalam Pengerjaan' },
            { id: 'Selesai', label: 'Selesai' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            Tidak ada tiket perbaikan yang sesuai dengan kriteria filter saat ini.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isPending = ticket.status === 'Menunggu Teknisi';
            const isInProgress = ticket.status === 'Sedang Ditangani';
            const isFinished = ticket.status === 'Selesai';

            return (
              <div 
                key={ticket.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {ticket.id}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">{ticket.namaMesin}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-slate-400" /> {ticket.lokasi}
                        </span>
                        <span>•</span>
                        <span>Pelapor: <strong className="text-slate-700">{ticket.namaOperator}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{ticket.waktuPanggilan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ticket.urgensi && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        ticket.urgensi === 'Emergency' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        ticket.urgensi === 'Urgent' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {ticket.urgensi}
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                      isPending ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      isInProgress ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                  <div className="md:col-span-8 space-y-2">
                    <div>
                      <span className="text-slate-500">Hasil Diagnosa Kerusakan:</span>{' '}
                      <strong className="text-slate-900">{ticket.kerusakan}</strong>{' '}
                      <span className="font-mono text-[10px] text-slate-500">({ticket.tingkat} • {ticket.persentase}%)</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 text-[11px]">
                      <span className="font-semibold text-slate-800">Catatan Pelapor / Operator:</span>{' '}
                      {ticket.catatanOperator || 'Gangguan operasional pada lini perakitan.'}
                    </div>

                    {ticket.tindakanTeknisi && (
                      <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200 text-[11px] space-y-1">
                        <div>
                          <strong className="text-emerald-900">Tindakan Maintenance Teknisi:</strong>{' '}
                          <span className="text-slate-800">{ticket.tindakanTeknisi}</span>
                        </div>
                        {ticket.rekomendasiTeknisi && (
                          <div className="text-slate-600">
                            <strong>Rekomendasi Teknisi:</strong> {ticket.rekomendasiTeknisi}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono">
                          Teknisi Penanggung: <strong className="text-slate-800">{ticket.teknisiPenanggung}</strong> • Selesai: {ticket.waktuSelesai}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION COLUMN BERDASARKAN ROLE 3 AKTOR */}
                  <div className="md:col-span-4 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-3 pt-2 md:pt-0">
                    {/* AKTOR 1: TEKNISI (MEMPROSES ANTREAN) */}
                    {isTeknisi && (
                      <>
                        {isPending && (
                          <button
                            onClick={() => handleTakeTicket(ticket.id)}
                            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.98]"
                          >
                            <Wrench className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ambil Penanganan</span>
                          </button>
                        )}

                        {isInProgress && (
                          <button
                            onClick={() => handleOpenFinishModal(ticket)}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.98]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Input Solusi & Selesaikan</span>
                          </button>
                        )}

                        {isFinished && (
                          <div className="text-center py-1 text-emerald-700 font-medium text-xs flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Telah Selesai Ditangani</span>
                          </div>
                        )}

                        <button
                          onClick={() => onPrintSpk && onPrintSpk(ticket)}
                          className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Lihat SPK</span>
                        </button>
                      </>
                    )}

                    {/* AKTOR 2: OPERATOR (MEMBUAT ANTREAN) */}
                    {isOperator && (
                      <>
                        {isPending && (
                          <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-center text-xs space-y-0.5">
                            <div className="font-semibold text-rose-800 flex items-center justify-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                              <span>Menunggu Teknisi</span>
                            </div>
                            <p className="text-[10px] text-rose-600">Tiket Anda berada di antrean panggilan</p>
                          </div>
                        )}

                        {isInProgress && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center text-xs space-y-0.5">
                            <div className="font-semibold text-blue-800 flex items-center justify-center gap-1">
                              <Wrench className="w-3.5 h-3.5 text-blue-600" />
                              <span>Sedang Ditangani</span>
                            </div>
                            <p className="text-[10px] text-blue-600">
                              Oleh: {ticket.teknisiPenanggung || 'Teknisi Maintenance'}
                            </p>
                          </div>
                        )}

                        {isFinished && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center text-xs space-y-0.5">
                            <div className="font-semibold text-emerald-800 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Perbaikan Selesai</span>
                            </div>
                            <p className="text-[10px] text-emerald-600">Mesin siap beroperasi kembali</p>
                          </div>
                        )}

                        <button
                          onClick={() => onPrintSpk && onPrintSpk(ticket)}
                          className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Cetak / Lihat SPK</span>
                        </button>
                      </>
                    )}

                    {/* AKTOR 3: SUPERVISOR (HANYA DAPAT MELIHAT) */}
                    {isSupervisor && (
                      <>
                        <div className={`p-2 rounded-lg border text-center text-xs ${
                          isPending ? 'bg-rose-50 border-rose-200 text-rose-800' :
                          isInProgress ? 'bg-blue-50 border-blue-200 text-blue-800' :
                          'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}>
                          <div className="font-semibold flex items-center justify-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{ticket.status}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {isPending ? 'Menunggu penugasan teknisi' : isInProgress ? `Teknisi: ${ticket.teknisiPenanggung}` : `Selesai: ${ticket.waktuSelesai || '-'}`}
                          </div>
                        </div>

                        <button
                          onClick={() => onPrintSpk && onPrintSpk(ticket)}
                          className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Lihat Detail SPK</span>
                        </button>

                        <span className="text-[9px] text-slate-400 text-center font-mono uppercase tracking-wider">
                          Mode Pengawasan (Hanya Lihat)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. MODAL TEKNISI: INPUT HASIL PERBAIKAN & KONFIRMASI SELESAI */}
      {selectedTicketForRepair && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-sm text-slate-900">Laporan Hasil Perbaikan Teknisi</h3>
              </div>
              <button
                onClick={() => setSelectedTicketForRepair(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFinishRepair} className="mt-4 space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg text-slate-700 space-y-0.5 border border-slate-200">
                <div>Tiket: <strong className="font-mono text-slate-900">{selectedTicketForRepair.id}</strong></div>
                <div>Mesin: <strong>{selectedTicketForRepair.namaMesin}</strong></div>
                <div>Kerusakan: <strong>{selectedTicketForRepair.kerusakan}</strong></div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tindakan Perbaikan yang Dilakukan:
                </label>
                <textarea
                  required
                  rows={3}
                  value={repairForm.tindakanTeknisi}
                  onChange={(e) => setRepairForm({ ...repairForm, tindakanTeknisi: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="Deskripsikan tindakan perbaikan mekanik/elektrik..."
                ></textarea>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Spare Part yang Diganti (Opsional):
                </label>
                <input
                  type="text"
                  value={repairForm.sparePart}
                  onChange={(e) => setRepairForm({ ...repairForm, sparePart: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="Contoh: Kabel power 3-phase, silinder pneumatik 6mm..."
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Rekomendasi Lanjutan untuk Operator:
                </label>
                <textarea
                  rows={2}
                  value={repairForm.rekomendasiTeknisi}
                  onChange={(e) => setRepairForm({ ...repairForm, rekomendasiTeknisi: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="Contoh: Bersihkan sisa pelumas tiap akhir shift..."
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicketForRepair(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition"
                >
                  Simpan & Selesaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL OPERATOR: BUAT ANTREAN PERBAIKAN BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Buat Antrean Tiket Perbaikan Baru</h3>
                  <p className="text-[11px] text-slate-500">Kirim tiket perbaikan langsung ke antrean tim teknisi</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTicket} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pilih Unit Mesin Bermasalah:
                </label>
                <select
                  value={createTicketForm.mesinId}
                  onChange={(e) => setCreateTicketForm({ ...createTicketForm, mesinId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.lokasi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Ringkasan Kerusakan / Gejala:
                </label>
                <input
                  type="text"
                  required
                  value={createTicketForm.kerusakan}
                  onChange={(e) => setCreateTicketForm({ ...createTicketForm, kerusakan: e.target.value })}
                  placeholder="Contoh: Feeder Baut Macet / Motor Overheat"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Tingkat Keparahan:
                  </label>
                  <select
                    value={createTicketForm.tingkat}
                    onChange={(e) => setCreateTicketForm({ ...createTicketForm, tingkat: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Parah">Parah (Mesin Berhenti)</option>
                    <option value="Sedang">Sedang (Output Terganggu)</option>
                    <option value="Ringan">Ringan (Peringatan)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Urgensi Lini:
                  </label>
                  <select
                    value={createTicketForm.urgensi}
                    onChange={(e) => setCreateTicketForm({ ...createTicketForm, urgensi: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Urgent">Urgent (Prioritas)</option>
                    <option value="Emergency">Emergency (Lini Stop)</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Catatan Detail Masalah untuk Teknisi:
                </label>
                <textarea
                  rows={3}
                  value={createTicketForm.catatan}
                  onChange={(e) => setCreateTicketForm({ ...createTicketForm, catatan: e.target.value })}
                  placeholder="Jelaskan kondisi lampu indikator, suara, getaran, atau kode error pada mesin..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke Antrean Teknisi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
