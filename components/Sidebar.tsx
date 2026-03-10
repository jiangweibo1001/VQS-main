
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 hidden md:flex">
      <div className="p-6 flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800">
        <div 
          className="flex items-center gap-2 mb-2 cursor-pointer"
          onClick={() => onNavigate(Page.OfferSelection)}
        >
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">CPQ Pro</h1>
        </div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Enterprise Offer Catalog</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div 
          onClick={() => onNavigate(Page.OfferSelection)}
          className={`${currentPage === Page.OfferSelection ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'} flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer`}
        >
          <span className="material-symbols-outlined">language</span>
          <span className="text-sm font-semibold">Connectivity</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-all">
          <span className="material-symbols-outlined">cloud</span>
          <span className="text-sm font-semibold">Cloud Services</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-all">
          <span className="material-symbols-outlined">security</span>
          <span className="text-sm font-semibold">Security</span>
        </div>
        
        {/* Updated 'Mobile 5G': Capitalized and removed navigation link */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
          <span className="material-symbols-outlined">5g</span>
          <span className="text-sm font-semibold">Mobile 5G</span>
        </div>
        
        <div className="pt-8 px-4 pb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved Configurations</p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-all">
          <span className="material-symbols-outlined">folder_special</span>
          <span className="text-sm font-semibold">Standard Bundles</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-all">
          <span className="material-symbols-outlined">history</span>
          <span className="text-sm font-semibold">Recent Quotes</span>
        </div>
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrsZFXRl7j4CIg8zXmpMvOadF-jKCuOZL78ZYkwtRbEIgOkTtCSYj4w-0tRI6831L_-2Z-ogC4qFE01-OT8BRgZZclOjQImHfDUpgv31iW_-9db6rJdbIWUQHgE0Jj3QaZz6weT1fTVEkHjpc6JTUBc_VdiqeDh_Xw7CllV-o3BWNe_Hgzz92g539xBhWQB_HdCxULXzS73FH9D3G07ooxmRTD3jgZtp7AWuIOC0_jxcIpxOrumh6SSMacd3Wz5CL3b9Rbcokpwjrr')" }}></div>
          <div className="flex flex-col">
            <p className="text-sm font-bold">Alex Chen</p>
            <p className="text-xs text-slate-500">Sales Architect</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
