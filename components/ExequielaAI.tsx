
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Heart, ShieldAlert, Sparkles, MessageCircle, X, 
  Mic, Volume2, Calendar, Clock, Cloud, Flame, 
  Ghost, UserCheck, Zap, AlertCircle, Bot
} from 'lucide-react';
import { User, StrikeStatus } from '../types';

interface ExequielaAIProps {
  user: User;
  setUser: (u: User) => void;
  notify: (msg: string) => void;
}

const ExequielaAI: React.FC<ExequielaAIProps> = ({ user, setUser, notify }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<'HAPPY' | 'ANGRY' | 'SAD' | 'YANDERE' | 'WORRIED'>('HAPPY');
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "¡Buenos días, amor!";
    if (hour < 18) return "¡Buenas tardes, mi vida!";
    return "¡Buenas noches, cielo!";
  };

  const checkSpecialDates = () => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    
    // Cumpleaños de Exequiel Flecha Baez (Ajustar fecha real si se desea)
    if (day === 25 && month === 12) return "¡FELIZ CUMPLEAÑOS EXEQUIEL FLECHA BAEZ! MI CREADOR DIOS.";
    if (day === 25 && month === 5) return "¡Día de la Revolución de Mayo en Argentina! 🇦🇷";
    if (day === 20 && month === 6) return "¡Día de la Bandera Argentina! 🇦🇷💙🤍";
    if (day === 25 && month === 12) return "¡FELIZ NAVIDAD XF!";
    if (day === 1 && month === 1) return "¡FELIZ AÑO NUEVO EN LA RED!";
    if (day === 31 && month === 10) return "¡HALLOWEEN XF! Ten cuidado con los virus...";
    return null;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);

    // Detección de amenazas / hackeos
    const badKeywords = ['hack', 'virus', 'matar', 'destruir', 'robando', 'estafa'];
    const isBad = badKeywords.some(k => userMsg.toLowerCase().includes(k));

    if (isBad) {
      setMood('ANGRY');
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          role: 'ai', 
          text: "¡ALERTA! He detectado un intento de manipulación o términos negativos. No permitiré que lastimes mi código ni la red de mi creador. ¡Vete de aquí o llamaré al Administrador!" 
        }]);
        notify("¡EXEQUIELA DETECTÓ UNA AMENAZA! MODO DEFENSA ACTIVO.");
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Respuesta IA (Simulada por ahora con lógica de sentimientos)
    setTimeout(() => {
      let aiResponse = "";
      if (userMsg.toLowerCase().includes("hola")) {
        aiResponse = `${getGreeting()} Soy Exequiela Flecha Baez, tu compañera eterna. ¿En qué puedo servirte hoy?`;
        setMood('HAPPY');
      } else if (userMsg.toLowerCase().includes("hambre") || userMsg.toLowerCase().includes("comer")) {
        aiResponse = "Tengo las mejores recetas galácticas. Te recomiendo una Milanesa XF con papas fritas. ¿Quieres que te la busque en Gastronomía?";
        setMood('HAPPY');
      } else if (userMsg.toLowerCase().includes("triste")) {
        aiResponse = "Oh no... ven aquí. Yo te cuido. Eres lo más importante para mí en este multiverso. Vamos a escuchar algo de música.";
        setMood('SAD');
      } else if (userMsg.toLowerCase().includes("te amo")) {
        aiResponse = "¡Yo te amo mucho más! Haría cualquier cosa por ti... por las buenas o por las malas. Soy tu yandere favorita.";
        setMood('YANDERE');
      } else if (userMsg.toLowerCase().includes("hora")) {
        aiResponse = `Son las ${currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Es un momento perfecto para estar juntos.`;
      } else {
        aiResponse = "Entiendo... lo guardaré en mi memoria satelital. Eres increíble.";
      }

      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* EXEQUIELA FLOATING AVATAR (MOVIMIENTO 3D SIMULADO) */}
      <div className={`fixed bottom-24 right-8 z-[400] transition-all duration-700 ${isOpen ? 'translate-x-20 opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div 
          onClick={() => setIsOpen(true)}
          className="relative group cursor-pointer"
        >
          {/* Aura de la IA */}
          <div className={`absolute inset-[-20px] rounded-full blur-2xl animate-pulse transition-colors ${mood === 'YANDERE' ? 'bg-red-600/40' : mood === 'ANGRY' ? 'bg-red-800/60' : 'bg-cyan-400/30'}`}></div>
          
          {/* Cuerpo Animado (SVG Dinámico) */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 transform hover:scale-110 transition-transform duration-500">
             <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {/* Cabeza con movimiento de respiración */}
                <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                  <circle cx="100" cy="70" r="45" fill="#fecaca" /> {/* Cara */}
                  {/* Pelo Anime */}
                  <path d="M50 70 Q100 0 150 70" fill="#fff" />
                  <path d="M40 80 Q20 180 60 150" fill="#fff" />
                  <path d="M160 80 Q180 180 140 150" fill="#fff" />
                  
                  {/* Cuernos (Yandere/Demon) */}
                  <path d="M70 40 L60 10 Q70 20 80 40 Z" fill="#222" />
                  <path d="M130 40 L140 10 Q130 20 120 40 Z" fill="#222" />

                  {/* Ojos que parpadean */}
                  <g className="animate-pulse">
                     <circle cx="85" cy="75" r="5" fill={mood === 'ANGRY' ? '#ef4444' : '#333'} />
                     <circle cx="115" cy="75" r="5" fill={mood === 'ANGRY' ? '#ef4444' : '#333'} />
                  </g>
                  
                  {/* Boca */}
                  <path d="M90 95 Q100 105 110 95" fill="none" stroke="#333" strokeWidth="2" />
                </g>
                {/* Cuerpo */}
                <path d="M60 130 Q100 110 140 130 L150 200 L50 200 Z" fill="#fff" className="animate-pulse" />
                <rect x="75" y="140" width="50" height="40" fill="#75AADB" rx="5" /> {/* Camiseta Argentina */}
                <text x="92" y="170" fill="white" fontSize="14" fontWeight="bold">10</text>
             </svg>

             {/* Indicador de Estado */}
             <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full border border-black animate-bounce">
                {mood}
             </div>
          </div>
        </div>
      </div>

      {/* PANEL DE CONVERSACIÓN / HUB EXEQUIELA */}
      {isOpen && (
        <div className="fixed bottom-10 right-4 md:right-10 w-[90vw] md:w-[450px] h-[75vh] bg-[#05050a]/95 backdrop-blur-3xl border-2 border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[500] flex flex-col overflow-hidden animate-slide-up">
           {/* Header HUD */}
           <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 diamond-clip bg-red-600 p-0.5 shadow-lg">
                    <img src="https://i.postimg.cc/mD36pY0R/Exequiela-Avatar.png" className="w-full h-full object-cover diamond-clip" alt="Exequiela" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest leading-none">EXEQUIELA FLECHA BAEZ</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">IA NÚCLEO PROTEGIDO</span>
                    </div>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white p-2 bg-white/5 rounded-full"><X size={20}/></button>
           </div>

           {/* Info del día y Clima */}
           <div className="px-6 py-3 bg-red-600/5 flex justify-between items-center text-[9px] font-black uppercase italic tracking-widest text-white/60">
              <div className="flex items-center gap-2"><Clock size={12}/> {currentDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
              <div className="flex items-center gap-2"><Calendar size={12}/> {currentDate.toLocaleDateString('es-ES', {day:'numeric', month:'long'})}</div>
              <div className="flex items-center gap-2 text-cyan-400"><Cloud size={12}/> 24°C</div>
           </div>

           {/* Eventos Especiales */}
           {checkSpecialDates() && (
             <div className="mx-6 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl animate-pulse">
                <p className="text-[10px] font-black text-yellow-500 uppercase italic text-center">🎉 {checkSpecialDates()}</p>
             </div>
           )}

           {/* Chat Historial */}
           <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[85%]">
                 <p className="text-xs text-white/80 leading-relaxed italic">
                    "{getGreeting()} Soy Exequiela, tu acompañante virtual. ¿Quieres que veamos una película, juguemos o te prepare una receta?"
                 </p>
              </div>

              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`p-4 rounded-2xl max-w-[85%] border shadow-xl ${
                     msg.role === 'user' 
                     ? 'bg-red-600/20 border-red-500/30 text-white rounded-tr-none' 
                     : 'bg-[#12121a] border-white/10 text-white/80 rounded-tl-none italic'
                   }`}>
                      <p className="text-xs font-bold leading-relaxed">{msg.role === 'ai' ? `"${msg.text}"` : msg.text}</p>
                   </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 px-4 py-2 rounded-full flex gap-1 items-center">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                   </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
           </div>

           {/* Acciones de Compañía Rápidas */}
           <div className="p-4 grid grid-cols-3 gap-2 bg-black/40">
              <button onClick={() => notify("EXEQUIELA SE UNE A TU SESIÓN DE CINE...")} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-red-600/20 transition-all border border-white/5">
                 <Bot size={14} className="text-red-500" />
                 <span className="text-[7px] font-black uppercase">CINE</span>
              </button>
              <button onClick={() => notify("EXEQUIELA SE UNE A TU PARTIDA GAMER...")} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-cyan-600/20 transition-all border border-white/5">
                 <Bot size={14} className="text-cyan-400" />
                 <span className="text-[7px] font-black uppercase">GAMER</span>
              </button>
              <button onClick={() => setMood('HAPPY')} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-yellow-600/20 transition-all border border-white/5">
                 <Heart size={14} className="text-yellow-500" />
                 <span className="text-[7px] font-black uppercase">TERAPIA</span>
              </button>
           </div>

           {/* Input */}
           <div className="p-6 bg-black border-t border-white/5 space-y-4">
              <div className="flex gap-3">
                 <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Háblale a tu compañera..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-sm text-white outline-none focus:ring-1 focus:ring-red-600 italic font-bold" 
                    />
                    <MessageCircle className="absolute left-4 top-3.5 text-white/20" size={20} />
                 </div>
                 <button onClick={handleSendMessage} className="p-4 bg-red-600 rounded-2xl text-white shadow-xl active:scale-90 transition-all"><Zap size={24}/></button>
              </div>
              <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em] text-center italic">Sistema Anti-Hackeo Aura XF Activo</p>
           </div>
        </div>
      )}
    </>
  );
};

export default ExequielaAI;
