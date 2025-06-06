import { connect } from 'mongoose';

const MONGO_URL = 'mongodb://mongo:DPDJjeZDdLCNslCFufBPuVLaiJlVWuCE@mongodb.railway.internal:27017';

let connection = null;

async function connectToDB() {
  if (!connection) {
    connection = await connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// Define schema and model
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Main handler
export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (req.url.includes('/register')) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).send('User already exists');

      const user = new User({ username, password });
      await user.save();
      return res.status(200).send('Registered!');
    }

    if (req.url.includes('/login')) {
      const user = await User.findOne({ username, password });
      if (!user) return res.status(400).send('Invalid credentials');
      return res.status(200).send('Login successful!');
    }

    return res.status(404).send('Invalid endpoint');
  }

  return res.status(405).send('Method Not Allowed');
}

