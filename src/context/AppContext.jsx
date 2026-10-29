import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  leadApi,
  customerApi,
  callApi,
  followupApi,
  dealApi,
  objectionApi,
  knowledgeApi,
  teamApi,
} from '../services/apiServices';

// Fallback mock data while backend loads
import {
  initialNotifications,
  initialAiStatus,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ─── Data State ────────────────────────────────────────────────────────────
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [calls, setCalls] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [deals, setDeals] = useState([]);
  const [objections, setObjections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [team, setTeam] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [aiStatus, setAiStatus] = useState(initialAiStatus);
  const [loading, setLoading] = useState(true);

  // ─── UI State ──────────────────────────────────────────────────────────────
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Bootstrap: Load all data from real backend ────────────────────────────
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('truckpilot_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const [
        leadsData,
        customersData,
        callsData,
        followupsData,
        dealsData,
        objectionsData,
        knowledgeData,
        teamData,
      ] = await Promise.allSettled([
        leadApi.getAll(),
        customerApi.getAll(),
        callApi.getAll(),
        followupApi.getAll(),
        dealApi.getAll(),
        objectionApi.getAll(),
        knowledgeApi.getAll(),
        teamApi.getAll(),
      ]);

      if (leadsData.status === 'fulfilled') setLeads(leadsData.value || []);
      if (customersData.status === 'fulfilled') setCustomers(customersData.value || []);
      if (callsData.status === 'fulfilled') setCalls(callsData.value || []);
      if (followupsData.status === 'fulfilled') setFollowups(followupsData.value || []);
      if (dealsData.status === 'fulfilled') setDeals(dealsData.value || []);
      if (objectionsData.status === 'fulfilled') setObjections(objectionsData.value || []);
      if (knowledgeData.status === 'fulfilled') setArticles(knowledgeData.value || []);
      if (teamData.status === 'fulfilled') setTeam(teamData.value || []);
    } catch (err) {
      console.warn('[AppContext] Failed to load backend data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ─── Lead Actions ──────────────────────────────────────────────────────────
  const addLead = async (newLead) => {
    try {
      const created = await leadApi.create(newLead);
      setLeads((prev) => [created, ...prev]);
      showToast(`Lead "${created.company}" created successfully!`);
      return created;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create lead', 'error');
    }
  };

  const updateLead = async (id, updates) => {
    try {
      const updated = await leadApi.update(id, updates);
      setLeads((prev) => prev.map((l) => (l._id === id || l.id === id ? updated : l)));
      showToast('Lead updated successfully');
      return updated;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update lead', 'error');
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadApi.delete(id);
      setLeads((prev) => prev.filter((l) => l._id !== id && l.id !== id));
      showToast('Lead deleted', 'error');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete lead', 'error');
    }
  };

  // ─── Followup Actions ──────────────────────────────────────────────────────
  const addFollowup = async (item) => {
    try {
      const created = await followupApi.create(item);
      setFollowups((prev) => [created, ...prev]);
      showToast(`Follow-up scheduled with ${item.company || item.contactName}`);
      return created;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create follow-up', 'error');
    }
  };

  const completeFollowup = async (id) => {
    try {
      const updated = await followupApi.update(id, { status: 'completed', completedAt: new Date() });
      setFollowups((prev) => prev.map((f) => (f._id === id || f.id === id ? updated : f)));
      showToast('Follow-up marked as completed!');
    } catch (err) {
      showToast('Failed to update follow-up', 'error');
    }
  };

  const deleteFollowup = async (id) => {
    try {
      await followupApi.delete(id);
      setFollowups((prev) => prev.filter((f) => f._id !== id && f.id !== id));
      showToast('Follow-up removed');
    } catch (err) {
      showToast('Failed to remove follow-up', 'error');
    }
  };

  // ─── Deal Actions ──────────────────────────────────────────────────────────
  const moveDeal = async (dealId, targetStage) => {
    try {
      const updated = await dealApi.updateStage(dealId, targetStage);
      setDeals((prev) => prev.map((d) => (d._id === dealId || d.id === dealId ? updated : d)));
      showToast(`Deal moved to ${targetStage}`);
    } catch (err) {
      showToast('Failed to move deal', 'error');
    }
  };

  const addDeal = async (newDeal) => {
    try {
      const created = await dealApi.create(newDeal);
      setDeals((prev) => [created, ...prev]);
      showToast(`Deal for "${created.company}" added to pipeline!`);
      return created;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create deal', 'error');
    }
  };

  // ─── Knowledge Base Actions ────────────────────────────────────────────────
  const addArticle = async (art) => {
    try {
      const created = await knowledgeApi.create(art);
      setArticles((prev) => [created, ...prev]);
      showToast('Knowledge article published!');
      return created;
    } catch (err) {
      showToast('Failed to create article', 'error');
    }
  };

  // ─── Notification Actions ──────────────────────────────────────────────────
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  // ─── AI Agent Toggle ───────────────────────────────────────────────────────
  const toggleAiAgent = () => {
    setAiStatus((prev) => {
      const nextOnline = !prev.online;
      showToast(
        nextOnline ? 'AI Voice Agent is now ONLINE' : 'AI Voice Agent PAUSED',
        nextOnline ? 'success' : 'warning'
      );
      return {
        ...prev,
        online: nextOnline,
        status: nextOnline ? 'optimal' : 'paused',
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        // Data
        leads,
        customers,
        calls,
        followups,
        deals,
        objections,
        articles,
        team,
        notifications,
        aiStatus,
        loading,
        // Refreshers
        loadAllData,
        // Lead actions
        addLead,
        updateLead,
        deleteLead,
        // Followup actions
        addFollowup,
        completeFollowup,
        deleteFollowup,
        // Deal actions
        moveDeal,
        addDeal,
        // Knowledge actions
        addArticle,
        // Notification actions
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        // AI
        toggleAiAgent,
        // State setters
        setCalls,
        setObjections,
        setTeam,
        // UI
        isSearchOpen,
        setIsSearchOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
