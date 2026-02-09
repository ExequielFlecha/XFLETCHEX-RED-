
import React from 'react';
import { 
  Home, Video, Heart, Utensils, Briefcase, MessageSquare, 
  Tv, LayoutDashboard, ChevronLeft, ChevronRight, Gamepad2, MapPin, Film,
  Pencil, User, Languages
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  activeTab: ViewMode;
  setActiveTab: (tab: ViewMode) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenTranslator: () => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, onOpenTranslator, t }) => {
  const menuItems = [
    { id: ViewMode.SOCIAL, icon: Home, label: t('nav_feed') },
    { id: ViewMode.CREATOR_LAB, icon: Pencil, label: t('nav_create') },
    { id: ViewMode.VIDEOS, icon: Video, label: t('nav_videos') },
    { id: ViewMode.CINE, icon: Film, label: t('nav_cine') },
    { id: ViewMode.LIVE, icon: Tv, label: t('nav_live') },
    { id: ViewMode.GAMES, icon: Gamepad2, label: t('nav_games') },
    { id: ViewMode.GPS, icon: MapPin, label: t('nav_gps') },
    { id: ViewMode.DATING, icon: Heart, label: t('nav_dating') },
    { id: ViewMode.MARKET, icon: Utensils, label: t('nav_market') },
    { id: ViewMode.JOBS, icon: Briefcase, label: t('nav_jobs') },
    { id: ViewMode.CHAT, icon: MessageSquare, label: t('nav_messages') },
    { id: ViewMode.PROFILE, icon: User, label: t('nav_profile') },
    { id: ViewMode.ADMIN, icon: LayoutDashboard, label: t('nav_admin') },
  ];

  return (
    <aside 
      className={`fixed left-0 top-20 bottom-0 bg-[#050508]/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 z-40 ${
        isOpen ? 'w-64 translate-x-0' : 'w-20 lg:translate-x-0 -translate-x-full lg:w-20'
      }`}
    >
      <div className="flex flex-col h-full py-4 md:py-6 overflow-y-auto scrollbar-hide">
        <div className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCreator = item.id === ViewMode.CREATOR_LAB;
            const isProfile = item.id === ViewMode.PROFILE;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                    : isCreator 
                      ? 'text-yellow-500 hover:bg-yellow-500/5' 
                      : isProfile
                        ? 'text-cyan-400 hover:bg-cyan-400/5'
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={22} className={`flex-shrink-0 ${isActive ? 'animate-pulse drop-shadow-[0_0_5px_#ef4444]' : isCreator ? 'text-yellow-500' : isProfile ? 'text-cyan-400' : ''}`} />
                {(isOpen || window.innerWidth < 1024) && (
                  <span className={`font-semibold text-sm whitespace-nowrap font-futuristic tracking-tight uppercase ${isCreator && !isActive ? 'text-yellow-500' : isProfile && !isActive ? 'text-cyan-400' : ''}`}>
                    {item.label}
                  </span>
                )}
                
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_15px_#dc2626]"></div>
                )}
                
                {!isOpen && window.innerWidth >= 1024 && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-[#05050a]/90 backdrop-blur-md border border-white/10 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-white font-futuristic shadow-2xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          {/* NUEVO: BOTÓN TRADUCTOR (FLECHA AMARILLA) */}
          <button
            onClick={onOpenTranslator}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative overflow-hidden text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 mt-4`}
          >
            <Languages size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            {(isOpen || window.innerWidth < 1024) && (
              <span className="font-black text-sm whitespace-nowrap font-futuristic tracking-widest uppercase italic">
                {t('nav_translator')}
              </span>
            )}
            
            {!isOpen && window.innerWidth >= 1024 && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-[#05050a]/90 backdrop-blur-md border border-white/10 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-white font-futuristic shadow-2xl">
                {t('nav_translator')}
              </div>
            )}
          </button>
        </div>

        <div className="px-3 pt-6 border-t border-white/5 hidden lg:block">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
