import express from 'express';
import { Request, Response } from 'express';
import Enemy from '../models/enemy';
import mongoose, { Error, Error as MongooseError } from 'mongoose';

const router = express.Router()

router.get('/enemy', async (req: Request, res: Response) => {
  try {
    const enemies = await Enemy.find();
    return res.json({ enemies });
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});

router.post('/enemy', async (req: Request, res: Response) => {
  const { name, damage, hp, movementSpeed } = req.body

  try {
    const enemy = new Enemy({ name, damage, hp, movementSpeed });
    const createdEnemy = await enemy.save();
    return res.json({ createdEnemy });
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});


router.get('/enemy/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const enemy = await Enemy.findById(id);

    if (enemy) {
      return res.json({ enemy });
    } else {
      return res.json({ "message": `Enemy with ID ${id} not found` });
    }
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error Occured",
      "error": e
    });
  }
});

export default router;