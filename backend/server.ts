import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// import get_answer from './openai';
import enemyRoutes from './routes/enemy'
import playerRoutes from './routes/player'
import session from 'express-session';
import { gamemodel } from './models/gamedb';
import get_answer from './services/openai';
// setup local environment variables from .env file
dotenv.config();

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your_session_secret_key', // Change this to a secure random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60 // Session expires in 1 hour
  }
}));

// for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

// app.get('/', (req: Request, res: Response) => {
//   res.status(200).send('Hello World?');
// })

app.get('/enemy/init', async (req, res) => {
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
    (req.session as any).isLoggedIn = true;
    res.json({ message: 'User has added successfully' });
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});


app.get('/users', async (req, res) => {
  try {
    const allUsers = await gamemodel.getAllUsers();
    (req.session as any).isLoggedIn = true;
    res.json(allUsers);
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});

app.post('/login', async (req, res) => {
  try{
      const { username, password } = req.body;
      await gamemodel.getUser(username, password);
      (req.session as any).isLoggedIn = true;
      console.log("Logged In in /login post:" + (req.session as any).isLoggedIn)
      res.json({ message: 'User logged in successfully' }); 
    }catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    } 
});

function requireLogin(req: Request, res: Response, next: NextFunction) {
  //const sessionData: any = req.session;
  if ((req.session as any).isLoggedIn)  {
    console.log("session logged in info:", (req.session as any).isLoggedIn)
    next(); 
  } else {
    console.log("Unauthorized", (req.session as any).isLoggedIn);
    res.status(401).json({ error: 'Unauthorized' });
  }
}



app.use('/game', requireLogin, enemyRoutes);
app.use('/game', requireLogin, playerRoutes);

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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
