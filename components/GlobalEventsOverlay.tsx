
import React, { useState, useEffect, useRef } from 'react';
import { 
  Snowflake, Ghost, Gift, Heart, Trophy, 
  Circle, Star, Sparkles, Zap, Flame,
  Flag
} from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  iconType: 'SNOW' | 'GHOST' | 'GIFT' | 'EGG' | 'FLAG_AR' | 'SATAN' | 'SOCCER' | 'CAMEL' | 'FIREWORK';
  color?: string;
}

const GlobalEventsOverlay: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const requestRef = useRef<number>(null);
  const particleIdCounter = useRef(0);

  // DETECCIÓN AUTOMÁTICA DE FECHA
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1; // JS months are 0-11
    const day = now.getDate();
    const year = now.getFullYear();

    // NAVIDAD: 25 Diciembre
    if (month === 12 && day === 25) setActiveEvent('NAVIDAD');
    // AÑO NUEVO: 31 Dic y 1 Ene
    else if ((month === 12 && day === 31) || (month === 1 && day === 1)) setActiveEvent('AÑO_NUEVO');
    // HALLOWEEN: 31 Octubre
    else if (month === 10 && day === 31) setActiveEvent('HALLOWEEN');
    // CUMPLEAÑOS EXEQUIEL: 2 Septiembre
    else if (month === 9 && day === 2) setActiveEvent('BIRTHDAY_XF');
    // PASCUA (Día fijo pedido): 21 Marzo
    else if (month === 3 && day === 21) setActiveEvent('PASCUA');
    // DÍA DE LA BANDERA ARGENTINA: 20 Junio
    else if (month === 6 && day === 20) setActiveEvent('BANDERA_AR');
    // DÍA "SATÁNICO" XF: 14 Febrero
    else if (month === 2 && day === 14) setActiveEvent('SATANIC_DAY');
    // REYES MAGOS: 6 Enero
    else if (month === 1 && day === 6) setActiveEvent('REYES_MAGOS');
    // ELECCIONES / FIESTA PRESIDENTES (Cada 4 años, ej. 2027)
    else if (year % 4 === 3 && month === 10 && day === 24) setActiveEvent('PRESIDENTES_AR');
    // MUNDIAL (Semanas de victoria o aniversarios, ej 18 dic)
    else if (month === 12 && day === 18) setActiveEvent('MUNDIAL');
    else setActiveEvent(null);

  }, []);

  const createParticle = (type: Particle['iconType'], isFirework = false) => {
    return {
      id: particleIdCounter.current++,
      x: Math.random() * window.innerWidth,
      y: isFirework ? window.innerHeight : -50,
      size: Math.random() * (type === 'FIREWORK' ? 6 : 24) + 12,
      speedY: isFirework ? (Math.random() * -10 - 5) : (Math.random() * 2 + 1),
      speedX: (Math.random() - 0.5) * 2,
      opacity: 1,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      iconType: type,
      color: type === 'FIREWORK' ? `hsl(${Math.random() * 360}, 100%, 50%)` : undefined
    };
  };

  useEffect(() => {
    if (!activeEvent) {
      setParticles([]);
      return;
    }

    // Inicializar ráfaga
    let initialCount = 20;
    let type: Particle['iconType'] = 'SNOW';
    
    if (activeEvent === 'NAVIDAD') type = 'SNOW';
    if (activeEvent === 'AÑO_NUEVO') type = 'FIREWORK';
    if (activeEvent === 'HALLOWEEN') type = 'GHOST';
    if (activeEvent === 'BIRTHDAY_XF') type = 'GIFT';
    if (activeEvent === 'PASCUA') type = 'EGG';
    if (activeEvent === 'BANDERA_AR') type = 'FLAG_AR';
    if (activeEvent === 'SATANIC_DAY') type = 'SATAN';
    if (activeEvent === 'REYES_MAGOS') type = 'CAMEL';
    if (activeEvent === 'MUNDIAL') type = 'SOCCER';
    if (activeEvent === 'PRESIDENTES_AR') type = 'FLAG_AR'; // Se combina con fireworks en el render

    const initParticles = Array.from({ length: initialCount }).map(() => createParticle(type, activeEvent === 'AÑO_NUEVO'));
    setParticles(initParticles);

    const animate = () => {
      setParticles(prev => {
        const next = prev.map(p => ({
          ...p,
          y: p.y + p.speedY,
          x: p.x + p.speedX,
          rotation: p.rotation + p.rotSpeed,
          opacity: p.iconType === 'FIREWORK' ? p.opacity - 0.01 : p.opacity
        })).filter(p => p.y < window.innerHeight + 100 && p.opacity > 0);

        // Añadir nuevos si faltan
        if (next.length < 30) {
          next.push(createParticle(type, activeEvent === 'AÑO_NUEVO'));
          if (activeEvent === 'PRESIDENTES_AR' || activeEvent === 'MUNDIAL') {
             next.push(createParticle(activeEvent === 'MUNDIAL' ? 'SOCCER' : 'FIREWORK', activeEvent === 'PRESIDENTES_AR'));
          }
        }
        return next;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeEvent]);

  if (!activeEvent) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden select-none">
       {particles.map(p => (
         <div 
           key={p.id}
           className="absolute transition-transform duration-75"
           style={{ 
             left: p.x, 
             top: p.y, 
             opacity: p.opacity,
             transform: `rotate(${p.rotation}deg) scale(${p.size / 24})`,
             color: p.color
           }}
         >
           {renderIcon(p.iconType, p.color)}
         </div>
       ))}
       
       {/* Banner de Evento superior sutil */}
       <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full shadow-2xl animate-bounce">
          <p className="text-[10px] font-black text-white uppercase italic tracking-[0.4em] flex items-center gap-4">
             <Sparkles size={14} className="text-yellow-400" />
             {getEventTitle(activeEvent)}
             <Sparkles size={14} className="text-yellow-400" />
          </p>
       </div>
    </div>
  );
};

const getEventTitle = (event: string) => {
  switch(event) {
    case 'NAVIDAD': return 'FELIZ NAVIDAD EN LA RED XF';
    case 'AÑO_NUEVO': return '¡FELIZ AÑO NUEVO GALÁCTICO!';
    case 'HALLOWEEN': return 'NOCHE DE TERROR XFLETCHAX';
    case 'BIRTHDAY_XF': return 'CUMPLEAÑOS DEL CREADOR DIOS (EXEQUIEL)';
    case 'PASCUA': return 'PASCUAS XF - CHOCOLATE PARA TODOS';
    case 'BANDERA_AR': return 'DÍA DE LA BANDERA ARGENTINA 🇦🇷';
    case 'SATANIC_DAY': return 'ESTÉTICA SATÁNICA XF ACTIVADA';
    case 'REYES_MAGOS': return 'REYES MAGOS: REGALOS EN CAMINO';
    case 'PRESIDENTES_AR': return 'CELEBRACIÓN PRESIDENCIAL ARGENTINA';
    case 'MUNDIAL': return 'CAMPEONES DEL MUNDO - XF SPORT';
    default: return 'EVENTO ESPECIAL XF';
  }
};

const renderIcon = (type: Particle['iconType'], color?: string) => {
  switch(type) {
    case 'SNOW': return <Snowflake className="text-white drop-shadow-[0_0_8px_#fff]" />;
    case 'GHOST': return <Ghost className="text-white/60" />;
    case 'GIFT': return <Gift className="text-yellow-400 drop-shadow-[0_0_10px_#facc15]" />;
    case 'EGG': return (
      <div className="w-8 h-10 bg-gradient-to-br from-amber-900 to-amber-600 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border border-yellow-500/30 flex items-center justify-center">
        <Sparkles size={10} className="text-yellow-200 opacity-40" />
      </div>
    );
    case 'FLAG_AR': return (
      <div className="flex flex-col w-12 h-8 border border-white/20 shadow-xl">
        <div className="flex-1 bg-[#75AADB]"></div>
        <div className="flex-1 bg-white flex items-center justify-center"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div></div>
        <div className="flex-1 bg-[#75AADB]"></div>
      </div>
    );
    case 'SATAN': return (
      <div className="relative">
         <Star className="text-red-600 drop-shadow-[0_0_15px_#dc2626]" style={{ transform: 'rotate(180deg)' }} />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-6 border-l-2 border-b-2 border-red-600" style={{ transform: 'rotate(180deg)' }}></div>
      </div>
    );
    case 'SOCCER': return (
       <div className="relative">
          <Circle className="text-white fill-white/10" size={24} />
          <Trophy className="absolute -top-4 -right-4 text-yellow-500" size={16} />
       </div>
    );
    case 'CAMEL': return <span className="text-4xl">🐫</span>;
    case 'FIREWORK': return <div className="w-2 h-2 rounded-full shadow-[0_0_20px_currentColor]" style={{ backgroundColor: color }}></div>;
    default: return <Sparkles />;
  }
};

export default GlobalEventsOverlay;
