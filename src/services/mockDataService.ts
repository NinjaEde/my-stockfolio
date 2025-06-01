import { v4 as uuidv4 } from 'uuid';
import { Stock, Note } from '../types';

const STOCKS_KEY = 'stockfolio_stocks';
const NOTES_KEY = 'stockfolio_notes';

// Helper functions to interact with localStorage
const getStoredStocks = (): Stock[] => {
  const stored = localStorage.getItem(STOCKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getStoredNotes = (): Note[] => {
  const stored = localStorage.getItem(NOTES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredStocks = (stocks: Stock[]) => {
  localStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
};

const setStoredNotes = (notes: Note[]) => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

// Mock service functions
export const addStock = async (ticker_symbol: string, display_name: string): Promise<Stock | null> => {
  try {
    const newStock: Stock = {
      id: uuidv4(),
      ticker_symbol,
      display_name,
      created_at: new Date().toISOString(),
      is_interesting: false,
      bookmark_color: 'text-green-500'
    };

    const stocks = getStoredStocks();
    stocks.push(newStock);
    setStoredStocks(stocks);

    return newStock;
  } catch (error) {
    console.error('Error adding stock:', error);
    return null;
  }
};

export const getStocks = async (): Promise<Stock[]> => {
  try {
    return getStoredStocks();
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
};

export const deleteStock = async (id: string): Promise<boolean> => {
  try {
    // Delete associated notes
    const notes = getStoredNotes();
    const filteredNotes = notes.filter(note => note.stock_id !== id);
    setStoredNotes(filteredNotes);

    // Delete stock
    const stocks = getStoredStocks();
    const filteredStocks = stocks.filter(stock => stock.id !== id);
    setStoredStocks(filteredStocks);

    return true;
  } catch (error) {
    console.error('Error deleting stock:', error);
    return false;
  }
};

export const addNote = async (stock_id: string, content: string): Promise<Note | null> => {
  try {
    const newNote: Note = {
      id: uuidv4(),
      stock_id,
      content,
      created_at: new Date().toISOString()
    };

    const notes = getStoredNotes();
    notes.push(newNote);
    setStoredNotes(notes);

    return newNote;
  } catch (error) {
    console.error('Error adding note:', error);
    return null;
  }
};

export const getNotes = async (stock_id: string): Promise<Note[]> => {
  try {
    const notes = getStoredNotes();
    return notes.filter(note => note.stock_id === stock_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

export const deleteNote = async (id: string): Promise<boolean> => {
  try {
    const notes = getStoredNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    setStoredNotes(filteredNotes);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};

export const updateStock = async (id: string, updates: Partial<Stock>): Promise<boolean> => {
  try {
    const stocks = getStoredStocks();
    const stockIndex = stocks.findIndex(stock => stock.id === id);
    if (stockIndex === -1) return false;

    stocks[stockIndex] = { ...stocks[stockIndex], ...updates };
    setStoredStocks(stocks);
    return true;
  } catch (error) {
    console.error('Error updating stock:', error);
    return false;
  }
};

export const updateNote = async (id: string, content: string): Promise<boolean> => {
  try {
    const notes = getStoredNotes();
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex === -1) return false;

    notes[noteIndex] = { ...notes[noteIndex], content, created_at: new Date().toISOString() };
    setStoredNotes(notes);
    return true;
  } catch (error) {
    console.error('Error updating note:', error);
    return false;
  }
};
