
import React from 'react';
import { Tv, MessageSquare, Heart, Share2, Users, Radio } from 'lucide-react';

const LiveModule: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Stream Player Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/20 group">
          <img src="https://picsum.photos/seed/game/1280/720" className="w-full h-full object-cover opacity-80" />
          <div className="absolute top-6 left-6 flex gap-3">
            <div className="bg-red-600 px-3 py-1 rounded flex items-center gap-2 font-bold animate-pulse">
              <Radio size={16} /> LIVE
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded flex items-center gap-2">
              <Users size={16} className="text-cyan-400" /> 12.4K
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white/20 backdrop-blur-md p-6 rounded-full hover:scale-110 transition-transform">
              <Tv size={48} />
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-red-500 p-1">
              <img src="https://picsum.photos/seed/streamer/100" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-futuristic">CYBERPUNK 2077: PHANTOM LIBERTY</h2>
              <p className="text-white/60">Jugado por <span className="text-red-500 font-bold">X-Gamer_Ultra</span></p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-bold flex items-center gap-2">
               SUSCRIBIRSE
            </button>
            <button className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat Area */}
      <div className="w-full lg:w-80 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-bold font-futuristic flex items-center gap-2">
            <MessageSquare size={18} className="text-red-500" /> CHAT EN VIVO
          </h3>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto text-sm">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-fade-in">
              <span className="font-bold text-cyan-400">User_{i}:</span> 
              <span className="text-white/80 ml-2">¡Esa jugada fue increíble! 🔥🚀</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white/5 border-t border-white/10">
          <input 
            type="text" 
            placeholder="Enviar mensaje..." 
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-red-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveModule;
