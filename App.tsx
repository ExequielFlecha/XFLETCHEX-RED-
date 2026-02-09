
import React, { useState, useEffect } from 'react';
import { ViewMode, User, StrikeStatus, Ad, Language } from './types';
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
import CreatorLab from './components/CreatorLab';
import ProfileModule from './components/ProfileModule';
import ExequielaAI from './components/ExequielaAI';
import { Bell, ShieldCheck, Search, Zap, X as XIcon, DollarSign, BadgeCheck, Menu, Bot, Power, Languages, Globe, Check } from 'lucide-react';

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
  mpAlias: 'exequiel.flecha.bx',
  ppAlias: 'ExequielFlechaX',
  bankAccount: '',
  country: 'Argentina',
  currency: 'ARS',
  currencySymbol: '$',
  assistantEnabled: true
};

const DEFAULT_LOGO = "https://i.postimg.cc/85zKzQ4Z/XF-LOGO-CUSTOM.png";

const DICTIONARY: Record<Language, Record<string, string>> = {
  es: {
    nav_feed: 'Feed Social', nav_create: 'Crear', nav_videos: 'Videos & Shorts', nav_cine: 'Cine XF', nav_live: 'Directos Live', nav_games: 'Emulador Gamer', nav_gps: 'Sistema GPS', nav_dating: 'Citas Sugar', nav_market: 'Ventas de Comida', nav_jobs: 'Trabajo Online', nav_messages: 'Mensajes', nav_profile: 'Perfil', nav_admin: 'Admin Panel', nav_translator: 'Traductor',
    header_perfil: 'PERFIL', header_asistente: 'ACOMPAÑANTE', modal_trans_title: 'SISTEMA TRADUCTOR MULTIVERSAL', modal_trans_subtitle: 'SELECCIONA TU IDIOMA PARA LA RED', footer_secure: 'Sistema Protegido por IA Aura'
  },
  en: {
    nav_feed: 'Social Feed', nav_create: 'Create', nav_videos: 'Videos & Shorts', nav_cine: 'XF Cinema', nav_live: 'Live Streams', nav_games: 'Gamer Emulator', nav_gps: 'GPS System', nav_dating: 'Sugar Dating', nav_market: 'Food Sales', nav_jobs: 'Online Work', nav_messages: 'Messages', nav_profile: 'Profile', nav_admin: 'Admin Panel', nav_translator: 'Translator',
    header_perfil: 'PROFILE', header_asistente: 'ASSISTANT', modal_trans_title: 'MULTIVERSAL TRANSLATOR SYSTEM', modal_trans_subtitle: 'SELECT YOUR LANGUAGE FOR THE NETWORK', footer_secure: 'Protected by AI Aura System'
  },
  pt: {
    nav_feed: 'Feed Social', nav_create: 'Criar', nav_videos: 'Vídeos & Curtas', nav_cine: 'Cine XF', nav_live: 'Ao Vivo', nav_games: 'Emulador Gamer', nav_gps: 'Sistema GPS', nav_dating: 'Encontros Sugar', nav_market: 'Vendas de Comida', nav_jobs: 'Trabalho Online', nav_messages: 'Mensagens', nav_profile: 'Perfil', nav_admin: 'Painel Admin', nav_translator: 'Tradutor',
    header_perfil: 'PERFIL', header_asistente: 'ACOMPANHANTE', modal_trans_title: 'SISTEMA DE TRADUÇÃO MULTIVERSAL', modal_trans_subtitle: 'SELECIONE SEU IDIOMA PARA A REDE', footer_secure: 'Sistema Protegido por IA Aura'
  },
  fr: {
    nav_feed: 'Fil Social', nav_create: 'Créer', nav_videos: 'Vidéos & Shorts', nav_cine: 'Ciné XF', nav_live: 'Direct Live', nav_games: 'Émulateur Gamer', nav_gps: 'Système GPS', nav_dating: 'Rencontres Sugar', nav_market: 'Vente de Nourriture', nav_jobs: 'Travail en Ligne', nav_messages: 'Messages', nav_profile: 'Profil', nav_admin: 'Panneau Admin', nav_translator: 'Traducteur',
    header_perfil: 'PROFIL', header_asistente: 'COMPAGNON', modal_trans_title: 'SYSTÈME DE TRADUCTION MULTIVERSAL', modal_trans_subtitle: 'SÉLECTIONNEZ VOTRE LANGUE POUR LE RÉSEAU', footer_secure: 'Système protégé par l\'IA Aura'
  },
  ru: {
    nav_feed: 'Лента', nav_create: 'Создать', nav_videos: 'Видео', nav_cine: 'Кино XF', nav_live: 'Прямой эфир', nav_games: 'Эмулятор', nav_gps: 'Система GPS', nav_dating: 'Знакомства', nav_market: 'Еда', nav_jobs: 'Работа онлайн', nav_messages: 'Сообщения', nav_profile: 'Профиль', nav_admin: 'Админ панель', nav_translator: 'Переводчик',
    header_perfil: 'ПРОФИЛЬ', header_asistente: 'ПОМОЩНИК', modal_trans_title: 'МУЛЬТИВЕРСАЛЬНАЯ СИСТЕМА ПЕРЕВОДА', modal_trans_subtitle: 'ВЫБЕРИТЕ ЯЗЫК ДЛЯ СЕТИ', footer_secure: 'Система защищена ИИ Аура'
  },
  zh: {
    nav_feed: '社交动态', nav_create: '创建', nav_videos: '短视频', nav_cine: 'XF影院', nav_live: '直播', nav_games: '游戏模拟器', nav_gps: 'GPS系统', nav_dating: '约会', nav_market: '美食销售', nav_jobs: '在线工作', nav_messages: '消息', nav_profile: '个人资料', nav_admin: '管理面板', nav_translator: '翻译',
    header_perfil: '个人资料', header_asistente: '助理', modal_trans_title: '多维翻译系统', modal_trans_subtitle: '选择您的语言', footer_secure: 'Aura AI 保护系统'
  },
  ar: {
    nav_feed: 'التغذية الاجتماعية', nav_create: 'إنشاء', nav_videos: 'فيديوهات قصيرة', nav_cine: 'سينما XF', nav_live: 'بث مباشر', nav_games: 'محاكي الألعاب', nav_gps: 'نظام GPS', nav_dating: 'مواعدة', nav_market: 'مبيعات الطعام', nav_jobs: 'عمل عبر الإنترنت', nav_messages: 'رسائل', nav_profile: 'الملف الشخصي', nav_admin: 'لوحة الإدارة', nav_translator: 'مترجم',
    header_perfil: 'الملف الشخصي', header_asistente: 'مرافق', modal_trans_title: 'نظام المترجم العالمي', modal_trans_subtitle: 'اختر لغتك للشبكة', footer_secure: 'نظام محمي بواسطة Aura AI'
  },
  hi: {
    nav_feed: 'सोशल फीड', nav_create: 'बनाएं', nav_videos: 'वीडियो और शॉर्ट्स', nav_cine: 'XF सिनेमा', nav_live: 'लाइव स्ट्रीम', nav_games: 'गेमर एमुलेटर', nav_gps: 'जीपीएस सिस्टम', nav_dating: 'डेटिंग', nav_market: 'भोजन बिक्री', nav_jobs: 'ऑनलाइन काम', nav_messages: 'संदेश', nav_profile: 'प्रोफ़ाइल', nav_admin: 'एडमिन पैनल', nav_translator: 'अनुवादक',
    header_perfil: 'प्रोफ़ाइल', header_asistente: 'सहायक', modal_trans_title: 'बहुआयामी अनुवादक प्रणाली', modal_trans_subtitle: 'नेटवर्क के लिए अपनी भाषा चुनें', footer_secure: 'ऑरा एआई द्वारा सुरक्षित प्रणाली'
  },
  jp: {
    nav_feed: 'ソーシャルフィード', nav_create: '作成', nav_videos: 'ビデオとショーツ', nav_cine: 'XFシネマ', nav_live: 'ライブ配信', nav_games: 'エミュレーター', nav_gps: 'GPSシステム', nav_dating: 'デート', nav_market: 'フード販売', nav_jobs: 'オンラインワーク', nav_messages: 'メッセージ', nav_profile: 'プロフィール', nav_admin: '管理パネル', nav_translator: '翻訳者',
    header_perfil: 'プロフィール', header_asistente: 'アシスタント', modal_trans_title: 'マルチバーサル翻訳システム', modal_trans_subtitle: 'ネットワークの言語を選択', footer_secure: 'Aura AI保護システム'
  },
  it: {
    nav_feed: 'Feed Sociale', nav_create: 'Crea', nav_videos: 'Video & Shorts', nav_cine: 'Cinema XF', nav_live: 'Diretta Live', nav_games: 'Emulatore Gamer', nav_gps: 'Sistema GPS', nav_dating: 'Incontri Sugar', nav_market: 'Vendita Cibo', nav_jobs: 'Lavoro Online', nav_messages: 'Messaggi', nav_profile: 'Profilo', nav_admin: 'Pannello Admin', nav_translator: 'Traduttore',
    header_perfil: 'PROFILO', header_asistente: 'COMPAGNON', modal_trans_title: 'SISTEMA DI TRADUZIONE MULTIVERSAL', modal_trans_subtitle: 'SELEZIONA LA TUA LINGUA', footer_secure: 'Sistema protetto da IA Aura'
  },
  de: {
    nav_feed: 'Social Feed', nav_create: 'Erstellen', nav_videos: 'Videos & Shorts', nav_cine: 'XF Kino', nav_live: 'Live-Streams', nav_games: 'Gamer Emulator', nav_gps: 'GPS-System', nav_dating: 'Sugar Dating', nav_market: 'Lebensmittelverkauf', nav_jobs: 'Online-Arbeit', nav_messages: 'Nachrichten', nav_profile: 'Profil', nav_admin: 'Admin-Panel', nav_translator: 'Übersetzer',
    header_perfil: 'PROFIL', header_asistente: 'ASSISTENT', modal_trans_title: 'MULTIVERSALES ÜBERSETZUNGSSYSTEM', modal_trans_subtitle: 'WÄHLEN SIE IHRE SPRACHE FÜR DAS NETZWERK', footer_secure: 'System geschützt durch Aura AI'
  }
};

