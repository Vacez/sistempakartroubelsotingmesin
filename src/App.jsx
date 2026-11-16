import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DiagnosaView from './components/DiagnosaView';
import TiketPerbaikanView from './components/TiketPerbaikanView';
import CaseStudyView from './components/CaseStudyView';
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
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('expert_mech_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sanitize legacy avatar URLs or invalid strings
        if (parsed) {
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
    if (saved === 'tiket' || saved === 'studi-kasus') return saved;
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
        const found = tickets.find(t => t.id === ticketId);
        if (found && d.idMesin === found.idMesin) {
          return { ...d, statusPanggilan: 'Selesai' };
        }
        return d;
      })
    );

    triggerToast(`Perbaikan tiket ${ticketId} selesai dikonfirmasi. Notifikasi terkirim.`);
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
        <div className="fixed bottom-5 right-5 z-50">
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
      />

      {/* Main Content Area (Menu Database & Diagram UML telah dihapus sesuai permintaan) */}
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
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          triggerToast(`Berhasil masuk sebagai ${user.nama} (${user.role})`);
        }}
      />
    </div>
  );
}
