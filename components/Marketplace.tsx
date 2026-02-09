
import React, { useState } from 'react';
import { 
  Utensils, MapPin, Search, Star, Clock, Phone, MessageCircle, 
  CheckCircle, X, Package, Flame, Soup, Pizza, IceCream, Coffee,
  Smartphone, SendHorizonal, Navigation, Map, LocateFixed,
  ChevronRight, Info, Loader2, Beer, Wine, GlassWater, UtensilsCrossed,
  CalendarCheck, Navigation2, ShoppingBag, Cherry
} from 'lucide-react';
import { MarketplaceItem, Seller, User } from '../types';

// Vendedores con Logos Reales y Contexto por Ciudad
const MOCK_SELLERS: Record<string, Seller> = {
  pya: { id: 'pya', name: 'Delivery', businessName: 'PEDIDOSYA ARGENTINA', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Logo_PedidosYa.png/1200px-Logo_PedidosYa.png', phone: '+5491100000000', whatsapp: '+5491100000000', telegram: 'pedidosya_arg', rating: 6, isVerified: true },
  rappi: { id: 'rappi', name: 'Delivery', businessName: 'RAPPI MENDOZA', avatar: 'https://logodownload.org/wp-content/uploads/2019/05/rappi-logo-0.png', phone: '+549261000000', whatsapp: '+549261000000', telegram: 'rappi_mza', rating: 6, isVerified: true },
  sj_viandas: { id: 'sj_viandas', name: 'San Juan Food', businessName: 'VIANDAS SAN JUAN EXPRESS', avatar: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=200&auto=format&fit=crop', phone: '+549264000000', whatsapp: '+549264000000', telegram: 'viandas_sj', rating: 5, isVerified: true },
  rc_burger: { id: 'rc_burger', name: 'Río Cuarto Resto', businessName: 'BURGER HOUSE RÍO CUARTO', avatar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop', phone: '+549358000000', whatsapp: '+549358000000', telegram: 'rc_burger', rating: 6, isVerified: true },
  gelato: { id: 'gelato', name: 'Heladería', businessName: 'HELADOS DEL VALLE (San Juan)', avatar: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=200&auto=format&fit=crop', phone: '+549264111222', whatsapp: '+549264111222', telegram: 'helados_sj', rating: 6, isVerified: true },
  vinoteca: { id: 'vinoteca', name: 'Cava XF', businessName: 'VINOTECA MENDOZA PREMIUM', avatar: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=200&auto=format&fit=crop', phone: '+549261333444', whatsapp: '+549261333444', telegram: 'vinos_mza', rating: 6, isVerified: true },
};

const Marketplace: React.FC<{ user: User }> = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todo');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [orderState, setOrderState] = useState<'idle' | 'ordering' | 'delivered'>('idle');
  const [filterByDistance, setFilterByDistance] = useState(false);

  // PRODUCTOS ACTUALIZADOS CON IMÁGENES COMPLETAS Y TODAS LAS CATEGORÍAS
  const FOOD_PRODUCTS: (MarketplaceItem & { distance: string, city: string, logo: string, canReserve?: boolean })[] = [
    { 
      id: 'f1', 
      name: 'Pizza Napolitana Gourmet', 
      description: 'Masa madre, mozzarella de búfala, albahaca fresca y aceite de oliva. Calidad PedidosYa.', 
      price: user.currency === 'ARS' ? 12500 : 18, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.pya, 
      deliveryTime: '20 min',
      distance: '0.9 km (Cerca)',
      city: 'Buenos Aires',
      logo: MOCK_SELLERS.pya.avatar
    },
    { 
      id: 'f2', 
      name: 'Hamburguesa Triple XF', 
      description: 'Tres medallones de carne vacuna, cheddar fundido y panceta ahumada en pan de papa.', 
      price: user.currency === 'ARS' ? 9500 : 14, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.rc_burger, 
      deliveryTime: '25 min',
      distance: '1.2 km (Cerca)',
      city: 'Río Cuarto',
      logo: MOCK_SELLERS.rc_burger.avatar,
      canReserve: true
    },
    { 
      id: 'b1', 
      name: 'Vino Malbec Selección', 
      description: 'Vino tinto de alta gama de bodegas mendocinas. Incluye copa de regalo.', 
      price: user.currency === 'ARS' ? 8900 : 13, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.vinoteca, 
      deliveryTime: '15 min',
      distance: '2.5 km',
      city: 'Mendoza',
      logo: MOCK_SELLERS.vinoteca.avatar
    },
    { 
      id: 'b2', 
      name: 'Pack Cerveza Artesanal', 
      description: 'Mix de 4 latas: IPA, Honey, Golden y Porter. Bien frías.', 
      price: user.currency === 'ARS' ? 5200 : 8, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1535959600575-052011ad5d6f?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.sj_viandas, 
      deliveryTime: '10 min',
      distance: '0.4 km',
      city: 'San Juan',
      logo: MOCK_SELLERS.sj_viandas.avatar
    },
    { 
      id: 'p1', 
      name: 'Helado Artesanal 1kg', 
      description: 'Sabores a elección: Dulce de leche real, chocolate volcán y crema americana.', 
      price: user.currency === 'ARS' ? 14500 : 22, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.gelato, 
      deliveryTime: '15 min',
      distance: '1.0 km',
      city: 'San Juan',
      logo: MOCK_SELLERS.gelato.avatar
    },
    { 
      id: 'd1', 
      name: 'Desayuno Completo XF', 
      description: 'Café latte, medialunas calientes, jugo de naranja y tostadas con palta.', 
      price: user.currency === 'ARS' ? 6800 : 10, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.sj_viandas, 
      deliveryTime: 'Mañana',
      distance: '0.6 km',
      city: 'San Juan',
      logo: MOCK_SELLERS.sj_viandas.avatar,
      canReserve: true
    },
    { 
      id: 'r1', 
      name: 'Cena Show & Reserva', 
      description: 'Reserva de mesa VIP para cena con espectáculo en vivo. Ideal para parejas.', 
      price: user.currency === 'ARS' ? 28000 : 45, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1550966841-3ee7adac1661?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.rappi, 
      deliveryTime: 'Sujeto a Horario',
      distance: '3.8 km',
      city: 'Mendoza',
      logo: MOCK_SELLERS.rappi.avatar,
      canReserve: true
    },
    { 
      id: 'b3', 
      name: 'Gaseosa & Jugos Fríos', 
      description: 'Variedad de bebidas sin alcohol: Coca-Cola, Sprite, Jugos exprimidos y Agua Mineral.', 
      price: user.currency === 'ARS' ? 1500 : 3, 
      category: 'food', 
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200&auto=format&fit=crop', 
      seller: MOCK_SELLERS.pya, 
      deliveryTime: '10 min',
      distance: '1.5 km',
      city: 'Buenos Aires',
      logo: MOCK_SELLERS.pya.avatar
    }
  ];

  const categories = [
    { id: 'Todo', name: 'Todo el Menú', icon: Utensils },
    { id: 'Hamburguesas', name: 'Burgers', icon: Flame },
    { id: 'Bebidas', name: 'Bebidas & Alcohol', icon: Wine },
    { id: 'Postres', name: 'Helados & Postres', icon: IceCream },
    { id: 'Desayunos', name: 'Desayunos', icon: Coffee },
    { id: 'Reservas', name: 'Reservar Mesa', icon: CalendarCheck },
  ];

  const filteredProducts = FOOD_PRODUCTS.filter(p => {
    if (activeCategory === 'Todo') return true;
    if (activeCategory === 'Hamburguesas') return p.name.includes('Burger') || p.name.includes('Hamburguesa');
    if (activeCategory === 'Bebidas') return p.name.includes('Vino') || p.name.includes('Cerveza') || p.name.includes('Gaseosa') || p.name.includes('Jugo');
    if (activeCategory === 'Postres') return p.name.includes('Helado') || p.name.includes('Postre');
    if (activeCategory === 'Desayunos') return p.name.includes('Desayuno') || p.name.includes('Café');
    if (activeCategory === 'Reservas') return p.canReserve === true;
    return true;
  });

  const handleOrder = () => {
    setOrderState('ordering');
    setTimeout(() => { setOrderState('delivered'); }, 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-32 animate-fade-in font-rajdhani overflow-hidden">
      
      {/* HEADER GASTRONOMÍA */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10 md:mb-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
           <div className="w-16 h-16 md:w-24 md:h-24 bg-red-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] border-2 border-white/20 flex-shrink-0">
              <Utensils className="text-white" size={window.innerWidth < 768 ? 32 : 48} />
           </div>
           <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-futuristic italic tracking-tighter text-white uppercase leading-none truncate">GASTRONOMÍA <span className="text-red-600">XF</span></h1>
              <p className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] mt-2 md:mt-3 italic flex items-center gap-2">
                 <LocateFixed size={14} className="text-red-500" /> LOCALES ACTIVOS • GPS ONLINE
              </p>
           </div>
        </div>

        <div className="flex gap-3 md:gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-[350px] lg:w-[400px]">
              <input type="text" placeholder="¿Qué quieres comer?" className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] py-4 md:py-5 px-12 md:px-16 outline-none focus:ring-2 focus:ring-red-600 text-white font-bold italic shadow-2xl text-sm" />
              <Search className="absolute left-4 md:left-6 top-3.5 md:top-5 text-white/20" size={20} md:size={26} />
           </div>
           <button 
             onClick={() => setFilterByDistance(!filterByDistance)}
             className={`p-4 md:px-8 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 md:gap-3 border shadow-xl ${filterByDistance ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
           >
              <Navigation size={18} /> <span className="hidden sm:inline">{filterByDistance ? 'CERCA' : 'MUNDO'}</span>
           </button>
        </div>
      </div>

      {/* CATEGORÍAS - SCROLLABLE RESPONSIVE */}
      <div className="flex gap-3 md:gap-5 overflow-x-auto pb-8 md:pb-12 scrollbar-hide px-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-3 md:gap-4 px-6 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[3rem] font-black transition-all border-2 whitespace-nowrap shadow-xl ${activeCategory === cat.id ? 'bg-red-600 border-red-500 text-white scale-105' : 'bg-[#0a0a0f] border-white/5 text-white/30 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={window.innerWidth < 768 ? 18 : 24} /><span className="text-[10px] md:text-sm uppercase italic tracking-[0.1em]">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* GRID DE PRODUCTOS - RESPONSIVE 1-2-3 COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredProducts.map(product => (
          <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-[#050508] border border-white/10 rounded-[3rem] md:rounded-[4.5rem] overflow-hidden group hover:border-red-600 transition-all cursor-pointer shadow-2xl relative flex flex-col hover:scale-[1.02] duration-500">
            
            {/* Foto del Producto - RELACIÓN 4:3 ESTRICTA */}
            <div className="aspect-[4/3] relative overflow-hidden bg-black">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] opacity-90 group-hover:opacity-100" alt={product.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent"></div>
              
              <div className="absolute top-4 left-4 md:top-8 md:left-8 flex gap-2 md:gap-3">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-[1.5rem] p-2 md:p-3 shadow-2xl flex items-center justify-center border-2 border-white/30">
                    <img src={product.logo} className="w-full h-full object-contain" />
                 </div>
                 <div className="flex flex-col gap-1 md:gap-2">
                    <div className="bg-red-600 px-3 py-1 md:px-5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black text-white uppercase italic shadow-2xl tracking-widest">
                       {product.canReserve ? 'RESERVA' : 'DISPONIBLE'}
                    </div>
                    <div className="bg-black/80 backdrop-blur-xl px-3 py-1 md:px-5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black text-cyan-400 uppercase italic border border-white/10 flex items-center gap-1 md:gap-2 shadow-2xl">
                       <MapPin size={10} md:size={12} /> {product.distance}
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 md:p-12 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4 md:mb-6 gap-2">
                 <h3 className="font-black text-xl md:text-3xl text-white uppercase italic tracking-tighter leading-none">{product.name}</h3>
                 <p className="text-xl md:text-3xl font-black text-red-500 font-futuristic flex-shrink-0">{user.currencySymbol}{product.price.toLocaleString()}</p>
              </div>
              
              <p className="text-xs md:text-sm text-white/50 font-medium italic mb-6 md:mb-10 line-clamp-2 leading-relaxed">"{product.description}"</p>

              <div className="mt-auto flex items-center justify-between p-4 md:p-6 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 shadow-inner">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                       <div className="flex items-center gap-1 md:gap-2">
                          <p className="text-[10px] md:text-[11px] font-black text-white uppercase italic truncate max-w-[100px] md:max-w-[150px]">{product.seller.businessName}</p>
                       </div>
                       <p className="text-[8px] md:text-[9px] text-white/20 font-bold uppercase mt-1 tracking-widest">{product.city}</p>
                    </div>
                 </div>
                 <button className="p-3 md:p-4 bg-red-600/10 text-red-500 rounded-xl md:rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                    <Navigation2 size={20} md:size={24} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE - ADAPTADO A MÓVIL (STACKED) Y PC (SIDE BY SIDE) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4 md:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-7xl bg-[#05050a] border-2 border-white/10 rounded-[2.5rem] md:rounded-[5rem] overflow-hidden shadow-2xl animate-scale-in flex flex-col lg:flex-row min-h-[70vh]">
             <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 md:top-10 md:right-10 z-[300] text-white/30 hover:text-white p-3 md:p-5 bg-white/5 rounded-full transition-all border border-white/10"><X size={28} md:size={40}/></button>
             
             {/* Lado Imagen */}
             <div className="w-full lg:w-1/2 bg-black relative aspect-video lg:aspect-auto overflow-hidden flex items-center justify-center">
                <img src={selectedProduct.image} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 md:bottom-16 md:left-16 md:right-16">
                   <div className="flex gap-3 md:gap-4 mb-4 md:mb-8 items-center">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[2rem] p-3 md:p-5 shadow-2xl">
                         <img src={(selectedProduct as any).logo} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <span className="bg-red-600 px-4 py-1 md:px-8 md:py-2 rounded-full text-[10px] md:text-xs font-black text-white uppercase italic tracking-widest shadow-2xl flex items-center gap-2">
                           <ShoppingBag size={14} md:size={16}/> { (selectedProduct as any).canReserve ? 'RESERVA VIP' : 'ORDENAR YA' }
                        </span>
                        <div className="bg-black/60 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black text-cyan-400 uppercase italic border border-white/10 w-fit">
                           { (selectedProduct as any).city }
                        </div>
                      </div>
                   </div>
                   <h2 className="text-3xl md:text-5xl lg:text-7xl font-black font-futuristic text-white italic uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                </div>
             </div>

             {/* Lado Información */}
             <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col overflow-y-auto">
                <div className="flex-1">
                   <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 md:mb-12 md:pb-12 border-b-2 border-white/5 gap-4">
                      <div>
                        <p className="text-4xl md:text-7xl font-black text-white font-futuristic">{user.currencySymbol}{selectedProduct.price.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1 italic">{user.currency}</p>
                      </div>
                      <div className="md:text-right">
                         <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1 md:mb-3 italic text-left md:text-right">TIEMPO ESTIMADO</p>
                         <div className="flex items-center gap-2 md:gap-4 text-red-500 font-black text-2xl md:text-3xl italic">
                            <Clock size={20} md:size={28}/> {selectedProduct.deliveryTime}
                         </div>
                      </div>
                   </div>

                   <p className="text-base md:text-2xl italic font-medium leading-relaxed text-white/60 mb-8 md:mb-16 border-l-4 border-red-600 pl-4 md:pl-8">"{selectedProduct.description}"</p>

                   {/* TARJETA DEL LOCAL */}
                   <div className="p-6 md:p-12 bg-black/60 rounded-[2rem] md:rounded-[4rem] border-2 border-white/5 mb-8 md:mb-12 shadow-2xl">
                      <div className="flex items-center gap-6 md:gap-10 mb-8 md:mb-12">
                         <div className="w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-white/10 p-3 md:p-4 bg-white shadow-2xl flex-shrink-0">
                            <img src={(selectedProduct as any).logo} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1">
                            <h3 className="text-xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2 md:mb-4">{selectedProduct.seller.businessName}</h3>
                            <div className="flex items-center gap-3 md:gap-6">
                               <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                                  <Star size={14} md:size={20} fill="currentColor" />
                                  <span className="text-xs md:text-lg font-black">{selectedProduct.seller.rating}.0</span>
                               </div>
                               <span className="text-[8px] md:text-xs font-black text-white/30 uppercase tracking-widest italic flex items-center gap-1.5">
                                  <Map size={14} md:size={16} /> CIUDAD: { (selectedProduct as any).city }
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-6">
                         <a href={`https://www.google.com/maps/search/${encodeURIComponent(selectedProduct.seller.businessName + ' ' + (selectedProduct as any).city)}`} target="_blank" className="flex items-center justify-center gap-2 md:gap-4 bg-red-600 text-white py-4 md:py-6 rounded-xl md:rounded-3xl font-black text-[10px] md:text-sm uppercase italic tracking-widest hover:bg-red-500 transition-all shadow-xl text-center">
                            <Map size={18} md:size={24} /> <span className="hidden sm:inline">GPS REAL</span>
                         </a>
                         <a href={`tel:${selectedProduct.seller.phone}`} className="flex items-center justify-center gap-2 md:gap-4 bg-white/5 border-2 border-white/10 text-white py-4 md:py-6 rounded-xl md:rounded-3xl font-black text-[10px] md:text-sm uppercase italic tracking-widest hover:bg-white/10 transition-all text-center">
                            <Phone size={18} md:size={24} /> <span className="hidden sm:inline">LLAMAR</span>
                         </a>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleOrder}
                  className="w-full py-6 md:py-10 bg-gradient-to-r from-red-600 via-red-700 to-red-900 hover:from-red-500 hover:to-red-700 text-white rounded-[2rem] md:rounded-[3.5rem] font-black font-futuristic text-xl md:text-3xl shadow-[0_0_80px_rgba(220,38,38,0.5)] transition-all uppercase italic tracking-widest active:scale-95 flex items-center justify-center gap-4 md:gap-8 border-2 border-white/10"
                >
                   {orderState === 'idle' ? (
                     <><UtensilsCrossed size={28} md:size={40} /> { (selectedProduct as any).canReserve ? 'CONFIRMAR RESERVA' : 'CONFIRMAR PEDIDO' }</>
                   ) : orderState === 'ordering' ? (
                     <><Loader2 size={28} md:size={40} className="animate-spin" /> PROCESANDO...</>
                   ) : (
                     <><CheckCircle size={28} md:size={40} /> ¡LISTO!</>
                   )}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* RADAR GASTRONÓMICO - DISEÑO RE-AJUSTADO PARA NO CORTARSE */}
      <div className="mt-16 md:mt-24 p-10 md:p-20 bg-[#05050a] rounded-[3rem] md:rounded-[5rem] border-2 border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[5s] pointer-events-none hidden lg:block">
            <LocateFixed size={400} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-red-600/10 rounded-3xl md:rounded-[3rem] flex items-center justify-center border-2 border-red-500/20 shadow-[0_0_40px_rgba(220,38,38,0.2)] flex-shrink-0">
               <Navigation size={40} md:size={60} className="text-red-500 animate-pulse" />
            </div>
            <div>
               <h3 className="text-3xl md:text-5xl font-black font-futuristic italic text-white leading-none uppercase tracking-tighter mb-4">RADAR GASTRONÓMICO</h3>
               <p className="text-white/30 text-sm md:text-xl font-bold italic tracking-wide max-w-lg leading-relaxed">
                  Localizando automáticamente los mejores restaurantes, bares y heladerías cerca de tu posición actual.
               </p>
            </div>
         </div>
         
         <div className="flex gap-8 md:gap-20 relative z-10 text-center lg:border-l-2 border-white/5 lg:pl-20">
            <div className="group">
               <p className="text-4xl md:text-7xl font-black text-white leading-none italic group-hover:text-red-500 transition-colors">LOCAL</p>
               <p className="text-[10px] md:text-[11px] text-white/30 font-black uppercase mt-2 md:mt-4 tracking-widest md:tracking-[0.6em] italic whitespace-nowrap">GPS XF</p>
            </div>
            <div className="w-px h-16 md:h-24 bg-white/10 hidden md:block"></div>
            <div className="group">
               <p className="text-4xl md:text-7xl font-black text-red-600 leading-none italic group-hover:text-white transition-colors">GLOBAL</p>
               <p className="text-[10px] md:text-[11px] text-white/30 font-black uppercase mt-2 md:mt-4 tracking-widest md:tracking-[0.6em] italic whitespace-nowrap">DELIVERY XF</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Marketplace;
