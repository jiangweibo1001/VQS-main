
import React from 'react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onNavigateHome }) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" 
            placeholder="Search for offers, bundles, or partners..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 pl-8">
        <div 
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
          onClick={onNavigateHome}
        >
          <span className="material-symbols-outlined">help_outline</span>
          <span className="text-sm font-medium hidden sm:inline">Support</span>
        </div>
        
        <div 
          className="relative flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-all"
          onClick={onOpenCart}
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
