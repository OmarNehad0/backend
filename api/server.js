// File: api/server.js

import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(
      'mongodb://mongo:DPDJjeZDdLCNslCFufBPuVLaiJlVWuCE@mongodb.railway.internal:27017',
      { useNewUrlParser: true, useUnifiedTopology: true }
    ).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { username, password, type } = req.body;

    if (type === 'register') {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: 'User already exists' });

      const user = new User({ username, password });
      await user.save();
      return res.status(200).json({ message: 'Registered!' });
    }

    if (type === 'login') {
      const user = await User.findOne({ username, password });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      return res.status(200).json({ message: 'Login successful!' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
