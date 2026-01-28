
import React, { useState, useEffect } from 'react';
import { ViewMode, User, StrikeStatus } from './types';
import GalaxyBackground from './components/GalaxyBackground';
import Sidebar from './components/Sidebar';
import StatusSection from './components/StatusSection';
import SocialFeed from './components/SocialFeed';
import VideoFeed from './components/VideoFeed';
import DatingModule from './components/DatingModule';
import JobsModule from './components/JobsModule';
import Marketplace from './components/Marketplace';
import ChatModule from './components/ChatModule';
import AdminPanel from './components/AdminPanel';
import LiveModule from './components/LiveModule';
import GamesModule from './components/GamesModule';
import GPSModule from './components/GPSModule';
import CineModule from './components/CineModule';
import AuthModule from './components/AuthModule';
import SecurityAI from './components/SecurityAI';
import { Bell, ShieldCheck, Search, Zap, X as XIcon, DollarSign, BadgeCheck } from 'lucide-react';

const INITIAL_USER: User = {
  id: 'current-user',
  name: 'Exequiel Flecha Baez DIOS',
  age: 28,
  profilePic: 'https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png',
  bannerPic: 'https://picsum.photos/seed/galactic-banner/1200/400',
  frame: 'border-red-600',
  strike: StrikeStatus.CLEAN,
  isOnline: true,
  isAdmin: true,
  followersCount: 0,
  followingCount: 0,
  viewsCount: 0,
  isVerified: false,
  isMonetized: false,
  balance: 0,
  mpAlias: 'exequiel.dios.xf',
  ppAlias: 'exequielxfbaez',
  bankAccount: ''
};

const DEFAULT_LOGO = "https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewMode>(ViewMode.SOCIAL);
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('xf_user_data');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [targetChatUser, setTargetChatUser] = useState<string | null>(null);
  
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('xfletchex_logo') || DEFAULT_LOGO;
  });

  const [isLogoVisible, setIsLogoVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem('xfletchex_logo_visible');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    let updatedUser = { ...user };
    let changed = false;

    if (user.followersCount >= 1000000 && !user.isVerified) {
      updatedUser.isVerified = true;
      changed = true;
      handleNotification("¡ESTATUS DE VERIFICACIÓN ACTIVADO! 1 MILLÓN DE SEGUIDORES.");
    }

    if (user.followersCount >= 1000 && user.viewsCount >= 100 && !user.isMonetized) {
      updatedUser.isMonetized = true;
      updatedUser.balance = 700;
      changed = true;
      handleNotification("¡MONETIZACIÓN ACTIVADA! SALDO INICIAL: $700 USD.");
    }

    if (changed) {
      setUser(updatedUser);
    }
    
    localStorage.setItem('xf_user_data', JSON.stringify(user));
  }, [user.followersCount, user.viewsCount]);

  const handleUpdateLogo = (newUrl: string) => {
    setLogoUrl(newUrl);
    localStorage.setItem('xfletchex_logo', newUrl);
  };

  const toggleLogoVisibility = () => {
    const newState = !isLogoVisible;
    setIsLogoVisible(newState);
    localStorage.setItem('xfletchex_logo_visible', String(newState));
  };

  const handleNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== msg));
    }, 5000);
  };

  const openPrivateChat = (userName: string) => {
    setTargetChatUser(userName);
    setActiveTab(ViewMode.CHAT);
  };

  if (!isLoggedIn) {
    return <AuthModule onLogin={() => setIsLoggedIn(true)} logo={logoUrl} />;
  }

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden selection:bg-red-500/30">
      <GalaxyBackground />
      <SecurityAI />

      <div className="fixed top-24 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.map((notif, idx) => (
          <div key={idx} className="bg-black/80 backdrop-blur-xl border border-red-500/40 p-4 rounded-2xl flex items-center gap-4 animate-slide-up shadow-2xl pointer-events-auto">
            <Zap className="text-red-500 animate-pulse" size={18} />
            <p className="text-xs font-bold text-white uppercase italic">{notif}</p>
            <button onClick={() => setNotifications(prev => prev.filter((_, i) => i !== idx))} className="text-white/20 hover:text-white ml-2">
              <XIcon size={14} />
            </button>
          </div>
        ))}
      </div>

      <header className="fixed top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab(ViewMode.SOCIAL)}>
            {isLogoVisible && (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.4)] bg-black animate-fade-in">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic font-futuristic leading-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-pink-500 to-purple-500 uppercase">XFLETCHEX</span>
                <span className="text-white ml-2">RED</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {user.isMonetized && (
            <div className="bg-green-600/20 border border-green-500/30 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
               <DollarSign className="text-green-500" size={18} />
               <span className="text-white font-black italic">${user.balance.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-2xl p-1.5 pr-5 border border-white/10 cursor-pointer" onClick={() => setActiveTab(ViewMode.ADMIN)}>
            <div className={`relative w-10 h-10 diamond-clip bg-black border-2 ${user.frame} overflow-hidden`}>
              <img src={user.profilePic} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black leading-none text-white truncate max-w-[120px] hidden sm:block uppercase italic">{user.name}</span>
                {user.isVerified && <BadgeCheck className="text-cyan-400" size={12} />}
              </div>
              <span className="text-[7px] text-red-500 font-bold uppercase tracking-widest hidden sm:block">PERFIL DIOS</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full pt-20">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-4 lg:p-8 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin`}>
          {(activeTab === ViewMode.SOCIAL || activeTab === ViewMode.VIDEOS) && <StatusSection />}
          <div className="mt-6">
            {activeTab === ViewMode.SOCIAL && <SocialFeed />}
            {activeTab === ViewMode.VIDEOS && <VideoFeed onOpenChat={openPrivateChat} notify={handleNotification} currentGlobalUser={user} setUser={setUser} />}
            {activeTab === ViewMode.CINE && <CineModule />}
            {activeTab === ViewMode.GAMES && <GamesModule currentUser={user} setUser={setUser} notify={handleNotification} />}
            {activeTab === ViewMode.GPS && <GPSModule />}
            {activeTab === ViewMode.DATING && <DatingModule user={user} />}
            {activeTab === ViewMode.JOBS && <JobsModule onOpenChat={openPrivateChat} currentUser={user} notify={handleNotification} />}
            {activeTab === ViewMode.MARKET && <Marketplace />}
            {activeTab === ViewMode.CHAT && <ChatModule initialUser={targetChatUser} />}
            {activeTab === ViewMode.ADMIN && (
              <AdminPanel 
                user={user} 
                setUser={setUser} 
                notify={handleNotification} 
                currentLogo={logoUrl} 
                onUpdateLogo={handleUpdateLogo} 
                isLogoVisible={isLogoVisible} 
                onToggleLogo={toggleLogoVisibility} 
                defaultLogo={DEFAULT_LOGO} 
              />
            )}
            {activeTab === ViewMode.LIVE && <LiveModule />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
