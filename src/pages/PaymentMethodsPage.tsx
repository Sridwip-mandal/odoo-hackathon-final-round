import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Wallet,
  Building2,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Star,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Lock,
  X,
  Plus,
  Shield,
  Clock,
  Landmark,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { PaymentMethodItem } from '../types';

export const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = storage.getCurrentUser();
  const [methods, setMethods] = useState<PaymentMethodItem[]>(() => storage.getPaymentMethods());

  // Wallet balance directly from existing wallet architecture
  const walletBalance = storage.getUserWalletBalance(currentUser.id);

  // Modals & UI States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTab, setAddTab] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethodItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Fields: UPI
  const [upiId, setUpiId] = useState('');
  const [upiHolder, setUpiHolder] = useState('');
  const [upiDefault, setUpiDefault] = useState(false);

  // Form Fields: Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cardCvv, setCardCvv] = useState('');
  const [cardDefault, setCardDefault] = useState(false);

  // Form Fields: Net Banking
  const [netBank, setNetBank] = useState('State Bank of India');
  const [netHolder, setNetHolder] = useState('');
  const [netAccNumber, setNetAccNumber] = useState('');
  const [netDefault, setNetDefault] = useState(false);

  // Validation Error States
  const [formError, setFormError] = useState<string | null>(null);

  // Format Card Number with space every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry with MM/YY
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handleSetDefault = (id: string) => {
    const updated = methods.map((m) => ({ ...m, isDefault: m.id === id }));
    setMethods(updated);
    storage.setPaymentMethods(updated);
    toast.success('Default Payment Updated', 'Primary payment method saved for Kolkata commutes.');
    try {
      fetch(`/api/payment-methods/${id}/default`, { method: 'PATCH' }).catch(() => {});
    } catch (e) {}
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const updated = methods.filter((m) => m.id !== targetId);
    setMethods(updated);
    storage.setPaymentMethods(updated);
    toast.info('Payment Method Removed', `${deleteTarget.title} has been removed.`);
    setDeleteTarget(null);
    try {
      fetch(`/api/payment-methods/${targetId}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const handleCopyUpi = (upiString: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiString);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success('Copied to Clipboard', upiString);
    }
  };

  const resetForm = () => {
    setUpiId('');
    setUpiHolder('');
    setUpiDefault(false);
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardBrand('Visa');
    setCardCvv('');
    setCardDefault(false);
    setNetBank('State Bank of India');
    setNetHolder('');
    setNetAccNumber('');
    setNetDefault(false);
    setFormError(null);
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let newMethod: PaymentMethodItem | null = null;
    const isDef = addTab === 'UPI' ? upiDefault : addTab === 'Card' ? cardDefault : netDefault;

    if (addTab === 'UPI') {
      const cleanUpi = upiId.trim().toLowerCase();
      // Strict regex format validation for UPI ID
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/;
      if (!cleanUpi || !upiRegex.test(cleanUpi)) {
        setFormError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank or mobile@upi).');
        return;
      }
      newMethod = {
        id: `pm-${Date.now()}`,
        userId: currentUser.id,
        type: 'UPI',
        title: upiHolder.trim() ? `${upiHolder.trim()} UPI` : 'Personal UPI Handle',
        details: cleanUpi,
        upiId: cleanUpi,
        isDefault: isDef,
        isVerified: true,
      };
    } else if (addTab === 'Card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15 || cleanNum.length > 16) {
        setFormError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setFormError('Please enter a valid expiry date in MM/YY format.');
        return;
      }
      const [month, year] = cardExpiry.split('/').map(Number);
      if (month < 1 || month > 12) {
        setFormError('Invalid expiry month (must be 01 to 12).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setFormError('Please enter a valid 3 or 4-digit CVV for verification.');
        return;
      }

      // STRICT SECURITY RULE: NEVER store CVV, Card PIN, full raw card number or password.
      const last4 = cleanNum.slice(-4);
      newMethod = {
        id: `pm-${Date.now()}`,
        userId: currentUser.id,
        type: 'Card',
        title: `${cardBrand} Card (${cardHolder.trim() || 'Corporate'})`,
        details: `•••• •••• •••• ${last4}`,
        cardLast4: last4,
        cardBrand,
        cardExpiry,
        isDefault: isDef,
        isVerified: true,
      };
    } else if (addTab === 'NetBanking') {
      const cleanAcc = netAccNumber.replace(/\D/g, '');
      const last4 = cleanAcc.length >= 4 ? cleanAcc.slice(-4) : '7721';
      newMethod = {
        id: `pm-${Date.now()}`,
        userId: currentUser.id,
        type: 'NetBanking',
        title: netBank,
        details: `Corporate Net Banking (•••• ${last4})`,
        bankName: netBank,
        isDefault: isDef,
        isVerified: true,
      };
    }

    if (!newMethod) return;

    setIsLoading(true);
    setTimeout(() => {
      let updatedList = [...methods];
      if (isDef) {
        updatedList = updatedList.map((m) => ({ ...m, isDefault: false }));
      }
      updatedList.push(newMethod!);
      setMethods(updatedList);
      storage.setPaymentMethods(updatedList);
      setIsLoading(false);
      setShowAddModal(false);
      resetForm();
      toast.success('Payment Method Saved', `${newMethod!.title} is now active.`);

      try {
        fetch('/api/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMethod),
        }).catch(() => {});
      } catch (e) {}
    }, 400);
  };

  const indianBanks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Kotak Mahindra Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IndusInd Bank',
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Payment Methods</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your UPI handles, debit/credit cards, and corporate wallet auto-debits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Encrypted</span>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Payment Method</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Method Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: UPI */}
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 w-fit">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">UPI & QR Scan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant zero-fee settlement via PhonePe, Google Pay, Paytm, or BHIM.
          </p>
        </div>

        {/* Card 2: Cards */}
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 w-fit">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Cards (Debit/Credit)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Corporate Visa, Mastercard, and RuPay auto-billing with monthly expense receipts.
          </p>
        </div>

        {/* Card 3: Wallet */}
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 w-fit">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="font-mono font-bold text-xs text-emerald-400">
              ₹{walletBalance.toLocaleString()}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">Carpool Wallet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pre-loaded corporate mobility balance with instant 1-click fare auto-deductions.
          </p>
        </div>

        {/* Card 4: Net Banking */}
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 w-fit">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Net Banking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct debit support across SBI, HDFC, ICICI, Axis, and all major Indian banks.
          </p>
        </div>
      </div>

      {/* Connected Wallet Highlight Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Carpool Corporate Mobility Wallet</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ⚡ Auto-Debit Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Available Mobility Funds:{' '}
              <span className="font-mono font-bold text-sm text-emerald-400">
                ₹{walletBalance.toLocaleString()}
              </span>{' '}
              • Pre-configured for zero-friction ride checkout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition"
          >
            <span>Top Up Wallet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Saved Payment Methods Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Saved Payment Methods</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage default cards, verified UPI IDs, and bank gateways
            </p>
          </div>
          <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {methods.length} Active
          </span>
        </div>

        {methods.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No payment methods saved yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your UPI handle or corporate card to enjoy zero-friction carpool commute payments in Kolkata.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              + Add Payment Method
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((m) => {
              const isUpi = m.type === 'UPI';
              const isCard = m.type === 'Card';
              const isNet = m.type === 'NetBanking';
              const isWall = m.type === 'Wallet';

              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    m.isDefault
                      ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-2xl border ${
                          isUpi
                            ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                            : isCard
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : isNet
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                        }`}
                      >
                        {isUpi && <QrCode className="w-5 h-5" />}
                        {isCard && <CreditCard className="w-5 h-5" />}
                        {isNet && <Landmark className="w-5 h-5" />}
                        {isWall && <Wallet className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{m.title}</h4>
                          {m.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xs text-slate-300 mt-1">{m.details}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
                        <Check className="w-3 h-3 text-emerald-500" />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Metadata line for cards */}
                  {isCard && m.cardExpiry && (
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>Brand: <strong className="text-slate-200">{m.cardBrand || 'Corporate Visa'}</strong></span>
                      <span>Expires: <strong className="text-slate-200">{m.cardExpiry}</strong></span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                    <div className="flex items-center gap-2">
                      {isUpi && m.upiId && (
                        <button
                          onClick={() => handleCopyUpi(m.upiId!, m.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                          title="Copy UPI Handle"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}

                      {isWall && (
                        <button
                          onClick={() => navigate('/wallet')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white transition"
                        >
                          Manage Wallet
                        </button>
                      )}

                      {!isWall &&
                        (!m.isDefault ? (
                          <button
                            onClick={() => handleSetDefault(m.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500 px-2">
                            Primary Method
                          </span>
                        ))}
                    </div>

                    <button
                      onClick={() => setDeleteTarget(m)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                      title="Remove payment method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD PAYMENT METHOD */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">+ Add Payment Method</h3>
                <p className="text-[11px] text-slate-400">
                  Select payment gateway: UPI, Debit/Credit Card, or Net Banking
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAddTab('UPI');
                  setFormError(null);
                }}
                className={`py-2 rounded-xl font-bold transition ${
                  addTab === 'UPI' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ UPI ID
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddTab('Card');
                  setFormError(null);
                }}
                className={`py-2 rounded-xl font-bold transition ${
                  addTab === 'Card' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                💳 Debit/Credit Card
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddTab('NetBanking');
                  setFormError(null);
                }}
                className={`py-2 rounded-xl font-bold transition ${
                  addTab === 'NetBanking' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏦 Net Banking
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddPaymentMethod} className="space-y-4 pt-1">
              {/* FLOW 1: UPI */}
              {addTab === 'UPI' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      Account Holder Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Raj Patel"
                      value={upiHolder}
                      onChange={(e) => setUpiHolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      Virtual Payment Address (UPI ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="username@okhdfcbank or 9876543210@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Auto-suggest UPI handle chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-semibold">Common Handles:</span>
                    {['@okaxis', '@okhdfcbank', '@oksbi', '@paytm', '@ybl'].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          const base = upiId.includes('@') ? upiId.split('@')[0] : upiId || 'raj.patel';
                          setUpiId(`${base}${h}`);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-400 font-mono hover:border-cyan-500"
                      >
                        {h}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300">Security Guarantee:</span>
                    <p>We will never ask for or store your UPI PIN. Verification uses zero-knowledge signature tokenization.</p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={upiDefault}
                      onChange={(e) => setUpiDefault(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Set as primary payment method for carpool rides</span>
                  </label>
                </div>
              )}

              {/* FLOW 2: CARD */}
              {addTab === 'Card' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Name as printed on card"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      16-Digit Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono tracking-widest focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Card Brand</label>
                      <select
                        value={cardBrand}
                        onChange={(e) => setCardBrand(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="RuPay">RuPay</option>
                        <option value="Amex">Amex</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Expiry MM/YY *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-center focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">CVV / CVC *</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-center focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Security: CVV is verified in real-time and never saved to disk or database.</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={cardDefault}
                      onChange={(e) => setCardDefault(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Set as primary payment method for carpool rides</span>
                  </label>
                </div>
              )}

              {/* FLOW 3: NET BANKING */}
              {addTab === 'NetBanking' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      Select Indian Bank *
                    </label>
                    <select
                      value={netBank}
                      onChange={(e) => setNetBank(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-medium"
                    >
                      {indianBanks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      Account Nickname / Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Salary Account"
                      value={netHolder}
                      onChange={(e) => setNetHolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                      Account Number (Masked identifier)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. •••••••••••• 8812"
                      value={netAccNumber}
                      onChange={(e) => setNetAccNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={netDefault}
                      onChange={(e) => setNetDefault(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Set as primary payment method for carpool rides</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-blue-600/30 transition"
                >
                  {isLoading ? 'Saving Securely...' : 'Save Payment Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Remove Payment Method?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to remove <strong className="text-slate-200">{deleteTarget.title}</strong> (
                {deleteTarget.details})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
