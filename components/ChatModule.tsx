
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Plus, Users, MoreVertical, Phone, Video, 
  Zap, Globe, ShieldCheck, Smile, Mic, ImageIcon, Ghost, Film, X, 
  Settings, ShieldAlert, UserX, UserMinus, PhoneOutgoing, Video as VideoIcon,
  Volume2, Play, Circle, Trash2, Image as LucideImage, Check, BadgeCheck,
  Camera, Heart, Share2, MessageSquare, Flame
} from 'lucide-react';
import { Message, Chat, ChatMember } from '../types';

const INITIAL_CHATS: Chat[] = [
  { 
    id: 'g1', 
    name: 'CLAN DE GAMERS XF', 
    type: 'group', 
    lastMsg: '¿Quién para el torneo hoy?', 
    time: '12:05', 
    unread: 5, 
    avatar: 'https://picsum.photos/seed/gamers/100', 
    online: true,
    members: [
      { id: 'me', name: 'Exequiel', surname: 'Flecha Baez', age: 28, avatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', role: 'admin' },
      { id: 'u1', name: 'Carlos', surname: 'Gamer', age: 22, avatar: 'https://picsum.photos/seed/u1/100', role: 'member' },
      { id: 'u2', name: 'Socio', surname: 'X', age: 25, avatar: 'https://picsum.photos/seed/u2/100', role: 'member' }
    ]
  },
  { 
    id: 'p1', 
    name: 'LUNA STARK', 
    surname: '(Mejor Amiga)',
    age: 24,
    type: 'private', 
    lastMsg: 'Te envié los créditos 🚀', 
    time: '11:30', 
    unread: 0, 
    avatar: 'https://picsum.photos/seed/luna/100', 
    online: true 
  },
  { 
    id: 'p2', 
    name: 'FAMILIA FLECHA', 
    type: 'group', 
    lastMsg: '¿A qué hora cenamos?', 
    time: '10:15', 
    unread: 2, 
    avatar: 'https://picsum.photos/seed/family/100', 
    online: true,
    members: [
      { id: 'me', name: 'Exequiel', surname: 'Flecha', age: 28, avatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', role: 'admin' },
      { id: 'f1', name: 'Mama', surname: 'Flecha', age: 50, avatar: 'https://picsum.photos/seed/mom/100', role: 'member' }
    ]
  },
  { 
    id: 'p3', 
    name: 'JUAN PÉREZ', 
    surname: '(Hermano)',
    age: 30,
    type: 'private', 
    lastMsg: '¿Viste el nuevo post?', 
    time: '09:45', 
    unread: 0, 
    avatar: 'https://picsum.photos/seed/user3/100', 
    online: false 
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'g1': [
    { id: 'm1', senderId: 'u1', senderName: 'Carlos', senderSurname: 'Gamer', senderAvatar: 'https://picsum.photos/seed/u1/100', text: '¿Quién para el torneo hoy?', time: '12:05', type: 'text', isRead: true }
  ],
  'p1': [
    { id: 'm2', senderId: 'p1', senderName: 'Luna', senderSurname: 'Stark', senderAvatar: 'https://picsum.photos/seed/luna/100', text: 'Te envié los créditos 🚀', time: '11:30', type: 'text', isRead: true }
  ]
};

interface ChatModuleProps {
  initialUser?: string | null;
}

const ChatModule: React.FC<ChatModuleProps> = ({ initialUser }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video'; chatName: string; isGroup: boolean } | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialUser) {
      const found = chats.find(c => (c.name + ' ' + (c.surname || '')).trim().includes(initialUser));
      if (found) setSelectedId(found.id);
    }
  }, [initialUser, chats]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedId]);

  const activeChat = chats.find(c => c.id === selectedId);

  const sendMessage = (content: string, type: Message['type'] = 'text') => {
    if (!selectedId || (!content.trim() && type === 'text') || activeChat?.blocked) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      senderName: 'Exequiel',
      senderSurname: 'Flecha Baez',
      senderAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
      text: type === 'text' ? content : '',
      media: type !== 'text' ? content : undefined,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage]
    }));
    
    setChats(prev => prev.map(c => 
      c.id === selectedId 
        ? { ...c, lastMsg: type === 'text' ? content : `Envió un ${type}`, time: newMessage.time } 
        : c
    ));

    setInputText('');
    setShowMediaMenu(false);

    // Simulación de respuesta IA/Usuario
    setTimeout(() => {
      if (!activeChat?.blocked) {
        const reply: Message = {
          id: `r-${Date.now()}`,
          senderId: selectedId,
          senderName: activeChat?.name || 'Sistema',
          senderAvatar: activeChat?.avatar || '',
          text: type === 'audio' ? 'He recibido tu audio, DIOS. 📡' : '¡Mensaje recibido! Saludos desde la red XF.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          isRead: true
        };
        setMessages(prev => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] || []), reply]
        }));
      }
    }, 2000);
  };

  const handleFileUpload = (type: Message['type']) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*';
      fileInputRef.current.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => sendMessage(reader.result as string, type);
          reader.readAsDataURL(file);
        }
      };
      fileInputRef.current.click();
    }
  };

  const toggleBlock = () => {
    if (!selectedId) return;
    setChats(prev => prev.map(c => c.id === selectedId ? { ...c, blocked: !c.blocked } : c));
    setShowOptions(false);
  };

  const kickMember = (memberId: string) => {
    if (activeChat?.type === 'group') {
      setChats(prev => prev.map(c => 
        c.id === selectedId 
          ? { ...c, members: c.members?.filter(m => m.id !== memberId) } 
          : c
      ));
    }
  };

  const startCall = (type: 'voice' | 'video') => {
    if (!activeChat) return;
    setActiveCall({ type, chatName: activeChat.name, isGroup: activeChat.type === 'group' });
  };

  const filteredChats = chats.filter(c => 
    (c.name + ' ' + (c.surname || '')).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto flex gap-8 h-[calc(100vh-140px)] font-rajdhani animate-fade-in relative">
      <input type="file" ref={fileInputRef} className="hidden" />

      {/* SIDEBAR DE COMUNICADOR XF */}
      <div className="w-full md:w-96 bg-[#0a0a0f] border border-white/10 rounded-[4rem] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-white/5 space-y-8 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-3">
             <Zap className="text-red-500 fill-red-500 animate-pulse" size={28}/>
             <h2 className="text-3xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-none">COMUNICADOR XF</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0c0c12] p-6 rounded-[2.5rem] border border-purple-500/20 text-center shadow-lg group hover:border-purple-500 transition-all cursor-pointer">
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1 italic">SMS PRIVADOS</p>
              <p className="text-2xl font-black text-white italic">{chats.filter(c => c.type === 'private').length}</p>
            </div>
            <div className="bg-[#0c0c12] p-6 rounded-[2.5rem] border border-cyan-500/20 text-center shadow-lg group hover:border-cyan-500 transition-all cursor-pointer">
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1 italic">SMS GRUPOS</p>
              <p className="text-2xl font-black text-white italic">{chats.filter(c => c.type === 'group').length}</p>
            </div>
          </div>

          <div className="relative">
             <input 
              type="text" 
              placeholder="Buscar amigos y familia..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-14 text-sm outline-none focus:ring-1 focus:ring-red-600 transition-all placeholder-white/20 italic font-bold" 
             />
             <Search className="absolute left-6 top-5 text-white/20" size={20} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
           <div className="flex items-center justify-between px-6 mb-4">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">TRANSMISIONES RECIENTES</span>
              <button className="text-red-500 p-3 bg-red-600/10 rounded-2xl hover:scale-110 transition-transform"><Plus size={18}/></button>
           </div>
           
           {filteredChats.map(chat => (
             <div 
               key={chat.id} 
               onClick={() => setSelectedId(chat.id)} 
               className={`flex items-center gap-5 p-6 rounded-[2.8rem] cursor-pointer transition-all border-2 ${selectedId === chat.id ? 'bg-red-600/10 border-red-500/40 shadow-2xl' : 'hover:bg-white/5 border-transparent'}`}
             >
                <div className="relative">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-red-600 shadow-xl">
                     <img src={chat.avatar} className="w-full h-full object-cover" />
                   </div>
                   {chat.online && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_#22c55e]"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                     <h4 className="font-black text-sm text-white uppercase italic tracking-tighter truncate">
                       {chat.name}
                     </h4>
                     <span className="text-[9px] text-white/30 font-bold">{chat.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate italic leading-none">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && selectedId !== chat.id && (
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">{chat.unread}</div>
                )}
             </div>
           ))}
        </div>
      </div>

      {/* ÁREA DE CONVERSACIÓN TÁCTICA */}
      <div className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-[4rem] flex flex-col overflow-hidden shadow-2xl relative">
        {activeChat ? (
          <>
            {/* Cabecera del Chat */}
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl z-10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-2 border-red-600 overflow-hidden shadow-2xl transition-transform hover:scale-110">
                    <img src={activeChat.avatar} className="w-full h-full object-cover" />
                  </div>
                  {activeChat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <h3 className="font-black text-2xl text-white uppercase italic tracking-tighter leading-none">
                        {activeChat.name} <span className="text-white/40 ml-1">{activeChat.surname || ''}</span>
                      </h3>
                      {activeChat.type === 'group' ? <Users size={18} className="text-cyan-400" /> : <BadgeCheck size={18} className="text-cyan-400" />}
                   </div>
                   <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${activeChat.online ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
                      <span className="text-[10px] text-white/40 font-black tracking-widest uppercase italic">
                        {activeChat.online ? 'Transmisión Activa' : 'Fuera de Línea'} • {activeChat.type === 'group' ? 'CONFERENCIA GRUPAL' : ' ENLACE PRIVADO'}
                      </span>
                   </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                 <button onClick={() => startCall('voice')} title={activeChat.type === 'group' ? "Llamada Grupal" : "Llamada Privada"} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-green-500 hover:border-green-500/30 transition-all shadow-xl"><Phone size={24}/></button>
                 <button onClick={() => startCall('video')} title={activeChat.type === 'group' ? "Video Grupal" : "Video Privado"} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-xl"><Video size={24}/></button>
                 <div className="relative">
                   <button onClick={() => setShowOptions(!showOptions)} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all shadow-xl"><MoreVertical size={24}/></button>
                   {showOptions && (
                     <div className="absolute top-full mt-4 right-0 w-72 bg-[#0a0a10] border-2 border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-50 animate-scale-in">
                       <button onClick={toggleBlock} className="w-full flex items-center gap-4 p-4 hover:bg-red-600/10 text-red-500 rounded-2xl transition-all">
                          <UserX size={18} />
                          <span className="text-xs font-black uppercase italic tracking-widest">{activeChat.blocked ? 'Desbloquear Usuario' : 'Bloquear Usuario'}</span>
                       </button>
                       {activeChat.type === 'group' && (
                         <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-[9px] font-black text-white/30 uppercase mb-3 px-2">Gestión de Familia/Gamers</p>
                            {activeChat.members?.map(member => member.id !== 'me' && (
                              <button key={member.id} onClick={() => kickMember(member.id)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-all group">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                                       <img src={member.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white uppercase italic">{member.name}</span>
                                 </div>
                                 <UserMinus size={14} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                         </div>
                       )}
                       <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 text-white/40 rounded-2xl transition-all border-t border-white/5 mt-4">
                          <Settings size={18} />
                          <span className="text-xs font-black uppercase italic tracking-widest">Ajustes XF</span>
                       </button>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            {activeChat.blocked && (
               <div className="bg-red-600/10 border-b border-red-600/20 p-6 text-center flex items-center justify-center gap-4 animate-fade-in">
                  <ShieldAlert size={20} className="text-red-500" />
                  <p className="text-xs font-black text-red-500 uppercase tracking-widest italic">ESTE ENLACE ESTÁ BLOQUEADO. DESBLOQUEA PARA VOLVER A TRANSMITIR.</p>
               </div>
            )}

            {/* Listado de Mensajes */}
            <div 
              ref={scrollRef}
              className="flex-1 p-10 space-y-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative scroll-smooth"
            >
               <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
               <div className="relative z-10 space-y-10">
                  <div className="flex justify-center">
                     <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic shadow-2xl flex items-center gap-3">
                        <ShieldCheck size={14} className="text-green-500"/> CIFRADO DIAMANTE ACTIVO 🛰️
                     </div>
                  </div>
                  
                  {messages[selectedId!]?.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'} animate-fade-in`}>
                       <div className={`flex gap-4 items-end ${msg.senderId === 'me' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-12 h-12 rounded-2xl ${msg.senderId === 'me' ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-white/10'} overflow-hidden flex-shrink-0 border border-white/10`}>
                             <img src={msg.senderAvatar} className="w-full h-full object-cover" />
                          </div>
                          <div className={`relative ${msg.senderId === 'me' ? 'bg-gradient-to-br from-red-600 to-red-900 text-white rounded-br-none' : 'bg-white/5 border-white/10 text-white/80 rounded-bl-none'} border p-6 max-w-lg shadow-2xl rounded-[2.5rem]`}>
                             {activeChat.type === 'group' && msg.senderId !== 'me' && (
                               <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2 italic">@{msg.senderName} {msg.senderSurname || ''}</p>
                             )}
                             
                             {msg.type === 'text' && <p className="text-sm font-bold italic leading-relaxed">"{msg.text}"</p>}
                             {msg.type === 'image' && <img src={msg.media} className="w-full rounded-2xl border border-white/10 shadow-lg" alt="Sent Content" />}
                             {msg.type === 'video' && <video src={msg.media} controls className="w-full rounded-2xl border border-white/10 shadow-lg" />}
                             {msg.type === 'audio' && (
                               <div className="flex items-center gap-4 bg-black/30 p-4 rounded-2xl border border-white/10 min-w-[240px]">
                                  <button className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black active:scale-90 transition-transform"><Play size={20} fill="currentColor" /></button>
                                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                     <div className="w-1/3 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                                  </div>
                                  <span className="text-[10px] font-black">0:12</span>
                               </div>
                             )}
                             {msg.type === 'sticker' && <img src={msg.media} className="w-32 h-32 object-contain" alt="Sticker" />}
                             {msg.type === 'gif' && <img src={msg.media} className="w-full rounded-2xl" alt="GIF" />}
                             
                             <p className={`text-[9px] ${msg.senderId === 'me' ? 'text-white/40' : 'text-white/20'} font-black mt-3 text-right uppercase tracking-tighter`}>{msg.time}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* BARRA DE ENTRADA MULTIMEDIA */}
            <div className="p-10 bg-[#08080c] border-t border-white/10 flex flex-col gap-6 relative z-10">
               <div className="flex items-center gap-8 px-4 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-8">
                    <button onClick={() => setInputText(prev => prev + '🔥')} className="text-2xl hover:scale-125 transition-transform">🔥</button>
                    <button onClick={() => setInputText(prev => prev + '🚀')} className="text-2xl hover:scale-125 transition-transform">🚀</button>
                    <button onClick={() => setInputText(prev => prev + '💎')} className="text-2xl hover:scale-125 transition-transform">💎</button>
                    <button onClick={() => setInputText(prev => prev + '🇦🇷')} className="text-2xl hover:scale-125 transition-transform">🇦🇷</button>
                    <button onClick={() => handleFileUpload('image')} className="text-white/30 hover:text-cyan-400 transition-all hover:scale-125"><ImageIcon size={28}/></button>
                    <button onClick={() => handleFileUpload('sticker')} className="text-white/30 hover:text-purple-400 transition-all hover:scale-125"><Ghost size={28}/></button>
                    <button onClick={() => handleFileUpload('video')} className="text-white/30 hover:text-orange-500 transition-all hover:scale-125"><Film size={28}/></button>
                    <button 
                      onMouseDown={() => setIsRecording(true)} 
                      onMouseUp={() => { setIsRecording(false); sendMessage('https://example.com/audio.mp3', 'audio'); }}
                      className={`transition-all hover:scale-125 ${isRecording ? 'text-red-600 animate-pulse scale-150' : 'text-white/30 hover:text-red-500'}`}
                    >
                      <Mic size={28}/>
                    </button>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <button onClick={() => setInputText(prev => prev + '👑')} className="text-2xl hover:scale-125 transition-transform">👑</button>
                  <button onClick={() => setInputText(prev => prev + '👨‍👩‍👧‍👦')} className="text-2xl hover:scale-125 transition-transform">👨‍👩‍👧‍👦</button>
               </div>
               
               <div className="flex gap-6">
                  <div className="flex-1 relative">
                     <input 
                       type="text" 
                       value={inputText} 
                       onChange={(e) => setInputText(e.target.value)} 
                       onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                       disabled={activeChat.blocked}
                       placeholder={activeChat.blocked ? "TRANSMISIÓN BLOQUEADA" : "Transmite un mensaje a tu gente..."}
                       className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-10 outline-none text-lg font-bold focus:ring-2 focus:ring-red-600/50 transition-all placeholder-white/10 italic text-white shadow-inner" 
                     />
                     <div className="absolute right-8 top-5 flex gap-4 text-white/10">
                        <Globe size={30} className="hover:text-white transition-colors cursor-pointer"/>
                     </div>
                  </div>
                  <button 
                    onClick={() => sendMessage(inputText)} 
                    disabled={activeChat.blocked}
                    className="bg-red-600 p-7 rounded-[2.2rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all text-white border-2 border-white/20"
                  >
                    <Send size={32} />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 p-20 text-center">
             <div className="relative mb-20">
                <div className="absolute inset-0 bg-red-600 blur-[120px] animate-pulse"></div>
                <Zap size={180} className="relative z-10 text-white fill-white" />
             </div>
             <h3 className="text-6xl font-black font-futuristic text-white italic uppercase tracking-tighter mb-8 leading-none">CENTRAL DE MENSAJERÍA</h3>
             <p className="max-w-xl font-black uppercase tracking-[0.6em] text-sm leading-relaxed italic border-t border-b border-white/10 py-10">Selecciona un canal de comunicación seguro para iniciar la transmisión en la red XFLETCHEX RED.</p>
          </div>
        )}
      </div>

      {/* MODAL DE LLAMADA TÁCTICA HD */}
      {activeCall && (
        <div className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in p-10 text-center">
           <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-cyan-500/10 opacity-40 pointer-events-none"></div>
           
           <div className="relative mb-20">
              <div className="w-64 h-64 rounded-[4.5rem] border-4 border-red-600 p-2 shadow-[0_0_100px_rgba(220,38,38,0.6)] overflow-hidden bg-black animate-pulse">
                 <img src={activeChat?.avatar} className="w-full h-full object-cover rounded-[3.8rem]" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-red-600 px-8 py-3 rounded-full border-2 border-white/30 text-[12px] font-black text-white italic tracking-[0.3em] uppercase shadow-2xl">
                 {activeCall.isGroup ? 'CONFERENCIA MULTIPUNTO' : 'ENLACE PUNTO A PUNTO'}
              </div>
           </div>

           <h2 className="text-7xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
             {activeCall.chatName}
           </h2>
           <p className="text-cyan-400 font-black text-2xl tracking-[0.5em] uppercase mb-24 flex items-center gap-6 justify-center italic">
              {activeCall.type === 'voice' ? <Phone size={32}/> : <VideoIcon size={32}/>} 
              Sincronizando Voz y Datos encriptados...
           </p>

           <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 max-w-4xl w-full px-6">
              <button className="flex flex-col items-center gap-6 group">
                 <div className="w-24 h-24 bg-white/5 rounded-[2.2rem] border-2 border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all shadow-2xl"><Volume2 size={40}/></div>
                 <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic">Altavoz</span>
              </button>
              <button className="flex flex-col items-center gap-6 group">
                 <div className="w-24 h-24 bg-white/5 rounded-[2.2rem] border-2 border-white/10 flex items-center justify-center text-white/40 group-hover:bg-red-600 group-hover:text-white transition-all shadow-2xl"><Mic size={40}/></div>
                 <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic">Silenciar</span>
              </button>
              <button className="flex flex-col items-center gap-6 group">
                 <div className="w-24 h-24 bg-white/5 rounded-[2.2rem] border-2 border-white/10 flex items-center justify-center text-white/40 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-2xl"><Camera size={40}/></div>
                 <span className="text-[12px] font-black text-white/20 uppercase tracking-widest italic">Cámara</span>
              </button>
              <button onClick={() => setActiveCall(null)} className="flex flex-col items-center gap-6 group">
                 <div className="w-24 h-24 bg-red-600 rounded-[2.2rem] border-2 border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-[0_0_60px_rgba(220,38,38,0.7)]"><PhoneOutgoing size={40} className="rotate-135"/></div>
                 <span className="text-[12px] font-black text-red-500 uppercase tracking-widest italic">Finalizar Transmisión</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatModule;
