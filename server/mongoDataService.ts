import type { Stock } from '../types';

const API_BASE = '/api';

export const addStock = async (ticker_symbol: string, display_name: string) => {
  const newStock = {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    ticker_symbol,
    display_name,
    chart_id: "Qkb0J0s0",
    created_at: new Date().toISOString(),
    is_interesting: false,
    bookmark_color: 'text-green-500'
  };
  const res = await fetch(`${API_BASE}/stocks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStock)
  });
  if (!res.ok) throw new Error('Failed to add stock');
  return await res.json();
};

export const getStocks = async () => {
  const res = await fetch(`${API_BASE}/stocks`);
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return await res.json();
};

export const deleteStock = async (id: string) => {
  const res = await fetch(`${API_BASE}/stocks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete stock');
  return true;
};

export const updateStock = async (id: string, updates: Partial<Stock>) => {
  const res = await fetch(`${API_BASE}/stocks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update stock');
  return true;
};

export const addNote = async (stock_id: string, content: string) => {
  const newNote = {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    stock_id,
    content,
    created_at: new Date().toISOString()
  };
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  });
  if (!res.ok) throw new Error('Failed to add note');
  return await res.json();
};

export const getNotes = async (stock_id: string) => {
  const res = await fetch(`${API_BASE}/notes/${stock_id}`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return await res.json();
};

export const deleteNote = async (id: string) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
  return true;
};

export const updateNote = async (id: string, content: string) => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, created_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error('Failed to update note');
  return true;
};

