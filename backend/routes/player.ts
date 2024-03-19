import express from 'express';
import { Request, Response } from 'express';
import playerModel from '../models/player';

const router = express.Router();

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
})

router.get('/player/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const player = await playerModel.getPlayerByUserId(userId);
    if (player) {
      return res.json({ player });
    } else {
      return res.json({ "message": `Player linked with user with id ${userId} not found` });
    }
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error Occured",
      "error": e
    });
  }
});

router.put('/player/update', async (req: Request, res: Response) => {
  const { id, damage, hp, movement_speed, projectile_number, projectile_speed, currency} = req.body

  try {
    const updateRes = await playerModel.updatePlayer(id, damage, hp, movement_speed, projectile_number, projectile_speed, currency);
    if (updateRes) {
      const updatedPlayer = await playerModel.getPlayerByUserId(id);
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