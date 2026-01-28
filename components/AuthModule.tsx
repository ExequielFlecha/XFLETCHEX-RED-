
import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Music, Film, Sparkles, 
  Mail, Lock, UserPlus, LogIn, Chrome, Info, X, 
  ChevronRight, BadgeCheck, CheckCircle, Flame,
  DollarSign, CreditCard, Wallet, Zap, AlertTriangle
} from 'lucide-react';

interface AuthModuleProps {
  onLogin: () => void;
  logo: string;
}

const AuthModule: React.FC<AuthModuleProps> = ({ onLogin, logo }) => {
  const [view, setView] = useState<'AUTH' | 'RULES' | 'RECOVERY'>('AUTH');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const FORBIDDEN_RULES = [
    { text: "PROHIBIDO enviar Porno / Dibujos Porno.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO enviar Drogas.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO insultar al Creador (Exequiel Flecha Baez).", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO el Spam y Hackeos.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO Haters, Amenazas y Maltratos.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO Bullying y Mala Fama de la Red.", icon: <ShieldAlert className="text-red-500" /> },
    { text: "PROHIBIDO Robo y todo lo negativo.", icon: <ShieldAlert className="text-red-500" /> }
  ];

  const ALLOWED_RULES = [
    { text: "LIBRE de Copyright: Publica música y videos sin miedo.", icon: <Music className="text-green-500" /> },
    { text: "MONETIZACIÓN LIBRE: Gana dinero sin problemas legales.", icon: <Sparkles className="text-cyan-400" /> },
    { text: "GUSTOS DE LIBERTAD: Expresa tu personalidad al 100%.", icon: <CheckCircle className="text-blue-400" /> }
  ];

  const handleSimulatedPayment = () => {
    setIsPaying(true);
    // Disparar evento para que la IA notifique
    window.dispatchEvent(new CustomEvent('xf_payment_received', { 
      detail: { amount: "MULTA PAGADA", user: "Usuario Expulsado" } 
    }));
    
    setTimeout(() => {
      setIsPaying(false);
      onLogin(); // Devuelve la cuenta automáticamente
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#020205] overflow-hidden font-rajdhani">
      {/* Fondo Animado Estelar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-4xl p-4 md:p-8 animate-fade-in">
        {view === 'AUTH' && (
          <div className="bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-16 shadow-[0_0_100px_rgba(220,38,38,0.15)] flex flex-col md:flex-row gap-16 items-center">
            
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] bg-black mb-4">
                <img src={logo} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic font-futuristic uppercase tracking-tighter leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-pink-500 to-purple-500">BIENVENIDO</span>
                <br />
                <span className="text-white">A LA RED</span>
              </h1>
              <p className="text-white/40 text-lg font-bold italic max-w-sm uppercase tracking-widest">El imperio de la libertad estelar te espera. Únete al multiverso XFLETCHEX.</p>
              
              <div className="flex flex-col gap-4 w-full">
                <button 
                  onClick={() => setView('RULES')}
                  className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 px-8 rounded-2xl text-white/60 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em] italic"
                >
                  <Info size={18} /> LEER LEYES DE LA RED
                </button>
                <button 
                  onClick={() => setView('RECOVERY')}
                  className="flex items-center justify-center gap-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 py-4 px-8 rounded-2xl text-red-500 transition-all font-black text-xs uppercase tracking-[0.2em] italic"
                >
                  <AlertTriangle size={18} /> RECUPERAR CUENTA EXPULSADA
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8">
              <div className="flex gap-4 border-b border-white/5 pb-6">
                <button 
                  onClick={() => setIsRegistering(false)} 
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${!isRegistering ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                  INGRESAR
                </button>
                <button 
                  onClick={() => setIsRegistering(true)} 
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${isRegistering ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                  REGISTRARSE
                </button>
              </div>

              <div className="space-y-4">
                {isRegistering && (
                  <div className="relative">
                    <input type="text" placeholder="NOMBRE COMPLETO" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-red-600 text-white font-bold italic" />
                  </div>
                )}
                <div className="relative">
                  <input type="email" placeholder="CORREO ESTELAR" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-red-600 text-white font-bold italic" />
                  <Mail className="absolute right-6 top-4 text-white/20" size={18} />
                </div>
                <div className="relative">
                  <input type="password" placeholder="CONTRASEÑA CIFRADA" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-red-600 text-white font-bold italic" />
                  <Lock className="absolute right-6 top-4 text-white/20" size={18} />
                </div>
              </div>

              <button 
                onClick={onLogin}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black font-futuristic text-sm tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic"
              >
                {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isRegistering ? 'CREAR CUENTA' : 'ENTRAR AL SISTEMA'}
              </button>

              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-white/5"></div></div>
                <span className="relative bg-[#0a0a0f] px-4 text-[10px] font-black text-white/20 uppercase italic">O CONECTA CON</span>
              </div>

              <button 
                onClick={onLogin}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95"
              >
                <Chrome size={20} />
                <span className="font-black text-xs uppercase tracking-widest italic">CUENTA DE GOOGLE</span>
              </button>
            </div>

          </div>
        )}

        {view === 'RULES' && (
          <div className="bg-[#0a0a0f]/95 backdrop-blur-3xl border border-red-500/20 rounded-[4rem] p-10 md:p-16 shadow-[0_0_150px_rgba(220,38,38,0.25)] relative animate-scale-in">
            <button onClick={() => setView('AUTH')} className="absolute top-8 right-8 text-white/20 hover:text-white p-3 bg-white/5 rounded-full transition-all">
              <X size={32} />
            </button>

            <div className="flex flex-col items-center text-center mb-16">
              <ShieldAlert className="text-red-500 mb-6 animate-pulse" size={60} />
              <h2 className="text-4xl md:text-5xl font-black font-futuristic text-white italic uppercase tracking-tighter">LEYES DE XFLETCHEX RED</h2>
              <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] mt-4 italic">El código de honor para ciudadanos estelares</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-red-500 font-black text-xs uppercase tracking-widest italic flex items-center gap-3">
                  <Flame size={16} /> ACCIONES PROHIBIDAS (EXPULSIÓN)
                </h3>
                <div className="space-y-4">
                  {FORBIDDEN_RULES.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-red-500/5 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {rule.icon}
                      </div>
                      <p className="text-sm font-bold text-white/80 italic">{rule.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-cyan-400 font-black text-xs uppercase tracking-widest italic flex items-center gap-3">
                  <BadgeCheck size={16} /> GARANTÍA DE LIBERTAD (APROBADO)
                </h3>
                <div className="space-y-4">
                  {ALLOWED_RULES.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-cyan-500/5 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {rule.icon}
                      </div>
                      <p className="text-sm font-bold text-white/80 italic">{rule.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-gradient-to-br from-red-600/10 to-purple-600/10 border border-white/10 rounded-[2.5rem] text-center">
                  <p className="text-white font-black italic text-lg leading-relaxed mb-6 uppercase tracking-tighter">
                    "En XFLETCHEX RED eres libre. Sin miedo al copyright, monetiza tu música y videos. Tu gusto es tu ley, mientras respetes a la comunidad."
                  </p>
                  <button 
                    onClick={() => setView('AUTH')}
                    className="bg-white text-black py-4 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest italic hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    ACEPTO LAS LEYES
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'RECOVERY' && (
          <div className="bg-[#0a0a0f]/95 backdrop-blur-3xl border border-red-500/20 rounded-[4rem] p-10 md:p-16 shadow-[0_0_150px_rgba(220,38,38,0.25)] relative animate-scale-in">
            <button onClick={() => setView('AUTH')} className="absolute top-8 right-8 text-white/20 hover:text-white p-3 bg-white/5 rounded-full transition-all">
              <X size={32} />
            </button>

            <div className="flex flex-col items-center text-center mb-12">
               <div className="w-20 h-20 bg-red-600/20 rounded-3xl flex items-center justify-center border border-red-500/30 mb-6">
                  <ShieldAlert className="text-red-500 animate-pulse" size={40} />
               </div>
               <h2 className="text-4xl font-black font-futuristic text-white italic uppercase tracking-tighter">REHABILITACIÓN DE CUENTA</h2>
               <p className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] mt-2 italic">MULTAS POR INCUMPLIMIENTO DE LEYES XF</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                     <h3 className="text-xs font-black text-white/40 uppercase tracking-widest border-b border-white/5 pb-4 italic">TABLA DE PRECIOS MUNDIALES</h3>
                     
                     <div className="flex justify-between items-center group">
                        <span className="text-white/60 font-bold italic">🇦🇷 ARGENTINA</span>
                        <span className="text-red-500 font-black text-xl">$1.000.000 ARS</span>
                     </div>
                     <div className="flex justify-between items-center group">
                        <span className="text-white/60 font-bold italic">🌎 GLOBAL (USD)</span>
                        <span className="text-red-500 font-black text-xl">$1.000 USD</span>
                     </div>
                     <div className="flex justify-between items-center group">
                        <span className="text-white/60 font-bold italic">🇪🇺/🏮 EUROPA & ASIA</span>
                        <span className="text-red-500 font-black text-xl">7.000 EUR/USD</span>
                     </div>
                  </div>

                  <div className="p-6 bg-red-600/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                     <Zap size={24} className="text-red-500 animate-bounce" />
                     <p className="text-[10px] text-white/60 font-black uppercase italic leading-tight">LA IA DETECTA EL PAGO AL INSTANTE Y DEVUELVE LA CUENTA AUTOMÁTICAMENTE.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-3xl p-8 space-y-6">
                     <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest border-b border-white/5 pb-4 italic">DATOS DE TRANSFERENCIA</h3>
                     
                     <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-cyan-500 transition-all cursor-pointer">
                           <p className="text-[8px] text-white/20 font-black uppercase mb-1">ALIAS MERCADO PAGO</p>
                           <p className="text-xl font-black text-white italic tracking-tighter">exequiel.flecha.bx</p>
                           <CreditCard className="text-cyan-500 absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity" size={14}/>
                        </div>
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-blue-500 transition-all cursor-pointer">
                           <p className="text-[8px] text-white/20 font-black uppercase mb-1">USUARIO PAYPAL</p>
                           <p className="text-xl font-black text-white italic tracking-tighter">ExequielFlechaX</p>
                           <Wallet className="text-blue-500 absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity" size={14}/>
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleSimulatedPayment}
                    disabled={isPaying}
                    className={`w-full py-6 rounded-3xl font-black font-futuristic text-sm tracking-[0.4em] uppercase italic transition-all shadow-2xl flex items-center justify-center gap-4 ${isPaying ? 'bg-white/10 text-white/40 cursor-wait' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20 active:scale-95'}`}
                  >
                     {isPaying ? 'PROCESANDO PAGO IA...' : 'CONFIRMAR PAGO REALIZADO'}
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModule;
