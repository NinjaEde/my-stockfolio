import React, { useState, useEffect } from 'react';
import { getStocks, getStocksByBookmarkColor, groupStocksByBookmarkColor } from '../services/stockService';
import { Stock } from '../types';
import StockCard from './StockCard';
import Input from './ui/Input';
import { Filter, ChevronsDownUp, ChevronsUpDown, Layers, Tag, LoaderCircle } from 'lucide-react';
import Button from './ui/Button';
import CustomSelect from './ui/CustomSelect';

const BOOKMARK_COLORS = [
  { name: 'All', value: '', color: 'transparent' }, 
  { name: 'Green', value: 'text-green-500', color: '#22c55e' },
  { name: 'Purple', value: 'text-purple-500', color: '#a21caf' },
  { name: 'Blue', value: 'text-blue-500', color: '#2563eb' },
  { name: 'Yellow', value: 'text-yellow-500', color: '#eab308' },
  { name: 'Red', value: 'text-red-500', color: '#ef4444' },
];

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterColor, setFilterColor] = useState('');
  const [groupByColor, setGroupByColor] = useState(false);
  const [groupedStocks, setGroupedStocks] = useState<Record<string, Stock[]>>({});

  const loadStocks = async () => {
    setLoading(true);
    try {
      let stocksData: Stock[];
      if (filterColor) {
        stocksData = await getStocksByBookmarkColor(filterColor);
      } else {
        stocksData = await getStocks();
      }
      setStocks(stocksData);
      setFilteredStocks(stocksData);
      setError('');
      if (groupByColor) {
        const grouped = await groupStocksByBookmarkColor();
        setGroupedStocks(grouped);
      } else {
        setGroupedStocks({});
      }
    } catch (err) {
      console.error('Error loading stocks:', err);
      setError('Failed to load stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
    // eslint-disable-next-line
  }, [filterColor, groupByColor]);

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

  const handleStockUpdated = () => {
    loadStocks();
  };

  const toggleDetails = () => {
    setDetailsOpen((prev) => !prev);
  };

  const handleColorFilterChange = (colorValue: string) => {
    setFilterColor(colorValue);
  };

  const handleGroupByColor = () => {
    setGroupByColor((prev) => !prev);
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
          <div className="min-w-[160px]">
            <CustomSelect
              options={BOOKMARK_COLORS.map(c => ({
                label: c.name,
                value: c.value,
                color: c.color,
              }))}
              value={filterColor}
              onChange={handleColorFilterChange}
              className="w-full"
            />
          </div>
          <Button
            variant={groupByColor ? "primary" : "outline"}
            onClick={handleGroupByColor}
            title="Group by bookmark color"
            className="flex items-center"
          >
            <Layers size={16} className="mr-1" />
            {groupByColor ? "Ungroup" : "Group by color"}
          </Button>
          <Button
            variant="outline"
            onClick={toggleDetails}
            title={detailsOpen ? "Collapse all stock details" : "Expand all stock details"}
          >
            {detailsOpen ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
          </Button>
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
          {Object.entries(groupedStocks)
            .filter(([color]) => !filterColor || color === filterColor)
            .map(([color, stocksInGroup]) => (
              <div key={color}>
                <div className="flex items-center mb-2">
                  <Tag className={`${color} mr-2`} size={18} />
                  <span className={`font-semibold ${color}`}>{BOOKMARK_COLORS.find(c => c.value === color)?.name || color}</span>
                  <span className="ml-2 text-xs text-gray-400">({stocksInGroup.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stocksInGroup
                    .filter(
                      (stock) =>
                        stock.ticker_symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        stock.display_name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((stock) => (
                      <StockCard
                        key={stock.id}
                        stock={stock}
                        onDelete={handleStockDeleted}
                        onUpdate={handleStockUpdated}
                        detailsOpen={detailsOpen}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard 
              key={stock.id} 
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