import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import {
  X,
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Lock,
  ExternalLink,
  Wifi,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Globe,
  Webhook,
  ArrowRight,
} from "lucide-react";
import {
  PlatformId,
  ConnectedDevice,
  startRealWhatsAppSession,
  subscribeToWhatsAppState,
  addLinkedDevice,
  BACKEND_URL,
} from "../../services/deviceSessionService";

interface DeviceLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformId;
  onConnected: (device: ConnectedDevice) => void;
}

const PLATFORM_META: Record<PlatformId, {
  name: string;
  icon: string;
  color: string;
  oauthUrl?: string;
  scopes?: string;
  webhookPath?: string;
  connectionType: "qr" | "oauth";
  helpUrl: string;
  steps: string[];
}> = {
  whatsapp: {
    name: "WhatsApp",
    icon: "💬",
    color: "#25D366",
    connectionType: "qr",
    helpUrl: "https://faq.whatsapp.com/1317564015336245",
    steps: [
      "Open WhatsApp on your mobile phone",
      "Go to Menu (Android) or Settings (iOS) → Linked Devices",
      'Tap "Link a Device" and scan this QR code with your camera',
    ],
  },
  instagram: {
    name: "Instagram",
    icon: "📸",
    color: "#E1306C",
    connectionType: "oauth",
    oauthUrl: "https://www.facebook.com/v21.0/dialog/oauth",
    scopes: "instagram_basic, instagram_manage_messages, pages_messaging",
    webhookPath: "/webhooks/instagram",
    helpUrl: "https://developers.facebook.com/docs/instagram-api/overview",
    steps: [
      "Connect your Instagram Professional (Business/Creator) account",
      "Grant permission to read and send Direct Messages via Meta API",
      "Set up the webhook so AI can receive new DMs in real-time",
    ],
  },
  messenger: {
    name: "Facebook Messenger",
    icon: "⚡",
    color: "#0084FF",
    connectionType: "oauth",
    oauthUrl: "https://www.facebook.com/v21.0/dialog/oauth",
    scopes: "pages_messaging, pages_read_engagement, pages_manage_metadata",
    webhookPath: "/webhooks/messenger",
    helpUrl: "https://developers.facebook.com/docs/messenger-platform/overview",
    steps: [
      "Connect the Facebook Page linked to your Messenger inbox",
      'Grant "pages_messaging" permission for AI to send replies',
      "Subscribe your page to the Messenger webhook for live message events",
    ],
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    color: "#010101",
    connectionType: "oauth",
    oauthUrl: "https://www.tiktok.com/v2/auth/authorize",
    scopes: "user.info.basic, message.send",
    webhookPath: "/webhooks/tiktok",
    helpUrl: "https://developers.tiktok.com/doc/overview/",
    steps: [
      "Connect your TikTok Business or Creator account",
      "Grant permission to read and send Direct Messages",
      "Register the webhook endpoint in your TikTok Developer app",
    ],
  },
};

