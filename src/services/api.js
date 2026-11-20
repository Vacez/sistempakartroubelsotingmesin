const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

export const api = {
  checkHealth: () => request('/health'),
  getBootstrap: () => request('/bootstrap'),
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  createUser: (userData) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  deleteUser: (id) =>
    request(`/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  createDiagnosa: (record) =>
    request('/diagnosa', {
      method: 'POST',
      body: JSON.stringify(record),
    }),
  createTicket: (ticket) =>
    request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    }),
  takeTicket: (ticketId, status, teknisiPenanggung) =>
    request(`/tickets/${encodeURIComponent(ticketId)}/take`, {
      method: 'PATCH',
      body: JSON.stringify({ status, teknisiPenanggung }),
    }),
  finishTicket: (ticketId, repairDetails) =>
    request(`/tickets/${encodeURIComponent(ticketId)}/finish`, {
      method: 'PATCH',
      body: JSON.stringify(repairDetails),
    }),
  chatWithAi: (message, history = [], file = null) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, file }),
    }),
};
