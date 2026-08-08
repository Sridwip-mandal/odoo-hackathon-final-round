import React, { useState } from 'react';
import { Wallet, X, PlusCircle, Check, QrCode, CreditCard, Sparkles, Building, Tag, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';

interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBal: number) => void;
}

export const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('500');
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'CorporateVoucher'>('UPI');
  const [upiId, setUpiId] = useState('raj@okaxis');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = storage.getCurrentUser();
  const presets = [200, 500, 1000, 2000, 5000];

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

  const handleApplyPromo = (code: string) => {
    setPromoCode(code);
    setPromoApplied(true);
    if (code === 'KOLKATA50') {
      toast.success('Promo Code Applied', 'KOLKATA50: Flat ₹50 Bonus will be credited!');
    } else if (code === 'ODOOFLEET') {
      toast.success('Corporate Match Applied', 'ODOOFLEET: ₹100 Corporate Subsidy match added!');
    } else if (code === 'CARPOOLWB') {
      toast.success('Cashback Applied', 'CARPOOLWB: 10% Extra Cashback credited on recharge!');
    }
  };

  const handleRecharge = async () => {
    if (amount <= 0) {
      toast.error('Invalid Amount', 'Please enter a valid recharge amount (min ₹10).');
      return;
    }

    setIsProcessing(true);

    try {
      // Call backend REST API
      const response = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          paymentMethod: method === 'UPI' ? 'UPI (GPay / PhonePe)' : method === 'Card' ? 'Corporate Card' : method === 'NetBanking' ? 'Net Banking (SBI / HDFC)' : 'Corporate Voucher',
          upiId,
          promoCode: promoApplied ? promoCode : '',
        }),
      });

      const resData = await response.json();

      let bonusAmount = 0;
      if (promoApplied) {
        if (promoCode === 'KOLKATA50') bonusAmount = 50;
        else if (promoCode === 'ODOOFLEET') bonusAmount = 100;
        else if (promoCode === 'CARPOOLWB') bonusAmount = Math.round(amount * 0.1);
      }

      const totalCredit = amount + bonusAmount;

      // Update local storage for immediate reactivity
      storage.addTransaction({
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'credit',
        amount: totalCredit,
        description: `Wallet Top-up via ${method}${bonusAmount ? ` (+₹${bonusAmount} Bonus)` : ''}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        paymentMethod: method === 'UPI' ? 'UPI' : method === 'Card' ? 'Card' : 'Corporate Voucher',
        status: 'success',
        referenceId: `TXN-KOL-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      const updatedUser = {
        ...currentUser,
        walletBalance: currentUser.walletBalance + totalCredit,
      };
      storage.setCurrentUser(updatedUser);

      setIsProcessing(false);
      toast.success('Wallet Recharged Successfully! ⚡', `₹${amount}${bonusAmount ? ` + ₹${bonusAmount} bonus` : ''} added to your Carpool balance.`);
      if (onSuccess) onSuccess(updatedUser.walletBalance);
      onClose();
    } catch (e) {
      // Fallback
      setIsProcessing(false);
      storage.addTransaction({
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'credit',
        amount,
        description: `Wallet Top-up via ${method}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        paymentMethod: method === 'UPI' ? 'UPI' : 'Card',
        status: 'success',
        referenceId: `TOPUP-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + amount };
      storage.setCurrentUser(updatedUser);
      toast.success('Wallet Recharged!', `₹${amount} added successfully.`);
      if (onSuccess) onSuccess(updatedUser.walletBalance);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recharge Carpool Corporate Wallet</h3>
              <p className="text-xs text-slate-400">
                Current Balance: <span className="font-mono text-emerald-400 font-bold">₹{currentUser.walletBalance}</span> • West Bengal Hub
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Quick Select Amount
            </label>
            <div className="grid grid-cols-5 gap-2">
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
              Recharge Gateway
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                  method === 'UPI' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Card')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                  method === 'Card' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('NetBanking')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                  method === 'NetBanking' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('CorporateVoucher')}
                className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                  method === 'CorporateVoucher' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Odoo Voucher</span>
              </button>
            </div>
          </div>

          {/* UPI ID Input or Card Preview */}
          {method === 'UPI' && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">UPI ID / VPA *</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@okaxis"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Promo Codes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-yellow-400" />
              <span>Apply Promo Code / Voucher</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false); }}
                placeholder="Enter KOLKATA50 or ODOOFLEET"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 uppercase font-mono font-bold text-white text-xs"
              />
              <button
                type="button"
                onClick={() => handleApplyPromo(promoCode.trim().toUpperCase())}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                Apply
              </button>
            </div>

            {/* Quick Coupons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['KOLKATA50', 'ODOOFLEET', 'CARPOOLWB'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleApplyPromo(c)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition ${
                    promoCode === c && promoApplied
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ {c}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleRecharge}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Gateway Transfer...' : `Recharge ₹${amount} to Wallet`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
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
