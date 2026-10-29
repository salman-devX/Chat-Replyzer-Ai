import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Zap,
  Pause,
  Play,
  Sliders,
  FlaskConical,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  QrCode,
  Smartphone,
  Lock,
  Trash2,
  Send,
  Check,
  ShieldAlert,
  Info
} from 'lucide-react';
import { DeviceLinkModal } from '../../components/devices/DeviceLinkModal';
import {
  PlatformId,
  AssistantRole,
  ConnectedDevice,
  ActivityMessage,
  AiPersonalityConfig,
  getLinkedDevices,
  removeLinkedDevice,
  getRealMessages,
  addRealMessage,
  clearRealMessages,
  getPersonalityConfig,
  savePersonalityConfig,
  getGlobalAutoReply,
  setGlobalAutoReply,
  processIncomingMessage,
  disconnectRealWhatsApp,
  subscribeToWhatsAppState,
  ROLE_DEFINITIONS
} from '../../services/deviceSessionService';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // State from real session service
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [messages, setMessages] = useState<ActivityMessage[]>([]);
  const [personality, setPersonality] = useState<AiPersonalityConfig>(getPersonalityConfig());
  const [autoReplyEnabled, setAutoReplyEnabledState] = useState<boolean>(getGlobalAutoReply());

  // Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedPlatformToLink, setSelectedPlatformToLink] = useState<PlatformId>('whatsapp');

  // Live Playground Simulator State (Multi-Turn Chat)
  const [testIncomingText, setTestIncomingText] = useState('Bhai kal sham ko chai pe milte hain? Scene on hai kya?');
  const [testSenderName, setTestSenderName] = useState('Friend / Contact');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ActivityMessage | null>(null);
  const [simHistory, setSimHistory] = useState<Array<{ role: string; text: string }>>([]);

  // Sync state on load and subscribe to live socket events
  useEffect(() => {
    setDevices(getLinkedDevices());
    setMessages(getRealMessages());
    setPersonality(getPersonalityConfig());
    setAutoReplyEnabledState(getGlobalAutoReply());

    const unsubscribe = subscribeToWhatsAppState((event) => {
      setDevices(getLinkedDevices());
      setMessages(getRealMessages());
    });

    return () => unsubscribe();
  }, []);

  const handleOpenLinkModal = (platform: PlatformId) => {
    setSelectedPlatformToLink(platform);
    setLinkModalOpen(true);
  };

  const handleDeviceConnected = (newDevice: ConnectedDevice) => {
    const updated = getLinkedDevices();
    setDevices(updated);
  };

  const handleDisconnect = async (platform: PlatformId) => {
    if (confirm(`Are you sure you want to disconnect ${platform.toUpperCase()}? Automated replies will stop for this platform.`)) {
      if (platform === 'whatsapp') {
        await disconnectRealWhatsApp();
      }
      const updated = removeLinkedDevice(platform);
      setDevices(updated);
    }
  };

  const handleToggleAutoReply = () => {
    const nextState = !autoReplyEnabled;
    setAutoReplyEnabledState(nextState);
    setGlobalAutoReply(nextState);
  };

  const handleSelectRole = (newRole: AssistantRole) => {
    const updated: AiPersonalityConfig = {
      ...personality,
      role: newRole,
      roleName: ROLE_DEFINITIONS[newRole].name,
    };
    setPersonality(updated);
    savePersonalityConfig(updated);
  };

  const handleRunSimulator = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = testIncomingText.trim();
    if (!prompt) return;

    setIsSimulating(true);

    setTimeout(() => {
      const activePlatform: PlatformId = devices.length > 0 ? devices[0].platform : 'whatsapp';
      const result = processIncomingMessage(prompt, personality, simHistory);

      const newMsg: ActivityMessage = {
        id: `msg_${Date.now()}`,
        platform: activePlatform,
        contactName: testSenderName || 'Contact',
        contactIdentifier: devices.length > 0 ? devices[0].accountIdentifier : '+92 300 0000000',
        incomingText: prompt,
        replyText: result.reply,
        roleUsed: personality.roleName,
        language: result.detectedLanguage,
        timestamp: 'Just now',
        status: result.status,
        safetyFlag: result.safetyReason,
      };

      setSimulationResult(newMsg);
      const updated = addRealMessage(newMsg);
      setMessages(updated);

      // Keep multi-turn conversation history
      setSimHistory(prev => [
        ...prev,
        { role: 'user', text: prompt },
        { role: 'model', text: result.reply }
      ]);

      setTestIncomingText(''); // clear input so user can seamlessly type next message
      setIsSimulating(false);
    }, 400);
  };

  const handleResetChat = () => {
    setSimHistory([]);
    setSimulationResult(null);
  };

  const handleClearHistory = () => {
    if (confirm('Clear real message activity feed?')) {
      clearRealMessages();
      setMessages([]);
      setSimulationResult(null);
      setSimHistory([]);
    }
  };

  // Supported Platforms definition
  const platformList: { id: PlatformId; name: string; icon: string; subtitle: string }[] = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', subtitle: 'Phone scan via Linked Devices' },
    { id: 'instagram', name: 'Instagram', icon: '📸', subtitle: 'Direct Message AI Pairing' },
    { id: 'messenger', name: 'Facebook Messenger', icon: '⚡', subtitle: 'Page & Mobile Bridge' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', subtitle: 'Business DM Pairing' },
  ];

  const totalConnected = devices.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ─── HERO BANNER ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              totalConnected > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${totalConnected > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {totalConnected > 0 ? `${totalConnected} Device Linked & Monitoring` : 'No Devices Linked (Standby)'}
            </span>

            <span className="text-[11px] text-navy-500 font-medium">
              Role: <strong className="text-brand-700">{personality.roleName}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Welcome back, {currentUser?.displayName || 'User'}!
          </h1>

          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            {totalConnected > 0 ? (
              <>
                Your AI assistant is connected to your smartphone. It will automatically respond to new incoming messages according to your{' '}
                <strong className="text-navy-900">{personality.roleName}</strong> settings.
              </>
            ) : (
              <>
                To activate AI automated replies, select a platform below (e.g.{' '}
                <strong className="text-emerald-700">WhatsApp</strong>) and scan the QR code from your mobile phone.
              </>
            )}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleToggleAutoReply}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              autoReplyEnabled
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {autoReplyEnabled ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
            {autoReplyEnabled ? 'Auto-Reply: Active' : 'Auto-Reply: Paused'}
          </button>

          <button
            onClick={() => handleOpenLinkModal('whatsapp')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            Link WhatsApp (Scan QR)
          </button>
        </div>
      </div>

      {/* ─── REAL STATUS METRICS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Linked Devices */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-navy-500 text-xs font-semibold">
            <span>Linked Devices</span>
            <Smartphone className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">{totalConnected}</span>
            <span className="text-xs text-navy-500">/ 4 Available</span>
          </div>
          <p className="text-[11px] text-navy-500">
            {totalConnected > 0 ? `${devices[0].deviceName} linked` : 'Scan QR code to connect'}
          </p>
        </div>

        {/* Metric 2: Real Replies Sent */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-navy-500 text-xs font-semibold">
            <span>AI Replies Handled</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">{messages.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">Real Activity</span>
          </div>
          <p className="text-[11px] text-navy-500">Only counts real/simulated responses</p>
        </div>

        {/* Metric 3: Active AI Role */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-navy-500 text-xs font-semibold">
            <span>Active Persona Role</span>
            <Sliders className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-sm font-bold text-navy-950 truncate">
            {personality.roleName}
          </div>
          <p className="text-[11px] text-navy-500">
            Language: {personality.language === 'roman_urdu' ? 'Roman Urdu (Pakistani Nuance)' : personality.language}
          </p>
        </div>

        {/* Metric 4: Safety Shield */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-navy-500 text-xs font-semibold">
            <span>Safety Guardrails</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-emerald-700">
            Smart Pause Active
          </div>
          <p className="text-[11px] text-navy-500">Halts on Easypaisa/money transfers</p>
        </div>
      </div>

      {/* ─── PLATFORM SELECTION & QR CODE SCANNING CARDS ─────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950">Choose Messaging Platform to Link</h2>
            <p className="text-xs text-navy-500">
              Point your smartphone at the QR code to pair your device securely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {platformList.map((p) => {
            const connectedDevice = devices.find((d) => d.platform === p.id);
            const isConnected = Boolean(connectedDevice);

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-5 shadow-card space-y-4 flex flex-col justify-between transition-all ${
                  isConnected ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-200">
                      {p.icon}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {isConnected ? 'Online & Linked' : 'Not Linked'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-navy-950">{p.name}</h3>
                    <p className="text-[11px] text-navy-500">{p.subtitle}</p>
                  </div>

                  {isConnected ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 space-y-1">
                      <p><strong>Device:</strong> {connectedDevice?.deviceName}</p>
                      <p><strong>Account:</strong> {connectedDevice?.accountIdentifier}</p>
                      <p className="text-[10px] text-emerald-700">Paired: {connectedDevice?.connectedAt}</p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-navy-500 space-y-1">
                      <p>No phone connected yet.</p>
                      <p className="text-[10px] text-navy-400">Scan QR to enable auto-reply.</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {isConnected ? (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDisconnect(p.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        Disconnect
                      </button>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> E2EE Active
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenLinkModal(p.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-navy-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-brand-600" />
                      Scan QR Code
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ROLE SELECTOR (CHOOSE HOW AI RESPONDS) ─────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              Select AI Role (How Your Assistant Will Reply)
            </h2>
            <p className="text-xs text-navy-500">
              When someone messages you, the AI will answer using the role you select here:
            </p>
          </div>
          <Link
            to="/dashboard/personality"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
          >
            Customize Personality In Depth <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['personal', 'business', 'creator', 'sales'] as AssistantRole[]).map((roleKey) => {
            const roleInfo = ROLE_DEFINITIONS[roleKey];
            const isSelected = personality.role === roleKey;

            return (
              <div
                key={roleKey}
                onClick={() => handleSelectRole(roleKey)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-navy-950">{roleInfo.name}</h3>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-navy-600 line-clamp-2 leading-relaxed">
                  {roleInfo.description}
                </p>
                <div className="pt-1 text-[10px] text-brand-700 italic border-t border-slate-200/60">
                  Example: "{roleInfo.sample.substring(0, 50)}..."
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── LIVE TESTING SIMULATOR & ACTIVITY FEED ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Interactive Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-brand-600" />
                Live Continuous Chat Simulator
              </h3>
              <p className="text-[11px] text-navy-500">Test continuous multi-turn replies with realistic human persona</p>
            </div>
            <div className="flex items-center gap-2">
              {simHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Clear conversation context and start fresh"
                  className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full transition-all"
                >
                  New Chat ({Math.floor(simHistory.length / 2)} turns)
                </button>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Live Memory Active
              </span>
            </div>
          </div>

          <form onSubmit={handleRunSimulator} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1">
                Sender Name (Simulated Contact)
              </label>
              <input
                type="text"
                value={testSenderName}
                onChange={(e) => setTestSenderName(e.target.value)}
                placeholder="e.g. Ali, Customer, Brand Collab"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-navy-800">
                  Incoming Message Text
                </label>
                <span className="text-[10px] text-navy-400">Supports Roman Urdu & English</span>
              </div>
              <textarea
                rows={3}
                value={testIncomingText}
                onChange={(e) => setTestIncomingText(e.target.value)}
                placeholder="Type incoming message..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Quick Trigger Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block">
                Quick Test Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTestIncomingText('Bhai kal sham ko meeting ka kya program hai?')}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-700"
                >
                  Friends Banter
                </button>
                <button
                  type="button"
                  onClick={() => setTestIncomingText('Can you send your pricing catalog and timings?')}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-700"
                >
                  Business Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setTestIncomingText('Bhai 25,000 rupay Easypaisa kardo emergency hai!')}
                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                >
                  Test Smart Pause (Easypaisa)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSimulating || !testIncomingText.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {isSimulating ? 'AI Thinking...' : 'Simulate Incoming Message & Reply'}
            </button>
          </form>

          {/* Last Simulation Result */}
          {simulationResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              simulationResult.status === 'paused_safety'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  {simulationResult.status === 'paused_safety' ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      Smart Pause Interception
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Auto-Reply Generated ({simulationResult.roleUsed})
                    </>
                  )}
                </span>
                <span className="text-[10px] text-navy-500">{simulationResult.language}</span>
              </div>

              <p className="bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-sans text-navy-900">
                {simulationResult.replyText}
              </p>

              {simulationResult.safetyFlag && (
                <p className="text-[11px] text-rose-700 font-medium">
                  {simulationResult.safetyFlag}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Real Messages Activity Feed (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-navy-950">Real Message Activity Feed</h3>
              <p className="text-xs text-navy-500">
                Only shows real incoming chats and automated replies. Zero fake dummy numbers.
              </p>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 inline-flex items-center gap-1"
                title="Clear activity log"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-navy-950">No message activity yet</h4>
                <p className="text-xs text-navy-500 max-w-sm mx-auto leading-relaxed">
                  We don't display fake contacts. Once you link your device or run the simulator on the left, real conversation logs will appear here.
                </p>
              </div>
              <button
                onClick={() => handleOpenLinkModal('whatsapp')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <QrCode className="w-3.5 h-3.5" />
                Scan WhatsApp QR Code
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto space-y-3">
              {messages.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-950">{item.contactName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold uppercase">
                        {item.platform}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold">
                        {item.roleUsed}
                      </span>
                    </div>
                    <span className="text-[11px] text-navy-400">{item.timestamp}</span>
                  </div>

                  {/* Incoming */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy-800">
                    <span className="text-[10px] font-bold uppercase text-navy-400 block mb-0.5">Incoming:</span>
                    {item.incomingText}
                  </div>

                  {/* Reply */}
                  <div className={`p-2.5 rounded-xl text-xs border ${
                    item.status === 'paused_safety'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  }`}>
                    <span className="text-[10px] font-bold uppercase block mb-0.5 flex items-center justify-between">
                      <span>{item.status === 'paused_safety' ? '⚠️ Smart Pause Triggered:' : '✨ AI Auto-Reply:'}</span>
                      <span className="text-emerald-700 font-mono text-[9px]">{item.language}</span>
                    </span>
                    {item.replyText}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── SECURITY, SAFETY & PRIVACY CARD ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your Privacy & Account Safety Guarantee</h3>
            <p className="text-xs text-slate-300">How Chat Replyzer AI keeps you safe and protects your messaging</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              End-to-End Encrypted Session
            </h4>
            <p className="leading-relaxed text-[11px]">
              Device pairing uses WhatsApp's official multi-device cryptographic protocol. Your private chats remain private.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Smart Pause Safety Rules
            </h4>
            <p className="leading-relaxed text-[11px]">
              If any contact asks for money, Easypaisa, bank transfers, or OTPs, the AI stops immediately and alerts you.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-brand-400" />
              100% User Controlled
            </h4>
            <p className="leading-relaxed text-[11px]">
              You can pause auto-replies or disconnect your phone anytime with a single click from this dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* ─── MODAL: DEVICE LINKING QR CODE ──────────────────────────────────── */}
      <DeviceLinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        platform={selectedPlatformToLink}
        onConnected={handleDeviceConnected}
      />
    </div>
  );
};
