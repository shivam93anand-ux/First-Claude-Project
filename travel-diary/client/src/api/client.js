const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('travel_diary_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('travel_diary_token');
    localStorage.removeItem('travel_diary_user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Trips
  getTrips: () => request('/trips'),
  createTrip: (body) => request('/trips', { method: 'POST', body: JSON.stringify(body) }),
  getTrip: (id) => request(`/trips/${id}`),
  updateTrip: (id, body) => request(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTrip: (id) => request(`/trips/${id}`, { method: 'DELETE' }),

  // Public trip
  getSharedTrip: (token) => request(`/trips/shared/${token}`),

  // Moments
  createMoment: (tripId, formData) => request(`/trips/${tripId}/moments`, { method: 'POST', body: formData }),
  updateMoment: (id, body) => request(`/moments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteMoment: (id) => request(`/moments/${id}`, { method: 'DELETE' }),
};
