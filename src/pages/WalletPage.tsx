import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  PlusCircle,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { RechargeWalletModal } from '../components/RechargeWalletModal';
import { useToast } from '../components/Toast';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [initialAmount, setInitialAmount] = useState<number>(500);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = storage.getCurrentUser();
  const [walletBalance, setWalletBalance] = useState<number>(() => storage.getUserWalletBalance(currentUser.id));
  const [transactions, setTransactions] = useState(() => storage.getTransactions(currentUser.id));

  // Sync isolated balance and ledger
  const refreshWallet = () => {
    const bal = storage.getUserWalletBalance(currentUser.id);
    setWalletBalance(bal);
    setTransactions(storage.getTransactions(currentUser.id));
  };

  useEffect(() => {
    refreshWallet();
    const handleUpdate = () => refreshWallet();
    window.addEventListener('carpool_storage_update', handleUpdate);
    return () => window.removeEventListener('carpool_storage_update', handleUpdate);
  }, [currentUser.id]);

  const filteredTx = transactions.filter((tx) => {
    const isCredit = tx.type === 'credit' || tx.type === 'CREDIT';
    if (filterType === 'credit' && !isCredit) return false;
    if (filterType === 'debit' && isCredit) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.referenceId && tx.referenceId.toLowerCase().includes(q)) ||
        (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCredits = transactions
    .filter((t) => (t.type === 'credit' || t.type === 'CREDIT') && (t.status === 'SUCCESS' || t.status === 'success'))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalDebits = transactions
    .filter((t) => (t.type === 'debit' || t.type === 'DEBIT') && (t.status === 'SUCCESS' || t.status === 'success'))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleOpenPreset = (amt: number) => {
    setInitialAmount(amt);
    setShowRechargeModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Corporate Wallet & Payments</h1>
          <p className="text-xs text-slate-400 mt-1">
            User: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.email}) • Employee ID: <span className="font-mono text-cyan-400 font-bold">{currentUser.employeeId || currentUser.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/payment-methods')}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
          >
            Payment Methods →
          </button>

          <button
            onClick={() => handleOpenPreset(500)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Recharge Wallet Now</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              <span>Current Available Balance ({currentUser.name})</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              ₹ {walletBalance.toLocaleString()}
            </h2>
            <p className="text-xs text-slate-400">
              Isolated user balance. Auto-debits on confirmed commute trips and credits on verified UPI recharge.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Recharged</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">+₹{totalCredits.toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Ride Expenses</span>
              <span className="text-base font-bold text-rose-400 mt-1 block">-₹{totalDebits.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Recharge Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-400">⚡ Quick Recharge Presets:</span>
          <div className="flex flex-wrap items-center gap-2">
            {[200, 500, 1000, 2000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleOpenPreset(amt)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-200 font-mono font-bold transition shadow-sm"
              >
                +₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Wallet Transaction Ledger</h3>
            <p className="text-xs text-slate-400">Audit trail of all verified UPI top-ups, ride debits, and cancellations</p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              {(['all', 'credit', 'debit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] transition ${
                    filterType === type ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={() => toast.info('Statement Exported', 'CSV statement with transaction references downloaded.')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Download Statement"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction ID & Ref</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans text-xs">
                    No wallet transactions recorded for this user yet.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => {
                  const isCredit = tx.type === 'credit' || tx.type === 'CREDIT';
                  const isSuccess = tx.status === 'SUCCESS' || tx.status === 'success';
                  const isFailed = tx.status === 'FAILED' || tx.status === 'failed';
                  const isCancelled = tx.status === 'CANCELLED';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-bold text-white text-[11px] font-sans">
                        <div>{tx.referenceId || `TX-${tx.id.slice(-6).toUpperCase()}`}</div>
                        {tx.paymentId && <span className="text-[10px] text-cyan-400 font-mono block">PID: {tx.paymentId}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 font-sans text-xs">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSuccess
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isFailed
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : isCancelled
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                          {isFailed && <XCircle className="w-3 h-3" />}
                          {isCancelled && <Ban className="w-3 h-3" />}
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-sans font-bold">
                          {tx.paymentMethod || 'UPI Intent'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {tx.timestamp || (tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Today')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-sm">
                        <span className={!isSuccess ? 'text-slate-500 line-through' : isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isCredit ? '+' : '-'}₹{tx.amount}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Wallet Modal */}
      {showRechargeModal && (
        <RechargeWalletModal
          isOpen={showRechargeModal}
          onClose={() => {
            setShowRechargeModal(false);
            refreshWallet();
          }}
          onSuccess={(newBal) => {
            setWalletBalance(newBal);
            refreshWallet();
          }}
        />
      )}
    </div>
  );
};
