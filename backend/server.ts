import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import enemyRoutes from './routes/enemy'
import playerRoutes from './routes/player'
import { gamemodel } from './models/gamedb';
import highScoreRoutes from './routes/highScore'
import get_answer from './services/openai';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { initializeSocketIO } from './socketLogic';

// setup local environment variables from .env file
const app = express()
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  // Access cookies from the request object
  console.log(req.cookies);
  res.send('Cookies: ' + JSON.stringify(req.cookies));
});

app.get('/set-cookie', (req, res) => {
  // Set a cookie named 'token' with a value 'your_jwt_token_here'
  res.cookie('token', 'your_jwt_token_here', { httpOnly: true, maxAge: 3600000 }); // HttpOnly for security, maxAge in milliseconds
  res.send('Cookie has been set');
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto', maxAge: 3600000 } // Use 'secure: true' for HTTPS. 'auto' will adapt based on the connection
}));

app.get('/session', (req, res) => {
  if ((req.session as any).views) {
    console.log('Session exists', (req.session as any).views);
    console.log('Session ID:', req.sessionID);
    (req.session as any).views++;
    res.write(`<p>Views: ${(req.session as any).views}</p>`);
    res.end();
  } else {
    (req.session as any).views = 1;
    res.end('Welcome to the session demo. Refresh!');
  }
});


// Setup Socket.io
const server = createServer(app);
initializeSocketIO(server);

// for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

app.get('/init/game', async (req, res) => {
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
      console.log('token:', token);
      req.session.cookie
      console.log(req.cookies.token);
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
app.use('/score', highScoreRoutes);


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


// Start the server
const port = process.env.PORT || 3000;
//Existing routes defined by app.get(), app.post(), etc should still work as expected
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

