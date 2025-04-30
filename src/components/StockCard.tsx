import React, { useState, useEffect } from 'react';
import { BarChart4, Trash2, ChevronDown, ChevronUp, FileEdit } from 'lucide-react';
import Card, { CardHeader, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { deleteStock, updateStock } from '../services/stockService';
import { Stock } from '../types';
import StockNotes from './StockNotes';
import Input from './ui/Input';

interface StockCardProps {
  stock: Stock;
  onDelete: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onDelete }) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'notes'>('chart');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tickerSymbol, setTickerSymbol] = useState(stock.ticker_symbol);
  const [displayName, setDisplayName] = useState(stock.display_name);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${stock.display_name}? This will also delete all associated notes.`)) {
      setIsDeleting(true);
      try {
        const result = await deleteStock(stock.id);
        if (result) {
          onDelete();
        }
      } catch (error) {
        console.error('Error deleting stock:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateStock(stock.id, { ticker_symbol: tickerSymbol, display_name: displayName });
      setEditing(false);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  useEffect(() => {
    if (expandedDetails && activeTab === 'chart') {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new window.TradingView.widget({
          "width": "100%",
          "height": 400,
          "symbol": stock.ticker_symbol,
          "interval": "D",
          "timezone": "Europe/Berlin",
          "theme": "light",
          "style": "1",
          "locale": "de_DE",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "container_id": `tradingview_${stock.id}`
        });
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [expandedDetails, activeTab, stock.ticker_symbol, stock.id]);

  const tradingViewUrl = `https://de.tradingview.com/chart/${stock.chart_id}?symbol=${stock.ticker_symbol}`;

  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-md bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500">
      <CardHeader className="flex justify-between items-center">
        <div className="flex flex-col">
          {editing ? (
            <div className="space-y-2 flex items-start space-x-2">
              <Input
                placeholder="Ticker Symbol"
                value={tickerSymbol}
                onChange={(e) => setTickerSymbol(e.target.value)}
                required
              />
              <Input
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stock.display_name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">{stock.ticker_symbol}</p>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FileEdit size={16} className="mr-1" />
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedDetails(!expandedDetails)}
            aria-label={expandedDetails ? "Collapse Details" : "Expand Details"}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {expandedDetails ? <ChevronUp size={18} className="mr-1" /> : <ChevronDown size={18} className="mr-1" />}
            {expandedDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </CardHeader>

      {expandedDetails && (
        <CardContent className="border-t border-gray-100 dark:border-gray-600 space-y-6">
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'chart' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chart')}
            >
              Chart
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </div>

          {activeTab === 'chart' && (
            <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800">
              <div id={`tradingview_${stock.id}`}></div>
              <a
                href={tradingViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
              >
                <BarChart4 size={16} className="mr-1" />
                Open in TradingView
              </a>
            </div>
          )}

          {activeTab === 'notes' && <StockNotes stockId={stock.id} />}
        </CardContent>
      )}

      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Added on {new Date(stock.created_at).toLocaleDateString()}
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StockCard;