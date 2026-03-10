
import React, { useState } from 'react';
import { CartItem } from '../types';

interface InquiryModalProps {
  cart: CartItem[];
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ cart, onClose, onConfirm }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-[720px] bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-8 pb-4 shrink-0">
          <div className="flex items-start justify-between">
            <h2 className="text-[#0d141b] dark:text-white text-[24px] font-bold leading-tight tracking-tight mb-4">
              Partner Products Detected, Initiate Inquiry?
            </h2>
            <button 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-[#0d141b] dark:text-slate-200 text-base font-medium leading-normal">
              Current cart contains products or services provided by Partners.
            </p>
            <p className="text-[#4c739a] dark:text-slate-400 text-sm font-normal leading-normal">
              To obtain Partner quotes, please select the Offers to be inquired and initiate the inquiry process; if not needed currently, you can skip this step to continue quoting.
            </p>
          </div>
        </div>
        
        <div className="px-8 py-2 flex-1 flex flex-col min-h-0">
          <h3 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3 pt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">list_alt</span>
            Available Partner Offers for Inquiry
          </h3>
          <div className="flex-1 overflow-y-auto border border-[#cfdbe7] dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-[#0f172a]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-[#0d141b] dark:text-slate-200 w-[80px] text-sm font-semibold leading-normal border-b border-[#cfdbe7] dark:border-slate-700 text-center">
                    Select
                  </th>
                  <th className="px-4 py-3 text-[#0d141b] dark:text-slate-200 text-sm font-semibold leading-normal border-b border-[#cfdbe7] dark:border-slate-700">
                    Offer Name
                  </th>
                  <th className="px-4 py-3 text-[#0d141b] dark:text-slate-200 text-sm font-semibold leading-normal border-b border-[#cfdbe7] dark:border-slate-700 w-[100px]">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-[#0d141b] dark:text-slate-200 text-sm font-semibold leading-normal border-b border-[#cfdbe7] dark:border-slate-700">
                    Vendor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cfdbe7] dark:divide-slate-700">
                {cart.map(item => (
                  <tr key={item.offer.id} className="group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-[#1e293b]">
                    <td className="px-4 py-3 text-center align-middle">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(item.offer.id)}
                        onChange={() => toggleSelection(item.offer.id)}
                        className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-primary checked:bg-primary focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all"
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-[#0d141b] dark:text-white text-sm font-bold leading-normal">
                        {item.offer.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-[#0d141b] dark:text-white text-sm font-normal leading-normal">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="text-slate-400 dark:text-slate-500 text-sm font-normal italic">
                        Not assigned
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="p-8 pt-4 mt-2 bg-white dark:bg-[#1e293b] shrink-0 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#4c739a] dark:text-slate-500 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">info</span>
              {selected.length === 0 ? "Skipping inquiry when no Offers are selected." : `${selected.length} items selected for inquiry.`}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-[#cfdbe7] dark:border-slate-600 bg-white dark:bg-transparent text-[#0d141b] dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                Skip Inquiry
              </button>
              <button 
                onClick={handleConfirm}
                disabled={selected.length === 0}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:bg-[#1170d2] transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                Create Inquiry Request
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
