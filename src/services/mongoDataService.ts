import { MongoClient } from 'mongodb';
import { Stock, Note } from '../types';

const uri = process.env.MONGO_URI || 'your-mongodb-uri';
const client = new MongoClient(uri);
const dbName = 'stockfolio';
const stocksCollection = 'stocks';
const notesCollection = 'notes';

const getCollection = async (collectionName: string) => {
  await client.connect();
  return client.db(dbName).collection(collectionName);
};

// MongoDB service functions
export const addStockToMongo = async (stock: Stock): Promise<Stock | null> => {
  try {
    const collection = await getCollection(stocksCollection);
    await collection.insertOne(stock);
    return stock;
  } catch (error) {
    console.error('Error adding stock to MongoDB:', error);
    return null;
  }
};

export const getStocksFromMongo = async (): Promise<Stock[]> => {
  try {
    const collection = await getCollection(stocksCollection);
    const docs = await collection.find().toArray();
    return docs.map(doc => ({
      id: doc.id,
      ticker_symbol: doc.ticker_symbol,
      display_name: doc.display_name,
      chart_id: doc.chart_id,
      created_at: doc.created_at
    })) as Stock[];
  } catch (error) {
    console.error('Error fetching stocks from MongoDB:', error);
    return [];
  }
};

export const deleteStockFromMongo = async (id: string): Promise<boolean> => {
  try {
    const collection = await getCollection(stocksCollection);
    await collection.deleteOne({ id });

    const notesCollectionRef = await getCollection(notesCollection);
    await notesCollectionRef.deleteMany({ stock_id: id });

    return true;
  } catch (error) {
    console.error('Error deleting stock from MongoDB:', error);
    return false;
  }
};

export const addNoteToMongo = async (note: Note): Promise<Note | null> => {
  try {
    const collection = await getCollection(notesCollection);
    await collection.insertOne(note);
    return note;
  } catch (error) {
    console.error('Error adding note to MongoDB:', error);
    return null;
  }
};

export const getNotesFromMongo = async (stock_id: string): Promise<Note[]> => {
  try {
    const collection = await getCollection(notesCollection);
    const docs = await collection.find({ stock_id }).sort({ created_at: -1 }).toArray();
    return docs.map(doc => ({
      id: doc.id,
      stock_id: doc.stock_id,
      content: doc.content,
      created_at: doc.created_at
    })) as Note[];
  } catch (error) {
    console.error('Error fetching notes from MongoDB:', error);
    return [];
  }
};

export const deleteNoteFromMongo = async (id: string): Promise<boolean> => {
  try {
    const collection = await getCollection(notesCollection);
    await collection.deleteOne({ id });
    return true;
  } catch (error) {
    console.error('Error deleting note from MongoDB:', error);
    return false;
  }
};

export const updateStockInMongo = async (id: string, updates: Partial<Stock>): Promise<boolean> => {
  try {
    const collection = await getCollection(stocksCollection);
    await collection.updateOne({ id }, { $set: updates });
    return true;
  } catch (error) {
    console.error('Error updating stock in MongoDB:', error);
    return false;
  }
};

export const updateNoteInMongo = async (id: string, content: string): Promise<boolean> => {
  try {
    const collection = await getCollection(notesCollection);
    await collection.updateOne({ id }, { $set: { content, created_at: new Date().toISOString() } });
    return true;
  } catch (error) {
    console.error('Error updating note in MongoDB:', error);
    return false;
  }
};
