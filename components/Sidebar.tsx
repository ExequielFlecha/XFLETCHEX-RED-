
import React from 'react';
import { 
  Home, Video, Heart, ShoppingBag, Briefcase, MessageSquare, 
  Tv, LayoutDashboard, ChevronLeft, ChevronRight, Gamepad2, MapPin, Film
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  activeTab: ViewMode;
  setActiveTab: (tab: ViewMode) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: ViewMode.SOCIAL, icon: Home, label: 'Feed Social' },
    { id: ViewMode.VIDEOS, icon: Video, label: 'Videos & Shorts' },
    { id: ViewMode.CINE, icon: Film, label: 'Cine XF' },
    { id: ViewMode.LIVE, icon: Tv, label: 'Directos Live' },
    { id: ViewMode.GAMES, icon: Gamepad2, label: 'Emulador Gamer' },
    { id: ViewMode.GPS, icon: MapPin, label: 'Sistema GPS' },
    { id: ViewMode.DATING, icon: Heart, label: 'Citas Sugar' },
    { id: ViewMode.MARKET, icon: ShoppingBag, label: 'Tienda & Comida' },
    { id: ViewMode.JOBS, icon: Briefcase, label: 'Trabajo Online' },
    { id: ViewMode.CHAT, icon: MessageSquare, label: 'Mensajes' },
    { id: ViewMode.ADMIN, icon: LayoutDashboard, label: 'Admin Panel' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 bg-black/10 backdrop-blur-xl border-r border-white/5 transition-all duration-500 z-40 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex flex-col h-full py-6">
        <div className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={22} className={isActive ? 'animate-pulse drop-shadow-[0_0_5px_#ef4444]' : ''} />
                {isOpen && <span className="font-semibold text-sm whitespace-nowrap font-futuristic tracking-tight uppercase">{item.label}</span>}
                
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_15px_#dc2626]"></div>
                )}
                
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-[#05050a]/90 backdrop-blur-md border border-white/10 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 text-white font-futuristic">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-3 pt-6 border-t border-white/5">
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
