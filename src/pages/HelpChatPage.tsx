import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  AlertTriangle,
  Clock,
  Paperclip,
  X,
  ExternalLink,
  MessageCircle,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useToast } from '../components/Toast';
import { FeedbackItem, SupportTicket, TicketPriority, TicketStatus } from '../types';

export const HelpChatPage: React.FC = () => {
  const toast = useToast();
  const currentUser = storage.getCurrentUser();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'help' | 'feedback' | 'tickets' | 'care' | 'helplines'>('help');

  // ----------------------------------------------------
  // A. HELP CENTER & FAQs STATE
  // ----------------------------------------------------
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  const faqCategories = [
    'All',
    'Ride Issues',
    'Payment Issues',
    'Driver Issues',
    'Passenger Issues',
    'Account Issues',
    'Cancellation & Refund',
    'Technical Problems',
    'Other',
  ];

  const faqs = [
    {
      id: 'faq-1',
      category: 'Ride Issues',
      question: 'How do I locate my driver at Kolkata pickup hubs (e.g. Sector V or Park Street)?',
      answer:
        'Once booked, check the Live Tracking page for real-time GPS telemetry of your vehicle along EM Bypass. You can also view the driver’s vehicle registration number (e.g. WB02AB1234) and exact landmark instructions in your Trip Details.',
    },
    {
      id: 'faq-2',
      category: 'Cancellation & Refund',
      question: 'What is the corporate carpool cancellation and refund policy?',
      answer:
        'Trips can be cancelled up to 15 minutes before the scheduled departure time with an instant 100% refund credited back to your Carpool Corporate Wallet. Driver cancellations result in an immediate automatic refund.',
    },
    {
      id: 'faq-3',
      category: 'Payment Issues',
      question: 'How does the Wallet Auto-Debit and Razorpay UPI recharge work?',
      answer:
        'Your Carpool Wallet automatically settles trip fares upon booking confirmation. You can top up your balance instantly using UPI (Google Pay, PhonePe, Paytm, BHIM) or corporate credit/debit cards with zero convenience fees.',
    },
    {
      id: 'faq-4',
      category: 'Driver Issues',
      question: 'How do I qualify and publish rides as an employee driver in Kolkata?',
      answer:
        'Navigate to "Offer Ride", select your registered corporate vehicle, enter your start corridor and campus destination, set available seats (1–4), and publish. Drivers earn ₹8.50/km in corporate mobility tax credits.',
    },
    {
      id: 'faq-5',
      category: 'Passenger Issues',
      question: 'What are the passenger cabin etiquette and luggage guidelines?',
      answer:
        'Please arrive 5 minutes prior to scheduled pickup at designated stops. Ensure your registered corporate badge is visible. Clean cabin etiquette is required, and luggage is restricted to standard laptop backpacks and small trolley bags.',
    },
    {
      id: 'faq-6',
      category: 'Account Issues',
      question: 'How do I update my Kolkata office hub or corporate contact details?',
      answer:
        'Go to Settings > Profile to update your designated office location (Sector V Tech Hub, Park Street, or New Town Campus) or emergency contact phone numbers.',
    },
    {
      id: 'faq-7',
      category: 'Technical Problems',
      question: 'The live GPS radar is not updating my transit position. What should I do?',
      answer:
        'Verify that browser location services are enabled for localhost/domain. In case of network delays, refresh the route or click "Recalculate Route" on the Find Ride page.',
    },
    {
      id: 'faq-8',
      category: 'Other',
      question: 'Are FASTag tolls and fuel subsidies covered by the enterprise?',
      answer:
        'Yes! All fleet and registered employee vehicles utilizing approved carpool corridors have electronic FASTag automated clearance subsidized by the Odoo Enterprise mobility pool.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCat = selectedFaqCategory === 'All' || f.category === selectedFaqCategory;
      if (!faqSearch) return matchesCat;
      const q = faqSearch.toLowerCase();
      return matchesCat && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    });
  }, [selectedFaqCategory, faqSearch, faqs]);

  // ----------------------------------------------------
  // B. FEEDBACK SYSTEM STATE
  // ----------------------------------------------------
  const [feedbackName, setFeedbackName] = useState(currentUser.name || '');
  const [feedbackEmail, setFeedbackEmail] = useState(currentUser.email || '');
  const [feedbackCategory, setFeedbackCategory] = useState('Ride Experience');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => storage.getFeedback());

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      toast.error('Required Field', 'Please enter your feedback message.');
      return;
    }

    setIsSubmittingFeedback(true);
    setTimeout(() => {
      const newItem: FeedbackItem = {
        id: `fb-${Date.now()}`,
        userId: currentUser.id,
        userName: feedbackName.trim() || currentUser.name,
        userEmail: feedbackEmail.trim() || currentUser.email,
        category: feedbackCategory,
        rating: feedbackRating,
        message: feedbackMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      storage.addFeedback(newItem);
      setFeedbacks(storage.getFeedback());
      setIsSubmittingFeedback(false);
      setFeedbackSuccess(true);
      setFeedbackMessage('');
      toast.success('Feedback Submitted', 'Thank you! Your feedback has been saved.');
    }, 400);
  };

  // ----------------------------------------------------
  // C. SUPPORT TICKET SYSTEM STATE
  // ----------------------------------------------------
  const [tickets, setTickets] = useState<SupportTicket[]>(() => storage.getTickets());
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [activeTicketDetail, setActiveTicketDetail] = useState<SupportTicket | null>(null);

  // Form Fields for new ticket
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Ride Issues');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('Medium');
  const [ticketAttachmentName, setTicketAttachmentName] = useState<string>('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // Ticket reply state
  const [ticketReplyInput, setTicketReplyInput] = useState('');

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error('Required Fields', 'Subject and description cannot be empty.');
      return;
    }

    setIsCreatingTicket(true);
    setTimeout(() => {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const ticketNumber = `CK-${randNum}`;
      const now = new Date().toISOString();

      const newTicket: SupportTicket = {
        id: `tkt-${Date.now()}`,
        ticketNumber,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        subject: ticketSubject.trim(),
        category: ticketCategory,
        description: ticketDescription.trim(),
        priority: ticketPriority,
        attachment: ticketAttachmentName || undefined,
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
        replies: [
          {
            id: `rep-${Date.now()}`,
            ticketId: `tkt-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: 'employee',
            message: ticketDescription.trim(),
            createdAt: now,
          },
        ],
      };

      storage.addTicket(newTicket);
      setTickets(storage.getTickets());
      setIsCreatingTicket(false);
      setShowCreateTicketModal(false);
      setTicketSubject('');
      setTicketDescription('');
      setTicketAttachmentName('');
      toast.success('Support Ticket Created', `Ticket #${ticketNumber} generated successfully.`);
    }, 400);
  };

  const handleSendTicketReply = () => {
    if (!activeTicketDetail || !ticketReplyInput.trim()) return;
    const now = new Date().toISOString();
    const newReply = {
      id: `rep-${Date.now()}`,
      ticketId: activeTicketDetail.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'employee',
      message: ticketReplyInput.trim(),
      createdAt: now,
    };

    storage.addTicketReply(activeTicketDetail.id, newReply);
    const updated = storage.getTickets();
    setTickets(updated);
    const fresh = updated.find((t) => t.id === activeTicketDetail.id) || null;
    setActiveTicketDetail(fresh);
    setTicketReplyInput('');
    toast.info('Reply Sent', 'Your message was added to ticket thread.');
  };

  // ----------------------------------------------------
  // D. LIVE CHAT ASSISTANT STATE
  // ----------------------------------------------------
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `Hello ${currentUser.name}! I am your Carpool Kolkata Concierge Assistant. How can I assist you with your Sector V / Park Street commute, wallet auto-debits, or fleet guidelines today?`,
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (customText?: string) => {
    const query = customText || chatInput;
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: query, time }]);
    setChatInput('');

    setTimeout(() => {
      let botResponse =
        'Thank you for reaching out. Our Kolkata Mobility Operations Desk is actively monitoring routes along Sector V and EM Bypass. How else may I assist you?';
      const q = query.toLowerCase();
      if (q.includes('fare') || q.includes('cost') || q.includes('price')) {
        botResponse =
          'Standard pooled fares in Kolkata range between ₹45 to ₹120 depending on corridor distance (e.g. Park Street to Sector V is ~₹45 per seat with FASTag subsidy).';
      } else if (q.includes('cancel') || q.includes('refund')) {
        botResponse =
          'Cancellations made 15 minutes before departure are 100% refunded instantly to your Carpool Wallet.';
      } else if (q.includes('sos') || q.includes('emergency') || q.includes('police')) {
        botResponse =
          '🚨 For immediate emergency assistance, call Kolkata Police at 100 / 112 or click the Important Helplines tab above.';
      } else if (q.includes('driver') || q.includes('offer')) {
        botResponse =
          'To publish a ride as a verified employee driver, navigate to "Offer Ride" in the sidebar and choose your departure time.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botResponse, time }]);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12 text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Help & Support Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              24/7 Corporate Mobility Desk
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search knowledge base, create support tickets, submit feedback, or reach Kolkata customer care.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateTicketModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-x-auto">
        {[
          { id: 'help', label: 'Help Center & FAQs', icon: HelpCircle },
          { id: 'feedback', label: 'Share Feedback', icon: Star },
          { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: FileText },
          { id: 'care', label: 'Customer Care & Live Assistant', icon: MessageCircle },
          { id: 'helplines', label: '🚨 Important Helplines', icon: ShieldAlert },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: HELP CENTER & SEARCHABLE FAQS */}
      {/* ========================================================================= */}
      {activeTab === 'help' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search help topics, payment guides, route matching rules, cancellation policies..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none shadow-xl"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
                  selectedFaqCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-slate-800 bg-slate-900/80 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-bold text-white">No matching FAQ found</p>
                <p className="text-xs text-slate-400">Try searching for other keywords or submit a support ticket.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700">
                          {faq.category}
                        </span>
                        <span className="font-bold text-sm text-white">{faq.question}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-800/60 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: FEEDBACK SYSTEM */}
      {/* ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Feedback Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-white">Share Your Feedback</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your feedback directly impacts driver ratings, route availability, and vehicle comfort across Kolkata.
              </p>
            </div>

            {feedbackSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-emerald-300">
                    Thank you! Your feedback has been submitted successfully.
                  </div>
                  <div className="text-xs text-emerald-400/90">
                    Your ratings and notes have been securely saved to our database.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Category *</label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Ride Experience">Ride Experience</option>
                    <option value="Driver Experience">Driver Experience</option>
                    <option value="Payment">Payment</option>
                    <option value="App/Website">App/Website</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                    Rating (★★★★★) *
                  </label>
                  <div className="flex items-center gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= feedbackRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-mono font-bold text-xs text-amber-400">{feedbackRating} / 5.0</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                  Feedback Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Share details of your experience, carpool vehicle cleanliness, route suggestions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-emerald-600/30 transition text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </form>
          </div>

          {/* Feedback History & Community Notes (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Recent Feedback Submissions</h3>
              <span className="text-[10px] font-mono text-slate-400">{feedbacks.length} Saved</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {feedbacks.map((f) => (
                <div key={f.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{f.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(f.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{f.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                      {f.category}
                    </span>
                    <span>{f.createdAt.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: EMPLOYEE SUPPORT TICKET SYSTEM */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white">Support Tickets & Service Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Track issues with vehicle dispatch, corporate payments, and transit safety tickets.
              </p>
            </div>
            <button
              onClick={() => setShowCreateTicketModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 transition text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Support Ticket</span>
            </button>
          </div>

          {/* Tickets Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{t.ticketNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{t.subject}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            t.priority === 'High'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : t.priority === 'Medium'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${
                            t.status === 'OPEN'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : t.status === 'IN PROGRESS'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : t.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {t.createdAt.split('T')[0]}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setActiveTicketDetail(t)}
                          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition"
                        >
                          View Thread
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION D: CUSTOMER CARE & LIVE CONCIERGE ASSISTANT */}
      {/* ========================================================================= */}
      {activeTab === 'care' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Customer Care Options (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white">Need immediate help?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect with our dedicated Kolkata Mobility Operations Team.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:+913340001234"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/60 hover:border-blue-500/40 transition group"
                >
                  <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:scale-110 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Call Customer Care</h4>
                    <p className="font-mono text-[11px] text-cyan-300">+91 33 4000 1234</p>
                    <span className="text-[10px] text-slate-500">Kolkata Office Desk (Ext 804) • 8 AM - 10 PM</span>
                  </div>
                </a>

                <a
                  href="mailto:support@carpool-kolkata.odoo.com"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/60 hover:border-blue-500/40 transition group"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Email Support</h4>
                    <p className="font-mono text-[11px] text-emerald-300">support@carpool-kolkata.odoo.com</p>
                    <span className="text-[10px] text-slate-500">Guaranteed 2-hour SLA response</span>
                  </div>
                </a>

                <div
                  onClick={() => setShowCreateTicketModal(true)}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/60 hover:border-blue-500/40 transition group cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Submit Support Ticket</h4>
                    <p className="text-[11px] text-slate-300">Formal issue tracking with unique ticket ID</p>
                    <span className="text-[10px] text-slate-500">Auto-routed to regional transport lead</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 text-[11px] space-y-1">
              <span className="font-bold text-slate-200">Kolkata Operations Hub:</span>
              <p>Odoo Mobility Center, Sector V, Salt Lake, Kolkata, West Bengal 700091</p>
            </div>
          </div>

          {/* Interactive AI Concierge Chat (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col h-[520px] overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Mobility Assistant</h3>
                  <span className="text-[10px] text-emerald-400 font-semibold">• Online & Ready</span>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40 text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
              {[
                'What are the standard commute fares?',
                'How do cancellations work?',
                'Emergency SOS protocol',
                'How to publish a ride?',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask anything about Kolkata carpooling, route rules, or payments..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION E: IMPORTANT HELPLINES (OFFICIAL EMERGENCY & SAFETY) */}
      {/* ========================================================================= */}
      {activeTab === 'helplines' && (
        <div className="space-y-6 animate-fade-in">
          {/* Visual Alert Banner */}
          <div className="p-6 rounded-3xl border border-rose-500/40 bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/60 shadow-2xl text-white space-y-2">
            <div className="flex items-center gap-2.5 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5" />
              <span>Official Kolkata Emergency & Transit Helplines</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              These are verified government emergency contacts for West Bengal and Kolkata Metropolitan corridors. All
              numbers are toll-free and active 24 hours a day, 7 days a week.
            </p>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'National Emergency SOS',
                number: '112',
                desc: 'Unified all-in-one emergency service for Police, Fire & Medical dispatch across India.',
                tag: 'Toll-Free 24/7',
                color: 'rose',
              },
              {
                title: 'Kolkata Police Control Room',
                number: '100',
                desc: 'Direct dispatch to Kolkata City Police patrol units across Sector V, Park Street & EM Bypass.',
                tag: 'Kolkata Police',
                color: 'rose',
              },
              {
                title: 'Women Safety Helpline',
                number: '1091 / 181',
                desc: 'Dedicated round-the-clock women safety assistance and transit emergency escort.',
                tag: 'Women Safety',
                color: 'purple',
              },
              {
                title: 'Kolkata Traffic Police Helpline',
                number: '1073',
                desc: 'Live traffic congestion, road blockage, accident reports, and route diversions.',
                tag: 'Traffic Control',
                color: 'amber',
              },
              {
                title: 'National Highway Helpline',
                number: '1033',
                desc: 'Highway breakdown, emergency towing, and ambulance on NH-12, NH-16, and expressways.',
                tag: 'NHAI Express',
                color: 'cyan',
              },
              {
                title: 'Emergency Medical Ambulance',
                number: '108 / 102',
                desc: 'Instant emergency medical technician and ambulance dispatch in West Bengal.',
                tag: 'Ambulance',
                color: 'emerald',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.tag}
                    </span>
                    <Flame className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>

                <a
                  href={`tel:${item.number.split('/')[0].trim()}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition group"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
                    <span className="font-mono font-extrabold text-base text-white">{item.number}</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Dial Now →</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE SUPPORT TICKET */}
      {/* ========================================================================= */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">+ Create Support Ticket</h3>
                <p className="text-[11px] text-slate-400">Generate a tracked ticket for corporate mobility issues</p>
              </div>
              <button
                onClick={() => setShowCreateTicketModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fare mismatch on Sector V trip, vehicle delay..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Category *</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Ride Issues">Ride Issues</option>
                    <option value="Payment Issues">Payment Issues</option>
                    <option value="Driver Issues">Driver Issues</option>
                    <option value="Passenger Issues">Passenger Issues</option>
                    <option value="Account Issues">Account Issues</option>
                    <option value="Cancellation & Refund">Cancellation & Refund</option>
                    <option value="Technical Problems">Technical Problems</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Priority *</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide all relevant details: trip ID, date/time, vehicle plate, or transaction reference..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold uppercase text-[10px] block mb-1">
                  Attachment (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setTicketAttachmentName(e.target.files[0].name);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTicket}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-blue-600/30 transition"
                >
                  {isCreatingTicket ? 'Generating...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TICKET THREAD DETAILS */}
      {/* ========================================================================= */}
      {activeTicketDetail && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-xs">
          <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-sm text-cyan-400">
                    Ticket #{activeTicketDetail.ticketNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {activeTicketDetail.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{activeTicketDetail.subject}</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Category: {activeTicketDetail.category} • Created: {activeTicketDetail.createdAt.split('T')[0]}
                </p>
              </div>
              <button
                onClick={() => setActiveTicketDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              {activeTicketDetail.replies && activeTicketDetail.replies.length > 0 ? (
                activeTicketDetail.replies.map((r) => {
                  const isAdmin = r.senderRole === 'admin';
                  return (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-2xl border ${
                        isAdmin
                          ? 'bg-blue-950/40 border-blue-500/30 text-blue-100 ml-4'
                          : 'bg-slate-900 border-slate-800 text-slate-200 mr-4'
                      } space-y-1`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {r.senderName} {isAdmin && <span className="text-cyan-400 font-normal">[Staff Lead]</span>}
                        </span>
                        <span className="font-mono text-slate-500">{r.createdAt.split('T')[0]}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{r.message}</p>
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-500 text-center py-4">No messages yet.</div>
              )}
            </div>

            {/* Reply Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message / update..."
                value={ticketReplyInput}
                onChange={(e) => setTicketReplyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSendTicketReply}
                disabled={!ticketReplyInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
