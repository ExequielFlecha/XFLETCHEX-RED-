
import React, { useState } from 'react';
import { 
  ShoppingBag, Utensils, MapPin, Search, Star, CreditCard, Truck, 
  Clock, Phone, MessageCircle, CheckCircle, X, ShieldCheck, Info,
  Package, StarHalf, Heart, ArrowRight, ExternalLink, User
} from 'lucide-react';
import { MarketplaceItem, Seller } from '../types';

const MOCK_SELLERS: Record<string, Seller> = {
  s1: { id: 's1', name: 'Exequiel Admin', businessName: 'XF-TECH GLOBAL', avatar: 'https://picsum.photos/seed/admin/100', phone: '+54 9 11 1234-5678', rating: 6, isVerified: true },
  s2: { id: 's2', name: 'Luna Stark', businessName: 'LUNA JEWELRY', avatar: 'https://picsum.photos/seed/luna/100', phone: '+54 9 11 8765-4321', rating: 5, isVerified: true },
  s3: { id: 's3', name: 'Cyber Chef', businessName: 'NEON BURGERS', avatar: 'https://picsum.photos/seed/chef/100', phone: '+54 9 11 5555-0000', rating: 6, isVerified: true },
  s4: { id: 's4', name: 'Marco Polo', businessName: 'GALAXY MOTORS', avatar: 'https://picsum.photos/seed/marco/100', phone: '+54 9 11 9999-8888', rating: 6, isVerified: true },
};

const PRODUCTS: MarketplaceItem[] = [
  { id: 'p1', name: 'Tesla CyberTruck XF', description: 'Vehículo blindado con tecnología galáctica. Autonomía de 1000km.', price: 85000, category: 'vehicles', image: 'https://picsum.photos/seed/truck/800/600', seller: MOCK_SELLERS.s4, deliveryTime: '5 días' },
  { id: 'p2', name: 'RTX 6090 Super XF', description: 'La placa de video más potente de la red para minar créditos DIOS.', price: 2400, category: 'tech', image: 'https://picsum.photos/seed/gpu/800/600', seller: MOCK_SELLERS.s1, deliveryTime: '24 hs' },
  { id: 'p3', name: 'Reloj de Diamante Negro', description: 'Joya única tallada en asteroides. Edición limitada.', price: 15000, category: 'jewelry', image: 'https://picsum.photos/seed/watch/800/600', seller: MOCK_SELLERS.s2, deliveryTime: '3 días' },
  { id: 'p4', name: 'Hoodie XF-RED Creator', description: 'Ropa oficial de la red. Tela inteligente autorefrigerante.', price: 120, category: 'clothes', image: 'https://picsum.photos/seed/hoodie/800/600', seller: MOCK_SELLERS.s1, deliveryTime: '48 hs' },
  { id: 'f1', name: 'Mega Burguer Galáctica', description: 'Carne premium con salsa secreta de la casa. Triple queso.', price: 15, category: 'food', image: 'https://picsum.photos/seed/burger/800/600', seller: MOCK_SELLERS.s3, deliveryTime: '30 min' },
  { id: 'f2', name: 'Sushi de Oro XF', description: 'Bandeja de 30 piezas bañadas en polvo de oro comestible.', price: 45, category: 'food', image: 'https://picsum.photos/seed/sushi/800/600', seller: MOCK_SELLERS.s3, deliveryTime: '45 min' },
];

