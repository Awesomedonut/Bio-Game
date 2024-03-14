import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usersRouter from './routes/user'
import get_answer from './openai';

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
  res.status(200).send('Hello World?');
})



app.post('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World?');
})

app.post('/dialogue', async (req: Request, res: Response) => {
console.log(req.body);

const output = await get_answer(req.body.message);
res.status(200).send(output);
})

// Start the server
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
          console.log('Connected to MongoDB Atlas');   
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB Atlas:', error);
    })

//app.use('/routes/users', usersRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
