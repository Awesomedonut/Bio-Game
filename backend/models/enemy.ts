import mongoose from 'mongoose'

const EnemySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    damage: { type: Number, min: 1, default: 1 },
    hp: { type: Number, min: 1, default: 1 },
    movementSpeed: { type: Number, min: 1, default: 1 },
  },
  {
    collection: 'enemy'
  }
);

const User = mongoose.model('Enemy', EnemySchema)
export default User