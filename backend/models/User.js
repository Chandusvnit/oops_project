import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roomNumber: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'worker'], default: 'student', index: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;