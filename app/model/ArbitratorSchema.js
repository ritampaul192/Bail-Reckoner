// app/model/ArbitratorSchema.js

import mongoose from 'mongoose';

const ArbitratorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  experience: { type: Number, default: 0, min: 0 },
  avatar: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  languages: { type: [String], default: [] },
  casesResolved: { type: Number, default: 0 },
  title: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },

  // New field: wishlist - stores user IDs who wishlisted this arbitrator
  wishlist: { type: [String], default: [] }
});

export default mongoose.models.Arbitrator || mongoose.model('Arbitrator', ArbitratorSchema);
