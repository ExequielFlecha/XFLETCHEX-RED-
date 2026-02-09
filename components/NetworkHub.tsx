
import React, { useState, useEffect } from 'react';
import { 
  Wifi, Smartphone, Bluetooth, Zap, ShieldCheck, 
  Satellite, Globe, Radio, Signal, Loader2, X,
  CheckCircle, AlertTriangle, RefreshCcw, Activity
} from 'lucide-react';

interface NetworkHubProps {
  notify: (msg: string) => void;
}

const NetworkHub: React.FC<NetworkHubProps> = ({ notify }) => {
  const [activeMethod, setActiveMethod] = useState<'WIFI' | 'DATA' | 'BLUETOOTH'>('WIFI');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'SEARCHING'>('CONNECTED');
  const [signalStrength, setSignalStrength] = useState(95);
  const [speed, setSpeed] = useState('850 Mbps');

  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === 'CONNECTED') {
        setSignalStrength(prev => Math.max(70, Math.min(100, prev + (Math.random() * 10 - 5))));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleConnect = (method: typeof activeMethod) => {
    setActiveMethod(method);
    setIsConnecting(true);
    setConnectionStatus('SEARCHING');
    
    // Simulación de enlace cuántico
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus('CONNECTED');
      if (method === 'BLUETOOTH') {
        setSpeed('12 Mbps (Malla Local)');
        notify("CONEXIÓN BLUETOOTH MESH ACTIVADA - NAVEGACIÓN GRATUITA.");
      } else if (method === 'DATA') {
        setSpeed('1.2 Gbps (5G XF)');
        notify("DATOS MÓVILES 5G SINCRONIZADOS.");
      } else {
        setSpeed('850 Mbps (Fiber WiFi)');
        notify("WIFI GALÁCTICO ENLAZADO.");
      }
    }, 2500);
  };

  const NetworkCard = ({ title, icon: Icon, description, method, active, statusText }: any) => (
    <div 
      onClick={() => handleConnect(method)}
      className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group overflow-hidden ${
        active 
        ? 'bg-cyan-600/10 border-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.2)] scale-[1.02]' 
        : 'bg-[#0a0a0f] border-white/5 hover:border-white/20'
      }`}
    >
      <div className={`absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform ${active ? 'opacity-10' : ''}`}>
        <Icon size={120} />
      </div>

      <div className="relative z-10 flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl border ${active ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-white/40 border-white/10'}`}>
          <Icon size={28} className={active ? 'animate-pulse' : ''} />
        </div>
        {active && (
          <div className="bg-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest border border-cyan-500/30">
            {statusText}
          </div>
        )}
      </div>

      <h3 className={`text-2xl font-black font-futuristic italic uppercase tracking-tighter mb-2 ${active ? 'text-white' : 'text-white/60'}`}>
        {title}
      </h3>
      <p className="text-xs text-white/30 font-medium italic leading-relaxed pr-8">
        {description}
      </p>

      {active && (
        <div className="mt-8 flex items-end gap-1 h-12">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-t-md transition-all duration-700 ${i < Math.floor(signalStrength/20) ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-white/5'}`}
              style={{ height: `${20 + i * 20}%` }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-40 animate-fade-in font-rajdhani">
      
      {/* HEADER DE CONECTIVIDAD */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-cyan-600/20 rounded-[2.5rem] flex items-center justify-center border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(34,211,238,0.3)]">
              <Satellite className="text-cyan-400 animate-spin-slow" size={40} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-black font-futuristic italic uppercase tracking-tighter text-white">ENLACE <span className="text-cyan-500">RED-XF</span></h1>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mt-2 italic">MULTI-PROTOCOLO • WIFI • DATOS • BLUETOOTH</p>
           </div>
        </div>

        <div className="bg-black/60 p-6 rounded-[2rem] border border-white/5 backdrop-blur-xl flex items-center gap-8 shadow-2xl">
           <div className="flex flex-col items-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">LATENCIA</p>
              <p className="text-xl font-black text-green-500 italic">14ms</p>
           </div>
           <div className="w-px h-10 bg-white/10"></div>
           <div className="flex flex-col items-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">VELOCIDAD</p>
              <p className="text-xl font-black text-cyan-400 italic">{speed}</p>
           </div>
           <div className="w-px h-10 bg-white/10"></div>
           <div className="flex flex-col items-center">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">MODO</p>
              <p className="text-xl font-black text-red-500 italic">{activeMethod}</p>
           </div>
        </div>
      </div>

      {/* GRID DE MÉTODOS DE CONEXIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <NetworkCard 
          title="WIFI INTERNET"
          icon={Wifi}
          method="WIFI"
          description="Enlace de alta capacidad mediante fibra óptica. Ideal para Streaming 4K y Cine XF."
          active={activeMethod === 'WIFI'}
          statusText="FIBRA ACTIVA"
        />
        <NetworkCard 
          title="DATOS MÓVILES"
          icon={Smartphone}
          method="DATA"
          description="Sincronización 5G de baja latencia para Gaming y GPS en cualquier lugar del planeta."
          active={activeMethod === 'DATA'}
          statusText="5G ONLINE"
        />
        <NetworkCard 
          title="BLUETOOTH MESH"
          icon={Bluetooth}
          method="BLUETOOTH"
          description="CONEXIÓN GRATUITA. Salta entre dispositivos cercanos de la Red XF sin gastar internet."
          active={activeMethod === 'BLUETOOTH'}
          statusText="MALLA LIBRE"
        />
      </div>

      {/* ÁREA DE ESTADO TÁCTICO */}
      <div className="bg-[#08080c] border-2 border-white/5 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
         {isConnecting ? (
           <div className="py-20 flex flex-col items-center justify-center text-center space-y-10 animate-pulse">
              <div className="relative">
                 <div className="w-32 h-32 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
                 <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400" size={40} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SINCRONIZANDO CANALES...</h3>
                 <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.5em] italic">AUTENTICANDO ADN VIRTUAL EN SATÉLITE XF</p>
              </div>
           </div>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                 <div className="w-24 h-24 bg-green-600/20 rounded-[2rem] border-2 border-green-500/30 flex items-center justify-center text-green-500 shadow-2xl mb-8">
                    <Activity size={48} className="animate-pulse" />
                 </div>
                 <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight mb-4">SEGURIDAD DE RED<br/><span className="text-green-500">MÁXIMA</span></h3>
                 <div className="flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10">
                    <ShieldCheck className="text-cyan-400" size={16} />
                    <span className="text-[10px] font-black text-white/60 uppercase italic tracking-widest">CIFRADO DE GRADO MILITAR</span>
                 </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Estado de Antena</p>
                       <span className="text-[8px] font-black text-green-500">ESTABLE</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-cyan-500 w-[92%]" style={{ width: `${signalStrength}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold italic text-white/40">
                       <span>PING: 14ms</span>
                       <span>JITTER: 2ms</span>
                    </div>
                 </div>

                 <div className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Seguridad DNS</p>
                       <span className="text-[8px] font-black text-red-500">ACTIVO</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3 text-white/60 font-black text-[10px] uppercase italic">
                          <CheckCircle size={14} className="text-green-500"/> IP Protegida (XF-VPN)
                       </div>
                       <div className="flex items-center gap-3 text-white/60 font-black text-[10px] uppercase italic">
                          <CheckCircle size={14} className="text-green-500"/> Filtro de Intrusion IA
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* FOOTER DE CONECTIVIDAD */}
      <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
         <div className="flex items-center gap-4">
            <Globe size={40} className="text-white" />
            <div>
               <p className="text-xl font-black text-white italic leading-none">PC & TABLET</p>
               <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Full Compatible</p>
            </div>
         </div>
         <div className="w-px h-12 bg-white/10 hidden md:block"></div>
         <div className="flex items-center gap-4">
            <Smartphone size={40} className="text-white" />
            <div>
               <p className="text-xl font-black text-white italic leading-none">MÓVIL ANDROID/iOS</p>
               <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Modo Dual XF</p>
            </div>
         </div>
         <div className="w-px h-12 bg-white/10 hidden md:block"></div>
         <div className="flex items-center gap-4">
            <Radio size={40} className="text-white" />
            <div>
               <p className="text-xl font-black text-white italic leading-none">MALLA BLUETOOTH</p>
               <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">Navegación Sin Límites</p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default NetworkHub;
