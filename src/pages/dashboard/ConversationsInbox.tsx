import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Filter,
  Pause,
  Play,
  Trash2,
  Star,
  Send,
  AlertCircle,
  CheckCircle2,
  User,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'contact' | 'ai' | 'human';
  text: string;
  timestamp: string;
  isAiReply?: boolean;
}

interface ConversationItem {
  id: string;
  contactName: string;
  platform: 'whatsapp' | 'instagram' | 'messenger' | 'tiktok';
  mode: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  isAiPaused: boolean;
  isStarred: boolean;
  messages: ChatMessage[];
}

import { getRealMessages, ActivityMessage } from '../../services/deviceSessionService';

export const ConversationsInbox: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [manualReplyText, setManualReplyText] = useState('');

  // Load real messages on mount
  useEffect(() => {
    const rawMessages = getRealMessages();
    if (rawMessages.length === 0) {
      setConversations([]);
      return;
    }

    const map = new Map<string, ConversationItem>();
    rawMessages.forEach((msg) => {
      const key = msg.contactIdentifier || msg.contactName;
      if (!map.has(key)) {
        map.set(key, {
          id: `conv_${key}`,
          contactName: msg.contactName || key,
          platform: msg.platform,
          mode: msg.roleUsed || 'Active AI Persona',
          lastMessage: msg.replyText || msg.incomingText,
          lastTime: msg.timestamp || 'Recent',
          unread: false,
          isAiPaused: msg.status === 'paused_safety',
          isStarred: false,
          messages: [
            { id: `${msg.id}_in`, sender: 'contact', text: msg.incomingText, timestamp: msg.timestamp },
            { id: `${msg.id}_out`, sender: 'ai', text: msg.replyText, timestamp: msg.timestamp, isAiReply: true }
          ]
        });
      } else {
        const existing = map.get(key)!;
        existing.messages.push(
          { id: `${msg.id}_in`, sender: 'contact', text: msg.incomingText, timestamp: msg.timestamp },
          { id: `${msg.id}_out`, sender: 'ai', text: msg.replyText, timestamp: msg.timestamp, isAiReply: true }
        );
      }
    });

    const list = Array.from(map.values());
    setConversations(list);
    if (list.length > 0) {
      setSelectedId(list[0].id);
    }
  }, []);

  const activeChat = conversations.find(c => c.id === selectedId) || conversations[0];

  const togglePauseAi = (convId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) return { ...c, isAiPaused: !c.isAiPaused };
      return c;
    }));
  };

  const toggleStar = (convId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) return { ...c, isStarred: !c.isStarred };
      return c;
    }));
  };

  const deleteConversation = (convId: string) => {
    if (confirm('Permanently delete stored messages for this conversation? (Subject to provider data policies)')) {
      const remaining = conversations.filter(c => c.id !== convId);
      setConversations(remaining);
      if (remaining.length > 0) setSelectedId(remaining[0].id);
    }
  };

  const handleSendManualReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReplyText.trim() || !activeChat) return;

    const newMessage: ChatMessage = {
      id: 'm_' + Date.now(),
      sender: 'human',
      text: manualReplyText.trim(),
      timestamp: 'Just now'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          lastMessage: newMessage.text,
          lastTime: 'Just now',
          isAiPaused: true, // Manual takeover automatically pauses AI for this conversation
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    setManualReplyText('');
  };

  const filteredConversations = conversations.filter(c => {
    const matchesPlatform = platformFilter === 'all' || c.platform === platformFilter;
    const matchesSearch = c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Unified Conversations Inbox</h1>
          <p className="text-xs text-navy-600">
            Monitor incoming messages across WhatsApp, Instagram, Messenger, and TikTok. Take over manually at any moment.
          </p>
        </div>
      </div>

      {/* Main Inbox Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        {/* Left Column: Conversations List (5 Cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts or message text..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none"
              />
            </div>

            {/* Platform filter tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
              {['all', 'whatsapp', 'instagram', 'messenger'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap ${
                    platformFilter === p
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-navy-700 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-grow max-h-[550px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-navy-400">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeChat?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected ? 'bg-brand-50/60 border-l-4 border-l-brand-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-navy-950 truncate max-w-[180px]">
                          {conv.contactName}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {conv.platform}
                        </span>
                      </div>
                      <span className="text-[10px] text-navy-400">{conv.lastTime}</span>
                    </div>

                    <p className="text-xs text-navy-600 truncate">{conv.lastMessage}</p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-brand-700 font-medium">{conv.mode}</span>
                      {conv.isAiPaused ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                          AI Paused (Human Takeover)
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          AI Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Thread Detail (7 Cols) */}
        {activeChat ? (
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/40">
            {/* Top chat bar */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-navy-950">{activeChat.contactName}</h3>
                <span className="text-[11px] text-navy-500 capitalize">
                  {activeChat.platform} &bull; Mode: {activeChat.mode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePauseAi(activeChat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                    activeChat.isAiPaused
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {activeChat.isAiPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {activeChat.isAiPaused ? 'Resume AI' : 'Pause AI for Chat'}
                </button>

                <button
                  onClick={() => toggleStar(activeChat.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    activeChat.isStarred ? 'bg-amber-50 border-amber-200 text-amber-500' : 'border-slate-200 text-slate-400'
                  }`}
                  title="Mark Important"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={() => deleteConversation(activeChat.id)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Conversation Data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Thread View */}
            <div className="p-6 space-y-4 overflow-y-auto flex-grow max-h-[460px]">
              {activeChat.messages.map((msg) => {
                const isUser = msg.sender === 'contact';
                const isAi = msg.sender === 'ai';
                const isHumanTakeover = msg.sender === 'human';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-navy-400 mb-1 px-1">
                      {isUser ? (
                        <span>Contact &bull; {msg.timestamp}</span>
                      ) : isAi ? (
                        <span className="text-brand-600 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Chat Replyzer AI &bull; {msg.timestamp}
                        </span>
                      ) : (
                        <span className="text-purple-700 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" /> You (Manual Takeover) &bull; {msg.timestamp}
                        </span>
                      )}
                    </div>

                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-subtle ${
                        isUser
                          ? 'bg-white border border-slate-200 text-navy-900 rounded-tl-sm'
                          : isAi
                          ? 'bg-gradient-to-tr from-brand-600 to-brand-700 text-white rounded-tr-sm shadow-brand-500/10'
                          : 'bg-purple-700 text-white rounded-tr-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Manual Reply Bar */}
            <form onSubmit={handleSendManualReply} className="p-4 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={manualReplyText}
                onChange={(e) => setManualReplyText(e.target.value)}
                placeholder="Take over conversation manually (auto-pauses AI)..."
                className="flex-grow px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                disabled={!manualReplyText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">No active conversation threads</h4>
            <p className="text-xs text-navy-500 max-w-sm leading-relaxed">
              We never display fake contacts or dummy chats. Once your linked device receives a message or you test from the Dashboard, real threads will appear here.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              Go to Dashboard & Simulator
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
