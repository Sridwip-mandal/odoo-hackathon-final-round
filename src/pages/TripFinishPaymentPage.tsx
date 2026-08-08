import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Check,
  Star,
  Receipt,
  Download,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';

export const TripFinishPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('raj@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [rating, setRating] = useState(5);

  const currentUser = storage.getCurrentUser();
  const trips = storage.getTrips();
  const trip = trips[0];
  const fare = trip?.fare || 120;

  const handlePayNow = () => {
    if (paymentMethod === 'Wallet' && currentUser.walletBalance < fare) {
      toast.error('Insufficient Wallet Balance', 'Please recharge wallet or select UPI/Card.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      storage.addTransaction({
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        type: 'debit',
        amount: fare,
        description: `Trip Finish Payment: ${trip.startLocation} to ${trip.destinationLocation}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        paymentMethod: paymentMethod,
        status: 'success',
        referenceId: `RIDE-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      storage.updateTrip({
        ...trip,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod,
      });

      setIsPaid(true);
      toast.success('Payment completed successfully.', `₹${fare} settled for completed journey.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header matching wireframe page 7 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/my-trips')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <span className="text-xs font-mono text-cyan-400">Journey Concluded</span>
      </div>

      {/* Main Finish & Payment Card matching wireframe page 7 & 4 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Trip Completed Successfully
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Trip Summary & Fare Settlement</h1>
          <p className="text-xs text-slate-400">
            Verify route milestones and settle fare through your corporate mobility account
          </p>
        </div>

        {/* Route Details Box matching wireframe page 7 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                {trip.driverName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {trip.startLocation.split(',')[0]} to {trip.destinationLocation.split(',')[0]}
                </h3>
                <p className="text-xs text-slate-400">Driver: {trip.driverName} ({trip.vehicleModel})</p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <span className="text-white font-bold">{trip.time}</span> • {trip.date}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Pick UP Point</span>
              <p className="font-semibold text-white">{trip.startLocation}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">Drop Point</span>
              <p className="font-semibold text-white">{trip.destinationLocation}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">Total Fare</span>
              <p className="text-2xl font-extrabold text-white font-mono">₹ {fare}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Section matching wireframe page 4 */}
        {!isPaid ? (
          <div className="space-y-6 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Choose Preferred Payment Method
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Cash', label: 'Cash Payment', icon: Banknote },
                  { id: 'Card', label: 'Card Payment', icon: CreditCard },
                  { id: 'UPI', label: 'UPI Payment', icon: QrCode },
                  { id: 'Wallet', label: 'Wallet Payment', icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-xl shadow-blue-600/20 scale-[1.02]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UPI QR & ID Detail Panel matching wireframe page 4 */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">UPI ID & Instant QR</span>
                  <p className="text-xs text-slate-400">
                    Supports Google Pay, PhonePe, Paytm, and corporate BHIM UPI.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-mono text-cyan-400 font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      @{upiId}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">• Verified Merchant</span>
                  </div>
                </div>

                {/* Simulated QR Box matching wireframe page 4 */}
                <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0">
                  <QrCode className="w-24 h-24 text-slate-950" />
                  <span className="block text-center text-[10px] font-mono font-bold text-slate-900 mt-1">Scan to Pay</span>
                </div>
              </div>
            )}

            {paymentMethod === 'Wallet' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Available Corporate Wallet:</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-base">₹{currentUser.walletBalance}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Balance After Debit:</span>
                  <span className="font-extrabold text-cyan-400 font-mono text-base">
                    ₹{Math.max(0, currentUser.walletBalance - fare)}
                  </span>
                </div>
              </div>
            )}

            {/* Pay Now Button matching wireframe */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition hover:scale-[1.01] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Executing Settlement...</span>
                </>
              ) : (
                <span>Pay ₹ {fare}</span>
              )}
            </button>
          </div>
        ) : (
          /* Receipt view after success */
          <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Payment Received!</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Paid ₹{fare} via {paymentMethod} • Receipt #RCP-984820
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/ride-history')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Go to Ride History
              </button>
              <button
                onClick={() => toast.info('Receipt Downloaded', 'PDF invoice saved.')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download Tax Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
