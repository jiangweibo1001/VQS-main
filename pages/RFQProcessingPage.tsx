import React, { useState, useMemo } from 'react';

type TaskStatus = 'Issued' | 'Quoted' | 'Cancelled';

interface SubTaskVersion {
  version: string;
  status: TaskStatus;
  returnTime: string;
  sla: string;
  slaStatus: 'within' | 'timer' | 'overdue' | 'na';
  dueDate: string;
  remark: string;
  attachments: { name: string; type: string }[];
  sites: {
    name: string;
    address: string;
    offers: {
      name: string;
      qty: number;
      term: string;
      quotes: any[];
      status: 'Quoted' | 'Pending';
    }[];
  }[];
  timestamp: string;
  requoteReason?: string;
  changeScope?: string[];
  comments?: string;
}

interface VendorTask {
  id: string;
  name: string;
  vendorId: string;
  type: string;
  products: number;
  avatar: string;
  avatarColor: string;
  versions: SubTaskVersion[];
}

interface RFQProcessingPageProps {
  onNext?: () => void;
}

const INITIAL_VENDORS: VendorTask[] = [
  { 
    id: 'T-001', name: 'AT&T Wholesale', vendorId: 'VND-001', type: 'Preferred', products: 12, 
    avatar: 'AT', avatarColor: 'bg-blue-100 text-blue-700',
    versions: [
      { 
        version: 'V1', status: 'Cancelled', returnTime: 'Oct 25, 09:00 AM', sla: 'Within SLA', slaStatus: 'within',
        dueDate: '2023-11-10',
        remark: 'Initial quote request.',
        attachments: [],
        sites: [],
        timestamp: '2023-10-24 14:00 - 2023-10-25 10:00'
      },
      { 
        version: 'V2', status: 'Quoted', returnTime: 'Oct 25, 10:30 AM', sla: 'Within SLA', slaStatus: 'within',
        dueDate: '2023-11-15',
        remark: 'The quoted DIA service for both New York and Austin includes a promotional discount applied for the specified terms. Lead times are estimated in business days and subject to site survey.',
        attachments: [{ name: 'RFQ_Results.xlsx', type: 'System Generated' }],
        sites: [
          {
            name: 'NY Headquarters - 100 Park Ave',
            address: '100 Park Avenue, New York, NY 10017, USA',
            offers: [
              {
                name: 'Dedicated Internet Access (DIA)',
                qty: 1,
                term: '12 Months',
                status: 'Quoted',
                quotes: [
                  { bw: '500 Mbps', otc: '$350.00', rc: '$850.00', lead: '30', valid: '2023-12-31' },
                  { bw: '800 Mbps', otc: '$450.00', rc: '$1,050.00', lead: '45', valid: '2024-01-15' },
                  { bw: '1 Gbps', otc: '$500.00', rc: '$1,200.00', lead: '60', valid: '2023-12-15' }
                ]
              }
            ]
          }
        ],
        timestamp: '2023-10-25 10:00 - Present',
        requoteReason: 'Configuration Change',
        changeScope: ['Price', 'Configuration'],
        comments: 'Revised bandwidth requirements for NY office.'
      }
    ]
  },
  { 
    id: 'T-042', name: 'Verizon Partner', vendorId: 'VND-042', type: 'Approved', products: 8, 
    avatar: 'VZ', avatarColor: 'bg-red-100 text-red-700',
    versions: [{ 
      version: 'V1', status: 'Issued', returnTime: '--', sla: '2h 15m remaining', slaStatus: 'timer',
      dueDate: '2023-11-20',
      remark: 'Pending site survey for the new branch locations.',
      attachments: [],
      sites: [
        {
          name: 'Remote Office - Austin',
          address: '301 Congress Avenue, Austin, TX 78701, USA',
          offers: [
            { name: 'SIP Trunking - 20 Channels', qty: 1, term: '12 Months', status: 'Pending', quotes: [] }
          ]
        }
      ],
      timestamp: '2023-10-25 08:00 - Present'
    }]
  },
  { 
    id: 'T-088', name: 'T-Mobile Business', vendorId: 'VND-088', type: 'Others', products: 5, 
    avatar: 'TM', avatarColor: 'bg-pink-100 text-pink-700',
    versions: [{ 
      version: 'V1', status: 'Issued', returnTime: '--', sla: 'Overdue -45m', slaStatus: 'overdue',
      dueDate: '2023-11-18',
      remark: 'Awaiting internal approval for the proposed bandwidth upgrade.',
      attachments: [],
      sites: [],
      timestamp: '2023-10-24 16:00 - Present'
    }]
  },
  { 
    id: 'T-103', name: 'Orange Intl', vendorId: 'VND-103', type: 'Preferred', products: 20, 
    avatar: 'OI', avatarColor: 'bg-orange-100 text-orange-700',
    versions: [{ 
      version: 'V1', status: 'Quoted', returnTime: 'Oct 25, 09:15 AM', sla: 'Within SLA', slaStatus: 'within',
      dueDate: '2023-11-15',
      remark: 'Global connectivity quote for EMEA regions.',
      attachments: [{ name: 'Orange_Global_Quote.pdf', type: 'Vendor Upload' }],
      sites: [],
      timestamp: '2023-10-25 09:00 - Present'
    }]
  },
  { 
    id: 'T-256', name: 'BT Global', vendorId: 'VND-256', type: 'Approved', products: 10, 
    avatar: 'BT', avatarColor: 'bg-indigo-100 text-indigo-700',
    versions: [{ 
      version: 'V1', status: 'Cancelled', returnTime: '--', sla: 'N/A', slaStatus: 'na',
      dueDate: '2023-11-10',
      remark: 'Request cancelled due to change in project scope.',
      attachments: [],
      sites: [],
      timestamp: '2023-10-24 10:00 - 2023-10-24 15:00'
    }]
  },
];

const RFQProcessingPage: React.FC<RFQProcessingPageProps> = ({ onNext }) => {
  const [vendors, setVendors] = useState<VendorTask[]>(INITIAL_VENDORS);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [activeSubTaskId, setActiveSubTaskId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isSelectOfferModalOpen, setIsSelectOfferModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isCancelWarningOpen, setIsCancelWarningOpen] = useState(false);
  const [isRequoteModalOpen, setIsRequoteModalOpen] = useState(false);
  const [selectedTaskForRequote, setSelectedTaskForRequote] = useState<VendorTask | null>(null);
  const [requoteScopes, setRequoteScopes] = useState<string[]>(['Price']);
  const [requoteReason, setRequoteReason] = useState('Price Adjustment');
  const [requoteComments, setRequoteComments] = useState('');
  const [requoteDueDate, setRequoteDueDate] = useState('2023-11-20');

  const getSubTaskStatus = (versions: SubTaskVersion[]): TaskStatus => {
    if (versions.some(v => v.status === 'Quoted')) return 'Quoted';
    if (versions.some(v => v.status === 'Issued')) return 'Issued';
    return 'Cancelled';
  };

  // Quote progress calculation logic: Quoted count / Non-cancelled count
  const progressStats = useMemo(() => {
    const quotedCount = vendors.filter(v => getSubTaskStatus(v.versions) === 'Quoted').length;
    const nonCancelledCount = vendors.filter(v => getSubTaskStatus(v.versions) !== 'Cancelled').length;
    const percentage = nonCancelledCount > 0 ? Math.round((quotedCount / nonCancelledCount) * 100) : 0;
    return { quotedCount, nonCancelledCount, percentage };
  }, [vendors]);

  const handleAddSubTask = () => {
    setIsSelectOfferModalOpen(false);
    setIsCreationModalOpen(true);
  };

  const finalizeCreation = () => {
    const newId = `T-${Math.floor(Math.random() * 900) + 100}`;
    const newTask: VendorTask = {
      id: newId,
      name: 'New Provider Service',
      vendorId: `VND-${Math.floor(Math.random() * 900)}`,
      type: 'Other',
      products: 1,
      avatar: 'NP',
      avatarColor: 'bg-slate-100 text-slate-700',
      versions: [{ 
        version: 'V1', 
        status: 'Issued', 
        returnTime: '--', 
        sla: '24h remaining', 
        slaStatus: 'timer',
        dueDate: '2023-11-30',
        remark: '',
        attachments: [],
        sites: [],
        timestamp: `${new Date().toLocaleString()} - Present`
      }]
    };
    setVendors(prev => [...prev, newTask]);
    setIsCreationModalOpen(false);
  };

  const handleRequoteSubmit = (taskId: string) => {
    alert('A new version of this sub-task will be created.');
    
    setVendors(prev => {
      return prev.map(v => {
        if (v.id === taskId) {
          const nextVersionNumber = v.versions.length + 1;
          const lastVersion = v.versions[v.versions.length - 1];
          
          // Update previous versions to Cancelled
          const updatedVersions = v.versions.map(ver => ({
            ...ver,
            status: 'Cancelled' as TaskStatus,
            timestamp: ver.timestamp.includes('Present') 
              ? ver.timestamp.replace('Present', new Date().toLocaleString()) 
              : ver.timestamp
          }));

          const nextVersion: SubTaskVersion = {
            version: `V${nextVersionNumber}`,
            status: 'Issued',
            returnTime: '--',
            sla: '24h remaining',
            slaStatus: 'timer',
            dueDate: requoteDueDate,
            remark: '',
            attachments: [],
            sites: lastVersion.sites, // Copy sites from previous version
            timestamp: `${new Date().toLocaleString()} - Present`,
            requoteReason: requoteReason,
            changeScope: requoteScopes,
            comments: requoteComments
          };
          return {
            ...v,
            versions: [...updatedVersions, nextVersion]
          };
        }
        return v;
      });
    });
    
    setIsRequoteModalOpen(false);
    setSelectedTaskForRequote(null);
    setRequoteReason('Price Adjustment');
    setRequoteComments('');
    setRequoteScopes(['Price']);
    setRequoteDueDate('2023-11-20');
  };

  const canProceed = vendors.some(v => getSubTaskStatus(v.versions) === 'Quoted');

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-full pb-20">
      <div className="px-6 py-6 lg:px-12 xl:px-24 max-w-[1600px] mx-auto w-full">
        {/* Title */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[#0d141b] dark:text-white text-3xl font-extrabold leading-tight tracking-tight mb-2">RFQ Processing</h1>
            <p className="text-[#4c739a] dark:text-slate-400 text-base">Manage vendor responses and track SLA compliance for this request.</p>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="w-full bg-white dark:bg-slate-800 rounded-xl border border-[#e7edf3] dark:border-slate-700 shadow-sm p-8 mb-6">
          <div className="flex justify-center w-full">
            <div className="max-w-4xl w-full">
              <div className="relative flex items-center justify-between w-full">
                <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-[#e7edf3] dark:bg-slate-700 -z-0 rounded"></div>
                <div className="flex flex-col items-center gap-2 relative z-10 group cursor-default">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white ring-4 ring-white dark:ring-slate-800 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">sync</span>
                  </div>
                  <div className="absolute top-10 w-40 text-center">
                    <p className="text-primary text-sm font-bold">RFQ Processing</p>
                    <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">Waiting for quotes</p>
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="flex size-8 items-center justify-center rounded-full bg-white dark:bg-slate-700 border-2 border-[#cfdbe7] dark:border-slate-600 text-[#9ca3af] ring-4 ring-white dark:ring-slate-800">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="absolute top-10 w-32 text-center hidden sm:block"><p className="text-[#9ca3af] text-sm font-medium">Vendor Selection</p></div>
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="flex size-8 items-center justify-center rounded-full bg-white dark:bg-slate-700 border-2 border-[#cfdbe7] dark:border-slate-600 text-[#9ca3af] ring-4 ring-white dark:ring-slate-800">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="absolute top-10 w-32 text-center hidden sm:block"><p className="text-[#9ca3af] text-sm font-medium">Vendor Approval</p></div>
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="flex size-8 items-center justify-center rounded-full bg-white dark:bg-slate-700 border-2 border-[#cfdbe7] dark:border-slate-600 text-[#9ca3af] ring-4 ring-white dark:ring-slate-800">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div className="absolute top-10 w-32 text-center hidden sm:block"><p className="text-[#9ca3af] text-sm font-medium">Submitted</p></div>
                </div>
              </div>
              <div className="h-12"></div>
            </div>
          </div>
        </div>

        {/* Info Card & Progress Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-[#e7edf3] dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 pb-4 flex flex-col md:flex-row justify-between items-start">
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#4c739a] uppercase tracking-wider mb-1">RFQ Number</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[#0d141b] dark:text-white text-lg font-bold">#2023-8492</span>
                    <span className="material-symbols-outlined text-[#4c739a] text-[16px] cursor-pointer hover:text-primary transition-colors" title="Copy">content_copy</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#4c739a] uppercase tracking-wider mb-1">Created By</p>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">JD</div>
                    <span className="text-[#0d141b] dark:text-white text-base font-medium">John Doe</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#4c739a] uppercase tracking-wider mb-1">Created Date</p>
                  <span className="text-[#0d141b] dark:text-white text-base font-medium">Oct 24, 2023</span>
                </div>
              </div>
              <button 
                onClick={() => setIsParentModalOpen(true)}
                className="mt-4 md:mt-0 flex items-center gap-1 text-primary text-sm font-bold hover:underline transition-colors"
              >
                View Details
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
            <div className="px-6 pb-6 pt-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-[#e7edf3] dark:border-slate-700 p-5 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-[#0d141b] dark:text-white font-bold text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">donut_large</span>
                    Vendor Quote Progress
                  </h3>
                  <p className="text-[#4c739a] dark:text-slate-400 text-xs mt-1 pl-7">Tracking responses for this specific task.</p>
                </div>
                <div className="w-full md:w-96">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-medium text-[#4c739a] dark:text-slate-400">{progressStats.quotedCount} of {progressStats.nonCancelledCount} vendors responded</p>
                    <span className="text-lg font-bold text-primary">{progressStats.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${progressStats.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task List Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#e7edf3] dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-[#e7edf3] dark:border-slate-700 gap-4 bg-gray-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <h3 className="text-[#0d141b] dark:text-white text-lg font-bold">Vendor RFQ Task List</h3>
              <button 
                onClick={() => setIsSelectOfferModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-[#cfdbe7] dark:border-slate-600 hover:border-primary hover:text-primary text-[#0d141b] dark:text-white text-xs font-bold rounded-lg transition-all shadow-sm ml-2"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select 
                  className="appearance-none h-9 pl-3 pr-9 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-primary/20 transition-all"
                  defaultValue="V1"
                >
                  <option value="V1" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Version: V1</option>
                  <option value="V2" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Version: V2</option>
                  <option value="V3" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Version: V3</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" style={{ fontSize: '18px' }}>expand_more</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-[#e7edf3] dark:border-slate-700">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">Vendor Name</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">Type</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a] text-center">Products</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">Return Time</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a]">SLA / TAT</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#4c739a] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-700">
                {vendors.map((v, i) => {
                  const status = getSubTaskStatus(v.versions);
                  const latestVersion = v.versions[v.versions.length - 1];
                  
                  return (
                    <tr key={v.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${latestVersion.slaStatus === 'overdue' ? 'bg-red-50/30 dark:bg-red-900/10' : ''} ${status === 'Cancelled' ? 'opacity-60' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded flex items-center justify-center font-bold text-xs ${v.avatarColor}`}>{v.avatar}</div>
                          <div>
                            <p className="text-sm font-bold text-[#0d141b] dark:text-white">{v.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-[#4c739a]">ID: {v.vendorId}</p>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                {latestVersion.version}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${v.type === 'Preferred' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 ring-purple-700/10' : v.type === 'Approved' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-blue-700/10' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 ring-gray-500/10'}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center"><span className="text-sm font-medium text-[#0d141b] dark:text-white">{v.products}</span></td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${status === 'Quoted' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-green-600/20' : status === 'Issued' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-blue-700/10' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 ring-gray-500/10'}`}>
                          <span className={`size-1.5 rounded-full ${status === 'Quoted' ? 'bg-green-600' : status === 'Issued' ? 'bg-blue-600' : 'bg-gray-500'}`}></span>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4"><span className="text-sm text-[#0d141b] dark:text-white">{latestVersion.returnTime}</span></td>
                      <td className="py-3 px-4">
                        {latestVersion.slaStatus === 'within' && <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium"><span className="material-symbols-outlined text-[16px]">check_circle</span>{latestVersion.sla}</div>}
                        {latestVersion.slaStatus === 'timer' && <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs font-medium px-2 py-1 rounded border border-yellow-200 dark:border-yellow-800"><span className="material-symbols-outlined text-[14px]">timer</span>{latestVersion.sla}</span>}
                        {latestVersion.slaStatus === 'overdue' && <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-200 dark:border-red-800 animate-pulse"><span className="material-symbols-outlined text-[14px]">warning</span>{latestVersion.sla}</span>}
                        {latestVersion.slaStatus === 'na' && <span className="text-sm text-gray-400">N/A</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setActiveSubTaskId(v.id);
                              setSelectedVersion(v.versions[v.versions.length - 1].version);
                            }}
                            className="p-1.5 text-[#4c739a] hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          {/* Alarm bell removed as requested for all sub-tasks */}
                          {status !== 'Cancelled' && (
                            <button 
                              onClick={() => setIsCancelWarningOpen(true)}
                              className="p-1.5 text-[#4c739a] hover:text-red-500 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">cancel</span>
                            </button>
                          )}
                          {(status === 'Quoted' || status === 'Issued') && (
                            <button 
                              onClick={() => {
                                setSelectedTaskForRequote(v);
                                setIsRequoteModalOpen(true);
                              }}
                              className="p-1.5 text-[#4c739a] hover:text-primary transition-colors"
                              title="Re-quote"
                            >
                              <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
                            </button>
                          )}
                          <button className="p-1.5 text-[#4c739a] hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t border-[#e7edf3] dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg w-full md:w-auto flex-1 md:max-w-2xl">
              <span className="material-symbols-outlined text-orange-600">info</span>
              <p className="text-sm text-orange-900 dark:text-orange-400 font-medium">2 Vendors have not yet completed quoting; you can proceed to Vendor Selection once complete.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto justify-end">
              <button 
                disabled={!canProceed}
                onClick={onNext}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all ${
                  canProceed 
                  ? 'bg-primary text-white hover:bg-primary-dark cursor-pointer' 
                  : 'bg-gray-300 dark:bg-slate-700 text-white dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                Next: Vendor Selection
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Task Details Drawer */}
      {isParentModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsParentModalOpen(false)}></div>
          <div className="relative h-full w-full max-w-[1000px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-left border-l border-slate-200 dark:border-slate-800 overflow-hidden">
            <header className="flex-none bg-slate-50 dark:bg-[#15202b] border-b border-slate-200 dark:border-slate-800 px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2 text-slate-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight">RFQ-2025-00023</h1>
                    <span className="inline-flex items-center rounded-full bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[14px] mr-1">lock</span>
                      System Generated • Not Editable
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">task</span><span>Task ID: <span className="font-semibold text-slate-900 dark:text-slate-200">T-8842</span></span></div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">receipt_long</span><span>Quotation ID: <a className="text-primary hover:text-primary-dark font-semibold underline decoration-dotted underline-offset-2" href="#">Q-9912</a></span></div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">calendar_today</span><span>Created: Oct 24, 2023</span></div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">person</span><span>By: Jane Doe</span></div>
                  </div>
                </div>
                <button onClick={() => setIsParentModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900">
              <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-12 text-slate-900 dark:text-white">
                <section className="flex flex-col gap-5">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="material-symbols-outlined text-primary text-2xl">article</span>
                    <h2 className="text-xl font-bold">Task Basic Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold flex items-center">Buying Company <span className="text-red-500 ml-1">*</span></label>
                      <select className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4 focus:ring-2 focus:ring-primary/20 appearance-none"><option>Acme Corp International</option></select>
                    </div>
                    <div className="flex flex-col gap-1.5"><label className="text-sm font-semibold">Subunit</label><select className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4 appearance-none"><option>APAC Division</option></select></div>
                    <div className="flex flex-col gap-1.5"><label className="text-sm font-semibold">Covering Officer</label><input className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4" value="Jane Doe" readOnly disabled /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-sm font-semibold">Sales Region</label><select className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4 appearance-none"><option>East Coast</option></select></div>
                    <div className="flex flex-col gap-1.5"><label className="text-sm font-semibold flex items-center">Quote Due Date <span className="text-red-500 ml-1">*</span></label><input className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4" type="date" defaultValue="2023-11-15" /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-sm font-semibold">Project Name</label><input className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4" value="Q4 Infrastructure Upgrade" readOnly disabled /></div>
                    <div className="flex flex-col gap-1.5"><label className="text-sm font-semibold">RFP Ref.</label><input className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 h-12 px-4" value="RFP-EXT-9002" readOnly disabled /></div>
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5"><label className="text-sm font-semibold">Description</label><textarea className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4 min-h-[100px]" defaultValue="Enter detailed description of the task..."></textarea></div>
                  </div>
                </section>
                <section className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="material-symbols-outlined text-primary text-2xl">gavel</span>
                    <h2 className="text-xl font-bold">Terms & Conditions Reference</h2>
                  </div>
                  <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2"><h3 className="text-lg font-bold">Master Service Agreement v4.2</h3><span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-200">Inherited from Library</span></div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">These General Terms and Conditions (GTC) shall apply to all current and future business relationships between the Contractor and the Client.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-[18px]">visibility</span>View Full T&C</button>
                      <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined text-[18px]">edit_note</span>Change</button>
                    </div>
                  </div>
                </section>
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-2xl">attach_file</span><h2 className="text-xl font-bold">Attachments</h2></div>
                    <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors"><span className="material-symbols-outlined text-[18px]">add_circle</span>Add File</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: 'RFQ_Requirements_Spec_v2.pdf', info: '2.4 MB • Uploaded by J. Doe', icon: 'picture_as_pdf', color: 'text-red-600 bg-red-100' },
                      { name: 'Technical_Drawings_Draft.docx', info: '845 KB • Uploaded by System', icon: 'description', color: 'text-blue-600 bg-blue-100' },
                      { name: 'Budget_Estimate_Breakdown.xlsx', info: '156 KB • Uploaded by M. Smith', icon: 'table_view', color: 'text-green-600 bg-green-100' },
                      { name: 'Site_Photo_Reference_01.jpg', info: '4.2 MB • Uploaded by Field Team', icon: 'image', color: 'text-purple-600 bg-purple-100' }
                    ].map((file, idx) => (
                      <div key={idx} className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${file.color}`}><span className="material-symbols-outlined">{file.icon}</span></div>
                          <div><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-slate-500">{file.info}</p></div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">download</span></button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </main>
            <footer className="flex-none bg-white dark:bg-[#15202b] border-t border-slate-200 dark:border-slate-800 p-6 px-8 z-30">
              <div className="flex items-center justify-end gap-4 max-w-4xl mx-auto w-full">
                <button onClick={() => setIsParentModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Close</button>
                <button onClick={() => setIsParentModalOpen(false)} className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-md transition-all flex items-center gap-2"><span className="material-symbols-outlined text-[20px]">save</span>Save Changes</button>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Sub Task Details Drawer */}
      {activeSubTaskId && (
        (() => {
          const activeSubTask = vendors.find(v => v.id === activeSubTaskId);
          if (!activeSubTask) return null;
          
          const activeVersionData = activeSubTask.versions.find(ver => ver.version === selectedVersion) || activeSubTask.versions[activeSubTask.versions.length - 1];
          
          return (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveSubTaskId(null)}></div>
              <div className="relative h-full w-full max-w-5xl bg-background-light dark:bg-background-dark shadow-2xl flex flex-col animate-slide-left border-l border-slate-200 dark:border-slate-800 overflow-hidden">
                <header className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-6 py-5 z-10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Child Task #{activeSubTaskId}</h1>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${activeVersionData.status === 'Quoted' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-green-600/20' : activeVersionData.status === 'Issued' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-blue-700/10' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 ring-gray-500/10'}`}>
                            <span className={`size-1.5 rounded-full ${activeVersionData.status === 'Quoted' ? 'bg-green-600' : activeVersionData.status === 'Issued' ? 'bg-blue-600' : 'bg-gray-500'}`}></span>
                            {activeVersionData.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-base font-medium text-primary dark:text-blue-400">{activeSubTask.name}</p>
                          <span className="rounded bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">{activeSubTask.type}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quote Due Date</span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <span className="material-symbols-outlined text-[18px]">event</span>
                          {activeVersionData.dueDate}
                        </div>
                      </div>
                    </div>
                    
                    {/* Version Selector Dropdown */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="relative">
                        <select 
                          value={selectedVersion || ''}
                          onChange={(e) => setSelectedVersion(e.target.value)}
                          className="appearance-none h-10 pl-4 pr-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all min-w-[320px]"
                        >
                          {activeSubTask.versions.map((ver) => (
                            <option key={ver.version} value={ver.version}>
                              Version {ver.version} ({ver.timestamp})
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5">
                          <span className="material-symbols-outlined text-[16px] text-slate-500">domain</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{activeVersionData.sites.length} Sites</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5">
                          <span className="material-symbols-outlined text-[16px] text-slate-500">shopping_cart</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {activeVersionData.sites.reduce((acc, site) => acc + site.offers.length, 0)} Offers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-background-light dark:bg-background-dark">
                  <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-6">
                    {/* Re-quote Details (for V2+) */}
                    {parseInt(activeVersionData.version.replace('V', '')) > 1 && (
                      <div className="rounded-xl border border-blue-200 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-blue-100 dark:border-blue-900/20 bg-blue-50/50 dark:bg-blue-900/20 px-5 py-3">
                          <span className="material-symbols-outlined text-[20px] text-primary">published_with_changes</span>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Re-quote Information</h2>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Re-quote Reason</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activeVersionData.requoteReason || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Change Scope</p>
                            <div className="flex flex-wrap gap-1.5">
                              {activeVersionData.changeScope?.map(scope => (
                                <span key={scope} className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                                  {scope}
                                </span>
                              )) || <span className="text-sm text-slate-400">N/A</span>}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Comments</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 italic">
                              {activeVersionData.comments ? `"${activeVersionData.comments}"` : 'No comments provided.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeVersionData.sites.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 opacity-60">
                        <span className="material-symbols-outlined text-[48px] text-slate-400 mb-2">location_off</span>
                        <p className="text-slate-500 font-medium">No sites associated with this version</p>
                      </div>
                    ) : (
                      activeVersionData.sites.map((site, sIdx) => (
                        <div key={sIdx} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center gap-4">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
                                <span className="material-symbols-outlined">apartment</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-base font-bold text-slate-900 dark:text-white">{site.name}</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{site.address}</p>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 dark:border-slate-800 p-5 space-y-6">
                            {site.offers.map((offer, oIdx) => (
                              <div key={oIdx} className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                                  <div>
                                    {offer.name}
                                    <span className="ml-2 font-normal text-xs text-slate-500">Qty: {offer.qty} • Term: {offer.term}</span>
                                  </div>
                                  {offer.status === 'Pending' && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 uppercase font-bold tracking-wider">Pending</span>
                                  )}
                                </div>
                                {offer.status === 'Quoted' ? (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                      <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
                                          {offer.quotes[0]?.bw ? (
                                            <>
                                              <th className="px-4 py-3">Bandwidth</th>
                                              <th className="px-4 py-3">OTC Cost</th>
                                              <th className="px-4 py-3">RC Cost</th>
                                              <th className="px-4 py-3 text-center">Lead Time (Days)</th>
                                              <th className="px-4 py-3 text-right">Quote Valid Till</th>
                                            </>
                                          ) : (
                                            <>
                                              <th className="px-4 py-3">Provider</th>
                                              <th className="px-4 py-3">Region</th>
                                              <th className="px-4 py-3">Port</th>
                                              <th className="px-4 py-3 font-mono">OTC</th>
                                              <th className="px-4 py-3 font-mono">RC</th>
                                              <th className="px-4 py-3 text-center">Lead Time</th>
                                            </>
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                                        {offer.quotes.map((quote, qIdx) => (
                                          <tr key={qIdx}>
                                            {quote.bw ? (
                                              <>
                                                <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{quote.bw}</td>
                                                <td className="px-4 py-4 font-mono">{quote.otc}</td>
                                                <td className="px-4 py-4 font-mono">{quote.rc}</td>
                                                <td className="px-4 py-4 text-center">{quote.lead}</td>
                                                <td className="px-4 py-4 text-right font-mono">{quote.valid}</td>
                                              </>
                                            ) : (
                                              <>
                                                <td className="px-4 py-4 font-semibold">{quote.provider}</td>
                                                <td className="px-4 py-4">{quote.region}</td>
                                                <td className="px-4 py-4">{quote.port}</td>
                                                <td className="px-4 py-4 font-mono">{quote.otc}</td>
                                                <td className="px-4 py-4 font-mono">{quote.rc}</td>
                                                <td className="px-4 py-4 text-center">{quote.lead}</td>
                                              </>
                                            )}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="p-8 flex flex-col items-center justify-center gap-2 bg-slate-50/30 dark:bg-slate-900/10 opacity-50">
                                    <span className="material-symbols-outlined text-slate-400">hourglass_empty</span>
                                    <p className="text-xs font-medium text-slate-500">Awaiting vendor quote for this offer</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                    
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 py-3">
                        <span className="material-symbols-outlined text-[20px] text-primary">chat_bubble</span>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Remarks</h2>
                      </div>
                      <div className="p-5">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800">
                          {activeVersionData.remark ? (
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 italic">
                              "{activeVersionData.remark}"
                            </p>
                          ) : (
                            <p className="text-sm text-slate-400 italic">No remarks for this version</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-5 py-3">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">attachment</span>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Attachments</h2>
                      </div>
                      <div className="p-5">
                        {activeVersionData.attachments.length > 0 ? (
                          <div className="grid gap-4 md:grid-cols-2 text-slate-900 dark:text-white">
                            {activeVersionData.attachments.map((file, fIdx) => (
                              <div key={fIdx} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-3 group">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-10 shrink-0 items-center justify-center rounded bg-white dark:bg-slate-700 text-green-600 shadow-sm">
                                    <span className="material-symbols-outlined">{file.name.endsWith('.pdf') ? 'picture_as_pdf' : 'table_view'}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="line-clamp-1 text-sm font-semibold">{file.name}</p>
                                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{file.type}</p>
                                  </div>
                                </div>
                                <button className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 transition-colors">
                                  <span className="material-symbols-outlined text-[20px]">download</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 opacity-40">
                            <span className="material-symbols-outlined text-[32px] mb-1">folder_off</span>
                            <p className="text-xs font-medium">No attachments</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </main>
                <footer className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-6 py-4 z-10 flex items-center justify-between text-slate-900 dark:text-white">
                  <div className="text-xs text-slate-400">Last sync: Today 11:20 AM</div>
                  <button onClick={() => setActiveSubTaskId(null)} className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent px-8 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Close</button>
                </footer>
              </div>
            </div>
          );
        })()
      )}

      {/* Re-quote Modal */}
      {isRequoteModalOpen && selectedTaskForRequote && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6" role="dialog">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsRequoteModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all flex flex-col max-h-[90vh] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-[#e7edf3] dark:border-slate-800 px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">published_with_changes</span>
                  Re-quote Request
                </h3>
                <p className="text-xs text-[#4c739a] mt-1">Vendor: {selectedTaskForRequote.name} ({selectedTaskForRequote.vendorId})</p>
              </div>
              <button onClick={() => setIsRequoteModalOpen(false)} className="flex size-10 items-center justify-center rounded-full text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              {/* Top Part: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Re-quote Reason <span className="text-red-500">*</span></label>
                  <select 
                    value={requoteReason}
                    onChange={(e) => setRequoteReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-11 px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>Price Adjustment</option>
                    <option>Configuration Change</option>
                    <option>Delivery Timeline Update</option>
                    <option>Specification Clarification</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Quote Due Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={requoteDueDate}
                    onChange={(e) => setRequoteDueDate(e.target.value)}
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
                            checked={requoteScopes.includes(scope)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRequoteScopes(prev => [...prev, scope]);
                              } else {
                                setRequoteScopes(prev => prev.filter(s => s !== scope));
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
                    value={requoteComments}
                    onChange={(e) => setRequoteComments(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 min-h-[100px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Enter additional details for the re-quote request..."
                  ></textarea>
                </div>
              </div>

              {/* Bottom Part: Configuration (Conditional) */}
              {requoteScopes.includes('Configuration') && (
                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">tune</span>
                      Configuration Details
                    </h4>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Add New Offer
                    </button>
                  </div>

                  {/* Site Card */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">apartment</span>
                        <span className="text-sm font-bold">NY Headquarters - 100 Park Ave</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Site ID: S-001</span>
                    </div>
                    <div className="p-4 space-y-4">
                      {[
                        { name: 'Dedicated Internet Access (DIA)', qty: 1, attr: '500 Mbps' },
                        { name: 'Cloud Connect Service', qty: 2, attr: 'AWS / US-East-1' }
                      ].map((offer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group hover:border-primary/30 transition-all">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <p className="text-sm font-bold">{offer.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">Service Offer</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity</label>
                              <input type="number" className="w-20 h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 text-sm" defaultValue={offer.qty} />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Attributes</label>
                              <input type="text" className="w-full h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 text-sm" defaultValue={offer.attr} />
                            </div>
                          </div>
                          <button className="ml-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Attachment Upload for Site */}
                    <div className="px-5 pb-5">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                          <span className="material-symbols-outlined">upload_file</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click or drag files to upload site-specific attachments</p>
                        <p className="text-xs text-slate-400">PDF, DOCX, XLSX up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Non-site Card */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-500">public</span>
                        <span className="text-sm font-bold text-slate-500">Non-site</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group hover:border-primary/30 transition-all">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <p className="text-sm font-bold">Professional Services - Setup</p>
                            <p className="text-xs text-slate-500 mt-0.5">One-time Service</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity</label>
                            <input type="number" className="w-20 h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 text-sm" defaultValue={1} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Attributes</label>
                            <input type="text" className="w-full h-8 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 text-sm" defaultValue="Standard Installation" />
                          </div>
                        </div>
                        <button className="ml-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                    {/* Attachment Upload for Non-site */}
                    <div className="px-5 pb-5">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                          <span className="material-symbols-outlined">upload_file</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click or drag files to upload general attachments</p>
                        <p className="text-xs text-slate-400">PDF, DOCX, XLSX up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-[#e7edf3] dark:border-slate-800">
              <button onClick={() => setIsRequoteModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
              <button 
                onClick={() => handleRequoteSubmit(selectedTaskForRequote.id)}
                className="px-8 py-2.5 rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 transition-all flex items-center gap-2"
              >
                Submit Re-quote
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {isSelectOfferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsSelectOfferModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-2xl transition-all flex flex-col max-h-[90vh] text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-[#e7edf3] dark:border-slate-700 px-6 py-4">
              <h3 className="text-lg font-bold">Select Offers for Inquiry</h3>
              <button onClick={() => setIsSelectOfferModalOpen(false)} className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h4 className="text-sm font-bold mb-3">Available Partner Offers for Inquiry</h4>
              <div className="border border-[#e7edf3] dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="max-h-[320px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-slate-900/50 sticky top-0 z-10">
                      <tr className="border-b border-[#e7edf3] dark:border-slate-700">
                        <th className="py-3 px-4 w-12 text-center"><input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" defaultChecked /></th>
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Offer Details</th>
                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-24 text-center">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-700">
                      {[
                        { name: 'Dedicated Internet Access - 10Gbps', sub: 'Service • AT&T Wholesale', qty: 1 },
                        { name: 'Managed Router - Cisco ISR 4000', sub: 'Hardware • Cisco Systems', qty: 2 },
                        { name: 'SD-WAN Pro License', sub: 'Software • VMware VeloCloud', qty: 1 },
                        { name: 'SIP Trunking - Unlimited', sub: 'Voice • Verizon Partner', qty: 50 }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4 text-center"><input className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" defaultChecked /></td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.sub}</p>
                          </td>
                          <td className="py-3 px-4 text-center"><span className="text-sm font-medium">{item.qty}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-[#4c739a] mt-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Skipping inquiry when no Offers are selected.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-[#e7edf3] dark:border-slate-700">
              <button onClick={() => setIsSelectOfferModalOpen(false)} className="px-4 py-2 rounded-lg border border-[#cfdbe7] dark:border-slate-600 bg-white dark:bg-transparent text-sm font-bold text-[#4c739a] hover:bg-gray-50 shadow-sm transition-colors">Cancel</button>
              <button onClick={handleAddSubTask} className="px-4 py-2 rounded-lg bg-primary text-sm font-bold text-white shadow-sm hover:bg-primary-dark transition-colors">OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Task Creation Flow - EXACT MATCH TO PROVIDED HIGH-FIDELITY HTML */}
      {isCreationModalOpen && (
        <div className="fixed inset-0 z-[110] bg-[#f6f7f8] dark:bg-[#101922] text-[#0d141b] dark:text-white font-display min-h-screen flex flex-col overflow-hidden">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-[#1a2632] px-10 py-3 z-20 sticky top-0">
            <div className="flex items-center gap-4 text-[#0d141b] dark:text-white">
              <div className="size-6 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Procure-X</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 ring-2 ring-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVa4gFqiEUrHPK2xkNZ_jmoajmSw-Uo3H_DrsKaoWs6amYVK8ZZa8N0LDiHyYfe__VxsCe-qJrU27Et1Z9afkPlICEltwBSfw6hyfelFU1fY9UqtetSS6qE2KW-c5bFfsvfLkzib1sUUCjdFm4MdE_-dyG4XfhcDbHUlbRbFYOXhAbFRRrPQtCjlrmpHgUD68Omf10-gkPUK2v6xPxMxX-x9JpdohMgVjUo8xdT4Ap0G2zPRidbf-BtlNzCFwQGm32AKoM7Jqv0clX")' }}></div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
            <div className="mb-8">
              <h1 className="text-[#0d141b] dark:text-white text-3xl font-black leading-tight tracking-tight mb-2">Create Quote Task</h1>
              <p className="text-[#4c739a] dark:text-gray-400 text-base font-normal">Please configure vendors and attributes for the selected offers.</p>
            </div>

            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-[#e7edf3] dark:border-[#2d3b4a] pb-4">
                <div>
                  <h2 className="text-[#0d141b] dark:text-white text-xl font-bold">Site / Offer Information</h2>
                  <p className="text-[#4c739a] dark:text-gray-400 text-sm mt-1">Configure vendors and specific attributes for each offer. Offers are grouped by site.</p>
                </div>
              </div>

              {/* Headquarters - New York Site Group */}
              <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#e7edf3] dark:border-[#2d3b4a] shadow-sm overflow-hidden group">
                <details className="w-full" open>
                  <summary className="list-none cursor-pointer flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors border-b border-[#e7edf3] dark:border-[#2d3b4a]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4c739a] transition-transform group-open:rotate-180">expand_more</span>
                      <div>
                        <h3 className="text-[#0d141b] dark:text-white font-bold text-lg flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>domain</span>
                          Headquarters - New York
                        </h3>
                        <p className="text-[#4c739a] dark:text-gray-400 text-sm mt-0.5 ml-7">123 Wall Street, New York, NY 10005, USA</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-primary dark:bg-primary/20 dark:text-blue-300">2 Offers</span>
                  </summary>
                  <div className="p-6 pt-6">
                    <div className="flex flex-col gap-6">
                      {/* DIA Offer Config Card */}
                      <div className="rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-[#101922] p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 border-b border-[#e7edf3]/50 dark:border-[#2d3b4a] pb-4 text-slate-900 dark:text-white">
                          <div>
                            <h4 className="text-base font-bold">DIA - Dedicated Internet Access - 1Gbps</h4>
                            <p className="text-sm text-[#4c739a]">Term: 36 Months</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#4c739a] uppercase font-bold tracking-wide">Quantity</p>
                            <p className="text-lg font-bold">1</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Vendor Type</label>
                            <select className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus:ring-primary focus:border-primary">
                              <option>Preferred</option>
                              <option>Approved</option>
                              <option>Others</option>
                            </select>
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Vendors</label>
                            <div className="relative">
                              <div className="w-full min-h-[38px] rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary p-1.5 flex flex-wrap gap-2 items-center cursor-text">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                  AT&T
                                  <button className="ml-1 inline-flex text-primary hover:text-primary-hover focus:outline-none" type="button"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span></button>
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                  Verizon
                                  <button className="ml-1 inline-flex text-primary hover:text-primary-hover focus:outline-none" type="button"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span></button>
                                </span>
                                <input className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm h-6 min-w-[60px]" placeholder="Select..." type="text" />
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ fontSize: '20px' }}>expand_more</span>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Quote Due Date</label>
                            <div className="relative">
                              <input className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus:ring-primary focus:border-primary pl-10" type="date" defaultValue="2023-11-15" />
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ fontSize: '18px' }}>calendar_today</span>
                            </div>
                          </div>
                          <div className="md:col-span-12 pt-2">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-dashed border-[#e7edf3] dark:border-[#2d3b4a]">
                              <h5 className="text-xs font-bold text-[#4c739a] uppercase mb-3 flex items-center gap-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>tune</span>
                                Additional Attributes
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-[#4c739a] mb-1">Managed Router</label>
                                  <select className="w-full rounded border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-[#1a2632] text-sm py-1.5">
                                    <option>Yes - Managed by Vendor</option>
                                    <option>No - Customer Provided</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-[#4c739a] mb-1">IP Addresses</label>
                                  <input className="w-full rounded border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-[#1a2632] text-sm py-1.5 text-slate-900 dark:text-white" placeholder="e.g. /29 Block" type="text" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SIP Trunking Offer Config Card */}
                      <div className="rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-[#101922] p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 border-b border-[#e7edf3]/50 dark:border-[#2d3b4a] pb-4 text-slate-900 dark:text-white">
                          <div>
                            <h4 className="text-base font-bold">SIP Trunking - 20 Channels</h4>
                            <p className="text-sm text-[#4c739a]">Term: 12 Months</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#4c739a] uppercase font-bold tracking-wide">Quantity</p>
                            <p className="text-lg font-bold">1</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Vendor Type</label>
                            <select className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus:ring-primary focus:border-primary">
                              <option>Preferred</option>
                              <option selected>Approved</option>
                              <option>Others</option>
                            </select>
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Vendors</label>
                            <div className="relative">
                              <div className="w-full min-h-[38px] rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary p-1.5 flex flex-wrap gap-2 items-center cursor-text">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                  Lumen
                                  <button className="ml-1 inline-flex text-primary hover:text-primary-hover focus:outline-none" type="button"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span></button>
                                </span>
                                <input className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm h-6 min-w-[60px]" placeholder="Select..." type="text" />
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ fontSize: '20px' }}>expand_more</span>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Quote Due Date</label>
                            <div className="relative">
                              <input className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus:ring-primary focus:border-primary pl-10" type="date" defaultValue="2023-11-20" />
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ fontSize: '18px' }}>calendar_today</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Austin Branch Site Group */}
              <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#e7edf3] dark:border-[#2d3b4a] shadow-sm overflow-hidden group">
                <details className="w-full">
                  <summary className="list-none cursor-pointer flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4c739a] transition-transform group-open:rotate-180 -rotate-90">expand_more</span>
                      <div>
                        <h3 className="text-[#0d141b] dark:text-white font-bold text-lg flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>domain</span>
                          Remote Office - Austin
                        </h3>
                        <p className="text-[#4c739a] dark:text-gray-400 text-sm mt-0.5 ml-7">301 Congress Avenue, Austin, TX 78701, USA</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-primary dark:bg-primary/20 dark:text-blue-300">1 Offer</span>
                  </summary>
                  <div className="p-6">
                    <p className="text-sm text-[#4c739a]">Content hidden for this demo...</p>
                  </div>
                </details>
              </div>

              {/* Non-Site Specific Group */}
              <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#e7edf3] dark:border-[#2d3b4a] shadow-sm overflow-hidden group">
                <details className="w-full" open>
                  <summary className="list-none cursor-pointer flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors border-b border-[#e7edf3] dark:border-[#2d3b4a]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4c739a] transition-transform group-open:rotate-180">expand_more</span>
                      <div>
                        <h3 className="text-[#0d141b] dark:text-white font-bold text-lg flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-500" style={{ fontSize: '20px' }}>layers</span>
                          Non-Site Specific
                        </h3>
                        <p className="text-[#4c739a] dark:text-gray-400 text-sm mt-0.5 ml-7">General requirements</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-primary dark:bg-primary/20 dark:text-blue-300">1 Offer</span>
                  </summary>
                  <div className="p-6 pt-6">
                    <div className="flex flex-col gap-6">
                      <div className="rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-[#101922] p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 border-b border-[#e7edf3]/50 dark:border-[#2d3b4a] pb-4 text-slate-900 dark:text-white">
                          <div>
                            <h4 className="text-base font-bold">Global DDoS Protection</h4>
                            <p className="text-sm text-[#4c739a]">Term: 36 Months</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#4c739a] uppercase font-bold tracking-wide">Quantity</p>
                            <p className="text-lg font-bold">1</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5 flex items-center gap-1">
                              Vendor Type
                              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '14px' }} title="Inherited from RFQ settings">lock</span>
                            </label>
                            <select className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed text-sm" disabled>
                              <option>Preferred (Inherited)</option>
                            </select>
                          </div>
                          <div className="md:col-span-5">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5 flex items-center gap-1">
                              Vendors
                              <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '14px' }} title="Inherited from RFQ settings">lock</span>
                            </label>
                            <div className="w-full min-h-[38px] rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-gray-100 dark:bg-gray-800 text-gray-500 p-2 text-sm flex items-center cursor-not-allowed italic">
                              Inherited from global settings
                            </div>
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Quote Due Date</label>
                            <div className="relative">
                              <input className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus:ring-primary focus:border-primary pl-10" type="date" defaultValue="2023-11-20" />
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ fontSize: '18px' }}>calendar_today</span>
                            </div>
                          </div>
                          <div className="md:col-span-12">
                            <label className="block text-xs font-semibold text-[#4c739a] uppercase mb-1.5">Installation Address</label>
                            <textarea className="w-full rounded-lg border-[#e7edf3] dark:border-[#2d3b4a] bg-[#f6f7f8] dark:bg-[#1a2632] text-[#0d141b] dark:text-white text-sm focus:ring-primary focus:border-primary" placeholder="Enter detailed installation location (Floor, Room, etc.)..." rows={2}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </section>
          </main>

          {/* Creation Footer */}
          <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1a2632] border-t border-[#e7edf3] dark:border-[#2d3b4a] py-4 px-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="max-w-[1200px] mx-auto w-full flex justify-end gap-4">
              <button 
                onClick={() => setIsCreationModalOpen(false)}
                className="px-6 py-2.5 rounded-lg border border-[#e7edf3] dark:border-[#2d3b4a] bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={finalizeCreation}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                Add Child Task
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Cancel Warning Modal */}
      {isCancelWarningOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCancelWarningOpen(false)}></div>
          <div className="relative bg-white dark:bg-[#1a2530] w-full max-w-[520px] rounded-xl shadow-2xl flex flex-col overflow-hidden p-8 text-center text-slate-900 dark:text-white">
            <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 mx-auto text-amber-500"><span className="material-symbols-outlined !text-4xl">warning</span></div>
            <h2 className="text-[24px] font-bold mb-4">Unable to Cancel Quote Task</h2>
            <p className="text-slate-500 mb-6">This quote task cannot be canceled directly because an active <strong>Vendor Purchase Order (PO)</strong> has already been associated with it.</p>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center gap-3 mb-6"><span className="material-symbols-outlined text-primary text-[20px]">help_outline</span><a className="text-primary text-sm font-semibold hover:underline" href="#">View Cancellation Guideline</a></div>
            <button onClick={() => setIsCancelWarningOpen(false)} className="w-full bg-primary text-white h-11 rounded-lg font-bold shadow-lg">I Understand</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQProcessingPage;