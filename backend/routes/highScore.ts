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

export default router;