import type { Stock } from '../types';

const API_BASE = '/api';

export const getStocks = async (): Promise<Stock[]> => {
  const res = await fetch(`${API_BASE}/stocks`);
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return res.json();
};

export const addStock = async (ticker_symbol: string, display_name: string): Promise<Stock> => {
  const res = await fetch(`${API_BASE}/stocks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker_symbol, display_name }),
  });
  if (!res.ok) throw new Error('Failed to add stock');
  return res.json();
};

export const deleteStock = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/stocks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete stock');
  return true;
};

export const updateStock = async (id: string, updates: Partial<Stock>): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/stocks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update stock');
  return true;
};
