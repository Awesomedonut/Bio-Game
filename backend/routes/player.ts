import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import playerModel from '../models/player';
import jwt from 'jsonwebtoken';

const router = express.Router();

interface UserRequest extends Request {
  userId?: number;
  supporter?: boolean;
}

interface JWTUserId {
  id: number;
  supporter: boolean;
}

const verifyToken = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({error: 'Unauthorized: Token is not valid'});
  }

  try {
    const decodedToken = jwt.verify(token, 'secret_key') as JWTUserId;
    req.userId = decodedToken.id;
    req.supporter = decodedToken.supporter;
    next()
  } catch (e) {
    return res.status(400).json({error: 'Error verifying token'});
  }
}

router.get("/player/init", async (req, res) => {
  try {
    const initRes = await playerModel.init();
    if (initRes) {
      return res.json({
        "message": "Player table initialized in db"
      })
    } else {
      return res.json({
        "message": "Error occurred",
        "error": "Player table not created"
      })
    }
   
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occurred",
      "error": e
    })
  }
});

router.post('/player/get', verifyToken, async (req: UserRequest, res: Response) => {

  try {
    const userId = req.userId;
    const isSupporter = req.supporter;

    if (!userId) {
      return res.json({
        "message": "Error occured",
        "error": "Error updating the player"
      })
    }
    
    let player = await playerModel.getPlayerByUserId(userId);

    if (!player) {
      if (isSupporter) {
        await playerModel.createSupporterPlayer(userId);
        player = await playerModel.getPlayerByUserId(userId);
      } else {
        await playerModel.createPlayer(userId);
        player = await playerModel.getPlayerByUserId(userId);
      }
    } 

    return res.json({ player });

  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error Occured",
      "error": e
    });
  }
});

router.put('/player/update', verifyToken, async (req: UserRequest, res: Response) => {

  const { damage, movement_speed, projectile_number, projectile_speed, currency } = req.body;
  
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
        "message": "Error occured",
        "error": "Error updating the player"
      })
    }

    const playerRes = await playerModel.getPlayerByUserId(userId);
    const playerId = playerRes.id

    const updateRes = await playerModel.updatePlayer(playerId, damage, movement_speed, projectile_number, projectile_speed, currency);

    if (updateRes) {
      const updatedPlayer = await playerModel.getPlayerById(playerId);
      return res.json({ updatedPlayer });
    } else {
      return res.json({
        "message": "Error occured",
        "error": "Error updating the player"
      })
    }
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});

router.post('/player/create', async (req: Request, res: Response) => {
  const { user_id } = req.body

  try {
    const createdPlayer = await playerModel.createPlayer(user_id);
    return res.json({ createdPlayer });
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});

export default router;