"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
// setup local environment variables from .env file
dotenv_1.default.config();
// express app
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// for debugging
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.get('/', (req, res) => {
    res.status(200).send('Hello World?');
});
// Start the server
const port = process.env.PORT || 3000;
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB Atlas');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});
app.use('/routes/users', user_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
