
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
  { id: 'xbox_sx', title: 'Halo Infinite', console: 'XBOX SERIES X', genre: 'FPS', rating: 9.2, thumbnail: 'https://picsum.photos/seed/halo/800/450', gameplayUrl: '' },
  { id: 'xbox_360', title: 'Gears of War 3', console: 'XBOX 360', genre: 'Action', rating: 9.5, thumbnail: 'https://picsum.photos/seed/gears/800/450', gameplayUrl: '' },
  { id: 'ps3_1', title: 'Uncharted 2', console: 'PS3', genre: 'Adventure', rating: 9.6, thumbnail: 'https://picsum.photos/seed/uncharted/800/450', gameplayUrl: '' },
  { id: 'ps2_1', title: 'GTA San Andreas', console: 'PS2', genre: 'Open World', rating: 10, thumbnail: 'https://picsum.photos/seed/sanandreas/800/450', gameplayUrl: '' },
  { id: 'xbox_one', title: 'Forza Horizon 5', console: 'XBOX ONE', genre: 'Racing', rating: 9.4, thumbnail: 'https://picsum.photos/seed/forza/800/450', gameplayUrl: '' },
  { id: 'xbox_classic', title: 'Halo: CE', console: 'XBOX CLASSIC', genre: 'FPS', rating: 9.9, thumbnail: 'https://picsum.photos/seed/haloce/800/450', gameplayUrl: '' },
];

const TOURNAMENTS: Tournament[] = [
  { id: 't1', gameTitle: 'COPA X-FLETCHEX PC GAMER', prize: '1.000.000 Seguidores + Check Azul', entryFee: { ars: '1.000', usd: '100', eur: '70' }, participants: 154, maxParticipants: 500, status: 'ABIERTO', region: 'GLOBAL' },
];

