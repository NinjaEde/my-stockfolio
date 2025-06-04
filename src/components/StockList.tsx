import React, { useState, useEffect } from 'react';
import { getStocks } from '../services/stockService';
import { Stock } from '../types';
import StockCard from './StockCard';
import Input from './ui/Input';
import { Filter, LoaderCircle, Tag, ListCollapse, List } from 'lucide-react';

interface StockListProps {
  filterColor: string;
  groupByColor: boolean;
  refreshTrigger?: number;
}

const BOOKMARK_COLORS = [
  { name: 'Green', value: 'text-green-500', color: '#22c55e' },
  { name: 'Purple', value: 'text-purple-500', color: '#a21caf' },
  { name: 'Blue', value: 'text-blue-500', color: '#2563eb' },
  { name: 'Yellow', value: 'text-yellow-500', color: '#eab308' },
  { name: 'Red', value: 'text-red-500', color: '#ef4444' },
];

const StockList: React.FC<StockListProps> = ({ filterColor, groupByColor, refreshTrigger }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const stocksData: Stock[] = await getStocks();
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
  }, [refreshTrigger]);

  // Filtering
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.ticker_symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.display_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = !filterColor || stock.bookmark_color === filterColor;
    return matchesSearch && matchesColor;
  });

  // Grouping
  const groupedStocks: Record<string, Stock[]> = {};
  if (groupByColor) {
    BOOKMARK_COLORS.forEach((c) => {
      groupedStocks[c.value] = filteredStocks.filter((stock) => stock.bookmark_color === c.value);
    });
  }

  const handleStockDeleted = () => {
    loadStocks();
  };

  const handleStockUpdated = () => {
    loadStocks();
  };

  return (
    <div className="space-y-4">
      <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2'>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mt-8 mb-4">My Portfolio</h2>
        <div className="flex flex-wrap items-center space-x-2 md:space-x-4">
          <div className="relative">
            <Input
              placeholder="Search by ticker symbol or display name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-md py-2"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            title={detailsOpen ? "Collapse all stock details" : "Expand all stock details"}
            className="ml-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            {detailsOpen ? <List size={16} /> : <ListCollapse size={16} />}
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoaderCircle className="animate-spin text-gray-400" size={40} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
          <p>{error}</p>
        </div>
      ) : stocks.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-6 my-4 text-center">
          <p className="text-lg">No stocks added yet. Add your first stock above!</p>
        </div>
      ) : filteredStocks.length === 0 ? (
        <>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-6 my-4 text-center">
            <p className="text-lg">No stocks match your search or filter. Try a different query or color.</p>
          </div>
        </>
      ) : groupByColor ? (
        <div className="space-y-8">
          {BOOKMARK_COLORS.filter(c => !filterColor || c.value === filterColor).map((c) => {
            const stocksInGroup = groupedStocks[c.value] || [];
            if (stocksInGroup.length === 0) return null;
            return (
              <div key={c.value}>
                <div className="flex items-center mb-2">
                  <Tag className={`${c.value} mr-2`} size={18} />
                  <span className={`font-semibold ${c.value}`}>{c.name}</span>
                  <span className="ml-2 text-xs text-gray-400">({stocksInGroup.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stocksInGroup.map((stock) => (
                    <StockCard
                      key={stock.id || stock.ticker_symbol}
                      stock={stock}
                      onDelete={handleStockDeleted}
                      onUpdate={handleStockUpdated}
                      detailsOpen={detailsOpen}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard 
              key={stock.id || stock.ticker_symbol} 
              stock={stock} 
              onDelete={handleStockDeleted} 
              onUpdate={handleStockUpdated}
              detailsOpen={detailsOpen} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StockList;