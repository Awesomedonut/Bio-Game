"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt = require('bcryptjs');
const router = express_1.default.Router();
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.json({ msg: 'Success', users: users }).status(200);
    }
    catch (e) {
        res.json(e).status(500);
    }
}));
router.post('/user/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { username, email, password } = req.body;
        const existingUser = yield user_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        password = yield bcrypt.hash(password, 10);
        const newUser = new user_1.default({
            username,
            email,
            password
        });
        const savedUser = yield newUser.save();
        res.json({ msg: 'Success', user: savedUser }).status(200);
    }
    catch (e) {
        res.json(e).status(500);
    }
}));
exports.default = router;
