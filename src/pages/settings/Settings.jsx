import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  PhoneCall,
  Bot,
  Users,
  Layers,
  Save,
  CheckCircle2,
  Lock,
  Key,
  Smartphone,
  ExternalLink,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function Settings() {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@truckpilot.ai',
    phone: user?.phone || '+1 (555) 382-9014',
    title: user?.role || 'Senior Freight Sales Rep',
  });

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Integrations State
  const [integrations, setIntegrations] = useState([
    { id: 'motive', name: 'Motive (KeepTruckin)', category: 'ELD Telematics', connected: true, desc: 'Sync hours of service and fleet power units' },
    { id: 'samsara', name: 'Samsara Cloud', category: 'ELD & Dashcams', connected: false, desc: 'Vehicle diagnostic trouble codes and GPS' },
    { id: 'twilio', name: 'Twilio Elastic SIP Trunking', category: 'Telephony', connected: true, desc: 'Carrier PSTN outbound audio routing' },
    { id: 'wex', name: 'WEX Fuel Network', category: 'Fleet Fueling', connected: true, desc: 'Real-time diesel pump discount pricing index' },
    { id: 'apex', name: 'Apex Capital Factoring', category: 'Factoring API', connected: false, desc: 'Instant freight broker credit checks & wire settlement' },
    { id: 'slack', name: 'Slack Call Center Alerts', category: 'Team Chat', connected: true, desc: 'Instant notification on human handoff requests' },
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile information updated');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill out password fields', 'warning');
      return;
    }
    showToast('Security password successfully changed');
    setCurrentPassword('');
    setNewPassword('');
  };

  const toggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.connected;
          showToast(
            nextState ? `${item.name} connected` : `${item.name} disconnected`,
            nextState ? 'success' : 'warning'
          );
          return { ...item, connected: nextState };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Platform & Carrier Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage representative profile, credentials, telephony SIP trunking, and ELD integrations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-800 text-xs font-medium gap-6 overflow-x-auto">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
          { id: 'integrations', label: 'Integrations & Telematics', icon: Layers },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition flex items-center gap-1.5 whitespace-nowrap relative ${
                activeTab === tab.id
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-6 text-xs">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40"
            />
            <div>
              <h3 className="text-base font-bold text-white">{profileForm.name}</h3>
              <p className="text-slate-400">{profileForm.title}</p>
              <span className="text-[11px] text-blue-400 font-mono mt-0.5 block">{profileForm.email}</span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Title / Role</label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Work Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Direct Dial Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-glow-sm transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Update Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-6 text-xs">
          {/* Change Password */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              Update Account Password
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">New Password (8+ chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-slate-400 mt-0.5">
                  Secure workstation sign-ins with authenticator TOTP or carrier SMS verification.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Enabled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Integrations */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-navy-900 border border-navy-800 rounded-2xl shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <span className="text-[10px] text-blue-400 uppercase font-semibold">{item.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    item.connected
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.connected ? 'Active Sync' : 'Disconnected'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-2">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-navy-800 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">API v2.4</span>
                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition ${
                    item.connected
                      ? 'bg-rose-600/15 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {item.connected ? 'Disconnect' : 'Connect Account'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Notification Rules */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-lg space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            Carrier Call Center Notification Routing
          </h3>

          <div className="space-y-3">
            {[
              'Push alert when AI detects customer requesting human supervisor',
              'Email dispatch when lead score crosses 80 threshold',
              'Daily morning briefing summary of scheduled follow-ups',
              'SMS alert on high-value enterprise deal stage progression',
            ].map((rule, idx) => (
              <label key={idx} className="flex items-center gap-3 p-3 bg-navy-950 rounded-xl border border-navy-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-navy-900 border-navy-700 text-blue-600" />
                <span className="text-slate-200">{rule}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
