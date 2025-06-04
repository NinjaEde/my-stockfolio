import React, { useState, useRef } from 'react';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { addStock } from '../services/stockService';

interface AddStockFormProps {
  onStockAdded: () => void;
}

const AddStockForm: React.FC<AddStockFormProps> = ({ onStockAdded }) => {
  const [ticker, setTicker] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const tickerInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker) {
      setError('Ticker symbol is required');
      return;
    }
    
    if (!displayName) {
      setError('Display name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await addStock(ticker.toUpperCase(), displayName);
      
      if (result) {
        setTicker('');
        setDisplayName('');
        onStockAdded();
        tickerInputRef.current?.focus();
      } else {
        setError('Failed to add stock. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while adding the stock');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 w-full sm:w-full lg:w-1/3 flex flex-col items-start justify-start">
      <div 
        className="w-full flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300 flex items-center">
          <PlusCircle className="w-5 h-5 mr-2 text-blue-600" />
          Add New Stock
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </div>

      <div 
        className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen py-4' : 'max-h-0 py-0'}`}
      >
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4 px-2"
        >
            <div className="flex flex-col md:flex-row sm:items-start gap-4 w-full">
            <Input
              label="Ticker Symbol"
              placeholder="e.g., AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="flex-1"
              required
              ref={tickerInputRef}
            />
            
            <Input
              label="Display Name"
              placeholder="e.g., Apple Inc."
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="flex-1"
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              {loading ? 'Adding...' : 'Add Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockForm;