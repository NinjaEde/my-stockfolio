import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Trash2, ListChecks, SquareCheckBig, SquareX } from 'lucide-react';
import Button from './ui/Button';
import NoteWizard from './NoteWizard';
import { getNotes, addNote, deleteNote, updateNote } from '../services/noteService';
import { Note } from '../types';

interface StockNotesProps {
  stockId: string;
  onNotesUpdated?: () => void;
  showStockSelect?: boolean;
}

const StockNotes: React.FC<StockNotesProps> = ({ stockId, onNotesUpdated, showStockSelect = false }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showWizard, setShowWizard] = useState(false); // State for wizard visibility
  const [wizardData, setWizardData] = useState<{
    movingAverages: { ma10: boolean; ma50: boolean; ma150: boolean; ma200: boolean };
    volume: string;
    support: string;
    resistance: string;
    additionalNotes: string;
  }>({
    movingAverages: { ma10: false, ma50: false, ma150: false, ma200: false },
    volume: 'Low',
    support: '',
    resistance: '',
    additionalNotes: '',
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null); // Track the note being edited

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const notesData = await getNotes(stockId);
      setNotes(notesData);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }, [stockId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (showWizard) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showWizard]);

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
      }
    }
  };

  const openWizard = () => {
    setShowWizard(true);
    setEditingNoteId(null);
    setWizardData({
      movingAverages: { ma10: false, ma50: false, ma150: false, ma200: false },
      volume: 'Low',
      support: '',
      resistance: '',
      additionalNotes: '',
    });
  };

  const closeWizard = () => {
    setShowWizard(false);
    setEditingNoteId(null); // Reset editing state when wizard is closed
  };

  const handleWizardSubmit = async (data: any) => {
    setAdding(true);
    try {
      if (editingNoteId) {
        const result = await updateNote(editingNoteId, JSON.stringify(data));
        if (result) {
          setEditingNoteId(null);
          loadNotes();
          onNotesUpdated?.();
          closeWizard();
        }
      } else {
        const result = await addNote(stockId, JSON.stringify(data));
        if (result) {
          loadNotes();
          onNotesUpdated?.();
          closeWizard();
        }
      }
    } catch (err) {
      // handle error
    } finally {
      setAdding(false);
    }
  };

  // Helper for checked/unchecked icon
  const renderCheckIcon = (checked: boolean) =>
    checked ? (
      <SquareCheckBig className="inline-block text-green-600 w-5 h-5" />
    ) : (
      <SquareX className="inline-block text-red-500 w-5 h-5" />
    );

  const renderNoteContent = (noteContent: string) => {
    try {
      const note = JSON.parse(noteContent);
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
          <table className="table-auto w-full text-left border-collapse border border-gray-200 dark:border-gray-600">
            <tbody>
              <tr>
                <td colSpan={2} className="table-header">
                  Moving Averages
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 10 MA
                </td>
                <td className="table-cell">
                  {renderCheckIcon(note.movingAverages.ma10)}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 50 MA
                </td>
                <td className="table-cell">
                  {renderCheckIcon(note.movingAverages.ma50)}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 150 MA
                </td>
                <td className="table-cell">
                  {renderCheckIcon(note.movingAverages.ma150)}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 200 MA
                </td>
                <td className="table-cell">
                  {renderCheckIcon(note.movingAverages.ma200)}
                </td>
              </tr>

              <tr>
                <td colSpan={2} className="table-header">
                  Volume
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Volume
                </td>
                <td className="table-cell">
                  {note.volume}
                </td>
              </tr>

              <tr>
                <td colSpan={2} className="table-header">
                  Price Levels
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Support
                </td>
                <td className="table-cell">
                  {note.support}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Resistance
                </td>
                <td className="table-cell">
                  {note.resistance}
                </td>
              </tr>

              <tr>
                <td colSpan={2} className="table-header">
                  Additional Notes
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="table-cell">
                  {note.additionalNotes}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } catch {
      return <p>{noteContent}</p>;
    }
  };

  const handleEditNote = (noteId: string) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      try {
        const parsedNote = JSON.parse(noteToEdit.content);
        setWizardData(parsedNote);
        setEditingNoteId(noteId); // Set the note being edited
        setShowWizard(true);
      } catch {
        console.error('Failed to parse note content for editing');
      }
    }
  };

  return (
    <div className="space-y-6">
      {showStockSelect && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Select Stock</label>
          {/* TODO: Implement stock selection if needed for multi-stock mode. For now, handled in StockNotesMultiDialog. */}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openWizard}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ListChecks size={16} />
          Add New Note
        </Button>
      </div>
      {showWizard && (
        <div className="fixed inset-0 bg-black/35 dark:bg-black/75 flex justify-center items-center z-50 h-dvh">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <NoteWizard
              onSubmit={handleWizardSubmit}
              loading={adding}
              initialData={wizardData}
              onCancel={closeWizard}
              editing={!!editingNoteId}
            />
          </div>
        </div>
      )}

      <div className='max-h-[350px] overflow-y-auto'>
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-400 mb-2">History</h4>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-24 bg-gray-100 rounded dark:bg-gray-800"></div>
            <div className="h-24 bg-gray-100 rounded dark:bg-gray-800"></div>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-gray-500 italic dark:text-gray-400">No notes yet</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="p-4 bg-white rounded-md border border-gray-300 dark:bg-gray-900 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {note.created_at && !isNaN(Date.parse(note.created_at))
                      ? format(new Date(note.created_at), 'PPP p')
                      : 'N/A'}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note.id)}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200">
                  {renderNoteContent(note.content)}
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