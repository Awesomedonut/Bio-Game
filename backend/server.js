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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// setup local environment variables from .env file
dotenv_1.default.config();
const gamedb_1 = require("./models/gamedb");
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
// app.get('/', (req: Request, res: Response) => {
//   res.status(200).send('Hello World?');
// })
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield gamedb_1.gamemodel.init();
        res.send('Database has been initialized');
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}));
app.post('/user/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield gamedb_1.gamemodel.addUser(req.body.username, req.body.email, req.body.password);
        res.json({ message: 'User has added successfully' });
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield gamedb_1.gamemodel.getAllUsers();
        res.json(recipes);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}));
// app.post('/', (req: Request, res: Response) => {
//   res.status(200).send('Hello World?');
// })
// app.post('/dialogue', async (req: Request, res: Response) => {
// console.log(req.body);
// const output = await get_answer(req.body.message);
// res.status(200).send(output);
// })
// Start the server
const port = process.env.PORT || 3000;
// mongoose.connect(process.env.MONGO_URI as string)
//     .then(() => {
//           console.log('Connected to MongoDB Atlas');   
//     })
//     .catch((error) => {
//       console.error('Error connecting to MongoDB Atlas:', error);
//     })
// app.use('/routes/users', usersRouter)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
