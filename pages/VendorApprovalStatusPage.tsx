
import React, { useState } from 'react';

interface VendorApprovalStatusPageProps {
  onBack: () => void;
  onGoToRFQ?: () => void;
  onGoToSelection?: () => void;
  onSubmit?: () => void;
}

const VendorApprovalStatusPage: React.FC<VendorApprovalStatusPageProps> = ({ onBack, onGoToRFQ, onGoToSelection, onSubmit }) => {
  const [isRequoteModalOpen, setIsRequoteModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0, 1, 2]));

  // Global Revision Data
  const [globalRevisionData, setGlobalRevisionData] = useState({
    reason: 'Technical clarification',
    dueDate: '2023-11-24',
    scope: ['Price'],
    comments: ''
  });

  // Sub-modal state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskRevisionData, setTaskRevisionData] = useState({
    reason: '',
    dueDate: '',
    scope: [] as string[],
    comments: ''
  });

  const handleOpenSubModal = (task: any) => {
    setEditingTask(task);
    setTaskRevisionData({
      reason: globalRevisionData.reason,
      dueDate: globalRevisionData.dueDate,
      scope: [...globalRevisionData.scope],
      comments: globalRevisionData.comments
    });
    setIsSubModalOpen(true);
  };

  const toggleRow = (idx: number) => {
    const next = new Set(expandedRows);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setExpandedRows(next);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#0d141b] dark:text-white overflow-x-hidden min-h-screen flex flex-col relative">
      <main className="flex-1 flex flex-col items-center w-full pb-24">
        <div className="w-full max-w-[1200px] px-4 md:px-8 py-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#0d141b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Vendor Approval Status</h1>
              <p className="text-[#4c739a] dark:text-slate-400 text-sm font-normal leading-normal">Here you can view the approval results for vendor award.</p>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-[#e7edf3] dark:border-slate-700 shadow-sm p-6 overflow-x-auto">
            <div className="min-w-[600px] flex items-center justify-between">
              <div 
                onClick={onGoToRFQ}
                className="flex flex-col items-center gap-2 relative z-10 group min-w-[120px] cursor-pointer"
              >
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-primary-dark transition-colors shadow-sm">
                  <span className="material-symbols-outlined !text-[18px] font-bold">check</span>
                </div>
                <span className="text-sm font-bold text-primary group-hover:underline underline-offset-4 decoration-dotted">RFQ Processing</span>
              </div>
              <div className="h-[2px] flex-1 bg-primary -mx-4 mb-6"></div>
              <div 
                onClick={onGoToSelection}
                className="flex flex-col items-center gap-2 relative z-10 group min-w-[120px] cursor-pointer"
              >
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-primary-dark transition-colors shadow-sm">
                  <span className="material-symbols-outlined !text-[18px] font-bold">check</span>
                </div>
                <span className="text-sm font-bold text-primary group-hover:underline underline-offset-4 decoration-dotted">Vendor Selection</span>
              </div>
              <div className="h-[2px] flex-1 bg-primary -mx-4 mb-6"></div>
              <div className="flex flex-col items-center gap-2 relative z-10 group min-w-[120px]">
                <div className="size-8 rounded-full bg-white dark:bg-slate-700 border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_0_4px_rgba(19,127,236,0.1)]">
                  <span className="material-symbols-outlined !text-[18px] animate-spin">sync</span>
                </div>
                <span className="text-sm font-bold text-primary">Vendor Approval</span>
              </div>
              <div className="h-[2px] flex-1 bg-[#e7edf3] dark:bg-slate-700 -mx-4 mb-6"></div>
              <div className="flex flex-col items-center gap-2 relative z-10 group min-w-[120px]">
                <div className="size-8 rounded-full bg-[#f0f4f8] dark:bg-slate-900 border border-[#cfdbe7] dark:border-slate-600 flex items-center justify-center text-[#94a3b8]">
                  <span className="text-xs font-bold">4</span>
                </div>
                <span className="text-sm font-medium text-[#94a3b8]">Submitted</span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <details className="group flex flex-col rounded-xl border border-[#cfdbe7] dark:border-slate-700 bg-primary/5 dark:bg-primary/10 overflow-hidden transition-all" open>
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 select-none hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-[#0d141b] dark:text-white text-sm font-bold leading-normal">Parent Task Overview (RFQ Summary)</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white dark:bg-slate-700 border border-[#cfdbe7] dark:border-slate-600 text-[#137fec] text-xs font-bold shadow-sm hover:bg-white/80 transition-colors">
                    <span>View Details</span>
                    <span className="material-symbols-outlined !text-[16px]">visibility</span>
                  </button>
                  <div className="text-[#4c739a] dark:text-slate-400 transition-transform duration-300 group-open:rotate-180 flex items-center">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </summary>
              <div className="px-4 pb-4 pt-0 border-t border-[#cfdbe7]/50 dark:border-slate-700 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#4c739a] dark:text-slate-400 uppercase tracking-wide">RFQ Number</span>
                    <span className="text-sm font-medium text-[#0d141b] dark:text-white">RFQ-2023-001</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#4c739a] dark:text-slate-400 uppercase tracking-wide">Task ID</span>
                    <span className="text-sm font-medium text-[#0d141b] dark:text-white">T-99281</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#4c739a] dark:text-slate-400 uppercase tracking-wide">Created By</span>
                    <span className="text-sm font-medium text-[#0d141b] dark:text-white">John Doe (Procurement)</span>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-[#e7edf3] dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e7edf3] dark:border-slate-700">
              <h3 className="text-[#0d141b] dark:text-white text-lg font-bold">Vendor Approval Status</h3>
            </div>
            <div className="w-full bg-red-50 dark:bg-red-900/10 border-y border-red-100 dark:border-red-900/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <span className="material-symbols-outlined">cancel</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-red-800 dark:text-red-400">Rejected</span>
                    <span className="text-xs font-medium text-red-600 dark:text-red-300 px-2 py-0.5 bg-red-100 dark:bg-red-900/40 rounded-full">Action Required</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400/80">Vendor selection has been rejected. Please review the comments and initiate a re-quote or update selection.</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <button 
                  onClick={() => setIsRequoteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm font-bold shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1"
                >
                  <span className="material-symbols-outlined !text-[18px]">replay</span>
                  Re-quote
                </button>
                <span className="text-xs font-medium text-red-700/80 dark:text-red-400/60">Rejected: Oct 26, 2023, 02:15 PM</span>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-800">
              <h4 className="text-sm font-bold text-[#0d141b] dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4c739a] !text-[18px]">receipt_long</span>
                Approval Object Information
              </h4>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 py-2 border-b border-[#e7edf3] dark:border-slate-700">
                    <span className="material-symbols-outlined text-[#4c739a]">domain</span>
                    <span className="text-sm font-bold text-[#0d141b] dark:text-white">Site: Singapore HQ (SIN-HQ-01)</span>
                  </div>
                  <div className="border border-[#e7edf3] dark:border-slate-700 rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 border-b border-[#e7edf3] dark:border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#0d141b] dark:text-white">IT Infrastructure Upgrade</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-slate-600 text-[#4c739a] dark:text-slate-300 text-[11px] font-bold uppercase">Qty: 1</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-slate-600 text-[#4c739a] dark:text-slate-300 text-[11px] font-bold uppercase">Term: 12 Months</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#4c739a] dark:text-slate-400 font-medium">ID: OFF-9921</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white dark:bg-slate-800 border-b border-[#e7edf3] dark:border-slate-700 text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase tracking-wide">
                            <th className="px-4 py-3 text-center whitespace-nowrap w-12">Award</th>
                            <th className="px-4 py-3 whitespace-nowrap">Quote ID</th>
                            <th className="px-4 py-3 whitespace-nowrap">Specs</th>
                            <th className="px-4 py-3 whitespace-nowrap">Category</th>
                            <th className="px-4 py-3 whitespace-nowrap">Vendor Name</th>
                            <th className="px-4 py-3 whitespace-nowrap">Type</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">OTC Cost</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">RC Cost</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">Total</th>
                            <th className="px-4 py-3 whitespace-nowrap">Valid Till</th>
                            <th className="px-4 py-3 whitespace-nowrap">Status</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">Flags</th>
                            <th className="px-4 py-3 whitespace-nowrap">No-Bid Reason</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-[#0d141b] dark:text-slate-200">
                          <tr className="hover:bg-red-50/50 dark:hover:bg-red-900/10 bg-red-50/40 dark:bg-red-900/5">
                            <td className="px-4 py-3 text-center">
                              <div className="size-5 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined !text-[14px] font-bold">close</span>
                              </div>
                            </td>
                            <td className="px-4 py-3"><a className="text-primary hover:underline font-medium" href="#">Q-2023-001</a></td>
                            <td className="px-4 py-3 text-xs text-[#4c739a]">Standard Enterprise</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase border border-blue-100 dark:border-blue-900/50">Hardware</span>
                            </td>
                            <td className="px-4 py-3 font-medium">TechGlobal Solutions</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase rounded">Preferred</span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium">S$ 120,000</td>
                            <td className="px-4 py-3 text-right text-[#4c739a]">-</td>
                            <td className="px-4 py-3 text-right font-bold">S$ 120,000</td>
                            <td className="px-4 py-3 text-[#4c739a]">Dec 31, 2023</td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">Quoted</span>
                            </td>
                            <td className="px-4 py-3 text-center text-[#94a3b8]">-</td>
                            <td className="px-4 py-3 text-[#94a3b8]">-</td>
                          </tr>
                          <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 border-t border-gray-100 dark:border-slate-700">
                            <td className="px-4 py-3 text-center"></td>
                            <td className="px-4 py-3"><a className="text-primary hover:underline font-medium" href="#">Q-2023-002</a></td>
                            <td className="px-4 py-3 text-xs text-[#4c739a]">Premium Support</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase border border-blue-100 dark:border-blue-900/50">Hardware</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-600 dark:text-slate-400">Alpha Networks Inc.</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase rounded">Approved</span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-600 dark:text-slate-400">S$ 135,000</td>
                            <td className="px-4 py-3 text-right text-[#4c739a]">-</td>
                            <td className="px-4 py-3 text-right font-bold text-gray-600 dark:text-slate-400">S$ 135,000</td>
                            <td className="px-4 py-3 text-[#4c739a]">Dec 31, 2023</td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">Quoted</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-[10px] font-bold rounded uppercase">Re-quote</span>
                            </td>
                            <td className="px-4 py-3 text-[#94a3b8]">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-[#fcfdfd] dark:bg-slate-800/50 border-t border-[#e7edf3] dark:border-slate-700 p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-3 border-r border-[#e7edf3] dark:border-slate-700 pr-8 last:border-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-[#4c739a]">Initial Price (S$)</span>
                            <span className="text-sm font-medium text-[#0d141b] dark:text-white">S$ 135,000.00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-[#4c739a]">Final Price (S$)</span>
                            <span className="text-sm font-bold text-[#0d141b] dark:text-white">S$ 120,000.00</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#e7edf3] dark:border-slate-700">
                            <span className="text-xs font-medium text-[#4c739a]">Final Saving (S$)</span>
                            <span className="text-sm font-bold text-green-600">S$ -15,000.00 (11%)</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 border-r border-[#e7edf3] dark:border-slate-700 pr-8 last:border-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[#4c739a] uppercase tracking-wider">Reason for Selection</span>
                            <p className="text-xs text-[#0d141b] dark:text-slate-300 leading-relaxed">TechGlobal provided the best overall value with a significant discount on bulk purchase. Compliance checks passed and lead time is shortest.</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[#4c739a] uppercase tracking-wider">Other Reasons / Comments</span>
                            <p className="text-xs text-[#64748b] dark:text-slate-500 italic">Vendor agreed to extended warranty at no extra cost for the first 24 months.</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-medium text-[#4c739a] uppercase tracking-wider">Attachments</span>
                          <div className="flex flex-col gap-2">
                            <a className="flex items-center gap-2 text-xs text-primary font-medium hover:underline p-2 bg-white dark:bg-slate-700 border border-[#e7edf3] dark:border-slate-600 rounded" href="#">
                              <span className="material-symbols-outlined !text-[16px]">description</span>
                              Quote_Analysis_Report.pdf
                            </a>
                            <a className="flex items-center gap-2 text-xs text-primary font-medium hover:underline p-2 bg-white dark:bg-slate-700 border border-[#e7edf3] dark:border-slate-600 rounded" href="#">
                              <span className="material-symbols-outlined !text-[16px]">attachment</span>
                              Compliance_Checklist.xlsx
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 py-2 border-b border-[#e7edf3] dark:border-slate-700">
                    <span className="material-symbols-outlined text-[#4c739a]">public</span>
                    <span className="text-sm font-bold text-[#0d141b] dark:text-white">Non-Site Specific</span>
                  </div>
                  <div className="border border-[#e7edf3] dark:border-slate-700 rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 border-b border-[#e7edf3] dark:border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#0d141b] dark:text-white">Cloud Maintenance Service</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-slate-600 text-[#4c739a] dark:text-slate-300 text-[11px] font-bold uppercase">Qty: 1</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-slate-600 text-[#4c739a] dark:text-slate-300 text-[11px] font-bold uppercase">Term: 36 Months</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#4c739a] dark:text-slate-400 font-medium">ID: OFF-9922</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white dark:bg-slate-800 border-b border-[#e7edf3] dark:border-slate-700 text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase tracking-wide">
                            <th className="px-4 py-3 text-center whitespace-nowrap w-12">Award</th>
                            <th className="px-4 py-3 whitespace-nowrap">Quote ID</th>
                            <th className="px-4 py-3 whitespace-nowrap">Specs</th>
                            <th className="px-4 py-3 whitespace-nowrap">Category</th>
                            <th className="px-4 py-3 whitespace-nowrap">Vendor Name</th>
                            <th className="px-4 py-3 whitespace-nowrap">Type</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">OTC Cost</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">RC Cost</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap">Total</th>
                            <th className="px-4 py-3 whitespace-nowrap">Valid Till</th>
                            <th className="px-4 py-3 whitespace-nowrap">Status</th>
                            <th className="px-4 py-3 text-center whitespace-nowrap">Flags</th>
                            <th className="px-4 py-3 whitespace-nowrap">No-Bid Reason</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-[#0d141b] dark:text-slate-200">
                          <tr className="hover:bg-red-50/50 dark:hover:bg-red-900/10 bg-red-50/40 dark:bg-red-900/5">
                            <td className="px-4 py-3 text-center">
                              <div className="size-5 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined !text-[14px] font-bold">close</span>
                              </div>
                            </td>
                            <td className="px-4 py-3"><a className="text-primary hover:underline font-medium" href="#">Q-2023-088</a></td>
                            <td className="px-4 py-3 text-xs text-[#4c739a]">Managed 24/7</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase border border-purple-100 dark:border-purple-900/50">Service</span>
                            </td>
                            <td className="px-4 py-3 font-medium">CloudMaster Inc.</td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase rounded">Preferred</span></td>
                            <td className="px-4 py-3 text-right font-medium">S$ 4,500</td>
                            <td className="px-4 py-3 text-right text-[#4c739a]">S$ 500/mo</td>
                            <td className="px-4 py-3 text-right font-bold">S$ 10,500</td>
                            <td className="px-4 py-3 text-[#4c739a]">Dec 31, 2023</td>
                            <td className="px-4 py-3"><span className="text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">Quoted</span></td>
                            <td className="px-4 py-3 text-center text-[#94a3b8]">-</td>
                            <td className="px-4 py-3 text-[#94a3b8]">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-[#fcfdfd] dark:bg-slate-800/50 border-t border-[#e7edf3] dark:border-slate-700 p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-3 border-r border-[#e7edf3] dark:border-slate-700 pr-8 last:border-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-[#4c739a]">Initial Price (S$)</span>
                            <span className="text-sm font-medium text-[#0d141b] dark:text-white">S$ 11,000.00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-[#4c739a]">Final Price (S$)</span>
                            <span className="text-sm font-bold text-[#0d141b] dark:text-white">S$ 10,500.00</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#e7edf3] dark:border-slate-700">
                            <span className="text-xs font-medium text-[#4c739a]">Final Saving (S$)</span>
                            <span className="text-sm font-bold text-green-600">S$ -500.00 (4.5%)</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 border-r border-[#e7edf3] dark:border-slate-700 pr-8 last:border-0">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[#4c739a] uppercase tracking-wider">Reason for Selection</span>
                            <p className="text-xs text-[#0d141b] dark:text-slate-300 leading-relaxed">Only vendor capable of meeting the strict SLA requirements for 99.99% uptime in this region.</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[#4c739a] uppercase tracking-wider">Other Reasons / Comments</span>
                            <p className="text-xs text-[#94a3b8] dark:text-slate-500 italic">No additional comments.</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-medium text-[#4c739a] uppercase tracking-wider">Attachments</span>
                          <div className="flex flex-col gap-2">
                            <span className="text-xs text-[#94a3b8] dark:text-slate-500 italic">No attachments provided</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#e7edf3] dark:bg-slate-700"></div>
            
            <div className="p-6">
              <h4 className="text-sm font-bold text-[#0d141b] dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4c739a] !text-[18px]">history</span>
                Process Timeline
              </h4>
              <div className="flex flex-col">
                <div className="grid grid-cols-[40px_1fr] gap-x-4">
                  <div className="flex flex-col items-center h-full">
                    <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-slate-800 shadow-sm">
                      <span className="material-symbols-outlined !text-[18px] font-bold">check</span>
                    </div>
                    <div className="w-[2px] bg-green-200 dark:bg-green-900/40 h-full min-h-[60px]"></div>
                  </div>
                  <div className="pb-8 pt-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-[#0d141b] dark:text-white">Procurement Approval</p>
                          <p className="text-xs text-[#4c739a] dark:text-slate-400">Approver: <span className="text-[#0d141b] dark:text-slate-200">Sarah Jenkins (Procurement Manager)</span></p>
                        </div>
                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-xs font-bold border border-green-100 dark:border-green-800">Approved</span>
                      </div>
                      <div className="bg-[#f6f7f8] dark:bg-slate-700/50 p-3 rounded-lg border border-[#e7edf3] dark:border-slate-700">
                        <p className="text-sm text-[#0d141b] dark:text-slate-300 italic">"Vendor compliance check passed. Costs are within budget range. Recommended for award."</p>
                      </div>
                      <p className="text-xs text-[#94a3b8] dark:text-slate-500">Oct 24, 2023, 11:15 AM</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[40px_1fr] gap-x-4">
                  <div className="flex flex-col items-center h-full">
                    <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-slate-800 shadow-sm">
                      <span className="material-symbols-outlined !text-[18px] font-bold">check</span>
                    </div>
                    <div className="w-[2px] bg-green-200 dark:bg-green-900/40 h-full min-h-[60px]"></div>
                  </div>
                  <div className="pb-8 pt-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-[#0d141b] dark:text-white">Finance Approval</p>
                          <p className="text-xs text-[#4c739a] dark:text-slate-400">Approver: <span className="text-[#0d141b] dark:text-slate-200">Michael Ross (Finance Manager)</span></p>
                        </div>
                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-xs font-bold border border-green-100 dark:border-green-800">Approved</span>
                      </div>
                      <div className="bg-[#f6f7f8] dark:bg-slate-700/50 p-3 rounded-lg border border-[#e7edf3] dark:border-slate-700">
                        <p className="text-sm text-[#0d141b] dark:text-slate-300 italic">"Budget allocation verified for Q4."</p>
                      </div>
                      <p className="text-xs text-[#94a3b8] dark:text-slate-500">Oct 25, 2023, 09:30 AM</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[40px_1fr] gap-x-4">
                  <div className="flex flex-col items-center h-full">
                    <div className="size-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-slate-800 shadow-sm">
                      <span className="material-symbols-outlined !text-[18px] font-bold">close</span>
                    </div>
                  </div>
                  <div className="pb-2 pt-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-[#0d141b] dark:text-white">Director Sign-off</p>
                          <p className="text-xs text-[#4c739a] dark:text-slate-400">Approver: <span className="text-[#0d141b] dark:text-slate-200">Elena Gilbert (Director)</span></p>
                        </div>
                        <span className="px-2 py-1 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded text-xs font-bold border border-red-100 dark:border-red-800">Rejected</span>
                      </div>
                      <p className="text-xs text-[#94a3b8] dark:text-slate-500">Oct 26, 2023, 02:15 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Added Operation Buttons below Process Timeline */}
              <div className="flex justify-between items-center pt-8 mt-6 border-t border-[#e7edf3] dark:border-slate-700">
                <button 
                  onClick={onGoToSelection}
                  className="flex items-center justify-center px-6 py-2.5 rounded-lg border border-[#cfdbe7] dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0d141b] dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                  Back to Selection View
                </button>
                <button 
                  onClick={onSubmit}
                  className="px-10 py-2.5 bg-primary text-white rounded-lg font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 shadow-primary/20 hover:bg-primary-dark"
                >
                  Submit
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-[#e7edf3] dark:border-slate-700 px-10 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#cfdbe7] dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0d141b] dark:text-white text-sm font-bold hover:bg-[#f6f7f8] dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cfdbe7]"
          >
            <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
            Back to Selection
          </button>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#cfdbe7] dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0d141b] dark:text-white text-sm font-bold hover:bg-[#f6f7f8] dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cfdbe7]">
              <span>View Approval Task</span>
              <span className="material-symbols-outlined !text-[18px]">open_in_new</span>
            </button>
            <button 
              onClick={onSubmit}
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold border border-transparent transition-all shadow-lg active:scale-95 shadow-primary/20"
            >
              <span>Submit</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Create Revision Modal */}
      {isRequoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 transition-opacity z-40" onClick={() => setIsRequoteModalOpen(false)}></div>
          <div className="relative w-full max-w-[1100px] max-h-[90vh] flex flex-col bg-white dark:bg-background-dark rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="flex-none px-8 py-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark z-10">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold leading-tight">Create Revision 2 – Duplicate & Edit Tasks</h2>
                  <p className="text-[#4c739a] dark:text-slate-400 text-sm font-normal leading-normal max-w-3xl">
                    A new revision will be created by duplicating all subtasks from the previous version. Review the tasks below and edit details where necessary, or add new vendor quote tasks.
                  </p>
                </div>
                <button onClick={() => setIsRequoteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#121c26] p-8">
              {/* Global Revision Info Card */}
              <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Global Revision Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Re-quote Reason</label>
                    <select 
                      value={globalRevisionData.reason}
                      onChange={(e) => setGlobalRevisionData({ ...globalRevisionData, reason: e.target.value })}
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm focus:border-primary focus:ring-primary h-10 px-3"
                    >
                      <option>Technical clarification</option>
                      <option>Price negotiation</option>
                      <option>Scope change</option>
                      <option>Validity expired</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quote Due Date</label>
                    <input 
                      type="date" 
                      value={globalRevisionData.dueDate}
                      onChange={(e) => setGlobalRevisionData({ ...globalRevisionData, dueDate: e.target.value })}
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm focus:border-primary focus:ring-primary h-10 px-3" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Change Scope</label>
                    <div className="flex flex-wrap gap-4 pt-1">
                      {['Price', 'Configuration', 'Delivery'].map((scope) => (
                        <label key={scope} className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox" 
                              className="peer sr-only" 
                              checked={globalRevisionData.scope.includes(scope)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setGlobalRevisionData(prev => ({ ...prev, scope: [...prev.scope, scope] }));
                                } else {
                                  setGlobalRevisionData(prev => ({ ...prev, scope: prev.scope.filter(s => s !== scope) }));
                                }
                              }}
                            />
                            <div className="size-5 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                            <span className="material-symbols-outlined absolute text-white text-[16px] scale-0 peer-checked:scale-100 transition-transform left-0.5">check</span>
                          </div>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{scope}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comments</label>
                    <textarea 
                      value={globalRevisionData.comments}
                      onChange={(e) => setGlobalRevisionData({ ...globalRevisionData, comments: e.target.value })}
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm focus:border-primary focus:ring-primary p-3 min-h-[80px]" 
                      placeholder="Specify details about the revision requirements..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Existing Vendor Quotes</h3>
                </div>
                <div className="rounded-lg border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-background-dark overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 border-b border-[#cfdbe7] dark:border-slate-700">
                        <th className="p-4 text-[#0d141b] dark:text-slate-200 text-xs uppercase tracking-wide font-semibold w-56">Vendor</th>
                        <th className="p-4 text-[#0d141b] dark:text-slate-200 text-xs uppercase tracking-wide font-semibold w-32">Type</th>
                        <th className="p-4 text-[#0d141b] dark:text-slate-200 text-xs uppercase tracking-wide font-semibold w-32">Status</th>
                        <th className="p-4 text-[#0d141b] dark:text-slate-200 text-xs uppercase tracking-wide font-semibold">OTC Cost</th>
                        <th className="p-4 text-[#0d141b] dark:text-slate-200 text-xs uppercase tracking-wide font-semibold">RC Cost</th>
                        <th className="p-4 text-[#0d141b] dark:text-slate-200 text-xs uppercase tracking-wide font-semibold text-right w-36"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#cfdbe7] dark:divide-slate-700">
                      {/* Row 1: Acme Corp */}
                      <tr className="bg-blue-50/30 dark:bg-primary/5">
                        <td className="p-4 text-[#0d141b] dark:text-white text-sm font-semibold">Acme Corp</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Preferred
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Quoted
                          </span>
                        </td>
                        <td className="p-4 text-[#4c739a] dark:text-slate-400 text-sm font-medium">$12,000</td>
                        <td className="p-4 text-[#4c739a] dark:text-slate-400 text-sm font-medium">$0</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleOpenSubModal({ name: 'Acme Corp', vendorId: 'VND-001' })}
                            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                        </td>
                      </tr>

                      {/* Row 2: Globex Inc */}
                      <tr className="bg-blue-50/30 dark:bg-primary/5">
                        <td className="p-4 text-[#0d141b] dark:text-white text-sm font-semibold">Globex Inc</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            Approved
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Quoted
                          </span>
                        </td>
                        <td className="p-4 text-[#4c739a] dark:text-slate-400 text-sm font-medium">$13,500</td>
                        <td className="p-4 text-[#4c739a] dark:text-slate-400 text-sm font-medium">$450 / mo</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleOpenSubModal({ name: 'Globex Inc', vendorId: 'VND-002' })}
                            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                        </td>
                      </tr>

                      {/* Row 3: Soylent Corp */}
                      <tr className="bg-blue-50/30 dark:bg-primary/5">
                        <td className="p-4 text-[#0d141b] dark:text-white text-sm font-semibold">Soylent Corp</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            Other
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Pending
                          </span>
                        </td>
                        <td className="p-4 text-[#4c739a] dark:text-slate-400 text-sm font-medium italic">-</td>
                        <td className="p-4 text-[#4c739a] dark:text-slate-400 text-sm font-medium italic">-</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleOpenSubModal({ name: 'Soylent Corp', vendorId: 'VND-003' })}
                            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 ml-auto"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Add New Quote Task</h3>
                  <p className="text-[#4c739a] dark:text-slate-400 text-sm font-normal">Add additional vendors to request new quotes in this revision.</p>
                </div>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <div className="text-center max-w-sm">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">playlist_add</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No new quote tasks added yet.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg border border-primary text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors text-sm font-bold leading-normal bg-white dark:bg-transparent">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Task
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-none px-8 py-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                <span className="material-symbols-outlined text-sm text-primary">info</span>
                <span>All tasks are automatically duplicated. Use the "Edit" action to modify specific requirements.</span>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setIsRequoteModalOpen(false)} className="flex-1 md:flex-none min-w-[100px] h-10 items-center justify-center rounded-lg px-4 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button onClick={() => setIsRequoteModalOpen(false)} className="flex-1 md:flex-none min-w-[140px] h-10 items-center justify-center rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-sm">
                  Create Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sub-modal for Task Re-quote */}
      {isSubModalOpen && editingTask && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6" role="dialog">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSubModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all flex flex-col max-h-[90vh] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-[#e7edf3] dark:border-slate-800 px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">published_with_changes</span>
                  Re-quote Request
                </h3>
                <p className="text-xs text-[#4c739a] mt-1">Vendor: {editingTask.name} ({editingTask.vendorId})</p>
              </div>
              <button onClick={() => setIsSubModalOpen(false)} className="flex size-10 items-center justify-center rounded-full text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Re-quote Reason <span className="text-red-500">*</span></label>
                  <select 
                    value={taskRevisionData.reason}
                    onChange={(e) => setTaskRevisionData({ ...taskRevisionData, reason: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-11 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>Technical clarification</option>
                    <option>Price negotiation</option>
                    <option>Scope change</option>
                    <option>Validity expired</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Quote Due Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={taskRevisionData.dueDate}
                    onChange={(e) => setTaskRevisionData({ ...taskRevisionData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-11 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Change Scope <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-6">
                    {['Price', 'Configuration', 'Delivery'].map((scope) => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={taskRevisionData.scope.includes(scope)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTaskRevisionData(prev => ({ ...prev, scope: [...prev.scope, scope] }));
                              } else {
                                setTaskRevisionData(prev => ({ ...prev, scope: prev.scope.filter(s => s !== scope) }));
                              }
                            }}
                          />
                          <div className="size-5 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                          <span className="material-symbols-outlined absolute text-white text-[16px] scale-0 peer-checked:scale-100 transition-transform left-0.5">check</span>
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Comments</label>
                  <textarea 
                    value={taskRevisionData.comments}
                    onChange={(e) => setTaskRevisionData({ ...taskRevisionData, comments: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 min-h-[100px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Enter additional details for the re-quote request..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex-none px-8 py-5 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10 flex items-center justify-end gap-3">
              <button onClick={() => setIsSubModalOpen(false)} className="px-6 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors">
                Cancel
              </button>
              <button onClick={() => setIsSubModalOpen(false)} className="px-8 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorApprovalStatusPage;
