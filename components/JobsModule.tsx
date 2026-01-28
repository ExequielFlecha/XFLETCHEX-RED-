
import React, { useState, useRef } from 'react';
import { 
  Briefcase, Star, Search, Filter, DollarSign, Clock, 
  X, ShieldCheck, CreditCard, Wallet, Smartphone, Globe, 
  CheckCircle, Plus, Sparkles, Upload, User, UserCheck
} from 'lucide-react';
import { User as UserType } from '../types';

interface Job {
  id: string;
  user: string;
  job: string;
  rate: number;
  rating: number;
  skills: string[];
  avatar: string;
  isVerified: boolean;
  mpAlias?: string;
  ppAlias?: string;
}

interface JobsModuleProps {
  onOpenChat?: (userName: string) => void;
  currentUser: UserType;
  notify?: (msg: string) => void;
}

const INITIAL_JOBS: Job[] = [
  { 
    id: 'j1', 
    user: 'CEO_Neo', 
    job: 'Diseñador Gráfico Futurista', 
    rate: 45, 
    rating: 6, 
    skills: ['Photoshop', 'AI', 'UI'], 
    avatar: 'https://picsum.photos/seed/j1/200',
    isVerified: true,
    mpAlias: 'neo.mp',
    ppAlias: 'neostark'
  },
  { 
    id: 'j2', 
    user: 'DevMaster', 
    job: 'Programador de Redes Galácticas', 
    rate: 80, 
    rating: 6, 
    skills: ['Typescript', 'Rust', 'Web3'], 
    avatar: 'https://picsum.photos/seed/j2/200',
    isVerified: true
  },
  { 
    id: 'j3', 
    user: 'Trans-L-8', 
    job: 'Traductor de Lenguas Alienígenas', 
    rate: 30, 
    rating: 5, 
    skills: ['Spanish', 'English', 'Zorgon'], 
    avatar: 'https://picsum.photos/seed/j3/200',
    isVerified: false
  },
];

const CATEGORIES = [
  'Diseñador Gráfico', 'Computación', 'Arte', 'Traductor de Idiomas', 
  'Cocina', 'Programador', 'Marketing', 'Música', 'Redacción'
];

const JobsModule: React.FC<JobsModuleProps> = ({ onOpenChat, currentUser, notify }) => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [activePaymentModal, setActivePaymentModal] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Formulario de creación
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState(CATEGORIES[0]);
  const [newJobRate, setNewJobRate] = useState(0);
  const [newJobMP, setNewJobMP] = useState('');
  const [newJobPP, setNewJobPP] = useState('');

  const handlePostulate = () => {
    if (currentUser.age < 20) {
      notify?.("ERROR: DEBES TENER AL MENOS 20 AÑOS PARA TRABAJAR EN XFLETCHEX RED.");
      return;
    }
    setIsCreatorOpen(true);
  };

  const publishJob = () => {
    const newJob: Job = {
      id: `j-${Date.now()}`,
      user: currentUser.name,
      job: `${newJobCategory} (${newJobTitle})`,
      rate: newJobRate,
      rating: 6, // Empieza con 6 estrellas bandera argentina
      skills: [newJobCategory, 'XF-Worker'],
      avatar: currentUser.profilePic,
      isVerified: currentUser.isVerified,
      mpAlias: newJobMP,
      ppAlias: newJobPP
    };
    setJobs([newJob, ...jobs]);
    setIsCreatorOpen(false);
    notify?.("¡PERFIL EMPRESARIAL PUBLICADO CON ÉXITO!");
  };

  const filteredJobs = jobs.filter(j => 
    j.job.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Componente de Estrellas Bandera Argentina
  const ARStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="relative group/star">
           <Star 
             size={14} 
             className={i < rating ? 'text-[#75AADB] fill-[#75AADB]' : 'text-white/10'} 
           />
           {i < rating && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[20%] bg-white"></div>
                <div className="absolute w-1 h-1 bg-yellow-500 rounded-full"></div>
             </div>
           )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-fade-in font-rajdhani">
      
      {/* HEADER EXACTO A LA FOTO */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black font-futuristic mb-8 uppercase italic tracking-tighter">
          MERCADO DE TRABAJO <span className="text-red-500 font-black">20+</span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué talento buscas hoy?" 
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl py-5 px-14 text-white font-bold outline-none focus:ring-1 focus:ring-cyan-500 transition-all italic"
              />
              <Search className="absolute left-5 top-5 text-white/20" size={24} />
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <button className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all text-white">
                <Filter size={24} />
              </button>
              <button 
                onClick={handlePostulate}
                className="bg-cyan-500 hover:bg-cyan-400 px-10 py-5 rounded-2xl font-black font-futuristic text-sm tracking-widest uppercase italic text-black shadow-xl shadow-cyan-900/40 transition-all active:scale-95"
              >
                POSTULAR TRABAJO
              </button>
           </div>
        </div>
      </div>

      {/* GRID DE CARDS ESTILO FOTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-[#121218] border border-white/10 rounded-[2.5rem] p-8 hover:border-cyan-500/40 transition-all group shadow-2xl relative overflow-hidden border-b-4 border-b-cyan-500">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                  <img src={job.avatar} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-xl text-white italic uppercase tracking-tighter flex items-center gap-2">
                    {job.user}
                    {job.isVerified && <CheckCircle size={14} className="text-cyan-400" />}
                  </h4>
                  <ARStars rating={job.rating} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-green-400 font-futuristic leading-none italic">${job.rate}</p>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">POR HORA</p>
              </div>
            </div>

            <h3 className="text-2xl font-black text-cyan-400 uppercase italic tracking-tighter mb-6 group-hover:text-white transition-colors">
               {job.job}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {job.skills.map(s => (
                <span key={s} className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] border border-white/5 font-black uppercase italic text-white/40">{s}</span>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onOpenChat?.(job.user)}
                className="flex-1 bg-white text-black py-4 rounded-2xl font-black font-futuristic text-xs tracking-widest uppercase italic hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-95"
              >
                CONTACTAR
              </button>
              <button 
                onClick={() => setActivePaymentModal(job)}
                className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white/40 hover:text-green-500 hover:border-green-500/30 transition-all group"
                title="Pagar por Trabajo"
              >
                <span className="text-2xl font-black">$</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR TRABAJO (SOLO +20 AÑOS) */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
          <div className="w-full max-w-2xl bg-[#08080c] border border-white/10 rounded-[3.5rem] p-12 shadow-2xl relative animate-scale-in">
             <button onClick={() => setIsCreatorOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-all"><X size={32}/></button>
             
             <div className="flex items-center gap-4 mb-10 justify-center">
                <Briefcase size={40} className="text-cyan-400" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter font-futuristic">CREAR PERFIL EMPRESARIAL</h2>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2 italic">TÍTULO DEL TALENTO</p>
                      <input 
                        type="text" 
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                        placeholder="Ej: Logo Master 3D" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-1 focus:ring-cyan-500 italic" 
                      />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2 italic">PROFESIÓN PRINCIPAL</p>
                      <select 
                        value={newJobCategory}
                        onChange={(e) => setNewJobCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-1 focus:ring-cyan-500 italic uppercase"
                      >
                         {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2 italic">TARIFA POR HORA ($ USD)</p>
                   <input 
                     type="number" 
                     value={newJobRate}
                     onChange={(e) => setNewJobRate(Number(e.target.value))}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-1 focus:ring-cyan-500 italic" 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest ml-2 italic">ALIAS MERCADO PAGO</p>
                      <input 
                        type="text" 
                        value={newJobMP}
                        onChange={(e) => setNewJobMP(e.target.value)}
                        placeholder="ejemplo.mp" 
                        className="w-full bg-[#121218] border border-cyan-500/20 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-1 focus:ring-cyan-500 italic" 
                      />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2 italic">USUARIO PAYPAL</p>
                      <input 
                        type="text" 
                        value={newJobPP}
                        onChange={(e) => setNewJobPP(e.target.value)}
                        placeholder="@tuusuario" 
                        className="w-full bg-[#121218] border border-blue-500/20 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-1 focus:ring-blue-500 italic" 
                      />
                   </div>
                </div>

                <button 
                  onClick={publishJob}
                  className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-3xl text-sm uppercase italic tracking-widest shadow-2xl shadow-cyan-900/40 transition-all active:scale-95 mt-6"
                >
                  PUBLICAR TALENTO EMPRESARIAL
                </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGO (MERCADO PAGO / PAYPAL) */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4">
          <div className="w-full max-w-md bg-[#0a0a0f] border-2 border-green-500/30 rounded-[3.5rem] p-10 text-center shadow-[0_0_80px_rgba(34,197,94,0.3)] relative animate-scale-in">
             <button onClick={() => setActivePaymentModal(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-all"><X size={32}/></button>
             
             <div className="w-20 h-20 bg-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                <DollarSign size={40} className="text-green-500" />
             </div>
             
             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">PAGAR TRABAJO A</h3>
             <p className="text-green-500 font-black text-lg italic mb-10">@{activePaymentModal.user}</p>

             <div className="space-y-6">
                <div className="p-6 bg-cyan-600/10 border border-cyan-500/20 rounded-3xl">
                   <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2 italic">ALIAS MERCADO PAGO</p>
                   <p className="text-xl font-black text-white italic">{activePaymentModal.mpAlias || 'NO DISPONIBLE'}</p>
                </div>
                
                <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                   <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 italic">USUARIO PAYPAL</p>
                   <p className="text-xl font-black text-white italic">{activePaymentModal.ppAlias || 'NO DISPONIBLE'}</p>
                </div>
             </div>

             <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/30 font-bold italic leading-relaxed">COPIA EL ALIAS Y REALIZA LA TRANSFERENCIA DESDE TU APP BANCARIA. XFLETCHEX VALIDA LOS PAGOS AUTOMÁTICAMENTE.</p>
             </div>
          </div>
        </div>
      )}

      {/* FOOTER PUBLICITARIO */}
      <div className="mt-20 p-12 bg-gradient-to-r from-[#05050a] to-[#0a0a15] border-2 border-white/5 rounded-[4rem] text-center shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Briefcase size={200} /></div>
         <h2 className="text-3xl font-black font-futuristic text-white italic mb-4 uppercase tracking-tighter">EL IMPERIO XFLETCHEX TE NECESITA</h2>
         <p className="text-white/40 text-lg font-bold italic mb-10 max-w-2xl mx-auto">Monetiza tus habilidades galácticas. Pagos directos sin estafas, protección del Creador DIOS.</p>
         <button 
           onClick={handlePostulate}
           className="bg-white text-black hover:bg-cyan-500 hover:text-white px-16 py-5 rounded-[2rem] font-black font-futuristic text-sm tracking-widest uppercase italic transition-all shadow-xl active:scale-95"
         >
           EMPEZAR A TRABAJAR AHORA
         </button>
      </div>
    </div>
  );
};

export default JobsModule;
