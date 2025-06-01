import React, { useState } from 'react';
import { StickyNote } from 'lucide-react';
import Button from './ui/Button';
import StockNotesMultiDialog from './StockNotesMultiDialog';

const AddMultiNotesPanel: React.FC = () => {
  const [showMultiNotes, setShowMultiNotes] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 w-full sm:w-full lg:w-1/3 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300 flex items-center">
                <StickyNote className="w-5 h-5 mr-2 text-blue-600" />
                Add Notes
            </h2>
            <Button
                type="button"
                variant='ghost'
                className="flex items-center gap-2"
                onClick={() => setShowMultiNotes(true)}
            >
                <StickyNote className="w-5 h-5" />
                Add notes
            </Button>
        </div>
        {showMultiNotes && (
            <StockNotesMultiDialog open={showMultiNotes} onClose={() => setShowMultiNotes(false)} />
        )}      
    </div>
  );
};

export default AddMultiNotesPanel;
