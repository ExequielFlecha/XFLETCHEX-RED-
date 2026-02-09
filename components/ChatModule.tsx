
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Plus, Users, MoreVertical, Phone, Video, 
  Zap, Globe, ShieldCheck, Smile, Mic, ImageIcon, Ghost, Film, X, 
  Settings, ShieldAlert, UserX, UserMinus, PhoneOutgoing, Video as VideoIcon,
  Volume2, Play, Circle, Trash2, Image as LucideImage, Check, BadgeCheck,
  Camera, Heart, Share2, MessageSquare, Flame, Music, Paperclip, Sticker, 
  FileText, MapPin, Headphones, Pause, Map as MapIcon, MicOff, VideoOff,
  UserPlus, UserCheck, ChevronRight, Camera as CameraIcon, Download, File
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
      { id: 'u1', name: 'Carlos', surname: 'Gamer', age: 25, avatar: 'https://picsum.photos/seed/u1/100', role: 'member' }
    ]
  },
  { 
    id: 'p1', 
    name: 'FAMILIA FLECHA', 
    type: 'group', 
    lastMsg: '¿A qué hora cenamos?', 
    time: '22:50', 
    unread: 2, 
    avatar: 'https://picsum.photos/seed/family/100', 
    online: true,
    members: [
      { id: 'me', name: 'Exequiel', surname: 'Flecha', age: 28, avatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', role: 'admin' },
      { id: 'f1', name: 'Mama', surname: 'Flecha', age: 55, avatar: 'https://picsum.photos/seed/mom/100', role: 'member' }
    ]
  },
  { 
    id: 'p2', 
    name: 'LUNA STARK', 
    type: 'private', 
    lastMsg: 'Te envié los créditos 💸', 
    time: '11:30', 
    unread: 0, 
    avatar: 'https://picsum.photos/seed/luna/100', 
    online: false 
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'p1': [
    { id: 'm1', senderId: 'me', senderName: 'Exequiel', senderAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', text: '', media: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', time: '22:48', type: 'audio', isRead: true },
    { id: 'm2', senderId: 'me', senderName: 'Exequiel', senderAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', text: '', media: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', time: '22:50', type: 'audio', isRead: true },
    { id: 'm3', senderId: 'me', senderName: 'Exequiel', senderAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', text: 'Hola', time: '22:50', type: 'text', isRead: true },
    { id: 'm4', senderId: 'me', senderName: 'Exequiel', senderAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', text: '', media: 'https://picsum.photos/seed/broken/400/400', type: 'image', time: '22:51', isRead: true }
  ]
};

const AVAILABLE_CONTACTS = [
  { id: 'u1', name: 'Carlos Gamer', avatar: 'https://picsum.photos/seed/u1/100' },
  { id: 'u2', name: 'Luna Stark', avatar: 'https://picsum.photos/seed/luna/100' },
  { id: 'u3', name: 'Vesper Agent', avatar: 'https://picsum.photos/seed/d2/100' },
  { id: 'u4', name: 'Draco Dev', avatar: 'https://picsum.photos/seed/draco/100' },
  { id: 'u5', name: 'Mama Flecha', avatar: 'https://picsum.photos/seed/mom/100' },
];

const ChatModule: React.FC<{ initialUser?: string | null }> = ({ initialUser }) => {
  const [selectedId, setSelectedId] = useState<string | null>(initialUser || null);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ type: 'audio' | 'video'; chat: Chat } | null>(null);
  
  // Estados para creación de grupos
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupCreationStep, setGroupCreationStep] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupAvatar, setNewGroupAvatar] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const groupAvatarInputRef = useRef<HTMLInputElement>(null);
  const recordingInterval = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedId]);

  const activeChat = chats.find(c => c.id === selectedId);

  const sendMessage = (content: string, type: Message['type'] = 'text', fileName?: string) => {
    if (!selectedId || (!content.trim() && type === 'text')) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      senderName: 'Exequiel',
      senderAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
      text: type === 'text' ? content : (fileName || ''),
      media: type !== 'text' ? content : undefined,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage]
    }));

    setInputText('');
    setShowAttachMenu(false);
  };

  const deleteMessage = (msgId: string) => {
    if (!selectedId) return;
    setMessages(prev => ({
      ...prev,
      [selectedId]: prev[selectedId].filter(m => m.id !== msgId)
    }));
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroupId = `g-${Date.now()}`;
    const newGroup: Chat = {
      id: newGroupId,
      name: newGroupName,
      type: 'group',
      lastMsg: '¡Grupo creado!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      avatar: newGroupAvatar || 'https://picsum.photos/seed/group/100',
      online: true,
      members: [
        { id: 'me', name: 'Exequiel', surname: 'Flecha', age: 28, avatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png', role: 'admin' },
        ...AVAILABLE_CONTACTS.filter(c => selectedMembers.includes(c.id)).map(c => ({
            id: c.id,
            name: c.name.split(' ')[0],
            surname: c.name.split(' ')[1] || '',
            age: 20,
            avatar: c.avatar,
            role: 'member' as const
        }))
      ]
    };

    setChats([newGroup, ...chats]);
    setIsCreatingGroup(false);
    setGroupCreationStep(1);
    setSelectedMembers([]);
    setNewGroupName('');
    setNewGroupAvatar(null);
    setSelectedId(newGroupId);
  };

  const handleGroupAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewGroupAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.onloadend = () => {
          sendMessage(reader.result as string, 'audio');
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingInterval.current);
    }
  };

  const handleFileUpload = (type: Message['type']) => {
    if (fileInputRef.current) {
      if (type === 'image') fileInputRef.current.accept = "image/*";
      else if (type === 'video') fileInputRef.current.accept = "video/*";
      else if (type === 'audio') fileInputRef.current.accept = "audio/*";
      else if (type === 'sticker') fileInputRef.current.accept = "image/png";
      else if (type === 'gif') fileInputRef.current.accept = "image/gif,video/*";
      else if (type === 'text') fileInputRef.current.accept = ".pdf"; // Usamos 'text' para el tipo documento si no está en enum o lo manejamos localmente
      else fileInputRef.current.accept = "*/*";

      fileInputRef.current.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            // Manejamos 'text' como un documento si viene de esta ruta
            const actualType = file.type === 'application/pdf' ? 'image' : type; // Truco visual o mapeamos a un tipo que soporte media
            // Para PDF usaremos un renderizado especial
            sendMessage(reader.result as string, file.type === 'application/pdf' ? 'location' : type, file.name);
          };
          reader.readAsDataURL(file);
        }
      };
      fileInputRef.current.click();
    }
  };

  const sendGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        sendMessage(`https://maps.google.com/?q=${latitude},${longitude}`, 'location');
      });
    }
  };

  const formatRecTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (activeChat) {
      setActiveCall({ type, chat: activeChat });
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-4 md:gap-8 h-[calc(100vh-120px)] font-rajdhani animate-fade-in relative px-2 md:px-0">
      <input type="file" ref={fileInputRef} className="hidden" />

      {/* LISTA DE CHATS */}
      <div className={`w-full md:w-[400px] bg-[#05050a]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl transition-all ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 bg-white/5 border-b border-white/5">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">COMUNICADOR XF</h2>
              <button 
                onClick={() => setIsCreatingGroup(true)}
                className="p-3 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 group"
              >
                <Users size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase italic tracking-widest hidden md:block">Nuevo Grupo</span>
              </button>
           </div>
           <div className="relative">
              <input type="text" placeholder="Buscar amigos y familia..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-12 text-sm outline-none focus:ring-1 focus:ring-red-600 text-white italic font-bold" />
              <Search className="absolute left-4 top-3 text-white/20" size={18} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
           {chats.map(chat => (
             <div key={chat.id} onClick={() => setSelectedId(chat.id)} className={`flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all border ${selectedId === chat.id ? 'bg-red-600/10 border-red-500/30 shadow-xl scale-[1.02]' : 'hover:bg-white/5 border-transparent'}`}>
                <div className="relative">
                   <div className="w-12 h-12 rounded-2xl border-2 border-red-600 overflow-hidden shadow-lg">
                      <img src={chat.avatar} className="w-full h-full object-cover" />
                   </div>
                   {chat.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_#22c55e]"></div>}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center">
                      <h4 className="font-black text-xs text-white uppercase italic truncate">{chat.name}</h4>
                      <span className="text-[8px] text-white/20 font-bold uppercase">{chat.time}</span>
                   </div>
                   <p className="text-[10px] text-white/40 truncate italic leading-none mt-1">{chat.lastMsg}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* ÁREA DE CHAT ACTIVO */}
      <div className={`flex-1 bg-[#05050a]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* CABECERA */}
            <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shadow-lg">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedId(null)} className="md:hidden p-2 text-white/40"><X size={24}/></button>
                  <div className="w-10 h-10 rounded-xl border-2 border-red-600 overflow-hidden shadow-xl">
                     <img src={activeChat.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h3 className="font-black text-sm text-white uppercase italic tracking-tighter leading-none flex items-center gap-2">
                        {activeChat.name} {activeChat.type === 'group' && <Users size={12} className="text-red-500"/>}
                     </h3>
                     <p className="text-[8px] text-green-500 font-black uppercase tracking-widest mt-1 italic">{activeChat.online ? 'EN LÍNEA AHORA' : 'DESCONECTADO'}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => handleStartCall('audio')} className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all active:scale-90"><Phone size={18}/></button>
                  <button onClick={() => handleStartCall('video')} className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all active:scale-90"><VideoIcon size={18}/></button>
                  <button className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white"><MoreVertical size={18}/></button>
               </div>
            </div>

            {/* MENSAJES (CUERPO) */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scroll-smooth">
               {messages[selectedId!]?.map(msg => (
                 <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
                    <div className={`relative max-w-[85%] transition-all ${
                      msg.senderId === 'me' 
                      ? 'bg-gradient-to-br from-red-600 to-red-900 text-white rounded-[1.8rem] rounded-tr-none border-red-500/30' 
                      : 'bg-[#1a1a25] text-white/90 rounded-[1.8rem] rounded-tl-none border-white/5'
                    } ${msg.type === 'sticker' ? 'bg-transparent border-none shadow-none p-0' : 'p-4 shadow-2xl border'}`}>
                       
                       {/* Botón borrar */}
                       <button onClick={() => deleteMessage(msg.id)} className="absolute -top-2 -left-2 p-1.5 bg-black/80 text-red-500 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20"><Trash2 size={12}/></button>

                       {msg.type === 'text' && <p className="text-xs font-bold italic leading-relaxed">"{msg.text}"</p>}
                       
                       {msg.type === 'image' && (
                          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                             <img src={msg.media} className="w-full max-h-60 object-cover" />
                          </div>
                       )}

                       {msg.type === 'audio' && (
                          <div className="flex items-center gap-3 bg-black/30 p-3 rounded-2xl border border-white/10 min-w-[200px]">
                             <button onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)} className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-black shadow-lg">
                                {playingAudioId === msg.id ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor" className="ml-1"/>}
                             </button>
                             <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                                <div className={`h-full bg-cyan-400 transition-all duration-300 ${playingAudioId === msg.id ? 'w-full' : 'w-1/3'}`}></div>
                             </div>
                             <span className="text-[10px] font-black italic">Voz XF</span>
                          </div>
                       )}

                       {msg.type === 'sticker' && <img src={msg.media} className="w-32 h-32 object-contain" />}
                       
                       {msg.type === 'gif' && (
                          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                             <video src={msg.media} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          </div>
                       )}

                       {/* RENDERIZADO DE DOCUMENTO PDF (USANDO LOCATION COMO CONTENEDOR) */}
                       {msg.type === 'location' && msg.media?.startsWith('data:application/pdf') && (
                          <div className="bg-black/40 p-4 rounded-2xl border border-white/10 min-w-[220px] flex items-center gap-4">
                             <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center text-red-500 shadow-lg border border-red-500/20">
                                <FileText size={24} />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-white uppercase italic truncate">{msg.text || 'Documento_XF.pdf'}</p>
                                <p className="text-[7px] text-white/30 font-bold uppercase tracking-widest mt-1">PDF XFLETCHAX</p>
                             </div>
                             <a href={msg.media} download={msg.text || "documento_xf.pdf"} className="p-2 bg-white/5 hover:bg-red-600 text-white/40 hover:text-white rounded-lg transition-all shadow-md">
                                <Download size={16} />
                             </a>
                          </div>
                       )}

                       {msg.type === 'location' && !msg.media?.startsWith('data:application/pdf') && (
                          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-2">
                             <div className="flex items-center gap-2"><MapPin size={14} className="text-red-500"/><span className="text-[10px] font-black uppercase italic tracking-widest">UBICACIÓN GPS XF</span></div>
                             <div className="aspect-video bg-black/40 rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                                <MapIcon size={24} className="text-white/20"/>
                             </div>
                             <a href={msg.media} target="_blank" className="block w-full py-2 bg-red-600 text-white text-center font-black text-[8px] rounded-lg uppercase tracking-widest italic hover:bg-red-500">VER RUTA EN GPS</a>
                          </div>
                       )}

                       {msg.type === 'text' && msg.senderId === 'me' && <div className="flex items-center justify-end gap-1 mt-2">
                          <span className="text-[8px] text-white/30 font-black uppercase italic">{msg.time}</span>
                          <Check size={8} className={msg.isRead ? 'text-cyan-400' : 'text-white/20'} />
                       </div>}
                    </div>
                 </div>
               ))}
            </div>

            {/* BARRA DE ENTRADA (MÓVIL / PC) */}
            <div className="p-4 bg-[#0a0a0f] border-t border-white/5 flex flex-col gap-3 relative shadow-2xl">
               
               {/* MENÚ ADJUNTOS AMPLIADO CON DOCUMENTOS PDF */}
               {showAttachMenu && (
                 <div className="absolute bottom-full mb-4 left-4 right-4 grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3 bg-[#11111a] border-2 border-white/10 rounded-[2.5rem] p-6 shadow-2xl animate-slide-up z-50">
                    <button onClick={() => handleFileUpload('image')} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-purple-600/20 rounded-2xl text-purple-500 group-hover:bg-purple-600 group-hover:text-white"><ImageIcon size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">Galería</span>
                    </button>
                    <button onClick={() => handleFileUpload('video')} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-orange-600/20 rounded-2xl text-orange-500 group-hover:bg-orange-600 group-hover:text-white"><Film size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">Video</span>
                    </button>
                    <button onClick={() => handleFileUpload('sticker')} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-yellow-600/20 rounded-2xl text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white"><Sticker size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">Stickers</span>
                    </button>
                    <button onClick={sendGPSLocation} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-red-600/20 rounded-2xl text-red-500 group-hover:bg-red-600 group-hover:text-white"><MapPin size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">GPS</span>
                    </button>
                    <button onClick={() => handleFileUpload('audio')} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-cyan-600/20 rounded-2xl text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white"><Headphones size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">Música</span>
                    </button>
                    <button onClick={() => handleFileUpload('gif')} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-pink-600/20 rounded-2xl text-pink-500 group-hover:bg-pink-600 group-hover:text-white"><Zap size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">GIF</span>
                    </button>
                    {/* NUEVA FUNCIÓN: DOCUMENTO PDF */}
                    <button onClick={() => handleFileUpload('text')} className="flex flex-col items-center gap-2 group transition-all">
                       <div className="p-4 bg-gray-600/20 rounded-2xl text-gray-400 group-hover:bg-white group-hover:text-black shadow-xl"><FileText size={22}/></div>
                       <span className="text-[8px] font-black uppercase italic text-white/40">PDF</span>
                    </button>
                 </div>
               )}

               <div className="flex items-center gap-3">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-center text-white/40 cursor-pointer hover:bg-white/10 active:scale-90 transition-all" onClick={() => setShowAttachMenu(!showAttachMenu)}>
                     <Plus size={24} className={showAttachMenu ? 'rotate-45 transition-transform text-red-500' : 'transition-transform'}/>
                  </div>
                  <div className="flex-1 relative">
                     <input 
                       type="text" 
                       value={inputText}
                       onChange={e => setInputText(e.target.value)}
                       onKeyPress={e => e.key === 'Enter' && sendMessage(inputText)}
                       placeholder="Escribe un mensaje seguro..." 
                       className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-4 px-12 text-sm text-white outline-none focus:ring-1 focus:ring-red-600 italic font-bold" 
                     />
                     <Smile className="absolute left-4 top-3.5 text-white/20 hover:text-yellow-400 cursor-pointer" size={20} />
                  </div>
                  {inputText.trim() ? (
                    <button onClick={() => sendMessage(inputText)} className="p-4 bg-red-600 rounded-full text-white shadow-xl shadow-red-900/40 active:scale-90 transition-all"><Send size={24}/></button>
                  ) : (
                    <button 
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                      onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
                      className={`p-4 rounded-full transition-all flex items-center justify-center ${isRecording ? 'bg-red-600 text-white animate-pulse scale-150 z-50 shadow-[0_0_30px_#dc2626]' : 'bg-white/5 text-white/40 hover:text-red-500'}`}
                    >
                      {isRecording ? <span className="text-[8px] font-black mr-2 bg-black/20 px-2 py-1 rounded-md">{formatRecTime(recordingTime)}</span> : null}
                      <Mic size={24}/>
                    </button>
                  )}
               </div>
               {isRecording && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">SOLTAR PARA ENVIAR NOTA DE VOZ XF</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 p-20 text-center">
             <MessageSquare size={120} className="text-white mb-6 animate-pulse" />
             <h3 className="text-3xl font-black font-futuristic text-white italic uppercase tracking-tighter mb-4">MENSAJERÍA XF</h3>
             <p className="max-w-xs font-black uppercase tracking-[0.3em] text-[10px] leading-relaxed italic border-t border-white/10 pt-6">Canal seguro de comunicación cifrada. Selecciona un contacto para iniciar la transmisión.</p>
          </div>
        )}
      </div>

      {/* MODAL CREACIÓN DE GRUPO */}
      {isCreatingGroup && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 animate-fade-in">
           <div className="w-full max-w-xl bg-[#0a0a0f] border-2 border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-pink-500 to-purple-600"></div>
              
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button onClick={() => { setIsCreatingGroup(false); setGroupCreationStep(1); }} className="text-white/40 hover:text-white"><X size={24}/></button>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                        {groupCreationStep === 1 ? 'Añadir Participantes' : 'Ajustes del Grupo'}
                    </h3>
                 </div>
                 <span className="text-[10px] font-black text-red-500 bg-red-600/10 px-3 py-1 rounded-full uppercase italic tracking-widest">PASO {groupCreationStep}/2</span>
              </div>

              {groupCreationStep === 1 ? (
                <div className="p-8 flex flex-col h-[500px]">
                   <div className="relative mb-6">
                      <input type="text" placeholder="Buscar amigos..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-sm text-white outline-none italic font-bold" />
                      <Search className="absolute left-4 top-3.5 text-white/20" size={20} />
                   </div>
                   
                   <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                      {AVAILABLE_CONTACTS.map(contact => {
                        const isSelected = selectedMembers.includes(contact.id);
                        return (
                          <div 
                            key={contact.id} 
                            onClick={() => setSelectedMembers(prev => isSelected ? prev.filter(id => id !== contact.id) : [...prev, contact.id])}
                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-red-600/20 border-red-500 shadow-lg' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                               <img src={contact.avatar} className="w-full h-full object-cover" />
                            </div>
                            <span className="flex-1 font-black text-sm text-white uppercase italic">{contact.name}</span>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-red-500 border-white' : 'border-white/20'}`}>
                               {isSelected && <Check size={14} className="text-white" />}
                            </div>
                          </div>
                        )
                      })}
                   </div>

                   <div className="pt-8 flex justify-between items-center">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{selectedMembers.length} SELECCIONADOS</p>
                      <button 
                        disabled={selectedMembers.length === 0}
                        onClick={() => setGroupCreationStep(2)}
                        className={`p-5 rounded-[1.8rem] shadow-2xl transition-all ${selectedMembers.length > 0 ? 'bg-red-600 text-white hover:scale-110' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                      >
                         <ChevronRight size={28} />
                      </button>
                   </div>
                </div>
              ) : (
                <div className="p-10 space-y-10">
                   <div className="flex flex-col items-center gap-6">
                      <div 
                        onClick={() => groupAvatarInputRef.current?.click()}
                        className="relative w-40 h-40 bg-white/5 rounded-[2.5rem] border-4 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-red-600 transition-all overflow-hidden group"
                      >
                         {newGroupAvatar ? (
                           <img src={newGroupAvatar} className="w-full h-full object-cover" />
                         ) : (
                           <CameraIcon className="text-white/20 group-hover:text-red-500 transition-colors" size={48} />
                         )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="text-white" size={32} />
                         </div>
                      </div>
                      <input type="file" ref={groupAvatarInputRef} onChange={handleGroupAvatarUpload} className="hidden" accept="image/*" />
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">Icono del Grupo XF</p>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic ml-2">NOMBRE DEL GRUPO SATELITAL</p>
                      <input 
                        type="text" 
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="Ej: CLAN FLECHA DIOS..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xl text-white outline-none focus:ring-1 focus:ring-red-600 italic font-black uppercase tracking-tighter" 
                      />
                   </div>

                   <button 
                    onClick={createGroup}
                    disabled={!newGroupName.trim()}
                    className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-3xl text-sm uppercase italic tracking-[0.4em] shadow-2xl shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-4"
                   >
                      <UserPlus size={20} /> CREAR GRUPO AHORA
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* PANTALLA LLAMADA / VIDEOCALL HUD */}
      {activeCall && (
        <div className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-10 animate-fade-in text-center">
           <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-transparent to-red-600/10 pointer-events-none"></div>
           
           <div className="relative mb-12">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] border-4 border-red-600 p-2 shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden animate-pulse">
                 <img src={activeCall.chat.avatar} className="w-full h-full object-cover rounded-[3rem]" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black border-2 border-red-500 rounded-2xl flex items-center justify-center text-red-500 shadow-2xl">
                 {activeCall.type === 'audio' ? <Phone size={24} /> : <VideoIcon size={24} />}
              </div>
           </div>

           <div className="space-y-4 mb-20 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                {activeCall.chat.name}
              </h2>
              <div className="flex flex-col items-center gap-2">
                 <p className="text-red-500 font-black text-xs tracking-widest uppercase animate-pulse italic">
                    {activeCall.chat.type === 'group' ? 'CONEXIÓN GRUPAL SATELITAL' : 'CONEXIÓN PRIVADA CIFRADA'}
                 </p>
                 <span className="text-white/20 font-bold text-[10px] uppercase tracking-widest">Aura XF Protegiendo la Transmisión</span>
              </div>
           </div>

           <div className="flex gap-8 md:gap-12 relative z-10">
              <button className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border-2 border-white/10 rounded-3xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                 <MicOff size={28} />
              </button>
              
              <button 
                onClick={() => setActiveCall(null)} 
                className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-[2.5rem] border-4 border-white/30 flex items-center justify-center text-white shadow-[0_0_50px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all"
              >
                 <PhoneOutgoing size={36} />
              </button>

              <button className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border-2 border-white/10 rounded-3xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                 <VideoOff size={28} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatModule;
