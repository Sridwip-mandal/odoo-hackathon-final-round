import React, { useState } from 'react';
import { Wallet, X, PlusCircle, Check, QrCode, CreditCard, Sparkles } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';

interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('500');
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('raj@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = storage.getCurrentUser();
  const presets = [100, 250, 500, 1000];

  if (!isOpen) return null;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleRecharge = () => {
    if (amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid recharge amount.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      storage.addTransaction({
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'credit',
        amount,
        description: `Wallet Top-up via ${method} (${method === 'UPI' ? upiId : '•••• 4242'})`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        paymentMethod: method === 'UPI' ? 'UPI' : 'Card',
        status: 'success',
        referenceId: `TOPUP-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      toast.success('Wallet Recharged Successfully!', `₹${amount} added to your Carpool balance.`);
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recharge Carpool Wallet</h3>
              <p className="text-xs text-slate-400">
                Current Available Balance: <span className="font-mono text-emerald-400 font-bold">₹{currentUser.walletBalance}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preset Buttons matching wireframe page 6 */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
              Quick Select Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectPreset(val)}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    amount === val
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30 scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Or Enter Custom Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-base">₹</span>
              <input
                type="number"
                min="10"
                max="50000"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-9 pr-4 text-base font-mono font-bold text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Recharge Via
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition ${
                  method === 'UPI'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Card')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition ${
                  method === 'Card'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Corporate Card</span>
              </button>
            </div>
          </div>

          {method === 'UPI' && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <label className="text-[10px] text-slate-500 block mb-1">Enter UPI ID for Auto-Debit Mandate</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          )}

          {/* Add Money Button */}
          <button
            onClick={handleRecharge}
            disabled={isProcessing || amount <= 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span>Processing Recharge...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Add ₹ {amount} to Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
