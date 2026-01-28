
import React, { useState, useRef, useEffect } from 'react';
import { User, StrikeStatus } from '../types';
import { 
  Shield, AlertTriangle, UserMinus, CheckCircle, Image as ImageIcon, Sparkles, 
  Trash2, Upload, CreditCard, Wallet, Lock, ShieldAlert, BadgeCheck, Crown, Users, 
  Camera, ExternalLink, ShieldCheck, ChevronUp, ChevronDown, DollarSign, Building,
  Eye, EyeOff
} from 'lucide-react';

interface AdminPanelProps {
  user: User;
  setUser: (u: User) => void;
  notify: (msg: string) => void;
  currentLogo: string;
  onUpdateLogo: (url: string) => void;
  isLogoVisible: boolean;
  onToggleLogo: () => void;
  defaultLogo: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  user, 
  setUser, 
  notify, 
  currentLogo, 
  onUpdateLogo, 
  isLogoVisible, 
  onToggleLogo,
  defaultLogo
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  const [heirName, setHeirName] = useState(() => localStorage.getItem('xf_heir_name') || "");
  const [isRetired, setIsRetired] = useState(() => localStorage.getItem('xf_is_retired') === 'true');

  useEffect(() => {
    localStorage.setItem('xf_heir_name', heirName);
    localStorage.setItem('xf_is_retired', String(isRetired));
  }, [heirName, isRetired]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo(reader.result as string);
        notify("¡LOGOTIPO XFLETCHEX ACTUALIZADO!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePic: reader.result as string });
        notify("¡FOTO DIAMANTE ACTUALIZADA!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, bannerPic: reader.result as string });
        notify("¡PORTADA ACTUALIZADA!");
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustStat = (field: 'followersCount' | 'followingCount' | 'viewsCount', amount: number) => {
    setUser({ ...user, [field]: Math.max(0, user[field] + amount) });
  };

  const toggleRetirement = () => {
    if (!heirName && !isRetired) {
      notify("ERROR: DEBES DESIGNAR UN HEREDERO ANTES DE JUBILARTE.");
      return;
    }
    const nextState = !isRetired;
    setIsRetired(nextState);
    notify(nextState ? "MODO JUBILACIÓN ACTIVADO. EL LEGADO PASA AL HEREDERO." : "EL CREADOR DIOS RETOMA EL CONTROL.");
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-12 animate-fade-in font-rajdhani">
      
      {/* PERSONALIZACIÓN DE PERFIL: BANNER, DIAMANTE Y STRIKES */}
      <div className="bg-black/60 border-2 border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative">
        <div className="h-64 md:h-80 w-full relative bg-black group">
           <img src={user.bannerPic} className="w-full h-full object-cover opacity-60" alt="Banner" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
           <button 
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
           >
             <Camera size={32} />
           </button>
           <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} className="hidden" />
        </div>

        <div className="px-12 pb-12 -mt-24 relative z-10 flex flex-col md:flex-row items-end gap-10">
            <div className="relative group">
              <div className="w-48 h-48 bg-black diamond-clip border-4 border-red-600 p-1 shadow-[0_0_50px_rgba(220,38,38,0.5)] overflow-hidden">
                 <img src={user.profilePic} className="w-full h-full object-cover diamond-clip" alt="Avatar" />
              </div>
              <button onClick={() => profilePicInputRef.current?.click()} className="absolute bottom-0 right-0 bg-red-600 text-white p-4 rounded-full border-4 border-black hover:scale-110 transition-transform"><Camera size={24}/></button>
              <input type="file" ref={profilePicInputRef} onChange={handleProfilePicUpload} className="hidden" />
            </div>

            <div className="flex-1 flex flex-col md:flex-row justify-between items-end gap-6 w-full">
               <div className="text-center md:text-left">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">IDENTIDAD DIOS</span>
                  <div className="flex items-center gap-4 mb-4">
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})} 
                      className="bg-transparent border-b border-white/10 text-3xl font-black text-white italic uppercase outline-none focus:border-red-600 transition-all w-full md:w-auto" 
                    />
                    {user.isVerified && <BadgeCheck className="text-cyan-400" size={32} />}
                  </div>
                  
