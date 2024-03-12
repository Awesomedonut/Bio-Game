"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
    res.send('Hello World!');
});
// Start the server
const port = process.env.PORT || 3000;
// TODO: Setup group mongodb atlas account then uncomment this code 
// mongoose.connect(process.env.MONGO_URI as string)
//     .then(() => {
//         app.listen(port, () => {
//             console.log(`Server is runing on http://localhost:${port}`);
//         }); 
//     })
//     .catch((error) => {
//         console.log(error);
//     })
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
