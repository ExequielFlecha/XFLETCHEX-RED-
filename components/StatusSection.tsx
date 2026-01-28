
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Upload, Type as TypeIcon, Image as ImageIcon, Video as VideoIcon, Sparkles } from 'lucide-react';
import { Status } from '../types';

const INITIAL_STATUSES: Status[] = [
  { 
    id: 's1', 
    userId: 'u1', 
    userName: 'Nova', 
    userImg: 'https://picsum.photos/seed/nova/100', 
    type: 'image', 
    content: 'https://picsum.photos/seed/space1/1080/1920', 
    color: 'border-cyan-500', 
    timestamp: 'Hace 2h' 
  },
  { 
    id: 's2', 
    userId: 'u2', 
    userName: 'Draco', 
    userImg: 'https://picsum.photos/seed/draco/101', 
    type: 'video', 
    content: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-slow-motion-3742-large.mp4', 
    color: 'border-red-500', 
    timestamp: 'Hace 5m' 
  },
  { 
    id: 's3', 
    userId: 'u3', 
    userName: 'Vega', 
    userImg: 'https://picsum.photos/seed/vega/102', 
    type: 'text', 
    content: '¡Preparando el lanzamiento del nuevo módulo de minería! 🚀💎 El futuro es hoy.', 
    color: 'border-purple-500', 
    timestamp: 'Hace 1h' 
  },
  { 
    id: 's4', 
    userId: 'u4', 
    userName: 'Sirius', 
    userImg: 'https://picsum.photos/seed/sirius/103', 
    type: 'image', 
    content: 'https://picsum.photos/seed/city1/1080/1920', 
    color: 'border-green-500', 
    timestamp: 'Hace 10h' 
  }
];

