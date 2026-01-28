
import React, { useState, useEffect } from 'react';
import { 
  Zap, ShieldCheck, ShieldAlert, DollarSign, 
  Terminal, Lock, Search, Eye, Cpu, Database,
  CheckCircle, Bell
} from 'lucide-react';

const SecurityAI: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'ALERT' | 'PAYMENT'>('IDLE');
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
    if (status !== 'PAYMENT') {
      const interval = setInterval(() => {
        setStatus('SCANNING');
        setScanText("ESCANEANDO INTRUSOS...");
        setTimeout(() => {
          setStatus('IDLE');
          setScanText("SISTEMA PROTEGIDO POR AURA XF");
        }, 3000);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="fixed bottom-8 left-8 z-[500] pointer-events-none">
      <div className="relative group pointer-events-auto">
        
        {/* Notificación Emergente de Pago */}
        {status === 'PAYMENT' && (
          <div className="absolute bottom-24 left-0 w-72 bg-green-600 border-2 border-white/30 rounded-2xl p-4 shadow-[0_0_50px_rgba(34,197,94,0.6)] animate-bounce z-[600]">
             <div className="flex items-center gap-3">
                <Bell className="text-white animate-pulse" size={20} />
                <div>
                   <p className="text-[10px] font-black text-white uppercase italic tracking-widest">NOTIFICACIÓN IA XF</p>
                   <p className="text-xs font-black text-white uppercase italic">TRANSFERENCIA EXITOSA RECIBIDA</p>
                </div>
             </div>
          </div>
        )}

        {/* Orbe de la IA */}
        <button 
          onClick={() => setShowHUD(!showHUD)}
          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
            status === 'IDLE' ? 'bg-cyan-600/20 border-cyan-400/50 shadow-[0_0_20px_#22d3ee50]' :
            status === 'SCANNING' ? 'bg-purple-600/20 border-purple-400/50 shadow-[0_0_30px_#c084fc50] animate-pulse' :
            status === 'PAYMENT' ? 'bg-green-600 border-white animate-pulse' :
            'bg-red-600/20 border-red-500 shadow-[0_0_40px_#dc2626]'
          }`}
        >
          <div className={`absolute inset-0 rounded-full blur-md ${status === 'SCANNING' ? 'bg-purple-500/20' : 'bg-transparent'}`}></div>
          {status === 'PAYMENT' ? (
             <CheckCircle className="relative z-10 text-white" size={32} />
          ) : (
             <Cpu className={`relative z-10 ${status === 'IDLE' ? 'text-cyan-400' : 'text-purple-400'} ${status === 'SCANNING' ? 'animate-spin-slow' : ''}`} size={28} />
          )}
        </button>

        {/* Etiqueta de Estado */}
        <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black text-white italic uppercase tracking-widest flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'IDLE' ? 'bg-green-500' : status === 'PAYMENT' ? 'bg-white' : 'bg-purple-500'} animate-pulse`}></span>
            IA AURA XF: {scanText}
          </p>
        </div>

        {/* Ventana HUD de la IA */}
        {showHUD && (
          <div className="absolute bottom-20 left-0 w-80 bg-[#05050a]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                <ShieldCheck size={16} className="text-cyan-400" /> NÚCLEO AURA XF
              </h3>
              <button onClick={() => setShowHUD(false)} className="text-white/20 hover:text-white"><Terminal size={14}/></button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] italic">Módulos de Patrullaje</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/60">Seguridad Intrusos</span>
                  <span className="text-[10px] font-black text-green-500">ACTIVO</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/60">Validador de Pagos</span>
                  <span className={`text-[10px] font-black ${status === 'PAYMENT' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                    {status === 'PAYMENT' ? 'RECIBIENDO...' : 'LISTO'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-green-600/10 border border-green-500/20 rounded-2xl">
                <p className="text-[8px] font-black text-green-500 uppercase tracking-widest italic mb-2">Pasarela MP & PayPal</p>
                <div className="space-y-2">
                   <p className="text-[9px] text-white/60 font-bold uppercase italic">MP: exequiel.flecha.bx</p>
                   <p className="text-[9px] text-white/60 font-bold uppercase italic">PP: ExequielFlechaX</p>
                </div>
              </div>

              <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl">
                <p className="text-[8px] font-black text-red-500 uppercase tracking-widest italic mb-2">Protocolo Rehabilitación</p>
                <div className="flex items-center gap-3">
                  <Lock size={14} className="text-red-500" />
                  <p className="text-[9px] text-white/40 font-bold uppercase italic leading-tight">La IA procesa devoluciones de cuenta post-notificación de pago.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="px-6 py-2 bg-white/5 rounded-full flex items-center gap-3">
                <Zap className="text-yellow-400 animate-pulse" size={12} />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Protección de Nivel Dios</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityAI;
