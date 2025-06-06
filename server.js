const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Vercel will handle port forwarding

// Replace this with your actual MongoDB URL
const MONGO_URL = 'mongodb://mongo:DPDJjeZDdLCNslCFufBPuVLaiJlVWuCE@mongodb.railway.internal:27017';

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use(cors());
app.use(bodyParser.json());

// User schema
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String // In real apps use bcrypt for hashing
}));

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).send('User already exists');
  const user = new User({ username, password });
  await user.save();
  res.send('Registered!');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(400).send('Invalid credentials');
  res.send('Login successful!');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