const GamesModule: React.FC<GamesModuleProps> = ({ currentUser, setUser, notify }) => {
  const [view, setView] = useState<'BIBLIOTECA' | 'CIBER_TORNEOS'>('BIBLIOTECA');
  const [activeRegion, setActiveRegion] = useState<'ARS' | 'USD' | 'EUR'>('ARS');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isVerifyingWithIA, setIsVerifyingWithIA] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  const startIAVerification = () => {
    setIsVerifyingWithIA(true);
    setTimeout(() => {
      setIsVerifyingWithIA(false);
      setSelectedTournament(null);
      handleTournamentWin();
    }, 4000);
  };

  const handleTournamentWin = () => {
    setShowWinAnimation(true);
    setTimeout(() => {
      const updatedUser = { 
        ...currentUser, 
        followersCount: currentUser.followersCount + 1000000,
        isVerified: true
      };
      setUser(updatedUser);
      setShowWinAnimation(false);
      notify("¡HAS GANADO EL TORNEO! +1.000.000 SEGUIDORES Y VERIFICACIÓN.");
    }, 8000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 font-rajdhani">
      
      {showWinAnimation && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl text-center p-6 animate-fade-in">
           <Trophy size={200} className="text-yellow-400 mb-8 animate-bounce drop-shadow-[0_0_60px_rgba(250,204,21,0.8)]" />
           <h2 className="text-7xl font-black italic text-white uppercase mb-4">EL MUNDO ES TUYO</h2>
           <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 scale-125 relative">
              <Sparkles className="absolute -top-10 -right-10 text-yellow-400" size={60} />
              <p className="text-4xl font-black text-white tracking-widest">+1.000.000 SEGUIDORES</p>
              <div className="flex items-center justify-center gap-4 text-cyan-400 text-3xl font-black mt-6 uppercase">
                PERFIL VERIFICADO <BadgeCheck size={40} />
              </div>
           </div>
        </div>
      )}

      {selectedTournament && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
           <div className="w-full max-w-2xl bg-[#0a0a10] border-2 border-cyan-500/30 rounded-[4rem] p-12 text-center shadow-2xl animate-scale-in">
              {isVerifyingWithIA ? (
                <div className="py-20 flex flex-col items-center gap-10">
                   <div className="w-28 h-28 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                   <h3 className="text-2xl font-black text-white italic uppercase">IA VERIFICANDO TRANSFERENCIA...</h3>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-white uppercase italic mb-8">PAGO CIBER TORNEO</h2>
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left mb-10">
                     <p className="text-[10px] text-white/30 uppercase mb-2">Alias de Recepción ({activeRegion})</p>
                     <p className="text-2xl font-black text-white mb-6">{activeRegion === 'ARS' ? currentUser.mpAlias : currentUser.ppAlias}</p>
                     <div className="text-right">
                        <p className="text-4xl font-black text-cyan-400">${activeRegion === 'ARS' ? '1.000' : '100'} {activeRegion}</p>
                     </div>
                  </div>
                  <button onClick={startIAVerification} className="w-full py-6 bg-cyan-600 text-white font-black rounded-3xl text-sm uppercase italic tracking-widest active:scale-95 shadow-2xl">SOLICITAR VALIDACIÓN IA</button>
                  <button onClick={() => setSelectedTournament(null)} className="mt-4 text-white/20 uppercase font-black text-[10px]">Cancelar</button>
                </>
              )}
           </div>
        </div>
      )}

      {/* SELECTOR EMULADOR / TORNEO (ESTILO FOTO) */}
      <div className="flex justify-center mb-16 px-4">
        <div className="bg-[#0a0a0f] p-2 rounded-[2.5rem] flex border border-white/5 w-full max-w-2xl h-24 items-center">
          <button 
            onClick={() => setView('BIBLIOTECA')} 
            className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${view === 'BIBLIOTECA' ? 'bg-[#dc2626] text-white shadow-xl' : 'text-white/30 hover:text-white'}`}
          >
            EMULADOR
          </button>
          <button 
            onClick={() => setView('CIBER_TORNEOS')} 
            className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${view === 'CIBER_TORNEOS' ? 'bg-[#dc2626] text-white shadow-xl' : 'text-white/30 hover:text-white'}`}
          >
            CIBER TORNEO
          </button>
        </div>
      </div>

      {view === 'CIBER_TORNEOS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-in">
          {TOURNAMENTS.map(t => (
            <div key={t.id} className="bg-black/60 border border-white/10 p-12 rounded-[4rem] hover:border-cyan-500/40 transition-all shadow-2xl">
               <h3 className="text-3xl font-black text-white uppercase italic mb-4">{t.gameTitle}</h3>
               <p className="text-cyan-400 font-black text-sm uppercase mb-10 tracking-widest">{t.prize}</p>
               <button onClick={() => setSelectedTournament(t)} className="w-full py-5 bg-white text-black font-black rounded-3xl text-xs uppercase italic tracking-widest hover:bg-cyan-500 hover:text-white transition-all">INSCRIBIRSE AHORA</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12 w-full">
           {MOCK_GAMES.map(game => (
             <div 
               key={game.id} 
               className="bg-[#050508] border border-white/10 rounded-[4.5rem] overflow-hidden group hover:border-red-600/40 transition-all w-full max-w-4xl shadow-2xl relative"
             >
                <div className="aspect-[16/9] relative w-full">
                   <img src={game.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt={game.title} />
                   
                   {/* HUD DE CONSOLA */}
                   <div className="absolute top-8 left-8">
                      <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-2xl flex items-center gap-3">
                         <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black text-white italic uppercase tracking-widest">{game.console}</span>
                      </div>
                   </div>

                   {/* BOTÓN JUGAR */}
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button className="w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-110 transition-transform">
                         <Play fill="currentColor" size={48}/>
                      </button>
                   </div>
                </div>

                <div className="p-12 bg-gradient-to-t from-black via-[#050508] to-transparent">
                   <h3 className="text-4xl md:text-5xl font-black text-white text-center uppercase italic tracking-tighter drop-shadow-2xl font-futuristic">
                      {game.title}
                   </h3>
                   <div className="flex justify-center gap-4 mt-6">
                      <div className="flex items-center gap-1 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                         <Star size={12} className="text-yellow-500 fill-yellow-500"/> {game.rating} CALIFICACIÓN XF
                      </div>
                      <div className="w-1 h-1 bg-white/20 rounded-full mt-1.5"></div>
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest italic">{game.genre}</div>
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
