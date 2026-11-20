import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DiagnosaView from './components/DiagnosaView';
import TiketPerbaikanView from './components/TiketPerbaikanView';
import CaseStudyView from './components/CaseStudyView';
import UserManagementView from './components/UserManagementView';
import CallTechnicianModal from './components/CallTechnicianModal';
import PrintSpkModal from './components/PrintSpkModal';
import LoginModal from './components/LoginModal';
import AiChatbot from './components/AiChatbot';

import { 
  INITIAL_USERS, 
  INITIAL_MACHINES, 
  INITIAL_GEJALA, 
  INITIAL_KERUSAKAN, 
  INITIAL_RULES, 
  INITIAL_DIAGNOSA_HISTORY, 
  INITIAL_TICKETS 
} from './data/initialData';
import { api } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [dbStatus, setDbStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'

  // State Data Utama (Diisi otomatis dari MySQL via /api/bootstrap)
  const [users, setUsers] = useState(INITIAL_USERS);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [gejalaList, setGejalaList] = useState(INITIAL_GEJALA);
  const [kerusakanList, setKerusakanList] = useState(INITIAL_KERUSAKAN);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [diagnosaHistory, setDiagnosaHistory] = useState(INITIAL_DIAGNOSA_HISTORY);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('expert_mech_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.role === 'Supervisor') {
            parsed.role = 'Admin';
            parsed.username = 'Admin';
            parsed.password = 'Admin1';
            parsed.jabatan = 'System Administrator & Plant Engineering Lead';
            parsed.nip = 'ADM-VVO-2019-001';
          }
          if (!parsed.avatar || parsed.avatar.startsWith('http') || parsed.avatar.length > 3) {
            parsed.avatar = (parsed.nama || parsed.username || 'OP')
              .split(' ')
              .map(w => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();
          }
          return parsed;
        }
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0];
  });

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('expert_mech_tab');
    if (saved === 'tiket' || saved === 'studi-kasus' || saved === 'pengguna') return saved;
    return 'diagnosa';
  });

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [callTechModalData, setCallTechModalData] = useState(null);
  const [isCallTechModalOpen, setIsCallTechModalOpen] = useState(false);
  const [printModalData, setPrintModalData] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Muat seluruh data dari Database MySQL saat aplikasi pertama kali dibuka
  useEffect(() => {
    let isMounted = true;
    async function loadFromMysql() {
      try {
        const data = await api.getBootstrap();
        if (!isMounted) return;
        if (data.users?.length) setUsers(data.users);
        if (data.machines?.length) setMachines(data.machines);
        if (data.gejala?.length) setGejalaList(data.gejala);
        if (data.kerusakan?.length) setKerusakanList(data.kerusakan);
        if (data.rules?.length) setRules(data.rules);
        if (Array.isArray(data.diagnosaHistory)) setDiagnosaHistory(data.diagnosaHistory);
        if (Array.isArray(data.tickets)) setTickets(data.tickets);
        setDbStatus('connected');
      } catch (err) {
        console.warn('[MySQL Bootstrap] Gagal memuat dari API MySQL, menggunakan fallback lokal:', err.message);
        if (isMounted) setDbStatus('offline');
      }
    }
    loadFromMysql();
    return () => {
      isMounted = false;
    };
  }, []);

  // Simpan sesi user & tab aktif di browser
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('expert_mech_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('expert_mech_tab', activeTab);
  }, [activeTab]);

  // ==========================================================================
  // CRUD HANDLERS TERINTEGRASI MYSQL
  // ==========================================================================
  const handleAddUser = async (newUser) => {
    try {
      const savedUser = await api.createUser(newUser);
      setUsers(prev => [savedUser, ...prev]);
      triggerToast(`Operator baru "${savedUser.nama}" tersimpan di MySQL & siap login!`);
    } catch (err) {
      if (dbStatus === 'connected') {
        triggerToast(`Gagal menyimpan ke MySQL: ${err.message}`, 'urgent');
        return;
      }
      setUsers(prev => [newUser, ...prev]);
      triggerToast(`Operator baru "${newUser.nama}" ditambahkan (Mode Offline).`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      triggerToast('Data personel berhasil dihapus dari MySQL.');
    } catch (err) {
      if (dbStatus === 'connected') {
        triggerToast(`Gagal menghapus dari MySQL: ${err.message}`, 'urgent');
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
      triggerToast('Data personel dihapus (Mode Offline).');
    }
  };

  const handleSwitchUser = (targetUser) => {
    setCurrentUser(targetUser);
    if (targetUser.role !== 'Admin' && activeTab === 'pengguna') {
      setActiveTab('diagnosa');
    }
    triggerToast(`Beralih ke akun ${targetUser.nama} (${targetUser.role})`);
  };

  const handleSaveDiagnosa = async (newRecord) => {
    try {
      const saved = await api.createDiagnosa(newRecord);
      setDiagnosaHistory(prev => [saved, ...prev]);
    } catch {
      setDiagnosaHistory(prev => [newRecord, ...prev]);
    }
  };

  const handleOpenCallTechnician = (data) => {
    setCallTechModalData(data);
    setIsCallTechModalOpen(true);
  };

  const handleSubmitTicket = async (newTicket) => {
    try {
      const savedTicket = await api.createTicket(newTicket);
      setTickets(prev => [savedTicket, ...prev]);
      setDiagnosaHistory(prev => 
        prev.map(d => d.idMesin === savedTicket.idMesin ? { ...d, statusPanggilan: 'Menunggu Teknisi' } : d)
      );
      triggerToast(`Tiket ${savedTicket.id} tersimpan ke MySQL & masuk antrean teknisi.`, 'urgent');
    } catch {
      setTickets(prev => [newTicket, ...prev]);
      triggerToast(`Tiket ${newTicket.id} masuk antrean (Mode Offline).`, 'urgent');
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus, technicianName) => {
    try {
      const updated = await api.takeTicket(ticketId, newStatus, technicianName);
      setTickets(prev => prev.map(t => (t.id === ticketId ? updated : t)));
      triggerToast(`Tiket ${ticketId} diperbarui di MySQL: ${updated.status}`);
    } catch {
      setTickets(prev =>
        prev.map(t =>
          t.id === ticketId
            ? { ...t, status: newStatus, teknisiPenanggung: technicianName, waktuMulai: new Date().toLocaleString('id-ID') }
            : t
        )
      );
      triggerToast(`Tiket ${ticketId} status diubah ke: ${newStatus}`);
    }
  };

  const handleFinishRepair = async (ticketId, repairDetails) => {
    try {
      const finished = await api.finishTicket(ticketId, repairDetails);
      setTickets(prev => prev.map(t => (t.id === ticketId ? finished : t)));
      setDiagnosaHistory(prev =>
        prev.map(d => (d.idMesin === finished.idMesin ? { ...d, statusPanggilan: 'Selesai' } : d))
      );
      triggerToast(`Tiket ${ticketId} selesai & tersimpan di MySQL.`);
    } catch {
      setTickets(prev =>
        prev.map(t =>
          t.id === ticketId
            ? {
                ...t,
                status: 'Selesai',
                tindakanTeknisi: repairDetails.tindakanTeknisi,
                rekomendasiTeknisi: repairDetails.rekomendasiTeknisi,
                waktuSelesai: repairDetails.waktuSelesai,
                teknisiPenanggung: repairDetails.teknisiPenanggung
              }
            : t
        )
      );
      triggerToast(`Tiket ${ticketId} telah selesai diperbaiki.`);
    }
  };

  const handleOpenPrintSpk = (data) => {
    setPrintModalData(data);
    setIsPrintModalOpen(true);
  };

  const pendingTicketsCount = tickets.filter(t => t.status === 'Menunggu Teknisi').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 animate-fadeIn">
          <div className="px-3.5 py-2.5 rounded-lg shadow-lg text-xs font-medium text-white flex items-center gap-2 bg-slate-900 border border-slate-800">
            {toastMessage.type === 'urgent' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => setIsLoginModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        pendingTicketsCount={pendingTicketsCount}
        usersCount={users.length}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'diagnosa' && (
          <DiagnosaView
            machines={machines}
            gejalaList={gejalaList}
            kerusakanList={kerusakanList}
            rules={rules}
            currentUser={currentUser}
            onSaveDiagnosa={handleSaveDiagnosa}
            onOpenCallTechnicianModal={handleOpenCallTechnician}
            onPrintSpk={handleOpenPrintSpk}
            diagnosaHistory={diagnosaHistory}
          />
        )}

        {activeTab === 'tiket' && (
          <TiketPerbaikanView
            tickets={tickets}
            currentUser={currentUser}
            machines={machines}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onFinishRepair={handleFinishRepair}
            onCreateTicket={handleSubmitTicket}
            onPrintSpk={(ticket) => handleOpenPrintSpk({
              machine: { 
                nama: ticket.namaMesin, 
                lokasi: ticket.lokasi, 
                id: ticket.idMesin || 'M01', 
                kode: ticket.idMesin || 'MESIN' 
              },
              diagnosis: { 
                namaKerusakan: ticket.kerusakan, 
                tingkat: ticket.tingkat || 'Parah', 
                percentage: ticket.persentase || 100, 
                solusi: ticket.tindakanTeknisi || ticket.rekomendasiTeknisi || 'Tindakan maintenance oleh tim teknisi pabrik.',
                kodeKerusakan: ticket.id,
                penangananOleh: 'Teknisi Maintenance'
              },
              selectedGejala: [ticket.catatanOperator || 'Laporan gangguan mesin oleh operator lini'],
              currentUser: { nama: ticket.namaOperator, role: 'Operator' }
            })}
          />
        )}

        {activeTab === 'pengguna' && currentUser?.role === 'Admin' && (
          <UserManagementView
            users={users}
            currentUser={currentUser}
            machines={machines}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onSwitchUser={handleSwitchUser}
          />
        )}

        {activeTab === 'studi-kasus' && (
          <CaseStudyView machines={machines} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">PT Vivo Mobile Indonesia</span>
            <span>•</span>
            <span>Sistem Pakar Troubleshooting Mesin Produksi</span>
            <span>•</span>
            <span className="font-mono text-[11px]">React + Express + MySQL</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            DB: db_sistem_pakar_mesin ({dbStatus === 'connected' ? 'MySQL Active' : dbStatus})
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CallTechnicianModal
        isOpen={isCallTechModalOpen}
        onClose={() => setIsCallTechModalOpen(false)}
        ticketData={callTechModalData}
        currentUser={currentUser}
        onSubmitTicket={handleSubmitTicket}
      />

      <PrintSpkModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={printModalData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role !== 'Admin' && activeTab === 'pengguna') {
            setActiveTab('diagnosa');
          }
          triggerToast(`Berhasil masuk sebagai ${user.nama} (${user.role})`);
        }}
      />

      {/* AI Chatbot Assistant (Gemini API with Strict Domain Guardrail) */}
      <AiChatbot
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        currentUser={currentUser}
      />
    </div>
  );
}
