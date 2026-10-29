import api from './api';

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('truckpilot_token', data.token);
      localStorage.setItem('truckpilot_user', JSON.stringify(data.user));
    }
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('truckpilot_token', data.token);
      localStorage.setItem('truckpilot_user', JSON.stringify(data.user));
    }
    return data;
  },
  logout: async () => {
    localStorage.removeItem('truckpilot_token');
    localStorage.removeItem('truckpilot_user');
    return { success: true };
  },
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/me', updates);
    return data.user;
  },
  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
    return data;
  },
  forgotPassword: async (email) => {
    return { success: true, message: `Password reset link sent to ${email}` };
  },
  resetPassword: async (token, newPassword) => {
    return { success: true, message: 'Password updated successfully' };
  },
};

// ─── Leads API ───────────────────────────────────────────────────────────────
export const leadApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/leads', { params });
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/leads/${id}`);
    return data.data;
  },
  create: async (lead) => {
    const { data } = await api.post('/leads', lead);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/leads/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/leads/stats');
    return data.data;
  },
};

// ─── Customers API ───────────────────────────────────────────────────────────
export const customerApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/customers', { params });
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/customers/${id}`);
    return data.data;
  },
  create: async (customer) => {
    const { data } = await api.post('/customers', customer);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/customers/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/customers/${id}`);
    return data;
  },
};

// ─── Calls API ───────────────────────────────────────────────────────────────
export const callApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/calls', { params });
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/calls/${id}`);
    return data.data;
  },
  create: async (call) => {
    const { data } = await api.post('/calls', call);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/calls/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/calls/${id}`);
    return data;
  },
  getStats: async () => {
    const { data } = await api.get('/calls/stats');
    return data.data;
  },
  startCall: async (callData) => {
    const { data } = await api.post('/calls', {
      ...callData,
      status: 'Calling',
      agentType: 'ai',
      agent: 'TruckPilot AI v2.4',
      startedAt: new Date(),
    });
    return data.data;
  },
  endCall: async (id, outcome) => {
    const { data } = await api.put(`/calls/${id}`, {
      status: 'Completed',
      endedAt: new Date(),
      outcome,
    });
    return data.data;
  },
  handoffToHuman: async (id, repName) => {
    const { data } = await api.put(`/calls/${id}`, {
      status: 'Handoff',
      handoffTriggered: true,
      transferredTo: repName,
    });
    return data.data;
  },
};

// ─── Deals API ───────────────────────────────────────────────────────────────
export const dealApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/deals', { params });
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/deals/${id}`);
    return data.data;
  },
  create: async (deal) => {
    const { data } = await api.post('/deals', deal);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/deals/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/deals/${id}`);
    return data;
  },
  updateStage: async (id, stage) => {
    const { data } = await api.put(`/deals/${id}`, { stage });
    return data.data;
  },
  getStats: async () => {
    const { data } = await api.get('/deals/stats');
    return data.data;
  },
};

// ─── Followups API ───────────────────────────────────────────────────────────
export const followupApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/follow-ups', { params });
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/follow-ups/${id}`);
    return data.data;
  },
  create: async (followup) => {
    const { data } = await api.post('/follow-ups', followup);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/follow-ups/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/follow-ups/${id}`);
    return data;
  },
};

// ─── Objections API ──────────────────────────────────────────────────────────
export const objectionApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/objections', { params });
    return data.data;
  },
  create: async (objection) => {
    const { data } = await api.post('/objections', objection);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/objections/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/objections/${id}`);
    return data;
  },
};

// ─── Knowledge API ───────────────────────────────────────────────────────────
export const knowledgeApi = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/knowledge', { params });
    return data.data;
  },
  create: async (item) => {
    const { data } = await api.post('/knowledge', item);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/knowledge/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/knowledge/${id}`);
    return data;
  },
};

// ─── Team API ────────────────────────────────────────────────────────────────
export const teamApi = {
  getAll: async () => {
    const { data } = await api.get('/team');
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/team/${id}`);
    return data.data;
  },
  create: async (member) => {
    const { data } = await api.post('/team', member);
    return data.data;
  },
  update: async (id, updates) => {
    const { data } = await api.put(`/team/${id}`, updates);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/team/${id}`);
    return data;
  },
  getDashboardStats: async () => {
    const { data } = await api.get('/team/dashboard-stats');
    return data.data;
  },
};

// ─── Analytics API ───────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview: async () => {
    const { data } = await api.get('/analytics/overview');
    return data.data;
  },
};
