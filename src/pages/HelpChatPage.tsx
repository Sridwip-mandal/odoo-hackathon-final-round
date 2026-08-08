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
} from 'lucide-react';
import { useToast } from '../components/Toast';

export const HelpChatPage: React.FC = () => {
  const toast = useToast();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am your Carpool Mobility Assistant. How can I assist you with your daily commute, fuel reimbursement, or vehicle registration today?',
      time: '11:00 AM',
    },
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'How does corporate fuel reimbursement work?',
    'What is the emergency SOS protocol?',
    'How do I add multiple office pickup stops?',
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
        reply = "You can add custom waypoints along the SG Highway / Gandhinagar corridor in the Notes section when publishing or booking your ride.";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply, time }]);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Help & Corporate Mobility Support</h1>
        <p className="text-xs text-slate-400 mt-1">
          24/7 Carpooling guidelines, corporate security policy, and interactive mobility concierge
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Concierge Bot (7 Cols) */}
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

          {/* Quick FAQ buttons */}
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

        {/* Right: Policy Guidelines & Contacts (5 Cols) */}
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
                <span>+91 79 4000 1234 (Ext 804)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>mobility-support@odoo.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Security Desk: SG Highway Campus Gate 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
