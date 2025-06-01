import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getStocks } from '../services/stockService';
import { addNote } from '../services/noteService';
import { Stock } from '../types';
import NoteWizard from './NoteWizard';

interface StockNotesMultiDialogProps {
  open: boolean;
  onClose: () => void;
}

const StockNotesMultiDialog: React.FC<StockNotesMultiDialogProps> = ({ open, onClose }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // for resetting wizard fields only

  useEffect(() => {
    if (open) {
      getStocks().then(setStocks);
    }
  }, [open]);

  useEffect(() => {
    if (stocks.length > 0 && !selectedStockId) {
      setSelectedStockId(stocks[0].ticker_symbol);
    }
  }, [stocks, selectedStockId]);

  const handleSubmit = async (data: Record<string, unknown>, stockIdFromForm?: string) => {
    setAdding(true);
    try {
      const stockId = stockIdFromForm || selectedStockId;
      await addNote(stockId, JSON.stringify(data));
      if (keepOpen) {
        // Only reset wizard fields, not dropdown or checkbox
        setFormKey((k) => k + 1);
      } else {
        onClose();
      }
    } catch {
      // Fehlerbehandlung ggf. anzeigen
    } finally {
      setAdding(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Notes to Multiple Stocks</h2>
        <NoteWizard
          key={formKey}
          onSubmit={handleSubmit}
          loading={adding}
          stocks={stocks}
          showStockSelect={true}
          selectedStockId={selectedStockId}
          setSelectedStockId={setSelectedStockId}
          onCancel={onClose}
        />
        <div className="mt-4 flex items-center gap-2 justify-end">
          <input
            type="checkbox"
            id="keepOpen"
            checked={keepOpen}
            onChange={e => setKeepOpen(e.target.checked)}
          />
          <label htmlFor="keepOpen" className="text-sm">Add another note after this?</label>
        </div>
      </div>
    </div>
  );
};

export default StockNotesMultiDialog;
