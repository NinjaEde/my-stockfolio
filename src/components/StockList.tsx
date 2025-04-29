import React, { useState, useEffect } from 'react';
import { getStocks } from '../services/stockService';
import { Stock } from '../types';
import StockCard from './StockCard';

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStocks = async () => {
    setLoading(true);
    try {
      const stocksData = await getStocks();
      setStocks(stocksData);
      setError('');
    } catch (err) {
      console.error('Error loading stocks:', err);
      setError('Failed to load stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const handleStockDeleted = () => {
    loadStocks();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <p>{error}</p>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-6 my-4 text-center">
        <p className="text-lg">No stocks added yet. Add your first stock above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Your Portfolio</h2>
      <div className="grid grid-cols-1 gap-6">
        {stocks.map((stock) => (
          <StockCard 
            key={stock.id} 
            stock={stock} 
            onDelete={handleStockDeleted} 
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;