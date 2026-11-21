import React, { useState, useMemo, useRef } from 'react';
import { 
  Activity, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Printer, 
  RefreshCw, 
  Info,
  Send,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Check,
  Eye
} from 'lucide-react';
import { runForwardChaining } from '../utils/forwardChaining';

export const FIELD_TEST_CASES = [
  {
    nama: 'Kasus 1: Power Supply Mati Total',
    mesinId: 'M01',
    gejalaKodes: ['G01', 'G02'],
    keterangan: 'Mesin mati & lampu indikator padam'
  },
  {
    nama: 'Kasus 2: Motor Conveyor Macet & Panas',
    mesinId: 'M02',
    gejalaKodes: ['G03', 'G04'],
    keterangan: 'Conveyor jammed & motor overheat'
  },
  {
    nama: 'Kasus 3: Press 3 in 1 Sensor Error',
    mesinId: 'M03',
    gejalaKodes: ['G05', 'G06'],
    keterangan: 'Sensor gagal membaca & alarm aktif'
  },
  {
    nama: 'Kasus 4: Kebocoran Pneumatik AirTightness',
    mesinId: 'M04',
    gejalaKodes: ['G07', 'G08'],
    keterangan: 'Tekanan fluktuatif & suara desisan kasar'
  },
  {
    nama: 'Kasus 5: Overheating Modul Mesin ASM',
    mesinId: 'M01',
    gejalaKodes: ['G09', 'G10'],
    keterangan: 'Mesin berhenti mendadak & modul panas'
  },
  {
    nama: 'Kasus 6: Feeder Baut Macet & Silicone Miring',
    mesinId: 'M01',
    gejalaKodes: ['G11', 'G12'],
    keterangan: 'Jalur luncur baut terhambat (Penanganan Mandiri)'
  },
  {
    nama: 'Kasus 7: Nozzle Dispenser Lem Meluber (AGM)',
    mesinId: 'M02',
    gejalaKodes: ['G14'],
    keterangan: 'Dispensasi offset ke sisi smartphone'
  },
  {
    nama: 'Kasus 8: Sensor Barcode Baterai Coldpress Error',
    mesinId: 'M05',
    gejalaKodes: ['G18', 'G19', 'G20'],
    keterangan: 'Kamera gagal scan & silinder tertahan'
  }
];

