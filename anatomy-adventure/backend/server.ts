import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';


// setup local environment variables from .env file
dotenv.config();

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})

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
