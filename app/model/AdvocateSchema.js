import mongoose from 'mongoose';

const AdvocateSchema = new mongoose.Schema({
  id: Number,
  name: String,
  city: String,
  court: String,
  rating: Number,
  experience: Number,
  specialization: String,
  photo: String,
  languages: [String],
  barId: String,
  email: String,
  whatsapp: String,
  verified: Boolean,
  practiceAreas: [String],
  bio: String,
});

export default mongoose.models.Advocate || mongoose.model('Advocate', AdvocateSchema);
