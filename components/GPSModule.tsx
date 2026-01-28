
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Navigation, Globe, Compass, 
  Map as MapIcon, ShieldCheck, Zap, ExternalLink, Loader2, Power, 
  Flag, Globe2, Plane, ArrowRight,
  LocateFixed, Navigation2, Layers, Maximize2, Satellite
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const REGIONES_MUNDIALES = [
  { nombre: 'Latinoamérica', zoom: '4', coords: '-15,-60', flag: '🌎' },
  { nombre: 'Europa', zoom: '4', coords: '50,10', flag: '🇪🇺' },
  { nombre: 'Asia', zoom: '3', coords: '30,100', flag: '🏮' },
  { nombre: 'Argentina', zoom: '5', coords: '-38,-63', flag: '🇦🇷' },
  { nombre: 'USA', zoom: '4', coords: '37,-95', flag: '🇺🇸' }
];

const GPSModule: React.FC = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2s!4v1710000000000!5m2!1ses!2s');
  const [isLoading, setIsLoading] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);

  // Simulación de potencia de señal satelital
  useEffect(() => {
    if (isActivated) {
      const interval = setInterval(() => {
        setSignalStrength(Math.floor(Math.random() * (100 - 85 + 1)) + 85);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isActivated]);

  const syncLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentLocation({ lat, lng });
          // Actualizar mapa a la ubicación real del usuario
          setMapUrl(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2s!4v1710000000000!5m2!1ses!2s`);
        },
        (err) => {
          console.error("GPS Error:", err);
          // Fallback a coordenadas de Buenos Aires si falla
          setMapUrl(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100000!2d-58.3816!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2s!4v1710000000000!5m2!1ses!2s`);
        }
      );
    }
  };

  const handleActivate = () => {
    setIsActivated(true);
    setShowActivationModal(false);
    syncLocation();
  };

  const handleCancel = () => {
    setIsActivated(false);
    setShowActivationModal(false);
  };

  const handleSearch = async (queryOverride?: string) => {
    const query = queryOverride || searchQuery;
    if (!isActivated) {
      setShowActivationModal(true);
      return;
    }
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Generar URL de mapa embebido basado en la búsqueda
    const encodedQuery = encodeURIComponent(query);
    setMapUrl(`https://www.google.com/maps?q=${encodedQuery}&output=embed&z=15`);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-8 relative font-rajdhani">
      
      {/* MODAL DE ACTIVACIÓN GPS TÁCTICO */}
      {showActivationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
          <div className="w-full max-w-lg bg-[#05050a] border border-red-500/30 rounded-[3.5rem] p-12 text-center shadow-[0_0_150px_rgba(220,38,38,0.2)] animate-scale-in overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
             
             <div className="relative w-28 h-28 mx-auto mb-10">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center border-2 border-red-400 shadow-[0_0_40px_rgba(220,38,38,0.5)]">
                   <Navigation2 className="text-white animate-bounce" size={48} />
                </div>
             </div>

             <h2 className="text-4xl font-black font-futuristic italic text-white uppercase mb-6 tracking-tighter">ENLACE SATELITAL X-RED</h2>
             <p className="text-white/50 text-xl mb-10 leading-relaxed font-medium">
               Para visualizar el **MAPA REAL** con calles, rutas de Latinoamérica, Europa y Asia, el sistema requiere acceso a sus coordenadas GPS. 
             </p>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={handleActivate}
                  className="bg-red-600 hover:bg-red-500 text-white font-black font-futuristic py-6 rounded-3xl shadow-2xl shadow-red-900/40 transition-all uppercase italic flex items-center justify-center gap-4 text-lg tracking-widest active:scale-95"
                >
                  <Satellite size={24} /> ACTIVAR GPS REAL
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-white/5 hover:bg-white/10 text-white/40 font-bold py-5 rounded-2xl border border-white/10 transition-all uppercase text-sm"
                >
                  CANCELAR ACCESO
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Panel de Control de Navegación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar de Rutas y Estado */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-black/60 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-50"></div>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Compass className={isActivated ? "text-white animate-spin-slow" : "text-white/20"} size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black font-futuristic italic text-white leading-none">GPS STATUS</h3>
                    <p className="text-[10px] text-red-500 font-bold tracking-[0.2em] uppercase mt-1">
                       {isActivated ? 'CONECTADO AL SATÉLITE' : 'SIN SEÑAL'}
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] text-white/30 font-black uppercase mb-1">Señal Satelital</p>
                    <div className="flex items-end gap-1 h-8">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${isActivated && i < 4 ? 'bg-red-500' : 'bg-white/10'}`} style={{ height: `${20 + (i * 20)}%` }}></div>
                       ))}
                       <span className="ml-2 text-xs font-bold text-white">{isActivated ? `${signalStrength}%` : '0%'}</span>
                    </div>
                 </div>

                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] text-white/30 font-black uppercase mb-1">Coordenadas Actuales</p>
                    <p className="text-xs font-mono text-cyan-400 font-bold">
                       {isActivated ? `${currentLocation?.lat.toFixed(6)}, ${currentLocation?.lng.toFixed(6)}` : 'BLOQUEADO'}
                    </p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">ACCESOS RÁPIDOS MUNDIALES</h4>
                 <div className="grid grid-cols-1 gap-2">
                    {REGIONES_MUNDIALES.map((reg, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSearch(reg.nombre)}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-red-600/20 border border-white/5 rounded-xl transition-all group"
                      >
                         <span className="text-xl">{reg.flag}</span>
                         <span className="text-xs font-bold text-white/70 group-hover:text-white uppercase">{reg.nombre}</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <button 
            onClick={() => setIsActivated(false)}
            className="w-full py-5 bg-white/5 hover:bg-red-600/10 border border-white/10 rounded-[2rem] text-white/40 hover:text-red-500 font-black text-xs uppercase transition-all flex items-center justify-center gap-3"
           >
              <Power size={16} /> DESCONECTAR GPS
           </button>
        </div>

        {/* Área del Mapa Real e Interactivo */}
        <div className="lg:col-span-9 space-y-6">
           <div className="bg-black/40 border border-white/10 p-4 rounded-[3.5rem] relative overflow-hidden flex flex-col h-[700px] shadow-2xl">
              
              {/* Toolbar del Mapa */}
              <div className="absolute top-8 left-8 right-8 z-10 flex flex-col md:flex-row gap-4">
                 <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Escriba País, Ciudad o Calle exacta..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl py-4 px-14 outline-none focus:ring-2 focus:ring-red-600/50 text-white font-bold placeholder-white/30 shadow-2xl"
                    />
                    <Search className="absolute left-5 top-4 text-red-500" size={24} />
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleSearch()}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-500 p-4 rounded-2xl text-white transition-all shadow-xl shadow-red-900/40 disabled:opacity-50 active:scale-90"
                    >
                      {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Navigation size={24} />}
                    </button>
                    <button 
                      onClick={syncLocation}
                      className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-white border border-white/10 transition-all active:scale-90"
                      title="Mi Ubicación Real"
                    >
                      <LocateFixed size={24} />
                    </button>
                 </div>
              </div>

              {/* CONTENEDOR DEL MAPA REAL */}
              <div className="flex-1 w-full bg-[#111] rounded-[2.5rem] overflow-hidden relative group">
                 {!isActivated ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-center p-12">
                       <Globe2 size={100} className="text-white/10 mb-8 animate-pulse" />
                       <h3 className="text-3xl font-black font-futuristic text-white/20 italic uppercase tracking-tighter mb-4">SISTEMA DE MAPA OFFLINE</h3>
                       <p className="max-w-md text-white/20 font-bold uppercase tracking-widest text-xs leading-relaxed mb-10">
                         Active la conexión satelital para cargar el motor de mapas real de Latinoamérica, Europa y Asia. 
                       </p>
                       <button 
                         onClick={() => setShowActivationModal(true)}
                         className="px-12 py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black font-futuristic text-xs tracking-[0.3em] shadow-2xl shadow-red-900/40 transition-all uppercase italic"
                       >
                         INICIAR CONEXIÓN REAL
                       </button>
                    </div>
                 ) : (
                    <>
                      {isLoading && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                           <div className="flex flex-col items-center gap-6">
                              <div className="w-20 h-20 border-4 border-white/10 border-t-red-600 rounded-full animate-spin"></div>
                              <p className="text-white/40 font-black font-futuristic text-[10px] tracking-[0.5em] animate-pulse uppercase">SINCRONIZANDO CALLEJERO MUNDIAL...</p>
                           </div>
                        </div>
                      )}
                      
                      <iframe 
                        src={mapUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.2)' }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="transition-opacity duration-700"
                      ></iframe>

                      {/* Overlays HUD del Mapa */}
                      <div className="absolute bottom-8 left-8 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl pointer-events-none group-hover:opacity-100 opacity-30 transition-opacity">
                         <div className="flex items-center gap-3 mb-2">
                            <Layers className="text-red-500" size={16} />
                            <span className="text-[10px] font-black uppercase text-white tracking-widest">Capas de Datos Activas</span>
                         </div>
                         <div className="flex gap-2">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[8px] font-bold rounded-md border border-green-500/30 uppercase">Rutas OK</span>
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[8px] font-bold rounded-md border border-cyan-500/30 uppercase">Tráfico IA</span>
                         </div>
                      </div>

                      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                         <button className="p-3 bg-black/80 border border-white/10 rounded-xl text-white hover:bg-red-600 transition-all shadow-xl"><Maximize2 size={20} /></button>
                         <button className="p-3 bg-black/80 border border-white/10 rounded-xl text-white hover:bg-red-600 transition-all shadow-xl"><Layers size={20} /></button>
                      </div>
                    </>
                 )}
              </div>

              {/* Barra de Estado Inferior */}
              <div className="mt-4 flex items-center justify-between px-6">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-500" size={18} />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Navegación Cifrada de Extremo a Extremo</span>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Latam Server: ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Euro Node: ACTIVE</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Tarjetas de Información de Viaje */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 group hover:bg-red-600/10 transition-all cursor-pointer">
                 <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <Plane size={24} />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Viajes Aéreos</h5>
                    <p className="text-xs font-bold text-white uppercase italic">Puertas de Enlace</p>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 group hover:bg-cyan-600/10 transition-all cursor-pointer">
                 <div className="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Navigation size={24} />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Rutas Terrestres</h5>
                    <p className="text-xs font-bold text-white uppercase italic">Caminos Optimizados</p>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 group hover:bg-purple-600/10 transition-all cursor-pointer">
                 <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <MapIcon size={24} />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase text-white/30 tracking-widest">Mapa de Calor</h5>
                    <p className="text-xs font-bold text-white uppercase italic">Zonas de Interés</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GPSModule;
