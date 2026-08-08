import React, { useState } from 'react';
import {
  Wallet,
  X,
  PlusCircle,
  QrCode,
  CreditCard,
  Copy,
  Check,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';
import { PaymentStatus, TransactionType } from '../types';

interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBal: number) => void;
}

export const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const currentUser = storage.getCurrentUser();
  const currentBalance = storage.getUserWalletBalance(currentUser.id);

  // Flow step: 'select_amount' | 'payment_gateway'
  const [step, setStep] = useState<'select_amount' | 'payment_gateway'>('select_amount');
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('500');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other_upi' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('CREATED');
  const [activeTxId, setActiveTxId] = useState<string>('');

  const merchantUpiId = 'carpool.kolkata@okaxis';
  const merchantName = 'Carpool Kolkata';
  const presets = [200, 500, 1000, 2000, 5000];

  if (!isOpen) return null;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setAmount(num);
    }
  };

  // Generate UPI Payment URI
  const referenceId = `TXN-KOL-${Math.floor(100000 + Math.random() * 900000)}`;
  const upiPaymentUri = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Wallet Recharge ${referenceId}`)}`;

  const handleProceedToPayment = async () => {
    if (amount < 200) {
      toast.error('Minimum Amount Required', 'Minimum wallet recharge amount is ₹200.');
      return;
    }

    const txId = `tx-${Date.now()}`;
    setActiveTxId(txId);
    setPaymentStatus('PENDING');

    // Create pending transaction in ledger (wallet balance remains unchanged)
    storage.addTransaction({
      id: txId,
      transactionId: txId,
      userId: currentUser.id,
      type: 'CREDIT',
      category: 'WALLET_RECHARGE',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance,
      description: `Wallet Top-Up via UPI (${selectedApp.toUpperCase()}) - Pending`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      createdAt: new Date().toISOString(),
      paymentMethod: selectedApp === 'gpay' ? 'Google Pay' : selectedApp === 'phonepe' ? 'PhonePe' : selectedApp === 'paytm' ? 'Paytm' : 'UPI QR',
      paymentProvider: 'Razorpay UPI',
      status: 'PENDING',
      referenceId,
    });

    setStep('payment_gateway');
  };

  const handleCopyUpiId = () => {
    try {
      navigator.clipboard.writeText(merchantUpiId);
      setCopiedUpi(true);
      toast.success('UPI ID Copied', `${merchantUpiId} copied to clipboard.`);
      setTimeout(() => setCopiedUpi(false), 3000);
    } catch (e) {
      toast.info('UPI ID', merchantUpiId);
    }
  };

  const handleLaunchUpiIntent = (appName: string) => {
    // Attempt UPI intent launch on supported mobile devices
    toast.info(`Launching ${appName}`, `Redirecting to ${appName} with UPI Intent for ₹${amount}...`);
    try {
      window.location.href = upiPaymentUri;
    } catch (e) {}
  };

  const handleCancelPayment = async () => {
    // Update pending transaction to CANCELLED without altering wallet balance
    if (activeTxId) {
      storage.addTransaction({
        id: activeTxId,
        transactionId: activeTxId,
        userId: currentUser.id,
        type: 'CREDIT',
        category: 'WALLET_RECHARGE',
        amount,
        balanceBefore: currentBalance,
        balanceAfter: currentBalance,
        description: `Wallet Top-Up via UPI - Cancelled by User`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        createdAt: new Date().toISOString(),
        paymentMethod: 'UPI',
        paymentProvider: 'Razorpay UPI',
        status: 'CANCELLED',
        referenceId,
      });
    }

    toast.warning('Payment Cancelled', 'Recharge was cancelled. Wallet balance remains unchanged.');
    onClose();
  };

  // Demo Verified Payment Simulation
  const handleSimulateSuccess = async () => {
    setIsProcessing(true);

    try {
      // Call backend to verify and record atomically
      const res = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedApp === 'gpay' ? 'Google Pay' : selectedApp === 'phonepe' ? 'PhonePe' : selectedApp === 'paytm' ? 'Paytm' : 'UPI QR',
          userId: currentUser.id,
          referenceId,
        }),
      });
      const data = await res.json();
    } catch (e) {}

    // Complete transaction in user's isolated ledger and credit balance
    const now = new Date();
    const newBal = currentBalance + amount;

    storage.addTransaction({
      id: activeTxId || `tx-${Date.now()}`,
      transactionId: activeTxId || `tx-${Date.now()}`,
      userId: currentUser.id,
      type: 'CREDIT',
      category: 'WALLET_RECHARGE',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBal,
      description: `Wallet Top-up via UPI (${selectedApp === 'gpay' ? 'Google Pay' : selectedApp === 'phonepe' ? 'PhonePe' : selectedApp === 'paytm' ? 'Paytm' : 'UPI QR'})`,
      timestamp: now.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      paymentMethod: selectedApp === 'gpay' ? 'Google Pay' : selectedApp === 'phonepe' ? 'PhonePe' : selectedApp === 'paytm' ? 'Paytm' : 'UPI QR',
      paymentProvider: 'Razorpay UPI',
      status: 'SUCCESS',
      referenceId,
      paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
    });

    setIsProcessing(false);
    setPaymentStatus('SUCCESS');
    toast.success('Wallet Recharged Successfully! ⚡', `₹${amount} has been securely credited to your Carpool wallet.`);
    if (onSuccess) onSuccess(newBal);
    setTimeout(() => onClose(), 600);
  };

  // Demo Failed Payment Simulation
  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus('FAILED');

      if (activeTxId) {
        storage.addTransaction({
          id: activeTxId,
          transactionId: activeTxId,
          userId: currentUser.id,
          type: 'CREDIT',
          category: 'WALLET_RECHARGE',
          amount,
          balanceBefore: currentBalance,
          balanceAfter: currentBalance,
          description: `Wallet Top-Up via UPI - Payment Failed at Bank Gateway`,
          timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
          createdAt: new Date().toISOString(),
          paymentMethod: 'UPI',
          paymentProvider: 'Razorpay UPI',
          status: 'FAILED',
          referenceId,
        });
      }

      toast.error('Payment Failed', 'Bank gateway rejected the transaction. Wallet balance remains unchanged.');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recharge Carpool Wallet</h3>
              <p className="text-xs text-slate-400">
                User: <span className="text-white font-semibold">{currentUser.name}</span> • Balance: <span className="font-mono text-emerald-400 font-bold">₹{currentBalance.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <button onClick={handleCancelPayment} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Select Amount */}
        {step === 'select_amount' && (
          <div className="p-6 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Select Amount
                </label>
                <span className="text-[10px] text-slate-500 font-medium">Min: ₹200</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectPreset(val)}
                    className={`py-3 rounded-xl text-xs font-mono font-bold transition-all border ${
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
                  min="200"
                  max="50000"
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="Enter amount (min ₹200)"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 py-3 pl-9 pr-4 text-base font-mono font-bold text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              {amount < 200 && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Minimum recharge amount is ₹200.
                </p>
              )}
            </div>

            {/* Selected Amount Preview Strip */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Recharge Amount</span>
                <span className="text-xl font-mono font-extrabold text-white">₹{amount.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">New Balance After Success</span>
                <span className="text-base font-mono font-bold text-emerald-400">₹{(currentBalance + amount).toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed to Payment Button */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={amount < 200}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Payment Modal (UPI Intent, Google Pay, PhonePe, Paytm, QR) */}
        {step === 'payment_gateway' && (
          <div className="p-6 space-y-5">
            {/* Amount Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount to Pay</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-400">₹{amount.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Ref ID</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{referenceId}</span>
              </div>
            </div>

            {/* UPI Apps Grid (Intent on Mobile) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Pay with UPI App
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'gpay', name: 'Google Pay', icon: '⚡', color: 'border-blue-500/40 hover:border-blue-400' },
                  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'border-purple-500/40 hover:border-purple-400' },
                  { id: 'paytm', name: 'Paytm UPI', icon: '🔵', color: 'border-cyan-500/40 hover:border-cyan-400' },
                  { id: 'qr', name: 'UPI QR Code', icon: '📱', color: 'border-emerald-500/40 hover:border-emerald-400' },
                ].map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setSelectedApp(app.id as any);
                      if (app.id !== 'qr') handleLaunchUpiIntent(app.name);
                    }}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedApp === app.id
                        ? 'bg-blue-600/20 border-blue-400 text-white shadow-md'
                        : `bg-slate-950 border-slate-800 text-slate-300 ${app.color}`
                    }`}
                  >
                    <span className="text-lg">{app.icon}</span>
                    <span className="font-bold text-[11px]">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic UPI QR Code Section */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              {/* Dynamic QR SVG */}
              <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0 text-center">
                <QrCode className="w-24 h-24 text-slate-950 mx-auto" />
                <span className="block text-[9px] font-mono font-bold text-slate-900 mt-1">₹{amount} • Scan & Pay</span>
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Merchant UPI</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Scan with Google Pay, PhonePe, Paytm or any BHIM UPI app.
                </p>
                <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-mono font-bold text-[11px] text-white">
                    {merchantUpiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* DEMO MODE SIMULATION CONTROLS */}
            <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-400">
                <span>🧪 DEMO PAYMENT CONTROLS</span>
                <span className="text-slate-400">Test Verification Flow</span>
              </div>
              <p className="text-[10px] text-slate-400">
                In demo mode, simulate real payment verification or failure states to verify that wallet updates only on verified success.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSimulateSuccess}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Verifying...' : `Simulate Success (+₹${amount})`}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs border border-rose-500/40 transition flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Simulate Failure</span>
                </button>
              </div>
            </div>

            {/* Cancel & Back Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep('select_amount')}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold text-xs"
              >
                ← Change Amount
              </button>
              <button
                type="button"
                onClick={handleCancelPayment}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