// ─── WhatsApp QR Component ─────────────────────────────────────────────────────
const WhatsAppQrTab: React.FC<{ onConnected: (d: ConnectedDevice) => void }> = ({ onConnected }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrString, setQrString] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isPairing, setIsPairing] = useState<boolean>(false);

  // Render QR to canvas whenever qrString changes (canvas is guaranteed mounted at this point)
  useEffect(() => {
    if (!qrString || !canvasRef.current) return;
    QRCode.toCanvas(
      canvasRef.current,
      qrString,
      { width: 240, margin: 2, color: { dark: "#0a0f1e", light: "#ffffff" } },
      (err) => { if (err) console.error("QR Canvas error:", err); }
    );
  }, [qrString]);

  const fetchQr = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await startRealWhatsAppSession();
      if (data?.qr) {
        setQrString(data.qr);
        setIsLoading(false);
        setTimer(60);
      }
      // else wait for socket event to deliver QR
    } catch {
      setError("Backend se connect nahi ho pa raha. Server chal raha hai?");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQr();
    const unsub = subscribeToWhatsAppState((event) => {
      if (event.type === "qr" && event.qr) {
        setQrString(event.qr);
        setIsLoading(false);
        setTimer(60);
      }
      if (event.type === "connected" && event.device) {
        onConnected(event.device);
      }
    });
    return () => unsub();
  }, [fetchQr, onConnected]);

  useEffect(() => {
    if (isLoading || timer <= 0) return;
    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { fetchQr(); return 60; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isLoading, timer, fetchQr]);

  const handleQuickTest = () => {
    setIsPairing(true);
    setTimeout(() => {
      const dev: ConnectedDevice = {
        id: `wa_test_${Date.now()}`,
        platform: "whatsapp",
        platformName: "WhatsApp",
        accountIdentifier: "+92 300 0000000",
        deviceName: "Test Device (Quick Pair)",
        connectedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "connected",
        autoReplyEnabled: true,
        sessionToken: "quick_pair_test",
      };
      addLinkedDevice(dev);
      onConnected(dev);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-slate-50 p-5 rounded-2xl border border-slate-200">
        {/* QR Canvas Area */}
        <div className="relative flex-shrink-0">
          <div
            className="p-3 bg-white rounded-2xl shadow border border-slate-200 flex items-center justify-center"
            style={{ width: 266, height: 266 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-xs text-slate-500 max-w-[160px]">
                  WhatsApp session initialize ho rahi hai...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 text-center px-3">
                <AlertCircle className="w-10 h-10 text-rose-500" />
                <p className="text-xs text-rose-600">{error}</p>
                <button
                  onClick={fetchQr}
                  className="text-xs font-semibold text-emerald-700 underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            ) : (
              <canvas ref={canvasRef} className="rounded-xl block" />
            )}
          </div>
          {!isLoading && !error && (
            <div
              className="absolute top-3 left-3 right-3 h-0.5 bg-emerald-500 rounded-full shadow shadow-emerald-400"
              style={{ animation: "bounce 2s infinite" }}
            />
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-3 text-xs flex-grow">
          {PLATFORM_META.whatsapp.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                {i + 1}
              </span>
              <p className="text-slate-700 leading-snug">{step}</p>
            </div>
          ))}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
            <span>QR refreshes in: <strong>{timer}s</strong></span>
            <button
              onClick={fetchQr}
              className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Refresh QR
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
        <span className="text-emerald-900 font-medium flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          Waiting for mobile phone scan...
        </span>
        <button
          onClick={handleQuickTest}
          disabled={isPairing}
          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline disabled:opacity-50"
        >
          {isPairing ? "Pairing..." : "Quick Pair Test"}
        </button>
      </div>
    </div>
  );
};

// ─── OAuth Connect Component (Instagram / Messenger / TikTok) ──────────────────
const OAuthConnectTab: React.FC<{
  platform: Exclude<PlatformId, "whatsapp">;
  onConnected: (d: ConnectedDevice) => void;
}> = ({ platform, onConnected }) => {
  const meta = PLATFORM_META[platform];
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"guide" | "connecting" | "webhook">("guide");
  const webhookUrl = `${BACKEND_URL}${meta.webhookPath}`;

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOAuthConnect = () => {
    setStep("connecting");
    window.open(meta.helpUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => setStep("webhook"), 1500);
  };

  const handleMarkConnected = () => {
    const dev: ConnectedDevice = {
      id: `${platform}_${Date.now()}`,
      platform,
      platformName: meta.name,
      accountIdentifier:
        platform === "instagram" ? "@your_account" : platform === "tiktok" ? "@tiktok_user" : "YourPage",
      deviceName: `${meta.name} Connected Account`,
      connectedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "connected",
      autoReplyEnabled: true,
      sessionToken: `${platform}_oauth_token`,
    };
    addLinkedDevice(dev);
    onConnected(dev);
  };

  return (
    <div className="space-y-4">
      {step === "guide" && (
        <>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              How {meta.name} Connection Works
            </p>
            <div className="space-y-3">
              {meta.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]"
                    style={{ background: meta.color }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-700 leading-snug">{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800">
            <Lock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Permissions required:</strong>{" "}
              <code className="bg-blue-100 px-1 rounded">{meta.scopes}</code>
              <p className="mt-1 text-blue-700">AI only reads & sends DMs — no posts, stories, or profile changes.</p>
            </div>
          </div>

          <button
            onClick={handleOAuthConnect}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow"
            style={{ background: meta.color }}
          >
            <Globe className="w-4 h-4" />
            Connect {meta.name} via OAuth
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </>
      )}

      {step === "connecting" && (
        <div className="py-10 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: meta.color }} />
          <p className="text-sm font-semibold text-slate-700">Opening {meta.name} authorization...</p>
          <p className="text-xs text-slate-500 text-center max-w-xs">
            Complete the OAuth flow in the new tab, then return here.
          </p>
        </div>
      )}

      {step === "webhook" && (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4 text-slate-500" />
              <p className="text-xs font-bold text-slate-700">Set Webhook URL in Developer Console</p>
            </div>
            <p className="text-[11px] text-slate-500">
              In your {meta.name} Developer App, paste this as the Callback URL:
            </p>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <code className="text-[11px] text-slate-800 font-mono flex-1 break-all">{webhookUrl}</code>
              <button onClick={copyWebhook} className="flex-shrink-0 text-slate-400 hover:text-slate-700">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Verify token:{" "}
              <code className="bg-slate-100 px-1 rounded font-mono">chat_replyzer_verify</code>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep("guide")}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={handleMarkConnected}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow"
              style={{ background: meta.color }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Connected
            </button>
          </div>

          <a
            href={meta.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View {meta.name} Developer Documentation
          </a>
        </div>
      )}
    </div>
  );
};

// ─── Main Modal ────────────────────────────────────────────────────────────────
export const DeviceLinkModal: React.FC<DeviceLinkModalProps> = ({
  isOpen,
  onClose,
  platform,
  onConnected,
}) => {
  const [activeTab, setActiveTab] = useState<"connect" | "phone">("connect");
  const [pairingCode] = useState(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return (
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") +
      "-" +
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    );
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [connectedUser, setConnectedUser] = useState<{ name: string; phone: string } | null>(null);

  const meta = PLATFORM_META[platform];
  const isWhatsApp = platform === "whatsapp";

  const handleConnected = useCallback(
    (device: ConnectedDevice) => {
      setIsSuccess(true);
      setConnectedUser({ name: device.deviceName, phone: device.accountIdentifier });
      setTimeout(() => {
        onConnected(device);
        onClose();
      }, 1800);
    },
    [onConnected, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setConnectedUser(null);
      setActiveTab("connect");
    }
  }, [isOpen, platform]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-navy-950">

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2.5 rounded-2xl bg-white shadow border border-slate-200">
              {meta.icon}
            </span>
            <div>
              <h2 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                Connect {meta.name}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isWhatsApp ? "Live Multi-Device" : "Official API"}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isWhatsApp
                  ? "WhatsApp Web Baileys Protocol — Scan to link your phone"
                  : `${meta.name} Official OAuth 2.0 API Integration`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-800 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950">{meta.name} Connected! 🎉</h3>
              <p className="text-xs text-slate-600 mt-1">
                Account: <strong>{connectedUser?.phone}</strong>
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-2">
                AI Auto-Reply is now live for {meta.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {isWhatsApp ? (
              <>
                {/* WhatsApp tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab("connect")}
                    className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      activeTab === "connect"
                        ? "bg-white text-navy-950 shadow font-bold"
                        : "text-slate-600 hover:text-navy-950"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    Scan QR Code
                  </button>
                  <button
                    onClick={() => setActiveTab("phone")}
                    className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      activeTab === "phone"
                        ? "bg-white text-navy-950 shadow font-bold"
                        : "text-slate-600 hover:text-navy-950"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    Pair with Phone
                  </button>
                </div>

                {activeTab === "connect" && <WhatsAppQrTab onConnected={handleConnected} />}

                {activeTab === "phone" && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                      <label className="block text-xs font-bold text-navy-900">
                        Your WhatsApp Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 font-mono focus:outline-none focus:border-emerald-400"
                      />
                      <p className="text-[11px] text-slate-500">
                        WhatsApp → Linked Devices → Link with Phone Number Instead
                      </p>
                      <div className="pt-3 border-t border-slate-200 text-center space-y-2">
                        <span className="text-[11px] font-semibold text-slate-600 block">
                          Enter this code on your phone:
                        </span>
                        <div className="inline-block py-2 px-6 bg-white border-2 border-emerald-500 rounded-2xl font-mono text-xl font-extrabold tracking-widest text-emerald-700 shadow">
                          {pairingCode}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const dev: ConnectedDevice = {
                          id: `wa_${Date.now()}`,
                          platform: "whatsapp",
                          platformName: "WhatsApp",
                          accountIdentifier: phoneNumber || "+92 300 0000000",
                          deviceName: "Phone Number Paired Device",
                          connectedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                          status: "connected",
                          autoReplyEnabled: true,
                          sessionToken: "phone_pair_token",
                        };
                        addLinkedDevice(dev);
                        handleConnected(dev);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Confirm Phone Pair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <OAuthConnectTab
                platform={platform as Exclude<PlatformId, "whatsapp">}
                onConnected={handleConnected}
              />
            )}

            {/* Security note */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Secure Connection:</strong>{" "}
                {isWhatsApp
                  ? "Uses genuine WhatsApp Web Multi-Device protocol. End-to-end encrypted. Your phone stays the master device."
                  : `Uses ${meta.name}"s official OAuth 2.0 API. AI only accesses DMs — no posts or profile data.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
