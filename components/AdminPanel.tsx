
import React, { useState, useRef, useEffect } from 'react';
import { User, StrikeStatus, Ad } from '../types';
import { 
  Shield, AlertTriangle, UserMinus, CheckCircle, Image as ImageIcon, Sparkles, 
  Trash2, Upload, CreditCard, Wallet, Lock, ShieldAlert, BadgeCheck, Crown, Users, 
  Camera, ExternalLink, ShieldCheck, ChevronUp, ChevronDown, DollarSign, Building,
  Eye, EyeOff, Megaphone, Plus, Trash, Power, Zap, Globe, RefreshCcw, Heart, Edit3,
  Mic, Bot, Volume2, FileAudio, Settings, X, Check, XCircle, Landmark, Receipt,
  Save
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
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
  isMonetizationSystemActive: boolean;
  setIsMonetizationSystemActive: (active: boolean) => void;
  onRestoreAccount: () => void;
  networkName: string;
  setNetworkName: (name: string) => void;
}

interface RehabRequest {
  id: string;
  user: string;
  amount: string;
  method: string;
  time: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  user, 
  setUser, 
  notify, 
  currentLogo, 
  onUpdateLogo, 
  isLogoVisible, 
  onToggleLogo,
  defaultLogo,
  ads,
  setAds,
  isMonetizationSystemActive,
  setIsMonetizationSystemActive,
  onRestoreAccount,
  networkName,
  setNetworkName
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const adImageInputRef = useRef<HTMLInputElement>(null);
  
  const [heirName, setHeirName] = useState(() => localStorage.getItem('xf_heir_name') || "");
  const [isRetired, setIsRetired] = useState(() => localStorage.getItem('xf_is_retired') === 'true');

  const [newAdText, setNewAdText] = useState('');
  const [newAdImage, setNewAdImage] = useState<string | null>(null);
  const [tempNetworkName, setTempNetworkName] = useState(networkName);

  // Estados para Alias de Pago (Lo que pediste devolver)
  const [tempMPAlias, setTempMPAlias] = useState(user.mpAlias || '');
  const [tempPPAlias, setTempPPAlias] = useState(user.ppAlias || '');

  const [pendingRehabs, setPendingRehabs] = useState<RehabRequest[]>([]);

