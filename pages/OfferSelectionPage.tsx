
import React from 'react';
import { OFFERS } from '../constants';
import { Offer } from '../types';

interface OfferSelectionPageProps {
  onAddToCart: (offer: Offer) => void;
}

const OfferSelectionPage: React.FC<OfferSelectionPageProps> = ({ onAddToCart }) => {
  return (
    <div className="p-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Connectivity Offers</h2>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">24 Results</span>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="text-slate-500">Sort by:</span>
            <span>Relevant</span>
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {OFFERS.map(offer => (
          <div 
            key={offer.id} 
            className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col ${offer.badge === 'Best Seller' ? 'border-2 border-primary/20' : ''}`}
          >
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${offer.type === 'partner' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined">{offer.icon}</span>
                </div>
                {offer.badge ? (
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${offer.badge === 'Best Seller' ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary'}`}>
                    {offer.badge}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Standard</span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{offer.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed flex-1">
                {offer.description}
              </p>
              
              <div className="mt-auto grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">One-Time (OTC)</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">${offer.otc.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Recurring (RC)</p>
                  <p className="text-lg font-extrabold text-primary">
                    ${offer.rc.toFixed(2)}
                    <span className="text-xs font-medium text-slate-400">{offer.rcUnit}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onAddToCart(offer)}
              className="w-full py-4 bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors rounded-b-xl flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferSelectionPage;
