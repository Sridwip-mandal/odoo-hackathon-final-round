import React, { useState } from 'react';
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
  Star,
  MessageCircleHeart,
  ThumbsUp,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { storage } from '../utils/storage';
import { UserFeedback } from '../types';

export const HelpChatPage: React.FC = () => {
  const toast = useToast();
  const currentUser = storage.getCurrentUser();

  // Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am your Carpool Mobility Assistant. How can I assist you with your Kolkata commute, route navigation, fuel reimbursement, or vehicle registration today?',
      time: '11:00 AM',
    },
  ]);
  const [input, setInput] = useState('');

  // Feedback Form State
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>(storage.getFeedbacks());
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<UserFeedback['category']>('Ride Experience');
  const [routeInput, setRouteInput] = useState('Park Street → Sector V, Salt Lake, Kolkata');
  const [comments, setComments] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'feedback'>('feedback');

  const quickQuestions = [
    'How does corporate fuel reimbursement work?',
    'What is the emergency SOS protocol?',
    'How do I add multiple Kolkata pickup stops?',
    'What are the carpool cancellation policies?',
  ];

  const handleSend = (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: q, time }]);
    setInput('');

    setTimeout(() => {
      let reply = "Thank you for reaching out. Our corporate mobility policy mandates that every verified passenger earns the driver ₹8.00/km in fuel tax credits.";
      if (q.toLowerCase().includes('sos') || q.toLowerCase().includes('emergency')) {
        reply = "In case of emergency during a live ride, click the red 'Emergency SOS' button on the Live Tracking screen. This immediately alerts the Security Operations Center and shares live GPS coordinates.";
      } else if (q.toLowerCase().includes('cancellation') || q.toLowerCase().includes('cancel')) {
        reply = "Rides can be cancelled up to 15 minutes before scheduled departure with 100% instant refund directly back to your Carpool Corporate Wallet.";
      } else if (q.toLowerCase().includes('pickup') || q.toLowerCase().includes('stop')) {
        reply = "You can add custom waypoints along the Kolkata EM Bypass / Sector V corridor in the Notes section when publishing or booking your ride.";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply, time }]);
    }, 700);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      toast.error('Required Field', 'Please provide a few words about your carpooling experience.');
      return;
    }

    setIsSubmittingFeedback(true);
    setTimeout(() => {
      const newFeedback: UserFeedback = {
        id: `fb-${Date.now()}`,
        userName: currentUser.name || 'Priya Mukherjee',
        userEmail: currentUser.email || 'priya.m@odoo.com',
        category,
        rating,
        route: routeInput,
        comments: comments.trim(),
        status: 'Received',
        createdAt: 'Just now',
      };

      storage.addFeedback(newFeedback);
      setFeedbacks(storage.getFeedbacks());
      setComments('');
      setIsSubmittingFeedback(false);
      toast.success('Feedback Submitted!', 'Thank you! Your feedback helps us improve Kolkata corporate mobility.');
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Help, Support & User Feedback</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            24/7 AI mobility concierge, corporate ride feedback, and employee safety assistance
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'feedback'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span>User Feedback Form</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Concierge Chat</span>
          </button>
        </div>
      </div>

      {activeTab === 'feedback' ? (
        /* ================= USER FEEDBACK SECTION ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Feedback Submission Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <MessageCircleHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Share Your Ride & Platform Feedback</h3>
                <p className="text-xs text-slate-400">Help us enhance driver ratings, map precision, and Kolkata commute comfort</p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-5 text-xs">
              {/* Star Rating */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Overall Ride & Platform Satisfaction *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 font-mono font-extrabold text-sm text-yellow-400">
                    {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent (5.0)' : rating === 4 ? '⭐⭐⭐⭐ Good (4.0)' : rating === 3 ? '⭐⭐⭐ Average (3.0)' : rating === 2 ? '⭐⭐ Needs Work (2.0)' : '⭐ Poor (1.0)'}
                  </span>
                </div>
              </div>

              {/* Feedback Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Feedback Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-white font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="Ride Experience">🚗 Ride Experience & Driving Quality</option>
                  <option value="App Usability & Map">🛰️ Map & Satellite Navigation Accuracy</option>
                  <option value="Driver / Passenger Rating">⭐ Driver & Co-Passenger Etiquette</option>
                  <option value="Billing & UPI Payment">💳 Billing, UPI & Wallet Subsidies</option>
                  <option value="Feature Request & Suggestion">💡 Feature Request & Suggestions</option>
                </select>
              </div>

              {/* Commute Route */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Commute Route / Corridor
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={routeInput}
                    onChange={(e) => setRouteInput(e.target.value)}
                    placeholder="e.g. Park Street → Sector V, Salt Lake, Kolkata"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Comments */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Your Detailed Feedback & Comments *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">{comments.length}/500</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what went well or how we can make your daily Kolkata carpooling commute better..."
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Recommendation Checkbox */}
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-950 transition">
                <input
                  type="checkbox"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-none bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300 font-medium">
                  I would recommend this colleague/carpool route to other team members.
                </span>
              </label>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmittingFeedback || !comments.trim()}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
              >
                {isSubmittingFeedback ? (
                  <span>Submitting Feedback...</span>
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Recent Feedback Activity & Policy (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Feedbacks Stream */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Recent User Feedbacks</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  {feedbacks.length} Submissions
                </span>
              </div>

              <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-white block">{fb.userName}</span>
                        <span className="text-[10px] text-slate-400">{fb.category}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        {Array.from({ length: fb.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-yellow-400" />
                        ))}
                      </div>
                    </div>

                    {fb.route && (
                      <div className="text-[11px] font-mono text-cyan-400 truncate">
                        📍 {fb.route}
                      </div>
                    )}

                    <p className="text-slate-300 text-[11px] leading-relaxed italic">
                      "{fb.comments}"
                    </p>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                      <span>{fb.createdAt}</span>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ✓ {fb.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobility Support Contacts */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mobility Help Desk</h4>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+91 33 4000 1234 (Kolkata Ext 804)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>kolkata-mobility@odoo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Desk: Sector V SDF Building, Salt Lake Gate 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= AI CONCIERGE CHATBOT SECTION ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl flex flex-col h-[560px] overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Carpool Concierge Bot</h3>
                  <span className="text-[10px] text-emerald-400 font-semibold">• Live AI Active</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
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

            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask a question about carpooling, route rules, or payments..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Corporate Safety & Etiquette Policy</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed list-disc list-inside">
                <li>Always carry your registered company ID badge during pooled rides.</li>
                <li>Maintain scheduled pickup times; drivers can wait a max of 5 minutes.</li>
                <li>Keep vehicle cabin clean and respect colleagues' music/AC preferences.</li>
                <li>Zero toll fees: All fleet vehicles are equipped with corporate FASTag.</li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mobility Help Desk</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+91 33 4000 1234 (Ext 804)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>kolkata-mobility@odoo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Desk: Sector V SDF Building, Salt Lake Gate 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
