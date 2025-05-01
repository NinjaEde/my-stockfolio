import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, ListChecks, PlusCircle, MinusCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Button from './ui/Button';
import Textarea from './ui/Textarea';
import { getNotes, addNote, deleteNote } from '../services/stockService';
import { Note } from '../types';

interface StockNotesProps {
  stockId: string;
  onNotesUpdated?: () => void; // Add optional callback
}

const CHECKLIST_TEMPLATE = `### Technical Analysis Checklist

Moving Averages:
- [ ] Above 10 MA
- [ ] Above 50 MA
- [ ] Above 150 MA
- [ ] Above 200 MA

Volume:
- [ ] Low
- [ ] Medium
- [ ] High

Price Levels:
- Support: 
- Resistance: 

Additional Notes:

`;

const StockNotes: React.FC<StockNotesProps> = ({ stockId, onNotesUpdated }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [showAddNote, setShowAddNote] = useState(false); // Toggle state for "Add New Note"

  const loadNotes = async () => {
    setLoading(true);
    try {
      const notesData = await getNotes(stockId);
      setNotes(notesData);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [stockId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.trim()) {
      setError('Note content cannot be empty');
      return;
    }
    
    setAdding(true);
    setError('');
    
    try {
      const result = await addNote(stockId, newNote);
      if (result) {
        setNewNote('');
        loadNotes();
        onNotesUpdated?.(); // Notify parent
      } else {
        setError('Failed to add note');
      }
    } catch (err) {
      console.error('Error adding note:', err);
      setError('An error occurred while adding the note');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const result = await deleteNote(noteId);
        if (result) {
          loadNotes();
          onNotesUpdated?.(); // Notify parent
        }
      } catch (err) {
        console.error('Error deleting note:', err);
        setError('Failed to delete note');
      }
    }
  };

  const insertTemplate = () => {
    setNewNote(prevNote => {
      const prefix = prevNote.trim() ? `${prevNote}\n\n` : '';
      return `${prefix}${CHECKLIST_TEMPLATE}`;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAddNote(!showAddNote)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {showAddNote ? (
            <>
              <MinusCircle size={16} />
              Hide Add Note
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              Add New Note
            </>
          )}
        </Button>

        {showAddNote && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-800 mb-2 dark:text-gray-400">Add New Note</h4>
            <form onSubmit={handleAddNote} className="space-y-3">
              <div className="flex justify-end mb-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={insertTemplate}
                  className="flex items-center gap-2"
                >
                  <ListChecks size={16} />
                  Insert Checklist Template
                </Button>
              </div>
              
              <Textarea
                placeholder="Write your note in Markdown format..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="font-mono text-sm bg-white dark:bg-gray-800 dark:text-white"
              />
              
              {error && <p className="text-sm text-red-600">{error}</p>}
              
              <div className="text-right">
                <Button 
                  type="submit" 
                  disabled={adding || !newNote.trim()}
                  size="sm"
                >
                  {adding ? 'Saving...' : 'Save Note'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-2">History</h4>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-24 bg-gray-100 rounded"></div>
            <div className="h-24 bg-gray-100 rounded"></div>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-gray-500 italic">No notes yet</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="p-4 bg-gray-50 rounded-md border border-gray-100 dark:bg-gray-700 dark:border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">
                    {format(new Date(note.created_at), 'PPP p')}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 -mt-1 -mr-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {note.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockNotes;