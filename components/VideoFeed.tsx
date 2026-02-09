
import React, { useState, useRef, useEffect } from 'react';
import { User as UserType, StrikeStatus, Post, CommentData } from '../types';
import { 
  Play, MessageCircle, Share2, Bookmark, Music, 
  X, BadgeCheck, Plus, Upload, MessageSquare, Heart, 
  Mic, Image as ImageIcon, Smile, Ghost, Instagram, 
  Twitter, Youtube, Facebook, Send, Link as LinkIcon, 
  MoreVertical, Smartphone, ThumbsUp, Lock, Globe, Type, FileMusic, Film,
  Users, Eye, UserPlus, Video as VideoIcon, CheckCircle, Sparkles, Loader2,
  ChevronUp, ChevronDown, SendHorizonal
} from 'lucide-react';

interface VideoFeedProps {
  onOpenChat?: (userName: string) => void;
  notify?: (msg: string) => void;
  currentGlobalUser?: UserType;
  setUser: (u: UserType) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ onOpenChat, notify, currentGlobalUser, setUser }) => {
  const [activeType, setActiveType] = useState<'shorts' | 'long'>('shorts');
  const [activeProfile, setActiveProfile] = useState<Post | null>(null);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  
  // Estados del Creador de Videos
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newVideoFile, setNewVideoFile] = useState<string | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<'shorts' | 'long'>('shorts');

  const [commentText, setCommentText] = useState('');
  const [explodingLikes, setExplodingLikes] = useState<string[]>([]);

  const [posts, setPosts] = useState<Post[]>([
    { 
      id: 'v1', type: 'video', media: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200', 
      content: 'BIENVENIDOS AL IMPERIO XFLETCHAX RED 🇦🇷🔥', 
      userName: 'Exequiel_Flecha_DIOS', 
      userId: 'admin',
      userAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
      userBanner: 'https://picsum.photos/seed/adminbanner/1200/400',
      likes: 154200, views: 8940500, comments: [], 
      strikeStatus: StrikeStatus.CLEAN, music: 'Marcha de la Red XF'
    },
    { 
      id: 'v2', type: 'video', media: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=1200', 
      content: 'La IA de esta red es de otro planeta.', userName: 'Cyber_Agent', 
      userId: 'cyber',
      userAvatar: 'https://picsum.photos/seed/cyberp/100',
      userBanner: 'https://picsum.photos/seed/cyberb/1200/400',
      likes: 45000, views: 500000, comments: [], 
      strikeStatus: StrikeStatus.WARNING, music: 'Neon Nights (Cyber-Remix)'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const shortsContainerRef = useRef<HTMLDivElement>(null);

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = !p.isLiked;
        if (isLiked) {
          setExplodingLikes([...explodingLikes, id]);
          setTimeout(() => setExplodingLikes(prev => prev.filter(item => item !== id)), 600);
          if (currentGlobalUser) setUser({ ...currentGlobalUser, viewsCount: currentGlobalUser.viewsCount + 1 });
        }
        return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  };

  const handleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isSaved = !p.isSaved;
        if (isSaved) notify?.("¡VIDEO GUARDADO EN TU GALERÍA XF!");
        return { ...p, isSaved };
      }
      return p;
    }));
  };

  const handleFollow = (userName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentGlobalUser) return;
    const isFollowing = posts.find(p => p.userName === userName)?.isFollowing;
    setUser({ ...currentGlobalUser, followingCount: isFollowing ? currentGlobalUser.followingCount - 1 : currentGlobalUser.followingCount + 1 });
    setPosts(prev => prev.map(p => p.userName === userName ? { ...p, isFollowing: !isFollowing } : p));
    if (activeProfile?.userName === userName) setActiveProfile({ ...activeProfile, isFollowing: !isFollowing });
  };

  const scrollShorts = (direction: 'up' | 'down') => {
    if (shortsContainerRef.current) {
        const container = shortsContainerRef.current;
        const scrollAmount = container.clientHeight;
        container.scrollBy({
            top: direction === 'up' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVideoFile(reader.result as string);
        notify?.("¡VIDEO CARGADO DESDE GALERÍA!");
      };
      reader.readAsDataURL(file);
    }
  };

  const publishVideo = () => {
    if (!newVideoFile || !newVideoTitle.trim()) {
        notify?.("DEBES CARGAR UN VIDEO Y ESCRIBIR UN TÍTULO.");
        return;
    }

    setIsUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
        prog += 5;
        setUploadProgress(prog);
        if (prog >= 100) {
            clearInterval(interval);
            const newPost: Post = {
                id: `v-user-${Date.now()}`,
                type: 'video',
                media: newVideoFile,
                content: newVideoTitle,
                userName: currentGlobalUser?.name.split(' ')[0] || 'Usuario_XF',
                userId: currentGlobalUser?.id || 'me',
                userAvatar: currentGlobalUser?.profilePic || 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
                likes: 0,
                views: 0,
                comments: [],
                music: 'Original Audio - ' + (currentGlobalUser?.name || 'XF'),
                isFollowing: true
            };
            
            setPosts([newPost, ...posts]);
            setIsUploading(false);
            setIsCreatorOpen(false);
            setUploadProgress(0);
            setNewVideoFile(null);
            setNewVideoTitle('');
            setActiveType(videoCategory);
            notify?.("¡VIDEO PUBLICADO EXITOSAMENTE EN LA RED!");
        }
    }, 100);
  };

  const addComment = (postId: string) => {
    if (!commentText.trim()) return;
    const newComment: CommentData = {
      id: Date.now().toString(),
      userId: currentGlobalUser?.id || 'me',
      userName: currentGlobalUser?.name || 'Invitado',
      userAvatar: currentGlobalUser?.profilePic || 'https://picsum.photos/seed/me/100',
      text: commentText,
      type: 'text',
      timestamp: 'Ahora'
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p));
    setCommentText('');
  };

  const getUserPosts = (userName: string) => {
    return posts.filter(p => p.userName === userName);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10 font-rajdhani animate-fade-in relative min-h-screen">
      
      {/* Selector de Modo */}
      <div className="flex justify-center items-center gap-4 mb-6 sticky top-0 md:top-4 z-40 px-4 pt-4 md:pt-0">
        <div className="flex bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl">
          <button onClick={() => setActiveType('shorts')} className={`px-6 md:px-12 py-2 md:py-3 rounded-full font-black text-xs md:text-sm italic uppercase transition-all ${activeType === 'shorts' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>SHORTS XF</button>
          <button onClick={() => setActiveType('long')} className={`px-6 md:px-12 py-2 md:py-3 rounded-full font-black text-xs md:text-sm italic uppercase transition-all ${activeType === 'long' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>LARGOS</button>
        </div>
        
        <button 
          onClick={() => setIsCreatorOpen(true)} 
          className="w-12 h-12 md:w-16 md:h-16 bg-red-600 text-white rounded-full flex items-center justify-center border-4 border-white/20 shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-110 active:scale-95 transition-all flex-shrink-0 animate-pulse"
        >
          <Plus size={28} md:size={40} className="stroke-[3px]" />
        </button>
      </div>

      {activeType === 'shorts' ? (
        <div className="relative w-full flex justify-center h-[calc(100vh-160px)]">
            
            {/* Flechas de Navegación PC */}
            <div className="hidden lg:flex fixed left-1/2 -translate-x-[420px] top-1/2 -translate-y-1/2 flex-col gap-6 z-50">
               <button onClick={() => scrollShorts('up')} className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-2xl active:scale-90"><ChevronUp size={32} /></button>
               <div className="w-px h-12 bg-white/10 mx-auto"></div>
               <button onClick={() => scrollShorts('down')} className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-2xl active:scale-90"><ChevronDown size={32} /></button>
            </div>

            <div ref={shortsContainerRef} className="flex flex-col items-center w-full max-w-[500px] snap-y snap-mandatory overflow-y-auto scrollbar-hide h-full">
                {posts.map(post => (
                    <div key={post.id} className="relative w-full aspect-[9/16] bg-black rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden snap-start shadow-2xl border border-white/5 flex-shrink-0 mx-auto group/short mb-10" style={{ height: 'calc(100vh - 180px)', width: 'auto', minWidth: 'min(100%, 450px)' }}>
                        
                        {/* Video Layer - 1080x1920 (9:16) */}
                        <div className="absolute inset-0 z-0">
                            {post.media?.startsWith('data:video') ? (
                                <video src={post.media} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            ) : (
                                <img src={post.media} className="w-full h-full object-cover opacity-90" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                        </div>

                        {/* INTERACCIONES LATERALES (UBICACIÓN DE LÍNEA AMARILLA) */}
                        <div className="absolute right-4 md:right-5 bottom-32 md:bottom-36 z-20 flex flex-col gap-6 md:gap-7 items-center">
                            
                            {/* LIKE BANDERA ARGENTINA (FOTO SOLICITADA) */}
                            <div className="relative">
                                {explodingLikes.includes(post.id) && [...Array(8)].map((_, i) => (
                                <div key={i} className="star-particle" style={{ left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-40px)` }}></div>
                                ))}
                                <button onClick={(e) => handleLike(post.id, e)} className="flex flex-col items-center gap-1 group/like">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center border-2 overflow-hidden transition-all duration-300 ${post.isLiked ? 'border-yellow-400 scale-110 shadow-[0_0_20px_#facc15]' : 'border-white/20 bg-black/20 backdrop-blur-md'}`}>
                                        <div className="w-full h-1/3 bg-[#75AADB]"></div>
                                        <div className="w-full h-1/3 bg-white flex items-center justify-center">
                                            <div className={`w-3 h-3 rounded-full bg-yellow-500 ${post.isLiked ? 'animate-spin shadow-[0_0_8px_#facc15]' : ''}`}></div>
                                        </div>
                                        <div className="w-full h-1/3 bg-[#75AADB]"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-white italic drop-shadow-md">{post.likes.toLocaleString()}</span>
                                </button>
                            </div>

                            {/* COMENTARIOS */}
                            <button onClick={() => setActiveCommentsPost(post)} className="flex flex-col items-center gap-1 group/comm">
                                <div className="p-3 md:p-3.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-red-600 transition-all group-hover/comm:scale-110 shadow-xl">
                                <MessageCircle size={22} md:size={26} />
                                </div>
                                <span className="text-[10px] font-black text-white italic drop-shadow-md">{post.comments.length}</span>
                            </button>

                            {/* GUARDAR (BOOKMARK) */}
                            <button onClick={(e) => handleSave(post.id, e)} className="flex flex-col items-center gap-1 group/save">
                                <div className={`p-3 md:p-3.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 transition-all group-hover/save:scale-110 shadow-xl ${post.isSaved ? 'text-yellow-400 bg-yellow-400/20 border-yellow-400' : 'text-white hover:bg-yellow-600'}`}>
                                <Bookmark size={22} md:size={26} fill={post.isSaved ? "currentColor" : "none"} />
                                </div>
                                <span className="text-[10px] font-black text-white italic drop-shadow-md opacity-0 group-hover/save:opacity-100 transition-opacity uppercase">Guardar</span>
                            </button>

                            {/* COMPARTIR (MULTIREDES) */}
                            <button onClick={() => { setSharingPost(post); setShowShareModal(true); }} className="flex flex-col items-center gap-1 group/share">
                                <div className="p-3 md:p-3.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-purple-600 transition-all group-hover/share:scale-110 shadow-xl">
                                <Share2 size={22} md:size={26} />
                                </div>
                                <span className="text-[10px] font-black text-white italic drop-shadow-md opacity-0 group-hover/share:opacity-100 transition-opacity uppercase">Compartir</span>
                            </button>
                        </div>

                        {/* Información Inferior TikTok Style */}
                        <div className="absolute bottom-6 left-6 right-16 md:bottom-8 md:left-8 md:right-20 z-10">
                            <div className="flex items-center gap-3 md:gap-4 mb-4">
                                <div className="relative cursor-pointer" onClick={() => setActiveProfile(post)}>
                                    <div className="w-10 h-10 md:w-12 md:h-12 diamond-clip bg-black border-2 border-red-600 p-0.5 shadow-2xl overflow-hidden">
                                        <img src={post.userAvatar} className="w-full h-full object-cover diamond-clip" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full border border-black p-0.5"><Plus size={8}/></div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <h4 className="text-sm md:text-base font-black text-white italic uppercase tracking-tighter">@{post.userName}</h4>
                                        <BadgeCheck size={14} className="text-cyan-400" />
                                    </div>
                                    <button onClick={(e) => handleFollow(post.userName, e)} className="text-[7px] md:text-[8px] font-black text-red-500 uppercase tracking-widest italic leading-none text-left mt-0.5">
                                        {post.isFollowing ? 'SIGUIENDO' : 'SEGUIR +'}
                                    </button>
                                </div>
                            </div>
                            <p className="text-[11px] md:text-xs font-bold text-white italic mb-4 leading-snug drop-shadow-lg line-clamp-2">"{post.content}"</p>
                            <div className="flex items-center gap-2 text-[8px] md:text-[9px] text-white/60 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit">
                                <Music size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
                                <span className="uppercase font-black tracking-widest truncate max-w-[120px]">{post.music || 'XFLETCHAX ORIGINAL AUDIO'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        /* Modo Largos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
           {posts.map(post => (
             <div key={post.id} className="bg-black/40 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden group hover:border-red-600/40 transition-all cursor-pointer" onClick={() => setActiveProfile(post)}>
                <div className="aspect-video relative bg-black">
                   <img src={post.media} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Play size={40} className="text-white" /></div>
                </div>
                <div className="p-6 md:p-8">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 diamond-clip border border-red-600 overflow-hidden bg-black flex-shrink-0"><img src={post.userAvatar} className="w-full h-full object-cover" /></div>
                      <h4 className="text-white font-black italic uppercase text-[10px] truncate">@{post.userName}</h4>
                   </div>
                   <h3 className="text-sm md:text-base font-black text-white italic truncate mb-2">"{post.content}"</h3>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* MODAL COMPARTIR (WHATSAPP, TELEGRAM, YOUTUBE, INSTAGRAM, TIKTOK, TWITTER X) */}
      {showShareModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4">
           <div className="w-full max-w-xl bg-[#0a0a10] border-2 border-purple-500/30 rounded-[3.5rem] p-10 text-center shadow-[0_0_80px_rgba(168,85,247,0.2)] relative animate-scale-in">
              <button onClick={() => setShowShareModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white p-3 bg-white/5 rounded-full"><X size={32}/></button>
              <div className="w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
                 <Share2 size={40} className="text-purple-400" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-10">COMPARTIR EN EL MULTIVERSO</h3>
              <div className="grid grid-cols-3 gap-6 mb-10">
                 <button className="flex flex-col items-center gap-3 group transition-all">
                    <div className="w-16 h-16 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20 group-hover:bg-green-600 group-hover:text-white transition-all shadow-xl"><MessageCircle size={32}/></div>
                    <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">WhatsApp</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 group transition-all">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl"><SendHorizonal size={32}/></div>
                    <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">Telegram</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 group transition-all">
                    <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl"><Youtube size={32}/></div>
                    <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">YouTube</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 group transition-all">
                    <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-all shadow-xl"><Instagram size={32}/></div>
                    <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">Instagram</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 group transition-all">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all shadow-xl"><Smartphone size={32}/></div>
                    <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">TikTok</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 group transition-all">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all shadow-xl"><Twitter size={32}/></div>
                    <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">Twitter X</span>
                 </button>
              </div>
              <button onClick={() => { notify?.("¡LINK COPIADO AL PORTAPAPELES!"); setShowShareModal(false); }} className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl flex items-center justify-center gap-4 text-white/60 hover:text-white transition-all font-black text-xs uppercase tracking-widest italic shadow-xl"><LinkIcon size={20} /> COPIAR LINK DIRECTO XF</button>
           </div>
        </div>
      )}

      {/* MODAL COMENTARIOS */}
      {activeCommentsPost && (
         <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-xl flex items-end md:items-center justify-center" onClick={() => setActiveCommentsPost(null)}>
            <div className="w-full max-w-xl bg-[#0a0a0f] border-t-2 md:border-2 border-white/10 rounded-t-[3rem] md:rounded-[4rem] h-[80vh] flex flex-col p-6 md:p-10 animate-slide-up relative shadow-2xl" onClick={e => e.stopPropagation()}>
               <div className="w-16 h-1 bg-white/20 rounded-full mx-auto mb-6 md:hidden"></div>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">XF-COMENTARIOS</h3>
                  <button onClick={() => setActiveCommentsPost(null)}><X size={28} className="text-white/20 hover:text-white" /></button>
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin">
                  {activeCommentsPost.comments.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center opacity-10 italic">
                       <MessageSquare size={40} /><p className="mt-2 font-black uppercase tracking-widest text-[8px]">Silencio Galáctico...</p>
                    </div>
                  ) : (
                    activeCommentsPost.comments.map(c => (
                      <div key={c.id} className="flex gap-3 animate-fade-in">
                         <div className="w-8 h-8 diamond-clip bg-black border border-red-600 overflow-hidden flex-shrink-0"><img src={c.userAvatar} className="w-full h-full object-cover" /></div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <p className="text-[9px] font-black text-red-500 uppercase">@{c.userName}</p>
                               <span className="text-[7px] text-white/20">{c.timestamp}</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-3 rounded-xl rounded-tl-none shadow-inner"><p className="text-xs text-white/80">{c.text}</p></div>
                         </div>
                      </div>
                    ))
                  )}
               </div>
               <div className="flex gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
                  <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addComment(activeCommentsPost.id)} placeholder="Publicar un comentario..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-red-600 italic font-bold" />
                  <button onClick={() => addComment(activeCommentsPost.id)} className="bg-red-600 text-white p-4 rounded-xl shadow-xl active:scale-90 transition-transform"><Send size={20}/></button>
               </div>
            </div>
         </div>
      )}

      {/* MODAL CREADOR DE VIDEOS */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 overflow-y-auto">
           <div className="w-full max-w-4xl bg-[#0a0a0f] border-2 border-white/10 rounded-[3rem] p-6 md:p-12 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-pink-500 to-purple-600"></div>
              <button onClick={() => setIsCreatorOpen(false)} className="absolute top-6 right-6 text-white/30 hover:text-white p-3 bg-white/5 rounded-full"><X size={28}/></button>

              {isUploading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-10">
                   <div className="relative"><div className="w-32 h-32 border-4 border-white/10 border-t-red-600 rounded-full animate-spin"></div><Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 animate-pulse" size={60} /></div>
                   <div className="space-y-4 w-full max-w-md"><h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">SUBIENDO AL SATÉLITE XF...</h3><div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10"><div className="h-full bg-gradient-to-r from-red-600 to-red-900 shadow-[0_0_20px_#dc2626] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div><p className="text-[10px] text-white/40 font-black uppercase tracking-widest italic">{uploadProgress}% - Procesando 1080x1920</p></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                   <div className="space-y-8">
                      <div><h2 className="text-3xl md:text-5xl font-black font-futuristic text-white italic uppercase tracking-tighter mb-2">PUBLICAR VIDEO</h2><p className="text-red-500 font-black text-[10px] tracking-widest uppercase italic">XF Video Lab Studio</p></div>
                      <div className="space-y-4"><p className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-4 italic">SELECCIONAR FORMATO</p><div className="grid grid-cols-2 gap-4"><button onClick={() => setVideoCategory('shorts')} className={`py-5 rounded-2xl border-2 font-black text-xs italic uppercase transition-all flex items-center justify-center gap-3 ${videoCategory === 'shorts' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/10 text-white/40'}`}><Smartphone size={18}/> SHORT 9:16</button><button onClick={() => setVideoCategory('long')} className={`py-5 rounded-2xl border-2 font-black text-xs italic uppercase transition-all flex items-center justify-center gap-3 ${videoCategory === 'long' ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/10 text-white/40'}`}><VideoIcon size={18}/> LARGO 16:9</button></div></div>
                      <div className="space-y-4"><p className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-4 italic">TÍTULO Y DESCRIPCIÓN</p><textarea value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Escribe tu mensaje..." className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] p-6 h-32 outline-none text-white font-bold italic focus:border-red-600 transition-all resize-none" /></div>
                      <button onClick={publishVideo} disabled={!newVideoFile} className={`w-full py-6 rounded-[2.5rem] font-black font-futuristic text-xl italic tracking-widest uppercase shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${newVideoFile ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/40' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}><Upload size={24} /> PUBLICAR AHORA</button>
                   </div>
                   <div className="flex flex-col gap-6"><p className="text-[9px] font-black text-white/30 uppercase tracking-widest text-center italic">ARCHIVO DE GALERÍA (MÓVIL/PC)</p><div onClick={() => fileInputRef.current?.click()} className="flex-1 min-h-[350px] bg-black/60 rounded-[3rem] border-2 border-dashed border-white/10 hover:border-red-600 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative">{newVideoFile ? (<><video ref={videoPreviewRef} src={newVideoFile} className="w-full h-full object-cover opacity-70" /><div className="absolute inset-0 flex items-center justify-center"><Play size={48} className="text-white" /></div><div className="absolute bottom-6 bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">CAMBIAR ARCHIVO</div></>) : (<div className="flex flex-col items-center text-center p-10"><div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 transition-transform"><VideoIcon size={40} className="text-red-500" /></div><p className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">ABRIR ARCHIVOS</p><p className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">1080x1920 Recomendado</p></div>)}</div><input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" /></div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* MODAL PERFIL */}
      {activeProfile && (
         <div className="fixed inset-0 z-[700] bg-black/98 backdrop-blur-3xl p-4 overflow-y-auto animate-fade-in flex flex-col items-center">
            <button onClick={() => setActiveProfile(null)} className="absolute top-4 right-4 text-white/30 hover:text-white p-3 bg-white/5 rounded-2xl border border-white/10 shadow-2xl"><X size={28} /></button>
            <div className="w-full max-w-5xl mt-10">
               <div className="relative bg-black border-2 border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden mb-8">
                  <div className="h-40 w-full relative bg-black"><img src={activeProfile.userBanner || 'https://picsum.photos/seed/pb/1200/400'} className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div></div>
                  <div className="relative z-10 px-6 pb-10 -mt-16 flex flex-col items-center text-center">
                     <div className="relative mb-4"><div className="w-28 h-28 diamond-clip border-4 border-red-600 p-1 bg-black overflow-hidden"><img src={activeProfile.userAvatar} className="w-full h-full object-cover diamond-clip" /></div><div className="absolute -bottom-1 -right-1 bg-cyan-400 p-1 rounded-full border-2 border-black text-black"><BadgeCheck size={18} /></div></div>
                     <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6">{activeProfile.userName}</h2>
                     <div className="flex gap-4"><button onClick={(e) => handleFollow(activeProfile.userName, e)} className={`px-10 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase italic transition-all ${activeProfile.isFollowing ? 'bg-white/10 text-white' : 'bg-red-600 text-white'}`}>{activeProfile.isFollowing ? 'SIGUIENDO' : 'SEGUIR +'}</button><button onClick={() => { onOpenChat?.(activeProfile.userName); setActiveProfile(null); }} className="bg-white/5 border border-white/10 px-10 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase italic flex items-center gap-3"><MessageSquare size={14} /> CHAT</button></div>
                  </div>
               </div>
               <div className="bg-black/60 border-2 border-white/10 rounded-[2.5rem] p-6 mb-20">
                  <h3 className="text-base font-black text-white uppercase italic tracking-tighter mb-6 border-b border-white/5 pb-4">POSTS DE @{activeProfile.userName}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     {getUserPosts(activeProfile.userName).map(p => (
                       <div key={p.id} className="aspect-square bg-black border border-white/10 rounded-2xl overflow-hidden cursor-pointer group relative">
                          <img src={p.media} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Play size={24} className="text-white" /></div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default VideoFeed;