  // Estados para edición de publicidad (SOLICITADO)
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('xf_heir_name', heirName);
    localStorage.setItem('xf_is_retired', String(isRetired));
  }, [heirName, isRetired]);

  useEffect(() => {
    const handleNewPayment = (e: any) => {
      const newReq: RehabRequest = {
        id: Date.now().toString(),
        user: e.detail.user,
        amount: e.detail.amount,
        method: e.detail.method,
        time: new Date().toLocaleTimeString()
      };
      setPendingRehabs(prev => [newReq, ...prev]);
      notify("¡ALERTA DE PAGO! NUEVA SOLICITUD DE REHABILITACIÓN.");
    };
    window.addEventListener('xf_payment_pending', handleNewPayment);
    return () => window.removeEventListener('xf_payment_pending', handleNewPayment);
  }, [notify]);

  const handleApproveRehab = (id: string) => {
    setPendingRehabs(prev => prev.filter(r => r.id !== id));
    localStorage.setItem('xf_rehab_status', 'APPROVED');
    notify("CUENTA REHABILITADA CON ÉXITO. EL USUARIO YA PUEDE ENTRAR.");
    setTimeout(() => localStorage.removeItem('xf_rehab_status'), 3000);
  };

  const handleRejectRehab = (id: string) => {
    setPendingRehabs(prev => prev.filter(r => r.id !== id));
    localStorage.setItem('xf_rehab_status', 'REJECTED');
    notify("SOLICITUD RECHAZADA. ACCESO DENEGADO AL USUARIO.");
    setTimeout(() => localStorage.removeItem('xf_rehab_status'), 3000);
  };

  const handleUpdatePaymentAliases = () => {
    setUser({ ...user, mpAlias: tempMPAlias, ppAlias: tempPPAlias });
    notify("¡ALIAS DE PAGO ACTUALIZADOS PARA TODA LA RED!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo(reader.result as string);
        notify("¡LOGOTIPO XFLETCHAX ACTUALIZADO!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, iaVoiceUrl: reader.result as string });
        notify("¡NUEVA VOZ DE PERSONAJE IA INTEGRADA CON ÉXITO!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAd = () => {
    if (!newAdImage || !newAdText.trim()) {
      notify("ERROR: SE REQUIERE FOTO Y TEXTO PARA LA PUBLICIDAD.");
      return;
    }
    const newAd: Ad = { id: `ad-${Date.now()}`, imageUrl: newAdImage, text: newAdText };
    setAds([newAd, ...ads]);
    setNewAdText('');
    setNewAdImage(null);
    notify("¡PUBLICIDAD LANZADA Y GUARDADA AUTOMÁTICAMENTE!");
  };

  const deleteAd = (id: string) => {
    setAds(ads.filter(a => a.id !== id));
    notify("PUBLICIDAD ELIMINADA.");
  };

  // FUNCIÓN PARA EDITAR TEXTO (SOLICITADO)
  const startEditAd = (ad: Ad) => {
    setEditingAdId(ad.id);
    setEditText(ad.text);
  };

  const saveEditAd = () => {
    if (!editingAdId || !editText.trim()) return;
    setAds(ads.map(a => a.id === editingAdId ? { ...a, text: editText } : a));
    setEditingAdId(null);
    setEditText('');
    notify("¡TEXTO DE PUBLICIDAD ACTUALIZADO Y GUARDADO!");
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

  const handleUpdateNetworkName = () => {
    if (!tempNetworkName.trim()) {
      notify("ERROR: EL NOMBRE DE LA RED NO PUEDE ESTAR VACÍO.");
      return;
    }
    setNetworkName(tempNetworkName);
    notify(`¡NOMBRE DE LA RED ACTUALIZADO A: ${tempNetworkName.toUpperCase()}!`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-40 space-y-12 animate-fade-in font-rajdhani">
      
      {/* SECCIÓN: SOLICITUDES DE REHABILITACIÓN MANUALES */}
      <div className="bg-[#05050a] border-2 border-yellow-500/30 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(234,179,8,0.1)] space-y-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5"><RefreshCcw size={200} className="text-yellow-500" /></div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
               <CreditCard size={32} className="text-yellow-500" />
            </div>
            <div>
               <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter leading-none">SOLICITUDES DE REHABILITACIÓN</h3>
               <p className="text-yellow-500/50 text-[10px] font-black tracking-widest uppercase italic mt-2">Valida los pagos de Mercado Pago / PayPal manualmente</p>
            </div>
         </div>

         <div className="space-y-4 relative z-10">
            {pendingRehabs.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-white/5 rounded-3xl">
                 <CheckCircle className="text-white/10 mx-auto mb-4" size={48} />
                 <p className="text-xs font-black text-white/20 uppercase tracking-widest italic">No hay pagos pendientes de revisión</p>
              </div>
            ) : (
              pendingRehabs.map(req => (
                <div key={req.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up group/item hover:border-yellow-500/40 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-black rounded-2xl border-2 border-red-600 flex items-center justify-center text-red-500 shadow-xl">
                         <UserMinus size={28} />
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">{req.user}</h4>
                         <p className="text-[10px] text-white/40 font-bold uppercase">{req.time} • {req.method}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <p className="text-2xl font-black text-green-500 font-futuristic italic">{req.amount}</p>
                         <p className="text-[8px] text-white/20 font-black uppercase tracking-widest italic">MONTO REPORTADO</p>
                      </div>
                      <div className="flex gap-2">
                         <button 
                            onClick={() => handleApproveRehab(req.id)}
                            className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl shadow-xl transition-all active:scale-90 group/btnOk flex items-center gap-2"
                         >
                            <Check size={20} /> <span className="text-[10px] font-black uppercase italic tracking-widest pr-2 hidden group-hover/item:inline">ACEPTAR</span>
                         </button>
                         <button 
                            onClick={() => handleRejectRehab(req.id)}
                            className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-2xl shadow-xl transition-all active:scale-90 group/btnNo flex items-center gap-2"
                         >
                            <X size={20} /> <span className="text-[10px] font-black uppercase italic tracking-widest pr-2 hidden group-hover/item:inline">RECHAZAR</span>
                         </button>
                      </div>
                   </div>
                </div>
              ))
            )}
         </div>
      </div>

      {/* SECCIÓN RESTAURADA: CONFIGURACIÓN DE ALIAS DE PAGO (SOLICITADO) */}
      <div className="bg-[#05050a] border-2 border-green-600/30 p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5"><Receipt size={200} className="text-green-500" /></div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
               <Wallet size={32} className="text-green-500" />
            </div>
            <div>
               <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter leading-none">CONFIGURACIÓN DE PAGOS MAESTROS</h3>
               <p className="text-green-500/50 text-[10px] font-black tracking-widest uppercase italic mt-2">Edita tus métodos de cobro para rehabilitación y monetización</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-4 italic">ALIAS MERCADO PAGO ACTUAL</p>
               <input 
                 type="text" 
                 value={tempMPAlias} 
                 onChange={(e) => setTempMPAlias(e.target.value)} 
                 placeholder="Ej: exequiel.flecha.bx" 
                 className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-xl text-white font-black italic outline-none focus:border-cyan-500" 
               />
            </div>
            <div className="space-y-4">
               <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-4 italic">USUARIO PAYPAL GLOBAL</p>
               <input 
                 type="text" 
                 value={tempPPAlias} 
                 onChange={(e) => setTempPPAlias(e.target.value)} 
                 placeholder="Ej: ExequielFlechaX" 
                 className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-xl text-white font-black italic outline-none focus:border-blue-500" 
               />
            </div>
         </div>

         <button 
           onClick={handleUpdatePaymentAliases}
           className="w-full py-6 bg-green-600 hover:bg-green-500 text-white font-black rounded-3xl text-sm uppercase italic tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 relative z-10"
         >
            <CheckCircle size={20} /> ACTIVAR Y GUARDAR ALIAS DE PAGO
         </button>
      </div>

      <div className="bg-[#05050a] border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-10">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
               <Settings size={32} className="text-white" />
            </div>
            <div>
               <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter leading-none">GESTIÓN DE IDENTIDAD Y LOGOTIPO</h3>
               <p className="text-white/30 text-[10px] font-black tracking-widest uppercase italic mt-2">Configura la marca maestra de XFLETCHAX RED</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col items-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/5 group">
               <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-red-600 shadow-2xl bg-black">
                  <img src={currentLogo} className="w-full h-full object-cover" alt="Logo Actual" />
                  <button 
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Camera size={32} />
                  </button>
               </div>
               <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
               <div className="flex gap-3">
                  <button onClick={() => logoInputRef.current?.click()} className="px-6 py-2 bg-red-600 text-white font-black text-[10px] rounded-xl uppercase tracking-widest italic shadow-xl">CAMBIAR LOGO</button>
                  <button onClick={onToggleLogo} className={`px-6 py-2 border font-black text-[10px] rounded-xl uppercase tracking-widest italic transition-all ${isLogoVisible ? 'bg-white/5 border-white/20 text-white' : 'bg-red-600/20 border-red-500 text-red-500'}`}>
                    {isLogoVisible ? 'OCULTAR LOGO' : 'MOSTRAR LOGO'}
                  </button>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2 italic">NOMBRE DINÁMICO DE LA RED</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={tempNetworkName} 
                      onChange={(e) => setTempNetworkName(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-xl text-white font-black italic uppercase outline-none focus:border-red-600" 
                    />
                    <button onClick={handleUpdateNetworkName} className="absolute right-3 top-3 p-3 bg-red-600 text-white rounded-xl shadow-lg active:scale-90 transition-transform">
                      <Zap size={20} />
                    </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-gradient-to-br from-[#05050a] to-[#100a05] border-2 border-orange-600/20 p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5"><Crown size={200} className="text-orange-500" /></div>
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
               <Landmark size={32} className="text-orange-500" />
            </div>
            <div>
               <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter">SISTEMA DE JUBILACIÓN Y LEGADO</h3>
               <p className="text-orange-400/50 text-[10px] font-black tracking-widest uppercase italic mt-1">Transfiere tu poder divino a un heredero</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 italic">NOMBRE DEL HEREDERO (XF-ACCOUNT)</p>
               <input 
                 type="text" 
                 value={heirName} 
                 onChange={(e) => setHeirName(e.target.value)} 
                 placeholder="Ej: Exequiel Flecha Jr." 
                 className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-xl text-white font-black italic uppercase outline-none focus:border-orange-500" 
               />
            </div>
            <div className="flex flex-col justify-center">
               <button 
                 onClick={toggleRetirement}
                 className={`w-full py-6 rounded-2xl font-black font-futuristic text-sm tracking-widest uppercase italic transition-all shadow-2xl flex items-center justify-center gap-4 ${isRetired ? 'bg-white text-black' : 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-900/40'}`}
               >
                  {isRetired ? <ShieldCheck size={20}/> : <Power size={20}/>}
                  {isRetired ? 'ELIMINAR JUBILACIÓN' : 'ACTIVAR JUBILACIÓN DIOS'}
               </button>
            </div>
         </div>
      </div>

      <div className="bg-[#05050a] border-2 border-red-600/20 p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5"><Bot size={200} className="text-red-500" /></div>
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30">
               <Mic size={32} className="text-red-500" />
            </div>
            <div>
               <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter">AGREGAR VOZ DE PERSONAJES IA</h3>
               <p className="text-red-400/50 text-[10px] font-black tracking-widest uppercase italic mt-1">Configura los audios maestros para Exequiela Flecha Baez</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
               onClick={() => voiceInputRef.current?.click()}
               className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-all group/voice"
            >
               {user.iaVoiceUrl ? (
                 <>
                   <Volume2 size={48} className="text-green-500 animate-pulse mb-4" />
                   <p className="text-xs font-black text-white uppercase italic text-center">ARCHIVO DE VOZ CARGADO</p>
                 </>
               ) : (
                 <>
                   <FileAudio size={48} className="text-white/20 group-hover/voice:text-red-500 mb-4 transition-colors" />
                   <p className="text-sm font-black text-white uppercase italic">SUBIR ARCHIVO DE AUDIO</p>
                 </>
               )}
               <input type="file" ref={voiceInputRef} onChange={handleVoiceUpload} className="hidden" accept="audio/*" />
            </div>
            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
               <button 
                 onClick={() => { setUser({...user, assistantEnabled: !user.assistantEnabled}); notify(user.assistantEnabled ? "EXEQUIELA EN MODO SUSPENSIÓN." : "EXEQUIELA DESPERTANDO..."); }}
                 className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest shadow-xl transition-all ${user.assistantEnabled ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
               >
                  {user.assistantEnabled ? 'DESACTIVAR ASISTENTE' : 'ACTIVAR ASISTENTE'}
               </button>
            </div>
         </div>
      </div>

      <div className="bg-[#050a05] border-2 border-green-500/20 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
         <div className="relative z-10">
            <div className="flex items-center gap-6 mb-10">
               <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                  <Power size={32} className="text-green-500" />
               </div>
               <div>
                  <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter">CENTRO DE CONTROL: MONETIZACIÓN MUNDIAL</h3>
                  <p className="text-green-400/50 text-[10px] font-black tracking-widest uppercase italic mt-1">Activa o Desactiva el flujo de riqueza para Influencers</p>
               </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
               <button onClick={() => setIsMonetizationSystemActive(true)} className={`flex-1 py-6 rounded-[2rem] font-black font-futuristic text-lg italic tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-4 ${isMonetizationSystemActive ? 'bg-green-600/10 text-green-500/30 cursor-not-allowed border border-green-500/10' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/40'}`}>
                 <Zap size={20} /> ACTIVAR MONETIZACIÓN
               </button>
               <button onClick={() => setIsMonetizationSystemActive(false)} className={`flex-1 py-6 rounded-[2rem] font-black font-futuristic text-lg italic tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-4 ${!isMonetizationSystemActive ? 'bg-red-600/10 text-red-500/30 cursor-not-allowed border border-red-500/10' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'}`}>
                 <Power size={20} /> DESACTIVAR SISTEMA
               </button>
            </div>
         </div>
      </div>

      <div className="bg-[#08080c] border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <Megaphone size={32} className="text-red-500" />
           </div>
           <div>
              <h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter">GESTIÓN DE PUBLICIDAD</h3>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div onClick={() => adImageInputRef.current?.click()} className="aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-all overflow-hidden relative">
                 {newAdImage ? <img src={newAdImage} className="w-full h-full object-cover" /> : <><Upload size={40} className="text-white/10 mb-2"/><p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Cargar Foto Empresa</p></>}
                 <input type="file" ref={adImageInputRef} onChange={handleAdImageUpload} className="hidden" accept="image/*" />
              </div>
              <textarea value={newAdText} onChange={(e) => setNewAdText(e.target.value)} placeholder="Texto del anuncio..." className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-5 text-white font-bold outline-none focus:ring-1 focus:ring-red-600 italic h-20 resize-none" />
              <button onClick={addAd} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"><Plus size={16}/> LANZAR PUBLICIDAD</button>
           </div>
           
           <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
              {ads.length === 0 ? <p className="text-xs text-white/10 italic text-center py-10">Sin anuncios activos.</p> : ads.map(ad => (
                <div key={ad.id} className={`bg-white/5 border rounded-2xl p-3 flex gap-3 group transition-all ${editingAdId === ad.id ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-white/10'}`}>
                  <img src={ad.imageUrl} className="w-20 h-14 rounded-lg object-cover bg-black flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingAdId === ad.id ? (
                      <div className="space-y-2">
                        <textarea 
                          value={editText} 
                          onChange={(e) => setEditText(e.target.value)} 
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[9px] text-white font-bold italic outline-none focus:border-yellow-500 h-12 resize-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={saveEditAd} className="flex-1 py-1 bg-yellow-600 text-white font-black text-[7px] rounded-md uppercase italic tracking-widest flex items-center justify-center gap-1 hover:bg-yellow-500"><Save size={8}/> Guardar</button>
                          <button onClick={() => setEditingAdId(null)} className="flex-1 py-1 bg-white/5 text-white/40 font-black text-[7px] rounded-md uppercase italic tracking-widest hover:text-white"><X size={8}/> Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] font-bold text-white italic truncate">{ad.text}</p>
                        <div className="mt-2 flex gap-3">
                          <button onClick={() => startEditAd(ad)} className="text-[8px] font-black text-cyan-400 uppercase flex items-center gap-1 hover:text-white transition-colors"><Edit3 size={10}/> Editar Texto</button>
                          <button onClick={() => deleteAd(ad.id)} className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1 hover:text-white transition-colors"><Trash size={10}/> Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
