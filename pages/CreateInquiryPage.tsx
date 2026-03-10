
import React, { useState, useMemo } from 'react';
import { CartItem } from '../types';

interface CreateInquiryPageProps {
  selectedOffers: CartItem[];
  onCancel: () => void;
  onSubmit: () => void;
}

interface OfferConfig {
  vendorType: string;
  vendor: string[];
  dueDate: string;
  bandwidth?: string;
  accessType?: string;
  model?: string;
  mgmtLevel?: string;
  qty?: number;
  term?: string;
}

const VENDOR_TYPES = ['Preferred', 'Approved', 'Other'];
const AVAILABLE_VENDORS = [
  'Verizon Business', 'AT&T Wholesale', 'Lumen Technologies', 
  'T-Mobile for Business', 'Colt Technology Services', 
  'Orange Business', 'BT Global', 'Vodafone Business'
];

// Helper Component for Multi-select vendor UI
const VendorMultiSelect: React.FC<{
  selected: string[];
  onChange: (vendors: string[]) => void;
  placeholder?: string;
}> = ({ selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVendor = (v: string) => {
    if (selected.includes(v)) {
      onChange(selected.filter(item => item !== v));
    } else {
      onChange([...selected, v]);
    }
  };

  return (
    <div className="relative">
      <div 
        className="w-full min-h-[40px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 flex flex-wrap gap-2 items-center cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && <span className="text-sm text-slate-400 px-2">{placeholder || 'Select Vendors...'}</span>}
        {selected.map(v => (
          <span key={v} className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1.5 border border-blue-100 dark:border-blue-800">
            {v}
            <button 
              onClick={(e) => { e.stopPropagation(); toggleVendor(v); }}
              className="hover:text-red-500 transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}
        <div className="ml-auto pr-1">
          <span className="material-symbols-outlined text-slate-400 text-lg">arrow_drop_down</span>
        </div>
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto py-1">
            {AVAILABLE_VENDORS.map(v => (
              <div 
                key={v}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between ${selected.includes(v) ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                onClick={() => toggleVendor(v)}
              >
                {v}
                {selected.includes(v) && <span className="material-symbols-outlined text-base">check</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CreateInquiryPage: React.FC<CreateInquiryPageProps> = ({ selectedOffers, onCancel, onSubmit }) => {
  // --- Basic Info State ---
  const [basicInfo, setBasicInfo] = useState({
    buyingCompany: '',
    quoteDueDate: '',
  });

  // --- UI State ---
  const [viewMode, setViewMode] = useState<'site' | 'offer'>('site');
  const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set(['site-a']));
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set(['site-a-dia']));
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'Incomplete'>('All');

  // --- Data Definitions ---
  const globalOfferTypes = [
    { id: 'dia', name: 'Dedicated Internet Access', icon: 'router' },
    { id: 'router', name: 'Managed Router', icon: 'settings_input_antenna' }
  ];

  const handleEditQty = (instanceId: string, currentQty: number) => {
    const newQty = prompt('Enter new Quantity:', currentQty.toString());
    if (newQty !== null && !isNaN(parseInt(newQty))) {
      setInstancesConfig(prev => ({
        ...prev,
        [instanceId]: { ...prev[instanceId], qty: parseInt(newQty) }
      }));
    }
  };

  const handleEditTerm = (instanceId: string, currentTerm: string) => {
    const newTerm = prompt('Enter new Term:', currentTerm);
    if (newTerm !== null) {
      setInstancesConfig(prev => ({
        ...prev,
        [instanceId]: { ...prev[instanceId], term: newTerm }
      }));
    }
  };

  const handleEditGroupQty = (instanceIds: string[], currentQty: number) => {
    const newQty = prompt('Enter new Quantity for all sites:', currentQty.toString());
    if (newQty !== null && !isNaN(parseInt(newQty))) {
      updateGroupConfig(instanceIds, { qty: parseInt(newQty) });
    }
  };

  const handleEditGroupTerm = (instanceIds: string[], currentTerm: string) => {
    const newTerm = prompt('Enter new Term for all sites:', currentTerm);
    if (newTerm !== null) {
      updateGroupConfig(instanceIds, { term: newTerm });
    }
  };

  const handleEditGlobalQty = (typeId: string, currentQty: number) => {
    const newQty = prompt('Enter new Global Quantity:', currentQty.toString());
    if (newQty !== null && !isNaN(parseInt(newQty))) {
      setGlobalConfigs(prev => ({
        ...prev,
        [typeId]: { ...prev[typeId], qty: parseInt(newQty) }
      }));
    }
  };

  const handleEditGlobalTerm = (typeId: string, currentTerm: string) => {
    const newTerm = prompt('Enter new Global Term:', currentTerm);
    if (newTerm !== null) {
      setGlobalConfigs(prev => ({
        ...prev,
        [typeId]: { ...prev[typeId], term: newTerm }
      }));
    }
  };

  const sites = [
    { id: 'site-a', name: 'New York HQ - Site A', address: '123 Broadway, New York, NY 10001', icon: 'apartment', type: 'site' },
    { id: 'site-b', name: 'London Branch - Site B', address: '45 Oxford St, London, UK', icon: 'warehouse', type: 'site' },
    { id: 'non-site', name: 'Non-Site Offers', address: 'Global / Floating Resources', icon: 'domain', type: 'non-site' }
  ];

  const siteOfferMap = {
    'site-a': [
      { id: 'dia', instanceId: 'site-a-dia', name: 'Dedicated Internet Access' },
      { id: 'router', instanceId: 'site-a-router', name: 'Managed Router' }
    ],
    'site-b': [
      { id: 'dia', instanceId: 'site-b-dia', name: 'Dedicated Internet Access' },
      { id: 'router', instanceId: 'site-b-router', name: 'Managed Router' }
    ],
    'non-site': [
      { id: 'dia', instanceId: 'non-site-dia', name: 'Dedicated Internet Access' }
    ]
  };

  // --- Configuration State ---
  const [globalConfigs, setGlobalConfigs] = useState<Record<string, OfferConfig>>({
    'dia': { vendorType: 'Preferred', vendor: ['Verizon Business'], dueDate: '', qty: 1, term: '36 Months' },
    'router': { vendorType: 'Preferred', vendor: [], dueDate: '', qty: 1, term: '36 Months' }
  });

  const [instancesConfig, setInstancesConfig] = useState<Record<string, OfferConfig>>({
    'site-a-dia': { vendorType: 'Preferred', vendor: ['Verizon Business'], dueDate: '2023-11-15', bandwidth: '10 Gbps', accessType: 'Fiber', qty: 1, term: '36 Months' },
    'site-a-router': { vendorType: '', vendor: [], dueDate: '', qty: 1, term: '36 Months' },
    'site-b-dia': { vendorType: '', vendor: [], dueDate: '', qty: 1, term: '36 Months' },
    'site-b-router': { vendorType: '', vendor: [], dueDate: '', qty: 1, term: '36 Months' },
    'non-site-dia': { vendorType: '', vendor: [], dueDate: '', qty: 1, term: '36 Months' }
  });

  // --- Helper Functions ---
  const toggleSite = (id: string) => {
    const next = new Set(expandedSites);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedSites(next);
  };

  const toggleOffer = (id: string) => {
    const next = new Set(expandedOffers);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedOffers(next);
  };

  const isCompleted = (config: OfferConfig) => {
    // UPDATED: Removed Quote Due Date mandatory requirement for site/non-site offers
    return !!config.vendorType && config.vendor.length > 0;
  };

  const allInstances = useMemo(() => {
    const list: { siteId: string; siteName: string; id: string; instanceId: string; name: string; icon: string }[] = [];
    sites.forEach(site => {
      const siteOffers = siteOfferMap[site.id as keyof typeof siteOfferMap] || [];
      siteOffers.forEach(o => {
        const typeInfo = globalOfferTypes.find(t => t.id === o.id);
        list.push({ ...o, siteId: site.id, siteName: site.name, icon: typeInfo?.icon || 'description' });
      });
    });
    return list;
  }, [sites, siteOfferMap, globalOfferTypes]);

  const offerGroups = useMemo(() => {
    const groups: Record<string, { 
      offerId: string; 
      name: string; 
      icon: string;
      config: OfferConfig; 
      instances: typeof allInstances 
    }> = {};

    allInstances.forEach(inst => {
      const config = instancesConfig[inst.instanceId];
      
      // Create a key based on offerId and config values to group identical ones
      const configKey = JSON.stringify({
        offerId: inst.id,
        vendorType: config.vendorType,
        vendor: [...config.vendor].sort(),
        dueDate: config.dueDate,
        bandwidth: config.bandwidth,
        accessType: config.accessType,
        model: config.model,
        mgmtLevel: config.mgmtLevel,
        qty: config.qty,
        term: config.term
      });
      
      if (!groups[configKey]) {
        groups[configKey] = {
          offerId: inst.id,
          name: inst.name,
          icon: inst.icon,
          config: config,
          instances: []
        };
      }
      groups[configKey].instances.push(inst);
    });
    
    return Object.values(groups);
  }, [allInstances, instancesConfig]);

  const updateGroupConfig = (instanceIds: string[], newConfig: Partial<OfferConfig>) => {
    setInstancesConfig(prev => {
      const next = { ...prev };
      instanceIds.forEach(id => {
        next[id] = { ...next[id], ...newConfig };
      });
      return next;
    });
  };

  const applyGlobalToAll = (offerTypeId: string) => {
    const source = globalConfigs[offerTypeId];
    setInstancesConfig(prev => {
      const next = { ...prev };
      Object.keys(siteOfferMap).forEach(sId => {
        siteOfferMap[sId].forEach(inst => {
          if (inst.id === offerTypeId) {
            next[inst.instanceId] = { ...next[inst.instanceId], ...source };
          }
        });
      });
      return next;
    });
  };

  // --- Computed Stats ---
  const stats = useMemo(() => {
    const total = Object.keys(instancesConfig).length;
    const completed = Object.values(instancesConfig).filter(isCompleted).length;
    return { total, completed, incomplete: total - completed };
  }, [instancesConfig]);

  const isFormValid = basicInfo.buyingCompany && basicInfo.quoteDueDate && stats.incomplete === 0;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto w-full">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined text-3xl">grid_view</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">CPQ System</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-8 rounded-full bg-slate-200 bg-center bg-cover border border-slate-200 dark:border-slate-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCL8Vr0BHHHpCzmQuc4CECzQsV0YbcCQU_9_hGmNvc8sK65CQYih78MMEv4ttcCIvWn9UgVDmqUSKN-jGyXppsCPeB8wLmeyg_iKDa0ol2pDCBiF8bgRklj9P8gwNh6fQsf5RrkskfLPG6KnJ0hZCOMOGqRn5RpD5yIL_PZ28rGZxQSeyjLvbjutd4tKBPgKKbljD-gq3h6_8pCvFkWpRHLV66DioavFOv6oxwBw8HYNQ0XPcPwZkOyyyTLi2EAUDcKRihoQaH1e6tI')" }}></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-8 space-y-8 pb-48">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">Create Inquiry Task</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">Fill in the inquiry details, configure offers, and select vendors to request quotation.</p>
        </div>

        {/* Basic Information - Full layout from HTML */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The following fields describe the overall context of this inquiry.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Customer Name</label>
              <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 h-11 px-3 cursor-not-allowed focus:ring-0" disabled readOnly type="text" value="Acme Global Industries"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">Buying Company <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3 appearance-none focus:ring-2 focus:ring-primary"
                  value={basicInfo.buyingCompany}
                  onChange={(e) => setBasicInfo({ ...basicInfo, buyingCompany: e.target.value })}
                >
                  <option value="">Select buying entity</option>
                  <option value="entity1">Global Corp Inc.</option>
                  <option value="entity2">Tech Solutions Ltd.</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">arrow_drop_down</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Subunit</label>
              <div className="relative">
                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3 appearance-none">
                  <option value="">Select business subunit</option>
                  <option value="unit1">North America Operations</option>
                  <option value="unit2">EMEA Sales</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">arrow_drop_down</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Product House</label>
              <div className="relative">
                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3 appearance-none">
                  <option value="">Select product house</option>
                  <option value="connectivity">Connectivity Solutions</option>
                  <option value="managed">Managed Services</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">arrow_drop_down</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Contact Person(s)</label>
              <div className="relative">
                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3 appearance-none">
                  <option value="">Select contact person(s)</option>
                  <option value="p1">John Doe (Procurement)</option>
                  <option value="p2">Jane Smith (IT Manager)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">arrow_drop_down</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Technical Clarification Contact</label>
              <div className="relative">
                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3 appearance-none">
                  <option value="">Select technical contact</option>
                  <option value="t1">Tech Lead A</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-slate-500">arrow_drop_down</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Covering Officer</label>
              <div className="relative">
                <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 pl-10 pr-3 focus:ring-2 focus:ring-primary" placeholder="Select procurement manager" type="text"/>
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">person_search</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">Quote Due Date <span className="text-red-500">*</span></label>
              <input 
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3" 
                type="date"
                value={basicInfo.quoteDueDate}
                onChange={(e) => setBasicInfo({ ...basicInfo, quoteDueDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">RFP Ref.</label>
              <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3" placeholder="Enter RFP Reference" type="text"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Project Name</label>
              <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-11 px-3" placeholder="Enter Project Name" type="text"/>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 block">T&C Reference</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary mb-2 transition-colors">upload_file</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Click to upload T&C documents or drag and drop</p>
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
              <textarea className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-3 min-h-[100px]" placeholder="Enter inquiry description (optional)"></textarea>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Attachment</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary mb-2 transition-colors">cloud_upload</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Click to upload or drag and drop</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Global Vendor Selection - Card Based & Collapsible */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div 
            className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => setIsGlobalExpanded(!isGlobalExpanded)}
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Global Vendor Selection</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Group offers by type to quickly select vendors across all sites.</p>
            </div>
            <span className={`material-symbols-outlined transition-transform duration-300 ${isGlobalExpanded ? 'rotate-0' : '-rotate-90'}`}>expand_more</span>
          </div>
          
          {isGlobalExpanded && (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 space-y-4">
              {globalOfferTypes.map(type => (
                <div key={type.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined">{type.icon}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">{type.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditGlobalQty(type.id, globalConfigs[type.id].qty || 1); }}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            Qty: {globalConfigs[type.id].qty || 1}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditGlobalTerm(type.id, globalConfigs[type.id].term || '36 Months'); }}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                          >
                            Term: {globalConfigs[type.id].term || '36 Months'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => applyGlobalToAll(type.id)}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">sync_alt</span>
                      Apply to All Sites
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Vendor Type</label>
                      <select 
                        className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-10 px-2"
                        value={globalConfigs[type.id].vendorType}
                        onChange={(e) => setGlobalConfigs({ ...globalConfigs, [type.id]: { ...globalConfigs[type.id], vendorType: e.target.value } })}
                      >
                        <option value="">Select Type</option>
                        {VENDOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Vendors (Multi-select)</label>
                      <VendorMultiSelect 
                        selected={globalConfigs[type.id].vendor}
                        onChange={(vendors) => setGlobalConfigs({ ...globalConfigs, [type.id]: { ...globalConfigs[type.id], vendor: vendors } })}
                        placeholder="Search carriers..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Quote Due Date</label>
                      <input 
                        className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-10 px-3"
                        type="date"
                        value={globalConfigs[type.id].dueDate}
                        onChange={(e) => setGlobalConfigs({ ...globalConfigs, [type.id]: { ...globalConfigs[type.id], dueDate: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Site / Offer Information */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Site / Offer Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure individual offers. Grouped by site.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setViewMode('site')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'site' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-base">apartment</span>
                  Site View
                </button>
                <button 
                  onClick={() => setViewMode('offer')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'offer' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  Offer View
                </button>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-700 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm text-xs md:text-sm">
                <div className="flex flex-col md:flex-row md:gap-4 gap-1">
                  <div className="font-medium text-slate-700 dark:text-slate-200"><span className="font-bold text-slate-900 dark:text-white">Total Offers:</span> {stats.total}</div>
                  <div className="font-medium text-green-600 dark:text-green-400"><span className="font-bold">Completed:</span> {stats.completed}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 space-y-6">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
               <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter Status:</span>
               <div className="flex gap-2">
                 {(['All', 'Completed', 'Incomplete'] as const).map(opt => (
                   <button 
                     key={opt}
                     onClick={() => setFilterStatus(opt)}
                     className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filterStatus === opt ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
            </div>

            {viewMode === 'site' ? (
              sites.map(site => {
                const siteOffers = siteOfferMap[site.id as keyof typeof siteOfferMap];
                const filteredOffers = siteOffers.filter(o => {
                  if (filterStatus === 'All') return true;
                  const done = isCompleted(instancesConfig[o.instanceId]);
                  return filterStatus === 'Completed' ? done : !done;
                });

                if (filteredOffers.length === 0 && filterStatus !== 'All') return null;

                return (
                  <div key={site.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
                    <div 
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => toggleSite(site.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-slate-400 transition-transform ${expandedSites.has(site.id) ? '' : '-rotate-90'}`}>expand_more</span>
                        <div className={`size-10 rounded flex items-center justify-center shrink-0 ${site.type === 'site' ? 'bg-blue-100 dark:bg-blue-900/30 text-primary' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                          <span className="material-symbols-outlined">{site.icon}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">{site.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{site.address}</p>
                        </div>
                      </div>
                    </div>

                    {expandedSites.has(site.id) && (
                      <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700">
                        {filteredOffers.map(o => {
                          const config = instancesConfig[o.instanceId];
                          const done = isCompleted(config);
                          
                          return (
                            <div key={o.instanceId} className={`border rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-all ${expandedOffers.has(o.instanceId) ? 'ring-1 ring-primary/30 border-primary/30' : 'hover:border-primary/50 border-slate-200 dark:border-slate-700'}`}>
                              <div 
                                className="flex flex-col md:flex-row md:items-center justify-between p-3 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-700/50"
                                onClick={() => toggleOffer(o.instanceId)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`material-symbols-outlined text-slate-400 transition-transform ${expandedOffers.has(o.instanceId) ? '' : '-rotate-90'}`}>expand_more</span>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{o.name}</span>
                                    <div className="flex items-center gap-1.5">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleEditQty(o.instanceId, config.qty || 1); }}
                                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                                      >
                                        Qty: {config.qty || 1}
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleEditTerm(o.instanceId, config.term || '36 Months'); }}
                                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                                      >
                                        Term: {config.term || '36 Months'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${done ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                                    {done ? 'Completed' : 'Incomplete'}
                                  </span>
                                </div>
                              </div>

                              {expandedOffers.has(o.instanceId) && (
                                <div className="p-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-800/50">
                                  <div className="lg:col-span-5 space-y-4 lg:border-r border-slate-100 dark:border-slate-700 pr-0 lg:pr-6">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Vendor Selection</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendor Type</label>
                                        <select 
                                          className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2"
                                          value={config.vendorType}
                                          onChange={(e) => setInstancesConfig({ ...instancesConfig, [o.instanceId]: { ...config, vendorType: e.target.value } })}
                                        >
                                          <option value="">Select Type</option>
                                          {VENDOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendors</label>
                                        <VendorMultiSelect 
                                          selected={config.vendor}
                                          onChange={(vendors) => setInstancesConfig({ ...instancesConfig, [o.instanceId]: { ...config, vendor: vendors } })}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Quote Due Date</label>
                                      <input 
                                        className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2"
                                        type="date"
                                        value={config.dueDate}
                                        onChange={(e) => setInstancesConfig({ ...instancesConfig, [o.instanceId]: { ...config, dueDate: e.target.value } })}
                                      />
                                    </div>
                                  </div>
                                  <div className="lg:col-span-7 space-y-4">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Offer Attributes (Optional)</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Bandwidth</label>
                                        <input 
                                          className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2" 
                                          type="text" 
                                          placeholder="e.g. 100Mbps" 
                                          value={config.bandwidth || ''}
                                          onChange={(e) => setInstancesConfig({ ...instancesConfig, [o.instanceId]: { ...config, bandwidth: e.target.value } })}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Access Type</label>
                                        <select 
                                          className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2"
                                          value={config.accessType || ''}
                                          onChange={(e) => setInstancesConfig({ ...instancesConfig, [o.instanceId]: { ...config, accessType: e.target.value } })}
                                        >
                                          <option value="">Select Type</option>
                                          <option value="Fiber">Fiber</option>
                                          <option value="Copper">Copper</option>
                                          <option value="Wireless">Wireless</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              offerGroups.map((group, idx) => {
                const groupKey = `group-${idx}`;
                const done = isCompleted(group.config);
                const filteredInstances = group.instances.filter(inst => {
                   if (filterStatus === 'All') return true;
                   const instDone = isCompleted(instancesConfig[inst.instanceId]);
                   return filterStatus === 'Completed' ? instDone : !instDone;
                });

                if (filteredInstances.length === 0 && filterStatus !== 'All') return null;

                return (
                  <div key={groupKey} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
                    <div 
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => toggleOffer(groupKey)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-slate-400 transition-transform ${expandedOffers.has(groupKey) ? '' : '-rotate-90'}`}>expand_more</span>
                        <div className="size-10 rounded flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                          <span className="material-symbols-outlined">{group.icon}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{group.name}</h3>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEditGroupQty(group.instances.map(i => i.instanceId), group.config.qty || 1); }}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                              >
                                Qty: {group.config.qty || 1}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEditGroupTerm(group.instances.map(i => i.instanceId), group.config.term || '36 Months'); }}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                              >
                                Term: {group.config.term || '36 Months'}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">apartment</span>
                              {group.instances.length} Sites
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                            {group.config.vendorType && <span><span className="font-bold text-slate-700 dark:text-slate-300">Type:</span> {group.config.vendorType}</span>}
                            {group.config.vendor.length > 0 && <span><span className="font-bold text-slate-700 dark:text-slate-300">Vendors:</span> {group.config.vendor.length} selected</span>}
                            {group.config.dueDate && <span><span className="font-bold text-slate-700 dark:text-slate-300">Due:</span> {group.config.dueDate}</span>}
                            {group.config.bandwidth && <span><span className="font-bold text-slate-700 dark:text-slate-300">BW:</span> {group.config.bandwidth}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 lg:mt-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${done ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
                          {done ? 'Completed' : 'Incomplete'}
                        </span>
                      </div>
                    </div>

                    {expandedOffers.has(groupKey) && (
                      <div className="p-6 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/30 dark:bg-slate-900/10">
                        <div className="lg:col-span-5 space-y-4 lg:border-r border-slate-100 dark:border-slate-700 pr-0 lg:pr-6">
                          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Vendor Selection</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendor Type</label>
                              <select 
                                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2"
                                value={group.config.vendorType}
                                onChange={(e) => updateGroupConfig(group.instances.map(i => i.instanceId), { vendorType: e.target.value })}
                              >
                                <option value="">Select Type</option>
                                {VENDOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Vendors</label>
                              <VendorMultiSelect 
                                selected={group.config.vendor}
                                onChange={(vendors) => updateGroupConfig(group.instances.map(i => i.instanceId), { vendor: vendors })}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Quote Due Date</label>
                            <input 
                              className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2"
                              type="date"
                              value={group.config.dueDate}
                              onChange={(e) => updateGroupConfig(group.instances.map(i => i.instanceId), { dueDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-7 space-y-4">
                          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Offer Attributes</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Bandwidth</label>
                              <input 
                                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2" 
                                type="text" 
                                placeholder="e.g. 100Mbps" 
                                value={group.config.bandwidth || ''}
                                onChange={(e) => updateGroupConfig(group.instances.map(i => i.instanceId), { bandwidth: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Access Type</label>
                              <select 
                                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 h-9 px-2"
                                value={group.config.accessType || ''}
                                onChange={(e) => updateGroupConfig(group.instances.map(i => i.instanceId), { accessType: e.target.value })}
                              >
                                <option value="">Select Type</option>
                                <option value="Fiber">Fiber</option>
                                <option value="Copper">Copper</option>
                                <option value="Wireless">Wireless</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-12 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">apartment</span>
                              Associated Sites ({group.instances.length})
                            </h4>
                          </div>
                          <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 p-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                              {group.instances.map(inst => (
                                <div key={inst.instanceId} className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                                  <span className="truncate" title={inst.siteName}>{inst.siteName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Footer - Floating Above Obscuring Content */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <span className={`material-symbols-outlined text-lg ${isFormValid ? 'text-green-500' : 'text-yellow-500'}`}>info</span>
            {isFormValid ? (
              <span className="font-medium text-green-600">All configurations complete. Ready to create RFQ task.</span>
            ) : (
              <span>Basic info + <strong>{stats.incomplete} remaining offers</strong> required.</span>
            )}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button 
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={onSubmit}
              disabled={!isFormValid}
              className={`px-8 py-2.5 rounded-lg font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                isFormValid 
                ? "bg-primary text-white hover:bg-primary-dark shadow-primary/20" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-lg">send</span>
              Create Inquiry Task
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateInquiryPage;
