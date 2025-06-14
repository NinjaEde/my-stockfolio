import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.SERVER_PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/stockfolio';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

const client = new MongoClient(MONGO_URI);
const dbName = 'stockfolio';

async function getCollection(name) {
    if (!client.topology?.isConnected()) await client.connect();
    return client.db(dbName).collection(name);
}

// --- AUTH MIDDLEWARE ---
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// --- STOCK ROUTES ---

app.get('/api/stocks', authMiddleware, async (req, res) => {
    try {
        const collection = await getCollection('stocks');
        const stocks = await collection.find({ username: req.user.username }).toArray();
        res.json(stocks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stocks' });
    }
});

app.post('/api/stocks', authMiddleware, async (req, res) => {
    try {
        let stock = { ...req.body, username: req.user.username };
        // Ensure created_at is always a valid ISO string
        if (!stock.created_at || isNaN(Date.parse(stock.created_at))) {
            stock.created_at = new Date().toISOString();
        }
        const collection = await getCollection('stocks');
        await collection.insertOne(stock);
        res.status(201).json(stock);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add stock' });
    }
});

app.delete('/api/stocks/:id', authMiddleware, async (req, res) => {
    try {
        const collection = await getCollection('stocks');
        await collection.deleteOne({ ticker_symbol: req.params.id, username: req.user.username });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete stock' });
    }
});

app.put('/api/stocks/:id', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;
        const collection = await getCollection('stocks');
        await collection.updateOne({ ticker_symbol: req.params.id, username: req.user.username }, { $set: updates });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update stock' });
    }
});



// --- NOTE ROUTES ---

app.get('/api/notes/:stock_id', authMiddleware, async (req, res) => {
    try {
        const collection = await getCollection('notes');
        const notes = await collection.find({ stock_id: req.params.stock_id, username: req.user.username }).toArray();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post('/api/notes', authMiddleware, async (req, res) => {
    try {
        const note = { ...req.body, username: req.user.username };
        if (!note.id) {
            note.id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        }
        note.created_at = note.created_at || new Date().toISOString();
        const collection = await getCollection('notes');
        await collection.insertOne(note);
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add note' });
    }
});

app.delete('/api/notes/:id', authMiddleware, async (req, res) => {
    try {
        const collection = await getCollection('notes');
        await collection.deleteOne({ id: req.params.id, username: req.user.username });
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.put('/api/notes/:id', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;
        const collection = await getCollection('notes');
        await collection.updateOne({ id: req.params.id, username: req.user.username }, { $set: updates });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});


// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const collection = await getCollection('users');
        const existing = await collection.findOne({ username });
        if (existing) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = { username, password: hashed };
        await collection.insertOne(user);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const collection = await getCollection('users');
        const user = await collection.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, username });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
