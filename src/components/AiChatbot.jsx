import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_QUESTIONS = [
  '🔧 Baut macet di jalur feeder mesin ASM',
  '🟡 Lampu kuning menyala di AGM (Conveyor tersendat)',
  '🔴 Tekanan Press 3 in 1 di atas 418 & alarm bunyi',
  '💧 Lem meluber / nozzle tersumbat di AGM',
  '🔋 Kamera barcode baterai tidak terbaca di Coldpress',
  '⚡ Kapan operator tangani mandiri vs panggil teknisi?',
  '📋 Cara terbitkan tiket antrean perbaikan di sistem',
  '📄 Prosedur pengisian tindakan teknisi & cetak SPK'
];

export default function AiChatbot({ isOpen, setIsOpen, currentUser }) {
  const roleTitle = currentUser?.role === 'Teknisi' 
    ? 'Teknisi Maintenance' 
    : currentUser?.role === 'Admin' 
    ? 'Admin Sistem' 
    : 'Operator Produksi';

  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: `Halo **${currentUser?.nama || 'Rekan Pabrik'}** (${roleTitle})! 👋\n\nSaya **Asisten AI Troubleshooting Mesin PT Vivo Mobile Indonesia**.\n\nAda kendala operasional atau alarm indikator pada mesin di lini produksi? Ceritakan masalah yang terjadi, misalnya:\n- Baut macet atau torsi NG pada Mesin ASM\n- Lampu kuning menyala / conveyor macet pada Mesin AGM\n- Tekanan melebihi batas 418 bar pada Mesin Press 3 in 1\n- Lem tidak keluar atau nozzle meluber pada Mesin AGM\n- Kebocoran selang pneumatik / uji AirTightness selalu NG\n- Kamera pemindai barcode baterai gagal baca di Coldpress\n\nSaya siap membantu mendampingi Anda:\n- 🔍 **Analisa Kerusakan**: Deteksi penyebab fisik & tingkat keparahan (Ringan/Sedang/Parah).\n- 🛠️ **Solusi Lapangan**: Langkah mandiri Operator (SOP Stop-Reset-Run) atau tindakan perbaikan Teknisi.\n- 🎫 **Alur Sistem Web**: Panduan penerbitan tiket antrean perbaikan dan pencetakan dokumen SPK resmi.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Siapkan riwayat singkat untuk konteks API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const res = await api.chatWithAi(query, history);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.reply || 'Maaf, tidak ada tanggapan yang diterima.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('[AiChatbot] Error:', err);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `⚠️ Maaf, terjadi kendala koneksi ke server AI: ${err.message}. Pastikan server backend sedang aktif atau gunakan pertanyaan rekomendasi di bawah.`,
        isError: true,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: `Percakapan telah direset. Silakan ceritakan kendala operasional mesin di lini produksi, atau tanyakan seputar **SOP penanganan mandiri Operator**, **tindakan perbaikan Teknisi**, dan **penerbitan tiket/SPK**.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Render teks markdown sederhana (bold, list, bullet, numbers)
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      const rawContent = isBullet ? trimmed.replace(/^[-*]\s+/, '') : line;

      // Format bold text **text**
      const parts = rawContent.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-blue-500 font-bold leading-none mt-1 shrink-0">•</span>
            <span className="flex-1 leading-relaxed text-slate-800">{formattedParts}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} className="my-1 pl-1 text-slate-800 font-medium leading-relaxed">
            {formattedParts}
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed text-slate-800">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Always visible when chat is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group border-2 border-blue-400/40 cursor-pointer"
          title="Tanya Asisten AI Pakar Mesin"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>Tanya AI Pakar</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] text-slate-300 font-mono">Gemini AI • 13 Use Case</span>
          </div>
        </button>
      )}

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div 
          className={`fixed bottom-5 right-5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded 
              ? 'w-[95vw] sm:w-[680px] h-[85vh] max-h-[820px]' 
              : 'w-[92vw] sm:w-[430px] h-[580px] max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-700 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
                <Bot className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                    <span>Asisten AI Pakar Mesin</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-semibold">
                    v1.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>PT Vivo Mobile Indonesia • Gemini 3.5</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition text-xs cursor-pointer"
                title="Bersihkan Percakapan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition text-xs cursor-pointer hidden sm:block"
                title={isExpanded ? 'Kecilkan Tampilan' : 'Perbesar Tampilan'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition text-xs cursor-pointer"
                title="Tutup Chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Guardrail Notice */}
          <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="truncate">Fokus: <strong>Troubleshooting Lini Perakitan</strong> & <strong>SOP Mesin PT Vivo</strong></span>
            </span>
            <span className="text-[10px] font-mono font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shrink-0">
              SOP Lapangan
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-blue-600 text-white shadow-sm'
                    }`}
                  >
                    {isUser ? (
                      (currentUser?.nama || 'U').slice(0, 1).toUpperCase()
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : msg.isError
                          ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      {renderFormattedText(msg.text)}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-mono px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Sedang menganalisis basis pengetahuan...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bg-white px-3 pt-2 pb-1 border-t border-slate-100 overflow-x-auto scrollbar-none flex gap-1.5">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.replace(/^[^\w]+/, ''))}
                disabled={isLoading}
                className="text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 hover:border-blue-200 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ceritakan kendala mesin (contoh: baut macet di ASM, lampu kuning AGM, overpressure)..."
                disabled={isLoading}
                className="w-full text-xs pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 disabled:bg-slate-100"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400 transition cursor-pointer"
                title="Kirim Pesan"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
              <span>Tekan <strong>Enter</strong> untuk mengirim</span>
              <span className="font-mono text-[9px]">PT Vivo Mobile Indonesia</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
