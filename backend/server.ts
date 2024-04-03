import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import enemyRoutes from './routes/enemy'
import playerRoutes from './routes/player'
import { gamemodel } from './models/gamedb';
import get_answer from './services/openai';
import jwt from 'jsonwebtoken';

// setup local environment variables from .env file
const app = express()

app.use(express.json());
app.use(cors());


// for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

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
  try {
    const { username, password } = req.body;
    const user = await gamemodel.getUser(username, password);
    if (user) {
      const token = jwt.sign(user, 'secret_key', { expiresIn: '1h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Incorrect username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.use('/game', enemyRoutes);
app.use('/game', playerRoutes);


app.post('/dialogue', async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const output = await get_answer(req.body.prompt);
    console.log(output);
    // Ensure the response is in JSON format
    res.status(200).json({ message: output });
  } catch (error) {
    console.error(error);
    // Send a JSON error message if something goes wrong
    res.status(500).json({ error: 'Failed to fetch the response' });
  }

})

// app.get('/logout', (req: Request, res: Response) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Error logging out:', err);
//       res.status(500).json({ error: 'Failed to log out' });
//       return;
//     }
//     res.json({ message: 'User logged out successfully' });
//   });
// });

// Start the server
const port = process.env.PORT || 3000;
//Existing routes defined by app.get(), app.post(), etc should still work as expected
// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

