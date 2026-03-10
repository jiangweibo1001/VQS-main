import React from 'react';

interface VendorSelectionViewPageProps {
  onBack: () => void;
  onGoToApproval?: () => void;
}

const VendorSelectionViewPage: React.FC<VendorSelectionViewPageProps> = ({ onBack, onGoToApproval }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-12">
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor Selection View</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">View the vendor award results here.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-8">
          <div className="w-full">
            <div className="relative flex items-center justify-between w-full">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
              <div 
                onClick={onBack}
                className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 px-2 z-10 cursor-pointer group"
              >
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-primary-dark transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <p className="text-sm font-bold text-primary group-hover:underline decoration-dotted underline-offset-4">RFQ Processing</p>
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary w-[33%] -z-0"></div>
              <div className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 px-2 z-10">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <p className="text-sm font-bold text-primary">Vendor Selection</p>
              </div>
              <div className="absolute left-[33%] top-1/2 -translate-y-1/2 h-1 bg-primary w-[33%] -z-0"></div>
              <div 
                onClick={onGoToApproval}
                className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 px-2 z-10 cursor-pointer group"
              >
                <div className="size-8 rounded-full bg-white dark:bg-slate-700 border-2 border-primary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4">Vendor Approval</p>
              </div>
              <div className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 px-2 z-10">
                <div className="size-8 rounded-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                  <span className="text-xs font-bold">4</span>
                </div>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Submitted</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Parent Task Overview</h1>
            <a className="text-primary text-sm font-semibold hover:underline flex items-center gap-1" href="#">
              View Details <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">RFQ Number</span>
              <span className="text-base font-semibold text-slate-900 dark:text-white">RFQ-2023-8842</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created By</span>
              <span className="text-base font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <div className="size-6 rounded-full bg-slate-200 bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCD1MMnaWbgakEwmp33vvQTdnc-76DdUlQFO5ozw7vEJD6g1zfl2_vYWTyBAfWh9d7PaIGVwbg_25Q7oBSuU0IbMTM2BDHYSiSCRyl4MFaqee74miLHq5DdKw1R3Wtf4lf5qfp-2x2mpW4hc8O70aGG_UpzZ6ne7UfPqdApelS9J9iJxIuCghPMCz5cxwuWGav7I0yOYfYC6SLfOKn9kQ61pv7JgjgPXiX1pvG_qOVPq4Z3s9FvrqjHHQDTSDc99alua5pEo9wDV7ny")' }}></div>
                John Doe
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created Date</span>
              <span className="text-base font-medium text-slate-900 dark:text-white">Oct 24, 2023</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quote Due Date</span>
              <span className="text-base font-medium text-slate-900 dark:text-white">Nov 01, 2023</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden transition-all duration-300" open>
            <summary className="flex cursor-pointer items-center justify-between gap-6 bg-slate-50 dark:bg-slate-700/50 px-6 py-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors list-none select-none border-b border-slate-200 dark:border-slate-700 group-open:border-b-slate-200">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-500">location_on</span>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">New York HQ</p>
                </div>
                <span className="hidden md:block text-slate-300 dark:text-slate-600">|</span>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">123 Broadway Avenue, NY 10001, USA</p>
              </div>
              <div className="text-slate-500 group-open:rotate-180 transition-transform duration-200 flex items-center justify-center">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </summary>
            <div className="p-6 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">router</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h3 className="text-slate-900 dark:text-white text-base font-bold">Primary Internet Access (DIA)</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-600">Qty: 1</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-600">Term: 36 Months</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-center w-[60px]">Award</th>
                          <th className="px-4 py-3 font-semibold">Task ID</th>
                          <th className="px-4 py-3 font-semibold">Bandwidth</th>
                          <th className="px-4 py-3 font-semibold">Access Type</th>
                          <th className="px-4 py-3 font-semibold">Interface</th>
                          <th className="px-4 py-3 font-semibold text-right">OTC Cost</th>
                          <th className="px-4 py-3 font-semibold text-right">RC Cost</th>
                          <th className="px-4 py-3 font-semibold text-right">Total</th>
                          <th className="px-4 py-3 font-semibold text-center">Valid Till</th>
                          <th className="px-4 py-3 font-semibold text-center">Status</th>
                          <th className="px-4 py-3 font-semibold text-center">Flags</th>
                          <th className="px-4 py-3 font-semibold text-center">No-Bid Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <tr className="bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center">
                              <span className="inline-flex items-center justify-center size-5 rounded-full bg-primary text-white shadow-sm">
                                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium"><a className="text-primary hover:underline" href="#">QT-8821-A</a></td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">10 Gbps</td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">Fiber</td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">10G-SFP+</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white">S$ 0.00</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white">S$ 1,200.00</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">S$ 43,200.00</td>
                          <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">Dec 31, 2023</td>
                          <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Quoted</span></td>
                          <td className="px-4 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                          <td className="px-4 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-4 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                          <td className="px-4 py-3 font-medium"><a className="text-primary hover:underline" href="#">QT-9920-B</a></td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">10 Gbps</td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">Fiber</td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400">10G-SFP+</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white">S$ 500.00</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white">S$ 1,350.00</td>
                          <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white">S$ 49,100.00</td>
                          <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">Dec 15, 2023</td>
                          <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Quoted</span></td>
                          <td className="px-4 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                          <td className="px-4 py-3 text-center text-slate-300 dark:text-slate-600">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700 border-t border-slate-200 dark:border-slate-700">
                    <div className="p-6 flex flex-col gap-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Initial Price (S$)</p>
                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">S$ 45,500.00</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Final Price (S$)</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">S$ 43,200.00</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold uppercase tracking-wider">Final Saving (S$)</p>
                        <p className="text-xl font-bold text-green-600">S$ -2,300.00</p>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold uppercase tracking-wider">Reason for Selection</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold">
                          Lowest Total Cost of Ownership (TCO)
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold uppercase tracking-wider">Other Reasons / Comments</p>
                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          Vendor offered waive on OTC charges if contract signed by end of month. Service Level Agreement (SLA) is superior with 99.99% uptime guarantee.
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-semibold uppercase tracking-wider">Attachments</p>
                      <div className="flex flex-col gap-2">
                        <a className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded hover:border-primary/50 group transition-colors" href="#">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-primary truncate max-w-[180px]">ATT_Quote_Analysis_v2.pdf</span>
                          </div>
                          <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-primary">download</span>
                        </a>
                        <a className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded hover:border-primary/50 group transition-colors" href="#">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">description</span>
                            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-primary truncate max-w-[180px]">Email_Correspondence_Log.docx</span>
                          </div>
                          <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-primary">download</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Action Buttons at bottom of task content */}
        <div className="flex justify-between items-center pt-8 mt-12 mb-20 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={onBack}
            className="flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
            Back to List
          </button>
          <button 
            onClick={onGoToApproval}
            className="px-8 py-2.5 bg-primary text-white rounded-lg font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 shadow-primary/20 hover:bg-primary-dark"
          >
            Next: Vendor Approval View
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSelectionViewPage;