import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Star,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { PaymentMethodItem } from '../types';

export const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [methods, setMethods] = useState(storage.getPaymentMethods());
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [upiIdInput, setUpiIdInput] = useState('raj@okaxis');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleSetDefault = (id: string) => {
    const updated = methods.map((m) => ({ ...m, isDefault: m.id === id }));
    setMethods(updated);
    storage.setPaymentMethods(updated);
    toast.success('Default Updated', 'Primary payment method saved.');
  };

  const handleDeleteMethod = (id: string) => {
    const updated = methods.filter((m) => m.id !== id);
    setMethods(updated);
    storage.setPaymentMethods(updated);
    toast.info('Payment Method Removed', 'Removed successfully.');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim()) return;

    const newMethod: PaymentMethodItem = {
      id: `pm-${Date.now()}`,
      userId: storage.getCurrentUser().id,
      type: 'Card',
      title: `${newCardHolder || 'Corporate'} Card`,
      details: `•••• ${newCardNumber.slice(-4) || '1234'} (Exp ${newCardExpiry || '12/29'})`,
      isDefault: false,
    };

    const updated = [...methods, newMethod];
    setMethods(updated);
    storage.setPaymentMethods(updated);
    toast.success('Card Added Successfully', 'Card saved for instant commute checkout.');
    setShowAddCardModal(false);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiIdInput);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header matching wireframe page 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Payment Methods</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Cash, Corporate Card, UPI handles, and Carpool Wallet
          </p>
        </div>

        <button
          onClick={() => setShowAddCardModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Corporate Card</span>
        </button>
      </div>

      {/* 4 Primary Payment Options Overview matching wireframe page 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 w-fit">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Cash Payment</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pay directly to your designated colleague driver upon arrival at the tech hub.
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 w-fit">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Card Payment</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Corporate Visa/Mastercard auto-billing with monthly consolidated expense invoices.
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 w-fit">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">UPI & QR Scan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant zero-fee settlement via PhonePe, Google Pay, Paytm, or BHIM.
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 w-fit">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Wallet Payment</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pre-loaded corporate mobility balance with instant 1-click fare deductions.
          </p>
        </div>
      </div>

      {/* UPI QR & Virtual Payment Interface matching wireframe page 4 */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI PAYMENT INFRASTRUCTURE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Instant UPI Handle & Dynamic QR Code
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use your company UPI ID for quick peer-to-peer carpool settlements or scan the QR code using any Indian banking app.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-xs">
                <span className="text-slate-500 mr-1.5 font-bold">@</span>
                <input
                  type="text"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  className="bg-transparent text-white font-mono font-bold focus:outline-none w-32"
                />
              </div>

              <button
                onClick={handleCopyUpi}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUpi ? 'Copied to Clipboard' : 'Copy UPI ID'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Graphic matching wireframe page 4 */}
          <div className="p-4 bg-white rounded-3xl shadow-2xl text-center shrink-0">
            <QrCode className="w-32 h-32 text-slate-950 mx-auto" />
            <span className="block text-[11px] font-mono font-bold text-slate-900 mt-2">
              Scan & Pay ₹120
            </span>
          </div>
        </div>
      </div>

      {/* Registered Saved Payment Methods List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <h3 className="text-base font-bold text-white">Your Saved Payment Methods</h3>

        <div className="divide-y divide-slate-800/80">
          {methods.map((method) => (
            <div key={method.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-slate-800 text-blue-400 border border-slate-700">
                  {method.type === 'Card' ? <CreditCard className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{method.title}</span>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">{method.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    Set as Default
                  </button>
                )}

                <button
                  onClick={() => handleDeleteMethod(method.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-scale-up space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Add Corporate Card</h3>
            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="Raj Patel"
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4532 8901 2345 6789"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="09/29"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
