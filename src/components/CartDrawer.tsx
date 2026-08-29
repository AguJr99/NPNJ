import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, Plus, Minus, Shirt, ArrowRight, Package, ClipboardList } from 'lucide-react';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function generateWhatsAppOrderUrl(items: CartItem[]): string {
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let message = `¡Hola! Quiero realizar el siguiente pedido:\n\n`;
  message += `🛒 *RESUMEN DEL PEDIDO* (${totalCount} ${totalCount === 1 ? 'camiseta' : 'camisetas'})\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  items.forEach((item, index) => {
    const isStock = item.itemType === 'stock';
    message += `*${index + 1}. ${item.team}* (${item.type} - ${item.season}) [${isStock ? 'Stock Inmediato' : 'Encargo'}]\n`;
    message += `• Versión: ${item.version}\n`;
    if (item.sleeves) {
      message += `• Manga: ${item.sleeves}\n`;
    }
    message += `• Talla: ${item.size}\n`;

    const playerDetails = item.playerName 
      ? `${item.playerName} ${item.number ? `#${item.number}` : ''}`.trim()
      : (item.number ? `#${item.number}` : 'Sin nombre ni dorsal');
    message += `• Dorsal: ${playerDetails}\n`;

    message += `• Parche: ${item.patch || 'Sin Parche'}\n`;
    message += `• Cantidad: ${item.quantity} ($${item.price} c/u)\n`;
    message += `• Subtotal: $${item.price * item.quantity}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL A PAGAR: $${totalPrice}*\n\n`;
  message += `¿Cómo procedemos con el pago y la entrega?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToTab
}) => {
  const navigate = useNavigate();
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleGoToStock = () => {
    onClose();
    if (onNavigateToTab) {
      onNavigateToTab('stock');
    } else {
      navigate('/stock');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToEncargos = () => {
    onClose();
    if (onNavigateToTab) {
      onNavigateToTab('encargos');
    } else {
      navigate('/encargos');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    const url = generateWhatsAppOrderUrl(items);
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white dark:bg-[#14151A] shadow-2xl flex flex-col relative"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 bg-secondary dark:bg-[#0E0F13] text-white flex items-center justify-between border-b border-primary/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-sans font-black tracking-tight uppercase flex items-center gap-2">
                      Tu Carrito
                      {totalCount > 0 && (
                        <span className="bg-primary text-secondary text-[11px] font-black px-2.5 py-0.5 rounded-full">
                          {totalCount}
                        </span>
                      )}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-white/60 font-medium">
                      {totalCount === 0 
                        ? 'Carrito vacío' 
                        : `${totalCount} ${totalCount === 1 ? 'camiseta seleccionada' : 'camisetas seleccionadas'}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={onClearCart}
                      title="Vaciar carrito"
                      className="p-2 text-white/50 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all text-xs font-bold cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-accent/30 dark:bg-[#0E0F13] space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                    <div className="w-20 h-20 bg-secondary/5 dark:bg-white/5 rounded-full flex items-center justify-center text-secondary/30 dark:text-white/30">
                      <ShoppingCart className="w-10 h-10" />
                    </div>
                    <div className="space-y-2 max-w-xs">
                      <h3 className="text-lg font-sans font-black text-secondary dark:text-white uppercase tracking-tight">
                        Tu carrito está vacío
                      </h3>
                      <p className="text-xs text-secondary/60 dark:text-white/60 leading-relaxed font-medium">
                        Añade camisetas desde nuestra sección de Stock para entrega inmediata o personaliza tus pedidos por Encargo.
                      </p>
                    </div>

                    <div className="w-full space-y-2.5 pt-2">
                      <button
                        onClick={handleGoToStock}
                        className="w-full bg-secondary text-primary py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-primary hover:text-secondary transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4" />
                        Ver Stock Disponible
                      </button>
                      <button
                        onClick={handleGoToEncargos}
                        className="w-full bg-white dark:bg-[#1C1D24] text-secondary dark:text-white border-2 border-secondary/10 dark:border-white/10 py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:border-secondary dark:hover:border-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Hacer Encargo Personalizado
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-[#1A1B22] rounded-2xl p-3.5 sm:p-4 border border-secondary/5 dark:border-white/10 shadow-md flex gap-3 sm:gap-4 relative group hover:shadow-lg transition-all"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-24 sm:w-22 sm:h-26 bg-accent/40 dark:bg-[#121318] rounded-xl overflow-hidden shrink-0 border border-secondary/5 dark:border-white/10 flex items-center justify-center relative">
                          <img
                            src={item.image}
                            alt={item.team}
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/200x260?text=Camiseta';
                            }}
                          />
                          <span
                            className={`absolute bottom-1 left-1 text-[7px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm ${
                              item.itemType === 'stock'
                                ? 'bg-primary text-secondary'
                                : 'bg-secondary text-primary'
                            }`}
                          >
                            {item.itemType === 'stock' ? 'Stock' : 'Encargo'}
                          </span>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-sans font-black text-secondary dark:text-white text-sm leading-snug uppercase truncate">
                                {item.team}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-secondary/30 dark:text-white/30 hover:text-red-500 p-1 -mr-1 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar del carrito"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[10px] font-bold text-secondary/50 dark:text-white/50 uppercase tracking-wider mb-1.5">
                              {item.season} • {item.type}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              <span className="bg-secondary/5 dark:bg-white/10 text-secondary dark:text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {item.version}
                              </span>
                              <span className="bg-primary/15 text-secondary dark:text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Talla {item.size}
                              </span>
                              {item.sleeves && (
                                <span className="bg-secondary/5 dark:bg-white/10 text-secondary/70 dark:text-white/70 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  Manga {item.sleeves}
                                </span>
                              )}
                            </div>

                            {/* Player & Patch Info */}
                            <div className="space-y-0.5 text-[9px] text-secondary/70 dark:text-white/70 font-medium">
                              <p className="truncate">
                                <span className="font-bold text-secondary/40 dark:text-white/40 uppercase">Dorsal: </span>
                                {item.playerName || item.number ? (
                                  <span className="font-bold text-secondary dark:text-white">
                                    {item.playerName || ''} {item.number ? `#${item.number}` : ''}
                                  </span>
                                ) : (
                                  <span className="italic text-secondary/40 dark:text-white/40">Sin dorsal</span>
                                )}
                              </p>
                              <p className="truncate">
                                <span className="font-bold text-secondary/40 dark:text-white/40 uppercase">Parche: </span>
                                <span className="font-bold text-secondary/80 dark:text-white/80">{item.patch || 'Sin Parche'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Stepper and Price */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-secondary/5 dark:border-white/10">
                            {/* Quantity Controls */}
                            {item.itemType === 'stock' ? (
                              <div />
                            ) : (
                              <div className="flex items-center gap-1 bg-secondary/5 dark:bg-white/10 rounded-lg p-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-secondary dark:text-white hover:bg-white dark:hover:bg-white/20 transition-colors cursor-pointer"
                                  title="Disminuir cantidad"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-black text-secondary dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-secondary dark:text-white hover:bg-white dark:hover:bg-white/20 transition-colors cursor-pointer"
                                  title="Aumentar cantidad"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {/* Price */}
                            <div className="text-right">
                              <span className="text-sm font-sans font-black text-secondary dark:text-white">
                                ${item.price * item.quantity}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[8px] text-secondary/40 dark:text-white/40 block">
                                  ${item.price} c/u
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer / Checkout */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 bg-white dark:bg-[#14151A] border-t border-secondary/10 dark:border-white/10 shadow-2xl space-y-4 shrink-0">
                  {/* Summary row */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-secondary/60 dark:text-white/60 font-bold uppercase tracking-wider">
                      <span>Total de artículos:</span>
                      <span className="font-black text-secondary dark:text-white">{totalCount} {totalCount === 1 ? 'camiseta' : 'camisetas'}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-sans font-black uppercase text-secondary dark:text-white tracking-tight">
                        Total Estimado
                      </span>
                      <span className="text-2xl sm:text-3xl font-sans font-black text-secondary dark:text-white tracking-tight">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Informative notice */}
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] sm:text-[11px] font-bold text-secondary/80 dark:text-white/80 leading-snug">
                      📲 Se enviará un <span className="text-secondary dark:text-primary font-black">único mensaje de WhatsApp</span> con todas las camisetas y detalles de tu pedido.
                    </p>
                  </div>

                  {/* WhatsApp Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#25D366] text-white hover:bg-[#1EBE5D] py-4 rounded-2xl font-sans font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 active:scale-[0.99] group cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.06L0 24l6.104-1.601a11.803 11.803 0 005.943 1.603h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.529-8.511z"/>
                    </svg>
                    Realizar Pedido por WhatsApp
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full text-center text-xs font-bold text-secondary/50 dark:text-white/50 hover:text-secondary dark:hover:text-white uppercase tracking-wider transition-colors pt-1 cursor-pointer"
                  >
                    Seguir explorando camisetas
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
