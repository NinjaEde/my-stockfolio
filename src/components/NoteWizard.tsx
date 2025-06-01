import React, { useState, useEffect } from 'react';
import { ListChecks, SquareCheckBig, SquareX } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import { Stock } from '../types';

interface NoteWizardProps {
  onSubmit: (data: any, selectedStockId?: string) => Promise<void>;
  loading: boolean;
  stocks?: Stock[];
  showStockSelect?: boolean;
  selectedStockId?: string;
  setSelectedStockId?: (id: string) => void;
  initialData?: any;
  onCancel?: () => void;
  editing?: boolean;
}

const initialWizardData = {
  movingAverages: { ma10: false, ma50: false, ma150: false, ma200: false },
  volume: 'Low',
  support: '',
  resistance: '',
  additionalNotes: '',
};

const NoteWizard: React.FC<NoteWizardProps> = ({
  onSubmit,
  loading,
  stocks = [],
  showStockSelect = false,
  selectedStockId: controlledStockId,
  setSelectedStockId: setControlledStockId,
  initialData,
  onCancel,
  editing = false,
}) => {
  const [wizardData, setWizardData] = useState(initialData || initialWizardData);
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [uncontrolledStockId, setUncontrolledStockId] = useState(stocks[0]?.ticker_symbol || '');

  useEffect(() => {
    if (initialData) setWizardData(initialData);
  }, [initialData]);

  const selectedStockId = showStockSelect && controlledStockId !== undefined ? controlledStockId : uncontrolledStockId;
  const setSelectedStockId = showStockSelect && setControlledStockId ? setControlledStockId : setUncontrolledStockId;

  const renderCheckIcon = (checked: boolean) =>
    checked ? (
      <SquareCheckBig className="inline-block text-green-600 w-5 h-5" />
    ) : (
      <SquareX className="inline-block text-red-500 w-5 h-5" />
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(
      { ...wizardData, currency },
      showStockSelect ? selectedStockId : undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showStockSelect && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Select Stock</label>
          <select
            value={selectedStockId}
            onChange={e => setSelectedStockId(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300"
          >
            {stocks.map(stock => (
              <option key={stock.ticker_symbol} value={stock.ticker_symbol}>
                {stock.display_name} ({stock.ticker_symbol})
              </option>
            ))}
          </select>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ListChecks size={16} /> Technical Analysis Wizard
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Moving Averages</h4>
          <div className="space-y-2">
            {(['ma10', 'ma50', 'ma150', 'ma200'] as const).map((key) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  hidden
                  checked={wizardData.movingAverages[key]}
                  onChange={(e) =>
                    setWizardData((prev: any) => ({
                      ...prev,
                      movingAverages: { ...prev.movingAverages, [key]: e.target.checked },
                    }))
                  }
                />
                <span>{renderCheckIcon(wizardData.movingAverages[key])} Above {key.replace('ma', '')} MA</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium">Volume</h4>
          <select
            value={wizardData.volume}
            onChange={(e) => setWizardData((prev: any) => ({ ...prev, volume: e.target.value }))}
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
              type='number'
              value={wizardData.support}
              onChange={(e) =>
                setWizardData((prev: any) => ({
                  ...prev,
                  support: e.target.value,
                }))
              }
              className="flex-1 text-right"
            />
            <Input
              label="Resistance"
              type='number'
              value={wizardData.resistance}
              onChange={(e) =>
                setWizardData((prev: any) => ({
                  ...prev,
                  resistance: e.target.value,
                }))
              }
              className="flex-1 text-right"
            />
            <Select
              label="Currency"
              value={currency}
              onChange={e => setCurrency(e.target.value as 'EUR' | 'USD')}
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
            onChange={(e) => setWizardData((prev: any) => ({ ...prev, additionalNotes: e.target.value }))}
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editing ? 'Update' : 'Add Note'}
        </Button>
      </div>
    </form>
  );
};

export default NoteWizard;