                  {/* SEMÁFORO DE STRIKES (MOTOR DE PODER) */}
                  <div className="flex items-center gap-6 p-4 bg-black/40 rounded-3xl border border-white/5">
                     <div className="flex flex-col items-center gap-1">
                        <div className={`w-4 h-4 rounded-full ${user.strike === StrikeStatus.CLEAN ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-white/5'}`}></div>
                        <span className="text-[7px] font-black text-white/40 uppercase">LIMPIO</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className={`w-4 h-4 rounded-full ${user.strike === StrikeStatus.WARNING ? 'bg-yellow-500 shadow-[0_0_15px_#eab308]' : 'bg-white/5'}`}></div>
                        <span className="text-[7px] font-black text-white/40 uppercase">AVISO</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <div className={`w-4 h-4 rounded-full ${user.strike === StrikeStatus.BANNED ? 'bg-red-600 shadow-[0_0_15px_#dc2626]' : 'bg-white/5'}`}></div>
                        <span className="text-[7px] font-black text-white/40 uppercase">FUERA</span>
                     </div>
                     <select 
                        value={user.strike} 
                        onChange={(e) => setUser({...user, strike: e.target.value as StrikeStatus})}
                        className="bg-white/5 border border-white/10 rounded-xl text-[8px] font-black text-white px-2 py-1 outline-none uppercase"
                     >
                        <option value={StrikeStatus.CLEAN}>Set Green</option>
                        <option value={StrikeStatus.WARNING}>Set Yellow</option>
                        <option value={StrikeStatus.BANNED}>Set Red</option>
                     </select>
                  </div>
               </div>

               {/* CONTADORES SUMA Y RESTA */}
               <div className="grid grid-cols-3 gap-6 bg-black p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                  <div className="text-center">
                     <button onClick={() => adjustStat('followersCount', 1000)} className="text-white/20 hover:text-green-500 transition-colors"><ChevronUp size={16}/></button>
                     <p className="text-2xl font-black text-white italic">{user.followersCount.toLocaleString()}</p>
                     <button onClick={() => adjustStat('followersCount', -1000)} className="text-white/20 hover:text-red-500 transition-colors"><ChevronDown size={16}/></button>
                     <p className="text-[8px] text-white/30 font-black uppercase">FANS</p>
                  </div>
                  <div className="text-center">
                     <button onClick={() => adjustStat('followingCount', 10)} className="text-white/20 hover:text-green-500 transition-colors"><ChevronUp size={16}/></button>
                     <p className="text-2xl font-black text-white italic">{user.followingCount.toLocaleString()}</p>
                     <button onClick={() => adjustStat('followingCount', -10)} className="text-white/20 hover:text-red-500 transition-colors"><ChevronDown size={16}/></button>
                     <p className="text-[8px] text-white/30 font-black uppercase">SEGUIDOS</p>
                  </div>
                  <div className="text-center">
                     <button onClick={() => adjustStat('viewsCount', 500)} className="text-white/20 hover:text-green-500 transition-colors"><ChevronUp size={16}/></button>
                     <p className="text-2xl font-black text-white italic">{user.viewsCount.toLocaleString()}</p>
                     <button onClick={() => adjustStat('viewsCount', -500)} className="text-white/20 hover:text-red-500 transition-colors"><ChevronDown size={16}/></button>
                     <p className="text-[8px] text-white/30 font-black uppercase">VISTAS</p>
                  </div>
               </div>
            </div>
        </div>
      </div>

