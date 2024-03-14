import mongoose from 'mongoose'

const PlayerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    damage: { type: Number, min: 1, default: 1 },
    hp: { type: Number, min: 1, default: 1 },
    movementSpeed: { type: Number, min: 1, default: 1 },
    projectiles: { type: Number, min: 1, default: 1 },
    projectileSpeed: { type: Number, min: 1, default: 1 },
  },
  {
    collection: 'player'
  }
);

const User = mongoose.model('Player', PlayerSchema)
export default User