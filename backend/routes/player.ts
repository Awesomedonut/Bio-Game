import express from 'express';
import { Request, Response } from 'express';
import Player from '../models/player';

const router = express.Router();

router.post('/player', async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const player = await Player.findOne({
      username: username
    })

    if (player) {
      return res.json({ player });
    } else {
      return res.json({ "message": `Player with username ${username} not found` });
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
  const { username, damage, hp, movementSpeed, projectiles, projectileSpeed } = req.body

  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { username: username },
      {
        $set: {
          damage: damage,
          hp: hp,
          movementSpeed: movementSpeed,
          projectiles: projectiles,
          projectileSpeed: projectileSpeed
        }
      },
      { new: true }
    );

    return res.json({ updatedPlayer });
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});

router.post('/player/create', async (req: Request, res: Response) => {
  const { username, damage, hp, movementSpeed } = req.body

  try {
    const player = new Player({ username, damage, hp, movementSpeed });
    const createdPlayer = await player.save();
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