      {/* CONFIGURACIÓN DEL LOGO DE LA RED SOCIAL */}
      <div className="bg-[#05050a] border-2 border-red-600/20 p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-3xl bg-black border-2 border-red-600 p-2 overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.4)]">
               <img src={currentLogo} className="w-full h-full object-cover" alt="Logo" />
            </div>
            <div>
               <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter">LOGOTIPO DE LA RED</h3>
               <p className="text-white/30 text-[10px] font-black tracking-widest uppercase italic mt-1">Este logo aparecerá en todo el mundo XFLETCHEX RED</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button 
               onClick={() => logoInputRef.current?.click()}
               className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase italic tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl"
            >
               CAMBIAR LOGO
            </button>
            <button 
               onClick={onToggleLogo}
               className={`p-4 rounded-2xl border transition-all ${isLogoVisible ? 'bg-green-600/20 text-green-500 border-green-500/40' : 'bg-red-600/20 text-red-500 border-red-500/40'}`}
            >
               {isLogoVisible ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
         </div>
      </div>

      {/* CENTRO DE MONETIZACIÓN BANCARIA MUNDIAL ($) */}
      <div className="bg-gradient-to-br from-[#05050a] to-[#0a0a0f] border-2 border-green-500/20 p-12 rounded-[4rem] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5"><DollarSign size={200} className="text-green-500" /></div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-14 h-14 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                  <DollarSign size={32} className="text-green-500" />
               </div>
               <div>
                  <h3 className="font-black text-2xl font-futuristic uppercase italic text-white tracking-tighter">MONETIZACIÓN Y PAGOS ($)</h3>
                  <p className="text-green-500/50 text-[10px] font-black tracking-widest uppercase italic">Ingresos reales para Influencers y Empresarios</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
               <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5">
                  <p className="text-[10px] text-white/30 font-black uppercase mb-2">SALDO DIOS</p>
                  <p className="text-4xl font-black text-white italic">${user.balance.toLocaleString()} USD</p>
                  <div className={`mt-4 text-[9px] font-bold ${user.isMonetized ? 'text-green-500' : 'text-red-500'} uppercase`}>
                     {user.isMonetized ? 'MONETIZACIÓN ACTIVA' : 'PENDIENTE (1K FANS + 100 VISTAS)'}
                  </div>
               </div>
               
               <div className="md:col-span-2 bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-4">
                  <p className="text-[10px] text-white/30 font-black uppercase flex items-center gap-2"><Building size={12}/> VINCULAR BANCO MUNDIAL (TODOS LOS PAÍSES)</p>
                  <input 
                    type="text" 
                    value={user.bankAccount}
                    onChange={(e) => setUser({...user, bankAccount: e.target.value})}
                    placeholder="Número de cuenta, CBU, CVU, IBAN o SWIFT..."
                    className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:ring-1 focus:ring-green-500 font-bold"
                  />
                  <p className="text-[8px] text-white/20 italic uppercase tracking-widest">Compatible con ARS, USD, EUR, MXN, etc. Pagos sin estafas.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-black/40 p-6 rounded-3xl border border-cyan-500/20">
                  <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-3 italic">ALIAS MERCADO PAGO</p>
                  <input type="text" value={user.mpAlias} onChange={(e) => setUser({...user, mpAlias: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-4 px-5 text-white text-xs outline-none focus:border-cyan-500" />
               </div>
               <div className="bg-black/40 p-6 rounded-3xl border border-blue-600/20">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3 italic">USUARIO PAYPAL</p>
                  <input type="text" value={user.ppAlias} onChange={(e) => setUser({...user, ppAlias: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-4 px-5 text-white text-xs outline-none focus:border-blue-600" />
               </div>
            </div>
         </div>
      </div>

      {/* HERENCIA Y JUBILACIÓN REAL */}
      <div className="bg-gradient-to-r from-[#1a1a10] to-black border-2 border-yellow-600/30 p-12 rounded-[4rem] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5"><ShieldAlert size={200} className="text-yellow-500" /></div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-14 h-14 bg-yellow-600/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                  <Crown size={32} className="text-yellow-500" />
               </div>
               <div>
                  <h3 className="font-black text-2xl font-futuristic uppercase italic text-white tracking-tighter">LEGADO Y HERENCIA FAMILIAR</h3>
                  <p className="text-yellow-500/50 text-[10px] font-black tracking-widest uppercase italic">Para que tu imperio XF siga vivo cuando seas viejo</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-2">
                     <Users size={12}/> NOMBRE DEL HEREDERO DE CONFIANZA
                  </p>
                  <input 
                    type="text" 
                    value={heirName}
                    onChange={(e) => setHeirName(e.target.value)}
                    placeholder="Ej: Hijo, Hermano o Socio de Honor..."
                    className="w-full bg-black/60 border border-yellow-500/20 rounded-2xl py-5 px-8 text-white text-lg font-bold outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
                  />
                  <p className="text-[9px] text-white/20 italic font-medium uppercase">El heredero recibirá el control total y los cobros de la red.</p>
               </div>

               <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                     <p className="text-[10px] font-black text-white uppercase tracking-widest italic">MODO JUBILACIÓN</p>
                     <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${isRetired ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white'}`}>
                        {isRetired ? 'HERENCIA ACTIVA' : 'POWER ON'}
                     </div>
                  </div>
                  <button 
                    onClick={toggleRetirement}
                    className={`w-full py-5 rounded-2xl font-black text-xs tracking-widest uppercase italic transition-all shadow-xl ${isRetired ? 'bg-white text-black' : 'bg-yellow-600 text-white shadow-yellow-900/40 hover:scale-105'}`}
                  >
                     {isRetired ? 'RETOMAR PODER DIOS' : 'ACTIVAR JUBILACIÓN'}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
