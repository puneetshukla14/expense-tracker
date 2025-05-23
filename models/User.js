// /models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  salary: Number,
  emi: Number,
});

export default mongoose.models.User || mongoose.model('User', userSchema);
