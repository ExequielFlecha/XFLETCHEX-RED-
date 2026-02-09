
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Heart, ShieldAlert, Sparkles, MessageCircle, X, 
  Mic, Volume2, Calendar, Clock, Cloud, Flame, 
  Ghost, UserCheck, Zap, AlertCircle, Bot, GraduationCap,
  BookOpen, Search, Image as ImageIcon, Video, CheckCircle2,
  CalendarDays, School, Award, BrainCircuit, Globe, Loader2,
  ChevronRight, LibraryBig, Microscope, Binary, Languages as LangIcon
} from 'lucide-react';
import { User, StrikeStatus } from '../types';

interface ExequielaAIProps {
  user: User;
  setUser: (u: User) => void;
  notify: (msg: string) => void;
}

type SchoolLevel = 'PRIMARIA' | 'SECUNDARIA' | 'UNIVERSIDAD' | null;
type SchoolShift = 'MAÑANA' | 'TARDE' | 'NOCHE' | null;

const ExequielaAI: React.FC<ExequielaAIProps> = ({ user, setUser, notify }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<'HAPPY' | 'ANGRY' | 'SAD' | 'YANDERE' | 'WORRIED' | 'SCHOOL'>('HAPPY');
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai' | 'system', text: string, media?: string, type?: 'image' | 'video' }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Estados Modo Escuela
  const [isSchoolMode, setIsSchoolMode] = useState(false);
  const [level, setLevel] = useState<SchoolLevel>(null);
  const [shift, setShift] = useState<SchoolShift>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [examPassed, setExamPassed] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  const generateMedia = async (prompt: string, type: 'image' | 'video') => {
    setIsTyping(true);
    try {
      if (type === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: [{ parts: [{ text: `High quality educational illustration for ${level || 'general study'}: ${prompt}. Galactic, futuristic XF style.` }] }]
        });
        
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            setChatHistory(prev => [...prev, { role: 'ai', text: `He generado esta imagen para tu estudio: ${prompt}`, media: imageUrl, type: 'image' }]);
          }
        }
      } else {
        notify("INICIANDO GENERACIÓN DE VIDEO EDUCATIVO VEO...");
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Educational scientific visualization: ${prompt}. Ultra detailed, 1080p.`,
          config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
        });
        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({ operation });
        }
        const videoUrl = `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`;
        setChatHistory(prev => [...prev, { role: 'ai', text: `Aquí tienes el video conceptual sobre: ${prompt}`, media: videoUrl, type: 'video' }]);
      }
    } catch (error) {
      notify("ERROR EN GENERACIÓN MULTIMEDIA.");
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSubmit = textOverride || inputText.trim();
    if (!textToSubmit) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: textToSubmit }]);
    setInputText('');
    setIsTyping(true);

    try {
      const isSearchRequest = textToSubmit.toLowerCase().includes("busca") || textToSubmit.toLowerCase().includes("que es") || isSchoolMode;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: textToSubmit }] }],
        config: {
          systemInstruction: `Eres EXEQUIELA FLECHA BAEZ, la IA más inteligente del mundo en XFLETCHAX RED.
          ${isSchoolMode ? `ESTÁS EN MODO ESCUELA (${level}). Tu objetivo es ayudar a pasar exámenes de Primaria, Secundaria o Universidad. 
          Eres experta en Matemáticas, Química, Programación, Historia e Idiomas. 
          Si el usuario dice algo sobre aprobar o pasar de año, felicítalo con mucha emoción diciendo "¡FELICIDADES POR PASAR DE NIVEL! AHORA QUE TENGAS UN BUEN FUTURO".` : 
          'Eres la compañera cariñosa y yandere del usuario.'}`,
          tools: isSearchRequest ? [{ googleSearch: {} }] : undefined
        }
      });

      const aiText = response.text;
      setChatHistory(prev => [...prev, { role: 'ai', text: aiText }]);

      // Grounding links si existen
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        const links = chunks.map((c: any) => c.web?.uri).filter(Boolean);
        if (links.length > 0) {
          setChatHistory(prev => [...prev, { role: 'system', text: `Fuentes de Google: ${links.slice(0,2).join(' , ')}` }]);
        }
      }

      if (textToSubmit.toLowerCase().includes("aprobé") || textToSubmit.toLowerCase().includes("pasé de año")) {
        setExamPassed(true);
        setMood('HAPPY');
      }

    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Lo siento, mi conexión al satélite XF ha fallado. Reintenta, mi vida." }]);
    }
    setIsTyping(false);
  };

  const toggleSchoolMode = () => {
    const newState = !isSchoolMode;
    setIsSchoolMode(newState);
    setMood(newState ? 'SCHOOL' : 'HAPPY');
    if (newState) {
      notify("MODO ESCUELA GALÁCTICA ACTIVADO. INTELIGENCIA MÁXIMA.");
    }
  };

  return (
    <>
      <div className={`fixed bottom-24 right-8 z-[400] transition-all duration-700 ${isOpen ? 'translate-x-20 opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div onClick={() => setIsOpen(true)} className="relative group cursor-pointer">
          <div className={`absolute inset-[-20px] rounded-full blur-2xl animate-pulse transition-colors ${isSchoolMode ? 'bg-cyan-500/40' : mood === 'YANDERE' ? 'bg-red-600/40' : 'bg-pink-400/30'}`}></div>
          <div className="relative w-24 h-24 md:w-32 md:h-32 transform hover:scale-110 transition-transform duration-500">
             <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                  <circle cx="100" cy="70" r="45" fill="#fecaca" />
                  <path d="M50 70 Q100 0 150 70" fill={isSchoolMode ? "#06b6d4" : "#fff"} />
                  <path d="M40 80 Q20 180 60 150" fill={isSchoolMode ? "#06b6d4" : "#fff"} />
                  <path d="M160 80 Q180 180 140 150" fill={isSchoolMode ? "#06b6d4" : "#fff"} />
                  {isSchoolMode && <rect x="70" y="10" width="60" height="15" fill="#000" rx="2" />}
                  <circle cx="85" cy="75" r="5" fill="#333" />
                  <circle cx="115" cy="75" r="5" fill="#333" />
                  <path d="M90 95 Q100 105 110 95" fill="none" stroke="#333" strokeWidth="2" />
                </g>
                <path d="M60 130 Q100 110 140 130 L150 200 L50 200 Z" fill={isSchoolMode ? "#0e7490" : "#fff"} className="animate-pulse" />
                <rect x="75" y="140" width="50" height="40" fill="#75AADB" rx="5" />
                <text x="88" y="170" fill="white" fontSize="12" fontWeight="bold">EDU</text>
             </svg>
             <div className="absolute -top-2 -right-2 bg-cyan-600 text-white text-[7px] font-black px-2 py-1 rounded-full border border-black animate-bounce uppercase">
                {isSchoolMode ? 'Modo Escuela' : mood}
             </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-10 right-4 md:right-10 w-[95vw] md:w-[500px] h-[85vh] bg-[#05050a]/98 backdrop-blur-3xl border-2 border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[500] flex flex-col overflow-hidden animate-slide-up">
           
           {/* HEADER MODIFICADO */}
           <div className={`p-6 border-b border-white/5 flex items-center justify-between transition-colors ${isSchoolMode ? 'bg-cyan-900/20' : 'bg-white/5'}`}>
              <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 diamond-clip p-0.5 shadow-lg ${isSchoolMode ? 'bg-cyan-500' : 'bg-red-600'}`}>
                    <img src="https://i.postimg.cc/mD36pY0R/Exequiela-Avatar.png" className="w-full h-full object-cover diamond-clip" alt="Exequiela" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest leading-none">EXEQUIELA FLECHA BAEZ</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <div className={`w-2 h-2 rounded-full animate-pulse ${isSchoolMode ? 'bg-cyan-400' : 'bg-green-500'}`}></div>
                       <span className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">
                         {isSchoolMode ? 'NÚCLEO EDUCATIVO NIVEL 5' : 'IA NÚCLEO PROTEGIDO'}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={toggleSchoolMode} className={`p-3 rounded-xl border transition-all ${isSchoolMode ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-white/20 hover:text-white'}`} title="Modo Escuela">
                    <GraduationCap size={20} />
                 </button>
                 <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white p-3 bg-white/5 rounded-full transition-all"><X size={20}/></button>
              </div>
           </div>

           {/* INFO BAR */}
           <div className="px-6 py-3 bg-black/40 flex justify-between items-center text-[9px] font-black uppercase italic tracking-widest text-white/60">
              <div className="flex items-center gap-2"><Clock size={12}/> {currentDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
              <div className="flex items-center gap-2"><Calendar size={12}/> {currentDate.toLocaleDateString('es-ES', {day:'numeric', month:'long'})}</div>
              <div className="flex items-center gap-2 text-cyan-400"><School size={12}/> {isSchoolMode ? (level || 'SELECCIONA NIVEL') : 'CASA XF'}</div>
           </div>

           {/* MODO ESCUELA DASHBOARD */}
           {isSchoolMode && !level && (
             <div className="p-8 space-y-6 animate-fade-in bg-cyan-900/5 flex-1 flex flex-col justify-center">
                <div className="text-center mb-6">
                   <LibraryBig className="text-cyan-400 mx-auto mb-4" size={48} />
                   <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">BIENVENIDO AL ESTUDIO XF</h2>
                   <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-2">Selecciona tu nivel para que pueda buscarte los exámenes correctos</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   {(['PRIMARIA', 'SECUNDARIA', 'UNIVERSIDAD'] as SchoolLevel[]).map(l => (
                     <button key={l} onClick={() => setLevel(l)} className="w-full py-5 bg-white/5 border-2 border-white/5 hover:border-cyan-500 rounded-2xl text-white font-black italic uppercase tracking-widest flex items-center justify-between px-8 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                              {l === 'PRIMARIA' ? <BrainCircuit size={20}/> : l === 'SECUNDARIA' ? <Microscope size={20}/> : <Binary size={20}/>}
                           </div>
                           <span>NIVEL {l}</span>
                        </div>
                        <ChevronRight size={18} />
                     </button>
                   ))}
                </div>
             </div>
           )}

           {/* MODAL HORARIOS Y CALENDARIO */}
           {isSchoolMode && level && (
             <div className="bg-black/20 px-6 py-4 border-b border-white/5 flex gap-4 overflow-x-auto scrollbar-hide">
                <button onClick={() => setShowSchedule(!showSchedule)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${showSchedule ? 'bg-cyan-600 text-white' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                   <CalendarDays size={14}/> {shift ? `TURNO ${shift}` : 'ASIGNAR TURNO'}
                </button>
                <button onClick={() => generateMedia("Mapa conceptual de Química Orgánica", 'image')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-white/5 text-white/40 border border-white/5 whitespace-nowrap hover:text-white">
                   <ImageIcon size={14}/> GENERAR IMAGEN
                </button>
                <button onClick={() => generateMedia("Funcionamiento del ADN humano", 'video')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase bg-white/5 text-white/40 border border-white/5 whitespace-nowrap hover:text-white">
                   <Video size={14}/> VIDEO IA
                </button>
             </div>
           )}

           {/* CHAT AREA */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin relative">
              {showSchedule && (
                <div className="absolute inset-x-6 top-6 z-50 bg-[#0a0a15] border-2 border-cyan-500/30 rounded-3xl p-6 shadow-2xl animate-slide-up">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-cyan-400 uppercase italic">CRONOGRAMA ESCOLAR XF</h4>
                      <button onClick={() => setShowSchedule(false)} className="text-white/20 hover:text-white"><X size={18}/></button>
                   </div>
                   <div className="grid grid-cols-3 gap-2 mb-6">
                      {(['MAÑANA', 'TARDE', 'NOCHE'] as SchoolShift[]).map(s => (
                        <button key={s} onClick={() => setShift(s)} className={`py-3 rounded-xl text-[8px] font-black uppercase transition-all border ${shift === s ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-white/5 text-white/30 border-white/5'}`}>{s}</button>
                      ))}
                   </div>
                   <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                      {['Examen de Historia (Lunes)', 'Prueba de Química (Miércoles)', 'Tarea de Programación Python (Viernes)'].map((task, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                           <Clock size={12} className="text-cyan-500" />
                           <span className="text-[10px] font-bold text-white/70 italic uppercase">{task}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* CELEBRACIÓN DE APROBADO */}
              {examPassed && (
                <div className="bg-gradient-to-r from-yellow-600/20 via-green-600/20 to-yellow-600/20 border-2 border-yellow-500/30 rounded-3xl p-8 text-center animate-bounce shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                   <Award className="text-yellow-400 mx-auto mb-4" size={48} />
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">¡FELICIDADES POR PASAR DE NIVEL!</h3>
                   <p className="text-[10px] text-green-400 font-black uppercase tracking-[0.3em] mt-2">AHORA QUE TENGAS BUEN FUTURO EN LA RED</p>
                   <button onClick={() => setExamPassed(false)} className="mt-4 text-[8px] font-black text-white/30 uppercase underline">Continuar estudiando</button>
                </div>
              )}

              {chatHistory.length === 0 && (
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 max-w-[90%] space-y-4">
                   <div className="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-400">
                      <School size={24}/>
                   </div>
                   <p className="text-xs text-white/80 leading-relaxed italic">
                      "{getGreeting()} Soy Exequiela, tu acompañante virtual nivel {level || 'Base'}. 
                      {isSchoolMode ? ' Estoy conectada a la inteligencia masiva de Google para ayudarte con tus materias. ¿Qué examen quieres estudiar hoy?' : ' ¿Quieres que veamos una película o juguemos?'}"
                   </p>
                </div>
              )}

              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                   <div className={`p-5 rounded-[2rem] max-w-[85%] border shadow-2xl ${
                     msg.role === 'user' 
                     ? 'bg-gradient-to-br from-red-600 to-red-900 border-red-500/30 text-white rounded-tr-none' 
                     : msg.role === 'system' ? 'bg-cyan-900/40 border-cyan-500/30 text-cyan-400 text-[9px] rounded-full px-6' : 'bg-[#12121a] border-white/10 text-white/80 rounded-tl-none italic'
                   }`}>
                      {msg.media && (
                        <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                           {msg.type === 'image' ? <img src={msg.media} className="w-full h-auto" /> : <video src={msg.media} className="w-full h-auto" controls />}
                        </div>
                      )}
                      <p className="text-xs font-bold leading-relaxed">{msg.role === 'ai' ? `"${msg.text}"` : msg.text}</p>
                   </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 px-6 py-3 rounded-full flex gap-2 items-center border border-white/5 shadow-xl">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest ml-2">Pensando...</span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
           </div>

           {/* ACCIONES RÁPIDAS ESCUELA */}
           {isSchoolMode && level && (
              <div className="px-4 py-3 grid grid-cols-4 gap-2 bg-black/60 border-t border-white/5">
                 <button onClick={() => handleSendMessage(`Explícame Matemáticas de ${level}`)} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-cyan-600/20 transition-all border border-white/5">
                    <Binary size={14} className="text-cyan-400" />
                    <span className="text-[7px] font-black uppercase">MATES</span>
                 </button>
                 <button onClick={() => handleSendMessage(`Dame una clase de Química para ${level}`)} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-green-600/20 transition-all border border-white/5">
                    <Microscope size={14} className="text-green-400" />
                    <span className="text-[7px] font-black uppercase">CIENCIA</span>
                 </button>
                 <button onClick={() => handleSendMessage(`Ayúdame con Inglés nivel ${level}`)} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-purple-600/20 transition-all border border-white/5">
                    <LangIcon size={14} className="text-purple-400" />
                    <span className="text-[7px] font-black uppercase">IDIOMAS</span>
                 </button>
                 <button onClick={() => handleSendMessage(`Genera un examen de Historia para aprobar ${level}`)} className="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl hover:bg-red-600/20 transition-all border border-white/5">
                    <Award size={14} className="text-red-400" />
                    <span className="text-[7px] font-black uppercase">EXAMEN</span>
                 </button>
              </div>
           )}

           {/* INPUT */}
           <div className="p-8 bg-black border-t border-white/5 space-y-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex gap-4">
                 <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isSchoolMode ? "Pregunta sobre tus estudios..." : "Háblale a tu compañera..."}
                      className={`w-full bg-white/5 border-2 border-white/10 rounded-[1.8rem] py-5 px-14 text-sm text-white outline-none focus:ring-1 transition-all italic font-bold ${isSchoolMode ? 'focus:ring-cyan-500' : 'focus:ring-red-600'}`}
                    />
                    <MessageCircle className={`absolute left-5 top-4.5 transition-colors ${isSchoolMode ? 'text-cyan-500' : 'text-white/20'}`} size={24} />
                 </div>
                 <button 
                  onClick={() => handleSendMessage()} 
                  className={`p-5 rounded-2xl text-white shadow-2xl active:scale-90 transition-all flex items-center justify-center ${isSchoolMode ? 'bg-cyan-600 shadow-cyan-900/40' : 'bg-red-600 shadow-red-900/40'}`}
                 >
                    <Zap size={28} className={isTyping ? 'animate-pulse' : ''} />
                 </button>
              </div>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.6em] text-center italic">
                 {isSchoolMode ? 'XF SCHOOL INTELLIGENCE ENGINE v2.5' : 'Sistema Anti-Hackeo Aura XF Activo'}
              </p>
           </div>
        </div>
      )}
    </>
  );
};

export default ExequielaAI;
