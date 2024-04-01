import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import enemyRoutes from './routes/enemy'
import playerRoutes from './routes/player'
import { gamemodel } from './models/gamedb';
import get_answer from './services/openai';
import session, { SessionOptions } from 'express-session';
import cookieParser from 'cookie-parser';
// setup local environment variables from .env file
dotenv.config();

const app = express()

app.use(express.json());
app.use(cors());

// app.use(cookieParser());
// app.use(express.urlencoded({extended: true}))

// app.use(session({
//   name: 'nsession',
//   secret: 'session_secret_key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000*60*60 // Session expires in 1 hour
//   }
// }))

// for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

// app.get('/', (req: Request, res: Response) => {
//   res.status(200).send('Hello World?');
// })

// app.get('/enemy/init', async (req, res) => {
//   try {
//     await gamemodel.init();
//     res.send('Database has been initialized');
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   } 
// });
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
    //(req.session as any).isLoggedIn = true;
    res.json({ message: 'User has added successfully' });
  }catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } 
});

app.get('/users', async (req, res) => {
  try {
    const allUsers = await gamemodel.getAllUsers();
    //(req.session as any).isLoggedIn = true;
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
      // (req.session as any).isLoggedIn = true;
      // console.log("Logged In in /login post:" + (req.session as any).isLoggedIn)
      res.json({ message: 'User logged in successfully' }); 
    }catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    } 
});

app.use('/game', enemyRoutes);
app.use('/game', playerRoutes);

// function requireLogin(req: Request, res: Response, next: NextFunction) {
//   if ((req.session as any).isLoggedIn)  {
//     console.log("session logged in info:", (req.session as any).isLoggedIn)
//     next(); 
//   } else {
//     console.log("Unauthorized", (req.session as any).isLoggedIn);
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// }

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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

