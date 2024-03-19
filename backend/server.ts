import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import get_answer from './openai';

// setup local environment variables from .env file
dotenv.config();
import { gamemodel } from './models/gamedb';

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

// app.get('/', (req: Request, res: Response) => {
//   res.status(200).send('Hello World?');
// })
app.get('/', async (req, res) => {
  try {
    await gamemodel.init();
    res.send('Database has been initialized');
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});

app.get('/test', async (req, res) => {
  try {
    res.send("test success");
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});

app.post('/register', async (req, res) => {
  try {
    await gamemodel.addUser(req.body.username, req.body.email, req.body.password);
    res.json({ message: 'User has added successfully' });
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});
app.get('/users', async (req, res) => {
  try {
    const allUsers = await gamemodel.getAllUsers();
    res.json(allUsers);
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});

app.post('/login', async (req, res) => {
  try{
    const status = await gamemodel.getUser(req.body.email, req.body.password);
    if(status){
      res.json("Success");
    }
    else{
      res.status(500).json({ error: 'Incorrect user Password for login' });
    }  
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});



// app.post('/', (req: Request, res: Response) => {
//   res.status(200).send('Hello World?');
// })

app.post('/dialogue', async (req: Request, res: Response) => {
console.log(req.body);

const output = await get_answer(req.body.message);
res.status(200).send(output);
})

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
