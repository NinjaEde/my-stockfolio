import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stockfolio';

app.use(cors());
app.use(express.json());

const client = new MongoClient(MONGO_URI);
const dbName = 'stockfolio';

async function getCollection(name) {
    if (!client.topology?.isConnected()) await client.connect();
    return client.db(dbName).collection(name);
}

// --- STOCK ROUTES ---

app.get('/api/stocks', async (_req, res) => {
    try {
        const collection = await getCollection('stocks');
        const stocks = await collection.find().toArray();
        res.json(stocks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stocks' });
    }
});

app.post('/api/stocks', async (req, res) => {
    try {
        const stock = req.body;
        const collection = await getCollection('stocks');
        await collection.insertOne(stock);
        res.status(201).json(stock);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add stock' });
    }
});

app.delete('/api/stocks/:id', async (req, res) => {
    try {
        const collection = await getCollection('stocks');
        await collection.deleteOne({ id: req.params.id });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete stock' });
    }
});

app.put('/api/stocks/:id', async (req, res) => {
    try {
        const updates = req.body;
        const collection = await getCollection('stocks');
        await collection.updateOne({ id: req.params.id }, { $set: updates });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update stock' });
    }
});



// --- NOTE ROUTES ---

app.get('/api/notes/:stock_id', async (req, res) => {
    try {
        const collection = await getCollection('notes');
        const notes = await collection.find({ stock_id: req.params.stock_id }).toArray();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const note = req.body;
        const collection = await getCollection('notes');
        await collection.insertOne(note);
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add note' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const collection = await getCollection('notes');
        await collection.deleteOne({ id: req.params.id });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.put('/api/notes/:id', async (req, res) => {
    try {
        const updates = req.body;
        const collection = await getCollection('notes');
        await collection.updateOne({ id: req.params.id }, { $set: updates });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
