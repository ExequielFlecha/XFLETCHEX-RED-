
import React, { useState, useRef } from 'react';
import { 
  ThumbsUp, MessageCircle, Share2, Gem, Music, 
  Film, Image as ImageIcon, Video, Type, Sparkles, X, 
  Plus, Play, Square, Smartphone, Monitor, ShieldCheck,
  Upload, Send, Smile, Gift, Bookmark, UserPlus, ExternalLink, StickyNote,
  SendHorizonal, Facebook, Youtube, Instagram, Twitter, Link as LinkIcon
} from 'lucide-react';

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
  type: 'image' | 'video' | 'movie' | 'text';
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
}

const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: 'p1',
      user: 'Exequiel Flecha Baez creador DIOS.',
      avatar: 'https://picsum.photos/seed/admin/200',
      content: '¡Bienvenidos a la red del futuro XFLETCHEX RED! Aquí no existe el copyright. Publica tus películas y música favorita sin miedo. Libertad total. 🚀🔥',
      media: 'https://picsum.photos/seed/space-god/800/450',
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compartir
  const [sharingPost, setSharingPost] = useState<PostData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const liked = !p.isLiked;
        return { ...p, isLiked: liked, likes: liked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const toggleFollow = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isFollowing: !p.isFollowing } : p));
  };

  const handleDiamond = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const diam = !p.isDiamonded;
        return { ...p, isDiamonded: diam, diamonds: diam ? p.diamonds + 1 : p.diamonds - 1 };
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostMedia(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const publishPost = () => {
    const newPost: PostData = {
      id: `post-${Date.now()}`,
      user: 'Exequiel Flecha Baez creador DIOS.',
      avatar: 'https://picsum.photos/seed/admin/200',
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
    resetForm();
  };

  const resetForm = () => {
    setPostContent('');
    setPostMedia(null);
    setPostType('image');
    setAspectRatio('16:9');
    setSelectedMusic('');
  };

  const openShareModal = (post: PostData) => {
    setSharingPost(post);
    setShowShareModal(true);
  };

  const handleSocialShare = (platform: string) => {
    if (!sharingPost) return;
    const url = `https://xfletchex-red.com/feed/${sharingPost.id}`;
    const text = `¡Mira este post en XFLETCHEX RED! @${sharingPost.user}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      alert(`¡Enlace copiado para compartir en ${platform.toUpperCase()}!`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-32 animate-fade-in font-rajdhani">
      <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] p-6 cursor-pointer hover:border-red-600/50 transition-all group flex items-center gap-6" onClick={() => setIsCreatorOpen(true)}>
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
           <Plus size={32} className="text-white" />
        </div>
        <div className="flex-1">
           <p className="text-xl font-black font-futuristic italic text-white/40 group-hover:text-white transition-colors uppercase">¿Qué vas a publicar hoy, Dios?</p>
        </div>
      </div>

      <div className="space-y-10">
        {posts.map(post => (
          <article key={post.id} className="bg-black/40 border border-white/10 rounded-[3.5rem] overflow-hidden hover:border-white/20 transition-all shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl border-2 border-red-600 p-0.5 shadow-xl cursor-pointer">
                    <img src={post.avatar} className="w-full h-full object-cover rounded-[0.8rem]" />
                 </div>
                 <div>
                    <h4 className="font-black font-futuristic text-lg italic text-white leading-none uppercase tracking-tighter cursor-pointer hover:text-red-500">{post.user}</h4>
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1 mt-1"><ShieldCheck size={10}/> VERIFICADO XF</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => toggleFollow(post.id)}
                  className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${post.isFollowing ? 'bg-white/5 text-white/40' : 'bg-red-600 text-white shadow-lg'}`}
                 >
                    {post.isFollowing ? 'Siguiendo' : 'Seguir +'}
                 </button>
              </div>
            </div>

            <div className="px-10 pb-6 text-xl font-medium text-white/90 leading-relaxed italic">"{post.content}"</div>

            {post.media && (
              <div className={`w-full bg-black relative group overflow-hidden flex items-center justify-center ${
                post.aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[700px]' : 
                post.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'
              }`}>
                <img src={post.media} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                {(post.type === 'video' || post.type === 'movie') && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                      <Play size={80} fill="white" className="text-white animate-pulse" />
                   </div>
                )}
              </div>
            )}

            <div className="p-8 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-8">
                 <button onClick={() => handleLike(post.id)} className={`flex items-center gap-3 transition-all ${post.isLiked ? 'scale-125 text-red-500' : 'text-white/40 hover:text-white'}`}>
                    <ThumbsUp size={28} className={post.isLiked ? 'fill-red-500 shadow-xl' : ''} />
                    <span className="text-sm font-black">{post.likes.toLocaleString()}</span>
                 </button>
                 <button onClick={() => handleDiamond(post.id)} className={`flex items-center gap-3 transition-all ${post.isDiamonded ? 'scale-125 text-cyan-400' : 'text-white/40 hover:text-white'}`}>
                    <Gem size={28} className={post.isDiamonded ? 'fill-cyan-400' : ''} />
                    <span className="text-sm font-black">{post.diamonds.toLocaleString()}</span>
                 </button>
                 <button onClick={() => setActiveComments(activeComments === post.id ? null : post.id)} className={`flex items-center gap-3 transition-all ${activeComments === post.id ? 'text-white' : 'text-white/40 hover:text-white'}`}>
                    <MessageCircle size={28} />
                    <span className="text-sm font-black">{post.comments.length}</span>
                 </button>
              </div>
              <div className="flex items-center gap-6">
                 <button onClick={() => toggleSave(post.id)} className={`transition-all ${post.isSaved ? 'text-yellow-500 scale-110' : 'text-white/40 hover:text-white'}`}>
                    <Bookmark size={26} fill={post.isSaved ? "currentColor" : "none"} />
                 </button>
                 <button onClick={() => openShareModal(post)} className="text-white/40 hover:text-purple-500 transition-all">
                    <Share2 size={26} />
                 </button>
              </div>
            </div>

            {activeComments === post.id && (
              <div className="px-10 pb-10 pt-4 border-t border-white/5 animate-slide-up bg-black/20">
                 <div className="flex gap-4 mb-8">
                    <input 
                      type="text" 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && submitComment(post.id)}
                      placeholder="Escribe un comentario..." 
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-red-600 text-sm"
                    />
                    <button onClick={() => submitComment(post.id)} className="bg-red-600 p-4 rounded-2xl hover:scale-110 transition-transform"><Send size={20} /></button>
                 </div>
                 
                 <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">XF</div>
                         <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-[10px] font-black text-red-500 uppercase mb-1">{c.user}</p>
                            <p className="text-sm text-white/80">{c.text}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {isCreatorOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
           <div className="w-full max-w-4xl bg-[#05050a] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-purple-600"></div>
              <button onClick={() => setIsCreatorOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={32}/></button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-8">
                    <div>
                       <h2 className="text-3xl font-black font-futuristic text-white italic mb-2 uppercase">PUBLICACIÓN TOTAL</h2>
                       <p className="text-white/30 text-xs font-bold uppercase tracking-widest italic">Comparte fotos, videos o tus otras redes sociales.</p>
                    </div>

                    <textarea 
                      value={postContent} 
                      onChange={(e) => setPostContent(e.target.value)} 
                      placeholder="Escribe tu mensaje o pega tus links de Instagram/Twitter..." 
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 outline-none text-xl font-bold focus:ring-1 focus:ring-red-600 transition-all resize-none" 
                    />

                    <div className="grid grid-cols-2 gap-4">
                       {[{id: 'image', label: 'FOTO', icon: ImageIcon}, {id: 'video', label: 'VIDEO', icon: Video}, {id: 'movie', label: 'PELÍCULA', icon: Film}, {id: 'text', label: 'REDES', icon: ExternalLink}].map(t => (
                         <button 
                          key={t.id}
                          onClick={() => setPostType(t.id as any)}
                          className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all font-black text-xs uppercase italic tracking-widest ${postType === t.id ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                         >
                            <t.icon size={18} /> {t.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-col gap-6">
                    <div 
                      className="flex-1 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-red-600/30 transition-all" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                       {postMedia ? (
                          <div className="w-full h-full relative">
                             {postType === 'image' ? <img src={postMedia} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center bg-black"><Play size={40} className="text-white opacity-40"/></div>}
                             <button onClick={(e) => { e.stopPropagation(); setPostMedia(null); }} className="absolute top-4 right-4 p-2 bg-red-600 rounded-lg text-white"><X size={16}/></button>
                          </div>
                       ) : (
                          <>
                             <Upload size={48} className="mb-4 text-white/20 group-hover:text-red-500 transition-all"/>
                             <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">Cargar Contenido</p>
                          </>
                       )}
                       <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                    </div>

                    <button 
                      onClick={publishPost} 
                      className="w-full py-6 bg-gradient-to-r from-red-600 to-red-800 rounded-[2rem] font-black font-futuristic text-xl shadow-2xl hover:scale-105 transition-all uppercase italic tracking-widest"
                    >
                       <Sparkles size={24} /> PUBLICAR AHORA
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL COMPARTIR PARA SOCIAL FEED */}
      {showShareModal && sharingPost && (
         <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-[#0a0a10] border-2 border-purple-500/30 rounded-[3.5rem] p-10 text-center shadow-[0_0_80px_rgba(168,85,247,0.4)] relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-500"></div>
               <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black font-futuristic text-white uppercase italic tracking-tighter leading-none">EXPANDIR RED XFLETCHEX</h3><button onClick={() => setShowShareModal(false)} className="text-white/20 hover:text-white transition-all p-2"><X size={32} /></button></div>
               
               <div className="grid grid-cols-3 gap-6 mb-10">
                  <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
                     <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_#16a34a] transition-all"><MessageCircle size={32} fill="currentColor"/></div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">WhatsApp</span>
                  </button>
                  <button onClick={() => handleSocialShare('tiktok')} className="flex flex-col items-center gap-2 group">
                     <div className="w-16 h-16 bg-black rounded-3xl border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_#fff] transition-all"><Smartphone size={32} /></div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">TikTok</span>
                  </button>
                  <button onClick={() => handleSocialShare('instagram')} className="flex flex-col items-center gap-2 group">
                     <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_#c026d3] transition-all"><Instagram size={32} /></div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Instagram</span>
                  </button>
                  <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
                     <div className="w-16 h-16 bg-blue-700 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_#1d4ed8] transition-all"><Facebook size={32} fill="currentColor"/></div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Facebook</span>
                  </button>
                  <button onClick={() => handleSocialShare('youtube')} className="flex flex-col items-center gap-2 group">
                     <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_#dc2626] transition-all"><Youtube size={32} /></div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">YouTube</span>
                  </button>
                  <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 group">
                     <div className="w-16 h-16 bg-blue-400 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_#60a5fa] transition-all"><Twitter size={32} fill="currentColor"/></div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Twitter / X</span>
                  </button>
               </div>

               <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <LinkIcon size={16} className="text-purple-500" />
                    <p className="text-[11px] text-white/40 truncate italic font-mono tracking-tighter">https://xfletchex-red.com/feed/{sharingPost.id}</p>
                  </div>
                  <button 
                    onClick={() => handleSocialShare('copy')}
                    className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest italic hover:bg-purple-600 hover:text-white transition-all whitespace-nowrap shadow-xl"
                  >
                    COPIAR LINK
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default SocialFeed;