const Marketplace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MarketplaceItem['category'] | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [orderState, setOrderState] = useState<'idle' | 'ordering' | 'delivered'>('idle');
  const [userRating, setUserRating] = useState(0);

  const categories = [
    { id: 'all', name: 'Todo', icon: ShoppingBag },
    { id: 'tech', name: 'Tech', icon: ShieldCheck },
    { id: 'clothes', name: 'Ropa', icon: User },
    { id: 'jewelry', name: 'Joyas', icon: Heart },
    { id: 'vehicles', name: 'Vehículos', icon: Truck },
    { id: 'food', name: 'Comida', icon: Utensils },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleOrder = () => {
    setOrderState('ordering');
    setTimeout(() => {
      setOrderState('delivered');
    }, 4000);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setOrderState('idle');
    setUserRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in font-rajdhani">
      
      {/* Header del Mercado */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div>
           <h1 className="text-4xl font-black font-futuristic italic tracking-tighter text-white uppercase leading-none">MERCADO <span className="text-red-600">XFLETCHEX</span></h1>
           <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-2">Compras seguras a domicilio • Sin estafas</p>
        </div>

        <div className="flex-1 max-w-xl relative w-full">
          <input 
            type="text" 
            placeholder="¿Qué producto buscas recibir en tu casa?" 
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-14 outline-none focus:ring-2 focus:ring-red-600 transition-all text-white font-bold"
          />
          <Search className="absolute left-5 top-4 text-white/20" size={24} />
        </div>
      </div>

      {/* Categorías */}
      <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all border-2 whitespace-nowrap ${activeCategory === cat.id ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-900/40' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={20} />
              <span className="text-xs uppercase italic tracking-widest">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            className="bg-black/40 border border-white/10 rounded-[3rem] overflow-hidden group hover:border-red-600/40 transition-all cursor-pointer shadow-2xl relative"
          >
            <div className="aspect-square relative overflow-hidden bg-black">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] opacity-80 group-hover:opacity-100" />
              <div className="absolute top-4 right-4 bg-red-600 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase italic shadow-2xl">
                {product.category}
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-xl text-white uppercase italic tracking-tighter leading-tight">{product.name}</h3>
              </div>
              
              <p className="text-3xl font-black text-white mb-6 font-futuristic">${product.price.toLocaleString()}</p>
              
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                    <img src={product.seller.avatar} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-[8px] text-white/30 font-black uppercase tracking-widest leading-none mb-1">Vendedor</p>
                    <div className="flex items-center gap-1">
                       <p className="text-[10px] font-bold text-white uppercase italic">{product.seller.businessName}</p>
                       {product.seller.isVerified && <CheckCircle size={10} className="text-cyan-400" />}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                       {[...Array(6)].map((_, i) => (
                         <Star key={i} size={8} className={i < product.seller.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'} />
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE DE PRODUCTO Y FLUJO DE COMPRA */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-6xl bg-[#05050a] border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)] animate-scale-in flex flex-col md:flex-row min-h-[80vh]">
             <button onClick={closeProduct} className="absolute top-8 right-8 z-30 text-white/20 hover:text-white transition-colors bg-black/40 p-3 rounded-full"><X size={32}/></button>
             
             {/* Imagen del Producto */}
             <div className="md:w-1/2 bg-black relative group overflow-hidden">
                <img src={selectedProduct.image} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                   <div className="flex gap-2 mb-4">
                      {['Premium', 'Nuevo', 'Garantía XF'].map(tag => (
                        <span key={tag} className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase italic border border-white/10">{tag}</span>
                      ))}
                   </div>
                   <h2 className="text-5xl font-black font-futuristic text-white italic uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                </div>
             </div>

             {/* Detalles y Proceso de Compra */}
             <div className="md:w-1/2 p-10 flex flex-col">
                <div className="flex-1">
                   <div className="flex items-center justify-between mb-8">
                      <p className="text-5xl font-black text-white font-futuristic">${selectedProduct.price.toLocaleString()}</p>
                      <div className="text-right">
                         <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">TIEMPO DE ENTREGA</p>
                         <div className="flex items-center gap-2 text-red-500 font-black italic">
                            <Clock size={16}/> {selectedProduct.deliveryTime}
                         </div>
                      </div>
                   </div>

                   <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 mb-10">
                      <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.3em] mb-4">Descripción del Producto</h4>
                      <p className="text-lg text-white/80 font-medium leading-relaxed italic">{selectedProduct.description}</p>
                   </div>

                   {/* TARJETA DEL VENDEDOR DE CONFIANZA */}
                   <div className="p-8 bg-black/60 rounded-[3rem] border-2 border-cyan-500/20 mb-10 group hover:border-cyan-500/40 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-cyan-500/30 p-1 bg-black shadow-2xl relative">
                            <img src={selectedProduct.seller.avatar} className="w-full h-full object-cover rounded-2xl" />
                            <div className="absolute -bottom-2 -right-2 bg-cyan-400 text-black p-1.5 rounded-full shadow-xl"><CheckCircle size={16}/></div>
                         </div>
                         <div className="flex-1">
                            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.4em] mb-1 italic">VENDEDOR OFICIAL</p>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">{selectedProduct.seller.businessName}</h3>
                            <div className="flex items-center gap-6">
                               <div className="flex gap-1">
                                  {[...Array(6)].map((_, i) => (
                                    <Star key={i} size={14} className={i < selectedProduct.seller.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'} />
                                  ))}
                               </div>
                               <span className="text-xs font-black text-white/40 uppercase tracking-widest">({selectedProduct.seller.rating}/6 Estrellas)</span>
                            </div>
                         </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                         <a href={`tel:${selectedProduct.seller.phone}`} className="flex-1 flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase italic tracking-widest hover:bg-cyan-400 hover:text-white transition-all">
                            <Phone size={18} /> LLAMAR AL VENDEDOR
                         </a>
                         <button className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl font-black text-xs text-white uppercase italic tracking-widest hover:bg-white/10 transition-all">
                            <MessageCircle size={18} /> CHAT EN PRIVADO
                         </button>
                      </div>
                      <p className="text-center text-[9px] text-white/20 font-bold uppercase mt-4 italic">CONEXIÓN DIRECTA Y SEGURA SIN INTERMEDIARIOS ESTAFADORES</p>
                   </div>
                </div>

                {/* ACCIONES DE COMPRA Y ESTADOS */}
                <div className="space-y-6">
                   {orderState === 'idle' && (
                     <button 
                       onClick={handleOrder}
                       className="w-full py-6 bg-red-600 hover:bg-red-500 text-white rounded-[2rem] font-black font-futuristic text-xl shadow-2xl transition-all flex items-center justify-center gap-4 uppercase italic tracking-widest active:scale-95"
                     >
                        <ShoppingBag size={24} /> HACER PEDIDO AHORA
                     </button>
                   )}

                   {orderState === 'ordering' && (
                     <div className="w-full bg-cyan-600/20 border-2 border-cyan-500 p-8 rounded-[2.5rem] flex flex-col items-center text-center animate-pulse">
                        <Truck size={48} className="text-cyan-400 mb-4 animate-bounce" />
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">PAQUETE EN CAMINO</h4>
                        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mt-2">La IA está rastreando el envío a tu domicilio...</p>
                     </div>
                   )}

                   {orderState === 'delivered' && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="w-full bg-green-600/20 border-2 border-green-500 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                           <Package size={48} className="text-green-500 mb-4" />
                           <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">PRODUCTO RECIBIDO</h4>
                           <p className="text-green-400 text-xs font-bold uppercase tracking-widest mt-2">¡Felicitaciones por tu nueva adquisición!</p>
                        </div>

                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center">
                           <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mb-6 italic">Califica al Vendedor (1 a 6 Estrellas)</p>
                           <div className="flex justify-center gap-3 mb-6">
                              {[...Array(6)].map((_, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => setUserRating(i + 1)}
                                  className={`p-2 transition-all transform hover:scale-125 ${userRating > i ? 'text-yellow-500 scale-110' : 'text-white/10'}`}
                                >
                                   <Star size={40} fill={userRating > i ? 'currentColor' : 'none'} />
                                </button>
                              ))}
                           </div>
                           <button 
                             onClick={closeProduct}
                             className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all ${userRating > 0 ? 'bg-white text-black hover:bg-red-600 hover:text-white' : 'bg-white/5 text-white/20 pointer-events-none'}`}
                           >
                              FINALIZAR Y ENVIAR RESEÑA
                           </button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* FOOTER DE GARANTÍA */}
      <div className="mt-20 p-12 bg-[#05050a] rounded-[4rem] border-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><ShieldCheck size={200} /></div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center border border-red-500/20">
               <ShieldCheck size={40} className="text-red-500" />
            </div>
            <div>
               <h3 className="text-3xl font-black font-futuristic italic text-white leading-none uppercase tracking-tighter">PROTECCIÓN XFLETCHEX</h3>
               <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-2">Garantía absoluta del Creador DIOS contra estafas y mentiras.</p>
            </div>
         </div>
         <div className="flex gap-10 items-center relative z-10">
            <div className="text-center">
               <p className="text-3xl font-black text-white leading-none">10.5K+</p>
               <p className="text-[10px] text-white/30 font-black uppercase mt-1">Ventas Reales</p>
            </div>
            <div className="text-center">
               <p className="text-3xl font-black text-cyan-400 leading-none">99.9%</p>
               <p className="text-[10px] text-white/30 font-black uppercase mt-1">Entregas OK</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Marketplace;
