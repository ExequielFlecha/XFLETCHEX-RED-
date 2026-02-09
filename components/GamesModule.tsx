
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Radio, Video, Play, Power, Star, Monitor, Cpu, Trophy, 
  Share2, MessageCircle, X, Terminal, Camera, Save, LogOut, Search,
  Database, Zap, HardDrive, Globe, CreditCard, ShieldCheck, Wallet,
  TrendingUp, Award, DollarSign, Users, BadgeCheck, Sparkles, Loader2,
  Crown, ArrowRight, Bell, Smartphone, SearchCode, BellRing
} from 'lucide-react';
import { User, StrikeStatus } from '../types';

interface Game {
  id: string;
  title: string;
  console: string;
  genre: string;
  rating: number;
  thumbnail: string;
  gameplayUrl: string;
}

interface Tournament {
  id: string;
  gameTitle: string;
  prize: string;
  entryFee: { ars: string; usd: string; eur: string };
  participants: number;
  maxParticipants: number;
  status: 'ABIERTO' | 'EN CURSO' | 'FINALIZADO';
  region: 'GLOBAL' | 'EUROPA' | 'LATAM' | 'ASIA';
}

interface GamesModuleProps {
  currentUser: User;
  setUser: (u: User) => void;
  notify: (msg: string) => void;
}

const MOCK_GAMES: Game[] = [
  { id: 'pc1', title: 'Cyberpunk 2077', console: 'PC GAMER', genre: 'Open World RPG', rating: 9.9, thumbnail: 'https://images.unsplash.com/photo-1605898835373-02fbd1040a53?auto=format&fit=crop&q=80&w=1000', gameplayUrl: '' },
  { id: 'ps6_1', title: 'Grand Theft Auto VI', console: 'PS6', genre: 'Action-Adventure', rating: 10, thumbnail: 'https://picsum.photos/seed/gta6/800/450', gameplayUrl: '' },
  { id: 'ps5_1', title: 'Spider-Man 2', console: 'PS5', genre: 'Action', rating: 9.8, thumbnail: 'https://picsum.photos/seed/spidey/800/450', gameplayUrl: '' },
  { id: 'ps4_1', title: 'God of War', console: 'PS4', genre: 'Action', rating: 9.7, thumbnail: 'https://picsum.photos/seed/gow4/800/450', gameplayUrl: '' },
];

const TOURNAMENTS: Tournament[] = [
  { id: 't1', gameTitle: 'COPA X-FLETCHEX PC GAMER', prize: '1.000.000 SEGUIDORES + CHECK AZUL', entryFee: { ars: '1.000.000', usd: '1.000', eur: '7.000' }, participants: 154, maxParticipants: 500, status: 'ABIERTO', region: 'GLOBAL' },
];

