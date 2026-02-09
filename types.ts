
export enum ViewMode {
  SOCIAL = 'social',
  VIDEOS = 'videos',
  DATING = 'dating',
  MARKET = 'market',
  JOBS = 'jobs',
  CHAT = 'chat',
  ADMIN = 'admin',
  LIVE = 'live',
  GAMES = 'games',
  GPS = 'gps',
  CINE = 'cine',
  CREATOR_LAB = 'creator_lab',
  PROFILE = 'profile',
  CALCULATOR = 'calculator',
  NETWORK_HUB = 'network_hub'
}

export type Language = 'es' | 'en' | 'pt' | 'fr' | 'ru' | 'zh' | 'ar' | 'hi' | 'jp' | 'it' | 'de';

export enum StrikeStatus {
  CLEAN = 'GREEN',
  WARNING = 'YELLOW',
  BANNED = 'RED'
}

export interface User {
  id: string;
  name: string;
  age: number;
  profilePic: string;
  bannerPic?: string;
  frame: string;
  strike: StrikeStatus;
  isOnline: boolean;
  isAdmin: boolean;
  followersCount: number;
  followingCount: number;
  viewsCount: number;
  isVerified: boolean;
  isMonetized: boolean;
  balance: number;
  bankAccount?: string;
  mpAlias?: string;
  ppAlias?: string;
  heirName?: string;
  isRetired?: boolean;
  country: string;
  currency: string;
  currencySymbol: string;
  isPrivate?: boolean;
  assistantEnabled?: boolean;
  iaVoiceUrl?: string;
  socialLinks?: {
    ig?: string;
    tw?: string;
    yt?: string;
    tk?: string;
    fb?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderSurname?: string;
  senderAvatar: string;
  text: string;
  media?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'location';
  time: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  name: string;
  surname?: string;
  age?: number;
  type: 'private' | 'group';
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  members?: ChatMember[]; 
  blocked?: boolean;
}

export interface ChatMember {
  id: string;
  name: string;
  surname: string;
  age: number;
  avatar: string;
  role: 'admin' | 'member';
}

export interface CommentData {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  media?: string;
  type: 'text' | 'gif' | 'photo' | 'sticker' | 'audio';
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBanner?: string;
  content: string;
  media?: string;
  type: 'image' | 'video' | 'text' | 'music' | 'gif' | 'food_ad';
  likes: number;
  views: number;
  comments: CommentData[];
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  isPrivate?: boolean;
  music?: string;
  strikeStatus?: StrikeStatus;
  foodAdData?: {
    company: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    price: number;
    currency: string;
  };
}

export interface Ad {
  id: string;
  imageUrl: string;
  text: string;
  link?: string;
}

export interface Status {
  id: string;
  userId: string;
  userName: string;
  userImg: string;
  type: 'image' | 'video' | 'text';
  content: string;
  color: string;
  timestamp: string;
}

export interface Seller {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  rating: number;
  isVerified: boolean;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'vehicles' | 'tech' | 'jewelry' | 'clothes' | 'food';
  image: string;
  seller: Seller;
  deliveryTime: string;
}
