
import React, { useState } from 'react';
import { Heart, X, Flower2, ShieldAlert, Lock, MessageCircle, Star, Sparkles, UserCheck, Flame, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { User } from '../types';

const PROFILES = [
  { id: 1, name: 'Scarlett', age: 24, bio: 'Buscando el lujo y aventuras estelares. 💎✨', img: 'https://picsum.photos/seed/d1/600/900', likes: 1240, superLikes: 152 },
  { id: 2, name: 'Vesper', age: 22, bio: 'Amo el arte, la moda y los viajes espaciales. 🌎🚀', img: 'https://picsum.photos/seed/d2/600/900', likes: 2300, superLikes: 420 },
  { id: 3, name: 'Luna', age: 26, bio: 'Influencer oficial de XFLETCHEX RED. 🇦🇷🔥', img: 'https://picsum.photos/seed/d3/600/900', likes: 5600, superLikes: 890 },
];

const DatingModule: React.FC<{ user: User }> = ({ user }) => {
  const [index, setIndex] = useState(0);
  const [profiles, setProfiles] = useState(PROFILES);
  const [chatCount, setChatCount] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  
  const current = profiles[index];

  const handleLike = (id: number) => {
    setSwipeDir('right');
    setTimeout(() => {
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      setSwipeDir(null);
      next();
    }, 500);
  };

  const handleReject = () => {
    setSwipeDir('left');
    setTimeout(() => {
      setSwipeDir(null);
      next();
    }, 500);
  };

  const handleSuperLikeMatch = (id: number) => {
    // EL RAMO DE FLORES DISPARA EL MATCH "NOVIOS"
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, superLikes: p.superLikes + 1 } : p));
    setIsMatch(true);
    setChatCount(prev => prev + 1);
  };

  const next = () => {
    setIndex((index + 1) % profiles.length);
  };

  const closeMatch = () => {
    setIsMatch(false);
    next();
  };

  if (user.age < 20) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center animate-fade-in font-rajdhani">
        <div className="bg-black/40 backdrop-blur-3xl border-2 border-red-500/30 rounded-[4rem] p-16 shadow-[0_0_100px_rgba(220,38,38,0.2)]">
           <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/20">
              <Lock size={48} className="text-red-500" />
           </div>
           <h2 className="text-4xl font-black font-futuristic text-red-500 mb-6 italic uppercase tracking-tighter leading-none">ACCESO DENEGADO</h2>
           <p className="text-white/40 text-lg font-bold uppercase tracking-widest">Este módulo Sugar Daddy es exclusivo para mayores de 20 años.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 font-rajdhani relative min-h-[80vh] flex flex-col justify-center">
      
      {/* PANTALLA DE MATCH "NOVIOS" */}
      {isMatch && (
        <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 animate-fade-in">
           <div className="relative mb-12">
              <Sparkles className="absolute -top-10 -left-10 text-yellow-400 animate-spin-slow" size={60} />
              <div className="flex gap-4 relative z-10">
                 <div className="w-32 h-32 rounded-full border-4 border-red-600 p-1 bg-black shadow-2xl overflow-hidden scale-110">
                    <img src={user.profilePic} className="w-full h-full object-cover rounded-full" />
                 </div>
                 <div className="w-32 h-32 rounded-full border-4 border-pink-500 p-1 bg-black shadow-2xl overflow-hidden scale-110">
                    <img src={current.img} className="w-full h-full object-cover rounded-full" />
                 </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-red-600 p-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)] animate-bounce">
                 <Heart size={32} fill="currentColor" />
              </div>
           </div>

           <h2 className="text-6xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-none mb-4 animate-pulse">¡HAY MATCH!</h2>
           <div className="bg-gradient-to-r from-red-600 to-pink-500 px-10 py-3 rounded-full text-white font-black text-2xl uppercase tracking-[0.2em] italic shadow-2xl mb-12 border-2 border-white/20">
              SOIS NOVIOS XF
           </div>

           <p className="text-white/60 text-xl font-bold italic mb-12 max-w-sm">Ahora {current.name} y tú son pareja oficial en la red DIOS. ¡Escríbele ahora!</p>

           <div className="flex flex-col gap-4 w-full max-w-sm">
              <button className="bg-white text-black py-6 rounded-3xl font-black font-futuristic text-sm tracking-widest uppercase italic shadow-2xl active:scale-95 flex items-center justify-center gap-4 transition-all hover:bg-cyan-400 hover:text-white">
                 <MessageCircle size={24}/> EMPEZAR CHAT PRIVADO
              </button>
              <button onClick={closeMatch} className="bg-white/5 border border-white/10 text-white/40 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all">
                 SEGUIR BUSCANDO
              </button>
           </div>
        </div>
      )}

      {/* TARJETA DE PERFIL CON DESLIZAMIENTO */}
      <div className={`bg-black/40 border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative transition-all duration-500 transform ${
        swipeDir === 'left' ? '-translate-x-[150%] -rotate-12 opacity-0' : 
        swipeDir === 'right' ? 'translate-x-[150%] rotate-12 opacity-0' : ''
      }`}>
        <div className="aspect-[3/4.5] relative">
          <img src={current.img} className="w-full h-full object-cover" />
          
          {/* HUD DE STATUS */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
             <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black text-white flex items-center gap-2">
                <Flame size={14} className="text-orange-500 animate-pulse"/> CALIENTE
             </div>
             <div className="flex gap-2">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-white flex items-center gap-1">
                   <Heart size={10} className="text-red-500" fill="currentColor"/> {current.likes.toLocaleString()}
                </div>
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-white flex items-center gap-1">
                   <Star size={10} className="text-yellow-400" fill="currentColor"/> {current.superLikes.toLocaleString()}
                </div>
             </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

          <div className="absolute bottom-10 left-10 right-10">
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-5xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-none">{current.name}, {current.age}</h2>
               <div className="bg-cyan-400 text-black p-1 rounded-full"><CheckCircle size={16}/></div>
            </div>
            <p className="text-white/80 text-xl font-bold italic drop-shadow-lg">"{current.bio}"</p>
          </div>

          {/* INDICADORES DE SWIPE VISUALES */}
          {swipeDir === 'right' && <div className="absolute inset-0 border-[20px] border-green-500 flex items-center justify-center bg-green-500/20"><Heart size={150} className="text-green-500" fill="currentColor" /></div>}
          {swipeDir === 'left' && <div className="absolute inset-0 border-[20px] border-red-500 flex items-center justify-center bg-red-500/20"><X size={150} className="text-red-500" /></div>}
        </div>

        {/* CONTROLES TÁCTICOS PC Y MÓVIL */}
        <div className="p-10 flex justify-between items-center bg-black/80 backdrop-blur-3xl border-t border-white/10">
          <button 
            onClick={handleReject} 
            className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-red-600/20 hover:border-red-500/40 hover:scale-110 transition-all active:scale-90 text-red-500 group shadow-xl"
            title="Rechazar (PC: X)"
          >
             <X size={40} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleSuperLikeMatch(current.id)} 
            className="w-24 h-24 bg-gradient-to-tr from-purple-600 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)] animate-pulse hover:scale-110 active:scale-95 transition-all border-4 border-white/20 group"
            title="Súper Like: MATCH NOVIOS"
          >
            <Flower2 size={48} className="text-white group-hover:rotate-12 transition-transform" />
          </button>

          <button 
            onClick={() => handleLike(current.id)} 
            className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-green-600/20 hover:border-green-500/40 hover:scale-110 transition-all active:scale-90 text-green-500 group shadow-xl"
            title="Like: Me gusta (PC: Corazón)"
          >
            <Heart size={40} className="group-hover:scale-125 transition-transform" fill="currentColor" />
          </button>
        </div>
      </div>
      
      {/* HUD DE CHATS DE PAREJAS */}
      <div className="mt-12 p-8 bg-[#05050a] rounded-[3rem] border border-white/10 flex items-center justify-between shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
               <UserCheck size={32} className="text-white"/>
            </div>
            <div>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1 italic">Mis Parejas (Novios)</p>
               <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{chatCount} NOVIAS XF</p>
            </div>
         </div>
         <button className="bg-white text-black px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl active:scale-95 transition-all hover:bg-red-600 hover:text-white relative z-10">
            ENTRAR CHATS
         </button>
      </div>

      {/* MOBILE TIPS */}
      <div className="mt-6 flex justify-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">
         <div className="flex items-center gap-2"><ChevronLeft size={12}/> RECHAZAR</div>
         <div className="flex items-center gap-2">ACEPTAR <ChevronRight size={12}/></div>
      </div>
    </div>
  );
};

export default DatingModule;
