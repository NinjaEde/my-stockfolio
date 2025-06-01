import type { Stock } from '../types';

export const getBookmarkedStocks = async (getStocks: () => Promise<Stock[]>): Promise<Stock[]> => {
  const stocks = await getStocks();
  return stocks.filter(stock => !!stock.bookmark_color);
};

export const getStocksByBookmarkColor = async (
  getStocks: () => Promise<Stock[]>,
  color: string
): Promise<Stock[]> => {
  const stocks = await getStocks();
  return stocks.filter(stock => stock.bookmark_color === color);
};

export const groupStocksByBookmarkColor = async (
  getStocks: () => Promise<Stock[]>
): Promise<Record<string, Stock[]>> => {
  const stocks = await getStocks();
  return stocks.reduce((groups: Record<string, Stock[]>, stock: Stock) => {
    const color = stock.bookmark_color || 'none';
    if (!groups[color]) groups[color] = [];
    groups[color].push(stock);
    return groups;
  }, {});
};