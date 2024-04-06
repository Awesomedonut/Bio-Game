import express from 'express';
import { Request, Response } from 'express';
import highScoreModel from '../models/highScore';

const router = express.Router();

router.get("/highscore/init", async (req, res) => {
    try {
      const initRes = await highScoreModel.init();
      if (initRes) {
        return res.json({
          "message": "highScore table initialized in db"
        })
      } else {
        return res.json({
          "message": "Error occurred",
          "error": "highScore table not created"
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

router.get('/highScore/:playerId', async (req: Request, res: Response) => {

    try {
      const userId = parseInt(req.params.playerId);
      if (!userId) {
        return res.json({
          "message": "Error occured",
          "error": "Error updating the player"
        })
      }
      let scoreData = await highScoreModel.getHighscoreById(userId);
      return res.json(scoreData);
  
    } catch (e) {
      console.error(e);
      return res.json({
        "message": "Error Occured",
        "error": e
      });
    }
});

router.put('/highscores/:playerId/:level', async (req: Request, res: Response) => {
    const { playerId, level } = req.params;
    const newScore = req.body.score;
    try {
        await highScoreModel.updateHighscore(parseInt(playerId), parseInt(level), newScore);
        res.json({ message: 'Highscore updated successfully' });
    } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});

router.post('/highscores', async (req: Request, res: Response) => {
    const { playerId, level, score } = req.body;
    try {
        await highScoreModel.addHighscore(parseInt(playerId), parseInt(level), score);
        res.status(201).json({ message: 'Highscore added successfully' });
    } catch (e) {
        console.error(e);
        return res.json({
        "message": "Error adding highscore:",
        "error": e
        })
    }
});

export default router;