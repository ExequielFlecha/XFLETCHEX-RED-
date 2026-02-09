
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Music, Film, Sparkles, 
  Mail, Lock, UserPlus, LogIn, Chrome, Info, X, 
  ChevronRight, BadgeCheck, CheckCircle, Flame,
  DollarSign, CreditCard, Wallet, Zap, AlertTriangle, ScanFace, Loader2,
  User as UserIcon, Check, Clock, ShieldX
} from 'lucide-react';

interface AuthModuleProps {
  onLogin: () => void;
  logo: string;
}

const AuthModule: React.FC<AuthModuleProps> = ({ onLogin, logo }) => {
  const [view, setView] = useState<'AUTH' | 'RULES' | 'RECOVERY' | 'HUMAN_VERIFY' | 'GOOGLE_SELECT' | 'WAITING_APPROVAL'>('AUTH');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);

  // Escuchar si el Administrador aprueba la cuenta desde otra pestaña o sesión simulada
  useEffect(() => {
    const checkApproval = setInterval(() => {
      const status = localStorage.getItem('xf_rehab_status');
      if (status === 'APPROVED' && view === 'WAITING_APPROVAL') {
        localStorage.removeItem('xf_rehab_status');
        onLogin();
      } else if (status === 'REJECTED' && view === 'WAITING_APPROVAL') {
        localStorage.removeItem('xf_rehab_status');
        setView('RECOVERY');
        alert("SOLICITUD RECHAZADA POR EL ADMINISTRADOR. EL PAGO NO FUE VÁLIDO.");
      }
    }, 2000);
    return () => clearInterval(checkApproval);
  }, [view, onLogin]);

  const MOCK_GOOGLE_ACCOUNTS = [
    { email: 'exequiel.flecha.baez@gmail.com', name: 'Exequiel Flecha Baez' },
    { email: 'usuario.redxf@gmail.com', name: 'Usuario XF' }
  ];

  const FORBIDDEN_RULES = [
    { text: "PROHIBIDO enviar Porno / Dibujos Porno.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO enviar Películas con Copyright (XF Protege tu libertad).", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO insultar al Creador (Exequiel Flecha Baez).", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO el uso de BOTS o Cuentas Falsas.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO Haters y Amenazas.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO Robo de identidad.", icon: <ShieldAlert className="text-red-500" /> }
  ];

  const ALLOWED_RULES = [
    { text: "HUMANOS REALES: Solo personas de verdad en la red.", icon: <CheckCircle className="text-green-500" /> },
    { text: "LIBRE de Copyright: Publica música y videos sin miedo.", icon: <Music className="text-green-500" /> },
    { text: "MONETIZACIÓN LIBRE: Gana dinero real.", icon: <Sparkles className="text-cyan-400" /> }
  ];

  const startHumanVerification = () => {
    setView('HUMAN_VERIFY');
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setVerifyProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => onLogin(), 1000);
      }
    }, 50);
  };

  const handleGoogleLogin = (account: string) => {
    setView('HUMAN_VERIFY');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setVerifyProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => onLogin(), 800);
      }
    }, 30);
  };

  const handleSimulatedPayment = () => {
    setIsPaying(true);
    
    // ENVIAR NOTIFICACIÓN AL ADMINISTRADOR
    window.dispatchEvent(new CustomEvent('xf_payment_pending', { 
      detail: { 
        amount: "PAGO RECIBIDO (EN REVISIÓN)", 
        user: "Usuario Expulsado #" + Math.floor(Math.random()*9999),
        method: "Mercado Pago / PayPal"
      } 
    }));
    
    setTimeout(() => {
      setIsPaying(false);
      setView('WAITING_APPROVAL'); // NO ENTRA A LA RED, SE QUEDA EN ESPERA
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#020205] overflow-hidden font-rajdhani">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-[900px] h-[900px] max-w-[98vw] max-h-[98vh] p-2 md:p-4 animate-fade-in flex items-center justify-center">
        
        {view === 'AUTH' && (
          <div className="w-full h-full bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] md:rounded-[4rem] p-6 md:p-10 lg:p-12 shadow-[0_0_80px_rgba(220,38,38,0.15)] flex flex-col md:flex-row gap-6 lg:gap-10 items-center justify-center overflow-y-auto scrollbar-hide">
            
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-6">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] bg-black">
                <img src={logo} className="w-full h-full object-cover" />
              </div>
              
              {/* NUEVO NOMBRE SOLICITADO (FLECHA AMARILLA) */}
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black italic font-futuristic uppercase tracking-tighter leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-pink-500 to-purple-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">XFLETCHAX</span>
                <br />
                <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">RED</span>
              </h1>
              
              {/* NUEVO SLOGAN SOLICITADO (ABAJO DEL NOMBRE) */}
              <p className="text-white/60 text-[10px] md:text-sm font-black italic max-w-sm uppercase tracking-[0.2em] leading-relaxed border-l-2 border-red-600 pl-4">
                XFLETCHAX RED LA RED SOCIAL QUE PUEDE CUMPLIR TU SUEÑOS ECHO REAL DEL FUTURO.
              </p>
              
              <div className="flex flex-col gap-4 w-full">
                <button 
                  onClick={() => setView('RULES')}
                  className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-3 px-6 rounded-2xl text-white/60 hover:text-white transition-all font-black text-[9px] md:text-xs uppercase tracking-[0.2em] italic"
                >
                  <Info size={16} /> LEYES ANTI-BOTS
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 space-y-6 md:space-y-8 shadow-2xl">
              <div className="flex gap-3 border-b border-white/5 pb-4">
                <button onClick={() => setIsRegistering(false)} className={`flex-1 py-3 rounded-xl font-black text-[9px] md:text-xs uppercase transition-all ${!isRegistering ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-white/40 hover:text-white/60'}`}>INGRESAR</button>
                <button onClick={() => setIsRegistering(true)} className={`flex-1 py-3 rounded-xl font-black text-[9px] md:text-xs uppercase transition-all ${isRegistering ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-white/40 hover:text-white/60'}`}>REGISTRARSE</button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {isRegistering && <input type="text" placeholder="NOMBRE REAL" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-red-600 text-white font-bold italic text-xs md:text-base" />}
                <input type="email" placeholder="CORREO" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-red-600 text-white font-bold italic text-xs md:text-base" />
                <input type="password" placeholder="CONTRASEÑA" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-red-600 text-white font-bold italic text-xs md:text-base" />
              </div>

              <div className="space-y-3 md:space-y-4">
                <button 
                  onClick={startHumanVerification}
                  className="w-full py-4 md:py-5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black font-futuristic text-[10px] md:text-xs tracking-[0.3em] rounded-xl md:rounded-[1.5rem] shadow-xl shadow-red-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic"
                >
                  <ScanFace size={20} /> {isRegistering ? 'REGISTRAR HUMANO' : 'ENTRAR A LA RED'}
                </button>

                <button 
                  onClick={() => setView('GOOGLE_SELECT')}
                  className="w-full py-3 md:py-4 bg-white text-black font-black rounded-xl md:rounded-[1.5rem] text-[8px] md:text-[10px] uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95"
                >
                  <Chrome size={18} /> CONTINUAR CON GOOGLE
                </button>

                <button 
                  onClick={() => setView('RECOVERY')}
                  className="w-full py-2 md:py-3 bg-red-600/10 border border-red-500/20 text-red-500 font-black text-[7px] md:text-[9px] rounded-lg md:rounded-xl uppercase italic tracking-[0.2em] hover:bg-red-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert size={14} /> ¿RECUPERAR CUENTA? (PAGO DE MULTA)
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'GOOGLE_SELECT' && (
          <div className="bg-white text-black rounded-[2.5rem] w-full max-w-md p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-scale-in flex flex-col font-sans">
             <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-500 font-bold text-3xl">G</span>
                  <span className="text-red-500 font-bold text-3xl">o</span>
                  <span className="text-yellow-500 font-bold text-3xl">o</span>
                  <span className="text-blue-500 font-bold text-3xl">g</span>
                  <span className="text-green-500 font-bold text-3xl">l</span>
                  <span className="text-red-500 font-bold text-3xl">e</span>
                </div>
                <h2 className="text-lg font-medium">Elige una cuenta</h2>
                <p className="text-sm text-gray-600 mt-2 text-center">para continuar en <span className="font-bold">XFLETCHAX RED</span></p>
             </div>

             <div className="space-y-1 mb-8 overflow-y-auto max-h-[350px] scrollbar-hide">
                {MOCK_GOOGLE_ACCOUNTS.map((acc, idx) => (
                   <button 
                    key={idx}
                    onClick={() => handleGoogleLogin(acc.email)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 group"
                   >
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                         <UserIcon size={20} />
                      </div>
                      <div className="text-left flex-1">
                         <p className="text-sm font-semibold">{acc.name}</p>
                         <p className="text-xs text-gray-500">{acc.email}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                   </button>
                ))}
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors">
                   <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
                      <UserPlus size={18} />
                   </div>
                   <p className="text-sm font-semibold">Usar otra cuenta</p>
                </button>
             </div>

             <div className="text-[10px] text-gray-500 text-center leading-relaxed">
                Para continuar, Google compartirá tu nombre, dirección de correo electrónico, preferencia de idioma y foto de perfil con XFLETCHAX RED.
             </div>

             <button 
              onClick={() => setView('AUTH')}
              className="mt-8 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-center"
             >
                Cancelar y Volver
             </button>
          </div>
        )}

        {view === 'HUMAN_VERIFY' && (
          <div className="bg-[#0a0a0f] border-2 border-cyan-500/30 rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 text-center shadow-[0_0_100px_rgba(34,211,238,0.3)] animate-scale-in w-full max-w-2xl aspect-square flex flex-col justify-center items-center">
             <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto mb-10">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping"></div>
                <div className="relative z-10 w-full h-full bg-black border-4 border-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                   <ScanFace className="text-cyan-400 animate-pulse" size={80} md:size={120} />
                   <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_30px_#22d3ee] animate-scan"></div>
                </div>
             </div>
             <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">ESCANEANDO ADN VIRTUAL</h2>
             <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-10 italic">VERIFICANDO QUE NO ERES UN BOT FALSO...</p>
             <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-4 max-w-xs">
                <div className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_15px_#22d3ee]" style={{ width: `${verifyProgress}%` }}></div>
             </div>
             <p className="text-cyan-400 font-black text-xl md:text-3xl italic font-futuristic">{verifyProgress}%</p>
          </div>
        )}

        {view === 'RULES' && (
          <div className="bg-[#0a0a0f]/95 backdrop-blur-3xl border border-red-500/20 rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 shadow-[0_0_150px_rgba(220,38,38,0.25)] relative animate-scale-in w-full h-full overflow-y-auto scrollbar-hide flex flex-col">
            <button onClick={() => setView('AUTH')} className="absolute top-8 right-8 text-white/20 hover:text-white p-2 bg-white/5 rounded-full transition-all z-30"><X size={32} /></button>
            <div className="flex flex-col items-center text-center mb-10">
              <ShieldCheck className="text-green-500 mb-6 animate-pulse" size={60} />
              <h2 className="text-3xl md:text-5xl font-black font-futuristic text-white italic uppercase tracking-tighter leading-none">RED 100% HUMANA</h2>
              <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px] mt-4 italic">Sistema Anti-Falsedad XFLETCHAX</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-red-500 font-black text-[10px] md:text-xs uppercase tracking-widest italic flex items-center gap-3"><Flame size={16} /> TOLERANCIA CERO A BOTS</h3>
                <div className="space-y-3">
                  {FORBIDDEN_RULES.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-red-500/5 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">{rule.icon}</div>
                      <p className="text-[10px] md:text-xs font-bold text-white/80 italic">{rule.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-cyan-400 font-black text-[10px] md:text-xs uppercase tracking-widest italic flex items-center gap-3"><BadgeCheck size={16} /> GENTE REAL DEL MUNDO</h3>
                <div className="space-y-3">
                  {ALLOWED_RULES.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-cyan-500/5 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-cyan-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">{rule.icon}</div>
                      <p className="text-[10px] md:text-xs font-bold text-white/80 italic">{rule.text}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setView('AUTH')} className="w-full mt-6 bg-white text-black py-4 px-8 rounded-xl font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] italic hover:bg-red-600 hover:text-white transition-all shadow-xl">ENTIENDO Y SOY HUMANO</button>
              </div>
            </div>
          </div>
        )}

        {view === 'RECOVERY' && (
          <div className="bg-[#0a0a0f]/95 backdrop-blur-3xl border border-red-500/20 rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 shadow-[0_0_150px_rgba(220,38,38,0.25)] relative animate-scale-in w-full h-full flex flex-col justify-center overflow-y-auto scrollbar-hide">
            <button onClick={() => setView('AUTH')} className="absolute top-8 right-8 text-white/20 hover:text-white p-2 bg-white/5 rounded-full transition-all z-30"><X size={32} /></button>
            <div className="flex flex-col items-center text-center mb-10">
               <ShieldAlert className="text-red-500 animate-pulse mb-6" size={50} />
               <h2 className="text-4xl md:text-6xl font-black font-futuristic text-white italic uppercase tracking-tighter leading-none">REHABILITACIÓN</h2>
               <p className="text-red-500 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] mt-4 italic">MULTAS POR BOTS O INCUMPLIMIENTO</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
               <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6">
                  <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5 pb-4 italic">TABLA DE PRECIOS</h3>
                  <div className="flex justify-between items-center"><span className="text-white/60 font-bold text-base italic">🇦🇷 ARGENTINA</span><span className="text-red-500 font-black text-2xl">$1.000.000</span></div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4"><span className="text-white/60 font-bold text-base italic">🌎 GLOBAL</span><span className="text-red-500 font-black text-2xl">$1.000 USD</span></div>
               </div>
               <div className="space-y-6 flex flex-col justify-center">
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-[2rem] p-6 md:p-8 space-y-4">
                     <div><p className="text-[8px] text-white/30 font-black uppercase mb-1">ALIAS MP</p><p className="text-xl md:text-2xl font-black text-white italic">exequiel.flecha.bx</p></div>
                     <div><p className="text-[8px] text-white/30 font-black uppercase mb-1">PAYPAL GLOBAL</p><p className="text-xl md:text-2xl font-black text-white italic">ExequielFlechaX</p></div>
                  </div>
                  {/* BOTÓN VERDE DE PAGO - AHORA ACTIVADO SEGÚN FOTO */}
                  <button 
                    onClick={handleSimulatedPayment} 
                    disabled={isPaying} 
                    className={`w-full py-5 md:py-6 rounded-[2rem] font-black font-futuristic text-xs md:text-sm tracking-[0.3em] uppercase italic transition-all shadow-xl ${isPaying ? 'bg-white/10 text-white/40 cursor-wait' : 'bg-green-600 hover:bg-green-500 text-white active:scale-95 shadow-green-900/40'}`}
                  >
                    {isPaying ? 'PROCESANDO PAGO...' : 'CONFIRMAR PAGO'}
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* PANTALLA DE ESPERA DE APROBACIÓN POR ADMINISTRADOR */}
        {view === 'WAITING_APPROVAL' && (
          <div className="bg-[#0a0a0f] border-2 border-yellow-500/30 rounded-[4rem] p-12 text-center shadow-[0_0_120px_rgba(234,179,8,0.2)] animate-scale-in flex flex-col items-center justify-center w-full max-w-2xl aspect-square">
             <div className="relative w-48 h-48 mb-10">
                <div className="absolute inset-0 bg-yellow-500/5 rounded-full animate-ping"></div>
                <div className="relative z-10 w-full h-full bg-black border-4 border-yellow-500 rounded-full flex items-center justify-center overflow-hidden">
                   <Clock className="text-yellow-400 animate-pulse" size={100} />
                   <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 shadow-[0_0_30px_#eab308] animate-scan"></div>
                </div>
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none text-center">SOLICITUD ENVIADA AL ADMINISTRADOR DIOS</h2>
             <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-10 italic max-w-md">EL PAGO HA SIDO REGISTRADO. POR FAVOR ESPERE A QUE EXEQUIEL FLECHA BAEZ VALIDE LA TRANSFERENCIA MANUALMENTE.</p>
             
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 mb-10">
                <ShieldCheck className="text-green-500" size={24} />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">SISTEMA ANTI-ESTAFA ACTIVO</span>
             </div>

             <button 
                onClick={() => setView('AUTH')}
                className="text-white/20 hover:text-white font-black text-[10px] uppercase tracking-widest italic"
             >
                CANCELAR Y VOLVER AL INICIO
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModule;
