
import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, MessageCircle, Share2, Gem, Music, 
  Film, Image as ImageIcon, Video, Type, Sparkles, X, 
  Plus, Play, Square, Smartphone, Monitor, ShieldCheck,
  Upload, Send, Smile, Gift, Bookmark, UserPlus, ExternalLink, StickyNote,
  SendHorizonal, Facebook, Youtube, Instagram, Twitter, Link as LinkIcon,
  ChevronLeft, ChevronRight, Megaphone, Phone, MessageSquare, Utensils
} from 'lucide-react';
import { Ad } from '../types';

interface CommentData {
  id: string;
  user: string;
  text: string;
  type: 'text' | 'gif' | 'photo' | 'sticker';
}

interface PostData {
  id: string;
  user: string;
  avatar: string;
  content: string;
  media?: string;
  type: 'image' | 'video' | 'movie' | 'text' | 'food_ad';
  aspectRatio: '1:1' | '16:9' | '9:16';
  likes: number;
  diamonds: number;
  comments: CommentData[];
  music?: string;
  isLiked?: boolean;
  isDiamonded?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  noCopyright: boolean;
  foodAdData?: {
    company: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    price: number;
    currencySymbol: string;
  };
}

interface SocialFeedProps {
  ads: Ad[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ ads }) => {
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: 'p1',
      user: 'Exequiel Flecha Baez creador DIOS.',
      avatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
      content: '¡Bienvenidos a la red del futuro XFLETCHAX RED! Aquí no existe el copyright. Publica tus películas y música favorita sin miedo. Libertad total. 🚀🔥',
      media: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      type: 'image',
      aspectRatio: '16:9',
      likes: 154200,
      diamonds: 89000,
      comments: [],
      music: 'XF-Anthem 2025 (God Edition)',
      isLiked: false,
      isDiamonded: false,
      isSaved: false,
      isFollowing: true,
      noCopyright: true
    },
    {
      id: 'f-ad-1',
      user: 'PedidosYa Oficial',
      avatar: 'https://i.postimg.cc/d3/Logo_PedidosYa.png',
      content: '¡Tengo hambre y quiero comer ahora! Pedí tu hamburguesa XF favorita con 50% de descuento usando el código XFLETCHAX.',
      media: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1200',
      type: 'food_ad',
      aspectRatio: '1:1',
      likes: 5400,
      diamonds: 1200,
      comments: [],
      noCopyright: true,
      foodAdData: {
        company: 'PEDIDOSYA ARGENTINA',
        phone: '+5491112345678',
        whatsapp: '+5491112345678',
        telegram: 'pedidosya_xf',
        price: 4500,
        currencySymbol: '$'
      }
    }
  ]);

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [postType, setPostType] = useState<'image' | 'video' | 'movie' | 'text'>('image');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [postContent, setPostContent] = useState('');
  const [postMedia, setPostMedia] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState('');
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<PostData | null>(null);

  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [ads]);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const liked = !p.isLiked;
        return { ...p, isLiked: liked, likes: liked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  };

  const submitComment = (postId: string) => {
    if (!commentInput.trim()) return;
    const newComment: CommentData = {
      id: `c-${Date.now()}`,
      user: 'Invitado_XF',
      text: commentInput,
      type: 'text'
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p));
    setCommentInput('');
  };

  const publishPost = () => {
    const newPost: PostData = {
      id: `post-${Date.now()}`,
      user: 'Exequiel Flecha Baez creador DIOS.',
      avatar: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
      content: postContent,
      media: postMedia || undefined,
      type: postType,
      aspectRatio: aspectRatio,
      likes: 0,
      diamonds: 0,
      comments: [],
      music: selectedMusic || undefined,
      isSaved: false,
      isFollowing: true,
      noCopyright: true
    };
    setPosts([newPost, ...posts]);
    setIsCreatorOpen(false);
    setPostContent('');
    setPostMedia(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-10 pb-32 animate-fade-in font-rajdhani overflow-hidden">
      {/* PUBLICIDAD TOP */}
      {ads.length > 0 && (
        <div className="relative w-full h-40 md:h-64 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-2 border-white/10 group shadow-[0_0_50px_rgba(220,38,38,0.1)] bg-black">
          {ads.map((ad, idx) => (
            <div key={ad.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentAdIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
              <img src={ad.imageUrl} className="w-full h-full object-cover opacity-60" alt="Publicidad" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
              <div className="absolute top-4 left-6 flex items-center gap-2 bg-red-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-2xl">
                <Megaphone size={12} className="text-white animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black text-white uppercase italic tracking-widest">PATROCINADO XF</span>
              </div>
              <div className="absolute bottom-4 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <h3 className="text-base md:text-3xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-tight">{ad.text}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTÓN CREAR POST */}
      <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] p-4 md:p-6 cursor-pointer hover:border-red-600/50 transition-all group flex items-center gap-4 md:gap-6" onClick={() => setIsCreatorOpen(true)}>
        <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform flex-shrink-0">
          <Plus size={24} md:size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm md:text-xl font-black font-futuristic italic text-white/40 group-hover:text-white transition-colors uppercase truncate">¿Qué vas a publicar hoy, Dios?</p>
        </div>
      </div>

      <div className="space-y-8 md:space-y-12">
        {posts.map(post => (
          <article key={post.id} className="bg-black/40 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden hover:border-white/20 transition-all shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
            
            {/* CABECERA POST */}
            <div className="p-6 md:p-8 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-2 border-red-600 p-0.5 shadow-xl flex-shrink-0">
                    <img src={post.avatar} className="w-full h-full object-cover rounded-[0.5rem] md:rounded-[0.8rem]" />
                 </div>
                 <div>
                    <h4 className="font-black font-futuristic text-sm md:text-lg italic text-white leading-none uppercase tracking-tighter cursor-pointer hover:text-red-500 truncate max-w-[150px] md:max-w-none">{post.user}</h4>
                    <span className="text-[8px] md:text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                      <ShieldCheck size={10}/> {post.type === 'food_ad' ? 'PARTNER OFICIAL' : 'VERIFICADO XF'}
                    </span>
                 </div>
              </div>
            </div>

            {/* CONTENIDO TEXTO */}
            <div className="px-6 md:px-10 pb-4 md:pb-6 text-base md:text-xl font-medium text-white/90 leading-relaxed italic">"{post.content}"</div>

            {/* MEDIA - OPTIMIZADA POR RELACIÓN DE ASPECTO */}
            {post.media && (
              <div className={`w-full bg-black relative group overflow-hidden flex items-center justify-center ${
                post.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[500px] md:max-h-[800px]' : 
                post.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'
              }`}>
                <img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                {post.type === 'food_ad' && (
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="text-center md:text-left w-full md:w-auto">
                       <p className="text-[8px] md:text-[10px] text-red-500 font-black uppercase tracking-widest italic">{post.foodAdData?.company}</p>
                       <p className="text-2xl md:text-4xl font-black text-white font-futuristic">{post.foodAdData?.currencySymbol}{post.foodAdData?.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-center">
                       <a href={`tel:${post.foodAdData?.phone}`} className="p-3 md:p-4 bg-white text-black rounded-xl md:rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"><Phone size={20} /></a>
                       <a href={`https://wa.me/${post.foodAdData?.whatsapp}`} target="_blank" className="p-3 md:p-4 bg-green-600 text-white rounded-xl md:rounded-2xl hover:bg-green-500 transition-all shadow-xl"><Smartphone size={20} /></a>
                       <a href={`https://t.me/${post.foodAdData?.telegram}`} target="_blank" className="p-3 md:p-4 bg-blue-500 text-white rounded-xl md:rounded-2xl hover:bg-blue-400 transition-all shadow-xl"><SendHorizonal size={20} /></a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* INTERACCIONES */}
            <div className="p-6 md:p-8 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-6 md:gap-8">
                 <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 md:gap-3 transition-all ${post.isLiked ? 'scale-110 text-red-500' : 'text-white/40 hover:text-white'}`}>
                    <ThumbsUp size={24} md:size={28} className={post.isLiked ? 'fill-red-500' : ''} />
                    <span className="text-xs md:text-sm font-black">{post.likes.toLocaleString()}</span>
                 </button>
                 <button onClick={() => setActiveComments(activeComments === post.id ? null : post.id)} className="flex items-center gap-2 md:gap-3 text-white/40 hover:text-white">
                    <MessageCircle size={24} md:size={28} />
                    <span className="text-xs md:text-sm font-black">{post.comments.length}</span>
                 </button>
              </div>
              <button onClick={() => { setSharingPost(post); setShowShareModal(true); }} className="text-white/40 hover:text-purple-500 transition-all">
                 <Share2 size={24} md:size={26} />
              </button>
            </div>

            {/* COMENTARIOS */}
            {activeComments === post.id && (
              <div className="px-6 md:px-10 pb-6 md:pb-10 pt-4 border-t border-white/5 animate-slide-up bg-black/20">
                 <div className="flex gap-3 md:gap-4 mb-6 md:mb-8">
                    <input 
                      type="text" 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && submitComment(post.id)}
                      placeholder="Escribe un comentario..." 
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 outline-none focus:ring-1 focus:ring-red-600 text-sm md:text-base"
                    />
                    <button onClick={() => submitComment(post.id)} className="bg-red-600 p-3 md:p-4 rounded-xl md:rounded-2xl hover:scale-110 transition-transform">
                      <Send size={18} md:size={20} />
                    </button>
                 </div>
                 <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0" />
                        <div className="flex-1 bg-white/5 rounded-xl p-3">
                          <p className="text-[10px] font-black text-red-500 uppercase">{c.user}</p>
                          <p className="text-xs text-white/80 mt-1">{c.text}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* MODAL CREAR POST */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 overflow-y-auto">
           <div className="w-full max-w-4xl bg-[#05050a] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-purple-600"></div>
              <button onClick={() => setIsCreatorOpen(false)} className="absolute top-6 right-6 md:top-8 md:right-8 text-white/20 hover:text-white p-2">
                <X size={28} md:size={32} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-4">
                 <div className="space-y-6 md:space-y-8">
                    <h2 className="text-2xl md:text-3xl font-black font-futuristic text-white italic mb-2 uppercase tracking-tighter">PUBLICACIÓN TOTAL</h2>
                    <textarea 
                      value={postContent} 
                      onChange={(e) => setPostContent(e.target.value)} 
                      placeholder="Escribe tu mensaje o publica tu empresa de comida..." 
                      className="w-full h-32 md:h-48 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 outline-none text-base md:text-xl font-bold focus:ring-1 focus:ring-red-600 transition-all resize-none italic" 
                    />
                    
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">FORMATO</p>
                        <select 
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-black uppercase text-white outline-none"
                        >
                          <option value="16:9">HORIZONTAL (PC)</option>
                          <option value="9:16">VERTICAL (MÓVIL)</option>
                          <option value="1:1">CUADRADO</option>
                        </select>
                      </div>
                    </div>

                    <button onClick={publishPost} className="w-full py-4 md:py-6 bg-gradient-to-r from-red-600 to-red-800 rounded-xl md:rounded-[2rem] font-black font-futuristic text-lg md:text-xl shadow-2xl transition-all uppercase italic tracking-widest flex items-center justify-center gap-3">
                      <Sparkles size={20} md:size={24} /> PUBLICAR AHORA
                    </button>
                 </div>
                 <div className="flex flex-col gap-6 h-full">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest text-center">PREVISUALIZACIÓN MULTIMEDIA</p>
                    <div className="flex-1 min-h-[200px] bg-white/5 rounded-2xl md:rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-red-600/30 transition-all" onClick={() => fileInputRef.current?.click()}>
                       {postMedia ? <img src={postMedia} className="w-full h-full object-contain" /> : <><Upload size={40} md:size={48} className="mb-4 text-white/20 group-hover:text-red-500 transition-all"/><p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Cargar Contenido</p></>}
                       <input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setPostMedia(reader.result as string); reader.readAsDataURL(file); } }} className="hidden" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL COMPARTIR */}
      {showShareModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
           <div className="w-full max-w-lg bg-[#0a0a10] border-2 border-purple-500/30 rounded-[3rem] p-8 md:p-10 text-center shadow-2xl relative">
              <button onClick={() => setShowShareModal(false)} className="absolute top-6 right-6 text-white/20 hover:text-white"><X size={28}/></button>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-8 md:mb-10">COMPARTIR EN EL MULTIVERSO</h3>
              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-10">
                 {['whatsapp', 'instagram', 'facebook', 'youtube', 'twitter', 'tiktok'].map(net => (
                   <button key={net} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/10 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                         {net === 'whatsapp' ? <MessageCircle size={24} md:size={32} /> : 
                          net === 'instagram' ? <Instagram size={24} md:size={32} /> : 
                          net === 'facebook' ? <Facebook size={24} md:size={32} /> : 
                          net === 'youtube' ? <Youtube size={24} md:size={32} /> : 
                          net === 'twitter' ? <Twitter size={24} md:size={32} /> : <Smartphone size={24} md:size={32} />}
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest italic">{net}</span>
                   </button>
                 ))}
              </div>
              <button className="w-full bg-white/5 border border-white/10 py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 text-white/60 hover:text-white transition-all font-black text-[10px] md:text-xs uppercase tracking-widest italic shadow-xl">
                 <LinkIcon size={16} md:size={18} /> COPIAR LINK XF
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
