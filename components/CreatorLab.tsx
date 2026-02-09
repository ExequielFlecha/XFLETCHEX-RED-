
import React, { useState, useEffect, useRef } from 'react';
import { 
  Pencil, Sparkles, Film, Gamepad2, Monitor, Cpu, 
  Layers, Zap, Play, Rocket, Trash2, Camera,
  CheckCircle, Loader2, Maximize2, Wand2, User, 
  UserPlus, ShieldAlert, Ghost, RefreshCcw, Upload,
  Edit3, Video, Heart, Share2, ScanFace, ChevronRight
} from 'lucide-react';

interface CreatorLabProps {
  notify: (msg: string) => void;
}

interface CharacterAsset {
  id: string;
  type: 'HERO' | 'ENEMY';
  photo: string | null;
  name: string;
}

const CreatorLab: React.FC<CreatorLabProps> = ({ notify }) => {
  const [activeTab, setActiveTab] = useState<'CINEMA' | 'GAMES'>('CINEMA');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedItems, setGeneratedItems] = useState<any[]>([]);
  
  // ADN VIRTUAL - Fotos de Actores y Personajes
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [heroBody, setHeroBody] = useState<string | null>(null);
  const [enemyAssets, setEnemyAssets] = useState<CharacterAsset[]>([]);
  
  // Estados de Configuración
  const [moviePrompt, setMoviePrompt] = useState('');
  const [quality, setQuality] = useState('8K');
  const [duration, setDuration] = useState('LONG');
  const [format, setFormat] = useState('MOVIE');
  const [gamePrompt, setGamePrompt] = useState('');
  const [gameType, setGameType] = useState('3D');
  const [style, setStyle] = useState('CYBERPUNK');

  // Referencias para inputs
  const heroRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLInputElement>(null);
  const enemyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            finishGeneration();
            return 100;
          }
          return prev + 1;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'HERO' | 'BODY' | 'ENEMY') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'HERO') setHeroPhoto(result);
        if (target === 'BODY') setHeroBody(result);
        if (target === 'ENEMY') {
          const newEnemy: CharacterAsset = { id: Date.now().toString(), type: 'ENEMY', photo: result, name: `Enemigo ${enemyAssets.length + 1}` };
          setEnemyAssets([...enemyAssets, newEnemy]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAutoCharacter = (type: 'HERO' | 'ENEMY') => {
    notify(`GENERANDO ROSTRO DE ${type} AUTOMÁTICAMENTE...`);
    const mockPhoto = `https://picsum.photos/seed/${Math.random()}/400/400`;
    if (type === 'HERO') setHeroPhoto(mockPhoto);
    else {
      const newEnemy: CharacterAsset = { id: Date.now().toString(), type: 'ENEMY', photo: mockPhoto, name: `Villano IA` };
      setEnemyAssets([...enemyAssets, newEnemy]);
    }
  };

  const finishGeneration = () => {
    setIsGenerating(false);
    setProgress(0);
    const newItem = {
      id: Date.now(),
      type: activeTab,
      title: activeTab === 'CINEMA' ? moviePrompt : gamePrompt,
      meta: activeTab === 'CINEMA' ? `${quality} • ${format}` : `${gameType} • ${style}`,
      timestamp: new Date().toLocaleTimeString(),
      hasHero: !!heroPhoto
    };
    setGeneratedItems([newItem, ...generatedItems]);
    notify(`¡PROCESO FINALIZADO! La IA ha integrado tu rostro y cuerpo con éxito.`);
  };

  const handleGenerate = () => {
    if ((activeTab === 'CINEMA' && !moviePrompt) || (activeTab === 'GAMES' && !gamePrompt)) {
      notify("ERROR: ESCRIBE LA HISTORIA PARA QUE LA IA PUEDA CREAR.");
      return;
    }
    setIsGenerating(true);
    notify(`DANDO VIDA A ${activeTab === 'CINEMA' ? 'TU PELÍCULA' : 'TU VIDEOJUEGO'} EN 8K...`);
  };

  const reEdit = (id: number) => {
    notify("MODO PERFECCIÓN ACTIVADO: CORRIGIENDO ERRORES DE RENDERIZADO...");
    setIsGenerating(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in font-rajdhani">
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-yellow-500/20 rounded-[2.5rem] flex items-center justify-center border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
              <Pencil className="text-yellow-500 animate-pulse" size={40} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-black font-futuristic italic uppercase tracking-tighter text-white">ESTUDIO <span className="text-yellow-500">XF-CREAR</span></h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mt-2 italic">ADN VIRTUAL • INTEGRACIÓN DE ROSTROS REALES • 8K</p>
           </div>
        </div>

        <div className="bg-black/60 p-2 rounded-full flex border border-white/5 backdrop-blur-xl h-16 w-full md:w-96 items-center">
           <button 
             onClick={() => setActiveTab('CINEMA')}
             className={`flex-1 h-full rounded-full font-black text-[10px] italic uppercase transition-all flex items-center justify-center gap-3 ${activeTab === 'CINEMA' ? 'bg-red-600 text-white shadow-xl' : 'text-white/30 hover:text-white'}`}
           >
              <Film size={14} /> PELÍCULAS & ANIME
           </button>
           <button 
             onClick={() => setActiveTab('GAMES')}
             className={`flex-1 h-full rounded-full font-black text-[10px] italic uppercase transition-all flex items-center justify-center gap-3 ${activeTab === 'GAMES' ? 'bg-cyan-600 text-white shadow-xl' : 'text-white/30 hover:text-white'}`}
           >
              <Gamepad2 size={14} /> JUEGOS GAMER
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* PANEL IZQUIERDO: CONFIGURACIÓN Y PROMPT */}
         <div className="lg:col-span-8 space-y-8">
            
            {/* CASTING DE ROSTROS (NUEVO) */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center gap-4 mb-8">
                  <ScanFace className="text-yellow-500" size={24}/>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">CASTING DE ACTORES (TU ROSTRO)</h3>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Foto Protagonista */}
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/30 uppercase text-center italic">TU ROSTRO (ACTOR)</p>
                     <div 
                        onClick={() => heroRef.current?.click()}
                        className="aspect-square bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-all overflow-hidden"
                     >
                        {heroPhoto ? <img src={heroPhoto} className="w-full h-full object-cover" /> : <Camera className="text-white/20" size={32}/>}
                     </div>
                     <button onClick={() => generateAutoCharacter('HERO')} className="w-full py-2 bg-yellow-500/10 text-yellow-500 rounded-xl text-[8px] font-black uppercase hover:bg-yellow-500 hover:text-white transition-all">GENAR ROSTRO IA</button>
                  </div>

                  {/* Cuerpo Protagonista */}
                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/30 uppercase text-center italic">TU CUERPO (GAMER/CINE)</p>
                     <div 
                        onClick={() => bodyRef.current?.click()}
                        className="aspect-square bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-all overflow-hidden"
                     >
                        {heroBody ? <img src={heroBody} className="w-full h-full object-cover" /> : <User className="text-white/20" size={32}/>}
                     </div>
                     <div className="text-[8px] text-white/20 font-bold text-center uppercase">Mapping 3D</div>
                  </div>

                  {/* Enemigos/Secundarios */}
                  {enemyAssets.map(enemy => (
                    <div key={enemy.id} className="space-y-3">
                       <p className="text-[9px] font-black text-red-500 uppercase text-center italic">{enemy.name}</p>
                       <div className="aspect-square bg-red-600/5 rounded-3xl border-2 border-red-500/20 flex items-center justify-center overflow-hidden">
                          <img src={enemy.photo!} className="w-full h-full object-cover" />
                       </div>
                       <button onClick={() => setEnemyAssets(enemyAssets.filter(e => e.id !== enemy.id))} className="w-full py-1 text-red-500 hover:text-red-400"><Trash2 size={12} className="mx-auto"/></button>
                    </div>
                  ))}

                  <div className="space-y-3">
                     <p className="text-[9px] font-black text-white/30 uppercase text-center italic">AÑADIR PERSONAJE</p>
                     <div 
                        onClick={() => enemyRef.current?.click()}
                        className="aspect-square bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-all group"
                     >
                        <UserPlus className="text-white/20 group-hover:text-red-500 transition-colors" size={32}/>
                     </div>
                     <button onClick={() => generateAutoCharacter('ENEMY')} className="w-full py-2 bg-red-600/10 text-red-500 rounded-xl text-[8px] font-black uppercase transition-all">VILLANO IA</button>
                  </div>
               </div>

               <input type="file" ref={heroRef} onChange={(e) => handlePhotoUpload(e, 'HERO')} className="hidden" accept="image/*" />
               <input type="file" ref={bodyRef} onChange={(e) => handlePhotoUpload(e, 'BODY')} className="hidden" accept="image/*" />
               <input type="file" ref={enemyRef} onChange={(e) => handlePhotoUpload(e, 'ENEMY')} className="hidden" accept="image/*" />
            </div>

            {/* MOTOR DE RENDERIZADO */}
            <div className="bg-[#08080c] border-2 border-white/5 rounded-[4rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
               {isGenerating ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-10">
                     <div className="relative">
                        <div className="w-32 h-32 border-4 border-white/10 border-t-yellow-500 rounded-full animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500" size={40} />
                     </div>
                     <div className="space-y-4 w-full max-w-md">
                        <p className="text-3xl font-black text-white italic uppercase tracking-tighter">RENDERIZANDO TU VIDA VIRTUAL...</p>
                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                           <div className="h-full bg-gradient-to-r from-yellow-600 to-red-600 shadow-[0_0_20px_#ca8a04] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest italic">{progress}% - Integrando rostros y físicas estelares</p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-4 italic">DESCRIBE LA ESCENA O EL NIVEL DEL JUEGO</p>
                        <textarea 
                          value={activeTab === 'CINEMA' ? moviePrompt : gamePrompt}
                          onChange={(e) => activeTab === 'CINEMA' ? setMoviePrompt(e.target.value) : setGamePrompt(e.target.value)}
                          placeholder={activeTab === 'CINEMA' ? "Ej: 'Yo peleando como un Jedi contra mis enemigos en una base volcánica, estilo anime 8k'" : "Ej: 'Un juego 3D de mundo abierto donde yo soy un mercenario en Buenos Aires futurista'"}
                          className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] p-8 h-48 outline-none text-xl font-bold text-white focus:border-yellow-600/50 transition-all italic placeholder-white/10 resize-none"
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic ml-2">RENDERIZADO</p>
                           <div className="grid grid-cols-2 gap-2">
                              {['HD', '4K', '8K'].map(q => (
                                <button key={q} onClick={() => setQuality(q)} className={`py-4 rounded-2xl font-black text-xs border transition-all ${quality === q ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>{q}</button>
                              ))}
                           </div>
                        </div>

                        {activeTab === 'CINEMA' ? (
                          <>
                             <div className="space-y-4">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic ml-2">MODALIDAD VIDEO</p>
                                <div className="grid grid-cols-2 gap-2">
                                   {[{id: 'LONG', label: 'PELÍCULA'}, {id: 'SHORT', label: 'SHORT'}, {id: 'TRAILER', label: 'TRAILER'}, {id: 'INTRO', label: 'INTRO'}].map(d => (
                                     <button key={d.id} onClick={() => setDuration(d.id)} className={`py-3 rounded-xl font-black text-[9px] border transition-all ${duration === d.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>{d.label}</button>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic ml-2">ESTILO VISUAL</p>
                                <div className="grid grid-cols-1 gap-2">
                                   <button onClick={() => setFormat('MOVIE')} className={`py-4 rounded-xl font-black text-xs border transition-all flex items-center justify-center gap-3 ${format === 'MOVIE' ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}><Film size={14}/> CINE REAL</button>
                                   <button onClick={() => setFormat('ANIME')} className={`py-4 rounded-xl font-black text-xs border transition-all flex items-center justify-center gap-3 ${format === 'ANIME' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}><Monitor size={14}/> ANIME XF</button>
                                </div>
                             </div>
                          </>
                        ) : (
                          <>
                             <div className="space-y-4">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic ml-2">MOTOR GRÁFICO</p>
                                <div className="grid grid-cols-2 gap-2">
                                   <button onClick={() => setGameType('2D')} className={`py-4 rounded-xl font-black text-xs border transition-all ${gameType === '2D' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>2D PIXEL</button>
                                   <button onClick={() => setGameType('3D')} className={`py-4 rounded-xl font-black text-xs border transition-all ${gameType === '3D' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/5 text-white/40'}`}>3D ULTRA</button>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic ml-2">TIPO DE JUEGO</p>
                                <select 
                                  value={style} 
                                  onChange={(e) => setStyle(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs font-black uppercase text-white outline-none focus:border-yellow-500"
                                >
                                   <option value="CYBERPUNK">CYBERPUNK</option>
                                   <option value="FANTASY">FANTASÍA</option>
                                   <option value="SURVIVAL">SUPERVIVENCIA</option>
                                   <option value="HORROR">TERROR</option>
                                </select>
                             </div>
                          </>
                        )}
                     </div>

                     <button 
                       onClick={handleGenerate}
                       className="w-full py-8 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-500 hover:to-red-500 text-white rounded-[2.5rem] font-black font-futuristic text-2xl italic tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-6 group"
                     >
                        <Wand2 size={32} className="group-hover:rotate-12 transition-transform" /> DAR VIDA AHORA
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* PANEL DERECHO: HISTORIAL Y PERFECCIÓN */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-black/40 border border-white/10 rounded-[3rem] p-8 backdrop-blur-xl h-[800px] flex flex-col">
               <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h3 className="text-lg font-black italic text-white uppercase italic tracking-tighter flex items-center gap-3">
                     <Layers size={18} className="text-yellow-500" /> TUS CREACIONES
                  </h3>
               </div>

               <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                  {generatedItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10 italic">
                       <Rocket size={60} className="mb-4" />
                       <p className="text-xs font-black uppercase tracking-[0.3em]">No hay contenido. Crea tu legado hoy.</p>
                    </div>
                  ) : (
                    generatedItems.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/5 p-5 rounded-[2.5rem] group hover:bg-white/10 transition-all relative overflow-hidden border-l-4 border-l-yellow-600">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-black rounded-2xl border border-white/10 flex items-center justify-center text-yellow-500 relative overflow-hidden">
                               {item.hasHero && heroPhoto ? <img src={heroPhoto} className="w-full h-full object-cover opacity-60" /> : (item.type === 'CINEMA' ? <Film size={24}/> : <Gamepad2 size={24}/>)}
                               <div className="absolute inset-0 bg-black/40"></div>
                               <Play className="absolute z-10 opacity-50" size={12}/>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-sm font-black text-white uppercase italic truncate leading-none">"{item.title}"</h4>
                               <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest mt-2">{item.meta}</p>
                            </div>
                         </div>
                         <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                            <button className="flex-1 py-2 bg-yellow-600/20 text-yellow-500 rounded-lg font-black text-[7px] uppercase tracking-widest hover:bg-yellow-600 hover:text-white transition-all flex items-center justify-center gap-2">
                               <Play size={10}/> PUBLICAR
                            </button>
                            <button 
                              onClick={() => reEdit(item.id)}
                              className="flex-1 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg font-black text-[7px] uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all flex items-center justify-center gap-2"
                              title="Corregir errores y re-editar"
                            >
                               <RefreshCcw size={10}/> RE-EDITAR
                            </button>
                            <button className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                         </div>
                      </div>
                    ))
                  )}
               </div>

               <div className="mt-6 p-6 bg-gradient-to-br from-red-600/10 to-transparent border border-red-500/20 rounded-3xl">
                  <div className="flex items-center gap-3 text-red-500 font-black text-[10px] uppercase tracking-widest mb-2 italic">
                     <ShieldAlert size={14} /> MODO PERFECCIÓN ACTIVO
                  </div>
                  <p className="text-[8px] text-white/30 font-bold uppercase leading-tight italic">Si detectas errores en el renderizado, presiona 'RE-EDITAR'. La IA ajustará las mallas 3D y texturas automáticamente.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CreatorLab;
