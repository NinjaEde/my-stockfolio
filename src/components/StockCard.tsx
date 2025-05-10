import React, { useState, useEffect } from 'react';
import { BarChart4, Trash2, ChevronDown, ChevronUp, FileEdit, Bookmark } from 'lucide-react';
import Card, { CardHeader, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { deleteStock, updateStock } from '../services/stockService';
import { getNotes } from '../services/noteService';
import { Stock } from '../types';
import StockNotes from './StockNotes';
import Input from './ui/Input';

interface StockCardProps {
  stock: Stock;
  onDelete: () => void;
  detailsOpen: boolean;
  onUpdate?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onDelete, detailsOpen, onUpdate }) => {
  const [expandedDetails, setExpandedDetails] = useState(detailsOpen);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend' | 'chart' | 'notes' | 'financials'>('overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tickerSymbol, setTickerSymbol] = useState(stock.ticker_symbol);
  const [displayName, setDisplayName] = useState(stock.display_name);
  const [noteCount, setNoteCount] = useState(0);
  const [isInteresting, setIsInteresting] = useState(stock.is_interesting || false);
  const [bookmarkColor, setBookmarkColor] = useState(stock.bookmark_color || 'text-green-500');

  const predefinedColors = [
    { name: 'Green', text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500' },
    { name: 'Purple', text: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500' },
    { name: 'Blue', text: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500' },
    { name: 'Yellow', text: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-500' },
    { name: 'Red', text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500' },
  ];

  const tradingViewUrl = `https://de.tradingview.com/chart/${stock.chart_id}?symbol=${stock.ticker_symbol}`;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${stock.display_name}? This will also delete all associated notes.`)) {
      setIsDeleting(true);
      try {
        const result = await deleteStock(stock.ticker_symbol);
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
      await updateStock(stock.ticker_symbol, { ticker_symbol: tickerSymbol, display_name: displayName });
      stock.ticker_symbol = tickerSymbol;
      stock.display_name = displayName;
      setEditing(false);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleToggleInteresting = async () => {
    try {
      const updatedStock = { ...stock, is_interesting: !isInteresting };
      await updateStock(stock.ticker_symbol, updatedStock);
      setIsInteresting(!isInteresting); 
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleColorChange = async (color: string) => {
    setBookmarkColor(color);
    try {
      await updateStock(stock.ticker_symbol, { bookmark_color: color, is_interesting: true });
      setIsInteresting(true);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating bookmark color:', error);
    }
  };

  const refreshNoteCount = React.useCallback(async () => {
    const notes = await getNotes(stock.ticker_symbol);
    setNoteCount(notes.length);
  }, [stock.ticker_symbol]);

  useEffect(() => {
    refreshNoteCount();
  }, [stock.ticker_symbol, refreshNoteCount]);

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
          "theme": document.documentElement.classList.contains('dark') ? "dark" : "light",
          "style": "1",
          "locale": "de_DE",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "container_id": `tradingview_${stock.ticker_symbol}`
        });
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [expandedDetails, activeTab, stock.ticker_symbol]);

  useEffect(() => {
    if (expandedDetails && activeTab === 'overview') {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: stock.ticker_symbol,
        width: "100%",
        locale: "en",
        colorTheme: document.documentElement.classList.contains('dark') ? "dark" : "light",
        isTransparent: true,
      });
      const container = document.getElementById(`symbol-info_${stock.ticker_symbol}`);
      container?.appendChild(script);

      return () => {
        if (script.parentNode === container) {
          container?.removeChild(script);
        }
      };
    }
  }, [expandedDetails, activeTab, stock.ticker_symbol]);

  useEffect(() => {
    if (expandedDetails && activeTab === 'overview') {      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        interval: "1D",
        width: "100%",
        isTransparent: true,
        height: "100%",
        symbol: stock.ticker_symbol,
        showIntervalTabs: false,
        displayMode: "single",
        locale: "en",
        colorTheme: document.documentElement.classList.contains('dark') ? "dark" : "light",
        largeChartUrl: tradingViewUrl,
      });
      const container = document.getElementById(`trend-widget_${stock.ticker_symbol}`);
      container?.appendChild(script);

      return () => {
        if (script.parentNode === container) {
          container?.removeChild(script);
        }
      };
    }
  }, [expandedDetails, activeTab, stock.ticker_symbol, tradingViewUrl]);

  useEffect(() => {
    if (expandedDetails && activeTab === 'financials') {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        isTransparent: false,
        largeChartUrl: tradingViewUrl,
        displayMode: "regular",
        width: "100%",
        height: 400,
        colorTheme: document.documentElement.classList.contains('dark') ? "dark" : "light",
        symbol: stock.ticker_symbol,
        locale: "de_DE",
      });
      const container = document.getElementById(`financials-widget_${stock.ticker_symbol}`);
      container?.appendChild(script);

      return () => {
        if (script.parentNode === container) {
          container?.removeChild(script);
        }
      };
    }
  }, [expandedDetails, activeTab, stock.ticker_symbol, tradingViewUrl]);

  useEffect(() => {
    setExpandedDetails(detailsOpen);
  }, [detailsOpen]);

  useEffect(() => {
    setIsInteresting(stock.is_interesting || false);
    setBookmarkColor(stock.bookmark_color || 'text-green-500');
  }, [stock.is_interesting, stock.bookmark_color]);

  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-md bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 flex flex-col">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleInteresting}
              className={`flex items-center ${isInteresting ? '' : 'text-gray-700 dark:text-gray-300'} hover:${bookmarkColor}`}
            >
              <Bookmark size={16} className={`mr-1 ${isInteresting ? bookmarkColor : ''}`} fill={isInteresting ? 'currentColor' : 'none'} />
            </Button>
            <div className="absolute top-full mt-2 left-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {predefinedColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.text)}
                  className={`w-4 h-4 rounded-full ${color.border} ${color.bg} ${
                    bookmarkColor === color.text ? 'ring-1 ring-offset-1 ring-gray-400' : ''
                  }`}
                  title={`Select ${color.name}`}
                />
              ))}
            </div>
          </div>
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
            Details
          </Button>
        </div>
      </CardHeader>

      {expandedDetails && (
        <CardContent className="border-t border-gray-100 dark:border-gray-600 space-y-6 flex-grow">
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            <button
              className={`relative px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`relative px-4 py-2 text-sm font-medium ${activeTab === 'chart' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chart')}
            >
              Chart
            </button>
            <button
              className={`relative px-4 py-2 text-sm font-medium ${activeTab === 'financials' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('financials')}
            >
              Financials
            </button>
            <button
              className={`relative px-4 py-2 text-sm font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
              {noteCount > 0 && (
                <span className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                  {noteCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="flex flex-wrap gap-4">
              <section id={`symbol-info_${stock.ticker_symbol}`} className="flex-2 min-w-[150px]">
                <div className="tradingview-widget-container">
                  <div className="tradingview-widget-container__widget"></div>
                </div>
              </section>
              <section id={`trend-widget_${stock.ticker_symbol}`} className="flex-1 min-w-[300px]">
                <div className="tradingview-widget-container">
                  <div className="tradingview-widget-container__widget"></div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800">
              <div id={`tradingview_${stock.ticker_symbol}`}></div>
            </div>
          )}

          {activeTab === 'notes' && (
            <StockNotes stockId={stock.ticker_symbol} onNotesUpdated={refreshNoteCount} />
          )}

          {activeTab === 'financials' && (
            <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800">
              <div id={`financials-widget_${stock.ticker_symbol}`}></div>
            </div>
          )}
        </CardContent>
      )}

      <CardFooter className="flex justify-between items-center dark:bg-gray-700 mt-auto">
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Added on {new Date(stock.created_at).toLocaleDateString()}
        </p>

        <a
          href={tradingViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
        >
          <BarChart4 size={16} className="mr-1" />
          Open in TradingView
        </a>

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