const GamesModule: React.FC<GamesModuleProps> = ({ currentUser, setUser, notify }) => {
  const [view, setView] = useState<'BIBLIOTECA' | 'CIBER_TORNEOS'>('BIBLIOTECA');
  const [activeRegion, setActiveRegion] = useState<'ARS' | 'USD' | 'EUR'>('ARS');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isVerifyingWithIA, setIsVerifyingWithIA] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  const startIAVerification = () => {
    setIsVerifyingWithIA(true);
    // Notificar a la IA para el HUD
    window.dispatchEvent(new CustomEvent('xf_payment_received', { 
      detail: { amount: "INSCRIPCIÓN TORNEO", user: currentUser.name } 
    }));
    
    setTimeout(() => {
      setIsVerifyingWithIA(false);
      setSelectedTournament(null);
      handleTournamentWin();
    }, 4000);
  };

  const handleTournamentWin = () => {
    setShowWinAnimation(true);
    setTimeout(() => {
      const updatedUser: User = { 
        ...currentUser, 
        followersCount: currentUser.followersCount + 1000000,
        isVerified: true
      };
      setUser(updatedUser);
      setShowWinAnimation(false);
      notify("¡FELICIDADES! HAS GANADO EL TORNEO: +1M SEGUIDORES Y VERIFICACIÓN AZUL.");
    }, 10000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 font-rajdhani">
      
      {/* ANIMACIÓN DE VICTORIA MÁXIMA */}
      {showWinAnimation && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/98 backdrop-blur-3xl text-center p-6 animate-fade-in">
           <Trophy size={250} className="text-yellow-400 mb-8 animate-bounce drop-shadow-[0_0_100px_rgba(250,204,21,0.9)]" />
           <h2 className="text-8xl font-black italic text-white uppercase mb-4 font-futuristic tracking-tighter">ERES FAMOSO</h2>
           <div className="bg-white/5 p-16 rounded-[5rem] border-2 border-yellow-500/50 scale-110 relative shadow-[0_0_80px_rgba(234,179,8,0.2)]">
              <Sparkles className="absolute -top-12 -right-12 text-yellow-400 animate-spin-slow" size={80} />
              <p className="text-5xl font-black text-white tracking-[0.2em] italic">+1.000.000 SEGUIDORES XF</p>
              <div className="flex items-center justify-center gap-6 text-cyan-400 text-4xl font-black mt-10 uppercase italic">
                PERFIL VERIFICADO <BadgeCheck size={50} />
              </div>
           </div>
           <p className="mt-16 text-white/40 font-bold uppercase tracking-[0.6em] italic animate-pulse">EL MUNDO AHORA TE PERTENECE</p>
        </div>
      )}

      {selectedTournament && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
           <div className="w-full max-w-2xl bg-[#0a0a10] border-2 border-cyan-500/30 rounded-[4rem] p-12 text-center shadow-2xl animate-scale-in">
              {isVerifyingWithIA ? (
                <div className="py-20 flex flex-col items-center gap-10">
                   <div className="w-28 h-28 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                   <h3 className="text-2xl font-black text-white italic uppercase">IA VALIDANDO INSCRIPCIÓN...</h3>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                     <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">INSCRIPCIÓN COPA XF</h2>
                     <button onClick={() => setSelectedTournament(null)}><X className="text-white/20 hover:text-white" /></button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-8">
                     {['ARS', 'USD', 'EUR'].map(r => (
                       <button key={r} onClick={() => setActiveRegion(r as any)} className={`py-4 rounded-2xl font-black text-xs transition-all ${activeRegion === r ? 'bg-red-600 text-white' : 'bg-white/5 text-white/40'}`}>{r}</button>
                     ))}
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left mb-10 space-y-6">
                     <div>
                        <p className="text-[8px] text-white/30 uppercase mb-1">Transferir a Alias / Usuario</p>
                        <p className="text-2xl font-black text-white italic">{activeRegion === 'ARS' ? currentUser.mpAlias : currentUser.ppAlias}</p>
                     </div>
                     <div className="text-right border-t border-white/5 pt-6">
                        <p className="text-5xl font-black text-cyan-400 font-futuristic">${activeRegion === 'ARS' ? '1.000.000' : activeRegion === 'USD' ? '1.000' : '7.000'}</p>
                        <p className="text-[9px] text-white/20 font-black mt-2">VALOR DE ENTRADA PRO - PREMIO 1M FANS</p>
                     </div>
                  </div>
                  
                  <button onClick={startIAVerification} className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-3xl text-sm uppercase italic tracking-widest active:scale-95 shadow-2xl transition-all">INFORMAR PAGO A LA IA</button>
                </>
              )}
           </div>
        </div>
      )}

      {/* SELECTOR EMULADOR / TORNEO */}
      <div className="flex justify-center mb-16 px-4">
        <div className="bg-[#0a0a0f] p-2 rounded-[2.5rem] flex border border-white/5 w-full max-w-2xl h-24 items-center">
          <button onClick={() => setView('BIBLIOTECA')} className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${view === 'BIBLIOTECA' ? 'bg-[#dc2626] text-white shadow-xl' : 'text-white/30 hover:text-white'}`}>BIBLIOTECA XF</button>
          <button onClick={() => setView('CIBER_TORNEOS')} className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${view === 'CIBER_TORNEOS' ? 'bg-[#dc2626] text-white shadow-xl' : 'text-white/30 hover:text-white'}`}>COPA DIOS (TORNEOS)</button>
        </div>
      </div>

      {view === 'CIBER_TORNEOS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
          {TOURNAMENTS.map(t => (
            <div key={t.id} className="bg-gradient-to-br from-black to-[#05050a] border-2 border-cyan-500/20 p-12 rounded-[4rem] hover:border-cyan-500 transition-all shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform"><Trophy size={200} /></div>
               <h3 className="text-3xl font-black text-white uppercase italic mb-4 tracking-tighter">{t.gameTitle}</h3>
               <p className="text-cyan-400 font-black text-lg uppercase mb-10 tracking-widest italic flex items-center gap-3">
                  <Award /> PREMIO: {t.prize}
               </p>
               <button onClick={() => setSelectedTournament(t)} className="w-full py-6 bg-white text-black font-black rounded-3xl text-xs uppercase italic tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-xl">COMPRAR ENTRADA TORNEO</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12 w-full">
           {MOCK_GAMES.map(game => (
             <div key={game.id} className="bg-[#050508] border border-white/10 rounded-[4.5rem] overflow-hidden group hover:border-red-600/40 transition-all w-full max-w-4xl shadow-2xl relative">
                <div className="aspect-video relative w-full">
                   <img src={game.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                   <div className="absolute top-8 left-8"><div className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-2xl flex items-center gap-3"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-white italic uppercase tracking-widest">{game.console}</span></div></div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><button className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"><Play fill="currentColor" size={48}/></button></div>
                </div>
                <div className="p-12 bg-gradient-to-t from-black via-[#050508] to-transparent">
                   <h3 className="text-4xl md:text-5xl font-black text-white text-center uppercase italic tracking-tighter font-futuristic">{game.title}</h3>
                   <div className="flex justify-center gap-4 mt-6 text-[10px] text-white/30 font-bold uppercase tracking-widest italic">
                      <Star size={12} className="text-yellow-500 fill-yellow-500"/> {game.rating} XF-SCORE • {game.genre}
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default GamesModule;
