import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  CreditCard,
  QrCode,
  Search,
  Download,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { RechargeWalletModal } from '../components/RechargeWalletModal';
import { useToast } from '../components/Toast';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = storage.getCurrentUser();
  const transactions = storage.getTransactions();

  const filteredTx = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalCredits = transactions.filter((t) => t.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebits = transactions.filter((t) => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header matching wireframe page 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Corporate Wallet</h1>
          <p className="text-xs text-slate-400 mt-1">
            Recharge balance, view travel subsidies, and manage ride transactions
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
            onClick={() => setShowRechargeModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Recharge Wallet</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance Hero Card matching wireframe page 6 */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              <span>Available Wallet Balance</span>
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              ₹ {currentUser.walletBalance.toLocaleString()}
            </h2>
            <p className="text-xs text-slate-400">
              Auto-debits when you complete rides with verified colleagues.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Top-ups</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">+₹{totalCredits.toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Ride Expenses</span>
              <span className="text-base font-bold text-rose-400 mt-1 block">-₹{totalDebits.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Wallet Transaction History</h3>
            <p className="text-xs text-slate-400">Record of all ride payments and corporate allowances</p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search transactions..."
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
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={() => toast.info('Statement Exported', 'CSV download initiated.')}
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
                <th className="py-3 px-4">Transaction Reference</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTx.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white text-[11px] font-sans">
                      {tx.referenceId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-sans text-xs">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {tx.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-sans font-bold">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-sm">
                      <span className={isCredit ? 'text-emerald-400' : 'text-rose-400'}>
                        {isCredit ? '+' : '-'}₹{tx.amount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Wallet Modal */}
      {showRechargeModal && (
        <RechargeWalletModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
        />
      )}
    </div>
  );
};
