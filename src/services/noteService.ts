import type { Note } from '../types';

const API_BASE = '/api';

export const getNotes = async (stock_id: string): Promise<Note[]> => {
  const res = await fetch(`${API_BASE}/notes/${stock_id}`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
};

export const addNote = async (stock_id: string, content: string): Promise<Note> => {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_id, content }),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
};

export const deleteNote = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
  return true;
};

export const updateNote = async (id: string, content: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return true;
};