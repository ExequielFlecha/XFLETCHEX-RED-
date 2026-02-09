
import React, { useState, useRef, useEffect } from 'react';
import { User, StrikeStatus, Post } from '../types';
import { 
  Camera, Edit3, ShieldAlert, ShieldCheck, Eye, EyeOff, 
  Plus, Image as ImageIcon, Video, Trash2, CheckCircle, 
  BadgeCheck, Users, Globe, Lock, Save, Upload, Sparkles, X
} from 'lucide-react';

interface ProfileModuleProps {
  user: User;
  setUser: (u: User) => void;
  notify: (msg: string) => void;
}

const ProfileModule: React.FC<ProfileModuleProps> = ({ user, setUser, notify }) => {
  const [activeTab, setActiveTab] = useState<'POSTS' | 'GALLERY' | 'CONFIG'>('POSTS');
  const [userPosts, setUserPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`xf_user_posts_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState(user.name);
  const [isPrivacyPrivate, setIsPrivacyPrivate] = useState(user.isPrivate || false);

  // Estados para creación de nuevo post
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<string | null>(null);
  const [newPostType, setNewPostType] = useState<'image' | 'video'>('image');
  const [newPostPrivate, setNewPostPrivate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pfpInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const postMediaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(`xf_user_posts_${user.id}`, JSON.stringify(userPosts));
  }, [userPosts, user.id]);

  const handleUpdateUser = (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('xf_user_data', JSON.stringify(updatedUser));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'PFP' | 'BANNER' | 'POST') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'PFP') {
          handleUpdateUser({ profilePic: result });
          notify("¡FOTO DE DIAMANTE ACTUALIZADA!");
        } else if (target === 'BANNER') {
          handleUpdateUser({ bannerPic: result });
          notify("¡PORTADA DE RED ACTUALIZADA!");
        } else if (target === 'POST') {
          setNewPostMedia(result);
          setNewPostType(file.type.startsWith('video') ? 'video' : 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const publishPost = () => {
    if (!newPostContent.trim() && !newPostMedia) {
      notify("ERROR: EL POST ESTÁ VACÍO.");
      return;
    }
    const newPost: Post = {
      id: `up-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.profilePic,
      content: newPostContent,
      media: newPostMedia || undefined,
      type: newPostType,
      likes: 0,
      views: 0,
      comments: [],
      isPrivate: newPostPrivate
    };
    setUserPosts([newPost, ...userPosts]);
    setIsCreatorOpen(false);
    setNewPostContent('');
    setNewPostMedia(null);
    notify("¡CONTENIDO PUBLICADO Y GUARDADO AUTOMÁTICAMENTE!");
  };

  const deletePost = (id: string) => {
    setUserPosts(userPosts.filter(p => p.id !== id));
    notify("POST ELIMINADO.");
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-fade-in font-rajdhani">
      
      {/* SECCIÓN CABECERA: BANNER Y PORTADA (CORREGIDO) */}
      <div className="relative mb-24">
        <div className="h-48 md:h-80 w-full bg-[#050508] border-2 border-white/10 rounded-[3rem] overflow-hidden relative group shadow-2xl">
          <img 
            src={user.bannerPic || 'https://picsum.photos/seed/defaultbanner/1200/400'} 
            className="w-full h-full object-cover opacity-80" 
            alt="Portada"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          {/* BOTÓN CENTRAL DE CÁMARA PARA PORTADA (PUNTO SEÑALADO POR EL USUARIO) */}
          <button 
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-xl p-5 md:p-7 rounded-full text-white border-2 border-white/20 hover:bg-red-600 hover:border-red-400 transition-all shadow-[0_0_40px_rgba(0,0,0,0.8)] active:scale-90 z-20 flex flex-col items-center gap-2 group/btn"
            title="Cambiar Foto de Portada"
          >
            <Camera size={window.innerWidth < 768 ? 28 : 40} className="group-hover/btn:scale-110 transition-transform" />
            <span className="text-[7px] font-black uppercase tracking-[0.3em] hidden md:block italic">Editar Portada</span>
          </button>
          
          <input 
            type="file" 
            ref={bannerInputRef} 
            onChange={(e) => handleFileUpload(e, 'BANNER')} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* PERFIL DIAMANTE POSICIONADO */}
        <div className="absolute -bottom-16 left-10 md:left-16 flex flex-col md:flex-row items-end gap-6 md:gap-10">
           <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 diamond-clip bg-black border-4 border-red-600 p-1 md:p-1.5 shadow-[0_0_50px_rgba(220,38,38,0.5)] overflow-hidden">
                 <img src={user.profilePic} className="w-full h-full object-cover diamond-clip" />
              </div>
              <button 
                onClick={() => pfpInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-red-600 text-white p-2 md:p-3 rounded-full border-4 border-black hover:scale-110 transition-all shadow-xl z-10"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={pfpInputRef} onChange={(e) => handleFileUpload(e, 'PFP')} className="hidden" accept="image/*" />
           </div>

           <div className="mb-4 md:mb-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 <h1 className="text-3xl md:text-5xl font-black font-futuristic italic text-white uppercase tracking-tighter leading-none drop-shadow-2xl">{user.name}</h1>
                 {user.isVerified && <BadgeCheck size={28} className="text-cyan-400" />}
              </div>
              <p className="text-red-500 font-black text-[10px] md:text-xs tracking-[0.4em] uppercase italic mt-2">USUARIO DEL MUNDO XF</p>
           </div>
        </div>

        {/* INDICADOR DE PRIVACIDAD GLOBAL */}
        <div className="absolute top-4 right-10 flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
           {isPrivacyPrivate ? <Lock size={14} className="text-red-500" /> : <Globe size={14} className="text-green-500" />}
           <span className={`text-[10px] font-black uppercase italic ${isPrivacyPrivate ? 'text-red-500' : 'text-green-500'}`}>
              PERFIL {isPrivacyPrivate ? 'PRIVADO' : 'PÚBLICO'}
           </span>
        </div>
      </div>

      {/* SISTEMA DE SEMÁFORO (STRIKES) Y ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
         
         {/* SEMÁFORO STRIKES */}
         <div className="md:col-span-4 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-inner">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-6 italic">Estatus de Conducta (Strikes)</h3>
            <div className="flex gap-8 items-center">
               <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 transition-all ${user.strike === StrikeStatus.CLEAN ? 'bg-green-500 border-white shadow-[0_0_20px_#22c55e]' : 'bg-white/5 border-white/5'}`}></div>
                  <span className="text-[8px] font-black text-green-500 italic">LIMPIO</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 transition-all ${user.strike === StrikeStatus.WARNING ? 'bg-yellow-500 border-white shadow-[0_0_20px_#eab308]' : 'bg-white/5 border-white/5'}`}></div>
                  <span className="text-[8px] font-black text-yellow-500 italic">ADVERTENCIA</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 transition-all ${user.strike === StrikeStatus.BANNED ? 'bg-red-600 border-white shadow-[0_0_20px_#dc2626]' : 'bg-white/5 border-white/5'}`}></div>
                  <span className="text-[8px] font-black text-red-600 italic">EXPULSIÓN</span>
               </div>
            </div>
         </div>

         {/* STATS CARDS */}
         <div className="md:col-span-8 grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-center hover:bg-white/10 transition-all shadow-xl">
               <p className="text-3xl md:text-4xl font-black text-white italic">{user.followersCount.toLocaleString()}</p>
               <p className="text-[9px] text-white/30 font-black uppercase mt-1">Seguidores</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-center hover:bg-white/10 transition-all shadow-xl">
               <p className="text-3xl md:text-4xl font-black text-white italic">{user.followingCount.toLocaleString()}</p>
               <p className="text-[9px] text-white/30 font-black uppercase mt-1">Seguidos</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-center hover:bg-white/10 transition-all shadow-xl">
               <p className="text-3xl md:text-4xl font-black text-white italic">{user.viewsCount.toLocaleString()}</p>
               <p className="text-[9px] text-white/30 font-black uppercase mt-1">Vistas Totales</p>
            </div>
         </div>
      </div>

      {/* SELECTOR DE SECCIONES */}
      <div className="flex justify-center mb-10">
         <div className="bg-black/60 p-1.5 rounded-full flex border border-white/10 backdrop-blur-xl shadow-2xl">
            <button onClick={() => setActiveTab('POSTS')} className={`px-10 py-3 rounded-full font-black text-[10px] italic uppercase transition-all ${activeTab === 'POSTS' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Publicaciones</button>
            <button onClick={() => setActiveTab('GALLERY')} className={`px-10 py-3 rounded-full font-black text-[10px] italic uppercase transition-all ${activeTab === 'GALLERY' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Multimedia</button>
            <button onClick={() => setActiveTab('CONFIG')} className={`px-10 py-3 rounded-full font-black text-[10px] italic uppercase transition-all ${activeTab === 'CONFIG' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Ajustes Perfil</button>
         </div>
      </div>

      {/* CONTENIDO SEGÚN TAB */}
      {activeTab === 'POSTS' && (
        <div className="space-y-8 animate-fade-in">
           {/* BOTÓN CREAR POST LOCAL */}
           <div 
             onClick={() => setIsCreatorOpen(true)}
             className="bg-gradient-to-r from-red-600/10 to-transparent border-2 border-dashed border-white/10 p-10 rounded-[3rem] text-center cursor-pointer hover:border-red-600 transition-all group shadow-xl"
           >
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                 <Plus size={32} className="text-white" />
              </div>
              <p className="text-2xl font-black font-futuristic text-white italic uppercase tracking-tighter">Publicar nueva Foto o Video</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userPosts.map(post => (
                <div key={post.id} className="bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all relative shadow-2xl">
                   <div className="p-6 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 diamond-clip bg-red-600/20 p-0.5"><img src={user.profilePic} className="w-full h-full object-cover diamond-clip" /></div>
                         <span className="text-xs font-black text-white italic uppercase">{user.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         {post.isPrivate ? <Lock size={12} className="text-red-500" /> : <Globe size={12} className="text-green-500" />}
                         <button onClick={() => deletePost(post.id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                   </div>
                   {post.media && (
                      <div className="aspect-video bg-black overflow-hidden flex items-center justify-center">
                         {post.type === 'image' ? <img src={post.media} className="w-full h-full object-cover" /> : <video src={post.media} className="w-full h-full object-cover" controls />}
                      </div>
                   )}
                   <div className="p-6">
                      <p className="text-sm font-bold text-white/80 italic leading-relaxed">"{post.content}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'GALLERY' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
           {userPosts.filter(p => p.media).map(post => (
              <div key={post.id} className="aspect-square bg-black rounded-3xl overflow-hidden border border-white/10 relative group shadow-lg">
                 {post.type === 'image' ? <img src={post.media} className="w-full h-full object-cover" /> : <video src={post.media} className="w-full h-full object-cover" />}
                 <div className="absolute inset-0 bg-red-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {post.type === 'image' ? <ImageIcon size={32}/> : <Video size={32}/>}
                 </div>
              </div>
           ))}
        </div>
      )}

      {activeTab === 'CONFIG' && (
        <div className="bg-[#0a0a0f] border border-white/10 rounded-[3rem] p-10 md:p-16 animate-fade-in shadow-2xl">
           <h2 className="text-3xl font-black font-futuristic text-white uppercase italic tracking-tighter mb-12 border-b border-white/5 pb-6 flex items-center gap-4">
              <Edit3 className="text-cyan-400" /> CONFIGURACIÓN DE IDENTIDAD
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 italic">CAMBIAR NOMBRE PÚBLICO</p>
                    <div className="relative">
                       <input 
                         type="text" 
                         value={newName} 
                         onChange={(e) => setNewName(e.target.value)}
                         className="w-full bg-white/5 border-2 border-white/5 rounded-2xl py-5 px-8 text-xl text-white font-black italic uppercase outline-none focus:border-red-600" 
                       />
                       <button 
                         onClick={() => { handleUpdateUser({ name: newName }); notify("¡NOMBRE ACTUALIZADO!"); }}
                         className="absolute right-4 top-4 bg-red-600 text-white p-2 rounded-xl hover:scale-110 transition-all"
                       >
                          <Save size={20} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 italic">ESTATUS DE PRIVACIDAD</p>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => { setIsPrivacyPrivate(false); handleUpdateUser({ isPrivate: false }); }}
                         className={`flex-1 py-5 rounded-2xl font-black text-xs border transition-all flex items-center justify-center gap-3 ${!isPrivacyPrivate ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-white/5 text-white/40'}`}
                       >
                          <Globe size={18} /> PÚBLICO
                       </button>
                       <button 
                         onClick={() => { setIsPrivacyPrivate(true); handleUpdateUser({ isPrivate: true }); }}
                         className={`flex-1 py-5 rounded-2xl font-black text-xs border transition-all flex items-center justify-center gap-3 ${isPrivacyPrivate ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-white/5 border-white/5 text-white/40'}`}
                       >
                          <Lock size={18} /> PRIVADO
                       </button>
                    </div>
                    <p className="text-[8px] text-white/20 italic text-center mt-4 uppercase">NOTA: El perfil principal siempre es visible para el mundo XF, pero tus posts pueden ser ocultados.</p>
                 </div>
              </div>

              <div className="space-y-8 flex flex-col justify-center bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                 <div className="flex items-center gap-4 text-cyan-400 mb-4">
                    <Sparkles size={24} />
                    <h4 className="font-black text-lg uppercase italic tracking-tighter">IDENTIDAD ESTELAR</h4>
                 </div>
                 <p className="text-sm font-bold text-white/40 italic leading-relaxed">
                   "Tu nombre e imagen son tu marca en la red XFLETCHAX. Sé original, mantén tu semáforo en VERDE y alcanza la cima del multiverso."
                 </p>
                 <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-[10px] font-black text-white/60 uppercase">DNI-XF Validado</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL CREADOR DE POSTS */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 overflow-y-auto animate-fade-in">
           <div className="w-full max-w-4xl bg-[#0a0a0f] border-2 border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-cyan-500 to-purple-600"></div>
              <button onClick={() => setIsCreatorOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white p-3 bg-white/5 rounded-full border border-white/10 transition-all"><X size={32}/></button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h2 className="text-4xl font-black font-futuristic text-white uppercase italic tracking-tighter leading-none">PUBLICAR AHORA</h2>
                    
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="¿Qué vas a mostrar al mundo hoy?"
                      className="w-full bg-black/40 border-2 border-white/5 rounded-[2rem] p-8 h-48 outline-none text-xl font-bold text-white focus:border-red-600 transition-all italic resize-none"
                    />

                    <div className="flex gap-4">
                       <button 
                         onClick={() => setNewPostPrivate(!newPostPrivate)}
                         className={`flex-1 py-4 rounded-xl font-black text-[10px] border transition-all flex items-center justify-center gap-3 ${newPostPrivate ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-white/5 border-white/5 text-white/40'}`}
                       >
                          {newPostPrivate ? <Lock size={14}/> : <Globe size={14}/>} {newPostPrivate ? 'SÓLO YO' : 'PÚBLICO'}
                       </button>
                       <button onClick={publishPost} className="flex-[2] py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-[10px] uppercase italic tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                          <Upload size={14} /> PUBLICAR EN LA RED
                       </button>
                    </div>
                 </div>

                 <div className="flex flex-col gap-6">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest text-center italic">ARCHIVO DE GALERÍA (MÓVIL / PC)</p>
                    <div 
                      onClick={() => postMediaRef.current?.click()}
                      className="flex-1 aspect-video md:aspect-auto bg-black/60 rounded-[3rem] border-2 border-dashed border-white/10 hover:border-red-600 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner"
                    >
                       {newPostMedia ? (
                         <>
                           {newPostType === 'image' ? <img src={newPostMedia} className="w-full h-full object-contain" /> : <video src={newPostMedia} className="w-full h-full object-contain" />}
                           <div className="absolute bottom-6 bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">CAMBIAR ARCHIVO</div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center text-center p-10">
                            <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 transition-transform">
                               <ImageIcon size={40} className="text-red-500" />
                            </div>
                            <p className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">ABRIR GALERÍA</p>
                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Fotos y Videos permitidos</p>
                         </div>
                       )}
                    </div>
                    <input type="file" ref={postMediaRef} onChange={(e) => handleFileUpload(e, 'POST')} className="hidden" accept="image/*,video/*" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModule;
