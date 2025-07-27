import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  username: String,
  anonymousUser: String,
  password: String,
  address: String,
  pinNumber: Number,
  phoneNumber: Number,
  emailAddress: String,
  // New fields
  resetToken: String,
  resetTokenExpiry: Date,
}, { collection: 'login' });

LoginSchema.pre('save', function (next) {
  if (!this.userId) {
    this.userId = this._id.toString();
  }
  next();
});

export default mongoose.models.Login || mongoose.model('Login', LoginSchema);
