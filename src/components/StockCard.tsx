import React, { useState, useEffect } from 'react';
import { BarChart4, Trash2, ChevronDown, ChevronUp, FileEdit } from 'lucide-react';
import Card, { CardHeader, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { deleteStock } from '../services/stockService';
import { Stock } from '../types';
import StockNotes from './StockNotes';

interface StockCardProps {
  stock: Stock;
  onDelete: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  useEffect(() => {
    if (expanded) {
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
  }, [expanded, stock.ticker_symbol, stock.id]);
  
  const tradingViewUrl = `https://de.tradingview.com/chart/${stock.chart_id}?symbol=${stock.ticker_symbol}`;
  
  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-md">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{stock.display_name}</h3>
          <p className="text-sm text-gray-500">{stock.ticker_symbol}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <a 
            href={tradingViewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <BarChart4 className="w-4 h-4 mr-1" />
            <span>Chart</span>
          </a>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="ml-2"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="border-t border-gray-100 space-y-6">
          <div className="w-full h-[400px] bg-white">
            <div id={`tradingview_${stock.id}`}></div>
          </div>
          <StockNotes stockId={stock.id} />
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Added on {new Date(stock.created_at).toLocaleDateString()}
        </p>
        
        <Button 
          variant="danger" 
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StockCard;