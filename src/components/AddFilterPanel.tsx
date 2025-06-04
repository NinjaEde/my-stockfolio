import React, { useState } from 'react';
import { FunnelPlus, Layers } from 'lucide-react';
import StockNotesMultiDialog from './StockNotesMultiDialog';
import CustomSelect from './ui/CustomSelect';
import Button from './ui/Button';

const BOOKMARK_COLORS = [
  { name: 'All', value: '', color: 'transparent' }, 
  { name: 'Green', value: 'text-green-500', color: '#22c55e' },
  { name: 'Purple', value: 'text-purple-500', color: '#a21caf' },
  { name: 'Blue', value: 'text-blue-500', color: '#2563eb' },
  { name: 'Yellow', value: 'text-yellow-500', color: '#eab308' },
  { name: 'Red', value: 'text-red-500', color: '#ef4444' },
];

interface AddFilterPanelProps {
  filterColor: string;
  onFilterColorChange: (colorValue: string) => void;
  groupByColor: boolean;
  onGroupByColor: () => void;
}

const AddFilterPanel: React.FC<AddFilterPanelProps> = ({
  filterColor,
  onFilterColorChange,
  groupByColor,
  onGroupByColor,
}) => {
  const [showMultiNotes, setShowMultiNotes] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 w-full sm:w-full lg:w-1/3 flex flex-col items-start justify-start">
        <div className="w-full flex flex-wrap gap-4 items-start justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300 flex items-center">
                <FunnelPlus className="w-5 h-5 mr-2 text-blue-600" />
                Apply Filter
            </h2>
            <div className="flex gap-2 items-center">
              <CustomSelect
                options={BOOKMARK_COLORS.map(c => ({
                  label: c.name,
                  value: c.value,
                  color: c.color,
                }))}
                value={filterColor}
                onChange={onFilterColorChange}
                className="w-full min-w-[120px]"
              />
              <Button
                variant={groupByColor ? "primary" : "outline"}
                onClick={onGroupByColor}
                title="Group by bookmark color"
                className="flex items-center"
              >
                <Layers size={16} className="mr-1" />
                <span
                  className={`px-2 py-0.5 rounded transition-colors ${
                  groupByColor
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                    : "bg-transparent text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Group
                </span>
              </Button>
            </div>
        </div>
        {showMultiNotes && (
            <StockNotesMultiDialog open={showMultiNotes} onClose={() => setShowMultiNotes(false)} />
        )}      
    </div>
  );
};

export default AddFilterPanel;
