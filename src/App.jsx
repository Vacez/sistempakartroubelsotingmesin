import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DiagnosaView from './components/DiagnosaView';
import TiketPerbaikanView from './components/TiketPerbaikanView';
import CaseStudyView from './components/CaseStudyView';
import UserManagementView from './components/UserManagementView';
import CallTechnicianModal from './components/CallTechnicianModal';
import PrintSpkModal from './components/PrintSpkModal';
import LoginModal from './components/LoginModal';

import { 
  INITIAL_USERS, 
  INITIAL_MACHINES, 
  INITIAL_GEJALA, 
  INITIAL_KERUSAKAN, 
  INITIAL_RULES, 
  INITIAL_DIAGNOSA_HISTORY, 
  INITIAL_TICKETS 
} from './data/initialData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Database Pengguna / Personel Pabrik
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('expert_mech_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migrasi Supervisor -> Admin jika ada di cache
          return parsed.map(u => u.role === 'Supervisor' ? {
            ...u,
            role: 'Admin',
            username: u.username === 'supervisor' ? 'Admin' : u.username,
            password: u.password === 'Supervisor2026' ? 'Admin1' : u.password,
            jabatan: 'System Administrator & Plant Engineering Lead',
            nip: u.nip ? u.nip.replace('SPV-', 'ADM-') : 'ADM-VVO-2019-001'
          } : u);
        }
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('expert_mech_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          // Migrasi Supervisor -> Admin
          if (parsed.role === 'Supervisor') {
            parsed.role = 'Admin';
            parsed.username = 'Admin';
            parsed.password = 'Admin1';
            parsed.jabatan = 'System Administrator & Plant Engineering Lead';
            parsed.nip = 'ADM-VVO-2019-001';
          }
          // Sanitize legacy avatar URLs or invalid strings
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
      } catch (e) {
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

  const [machines, setMachines] = useState(() => {
    const saved = localStorage.getItem('expert_mech_machines');
    return saved ? JSON.parse(saved) : INITIAL_MACHINES;
  });

  const [gejalaList, setGejalaList] = useState(() => {
    const saved = localStorage.getItem('expert_mech_gejala');
    return saved ? JSON.parse(saved) : INITIAL_GEJALA;
  });

  const [kerusakanList, setKerusakanList] = useState(() => {
    const saved = localStorage.getItem('expert_mech_kerusakan');
    return saved ? JSON.parse(saved) : INITIAL_KERUSAKAN;
  });

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('expert_mech_rules');
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });

  const [diagnosaHistory, setDiagnosaHistory] = useState(() => {
    const saved = localStorage.getItem('expert_mech_diagnosa');
    return saved ? JSON.parse(saved) : INITIAL_DIAGNOSA_HISTORY;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('expert_mech_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [callTechModalData, setCallTechModalData] = useState(null);
  const [isCallTechModalOpen, setIsCallTechModalOpen] = useState(false);
  const [printModalData, setPrintModalData] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('expert_mech_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('expert_mech_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('expert_mech_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('expert_mech_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('expert_mech_diagnosa', JSON.stringify(diagnosaHistory));
  }, [diagnosaHistory]);

  useEffect(() => {
    localStorage.setItem('expert_mech_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('expert_mech_gejala', JSON.stringify(gejalaList));
  }, [gejalaList]);

  useEffect(() => {
    localStorage.setItem('expert_mech_kerusakan', JSON.stringify(kerusakanList));
  }, [kerusakanList]);

  const triggerToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Manajemen User Handlers (Admin)
  const handleAddUser = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    triggerToast(`Operator baru "${newUser.nama}" (${newUser.username}) berhasil didaftarkan!`);
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    triggerToast('Data personel berhasil dihapus.');
  };

  const handleSwitchUser = (targetUser) => {
    setCurrentUser(targetUser);
    triggerToast(`Beralih ke akun ${targetUser.nama} (${targetUser.role})`);
  };

  const handleSaveDiagnosa = (newRecord) => {
    setDiagnosaHistory(prev => [newRecord, ...prev]);
  };

  const handleOpenCallTechnician = (data) => {
    setCallTechModalData(data);
    setIsCallTechModalOpen(true);
  };

  const handleSubmitTicket = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    setDiagnosaHistory(prev => 
      prev.map(d => d.idMesin === newTicket.idMesin ? { ...d, statusPanggilan: 'Menunggu Teknisi' } : d)
    );
    triggerToast(`Tiket ${newTicket.id} berhasil dikirim ke antrean teknisi maintenance.`, 'urgent');
  };

  const handleUpdateTicketStatus = (ticketId, newStatus, technicianName) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: newStatus,
            teknisiPenanggung: technicianName,
            waktuMulai: new Date().toLocaleString('id-ID')
          };
        }
        return t;
      })
    );
    triggerToast(`Tiket ${ticketId} status diubah ke: ${newStatus}`);
  };

  const handleFinishRepair = (ticketId, repairDetails) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Selesai',
            tindakanTeknisi: repairDetails.tindakanTeknisi,
            rekomendasiTeknisi: repairDetails.rekomendasiTeknisi,
            waktuSelesai: repairDetails.waktuSelesai,
            teknisiPenanggung: repairDetails.teknisiPenanggung
          };
        }
        return t;
      })
    );

    setDiagnosaHistory(prev =>
      prev.map(d => {
        const matchingTicket = tickets.find(t => t.id === ticketId);
        if (matchingTicket && d.idMesin === matchingTicket.idMesin) {
          return { ...d, statusPanggilan: 'Selesai' };
        }
        return d;
      })
    );

    triggerToast(`Tiket ${ticketId} telah selesai diperbaiki.`);
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
        <div className="fixed bottom-5 right-5 z-50 animate-fadeIn">
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
        pendingTicketsCount={pendingTicketsCount}
        usersCount={users.length}
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
            <span className="font-mono text-[11px]">Forward Chaining</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Manufacturing Line Diagnostic Unit
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
          triggerToast(`Berhasil masuk sebagai ${user.nama} (${user.role})`);
        }}
      />
    </div>
  );
}
