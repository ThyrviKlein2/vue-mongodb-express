import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '../.env' });

const app = express();
const port = 3000;
const uri = process.env.MONGODB_URI; // Ensure this is set in your .env file
console.log('MongoDB URI:', process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Use environment variable or specify directly, e.g., 'http://localhost:5173'
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

let db;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect()
  .then(client => {
    db = client.db('vue-mongodb');
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error('Failed to connect to MongoDB', error));

app.get('/data', async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: 'Database connection not established' });
  }
  try {
    const collection = db.collection('vue-mongodb');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (e) {
    console.error('Failed to fetch data:', e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/data', async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: 'Database connection not established' });
  }
  try {
    const collection = db.collection('vue-mongodb');
    const result = await collection.insertOne(req.body);
    
    if (result.acknowledged) {
      const insertedDocument = await collection.findOne({ _id: result.insertedId });
      
      res.status(201).json(insertedDocument);
    } else {
      console.error('Insert operation not acknowledged:', result);
      res.status(500).json({ message: 'Failed to add item, operation not acknowledged' });
    }
  } catch (error) {
    console.error('Failed to add item:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
