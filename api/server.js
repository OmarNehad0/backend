const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

const MONGO_URL = 'mongodb://mongo:DPDJjeZDdLCNslCFufBPuVLaiJlVWuCE@mongodb.railway.internal:27017';

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use(cors());
app.use(bodyParser.json());

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).send('User already exists');
  await new User({ username, password }).save();
  res.send('Registered!');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(400).send('Invalid credentials');
  res.send('Login successful!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
