import React, { useState, useEffect } from 'react';
import { getStocks } from '../services/stockService';
import { Stock } from '../types';
import StockCard from './StockCard';
import Input from './ui/Input';
import { Filter } from 'lucide-react';

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadStocks = async () => {
    setLoading(true);
    try {
      const stocksData = await getStocks();
      setStocks(stocksData);
      setFilteredStocks(stocksData);
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

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = stocks.filter(
      (stock) =>
        stock.ticker_symbol.toLowerCase().includes(query) ||
        stock.display_name.toLowerCase().includes(query)
    );
    setFilteredStocks(filtered);
  }, [searchQuery, stocks]);

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mt-8 mb-4">My Portfolio</h2>
      {stocks.length > 0 && (
        <div className="relative mb-4">
          <Input
            placeholder="Search by ticker symbol or display name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      )}
      {stocks.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-6 my-4 text-center">
          <p className="text-lg">No stocks added yet. Add your first stock above!</p>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-6 my-4 text-center">
          <p className="text-lg">No stocks match your search. Try a different query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard 
              key={stock.id} 
              stock={stock} 
              onDelete={handleStockDeleted} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;