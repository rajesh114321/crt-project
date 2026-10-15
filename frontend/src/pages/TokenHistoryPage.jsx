import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { CancelTokenModal } from '../components/CancelTokenModal';
import { 
  Search, 
  Filter, 
  Menu,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Trash2
} from 'lucide-react';

export const TokenHistoryPage = ({ setCurrentView, onOpenMobileMenu }) => {
  const { userTokens, activeToken, cancelToken } = useQueue();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cancel token modal state
  const [tokenToCancel, setTokenToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Sample seed tokens from reference image
  const referenceTokens = [
    { tokenNumber: 'F101', service: 'College Office', date: '22 Apr, 10:15 AM', status: 'Waiting' },
    { tokenNumber: 'F100', service: 'College Office', date: '22 Apr, 09:45 AM', status: 'Completed' },
    { tokenNumber: 'A045', service: 'Accounts', date: '21 Apr, 02:30 PM', status: 'Completed' },
    { tokenNumber: 'L012', service: 'Library', date: '20 Apr, 11:20 AM', status: 'Completed' },
    { tokenNumber: 'C033', service: 'Canteen', date: '19 Apr, 01:45 PM', status: 'Completed' },
    { tokenNumber: 'P099', service: 'College Office', date: '18 Apr, 11:00 AM', status: 'Completed' },
    { tokenNumber: 'A039', service: 'Accounts', date: '17 Apr, 03:15 PM', status: 'Completed' },
    { tokenNumber: 'L008', service: 'Library', date: '16 Apr, 10:30 AM', status: 'Completed' },
    { tokenNumber: 'X001', service: 'Accounts', date: '15 Apr, 04:00 PM', status: 'Cancelled' }
  ];

  // Merge real userTokens from backend with reference seed data
  const combinedTokens = [
    ...(activeToken ? [{
      id: activeToken.id,
      tokenNumber: activeToken.tokenNumber,
      service: activeToken.departmentName || activeToken.service,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: activeToken.status === 'CALLING' ? 'Serving' : 'Waiting',
      canCancel: true
    }] : []),
    ...(userTokens.map(t => ({
      id: t.id,
      tokenNumber: t.tokenNumber,
      service: t.departmentName || t.service,
      date: new Date(t.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) + ', ' + new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: t.status === 'COMPLETED' ? 'Completed' : (t.status === 'CANCELLED' ? 'Cancelled' : t.status),
      canCancel: t.status === 'WAITING' || t.status === 'CALLING'
    }))),
    ...referenceTokens
  ];

  // De-duplicate by tokenNumber
  const uniqueTokens = Array.from(
    new Map(combinedTokens.map(item => [item.tokenNumber, item])).values()
  );

  // Counts for top filter tabs
  const activeCount = uniqueTokens.filter(t => t.status === 'Waiting' || t.status === 'Serving' || t.status === 'CALLING').length;
  const completedCount = uniqueTokens.filter(t => t.status === 'Completed').length;
  const cancelledCount = uniqueTokens.filter(t => t.status === 'Cancelled' || t.status === 'SKIPPED').length;

  const filtered = uniqueTokens.filter(t => {
    let matchesTab = true;
    if (activeTab === 'ACTIVE') {
      matchesTab = (t.status === 'Waiting' || t.status === 'Serving' || t.status === 'CALLING');
    } else if (activeTab === 'COMPLETED') {
      matchesTab = (t.status === 'Completed');
    } else if (activeTab === 'CANCELLED') {
      matchesTab = (t.status === 'Cancelled' || t.status === 'SKIPPED');
    }

    const matchesSearch = 
      t.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.service.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleConfirmCancel = async () => {
    if (!tokenToCancel) return;
    setCancelling(true);
    try {
      await cancelToken(tokenToCancel.id || tokenToCancel.tokenNumber);
      setTokenToCancel(null);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button 
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Tokens
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              View your token history and current status.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs on Top - Matching Reference Image */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'COMPLETED'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'CANCELLED'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          Cancelled ({cancelledCount})
        </button>
        {activeTab !== 'ALL' && (
          <button
            onClick={() => setActiveTab('ALL')}
            className="text-xs text-blue-600 hover:underline px-2 cursor-pointer font-medium"
          >
            Show All
          </button>
        )}
      </div>

      {/* Search Input & Filter Button Row - Matching Reference Image */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <button 
          onClick={() => setActiveTab(activeTab === 'ALL' ? 'ACTIVE' : 'ALL')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
        </button>
      </div>

      {/* Data Table Card - Matching Reference Image */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-medium">
                <th className="py-3.5 px-5 font-semibold">Token No</th>
                <th className="py-3.5 px-5 font-semibold">Service</th>
                <th className="py-3.5 px-5 font-semibold">Date & Time</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => {
                  const isWaiting = item.status === 'Waiting' || item.status === 'Serving' || item.status === 'CALLING';
                  const isCompleted = item.status === 'Completed';
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.tokenNumber}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">
                        {item.service}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-5">
                        {isWaiting ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {item.status}
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {item.canCancel && (
                          <button
                            onClick={() => setTokenToCancel(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold transition-all cursor-pointer"
                            title="Cancel this token"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No tokens found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelTokenModal
        isOpen={!!tokenToCancel}
        onClose={() => setTokenToCancel(null)}
        onConfirm={handleConfirmCancel}
        token={tokenToCancel}
        loading={cancelling}
      />

    </div>
  );
};
