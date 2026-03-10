
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  hasPartnerOffers: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, onClose, cart, onRemove, onUpdateQuantity, onCheckout, hasPartnerOffers 
}) => {
  const otcSubtotal = cart.reduce((acc, curr) => acc + (curr.offer.otc * curr.quantity), 0);
  const rcSubtotal = cart.reduce((acc, curr) => acc + (curr.offer.rc * curr.quantity), 0);

  return (
    <aside 
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart ({cart.length} Items)</h2>
        </div>
        <button 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <span className="material-symbols-outlined text-6xl">shopping_basket</span>
            <p className="font-medium text-lg">Your cart is empty</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.offer.id} className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.offer.name}</h4>
                  <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    {item.offer.type === 'partner' ? (
                      <span className="text-indigo-500">Partner Offer</span>
                    ) : (
                      item.offer.category
                    )}
                  </div>
                </div>
                <button 
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  onClick={() => onRemove(item.offer.id)}
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden h-8">
                  <button 
                    className="px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30"
                    onClick={() => onUpdateQuantity(item.offer.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold min-w-[32px] text-center">{item.quantity}</span>
                  <button 
                    className="px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    onClick={() => onUpdateQuantity(item.offer.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">OTC: ${(item.offer.otc * item.quantity).toFixed(2)}</div>
                  <div className="text-sm font-bold text-primary">RC: ${(item.offer.rc * item.quantity).toFixed(2)}{item.offer.rcUnit}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal One-Time (OTC)</span>
              <span className="font-bold text-slate-900 dark:text-white">${otcSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Subtotal Recurring (RC)</span>
              <span className="text-lg font-extrabold text-primary">
                ${rcSubtotal.toFixed(2)}
                <span className="text-xs font-medium text-slate-400">/mo</span>
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {hasPartnerOffers && (
              <p className="text-[11px] text-slate-500 leading-relaxed text-center italic">
                Partner offers detected. You will be prompted for inquiry selection in the next step.
              </p>
            )}
            <button 
              className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              onClick={onCheckout}
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CartSidebar;
