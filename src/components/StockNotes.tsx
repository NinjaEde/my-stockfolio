import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Trash2, ListChecks } from 'lucide-react';
import Button from './ui/Button';
import Textarea from './ui/Textarea';
import Input from './ui/Input';
import Select from './ui/Select';
import { getNotes, addNote, deleteNote, updateNote } from '../services/stockService';
import { Note } from '../types';

interface StockNotesProps {
  stockId: string;
  onNotesUpdated?: () => void; // Add optional callback
}

const StockNotes: React.FC<StockNotesProps> = ({ stockId, onNotesUpdated }) => {
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
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR'); // State for currency selection

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
    setEditingNoteId(null); // Ensure no note is being edited when opening the wizard
  };

  const closeWizard = () => {
    setShowWizard(false);
    setEditingNoteId(null); // Reset editing state when wizard is closed
  };

  const handleWizardSubmit = async () => {
    const { movingAverages, volume, support, resistance, additionalNotes } = wizardData;
    const formattedNote = {
      movingAverages,
      volume,
      support,
      resistance,
      additionalNotes,
    };

    setAdding(true);

    try {
      if (editingNoteId) {
        // Update existing note
        const result = await updateNote(editingNoteId, JSON.stringify(formattedNote));
        if (result) {
          setEditingNoteId(null);
          loadNotes();
          onNotesUpdated?.(); // Notify parent
          closeWizard();
        } else {
          console.error('Failed to update note');
        }
      } else {
        // Add new note
        const result = await addNote(stockId, JSON.stringify(formattedNote));
        if (result) {
          loadNotes();
          onNotesUpdated?.(); // Notify parent
          closeWizard();
        } else {
          console.error('Failed to save note');
        }
      }
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setAdding(false);
    }
  };

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
                  {note.movingAverages.ma10 ? '✔' : '✘'}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 50 MA
                </td>
                <td className="table-cell">
                  {note.movingAverages.ma50 ? '✔' : '✘'}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 150 MA
                </td>
                <td className="table-cell">
                  {note.movingAverages.ma150 ? '✔' : '✘'}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Above 200 MA
                </td>
                <td className="table-cell">
                  {note.movingAverages.ma200 ? '✔' : '✘'}
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
                  {note.support} {currency}
                </td>
              </tr>
              <tr>
                <td className="table-cell font-medium">
                  Resistance
                </td>
                <td className="table-cell">
                  {note.resistance} {currency}
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

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as 'EUR' | 'USD');
  };

  const parseCurrencyValue = (value: string) => {
    // Replace German comma separator with a dot for parsing
    const normalizedValue = value.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);
    return isNaN(numericValue) ? '' : numericValue.toFixed(2); // Ensure two decimal places
  };

  const handleBlur = (field: 'support' | 'resistance') => {
    setWizardData((prev) => ({
      ...prev,
      [field]: parseCurrencyValue(prev[field]),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openWizard} // Directly open the wizard
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ListChecks size={16} />
          Add New Note
        </Button>
      </div>

      {showWizard && (
        <div className="fixed inset-0 bg-black/35 dark:bg-black/75 flex justify-center items-center z-50 h-dvh">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Technical Analysis Wizard</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Moving Averages</h4>
                <div className="space-y-2">
                  {(['ma10', 'ma50', 'ma150', 'ma200'] as const).map((key) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={wizardData.movingAverages[key]}
                        onChange={(e) =>
                          setWizardData((prev) => ({
                            ...prev,
                            movingAverages: { ...prev.movingAverages, [key]: e.target.checked },
                          }))
                        }
                      />
                      <span>Above {key.replace('ma', '')} MA</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Volume</h4>
                <select
                  value={wizardData.volume}
                  onChange={(e) => setWizardData((prev) => ({ ...prev, volume: e.target.value }))}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <h4 className="font-medium">Price Levels</h4>
                <div className="flex items-end gap-4">
                  <Input
                    label="Support"
                    value={wizardData.support}
                    onChange={(e) =>
                      setWizardData((prev) => ({
                        ...prev,
                        support: e.target.value, // Allow raw input
                      }))
                    }
                    onBlur={() => handleBlur('support')} // Format on blur
                    className="flex-1"
                  />
                  <Input
                    label="Resistance"
                    value={wizardData.resistance}
                    onChange={(e) =>
                      setWizardData((prev) => ({
                        ...prev,
                        resistance: e.target.value, // Allow raw input
                      }))
                    }
                    onBlur={() => handleBlur('resistance')} // Format on blur
                    className="flex-1"
                  />
                  <Select
                    label="Currency"
                    value={currency}
                    onChange={handleCurrencyChange}
                    className="flex-1"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Additional Notes</h4>
                <Textarea
                  value={wizardData.additionalNotes}
                  onChange={(e) => setWizardData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={closeWizard}>
                Cancel
              </Button>
              <Button onClick={handleWizardSubmit} disabled={adding}>
                {adding ? 'Saving...' : editingNoteId ? 'Update' : 'Add Note'}
              </Button>
            </div>
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
                    {format(new Date(note.created_at), 'PPP p')}
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