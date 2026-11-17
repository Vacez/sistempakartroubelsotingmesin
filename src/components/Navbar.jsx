import React from 'react';
import { 
  Activity, 
  Wrench, 
  Factory, 
  LogOut, 
  User,
  Users
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout, 
  pendingTicketsCount = 0,
  usersCount = 0
}) {
  // Menu operasional: jika Admin, tampilkan menu "Kelola Operator"
  const navTabs = [
    { id: 'diagnosa', label: 'Diagnosa Mesin', icon: Activity },
    { 
      id: 'tiket', 
      label: 'Antrean Perbaikan', 
      icon: Wrench, 
      count: pendingTicketsCount 
    },
    ...(currentUser?.role === 'Admin' ? [
      { 
        id: 'pengguna', 
        label: 'Kelola Operator', 
        icon: Users,
        count: usersCount
      }
    ] : []),
    { id: 'studi-kasus', label: 'Profil Mesin Pabrik', icon: Factory },
  ];

  // Inisial aman (mencegah teks URL bocor ke UI)
  const userInitials = typeof currentUser?.avatar === 'string' && currentUser.avatar.length <= 3 && !currentUser.avatar.startsWith('http')
    ? currentUser.avatar
    : (currentUser?.nama || currentUser?.username || 'OP')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Industrial Plant Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wide">PT VIVO MOBILE INDONESIA</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Plant Cikarang • Manufacturing Maintenance</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded">
              Forward Chaining Engine
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300 font-medium">Sistem Online</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-300 text-[11px]">
              Wewenang:{' '}
              <strong className={
                currentUser?.role === 'Teknisi' ? 'text-amber-400' :
                currentUser?.role === 'Admin' ? 'text-purple-300' :
                'text-blue-400'
              }>
                {currentUser?.role === 'Operator' ? 'Membuat Antrean' :
                 currentUser?.role === 'Teknisi' ? 'Memproses Antrean' :
                 'Kelola Operator & Monitoring'}
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>Shift: <strong className="text-slate-200">{currentUser?.shift || 'Shift 1'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & System Brand */}
          <div 
            onClick={() => setActiveTab('diagnosa')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>ExpertMech</span>
                <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-none">Troubleshooting Mesin Produksi</p>
            </div>
          </div>

          {/* User Profile Bar & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 select-none">
                {userInitials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-slate-900 leading-none flex items-center gap-1.5">
                  <span>{currentUser?.nama}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    currentUser?.role === 'Teknisi' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    currentUser?.role === 'Admin' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                    'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {currentUser?.role === 'Operator' ? 'Operator • Buat Antrean' :
                     currentUser?.role === 'Teknisi' ? 'Teknisi • Proses Antrean' :
                     'Admin • Kelola Operator'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {currentUser?.nip || currentUser?.jabatan}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 font-medium cursor-pointer"
              title="Ganti Akun / Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Ganti Akun</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    tab.id === 'pengguna' ? 'bg-purple-100 text-purple-800' :
                    isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
