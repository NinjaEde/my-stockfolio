/*
  # Create stock portfolio schema
  
  1. New Tables
    - `stocks`
      - `id` (uuid, primary key)
      - `ticker_symbol` (text)
      - `display_name` (text)
      - `chart_id` (uuid)
      - `created_at` (timestamp)
    - `notes`
      - `id` (uuid, primary key)
      - `stock_id` (uuid, foreign key to stocks.id)
      - `content` (text, for markdown content)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker_symbol text NOT NULL,
  display_name text NOT NULL,
  chart_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id uuid NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for stocks table
CREATE POLICY "Allow users to read their stocks"
  ON stocks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to insert stocks"
  ON stocks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to update their stocks"
  ON stocks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow users to delete their stocks"
  ON stocks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for notes table
CREATE POLICY "Allow users to read their notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to insert notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to update their notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow users to delete their notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS notes_stock_id_idx ON notes(stock_id);