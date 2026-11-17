import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Wrench, 
  User, 
  Trash2, 
  Key, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  LogIn, 
  Briefcase,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function UserManagementView({ 
  users = [], 
  currentUser, 
  machines = [],
  onAddUser, 
  onDeleteUser,
  onSwitchUser 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Form State untuk Tambah Operator Baru
  const [formData, setFormData] = useState({
    nama: '',
    nip: `EMP-VVO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    role: 'Operator',
    username: '',
    password: '',
    jabatan: 'Operator Lini Assembly (ASM)',
    shift: 'Shift 1 (Pagi)'
  });
  const [formError, setFormError] = useState('');

  // Hitung Metrik Personel
  const totalUsers = users.length;
  const operatorCount = users.filter(u => u.role === 'Operator').length;
  const teknisiCount = users.filter(u => u.role === 'Teknisi').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  // Filter Data
  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch = u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const toggleShowPassword = (userId) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleOpenAddModal = () => {
    setFormData({
      nama: '',
      nip: `EMP-VVO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      role: 'Operator',
      username: '',
      password: '',
      jabatan: 'Operator Lini Assembly (ASM)',
      shift: 'Shift 1 (Pagi)'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.nama.trim() || !formData.username.trim() || !formData.password.trim()) {
      setFormError('Nama, username, dan kata sandi wajib diisi.');
      return;
    }

    // Cek duplikasi username
    const isDuplicate = users.some(
      u => u.username.toLowerCase() === formData.username.trim().toLowerCase()
    );
    if (isDuplicate) {
      setFormError(`Username "${formData.username.trim()}" sudah digunakan. Gunakan username lain.`);
      return;
    }

    // Buat inisial 2 huruf dari nama
    const avatarInitials = formData.nama
      .trim()
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newUser = {
      id: `U${Date.now().toString().slice(-3)}`,
      username: formData.username.trim(),
      password: formData.password.trim(),
      role: formData.role,
      nama: formData.nama.trim(),
      jabatan: formData.jabatan,
      avatar: avatarInitials || 'OP',
      nip: formData.nip.trim(),
      shift: formData.shift
    };

    if (onAddUser) {
      onAddUser(newUser);
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (user) => {
    if (user.id === currentUser?.id) {
      alert('Anda tidak dapat menghapus akun administrator yang sedang aktif digunakan.');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus data personel "${user.nama}" (${user.username})?`)) {
      if (onDeleteUser) {
        onDeleteUser(user.id);
      }
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Admin Control Banner */}
      <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-purple-950 flex items-center gap-2">
              <span>Panel Manajemen Operator & Personel Pabrik</span>
              <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-mono font-semibold border border-purple-200">
                Akses Administrator
              </span>
            </div>
            <p className="text-purple-800 text-[11px] mt-0.5">
              Sebagai Administrator, Anda dapat mendaftarkan operator baru, mengelola hak akses, dan mengatur penugasan stasiun mesin manufaktur PT Vivo Mobile Indonesia.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Operator Baru</span>
        </button>
      </div>

      {/* 2. Header & KPI Metrics Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Direktori Personel & Hak Akses Lini Produksi
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Database akun resmi operator lini, teknisi maintenance, dan administrator sistem.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Admin Aktif: <strong className="text-slate-900 font-sans">{currentUser?.nama}</strong> ({currentUser?.nip})
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Personel</div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">{totalUsers}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Semua akun terdaftar</div>
          </div>

          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50">
            <div className="text-[11px] font-semibold text-blue-800 uppercase flex items-center justify-between">
              <span>Operator Lini</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <div className="text-2xl font-mono font-bold text-blue-900 mt-1 tabular-nums">{operatorCount}</div>
            <div className="text-[10px] text-blue-700 mt-0.5">Pembuat antrean perbaikan</div>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
            <div className="text-[11px] font-semibold text-amber-800 uppercase flex items-center justify-between">
              <span>Teknisi Maintenance</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="text-2xl font-mono font-bold text-amber-900 mt-1 tabular-nums">{teknisiCount}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">Pemroses antrean perbaikan</div>
          </div>

          <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/50">
            <div className="text-[11px] font-semibold text-purple-800 uppercase flex items-center justify-between">
              <span>Administrator</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
            <div className="text-2xl font-mono font-bold text-purple-900 mt-1 tabular-nums">{adminCount}</div>
            <div className="text-[10px] text-purple-700 mt-0.5">Pengelola pengguna & audit</div>
          </div>
        </div>
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama, NIP, username, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Peran' },
            { id: 'Operator', label: 'Operator Lini' },
            { id: 'Teknisi', label: 'Teknisi' },
            { id: 'Admin', label: 'Admin' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterRole(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                filterRole === tab.id
                  ? 'bg-purple-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Personnel Directory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Personel</th>
                <th className="py-3 px-4">Kredensial Login</th>
                <th className="py-3 px-4">Peran (Wewenang)</th>
                <th className="py-3 px-4">Penugasan / Jabatan</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada personel yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  const showPwd = !!showPasswordMap[user.id];

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 text-white ${
                            user.role === 'Admin' ? 'bg-purple-700' :
                            user.role === 'Teknisi' ? 'bg-amber-600' :
                            'bg-blue-600'
                          }`}>
                            {user.avatar || 'OP'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{user.nama}</span>
                              {isCurrent && (
                                <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.2 rounded border border-slate-200">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {user.nip}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Login Credentials */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-mono text-slate-900 font-medium">
                            {user.username}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                            <span>Sandi: {showPwd ? user.password : '••••••••'}</span>
                            <button
                              onClick={() => toggleShowPassword(user.id)}
                              className="text-slate-400 hover:text-slate-700 underline text-[9px] cursor-pointer"
                              title="Tampilkan / Sembunyikan Kata Sandi"
                            >
                              {showPwd ? 'Tutup' : 'Lihat'}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          user.role === 'Admin' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          user.role === 'Teknisi' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {user.role === 'Admin' && <ShieldCheck className="w-3 h-3 text-purple-700" />}
                          {user.role === 'Teknisi' && <Wrench className="w-3 h-3 text-amber-600" />}
                          {user.role === 'Operator' && <User className="w-3 h-3 text-blue-600" />}
                          <span>{user.role}</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {user.role === 'Operator' ? 'Membuat antrean' :
                           user.role === 'Teknisi' ? 'Memproses antrean' :
                           'Kelola pengguna & audit'}
                        </div>
                      </td>

                      {/* Assignment / Machine Station */}
                      <td className="py-3 px-4">
                        <span className="text-slate-700">{user.jabatan}</span>
                      </td>

                      {/* Shift */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {user.shift}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Aktif</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onSwitchUser && !isCurrent && (
                            <button
                              onClick={() => onSwitchUser(user)}
                              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition flex items-center gap-1 cursor-pointer"
                              title="Beralih ke akun ini"
                            >
                              <LogIn className="w-3 h-3 text-slate-500" />
                              <span className="hidden md:inline">Masuk</span>
                            </button>
                          )}

                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL TAMBAH OPERATOR / PENGGUNA BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Tambah Operator / Personel Baru</h3>
                  <p className="text-[11px] text-slate-500">Registrasi akun baru untuk operasional manufaktur PT Vivo Mobile Indonesia</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNewUser} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nama Lengkap Personel <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rangga Pratama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nomor Induk Personel (NIP):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Peran / Role Pengguna:
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      setFormData({ 
                        ...formData, 
                        role: nextRole,
                        jabatan: nextRole === 'Teknisi' ? 'Teknisi Maintenance & Otomasi' :
                                 nextRole === 'Admin' ? 'System Administrator Pabrik' :
                                 'Operator Lini Assembly (ASM)'
                      });
                    }}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  >
                    <option value="Operator">Operator (Pembuat Antrean)</option>
                    <option value="Teknisi">Teknisi (Pemroses Antrean)</option>
                    <option value="Admin">Admin (Kelola Pengguna & Audit)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Shift Kerja:
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  >
                    <option value="Shift 1 (Pagi)">Shift 1 (07:00 - 15:00)</option>
                    <option value="Shift 2 (Siang)">Shift 2 (15:00 - 23:00)</option>
                    <option value="Shift 3 (Malam)">Shift 3 (23:00 - 07:00)</option>
                    <option value="General Maintenance">General (Non-Shift)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Penugasan / Stasiun Mesin:
                </label>
                <select
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-900 focus:outline-none"
                >
                  <option value="Operator Lini Assembly (ASM)">Operator Lini Assembly (Mesin ASM Baut)</option>
                  <option value="Operator Lini Dispensing Lem (AGM)">Operator Lini Dispensing (Mesin AGM Lem)</option>
                  <option value="Operator Mesin Press 3 in 1">Operator Mesin Press 3 in 1 (Line Body)</option>
                  <option value="Quality Control & AirTightness Tester">Quality Control & AirTightness Tester</option>
                  <option value="Operator Control Coldpress Pressure">Operator Control Coldpress Pressure (Baterai)</option>
                  <option value="Teknisi Maintenance & Otomasi">Teknisi Maintenance & Otomasi</option>
                  <option value="System Administrator Pabrik">System Administrator Pabrik</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Username Akun <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: operator.rangga"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Operator2026"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-500 text-[11px]">
                ℹ️ Operator yang baru didaftarkan dapat langsung masuk melalui tombol <strong>Ganti Akun</strong> menggunakan username dan kata sandi yang telah ditentukan.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftarkan Operator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
