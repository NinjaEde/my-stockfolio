export interface Stock {
  id: string;
  ticker_symbol: string;
  display_name: string;
  chart_id: string;
  created_at: string;
  is_interesting?: boolean;
  bookmark_color?: string;
}

export interface Note {
  id: string;
  stock_id: string;
  content: string;
  created_at: string;
}

export interface User {
  username: string;
  password: string;
}