
import React, { useState, useRef, useEffect } from 'react';
import { User as UserType, StrikeStatus, Post, CommentData } from '../types';
import { 
  Play, MessageCircle, Share2, Bookmark, Music, 
  X, BadgeCheck, Plus, Upload, MessageSquare, Heart, 
  Mic, Image as ImageIcon, Smile, Ghost, Instagram, 
  Twitter, Youtube, Facebook, Send, Link as LinkIcon, 
  MoreVertical, Smartphone, ThumbsUp, Lock, Globe, Type, FileMusic, Film,
  Users, Eye, UserPlus
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
  
  // Estados del Creador
  const [newPostType, setNewPostType] = useState<'video' | 'image' | 'music' | 'text'>('video');
  const [isPrivate, setIsPrivate] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null);
  
  const [commentText, setCommentText] = useState('');
  const [explodingLikes, setExplodingLikes] = useState<string[]>([]);

  const [posts, setPosts] = useState<Post[]>([
    { 
      id: 'v1', type: 'video', media: 'https://picsum.photos/seed/arg1/1080/1920', 
      content: 'BIENVENIDOS AL IMPERIO XFLETCHEX RED 🇦🇷🔥', 
      userName: 'Exequiel_Flecha_DIOS', 
      userId: 'admin',
      userAvatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
      userBanner: 'https://picsum.photos/seed/adminbanner/1200/400',
      likes: 154200, views: 8940500, comments: [], 
      strikeStatus: StrikeStatus.CLEAN, music: 'Marcha de la Red XF'
    },
    { 
      id: 'v2', type: 'video', media: 'https://picsum.photos/seed/cyber/1080/1920', 
      content: 'La IA de esta red es de otro planeta.', userName: 'Cyber_Agent', 
      userId: 'cyber',
      userAvatar: 'https://picsum.photos/seed/cyberp/100',
      userBanner: 'https://picsum.photos/seed/cyberb/1200/400',
      likes: 45000, views: 500000, comments: [], 
      strikeStatus: StrikeStatus.WARNING, music: 'Neon Nights (Cyber-Remix)'
    }
  ]);

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

  const handleFollow = (userName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentGlobalUser) return;
    const isFollowing = posts.find(p => p.userName === userName)?.isFollowing;
    setUser({ ...currentGlobalUser, followingCount: isFollowing ? currentGlobalUser.followingCount - 1 : currentGlobalUser.followingCount + 1 });
    setPosts(prev => prev.map(p => p.userName === userName ? { ...p, isFollowing: !isFollowing } : p));
    if (activeProfile?.userName === userName) setActiveProfile({ ...activeProfile, isFollowing: !isFollowing });
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

  const handleShare = (platform: string) => {
    if (!sharingPost) return;
    const url = `https://xfletchex-red.com/video/${sharingPost.id}`;
    if (platform === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=Mira este video en XFLETCHEX RED: ${url}`);
    else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      notify?.("Link copiado al portapapeles");
    } else {
      notify?.(`Compartiendo en ${platform.toUpperCase()}...`);
    }
    setShowShareModal(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrar publicaciones por usuario para el perfil
  const getUserPosts = (userName: string) => {
    return posts.filter(p => p.userName === userName);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 font-rajdhani animate-fade-in relative min-h-screen">
      
      {/* Selector de Modo */}
      <div className="flex justify-center items-center gap-4 mb-10 sticky top-4 z-40 px-4">
        <div className="flex bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-2xl">
          <button onClick={() => setActiveType('shorts')} className={`px-12 py-3 rounded-full font-black text-sm italic uppercase transition-all ${activeType === 'shorts' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>SHORTS XF</button>
          <button onClick={() => setActiveType('long')} className={`px-12 py-3 rounded-full font-black text-sm italic uppercase transition-all ${activeType === 'long' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>LARGOS</button>
        </div>
        <button onClick={() => setIsCreatorOpen(true)} className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-all"><Plus size={32} /></button>
      </div>

      {activeType === 'shorts' ? (
        /* Feed Estilo TikTok */
        <div className="flex flex-col items-center gap-6 w-full snap-y snap-mandatory h-[85vh] overflow-y-auto scrollbar-hide">
          {posts.map(post => (
            <div key={post.id} className="relative w-full max-w-[450px] aspect-[9/16] bg-black rounded-[3.5rem] overflow-hidden snap-start shadow-2xl border border-white/10 flex-shrink-0">
               {/* Fondo de Video */}
               <div className="absolute inset-0 z-0">
                  <img src={post.media} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
               </div>

               {/* Interacción Lateral (TikTok Style) */}
               <div className="absolute right-6 bottom-32 z-20 flex flex-col gap-8 items-center">
                  
                  {/* LIKE BANDERA ARGENTINA */}
                  <div className="relative">
                    {explodingLikes.includes(post.id) && [...Array(8)].map((_, i) => (
                      <div key={i} className="star-particle" style={{ left: '50%', top: '50%', transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-40px)` }}></div>
                    ))}
                    <button onClick={(e) => handleLike(post.id, e)} className="flex flex-col items-center gap-1 group">
                      <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 overflow-hidden transition-all duration-300 ${post.isLiked ? 'border-yellow-400 scale-125 shadow-[0_0_20px_#facc15]' : 'border-white/20 shadow-lg'}`}>
                         <div className="w-full h-1/3 bg-[#75AADB]"></div>
                         <div className="w-full h-1/3 bg-white flex items-center justify-center">
                            <div className={`w-4 h-4 rounded-full bg-yellow-500 ${post.isLiked ? 'animate-spin shadow-[0_0_8px_#facc15]' : ''}`}></div>
                         </div>
                         <div className="w-full h-1/3 bg-[#75AADB]"></div>
                      </div>
                      <span className="text-xs font-black text-white italic drop-shadow-md">{post.likes.toLocaleString()}</span>
                    </button>
                  </div>

                  {/* COMENTARIOS */}
                  <button onClick={() => setActiveCommentsPost(post)} className="flex flex-col items-center gap-1">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-red-600 transition-all">
                       <MessageCircle size={28} />
                    </div>
                    <span className="text-xs font-black text-white italic">{post.comments.length}</span>
                  </button>

                  {/* GUARDAR */}
                  <button onClick={() => setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isSaved: !p.isSaved } : p))} className="flex flex-col items-center gap-1">
                    <div className={`p-4 backdrop-blur-md rounded-full border transition-all ${post.isSaved ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_#facc15]' : 'bg-white/10 text-white border-white/20'}`}>
                       <Bookmark size={28} fill={post.isSaved ? "currentColor" : "none"} />
                    </div>
                  </button>

                  {/* COMPARTIR */}
                  <button onClick={() => { setSharingPost(post); setShowShareModal(true); }} className="flex flex-col items-center gap-1">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-purple-600 transition-all">
                       <Share2 size={28} />
                    </div>
                  </button>
               </div>

               {/* Información Inferior (Perfil y Título) */}
               <div className="absolute bottom-8 left-8 right-24 z-10">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="relative cursor-pointer" onClick={() => setActiveProfile(post)}>
                        <div className="w-14 h-14 diamond-clip bg-black border-2 border-red-600 p-0.5 shadow-2xl overflow-hidden">
                           <img src={post.userAvatar} className="w-full h-full object-cover diamond-clip" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full border border-black p-0.5"><Plus size={12}/></div>
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">@{post.userName}</h4>
                           <BadgeCheck size={18} className="text-cyan-400" />
                        </div>
                        <div className="flex gap-1.5 mt-1">
                           <div className={`w-2 h-2 rounded-full ${post.strikeStatus === StrikeStatus.CLEAN ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : post.strikeStatus === StrikeStatus.WARNING ? 'bg-yellow-500 shadow-[0_0_5px_#eab308]' : 'bg-red-600 shadow-[0_0_5px_#dc2626]'}`}></div>
                           <button onClick={(e) => handleFollow(post.userName, e)} className="text-[10px] font-black text-red-500 uppercase tracking-widest italic leading-none">
                              {post.isFollowing ? 'SIGUIENDO' : 'SEGUIR +'}
                           </button>
                        </div>
                     </div>
                  </div>
                  <p className="text-sm font-bold text-white italic mb-6 leading-tight drop-shadow-lg">"{post.content}"</p>
                  <div className="flex items-center gap-3 text-[10px] text-white/60 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit">
                     <Music size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                     <span className="uppercase font-black tracking-widest truncate max-w-[150px]">{post.music || 'XFLETCHEX ORIGINAL AUDIO'}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        /* Modo Largos / Cuadrícula */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.map(post => (
             <div key={post.id} className="bg-black/40 border border-white/10 rounded-[3rem] overflow-hidden group hover:border-red-600/40 transition-all cursor-pointer" onClick={() => setActiveProfile(post)}>
                <div className="aspect-video relative bg-black">
                   <img src={post.media} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Play size={60} className="text-white" /></div>
                </div>
                <div className="p-8">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 diamond-clip border border-red-600 overflow-hidden bg-black"><img src={post.userAvatar} className="w-full h-full object-cover" /></div>
                      <h4 className="text-white font-black italic uppercase text-xs truncate">@{post.userName}</h4>
                   </div>
                   <h3 className="text-lg font-black text-white italic truncate mb-6">"{post.content}"</h3>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Cajón de Comentarios Multimedia (Drawer) */}
      {activeCommentsPost && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end justify-center" onClick={() => setActiveCommentsPost(null)}>
            <div className="w-full max-w-xl bg-[#0a0a0f] border-t-2 border-white/10 rounded-t-[4rem] h-[75vh] flex flex-col p-10 animate-slide-up relative shadow-[0_-20px_50px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
               <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mb-10"></div>
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">COMENTARIOS XFLETCHEX</h3>
                  <button onClick={() => setActiveCommentsPost(null)}><X size={32} className="text-white/20 hover:text-white" /></button>
               </div>

               <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 scrollbar-thin">
                  {activeCommentsPost.comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 italic">
                       <MessageSquare size={80} />
                       <p className="mt-4 font-black uppercase tracking-[0.5em] text-[10px]">Silencio Cósmico...</p>
                    </div>
                  ) : (
                    activeCommentsPost.comments.map(c => (
                      <div key={c.id} className="flex gap-4 group">
                         <div className="w-10 h-10 diamond-clip bg-black border border-red-600 overflow-hidden flex-shrink-0"><img src={c.userAvatar} className="w-full h-full object-cover" /></div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                               <p className="text-[10px] font-black text-red-500 uppercase italic">@{c.userName}</p>
                               <span className="text-[8px] text-white/20 font-bold">{c.timestamp}</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                               <p className="text-sm text-white/80">{c.text}</p>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>

               {/* Barra Multimedia Táctica */}
               <div className="space-y-4">
                  <div className="flex items-center gap-4 px-2">
                     <button className="text-white/30 hover:text-yellow-400 transition-colors"><Smile size={24}/></button>
                     <button className="text-white/30 hover:text-cyan-400 transition-colors"><ImageIcon size={24}/></button>
                     <button className="text-white/30 hover:text-purple-400 transition-colors"><Ghost size={24}/></button>
                     <button className="text-white/30 hover:text-red-600 transition-colors animate-pulse"><Mic size={24}/></button>
                  </div>
                  <div className="flex gap-4">
                     <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addComment(activeCommentsPost.id)} placeholder="Añadir comentario..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-1 focus:ring-red-600 italic font-bold" />
                     <button onClick={() => addComment(activeCommentsPost.id)} className="bg-red-600 text-white p-5 rounded-2xl shadow-xl active:scale-90 transition-transform"><Send size={24}/></button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Modal de Compartir Universal */}
      {showShareModal && sharingPost && (
         <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
            <div className="w-full max-w-lg bg-[#0a0a10] border-2 border-purple-500/30 rounded-[3.5rem] p-10 text-center shadow-2xl relative">
               <button onClick={() => setShowShareModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={32}/></button>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10">COMPARTIR EN EL MULTIVERSO</h3>
               <div className="grid grid-cols-3 gap-8 mb-10">
                  {['whatsapp', 'instagram', 'facebook', 'youtube', 'twitter', 'tiktok'].map(net => (
                    <button key={net} onClick={() => handleShare(net)} className="flex flex-col items-center gap-2 group">
                       <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 border border-white/10 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all uppercase font-black text-[8px]">
                          {net === 'whatsapp' ? <MessageCircle size={32} /> : 
                           net === 'instagram' ? <Instagram size={32} /> : 
                           net === 'facebook' ? <Facebook size={32} /> : 
                           net === 'youtube' ? <Youtube size={32} /> : 
                           net === 'twitter' ? <Twitter size={32} /> : <Smartphone size={32} />}
                       </div>
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{net}</span>
                    </button>
                  ))}
               </div>
               <button onClick={() => handleShare('copy')} className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl flex items-center justify-center gap-3 text-white/60 hover:text-white transition-all font-black text-xs uppercase tracking-widest italic shadow-xl">
                  <LinkIcon size={18} /> COPIAR LINK DE PERFIL XF
               </button>
            </div>
         </div>
      )}

      {/* PERFIL DIAMANTE ACTUALIZADO (ERROR FIX) */}
      {activeProfile && (
         <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl p-6 md:p-12 overflow-y-auto animate-fade-in flex flex-col items-center">
            <button onClick={() => setActiveProfile(null)} className="absolute top-10 right-10 text-white/30 hover:text-white transition-colors bg-white/5 p-4 rounded-3xl border border-white/10 z-[110] shadow-2xl"><X size={36} /></button>
            
            <div className="w-full max-w-5xl">
               <div className="relative bg-black border-2 border-white/10 rounded-[4rem] shadow-2xl overflow-hidden mb-10">
                  <div className="h-64 md:h-80 w-full relative bg-black">
                     <img src={activeProfile.userBanner || 'https://picsum.photos/seed/profile-banner/1200/400'} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>

                  <div className="relative z-10 px-8 pb-12 -mt-24 flex flex-col items-center text-center">
                     <div className="relative group mb-6">
                        <div className="w-40 h-40 diamond-clip border-4 border-red-600 p-1.5 shadow-[0_0_50px_rgba(220,38,38,0.4)] overflow-hidden bg-black">
                           <img src={activeProfile.userAvatar} className="w-full h-full object-cover diamond-clip" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-cyan-400 p-2 rounded-full border-2 border-black text-black shadow-xl"><BadgeCheck size={24} /></div>
                     </div>

                     <div className="space-y-2 mb-8">
                        <h2 className="text-3xl font-black font-futuristic text-white italic uppercase tracking-tighter leading-none">{activeProfile.userName}</h2>
                        <div className="flex justify-center gap-2 items-center">
                           <div className="flex gap-1.5 p-1.5 bg-white/5 rounded-xl border border-white/10">
                              <div className={`w-3 h-3 rounded-full ${activeProfile.strikeStatus === StrikeStatus.CLEAN ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/5'}`}></div>
                              <div className={`w-3 h-3 rounded-full ${activeProfile.strikeStatus === StrikeStatus.WARNING ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-white/5'}`}></div>
                              <div className={`w-3 h-3 rounded-full ${activeProfile.strikeStatus === StrikeStatus.BANNED ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-white/5'}`}></div>
                           </div>
                           <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] italic">Estatus de Seguridad</span>
                        </div>
                     </div>

                     {/* Contadores del Perfil (Seguidores, Seguidos, Vistas) */}
                     <div className="grid grid-cols-3 gap-6 w-full max-w-lg mb-10">
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                           <Users size={18} className="text-red-500 mx-auto mb-2" />
                           <p className="text-xl font-black text-white italic leading-none">{activeProfile.userName === 'Exequiel_Flecha_DIOS' ? '1.5M' : '45.2K'}</p>
                           <p className="text-[7px] text-white/20 font-black uppercase tracking-widest mt-1">Fans</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                           <UserPlus size={18} className="text-cyan-400 mx-auto mb-2" />
                           <p className="text-xl font-black text-white italic leading-none">{activeProfile.userName === 'Exequiel_Flecha_DIOS' ? '0' : '124'}</p>
                           <p className="text-[7px] text-white/20 font-black uppercase tracking-widest mt-1">Siguiendo</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                           <Eye size={18} className="text-purple-500 mx-auto mb-2" />
                           <p className="text-xl font-black text-white italic leading-none">{activeProfile.userName === 'Exequiel_Flecha_DIOS' ? '8.9M' : '500K'}</p>
                           <p className="text-[7px] text-white/20 font-black uppercase tracking-widest mt-1">Vistas</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-4 justify-center w-full">
                        <button onClick={(e) => handleFollow(activeProfile.userName, e)} className={`flex-1 max-w-[200px] py-4 rounded-2xl font-black font-futuristic text-[10px] tracking-widest uppercase italic shadow-2xl transition-all ${activeProfile.isFollowing ? 'bg-white/10 text-white border border-white/20' : 'bg-red-600 text-white hover:scale-105'}`}>{activeProfile.isFollowing ? 'SIGUIENDO' : 'SEGUIR +'}</button>
                        <button onClick={() => { onOpenChat?.(activeProfile.userName); setActiveProfile(null); }} className="flex-1 max-w-[200px] bg-white/5 border border-white/10 py-4 rounded-2xl font-black font-futuristic text-[10px] tracking-widest uppercase italic hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-2xl"><MessageSquare size={16} /> CHAT PRIVADO</button>
                     </div>
                  </div>
               </div>

               {/* Cuadrícula de Publicaciones Automática */}
               <div className="bg-black/60 border-2 border-white/10 rounded-[4rem] p-10 min-h-[400px]">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 border-b border-white/5 pb-4">PUBLICACIONES DE @{activeProfile.userName}</h3>
                  
                  {getUserPosts(activeProfile.userName).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {getUserPosts(activeProfile.userName).map(p => (
                         <div 
                           key={p.id} 
                           onClick={() => { setActiveProfile(null); setActiveType(p.type === 'video' ? 'shorts' : 'long'); }} 
                           className="aspect-square bg-black border border-white/10 rounded-3xl overflow-hidden cursor-pointer group relative"
                         >
                            <img src={p.media} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/20">
                               {p.type === 'video' ? <Play size={32} className="text-white" /> : <ImageIcon size={32} className="text-white" />}
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/10 py-20">
                       <Smartphone size={80} />
                       <p className="mt-4 font-black uppercase tracking-[0.4em] text-[10px]">Aún no hay publicaciones</p>
                    </div>
                  )}
               </div>
            </div>
         </div>
      )}

      {/* MODAL CREADOR DE PUBLICACIONES (FIXED ERROR FROM IMAGE) */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
          <div className="w-full max-w-xl bg-[#08080c] border-2 border-white/10 rounded-[3.5rem] p-10 shadow-2xl relative animate-scale-in">
             <button onClick={() => setIsCreatorOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-all p-2"><X size={32}/></button>
             
             <h2 className="text-3xl font-black text-white uppercase italic text-center mb-8 tracking-tighter font-futuristic">PUBLICAR EN XFLETCHEX</h2>
             
             <div className="space-y-6">
                {/* Input de Texto */}
                <div className="relative">
                   <textarea 
                     value={newPostTitle}
                     onChange={(e) => setNewPostTitle(e.target.value)}
                     placeholder="¿Qué quieres decir al mundo?" 
                     className="w-full bg-[#121218] border border-white/5 rounded-3xl py-6 px-8 text-white text-lg font-bold outline-none focus:ring-1 focus:ring-red-600 italic placeholder-white/20 resize-none h-32"
                   />
                </div>

                {/* Área de Subida con bordes punteados */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-600 transition-all group overflow-hidden"
                >
                   {newPostMedia ? (
                      newPostType === 'image' ? (
                         <img src={newPostMedia} className="w-full h-full object-cover" />
                      ) : (
                         <div className="flex flex-col items-center text-white/60">
                            <Play size={40} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase mt-4 italic tracking-widest">MULTIMEDIA LISTA</span>
                         </div>
                      )
                   ) : (
                      <>
                        <Upload size={48} className="text-white/10 group-hover:text-red-500 transition-all mb-4" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic leading-none">Cargar Video, Foto o Música</p>
                      </>
                   )}
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewPostMedia(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                     }} 
                     className="hidden" 
                   />
                </div>

                {/* Selección de Formato */}
                <div className="grid grid-cols-4 gap-2">
                   {[
                     { id: 'video', icon: Film, label: 'VIDEO' },
                     { id: 'image', icon: ImageIcon, label: 'FOTO' },
                     { id: 'music', icon: FileMusic, label: 'MÚSICA' },
                     { id: 'text', icon: Type, label: 'TEXTO' }
                   ].map(fmt => (
                     <button 
                       key={fmt.id}
                       onClick={() => setNewPostType(fmt.id as any)}
                       className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${newPostType === fmt.id ? 'bg-red-600/10 border-red-500 text-red-500 shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                     >
                        <fmt.icon size={18} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{fmt.label}</span>
                     </button>
                   ))}
                </div>

                {/* Selector de Privacidad */}
                <div className="flex gap-4">
                   <button 
                     onClick={() => setIsPrivate(false)}
                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest italic ${!isPrivate ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-white/20'}`}
                   >
                      <Globe size={16} /> PÚBLICO (TODO EL MUNDO)
                   </button>
                   <button 
                     onClick={() => setIsPrivate(true)}
                     className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest italic ${isPrivate ? 'bg-red-600/10 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-white/20'}`}
                   >
                      <Lock size={16} /> PRIVADO (SOLO TÚ)
                   </button>
                </div>

                {/* Botón de Publicación */}
                <button 
                  onClick={() => {
                    const np: Post = {
                      id: Date.now().toString(),
                      userId: 'me',
                      userName: currentGlobalUser?.name || 'Exequiel_Flecha_DIOS',
                      userAvatar: currentGlobalUser?.profilePic || 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
                      userBanner: currentGlobalUser?.bannerPic,
                      content: newPostTitle,
                      media: newPostMedia || undefined,
                      type: newPostType,
                      likes: 0,
                      views: 0,
                      comments: [],
                      strikeStatus: currentGlobalUser?.strike || StrikeStatus.CLEAN
                    };
                    setPosts([np, ...posts]);
                    setIsCreatorOpen(false);
                    setNewPostTitle('');
                    setNewPostMedia(null);
                    notify?.(`¡Publicado en ${isPrivate ? 'PRIVADO' : 'PÚBLICO'} con éxito!`);
                  }}
                  className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-3xl text-sm uppercase italic tracking-widest shadow-2xl shadow-red-900/40 transition-all active:scale-95"
                >
                  PUBLICA AHORA
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
