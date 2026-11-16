import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Search, 
  Sliders, 
  AlertCircle,
  FileCode,
  Tag,
  CheckCircle2
} from 'lucide-react';

export default function KnowledgeBaseView({ 
  gejalaList, 
  setGejalaList, 
  kerusakanList, 
  setKerusakanList, 
  rules, 
  setRules, 
  machines,
  currentUser 
}) {
  const [activeSubTab, setActiveSubTab] = useState('rules'); // 'rules' | 'gejala' | 'kerusakan'
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for adding items
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [showAddGejalaModal, setShowAddGejalaModal] = useState(false);
  const [showAddKerusakanModal, setShowAddKerusakanModal] = useState(false);

  const [newRuleForm, setNewRuleForm] = useState({
    namaRule: '',
    kodeGejala: 'G01',
    kodeKerusakan: 'K01',
    bobot: 1.0,
    kondisi: ''
  });

  const [newGejalaForm, setNewGejalaForm] = useState({
    kode: '',
    nama: '',
    mesinId: 'M01',
    kategori: 'Mekanikal'
  });

  const [newKerusakanForm, setNewKerusakanForm] = useState({
    kode: '',
    nama: '',
    tingkat: 'Sedang',
    solusi: '',
    penangananOleh: 'Teknisi'
  });

  // Handle Add Rule
  const handleAddRule = (e) => {
    e.preventDefault();
    const gObj = gejalaList.find(g => g.kode === newRuleForm.kodeGejala);
    const kObj = kerusakanList.find(k => k.kode === newRuleForm.kodeKerusakan);
    
    const newRule = {
      id: `R${(rules.length + 1).toString().padStart(2, '0')}`,
      namaRule: newRuleForm.namaRule || `Rule ${rules.length + 1}: ${kObj?.nama}`,
      kodeGejala: newRuleForm.kodeGejala,
      kodeKerusakan: newRuleForm.kodeKerusakan,
      bobot: parseFloat(newRuleForm.bobot) || 1.0,
      kondisi: `IF ${gObj?.nama || newRuleForm.kodeGejala} THEN ${kObj?.nama || newRuleForm.kodeKerusakan}`
    };

    setRules([...rules, newRule]);
    setShowAddRuleModal(false);
    setNewRuleForm({
      namaRule: '',
      kodeGejala: 'G01',
      kodeKerusakan: 'K01',
      bobot: 1.0,
      kondisi: ''
    });
  };

  // Handle Delete Rule
  const handleDeleteRule = (id) => {
    if (window.confirm('Hapus aturan ini dari basis pengetahuan Forward Chaining?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  // Handle Add Gejala
  const handleAddGejala = (e) => {
    e.preventDefault();
    const mObj = machines.find(m => m.id === newGejalaForm.mesinId);
    const newGejala = {
      id: (gejalaList.length + 1).toString(),
      kode: newGejalaForm.kode.toUpperCase(),
      nama: newGejalaForm.nama,
      mesinId: newGejalaForm.mesinId,
      mesinNama: mObj?.nama || 'Mesin Pabrik',
      kategori: newGejalaForm.kategori
    };

    setGejalaList([...gejalaList, newGejala]);
    setShowAddGejalaModal(false);
    setNewGejalaForm({ kode: '', nama: '', mesinId: 'M01', kategori: 'Mekanikal' });
  };

  // Handle Delete Gejala
  const handleDeleteGejala = (kode) => {
    if (window.confirm(`Hapus gejala ${kode}?`)) {
      setGejalaList(gejalaList.filter(g => g.kode !== kode));
      setRules(rules.filter(r => r.kodeGejala !== kode));
    }
  };

  // Handle Add Kerusakan
  const handleAddKerusakan = (e) => {
    e.preventDefault();
    const newK = {
      id: (kerusakanList.length + 1).toString(),
      kode: newKerusakanForm.kode.toUpperCase(),
      nama: newKerusakanForm.nama,
      tingkat: newKerusakanForm.tingkat,
      solusi: newKerusakanForm.solusi,
      penangananOleh: newKerusakanForm.penangananOleh,
      tindakanOperator: 'Lakukan pengecekan awal sesuai petunjuk manual.',
      rekomendasiTeknisi: 'Lakukan kalibrasi dan pengujian mendalam.'
    };

    setKerusakanList([...kerusakanList, newK]);
    setShowAddKerusakanModal(false);
    setNewKerusakanForm({ kode: '', nama: '', tingkat: 'Sedang', solusi: '', penangananOleh: 'Teknisi' });
  };

  // Handle Delete Kerusakan
  const handleDeleteKerusakan = (kode) => {
    if (window.confirm(`Hapus data kerusakan ${kode}?`)) {
      setKerusakanList(kerusakanList.filter(k => k.kode !== kode));
      setRules(rules.filter(r => r.kodeKerusakan !== kode));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Basis Pengetahuan */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Basis Pengetahuan (Knowledge Base 3NF)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pengelolaan kamus gejala, kerusakan, dan basis aturan (rules) penalaran Forward Chaining sistem troubleshooting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSubTab === 'rules' && (
              <button
                onClick={() => setShowAddRuleModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Aturan (Rule)
              </button>
            )}
            {activeSubTab === 'gejala' && (
              <button
                onClick={() => setShowAddGejalaModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Gejala
              </button>
            )}
            {activeSubTab === 'kerusakan' && (
              <button
                onClick={() => setShowAddKerusakanModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Kerusakan
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 mt-3.5">
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubTab === 'rules'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Aturan Forward Chaining ({rules.length})
          </button>
          <button
            onClick={() => setActiveSubTab('gejala')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubTab === 'gejala'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Tabel Gejala ({gejalaList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('kerusakan')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeSubTab === 'kerusakan'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Tabel Kerusakan & Solusi ({kerusakanList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: RULES FORWARD CHAINING */}
      {activeSubTab === 'rules' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">Basis Aturan Inferensi (IF-THEN Rules)</h3>
              <p className="text-xs text-slate-500">Mencocokkan premis gejala (IF) menjadi konklusi kerusakan mesin (THEN).</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari rule atau kondisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">ID Rule</th>
                  <th className="py-2.5 px-3">Premis Gejala (IF)</th>
                  <th className="py-2.5 px-3">Konklusi Kerusakan (THEN)</th>
                  <th className="py-2.5 px-3">Formulasi Aturan</th>
                  <th className="py-2.5 px-3 text-center">Bobot</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rules
                  .filter(r => r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.kondisi.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((rule) => {
                    const g = gejalaList.find(x => x.kode === rule.kodeGejala);
                    const k = kerusakanList.find(x => x.kode === rule.kodeKerusakan);
                    return (
                      <tr key={rule.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{rule.id}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {rule.kodeGejala}
                          </span>
                          <span className="ml-1.5 text-slate-800 font-medium">{g?.nama}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {rule.kodeKerusakan}
                          </span>
                          <span className="ml-1.5 text-slate-800 font-medium">{k?.nama}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] max-w-xs truncate">
                          {rule.kondisi}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {rule.bobot}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                            title="Hapus Rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GEJALA */}
      {activeSubTab === 'gejala' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Tabel Gejala Kerusakan (Tabel 3NF Gejala)</h3>
              <p className="text-xs text-slate-500">Kamus gejala abnormal mesin pada lini produksi PT Vivo Mobile Indonesia.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Kode Gejala</th>
                  <th className="py-2.5 px-3">Nama Gejala Abnormal</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Mesin Terkait</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gejalaList.map((g) => (
                  <tr key={g.kode} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{g.kode}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{g.nama}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {g.kategori}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{g.mesinNama}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteGejala(g.kode)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KERUSAKAN */}
      {activeSubTab === 'kerusakan' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Tabel Kerusakan & Solusi (Tabel 3NF Kerusakan)</h3>
              <p className="text-xs text-slate-500">Klasifikasi jenis kerusakan mesin beserta solusi tindakan operator dan teknisi.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Nama Kerusakan</th>
                  <th className="py-2.5 px-3 text-center">Tingkat</th>
                  <th className="py-2.5 px-3">Wewenang</th>
                  <th className="py-2.5 px-3">Solusi & Tindakan Penanganan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {kerusakanList.map((k) => (
                  <tr key={k.kode} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-600">{k.kode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{k.nama}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        k.tingkat === 'Parah' ? 'bg-red-100 text-red-700' :
                        k.tingkat === 'Sedang' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {k.tingkat}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{k.penangananOleh}</td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-md">{k.solusi}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteKerusakan(k.kode)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Rule Baru */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="font-bold text-base text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Tambah Aturan (Rule) Forward Chaining Baru
            </h3>
            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama / Label Rule:</label>
                <input
                  type="text"
                  placeholder="Contoh: Rule 21: Kerusakan Kompresor Udara"
                  value={newRuleForm.namaRule}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, namaRule: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Premis Gejala (IF):</label>
                <select
                  value={newRuleForm.kodeGejala}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, kodeGejala: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  {gejalaList.map(g => (
                    <option key={g.kode} value={g.kode}>
                      [{g.kode}] {g.nama} ({g.mesinNama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Konklusi Kerusakan (THEN):</label>
                <select
                  value={newRuleForm.kodeKerusakan}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, kodeKerusakan: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  {kerusakanList.map(k => (
                    <option key={k.kode} value={k.kode}>
                      [{k.kode}] {k.nama} ({k.tingkat})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bobot Rule (0.1 - 1.0):</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1.0"
                  value={newRuleForm.bobot}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, bobot: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Gejala Baru */}
      {showAddGejalaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="font-bold text-base text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Tambah Gejala Baru (Tabel Gejala 3NF)
            </h3>
            <form onSubmit={handleAddGejala} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Gejala:</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: G24"
                  value={newGejalaForm.kode}
                  onChange={(e) => setNewGejalaForm({ ...newGejalaForm, kode: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Gejala:</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Suhu motor servo berlebih saat idling"
                  value={newGejalaForm.nama}
                  onChange={(e) => setNewGejalaForm({ ...newGejalaForm, nama: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mesin Terkait:</label>
                <select
                  value={newGejalaForm.mesinId}
                  onChange={(e) => setNewGejalaForm({ ...newGejalaForm, mesinId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori:</label>
                <select
                  value={newGejalaForm.kategori}
                  onChange={(e) => setNewGejalaForm({ ...newGejalaForm, kategori: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Elektrikal">Elektrikal</option>
                  <option value="Mekanikal">Mekanikal</option>
                  <option value="Sensorik">Sensorik</option>
                  <option value="Pneumatik">Pneumatik</option>
                  <option value="Termal">Termal</option>
                  <option value="Sistem">Sistem</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGejalaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Gejala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Kerusakan Baru */}
      {showAddKerusakanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="font-bold text-base text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Tambah Kerusakan Baru (Tabel Kerusakan 3NF)
            </h3>
            <form onSubmit={handleAddKerusakan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Kerusakan:</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: K11"
                  value={newKerusakanForm.kode}
                  onChange={(e) => setNewKerusakanForm({ ...newKerusakanForm, kode: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kerusakan:</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Kerusakan Modul Servo Drive"
                  value={newKerusakanForm.nama}
                  onChange={(e) => setNewKerusakanForm({ ...newKerusakanForm, nama: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Kerusakan:</label>
                  <select
                    value={newKerusakanForm.tingkat}
                    onChange={(e) => setNewKerusakanForm({ ...newKerusakanForm, tingkat: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ringan">Ringan</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Parah">Parah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wewenang Penanganan:</label>
                  <select
                    value={newKerusakanForm.penangananOleh}
                    onChange={(e) => setNewKerusakanForm({ ...newKerusakanForm, penangananOleh: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operator">Operator Mandiri</option>
                    <option value="Teknisi">Teknisi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Solusi & Tindakan:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Langkah-langkah perbaikan kerusakan..."
                  value={newKerusakanForm.solusi}
                  onChange={(e) => setNewKerusakanForm({ ...newKerusakanForm, solusi: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddKerusakanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Kerusakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

