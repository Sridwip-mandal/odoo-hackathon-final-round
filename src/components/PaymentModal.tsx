import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Star,
  Copy,
  Check,
  Receipt,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from './Toast';
import { User, Trip } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: Trip;
  fareAmount?: number;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  trip,
  fareAmount = 120,
  onSuccess,
}) => {
  const toast = useToast();
  const [selectedMethod, setSelectedMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('raj@okaxis');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentUser = storage.getCurrentUser();
  const currentWallet = currentUser.walletBalance;

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleProcessPayment = () => {
    if (selectedMethod === 'Wallet' && currentWallet < fareAmount) {
      toast.error('Insufficient Wallet Balance', `Please recharge your wallet or choose UPI/Card.`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Record transaction
      storage.addTransaction({
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'debit',
        amount: fareAmount,
        description: `Carpool Fare: ${trip?.startLocation || 'Park Street, Kolkata'} to ${trip?.destinationLocation || 'Sector V, Salt Lake, Kolkata'}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        paymentMethod: selectedMethod === 'Wallet' ? 'Wallet' : selectedMethod === 'Card' ? 'Card' : selectedMethod === 'UPI' ? 'UPI' : 'Cash',
        status: 'success',
        referenceId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // Update trip if passed
      if (trip) {
        storage.updateTrip({
          ...trip,
          paymentStatus: 'paid',
          paymentMethod: selectedMethod,
        });
      }

      setIsCompleted(true);
      toast.success('Payment completed successfully.', `₹${fareAmount} settled via ${selectedMethod}.`);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  const generateQrSvg = () => {
    // Elegant procedural SVG QR Code visualization
    return (
      <svg className="w-40 h-40 mx-auto rounded-xl p-2 bg-white shadow-lg" viewBox="0 0 100 100">
        {/* Finder patterns */}
        <rect x="5" y="5" width="26" height="26" fill="#0f172a" rx="4" />
        <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
        <rect x="13" y="13" width="10" height="10" fill="#0f172a" rx="2" />

        <rect x="69" y="5" width="26" height="26" fill="#0f172a" rx="4" />
        <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
        <rect x="77" y="13" width="10" height="10" fill="#0f172a" rx="2" />

        <rect x="5" y="69" width="26" height="26" fill="#0f172a" rx="4" />
        <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
        <rect x="13" y="77" width="10" height="10" fill="#0f172a" rx="2" />

        {/* Data clusters */}
        <rect x="36" y="10" width="8" height="8" fill="#0f172a" />
        <rect x="48" y="10" width="14" height="6" fill="#0f172a" />
        <rect x="36" y="24" width="26" height="6" fill="#0f172a" />
        <rect x="10" y="36" width="18" height="8" fill="#0f172a" />
        <rect x="34" y="36" width="12" height="12" fill="#2563eb" />
        <rect x="50" y="36" width="16" height="8" fill="#0f172a" />
        <rect x="70" y="36" width="20" height="14" fill="#0f172a" />
        <rect x="10" y="48" width="12" height="16" fill="#0f172a" />
        <rect x="26" y="54" width="8" height="10" fill="#0f172a" />
        <rect x="38" y="54" width="28" height="8" fill="#0f172a" />
        <rect x="70" y="54" width="24" height="12" fill="#0f172a" />
        <rect x="36" y="68" width="10" height="24" fill="#0f172a" />
        <rect x="50" y="68" width="20" height="8" fill="#0f172a" />
        <rect x="74" y="72" width="20" height="20" fill="#0f172a" />
        <rect x="50" y="80" width="16" height="12" fill="#0f172a" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>Trip Payment Checkout</span>
            </h3>
            <p className="text-xs text-slate-400">Total Payable Fare: ₹{fareAmount}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6 space-y-6">
            {/* Trip Brief Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Route:</span>
                <p className="font-semibold text-white mt-0.5">
                  {trip?.startLocation || 'Park Street, Kolkata'} → {trip?.destinationLocation || 'Sector V, Salt Lake, Kolkata'}
                </p>
                <p className="text-[11px] text-slate-400">Driver: {trip?.driverName || 'Raj Patel'} ({trip?.vehicleModel || 'Swift Dzire'})</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Fare Amount
                </span>
                <h4 className="text-2xl font-extrabold text-white font-mono mt-1">₹{fareAmount}</h4>
              </div>
            </div>

            {/* Payment Method Selector Pills matching wireframe page 4 */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                Select Preferred Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'UPI', label: 'UPI Payment', icon: QrCode },
                  { id: 'Card', label: 'Card Payment', icon: CreditCard },
                  { id: 'Wallet', label: 'Wallet Payment', icon: Wallet },
                  { id: 'Cash', label: 'Cash Payment', icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMethod(item.id as any)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/20 scale-[1.02]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Payment Method Details Panel */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {/* 1. UPI Option */}
              {selectedMethod === 'UPI' && (
                <div className="space-y-4 text-center">
                  <div className="text-xs text-slate-300">
                    Scan the dynamic QR code or pay to driver's corporate UPI ID:
                  </div>
                  {generateQrSvg()}
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono w-48 text-center"
                    />
                    <button
                      onClick={handleCopyUpi}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Card Option */}
              {selectedMethod === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Wallet Option */}
              {selectedMethod === 'Wallet' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Wallet Balance:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">₹{currentWallet}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deduction for Trip:</span>
                    <span className="font-bold text-rose-400 font-mono text-sm">- ₹{fareAmount}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold">
                    <span className="text-white">Remaining Balance:</span>
                    <span className="text-cyan-400 font-mono">₹{Math.max(0, currentWallet - fareAmount)}</span>
                  </div>
                </div>
              )}

              {/* 4. Cash Option */}
              {selectedMethod === 'Cash' && (
                <div className="text-center py-2 space-y-1 text-xs">
                  <Banknote className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-white">Direct Cash Settlement</p>
                  <p className="text-slate-400 text-[11px]">
                    Hand over exact change of ₹{fareAmount} to driver {trip?.driverName || 'Raj Patel'} upon journey completion.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Verifying Transaction...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹ {fareAmount} Now</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Receipt and Feedback View */
          <div className="p-6 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Payment Completed!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Transaction ID: <span className="font-mono text-cyan-400">TXN-9848102394</span>
              </p>
            </div>

            {/* Star Rating for Driver */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Rate your commute with {trip?.driverName || 'Raj Patel'}</p>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Leave feedback (e.g. Smooth driving, on time)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition"
            >
              Done & Return to Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
