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

export default router;