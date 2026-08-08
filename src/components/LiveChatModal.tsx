import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, Shield, CheckCheck, Smile } from 'lucide-react';
import { ChatMessage } from '../types';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  driverPhone?: string;
  driverAvatar?: string;
  tripId?: string;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  driverName = 'Raj Patel',
  driverPhone = '+91 98765 43210',
  driverAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  tripId = 'trip-active-1',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      tripId,
      senderId: 'driver-1',
      senderName: driverName,
      text: `Hi! I'm starting from ISKCON in 5 minutes. Swift Dzire (GJ01AB1234). Let me know when you're at the pickup point!`,
      timestamp: '06:55 PM',
      isDriver: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "I'm at the gate",
    "On my way, 2 mins!",
    "Where is the car parked?",
    "Traffic on SG highway?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      tripId,
      senderId: 'current-user',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDriver: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate driver automated reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Got it! See you shortly.";
      if (text.toLowerCase().includes('gate') || text.toLowerCase().includes('pickup')) {
        replyText = "Perfect! I'm pulling up near the main security gate right now.";
      } else if (text.toLowerCase().includes('parked') || text.toLowerCase().includes('where')) {
        replyText = "I'm right next to the metro pillar #142 with hazard lights on.";
      } else if (text.toLowerCase().includes('traffic')) {
        replyText = "Traffic is smooth on SG Highway, we should reach Infocity in ~25 minutes.";
      }

      const driverReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        tripId,
        senderId: 'driver-1',
        senderName: driverName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDriver: true,
      };
      setMessages((prev) => [...prev, driverReply]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col h-[560px] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={driverAvatar} alt={driverName} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{driverName}</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px] font-semibold">Driver</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{driverPhone}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corporate Security Notice */}
        <div className="px-4 py-1.5 bg-blue-950/40 border-b border-blue-500/10 flex items-center gap-2 text-[10px] text-blue-300">
          <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Encrypted enterprise chat. Messages are monitored for company safety compliance.</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isDriver ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.isDriver
                    ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80'
                    : 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/30'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                <span>{msg.timestamp}</span>
                {!msg.isDriver && <CheckCheck className="w-3 h-3 text-blue-400" />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span>{driverName} is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Chips */}
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
          {quickReplies.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type message to driver..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
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
    </div>
  );
};
