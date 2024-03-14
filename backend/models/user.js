"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    achievements: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Achievement' }],
    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'users'
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
