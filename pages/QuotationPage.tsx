
import React, { useState } from 'react';
import { CartItem } from '../types';
import RFQProcessingPage from './RFQProcessingPage';
import VendorSelectionViewPage from './VendorSelectionViewPage';
import VendorApprovalStatusPage from './VendorApprovalStatusPage';

interface QuotationPageProps {
  selectedOffers: CartItem[];
  onExit?: () => void;
}

type TabType = 'quotation' | 'pnl' | 'tc' | 'billing' | 'attachment' | 'contact' | 'supplier';

const QuotationPage: React.FC<QuotationPageProps> = ({ selectedOffers, onExit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('quotation');
  const [supplierView, setSupplierView] = useState<'list' | 'selection' | 'approval' | 'submitted'>('list');
  const [offersData, setOffersData] = useState(selectedOffers.map(item => ({
    ...item,
    otcDiscountPct: 0,
    otcDiscountAmount: 0,
    rcDiscountPct: 0,
    rcDiscountAmount: 0,
    contractPeriod: '24 Months',
    minQuantity: 1
  })));

  const tabs: { id: TabType; label: string }[] = [
    { id: 'quotation', label: 'Quotation' },
    { id: 'pnl', label: 'P&L Analysis' },
    { id: 'tc', label: 'Terms & Condition' },
    { id: 'billing', label: 'Billing Schedule' },
    { id: 'attachment', label: 'Attachment' },
    { id: 'contact', label: 'Contact' },
    { id: 'supplier', label: 'Supplier Inquiry Task' },
  ];

  const handlePctChange = (index: number, type: 'otc' | 'rc', value: string) => {
    const num = parseFloat(value) || 0;
    const newData = [...offersData];
    const item = newData[index];
    if (type === 'otc') {
      item.otcDiscountPct = num;
      item.otcDiscountAmount = (item.offer.otc * num) / 100;
    } else {
      item.rcDiscountPct = num;
      item.rcDiscountAmount = (item.offer.rc * num) / 100;
    }
    setOffersData(newData);
  };

  const calculateGrandTotals = () => {
    return offersData.reduce((acc, curr) => {
      const otcSales = (curr.offer.otc - curr.otcDiscountAmount) * curr.quantity;
      const rcSales = (curr.offer.rc - curr.rcDiscountAmount) * curr.quantity;
      acc.otcList += curr.offer.otc * curr.quantity;
      acc.otcDiscount += curr.otcDiscountAmount * curr.quantity;
      acc.otcSales += otcSales;
      acc.rcList += curr.offer.rc * curr.quantity;
      acc.rcDiscount += curr.rcDiscountAmount * curr.quantity;
      acc.rcSales += rcSales;
      return acc;
    }, { otcList: 0, otcDiscount: 0, otcSales: 0, rcList: 0, rcDiscount: 0, rcSales: 0 });
  };

  const totals = calculateGrandTotals();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative">
      {/* Breadcrumbs & Header */}
      <div className="px-8 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="material-symbols-outlined text-sm">home</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>Quotations</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-bold text-slate-900 dark:text-white">QTN-2023-4412</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Quotation Configuration</h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex gap-8 shrink-0 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-primary' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`flex-1 overflow-y-auto ${activeTab === 'supplier' ? 'pb-40' : 'p-8 pb-40'}`}>
        {activeTab === 'quotation' && (
          <div className="space-y-8">
            {/* Top Functional Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-sm">science</span> Solution Enrichment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all">
                <span className="material-symbols-outlined text-sm">delete</span> Remove Selected
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-sm">file_download</span> Export Configuration
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all text-orange-600">
                <span className="material-symbols-outlined text-sm">stars</span> Select Promotion
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-sm">contract</span> MSA
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all text-primary">
                <span className="material-symbols-outlined text-sm">favorite</span> Add to Favorite
              </button>
            </div>

            {/* Main Configuration Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Action</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Item Name</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Qty</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Min Qty</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Contract Period</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC List</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Disc(%)</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Disc Amt</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Sales</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC List</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Disc(%)</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Disc Amt</th>
                      <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {offersData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500" title="Configure">
                              <span className="material-symbols-outlined text-base">settings</span>
                            </button>
                            <div className="relative group">
                              <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500">
                                <span className="material-symbols-outlined text-base">more_horiz</span>
                              </button>
                              <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl hidden group-hover:block z-20">
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700">Clone Offer</button>
                                <button className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700">Add-on</button>
                                <button className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-500 dark:hover:bg-red-900/20">Remove</button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{item.offer.name}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">{item.minQuantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.contractPeriod}</td>
                        <td className="px-4 py-3">${item.offer.otc.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            className="w-16 h-7 text-xs p-1 border border-slate-200 dark:border-slate-700 rounded dark:bg-slate-900 focus:ring-1 focus:ring-primary" 
                            value={item.otcDiscountPct} 
                            onChange={(e) => handlePctChange(idx, 'otc', e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-3">${item.otcDiscountAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 font-bold">${(item.offer.otc - item.otcDiscountAmount).toFixed(2)}</td>
                        <td className="px-4 py-3">${item.offer.rc.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            className="w-16 h-7 text-xs p-1 border border-slate-200 dark:border-slate-700 rounded dark:bg-slate-900 focus:ring-1 focus:ring-primary" 
                            value={item.rcDiscountPct} 
                            onChange={(e) => handlePctChange(idx, 'rc', e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-3">${item.rcDiscountAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 font-bold">${(item.offer.rc - item.rcDiscountAmount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary View Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span> Summary View
              </h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Item Name</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Qty</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Total List</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Total Disc</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Total Sales</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">OTC Margin</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Total List</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Total Disc</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Total Sales</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">RC Margin</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Total Discount</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Total Sales</th>
                        <th className="px-4 py-3 font-bold border-b dark:border-slate-700">Total Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {offersData.map((item, idx) => {
                        const otcTotalList = item.offer.otc * item.quantity;
                        const otcTotalDisc = item.otcDiscountAmount * item.quantity;
                        const otcTotalSales = otcTotalList - otcTotalDisc;
                        const rcTotalList = item.offer.rc * item.quantity;
                        const rcTotalDisc = item.rcDiscountAmount * item.quantity;
                        const rcTotalSales = rcTotalList - rcTotalDisc;
                        return (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium">{item.offer.name}</td>
                            <td className="px-4 py-3">{item.quantity}</td>
                            <td className="px-4 py-3">${otcTotalList.toFixed(2)}</td>
                            <td className="px-4 py-3 text-red-500">-${otcTotalDisc.toFixed(2)}</td>
                            <td className="px-4 py-3 font-bold">${otcTotalSales.toFixed(2)}</td>
                            <td className="px-4 py-3 text-emerald-600 font-bold">12.5%</td>
                            <td className="px-4 py-3">${rcTotalList.toFixed(2)}</td>
                            <td className="px-4 py-3 text-red-500">-${rcTotalDisc.toFixed(2)}</td>
                            <td className="px-4 py-3 font-bold">${rcTotalSales.toFixed(2)}</td>
                            <td className="px-4 py-3 text-emerald-600 font-bold">18.2%</td>
                            <td className="px-4 py-3 text-red-500">-${(otcTotalDisc + rcTotalDisc).toFixed(2)}</td>
                            <td className="px-4 py-3 font-black text-primary">${(otcTotalSales + rcTotalSales).toFixed(2)}</td>
                            <td className="px-4 py-3 text-emerald-600 font-black">15.4%</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-slate-50 dark:bg-slate-700/50 font-black">
                        <td className="px-4 py-4" colSpan={2}>Grand Total</td>
                        <td className="px-4 py-4">${totals.otcList.toFixed(2)}</td>
                        <td className="px-4 py-4 text-red-500">-${totals.otcDiscount.toFixed(2)}</td>
                        <td className="px-4 py-4">${totals.otcSales.toFixed(2)}</td>
                        <td className="px-4 py-4 text-emerald-600">--</td>
                        <td className="px-4 py-4">${totals.rcList.toFixed(2)}</td>
                        <td className="px-4 py-4 text-red-500">-${totals.rcDiscount.toFixed(2)}</td>
                        <td className="px-4 py-4">${totals.rcSales.toFixed(2)}</td>
                        <td className="px-4 py-4 text-emerald-600">--</td>
                        <td className="px-4 py-4 text-red-500">-${(totals.otcDiscount + totals.rcDiscount).toFixed(2)}</td>
                        <td className="px-4 py-4 text-primary text-base">${(totals.otcSales + totals.rcSales).toFixed(2)}</td>
                        <td className="px-4 py-4 text-emerald-600 text-base">16.8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pnl' && (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-300">bar_chart</span>
            <h3 className="text-xl font-bold">P&L Analysis Dashboard</h3>
            <p className="text-slate-500 max-w-md mx-auto">Detailed financial breakdown including direct costs, overheads, and project profitability indicators.</p>
          </div>
        )}

        {activeTab === 'tc' && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Standard Terms & Conditions</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold mb-1">Contract Auto-Renewal</p>
                <p className="text-xs text-slate-500">This agreement will automatically renew for successive 12-month periods unless notice is given 30 days prior.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-sm font-bold mb-1">SLA Guarantee</p>
                <p className="text-xs text-slate-500">Uptime guarantee of 99.99% as per the standard service level agreement included in the MSA.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Milestone Payment Plan</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-2 border-b">Phase</th>
                    <th className="px-4 py-2 border-b">Percentage</th>
                    <th className="px-4 py-2 border-b">Amount</th>
                    <th className="px-4 py-2 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border-b">Initial Deployment</td>
                    <td className="px-4 py-3 border-b">40%</td>
                    <td className="px-4 py-3 border-b">${(totals.otcSales * 0.4).toFixed(2)}</td>
                    <td className="px-4 py-3 border-b"><span className="text-orange-500 font-bold">Pending</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Final Acceptance</td>
                    <td className="px-4 py-3">60%</td>
                    <td className="px-4 py-3">${(totals.otcSales * 0.6).toFixed(2)}</td>
                    <td className="px-4 py-3"><span className="text-orange-500 font-bold">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attachment' && (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div className="size-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-slate-500">upload_file</span>
            </div>
            <h3 className="text-lg font-bold">Quotation Attachments</h3>
            <p className="text-sm text-slate-500 mb-6">Upload solution designs, technical specs, or custom legal addendums.</p>
            <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg text-sm">Upload Files</button>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary font-bold">JD</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">John Doe</p>
                <p className="text-xs text-slate-500">Lead Procurement Manager</p>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-center gap-4">
              <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold">JS</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Jane Smith</p>
                <p className="text-xs text-slate-500">Technical Solution Architect</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supplier' && (
          <div className="h-full">
            {supplierView === 'list' && (
              <RFQProcessingPage onNext={() => setSupplierView('selection')} />
            )}
            {supplierView === 'selection' && (
              <VendorSelectionViewPage 
                onBack={() => setSupplierView('list')} 
                onGoToApproval={() => setSupplierView('approval')}
              />
            )}
            {supplierView === 'approval' && (
              <VendorApprovalStatusPage 
                onBack={() => setSupplierView('selection')} 
                onGoToRFQ={() => setSupplierView('list')}
                onGoToSelection={() => setSupplierView('selection')}
                onSubmit={() => setSupplierView('submitted')}
              />
            )}
            {supplierView === 'submitted' && (
              <div className="max-w-[1000px] mx-auto flex flex-col h-full py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">VQS Request No: REQ-8492</h1>
                    <p className="text-slate-500 mt-1">Submission Confirmation</p>
                  </div>
                </div>

                <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                    <div 
                      onClick={() => setSupplierView('list')}
                      className="flex items-center text-primary group w-full md:w-auto cursor-pointer"
                    >
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white shrink-0 group-hover:bg-primary-dark transition-colors">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="ml-3 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap group-hover:underline underline-offset-4 decoration-dotted">RFQ Processing</span>
                      <div className="flex-1 md:hidden h-[2px] bg-primary ml-4"></div>
                    </div>
                    <div className="hidden md:block flex-1 h-[2px] bg-primary mx-4"></div>
                    <div 
                      onClick={() => setSupplierView('selection')}
                      className="flex items-center text-primary group w-full md:w-auto cursor-pointer"
                    >
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white shrink-0 group-hover:bg-primary-dark transition-colors">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="ml-3 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap group-hover:underline underline-offset-4 decoration-dotted">Vendor Selection</span>
                      <div className="flex-1 md:hidden h-[2px] bg-primary ml-4"></div>
                    </div>
                    <div className="hidden md:block flex-1 h-[2px] bg-primary mx-4"></div>
                    <div 
                      onClick={() => setSupplierView('approval')}
                      className="flex items-center text-primary group w-full md:w-auto cursor-pointer"
                    >
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white shrink-0 group-hover:bg-primary-dark transition-colors">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="ml-3 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap group-hover:underline underline-offset-4 decoration-dotted">Vendor Approval</span>
                      <div className="flex-1 md:hidden h-[2px] bg-primary ml-4"></div>
                    </div>
                    <div className="hidden md:block flex-1 h-[2px] bg-primary mx-4"></div>
                    <div className="flex items-center group w-full md:w-auto">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <span className="ml-3 text-sm font-bold text-primary whitespace-nowrap">Submitted</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800 rounded-xl p-5 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sky-700 dark:text-sky-400">description</span>
                      <h3 className="text-base font-bold text-sky-900 dark:text-sky-100">RFQ Summary</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <a className="text-sm font-bold text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center gap-1" href="#">
                        View Details
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </a>
                      <button className="text-sky-700 dark:text-sky-400 transition-colors">
                        <span className="material-symbols-outlined">expand_less</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wide mb-1">RFQ Number</p>
                      <p className="font-medium text-sky-900 dark:text-sky-100">REQ-8492</p>
                    </div>
                    <div>
                      <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wide mb-1">Created Date</p>
                      <p className="font-medium text-sky-900 dark:text-sky-100">Oct 24, 2023</p>
                    </div>
                    <div>
                      <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wide mb-1">Created By</p>
                      <p className="font-medium text-sky-900 dark:text-sky-100">Alexander Smith</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center pb-8">
                  <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 md:p-12 text-center">
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-6 inline-flex p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: '64px', fontWeight: '300' }}>check_circle</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Vendor award has been successfully submitted</h2>
                      <div className="space-y-1 text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10">
                        <p>Approved vendor awards have been applied to the selected offers.</p>
                        <p>Notifications have been triggered to relevant stakeholders.</p>
                        <p>Partner offer pricing will be updated in the quotation automatically.</p>
                      </div>
                    </div>
                    
                    <div className="w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 text-left">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Offer Name</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Awarded Vendor</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Approved Price (S$)</th>
                              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Related Quotation No</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Enterprise Fiber Broadband 10Gbps</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                  <span className="material-symbols-outlined text-slate-500 text-[20px]">domain</span>
                                  TechSolutions Global Inc.
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">$ 145,000.00</td>
                              <td className="px-6 py-4">
                                <a className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1" href="#">
                                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                  QT-2024-9928
                                </a>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Secure Cloud Gateway License</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                  <span className="material-symbols-outlined text-slate-500 text-[20px]">domain</span>
                                  CyberGuard Systems
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">$ 28,450.00</td>
                              <td className="px-6 py-4">
                                <a className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1" href="#">
                                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                  QT-2024-9928
                                </a>
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Managed IT Services (Annual)</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                  <span className="material-symbols-outlined text-slate-500 text-[20px]">domain</span>
                                  NextGen MSP Corp.
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">$ 62,000.00</td>
                              <td className="px-6 py-4">
                                <a className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1" href="#">
                                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                  QT-2024-9929
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-10 flex flex-col items-center gap-4">
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                        This action is final. You may navigate away from this page safely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Action Footer */}
      <footer className="fixed bottom-0 right-0 left-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium text-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Exit Configuration
        </button>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Save Draft
          </button>
          <button className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2">
            Submit Quotation
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default QuotationPage;