export default function DiagnosaView({ 
  machines, 
  gejalaList, 
  kerusakanList, 
  rules, 
  currentUser, 
  onSaveDiagnosa, 
  onOpenCallTechnicianModal,
  onPrintSpk,
  diagnosaHistory = []
}) {
  const [selectedMachineId, setSelectedMachineId] = useState('M01');
  const [selectedGejala, setSelectedGejala] = useState(['G01', 'G02']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const resultRef = useRef(null);

  const selectedMachine = useMemo(() => {
    return machines.find(m => m.id === selectedMachineId) || machines[0];
  }, [machines, selectedMachineId]);

  const filteredGejala = useMemo(() => {
    return gejalaList.filter(g => {
      const matchMachine = selectedMachineId ? (g.mesinId === selectedMachineId || !g.mesinId) : true;
      const matchSearch = g.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.kode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'ALL' || g.kategori === filterCategory;
      return matchMachine && matchSearch && matchCategory;
    });
  }, [gejalaList, selectedMachineId, searchQuery, filterCategory]);

  const categories = useMemo(() => {
    const set = new Set(gejalaList.map(g => g.kategori).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [gejalaList]);

  const handleToggleGejala = (kode) => {
    if (selectedGejala.includes(kode)) {
      setSelectedGejala(selectedGejala.filter(k => k !== kode));
    } else {
      setSelectedGejala([...selectedGejala, kode]);
    }
  };

  const handleSelectAllVisible = () => {
    const visibleCodes = filteredGejala.map(g => g.kode);
    const combined = Array.from(new Set([...selectedGejala, ...visibleCodes]));
    setSelectedGejala(combined);
  };

  const handleClearSelections = () => {
    setSelectedGejala([]);
    setDiagnosisResult(null);
  };

  const handleApplyFieldCase = (c) => {
    setSelectedMachineId(c.mesinId);
    setSelectedGejala(c.gejalaKodes);
    setDiagnosisResult(null);
  };

  const handleRunDiagnosa = () => {
    if (selectedGejala.length === 0) {
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      try {
        const result = runForwardChaining({
          selectedGejalaIds: selectedGejala,
          rules,
          kerusakanList,
          selectedMachineId
        });

        setDiagnosisResult(result);
        setIsProcessing(false);

        // Auto-scroll ke blok hasil diagnosa agar pengguna langsung melihat kesimpulan
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);

        if (result.success && result.topDiagnosis) {
          const newRecord = {
            id: `DIAG-${Date.now().toString().slice(-4)}`,
            idUser: currentUser?.id || 'U01',
            namaUser: currentUser?.nama || 'Operator',
            idMesin: selectedMachine?.id || selectedMachineId || 'M01',
            namaMesin: selectedMachine?.nama || 'Mesin Produksi',
            gejalaTerpilih: selectedGejala,
            idKerusakan: result.topDiagnosis.kodeKerusakan,
            namaKerusakan: result.topDiagnosis.namaKerusakan,
            tingkat: result.topDiagnosis.tingkat,
            persentase: result.topDiagnosis.percentage,
            solusi: result.topDiagnosis.solusi,
            waktu: new Date().toLocaleString('id-ID'),
            statusPanggilan: result.topDiagnosis.butuhTeknisi ? 'Menunggu Teknisi' : 'Mandiri Selesai',
            catatanOperator: `Diagnosa Forward Chaining (${result.topDiagnosis.matchedSymptoms.length} gejala terkonfirmasi)`
          };

          if (onSaveDiagnosa) {
            onSaveDiagnosa(newRecord);
          }
        }
      } catch (err) {
        console.error('Error saat evaluasi Forward Chaining:', err);
        setIsProcessing(false);
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Troubleshooting Mesin Produksi
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Pemeriksaan gejala operasional mesin dan penalaran berbasis aturan Forward Chaining (IF–THEN) 
              untuk menentukan solusi awal operator atau penanganan lanjutan oleh teknisi maintenance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs">
            <span className="text-slate-500">Unit Mesin Terpilih:</span>
            <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
              {selectedMachine.kode}
            </span>
          </div>
        </div>

        {/* SOP Field Presets Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            Matriks Uji Cepat Kasus Lapangan:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FIELD_TEST_CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => handleApplyFieldCase(c)}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition text-left"
              >
                <span className="font-medium">{c.nama.split(':')[0]}</span>
                <span className="text-slate-400 font-mono ml-1">({c.mesinId})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri: Pemilihan Mesin (4 Kolom) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Pilih Unit Mesin
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">5 Mesin Aktif</span>
            </div>

            <div className="space-y-2">
              {machines.map((mesin) => {
                const isSelected = selectedMachineId === mesin.id;
                return (
                  <div
                    key={mesin.id}
                    onClick={() => {
                      setSelectedMachineId(mesin.id);
                      setDiagnosisResult(null);
                      // Otomatis sinkronkan gejala awal untuk mesin ini
                      const machineGejalas = gejalaList.filter(g => g.mesinId === mesin.id);
                      if (machineGejalas.length > 0) {
                        setSelectedGejala([machineGejalas[0].kode]);
                      } else {
                        setSelectedGejala([]);
                      }
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition text-left border ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/70 shadow-sm ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {mesin.kode}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {mesin.status}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-slate-900 mt-1.5">
                      {mesin.nama}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {mesin.fungsi}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-2 font-mono">
                      Lokasi: {mesin.lokasi}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedMachine && (
              <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 text-[11px] mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  Karakteristik Operasional:
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedMachine.deskripsi}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Checklist Gejala (8 Kolom) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 mb-3">
              <div>
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Konfirmasi Gejala Kerusakan
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Centang gejala atau indikasi abnormal yang dialami mesin saat ini.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAllVisible}
                  className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Pilih Semua
                </button>
                <button
                  onClick={handleClearSelections}
                  className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari kode (G01) atau kata kunci gejala..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-[11px] px-2 py-1 rounded font-medium whitespace-nowrap transition ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Semua Sub-Sistem' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms List */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {filteredGejala.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Tidak ada gejala yang cocok dengan filter pencarian.
                </div>
              ) : (
                filteredGejala.map((g) => {
                  const isChecked = selectedGejala.includes(g.kode);
                  return (
                    <label
                      key={g.kode}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                        isChecked
                          ? 'border-slate-900 bg-slate-50/80'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleGejala(g.kode)}
                        className="mt-0.5 h-3.5 w-3.5 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-[11px]">
                            [{g.kode}]
                          </span>
                          <span className={`font-medium ${isChecked ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                            {g.nama}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Sub-sistem: {g.kategori} • Unit: {g.mesinNama}
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {selectedGejala.length === 0 ? (
                  <span className="text-amber-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Pilih minimal 1 gejala di atas untuk mendiagnosa
                  </span>
                ) : (
                  <>
                    Terpilih: <strong className="font-mono text-slate-900">{selectedGejala.length}</strong> gejala
                    <span className="text-slate-400 font-mono ml-1.5 text-[11px]">
                      ({selectedGejala.join(', ')})
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleRunDiagnosa}
                disabled={isProcessing || selectedGejala.length === 0}
                className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengevaluasi Rule...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>Jalankan Forward Chaining</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HASIL DIAGNOSA KELUARAN */}
      {diagnosisResult && (
        <div ref={resultRef} className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm space-y-5 animate-fadeIn scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hasil Inferensi Forward Chaining
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Kesimpulan Diagnosa Kerusakan
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReasoningModal(!showReasoningModal)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {showReasoningModal ? 'Tutup Log Aturan' : 'Lihat Rantai Aturan'}
              </button>

              <button
                onClick={() => onPrintSpk && onPrintSpk({
                  machine: selectedMachine,
                  diagnosis: diagnosisResult.topDiagnosis,
                  selectedGejala: selectedGejala,
                  currentUser
                })}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Lembar SPK
              </button>
            </div>
          </div>

          {diagnosisResult.success && diagnosisResult.topDiagnosis ? (
            <div className="space-y-4">
              {/* Primary Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                        {diagnosisResult.topDiagnosis.kodeKerusakan}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {diagnosisResult.topDiagnosis.namaKerusakan}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                      <span className="text-slate-500">Tingkat Kerusakan:</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        diagnosisResult.topDiagnosis.tingkat === 'Parah'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : diagnosisResult.topDiagnosis.tingkat === 'Sedang'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {diagnosisResult.topDiagnosis.tingkat}
                      </span>

                      <span className="text-slate-300">|</span>

                      <span className="text-slate-500">Wewenang:</span>
                      <span className="font-medium text-slate-800">
                        {diagnosisResult.topDiagnosis.penangananOleh}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-mono pt-1">
                      Gejala Cocok: {diagnosisResult.topDiagnosis.matchedSymptoms.join(', ')}{' '}
                      ({diagnosisResult.topDiagnosis.matchCount} dari {diagnosisResult.topDiagnosis.totalRequired} gejala rule)
                    </div>
                  </div>

                  {/* Calculation Box Formula Dokumen 2 */}
                  <div className="md:col-span-4 bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Tingkat Keyakinan / Kecocokan
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                      {diagnosisResult.topDiagnosis.percentage}%
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      ({diagnosisResult.topDiagnosis.matchCount} / {diagnosisResult.topDiagnosis.totalRequired}) × 100%
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          diagnosisResult.topDiagnosis.percentage >= 80 ? 'bg-rose-600' :
                          diagnosisResult.topDiagnosis.percentage >= 50 ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${diagnosisResult.topDiagnosis.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* SOP Actions Grid */}
                <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Tindakan Awal Operator (SOP Mandiri):
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {diagnosisResult.topDiagnosis.tindakanOperator || diagnosisResult.topDiagnosis.solusi}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      Rekomendasi Penanganan Maintenance:
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {diagnosisResult.topDiagnosis.rekomendasiTeknisi || diagnosisResult.topDiagnosis.solusi}
                    </p>
                  </div>
                </div>

                {/* Action to Call Technician if Parah or Needed */}
                {diagnosisResult.topDiagnosis.butuhTeknisi && (
                  <div className="mt-3.5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-rose-900">
                          Kategori {diagnosisResult.topDiagnosis.tingkat}: Memerlukan Penanganan Teknisi
                        </div>
                        <p className="text-[11px] text-rose-700">
                          Sesuai SOP pemeliharaan, tiket bantuan maintenance dikirimkan ke antrean tim teknisi.
                        </p>
                      </div>
                    </div>

                    {(currentUser?.role === 'Admin' || currentUser?.role === 'Supervisor') ? (
                      <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-medium text-xs flex items-center gap-1.5 whitespace-nowrap">
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                        <span>Mode Admin: Monitoring (Hanya Lihat)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onOpenCallTechnicianModal && onOpenCallTechnicianModal({
                          machine: selectedMachine,
                          diagnosis: diagnosisResult.topDiagnosis,
                          selectedGejala: selectedGejala
                        })}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {currentUser?.role === 'Operator' ? 'Panggil Teknisi (Buat Antrean)' : 'Kirim Tiket Penanganan'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Rantai Penalaran Trace Log */}
              {showReasoningModal && (
                <div className="p-4 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 pb-2 border-b border-slate-800">
                    LOG RANTAI PENALARAN FORWARD CHAINING
                  </div>
                  {diagnosisResult.reasoningSteps.map((step, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-blue-400 font-semibold">{step.step}. {step.title}</div>
                      <div className="text-slate-400 text-[11px] pl-3 border-l border-slate-800">{step.description}</div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <div>Aturan Aktif:</div>
                    {diagnosisResult.topDiagnosis.rulesTriggered.map((r, i) => (
                      <div key={i} className="text-slate-400 pl-2">• [{r.id}] {r.kondisi}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              Kombinasi gejala yang dipilih belum cocok dengan aturan kerusakan yang terdaftar.
            </div>
          )}
        </div>
      )}

      {/* Riwayat Diagnosa Terkini */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Log Riwayat Diagnosa Terkini
            </h3>
            <p className="text-[11px] text-slate-500">Rekapitulasi diagnosa mesin oleh personel lini produksi</p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {diagnosaHistory.length} Record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2 px-2.5 font-mono">ID</th>
                <th className="py-2 px-2.5">Mesin</th>
                <th className="py-2 px-2.5">Gejala</th>
                <th className="py-2 px-2.5">Kerusakan</th>
                <th className="py-2 px-2.5 text-center">Tingkat</th>
                <th className="py-2 px-2.5 text-center font-mono">%</th>
                <th className="py-2 px-2.5">Status</th>
                <th className="py-2 px-2.5">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {diagnosaHistory.slice(0, 6).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-2 px-2.5 font-mono font-medium text-slate-900">{item.id}</td>
                  <td className="py-2 px-2.5 font-medium">{item.namaMesin}</td>
                  <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500">
                    {Array.isArray(item.gejalaTerpilih) ? item.gejalaTerpilih.join(', ') : item.gejalaTerpilih}
                  </td>
                  <td className="py-2 px-2.5 font-semibold text-slate-900">{item.namaKerusakan}</td>
                  <td className="py-2 px-2.5 text-center">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                      item.tingkat === 'Parah' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      item.tingkat === 'Sedang' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {item.tingkat}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-slate-900 tabular-nums">{item.persentase}%</td>
                  <td className="py-2 px-2.5 text-[11px]">
                    <span className={`px-1.5 py-0.2 rounded font-medium ${
                      item.statusPanggilan === 'Selesai' ? 'bg-emerald-50 text-emerald-700' :
                      item.statusPanggilan === 'Sedang Ditangani' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.statusPanggilan}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-slate-400 font-mono text-[10px]">{item.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
