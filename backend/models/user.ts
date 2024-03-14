import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      level: { type: Number, default: 1 },
      experience: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
      createdAt: { type: Date, default: Date.now }
    },
    {
      collection: 'users'
    }
);

const User = mongoose.model('User', UserSchema)
export default User