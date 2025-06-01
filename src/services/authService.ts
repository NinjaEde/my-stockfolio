const API_BASE = '/api';

export const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  return fetch(url, { ...options, headers });
};

export const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 201) return { success: true };
  const data = await res.json();
  return { success: false, error: data.error };
};

export const login = async (username: string, password: string): Promise<{ token?: string; username?: string; error?: string }> => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.ok) return res.json();
  const data = await res.json();
  return { error: data.error };
};

export { fetchWithAuth };
