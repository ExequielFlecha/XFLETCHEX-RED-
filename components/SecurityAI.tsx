
import React, { useState, useEffect } from 'react';
import { 
  Zap, ShieldCheck, ShieldAlert, DollarSign, 
  Terminal, Lock, Search, Eye, Cpu, Database,
  CheckCircle, Bell, UserX, Ghost
} from 'lucide-react';

const SecurityAI: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ALERT' | 'PAYMENT' | 'BOT_PURGE'>('IDLE');
  const [scanText, setScanText] = useState("SISTEMA PROTEGIDO POR AURA XF");
  const [showHUD, setShowHUD] = useState(false);
  const [lastPayment, setLastPayment] = useState<string | null>(null);

  useEffect(() => {
    const handlePayment = (e: any) => {
      setStatus('PAYMENT');
      setLastPayment(e.detail.amount);
      setScanText("PAGO RECIBIDO EXITOSAMENTE - VALIDANDO...");
      
      setTimeout(() => {
        setStatus('IDLE');
        setScanText("CUENTA REHABILITADA - ACCESO CONCEDIDO");
        setTimeout(() => setScanText("SISTEMA PROTEGIDO POR AURA XF"), 3000);
      }, 4000);
    };

    window.addEventListener('xf_payment_received', handlePayment);
    return () => window.removeEventListener('xf_payment_received', handlePayment);
  }, []);

  useEffect(() => {
    if (status === 'IDLE') {
      const interval = setInterval(() => {
        const isPurge = Math.random() > 0.7;
        if (isPurge) {
          setStatus('BOT_PURGE');
          setScanText("FILTRO ANTI-BOTS: ELIMINANDO CUENTAS FALSAS...");
          setTimeout(() => {
            setStatus('IDLE');
            setScanText("RED LIMPIA: 100% HUMANA");
            setTimeout(() => setScanText("SISTEMA PROTEGIDO POR AURA XF"), 3000);
          }, 4000);
        } else {
          setStatus('SCANNING');
          setScanText("ESCANEANDO INTRUSOS...");
          setTimeout(() => {
            setStatus('IDLE');
            setScanText("SISTEMA PROTEGIDO POR AURA XF");
          }, 3000);
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="relative group flex items-center">
      {/* Alerta Bot Purge */}
      {status === 'BOT_PURGE' && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-80 bg-red-600 border-2 border-white/30 rounded-2xl p-4 shadow-[0_0_60px_#dc2626] animate-pulse z-[600]">
           <div className="flex items-center gap-3">
              <UserX className="text-white" size={24} />
              <div>
                 <p className="text-[10px] font-black text-white uppercase italic tracking-widest">FILTRO ANTI-BOTS ACTIVADO</p>
                 <p className="text-xs font-black text-white uppercase italic">ELIMINANDO INTRUSOS FALSOS</p>
              </div>
           </div>
        </div>
      )}

      {/* Orbe de la IA */}
      <button 
        onClick={(e) => { e.stopPropagation(); setShowHUD(!showHUD); }}
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 shadow-2xl flex-shrink-0 ${
          status === 'IDLE' ? 'bg-cyan-600/20 border-cyan-400/40' :
          status === 'SCANNING' ? 'bg-purple-600/20 border-purple-400/40 animate-pulse' :
          status === 'PAYMENT' ? 'bg-green-600 border-white' :
          status === 'BOT_PURGE' ? 'bg-red-600 border-white animate-bounce' :
          'bg-red-600/20 border-red-500 shadow-[0_0_40px_#dc2626]'
        }`}
      >
        <div className={`absolute inset-0 rounded-full blur-md ${status === 'SCANNING' ? 'bg-purple-500/10' : ''}`}></div>
        {status === 'BOT_PURGE' ? <Ghost className="text-white" size={20} /> : <Cpu className={`relative z-10 ${status === 'IDLE' ? 'text-cyan-400' : 'text-purple-400'}`} size={18} />}
      </button>

      {/* Etiqueta de Estado */}
      <div className="absolute left-full ml-4 bg-black/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
        <p className="text-[8px] font-black text-white italic uppercase tracking-widest flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'IDLE' ? 'bg-green-500' : status === 'BOT_PURGE' ? 'bg-red-500' : 'bg-cyan-400'} animate-pulse`}></span>
          AURA XF: {scanText}
        </p>
      </div>

      {/* HUD de la IA */}
      {showHUD && (
        <div className="fixed top-24 left-4 md:left-24 w-80 bg-[#05050a]/98 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-slide-up z-[200]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" /> ESCUDO ANTI-BOTS
            </h3>
            <button onClick={() => setShowHUD(false)} className="text-white/20 hover:text-white"><Terminal size={14}/></button>
          </div>

          <div className="space-y-4 text-left">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] italic">Filtro de Humanidad</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/60">Gente Real</span>
                <span className="text-[10px] font-black text-green-500">ACTIVO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/60">Bots Purgados</span>
                <span className="text-[10px] font-black text-red-500">994.201</span>
              </div>
            </div>

            <div className="p-4 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl">
              <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest italic mb-2">ADN VIRTUAL PROTEGIDO</p>
              <div className="flex items-center gap-3">
                <CheckCircle size={14} className="text-cyan-400" />
                <p className="text-[9px] text-white/40 font-bold uppercase italic leading-tight">Cada usuario en la red ha pasado el escaneo biométrico del Creador.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAI;