const DEFAULT_ADS: Ad[] = [
  {
    id: 'ad-1',
    imageUrl: 'https://picsum.photos/seed/ad-tech/1200/400',
    text: 'XF-TECH GLOBAL: El Futuro de la Tecnología Galáctica está aquí.',
    link: '#'
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewMode>(ViewMode.SOCIAL);
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('xf_user_data');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [targetChatUser, setTargetChatUser] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>(() => localStorage.getItem('xfletchax_network_name') || "XFLETCHAX RED");
  const [isMonetizationSystemActive, setIsMonetizationSystemActive] = useState<boolean>(() => localStorage.getItem('xf_monetization_active') === 'true');
  const [ads, setAds] = useState<Ad[]>(() => {
    const saved = localStorage.getItem('xf_ads');
    return saved ? JSON.parse(saved) : DEFAULT_ADS;
  });
  const [logoUrl, setLogoUrl] = useState<string>(() => localStorage.getItem('xfletchex_logo') || DEFAULT_LOGO);
  const [isLogoVisible, setIsLogoVisible] = useState<boolean>(() => localStorage.getItem('xfletchex_logo_visible') !== 'false');

  // Sistema de traducción
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('xf_lang') as Language) || 'es');
  const [showTranslator, setShowTranslator] = useState(false);

  const t = (key: string) => DICTIONARY[language][key] || key;

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('xf_user_data', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('xf_lang', language);
  }, [language]);

  // GUARDADO AUTOMÁTICO DE PUBLICIDAD (SOLICITADO)
  useEffect(() => {
    localStorage.setItem('xf_ads', JSON.stringify(ads));
  }, [ads]);

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
    setTimeout(() => setNotifications(prev => prev.filter(n => n !== msg)), 5000);
  };

  const openPrivateChat = (userName: string) => {
    setTargetChatUser(userName);
    setActiveTab(ViewMode.CHAT);
  };

  const handleRestoreAccount = () => {
    const restoredUser: User = { ...user, strike: StrikeStatus.CLEAN, followersCount: 0, isVerified: false, isMonetized: false, balance: 0 };
    setUser(restoredUser);
    handleNotification("¡CUENTA RESTAURADA POR LA IA AURA!");
  };

  const { main, sub } = { main: networkName.split(' ')[0] || "XFLETCHAX", sub: networkName.split(' ').slice(1).join(' ') || "RED" };

  if (!isLoggedIn) {
    return <AuthModule onLogin={() => setIsLoggedIn(true)} logo={logoUrl} />;
  }

  const langList = [
    { id: 'es', name: 'Español', flag: '🇦🇷' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'pt', name: 'Português', flag: '🇧🇷' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 'ar', name: 'العربية', flag: '🇸🇦' },
    { id: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { id: 'jp', name: '日本語', flag: '🇯🇵' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden selection:bg-red-500/30">
      <GalaxyBackground />
      {user.assistantEnabled && <ExequielaAI user={user} setUser={setUser} notify={handleNotification} />}

      {/* MODAL TRADUCTOR GLOBAL */}
      {showTranslator && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4">
           <div className="w-full max-w-4xl bg-[#0a0a0f] border-2 border-cyan-500/30 rounded-[3.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(34,211,238,0.2)] animate-scale-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-white to-cyan-500"></div>
              <button onClick={() => setShowTranslator(false)} className="absolute top-8 right-8 text-white/20 hover:text-white p-3 bg-white/5 rounded-full border border-white/10 transition-all"><XIcon size={32}/></button>
              
              <div className="text-center mb-12">
                 <div className="w-20 h-20 bg-cyan-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 shadow-2xl">
                    <Globe className="text-cyan-400 animate-spin-slow" size={40} />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black font-futuristic text-white uppercase italic tracking-tighter leading-tight mb-4">{t('modal_trans_title')}</h2>
                 <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs italic">{t('modal_trans_subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin">
                 {langList.map((l) => (
                   <button 
                     key={l.id} 
                     onClick={() => { setLanguage(l.id as Language); handleNotification(`IDIOMA CAMBIADO A: ${l.name.toUpperCase()}`); }}
                     className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${language === l.id ? 'bg-cyan-600 border-cyan-400 text-white shadow-xl' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'}`}
                   >
                      <div className="flex items-center gap-3">
                         <span className="text-2xl">{l.flag}</span>
                         <span className="text-xs font-black uppercase italic tracking-widest">{l.name}</span>
                      </div>
                      {language === l.id && <Check size={18} className="animate-pulse" />}
                   </button>
                 ))}
              </div>
              
              <button 
                onClick={() => setShowTranslator(false)}
                className="w-full mt-10 py-5 bg-white text-black font-black rounded-2xl text-xs uppercase italic tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                 CERRAR Y EXPLORAR LA RED
              </button>
           </div>
        </div>
      )}

      <div className="fixed top-24 right-4 md:right-8 z-[100] flex flex-col gap-3 pointer-events-none max-w-[80vw]">
        {notifications.map((notif, idx) => (
          <div key={idx} className="bg-black/80 backdrop-blur-xl border border-red-500/40 p-4 rounded-2xl flex items-center gap-4 animate-slide-up shadow-2xl pointer-events-auto">
            <Zap className="text-red-500 animate-pulse flex-shrink-0" size={18} />
            <p className="text-[10px] md:text-xs font-bold text-white uppercase italic">{notif}</p>
            <button onClick={() => setNotifications(prev => prev.filter((_, i) => i !== idx))} className="text-white/20 hover:text-white ml-2 flex-shrink-0"><XIcon size={14} /></button>
          </div>
        ))}
      </div>

      <header className="fixed top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 z-50">
        <div className="flex items-center gap-3 md:gap-5">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white hover:bg-white/10 rounded-xl transition-all lg:hidden"><Menu size={24} /></button>
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => setActiveTab(ViewMode.SOCIAL)}>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter italic font-futuristic leading-none uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-pink-500 to-purple-500">{main}</span>
              <span className="text-white ml-1">{sub}</span>
            </h1>
            {isLogoVisible && (
              <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] bg-black animate-fade-in">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
            <SecurityAI />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* BOTÓN ASISTENTE GLOBAL */}
          <button 
            onClick={() => setUser({...user, assistantEnabled: !user.assistantEnabled})}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${user.assistantEnabled ? 'bg-red-600 text-white border-red-400' : 'bg-white/5 text-white/20 border-white/5'}`}
            title="Activar/Desactivar Exequiela AI"
          >
             <Bot size={20} className={user.assistantEnabled ? 'animate-pulse' : ''} />
             <span className="text-[8px] font-black uppercase hidden sm:block">{t('header_asistente')}</span>
          </button>

          {(user.isMonetized && isMonetizationSystemActive) && (
            <div className="bg-green-600/20 border border-green-500/30 px-3 md:px-6 py-2 rounded-2xl flex items-center gap-2 md:gap-3 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
               <DollarSign className="text-green-500" size={16} />
               <span className="text-white text-xs md:text-sm font-black italic whitespace-nowrap">{user.currencySymbol}{user.balance.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center gap-2 md:gap-3 bg-white/5 hover:bg-white/10 rounded-2xl p-1 md:pr-4 border border-white/10 cursor-pointer" onClick={() => setActiveTab(ViewMode.PROFILE)}>
            <div className={`relative w-8 h-8 md:w-10 md:h-10 diamond-clip bg-black border-2 ${user.frame} overflow-hidden`}><img src={user.profilePic} className="w-full h-full object-cover" /></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[9px] md:text-[10px] font-black leading-none text-white truncate max-w-[80px] uppercase italic">{user.name}</span>
                {user.isVerified && <BadgeCheck className="text-cyan-400" size={12} />}
              </div>
              <span className="text-[7px] text-red-500 font-bold uppercase tracking-widest hidden sm:block">{t('header_perfil')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex w-full pt-20 h-screen overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onOpenTranslator={() => setShowTranslator(true)} t={t} />
        {isSidebarOpen && window.innerWidth < 1024 && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        <main className={`flex-1 transition-all duration-300 w-full overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin ${isSidebarOpen ? (window.innerWidth < 1024 ? 'ml-0' : 'ml-64') : (window.innerWidth < 1024 ? 'ml-0' : 'ml-20')} p-4 md:p-6 lg:p-8`}>
          <div className="w-full max-w-[1920px] mx-auto">
            {(activeTab === ViewMode.SOCIAL || activeTab === ViewMode.VIDEOS || activeTab === ViewMode.PROFILE) && <StatusSection />}
            <div className="mt-6">
              {activeTab === ViewMode.SOCIAL && <SocialFeed ads={ads} />}
              {activeTab === ViewMode.CREATOR_LAB && <CreatorLab notify={handleNotification} />}
              {activeTab === ViewMode.VIDEOS && <VideoFeed onOpenChat={openPrivateChat} notify={handleNotification} currentGlobalUser={user} setUser={setUser} />}
              {activeTab === ViewMode.CINE && <CineModule />}
              {activeTab === ViewMode.GAMES && <GamesModule currentUser={user} setUser={setUser} notify={handleNotification} />}
              {activeTab === ViewMode.GPS && <GPSModule />}
              {activeTab === ViewMode.DATING && <DatingModule user={user} />}
              {activeTab === ViewMode.JOBS && <JobsModule onOpenChat={openPrivateChat} currentUser={user} notify={handleNotification} />}
              {activeTab === ViewMode.MARKET && <Marketplace user={user} />}
              {activeTab === ViewMode.CHAT && <ChatModule initialUser={targetChatUser} />}
              {activeTab === ViewMode.PROFILE && <ProfileModule user={user} setUser={setUser} notify={handleNotification} />}
              {activeTab === ViewMode.ADMIN && (
                <AdminPanel 
                  user={user} setUser={setUser} notify={handleNotification} currentLogo={logoUrl} onUpdateLogo={handleUpdateLogo} isLogoVisible={isLogoVisible} onToggleLogo={toggleLogoVisibility} 
                  defaultLogo={DEFAULT_LOGO} ads={ads} setAds={setAds} isMonetizationSystemActive={isMonetizationSystemActive} setIsMonetizationSystemActive={setIsMonetizationSystemActive}
                  onRestoreAccount={handleRestoreAccount} networkName={networkName} setNetworkName={setNetworkName}
                />
              )}
              {activeTab === ViewMode.LIVE && <LiveModule />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
