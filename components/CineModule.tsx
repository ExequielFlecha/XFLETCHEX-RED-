
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Bookmark, Share2, 
  ChevronRight, ChevronDown, Star, Clock, List, 
  Film, Tv, Sparkles, X, Volume2, VolumeX, Maximize,
  Languages, Subtitles, Globe, Check
} from 'lucide-react';

interface Episode {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

interface CineItem {
  id: string;
  title: string;
  type: 'movie' | 'anime' | 'series';
  genre: string;
  rating: number;
  year: number;
  description: string;
  thumbnail: string;
  banner: string;
  seasons?: Season[];
  videoUrl?: string; // Para películas normales
  duration?: string;
}

const LANGUAGES = [
  { id: 'es-LAT', name: 'Español Latino', flag: '🇲🇽' },
  { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { id: 'jp-JP', name: '日本語 (Japonés)', flag: '🇯🇵' },
  { id: 'br-PT', name: 'Português', flag: '塑造' },
  { id: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { id: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
];

const CINE_DATA: CineItem[] = [
  {
    id: 'm1',
    title: 'Interstellar XF',
    type: 'movie',
    genre: 'Ciencia Ficción',
    rating: 9.9,
    year: 2024,
    description: 'Un viaje a través de agujeros de gusano en la red XFLETCHEX para salvar el legado de la humanidad.',
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    duration: '2h 49m',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-star-field-in-outer-space-26724-large.mp4'
  },
  {
    id: 'a1',
    title: 'Cyber-God: Resurrection',
    type: 'anime',
    genre: 'Cyberpunk',
    rating: 9.8,
    year: 2025,
    description: 'El guerrero definitivo de la red XF debe enfrentarse a los virus del copyright para liberar el imperio.',
    thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=1200',
    seasons: [
      {
        id: 's1',
        number: 1,
        episodes: [
          { id: 'e1', title: 'El Despertar del Dios', duration: '24m', thumbnail: 'https://picsum.photos/seed/anime1/300/170', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-light-particles-in-a-dark-background-30472-large.mp4' },
          { id: 'e2', title: 'Redes Prohibidas', duration: '23m', thumbnail: 'https://picsum.photos/seed/anime2/300/170', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-34533-large.mp4' }
        ]
      }
    ]
  },
  {
    id: 's2',
    title: 'El Imperio Flecha',
    type: 'series',
    genre: 'Drama / Acción',
    rating: 9.7,
    year: 2024,
    description: 'La historia real detrás de la creación de la red más poderosa del multiverso.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200',
    seasons: [
      {
        id: 's1',
        number: 1,
        episodes: [
          { id: 'e1', title: 'Líneas de Código', duration: '45m', thumbnail: 'https://picsum.photos/seed/ser1/300/170', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-a-server-room-with-blue-lights-31843-large.mp4' }
        ]
      }
    ]
  }
];

const CineModule: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CineItem | null>(null);
  const [activeTab, setActiveTab] = useState<'MOVIES' | 'ANIME' | 'SERIES'>('MOVIES');
  const [playingVideo, setPlayingVideo] = useState<{url: string, title: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  // Estados de Idioma
  const [audioLang, setAudioLang] = useState('es-LAT');
  const [subtitleLang, setSubtitleLang] = useState<string | null>(null); // null = desactivado
  const [showLangMenu, setShowLangMenu] = useState<'audio' | 'subs' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Filtrado
  const filteredItems = CINE_DATA.filter(item => {
    if (activeTab === 'MOVIES') return item.type === 'movie';
    if (activeTab === 'ANIME') return item.type === 'anime';
    if (activeTab === 'SERIES') return item.type === 'series';
    return true;
  });

  // Controles de Video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [playingVideo]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-fade-in font-rajdhani">
      
      {/* Selector de Categoría Estilo XF */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#0a0a0f] p-2 rounded-[2.5rem] flex border border-white/5 w-full max-w-2xl h-24 items-center shadow-2xl">
          <button 
            onClick={() => setActiveTab('MOVIES')} 
            className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${activeTab === 'MOVIES' ? 'bg-[#dc2626] text-white shadow-xl shadow-red-900/40' : 'text-white/30 hover:text-white'}`}
          >
            PELÍCULAS
          </button>
          <button 
            onClick={() => setActiveTab('ANIME')} 
            className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${activeTab === 'ANIME' ? 'bg-[#dc2626] text-white shadow-xl shadow-red-900/40' : 'text-white/30 hover:text-white'}`}
          >
            ANIMES
          </button>
          <button 
            onClick={() => setActiveTab('SERIES')} 
            className={`flex-1 h-full rounded-[2rem] font-black text-sm italic uppercase tracking-widest transition-all ${activeTab === 'SERIES' ? 'bg-[#dc2626] text-white shadow-xl shadow-red-900/40' : 'text-white/30 hover:text-white'}`}
          >
            SERIES
          </button>
        </div>
      </div>

      {/* Grid de Contenido */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer"
          >
            <div className="aspect-[2/3] relative rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-red-600 transition-all shadow-xl">
               <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-[8px] font-black text-white italic uppercase shadow-lg">
                  <Star size={8} fill="currentColor" className="inline mr-1"/> {item.rating}
               </div>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                     <Play fill="white" size={32} />
                  </div>
               </div>
            </div>
            <h4 className="mt-4 text-center text-sm font-black text-white uppercase italic tracking-tighter group-hover:text-red-500 transition-colors truncate">
               {item.title}
            </h4>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE / SELECTOR DE EPISODIOS */}
      {selectedItem && !playingVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 overflow-y-auto">
          <div className="w-full max-w-6xl bg-[#0a0a10] border-2 border-white/10 rounded-[4rem] overflow-hidden shadow-2xl animate-scale-in flex flex-col md:flex-row relative min-h-[70vh]">
             <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 z-30 text-white/20 hover:text-white p-3 bg-white/5 rounded-full"><X size={32}/></button>
             
             <div className="md:w-1/2 relative">
                <img src={selectedItem.banner} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                   <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4">{selectedItem.title}</h2>
                   <div className="flex gap-4 items-center mb-6">
                      <span className="text-red-500 font-black italic">{selectedItem.year}</span>
                      <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                      <span className="text-white/60 font-bold uppercase text-[10px] tracking-widest">{selectedItem.genre}</span>
                      <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                      <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black">XF-RATING {selectedItem.rating}</span>
                   </div>
                   <p className="text-lg text-white/70 italic leading-relaxed max-w-md">"{selectedItem.description}"</p>
                </div>
             </div>

             <div className="md:w-1/2 p-12 overflow-y-auto scrollbar-thin">
                {selectedItem.type === 'movie' ? (
                  <div className="h-full flex flex-col justify-center items-center text-center">
                     <h3 className="text-3xl font-black text-white uppercase italic mb-8">PELÍCULA COMPLETA</h3>
                     <p className="text-white/40 mb-10 font-bold uppercase tracking-widest">Duración: {selectedItem.duration}</p>
                     <button 
                       onClick={() => setPlayingVideo({ url: selectedItem.videoUrl!, title: selectedItem.title })}
                       className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-3xl text-xl uppercase italic tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
                     >
                        <Play fill="white" size={32} /> REPRODUCIR AHORA
                     </button>
                  </div>
                ) : (
                  <div>
                     <h3 className="text-3xl font-black text-white uppercase italic mb-10 tracking-tighter border-b border-white/5 pb-6">TEMPORADAS Y EPISODIOS</h3>
                     {selectedItem.seasons?.map(season => (
                       <div key={season.id} className="space-y-6">
                          <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.4em] mb-4 italic">Temporada {season.number}</h4>
                          <div className="grid grid-cols-1 gap-4">
                             {season.episodes.map(episode => (
                               <div 
                                 key={episode.id}
                                 onClick={() => setPlayingVideo({ url: episode.videoUrl, title: `${selectedItem.title} - ${episode.title}` })}
                                 className="flex items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group"
                               >
                                  <div className="w-32 aspect-video rounded-2xl overflow-hidden relative">
                                     <img src={episode.thumbnail} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={20} fill="white" className="text-white" />
                                     </div>
                                  </div>
                                  <div className="flex-1">
                                     <p className="text-sm font-black text-white uppercase italic group-hover:text-red-500 transition-colors">{episode.title}</p>
                                     <p className="text-[10px] text-white/30 font-bold mt-1 uppercase tracking-widest">{episode.duration}</p>
                                  </div>
                                  <button className="text-white/20 hover:text-white transition-colors p-2"><Bookmark size={20}/></button>
                               </div>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* REPRODUCTOR DE VIDEO TÁCTICO CON IDIOMAS */}
      {playingVideo && (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col animate-fade-in" onClick={() => setShowLangMenu(null)}>
           {/* Header del Reproductor */}
           <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-50 bg-gradient-to-b from-black via-black/60 to-transparent">
              <div className="flex items-center gap-6">
                 <button onClick={(e) => { e.stopPropagation(); setPlayingVideo(null); }} className="text-white/40 hover:text-white transition-all"><X size={40}/></button>
                 <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{playingVideo.title}</h2>
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                       <Sparkles size={12}/> REPRODUCCIÓN EN ALTA DEFINICIÓN XF
                    </p>
                 </div>
              </div>
              <div className="flex gap-6">
                 {/* BOTÓN IDIOMA AUDIO */}
                 <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowLangMenu(showLangMenu === 'audio' ? null : 'audio'); }}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${showLangMenu === 'audio' ? 'bg-red-600 text-white border-red-500' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                    >
                       <Languages size={24} />
                       <span className="text-[10px] font-black uppercase tracking-tighter">AUDIO</span>
                    </button>
                    {showLangMenu === 'audio' && (
                      <div className="absolute top-full mt-4 right-0 w-64 bg-[#0a0a10] border-2 border-white/10 rounded-3xl p-4 shadow-2xl z-[310] animate-scale-in" onClick={e => e.stopPropagation()}>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 italic">Doblaje de Audio</h4>
                        <div className="space-y-2">
                          {LANGUAGES.map(lang => (
                            <button 
                              key={lang.id} 
                              onClick={() => { setAudioLang(lang.id); setShowLangMenu(null); }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${audioLang === lang.id ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-white/40 hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-3">
                                <span>{lang.flag}</span>
                                <span className="text-xs font-bold">{lang.name}</span>
                              </div>
                              {audioLang === lang.id && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>

                 {/* BOTÓN SUBTÍTULOS */}
                 <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowLangMenu(showLangMenu === 'subs' ? null : 'subs'); }}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${showLangMenu === 'subs' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                    >
                       <Subtitles size={24} />
                       <span className="text-[10px] font-black uppercase tracking-tighter">SUBS</span>
                    </button>
                    {showLangMenu === 'subs' && (
                      <div className="absolute top-full mt-4 right-0 w-64 bg-[#0a0a10] border-2 border-white/10 rounded-3xl p-4 shadow-2xl z-[310] animate-scale-in" onClick={e => e.stopPropagation()}>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 italic">Traducción de Subtítulos</h4>
                        <div className="space-y-2">
                          <button 
                            onClick={() => { setSubtitleLang(null); setShowLangMenu(null); }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${subtitleLang === null ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20' : 'text-white/40 hover:bg-white/5'}`}
                          >
                            <span className="text-xs font-bold uppercase tracking-widest">DESACTIVADOS</span>
                            {subtitleLang === null && <Check size={14} />}
                          </button>
                          {LANGUAGES.map(lang => (
                            <button 
                              key={lang.id} 
                              onClick={() => { setSubtitleLang(lang.id); setShowLangMenu(null); }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${subtitleLang === lang.id ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/20' : 'text-white/40 hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-3">
                                <span>{lang.flag}</span>
                                <span className="text-xs font-bold">{lang.name}</span>
                              </div>
                              {subtitleLang === lang.id && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>

                 <button 
                  onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }} 
                  className={`p-4 rounded-2xl border transition-all ${isSaved ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                 >
                    <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
                 </button>
                 <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"><Share2 size={24}/></button>
              </div>
           </div>

           {/* Video Principal */}
           <div className="flex-1 w-full flex items-center justify-center relative bg-black group">
              <video 
                ref={videoRef}
                src={playingVideo.url}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              />

              {/* HUD DE IDIOMA ACTUAL EN PANTALLA */}
              <div className="absolute top-32 left-1/2 -translate-x-1/2 pointer-events-none z-40 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full flex items-center gap-4 shadow-2xl">
                    <div className="flex items-center gap-2">
                       <Globe size={14} className="text-red-500" />
                       <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] italic">Audio:</span>
                       <span className="text-[10px] font-black text-red-500 uppercase italic">{LANGUAGES.find(l => l.id === audioLang)?.name}</span>
                    </div>
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <div className="flex items-center gap-2">
                       <Subtitles size={14} className="text-cyan-400" />
                       <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] italic">Subs:</span>
                       <span className="text-[10px] font-black text-cyan-400 uppercase italic">{subtitleLang ? LANGUAGES.find(l => l.id === subtitleLang)?.name : 'OFF'}</span>
                    </div>
                 </div>
              </div>
              
              {/* Controles Overlay (Se ocultan solos) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                 <div className="flex items-center gap-12 pointer-events-auto">
                    <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="text-white/60 hover:text-white hover:scale-110 transition-all"><RotateCcw size={60}/></button>
                    <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_80px_rgba(220,38,38,0.5)] hover:scale-110 transition-all">
                       {isPlaying ? <Pause size={60} fill="currentColor" /> : <Play size={60} fill="currentColor" className="ml-2" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="text-white/60 hover:text-white hover:scale-110 transition-all"><RotateCw size={60}/></button>
                 </div>
              </div>

              {/* Barra de progreso y tiempo */}
              <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent z-50">
                 <div className="flex items-center gap-6 mb-4">
                    <span className="text-xs font-black text-white italic">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative group/bar cursor-pointer">
                       <div 
                         className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all"
                         style={{ width: `${(currentTime / duration) * 100}%` }}
                       ></div>
                       <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-2xl" style={{ left: `${(currentTime / duration) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-white/40 italic">{formatTime(duration)}</span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                       <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-red-500 transition-colors">
                          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                       </button>
                       <div className="flex items-center gap-4 text-white/40 hover:text-white transition-colors group/vol">
                          <Volume2 size={24} />
                          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-white w-[80%]"></div>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <button className="text-white/40 hover:text-white transition-colors"><List size={24}/></button>
                       <button className="text-white/40 hover:text-white transition-colors"><Maximize size={24}/></button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* FOOTER PUBLICITARIO CINE */}
      <div className="mt-20 p-16 bg-gradient-to-br from-[#05050a] via-[#0a0a15] to-[#05050a] border-2 border-red-600/10 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
         <div className="absolute -top-20 -right-20 p-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Film size={300} /></div>
         <h2 className="text-4xl font-black font-futuristic text-white italic mb-4 uppercase tracking-tighter leading-none">DISFRUTA DEL CINE SIN LÍMITES</h2>
         <p className="text-white/40 text-xl font-bold italic mb-12 max-w-3xl mx-auto">Películas, Animes y Series en la red XFLETCHEX RED. Doblajes al Español Latino, Inglés, Japonés y más. Activa subtítulos traducidos para no perderte ni un segundo de la acción.</p>
         <div className="flex flex-wrap justify-center gap-10">
            <div className="text-center">
               <p className="text-4xl font-black text-red-600 italic">5000+</p>
               <p className="text-[10px] text-white/30 font-black uppercase mt-1 tracking-widest">Títulos Propios</p>
            </div>
            <div className="text-center">
               <p className="text-4xl font-black text-cyan-400 italic">MULTI-IDIOMA</p>
               <p className="text-[10px] text-white/30 font-black uppercase mt-1 tracking-widest">Doblajes Reales</p>
            </div>
            <div className="text-center">
               <p className="text-4xl font-black text-purple-500 italic">OFFLINE</p>
               <p className="text-[10px] text-white/30 font-black uppercase mt-1 tracking-widest">Guarda y Mira</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CineModule;