const StatusSection: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>(INITIAL_STATUSES);
  const [activeStatusIndex, setActiveStatusIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Estados para el creador de estados
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [newStatusType, setNewStatusType] = useState<'image' | 'video' | 'text'>('image');
  const [newStatusContent, setNewStatusContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejo del progreso automático del visor
  useEffect(() => {
    let interval: any;
    if (activeStatusIndex !== null) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextStatus();
            return 0;
          }
          return prev + 1;
        });
      }, 50); 
    }
    return () => clearInterval(interval);
  }, [activeStatusIndex]);

  const handleNextStatus = () => {
    if (activeStatusIndex !== null) {
      if (activeStatusIndex < statuses.length - 1) {
        setActiveStatusIndex(activeStatusIndex + 1);
      } else {
        setActiveStatusIndex(null);
      }
    }
  };

  const handlePrevStatus = () => {
    if (activeStatusIndex !== null && activeStatusIndex > 0) {
      setActiveStatusIndex(activeStatusIndex - 1);
    }
  };

  const closeViewer = () => {
    setActiveStatusIndex(null);
    setProgress(0);
  };

  // Lógica para subir archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStatusContent(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishStatus = () => {
    if (!newStatusContent.trim()) return;

    setIsUploading(true);
    
    // Simular latencia de red galáctica
    setTimeout(() => {
      const newStatus: Status = {
        id: `s-new-${Date.now()}`,
        userId: 'current-user',
        userName: 'Tú',
        userImg: 'https://picsum.photos/seed/admin/100',
        type: newStatusType,
        content: newStatusContent,
        color: 'border-red-600',
        timestamp: 'Recién publicado'
      };

      setStatuses([newStatus, ...statuses]);
      setIsCreatorOpen(false);
      setNewStatusContent('');
      setIsUploading(false);
    }, 1500);
  };

  const currentStatus = activeStatusIndex !== null ? statuses[activeStatusIndex] : null;

  return (
    <div className="relative">
      {/* Lista de Diamantes de Estado */}
      <div className="flex gap-6 overflow-x-auto pb-6 px-2 scrollbar-hide">
        {/* Botón para subir estado (TU ESTADO) */}
        <div 
          className="flex flex-col items-center gap-2 cursor-pointer min-w-[80px] group"
          onClick={() => setIsCreatorOpen(true)}
        >
          <div className="relative w-20 h-20 p-1 bg-gradient-to-tr from-red-600/20 to-transparent transform transition-transform duration-300 group-hover:scale-110">
            <div className="w-full h-full p-[3px] bg-black diamond-clip border-2 border-dashed border-red-500/50 group-hover:border-red-500 flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="w-full h-full bg-white/5 diamond-clip flex items-center justify-center overflow-hidden">
                <Upload size={24} className="text-red-500 animate-bounce" />
              </div>
            </div>
            <div className="absolute inset-0 diamond-clip bg-red-600/10 blur-md -z-10 group-hover:bg-red-600/20 transition-all"></div>
          </div>
          <span className="text-[10px] font-futuristic uppercase tracking-[0.2em] text-red-500 font-black group-hover:text-red-400">TU ESTADO</span>
        </div>

        {/* Mapeo de estados existentes */}
        {statuses.map((status, index) => (
          <div 
            key={status.id} 
            className="flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]"
            onClick={() => setActiveStatusIndex(index)}
          >
            <div className={`relative w-20 h-20 p-1 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform transition-transform duration-300 group-hover:scale-110`}>
              <div className={`w-full h-full p-[3px] bg-black diamond-clip border-2 ${status.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all`}>
                <div className="w-full h-full bg-black diamond-clip overflow-hidden">
                  <img src={status.userImg} alt={status.userName} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className={`absolute inset-0 diamond-clip bg-white/10 blur-md -z-10 group-hover:bg-white/30 transition-all`}></div>
            </div>
            <span className="text-[10px] font-futuristic uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
              {status.userName}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL CREADOR DE ESTADOS (POPUP) */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
          <div className="relative w-full max-w-lg bg-[#0a0a0f]/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-cyan-500 to-purple-600"></div>
            
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-red-500" size={24} />
                  <h3 className="text-xl font-black font-futuristic tracking-tighter italic">NUEVO ESTADO</h3>
                </div>
                <button onClick={() => setIsCreatorOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Selector de Tipo */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <button 
                  onClick={() => { setNewStatusType('image'); setNewStatusContent(''); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${newStatusType === 'image' ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  <ImageIcon size={20} />
                  <span className="text-[10px] font-bold uppercase">Foto</span>
                </button>
                <button 
                  onClick={() => { setNewStatusType('video'); setNewStatusContent(''); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${newStatusType === 'video' ? 'bg-cyan-600/20 border-cyan-500 text-cyan-500' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  <VideoIcon size={20} />
                  <span className="text-[10px] font-bold uppercase">Video</span>
                </button>
                <button 
                  onClick={() => { setNewStatusType('text'); setNewStatusContent(''); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${newStatusType === 'text' ? 'bg-purple-600/20 border-purple-500 text-purple-500' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                >
                  <TypeIcon size={20} />
                  <span className="text-[10px] font-bold uppercase">Texto</span>
                </button>
              </div>

              {/* Área de Contenido / Preview */}
              <div className="mb-8">
                {newStatusType === 'text' ? (
                  <textarea 
                    value={newStatusContent}
                    onChange={(e) => setNewStatusContent(e.target.value)}
                    placeholder="¿Qué estás pensando?"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 h-40 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-center text-xl font-futuristic resize-none"
                  ></textarea>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-video bg-black/60 border-2 border-dashed border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-white/30 transition-all group"
                  >
                    {newStatusContent ? (
                      newStatusType === 'image' ? (
                        <img src={newStatusContent} className="w-full h-full object-cover" />
                      ) : (
                        <video src={newStatusContent} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <>
                        <Upload className="text-white/20 group-hover:text-white/60 mb-2 transition-colors" size={40} />
                        <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Seleccionar Archivo</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept={newStatusType === 'image' ? 'image/*' : 'video/*'} 
                      className="hidden" 
                    />
                  </div>
                )}
              </div>

              {/* Botón Publicar */}
              <button 
                onClick={handlePublishStatus}
                disabled={!newStatusContent || isUploading}
                className={`w-full py-5 rounded-2xl font-black font-futuristic tracking-[0.3em] text-sm transition-all flex items-center justify-center gap-3 ${isUploading ? 'bg-white/5 text-white/20 cursor-wait' : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-xl shadow-red-900/20 active:scale-95'}`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    SINCRONIZANDO...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    PUBLICAR EN LA RED
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISOR DE ESTADOS (STORY VIEWER) */}
      {currentStatus && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-lg h-[90vh] md:h-[85vh] mx-auto overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col">
            
            {/* Barras de Progreso */}
            <div className="absolute top-6 left-6 right-6 flex gap-1 z-20">
              {statuses.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-cyan-400 to-red-600 transition-all duration-100 ease-linear ${
                      i < (activeStatusIndex || 0) ? 'w-full' : 
                      i === activeStatusIndex ? `w-[${progress}%]` : 'w-0'
                    }`}
                    style={{ width: i === activeStatusIndex ? `${progress}%` : i < (activeStatusIndex || 0) ? '100%' : '0%' }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Cabecera del Visor */}
            <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 diamond-clip border-2 ${currentStatus.color} p-0.5`}>
                  <img src={currentStatus.userImg} className="w-full h-full diamond-clip object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-widest uppercase font-futuristic">{currentStatus.userName}</h4>
                  <p className="text-[10px] text-white/50">{currentStatus.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {currentStatus.type === 'video' && (
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}
                <button 
                  onClick={closeViewer}
                  className="p-2 bg-white/10 hover:bg-red-600 rounded-full transition-all text-white border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* CONTENIDO DEL ESTADO */}
            <div className="flex-1 w-full relative bg-black flex items-center justify-center">
              {currentStatus.type === 'image' && (
                <img 
                  src={currentStatus.content} 
                  className="w-full h-full object-cover animate-scale-in"
                  alt="Status content"
                />
              )}
              
              {currentStatus.type === 'video' && (
                <video 
                  src={currentStatus.content} 
                  autoPlay 
                  loop 
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
              )}

              {currentStatus.type === 'text' && (
                <div className="w-full h-full flex items-center justify-center p-12 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40 text-center">
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black font-futuristic italic leading-relaxed text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    "{currentStatus.content}"
                  </h3>
                </div>
              )}

              {/* Áreas de clic laterales para navegación rápida */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3 h-full cursor-pointer" onClick={handlePrevStatus}></div>
                <div className="w-1/3 h-full"></div>
                <div className="w-1/3 h-full cursor-pointer" onClick={handleNextStatus}></div>
              </div>
            </div>

            {/* Controles de Navegación Visuales */}
            <button 
              onClick={handlePrevStatus}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-white/20 rounded-full border border-white/10 transition-all ${activeStatusIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNextStatus}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-white/20 rounded-full border border-white/10 transition-all"
            >
              <ChevronRight size={32} />
            </button>

            {/* Input de respuesta rápida */}
            <div className="absolute bottom-10 left-6 right-6 flex gap-3 z-20">
              <input 
                type="text" 
                placeholder="Responde a este estado..." 
                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-red-500 text-sm placeholder-white/30 text-white"
                onClick={(e) => e.stopPropagation()}
              />
              <button className="bg-red-600 p-4 rounded-2xl hover:scale-110 transition-transform">
                🔥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSection;
