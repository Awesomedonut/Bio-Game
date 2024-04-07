import express from 'express';
import { Request, Response } from 'express';
import HighScoreModel from '../models/highScore';

const router = express.Router();

router.get("/highscores/init", async (req, res) => {
    try {
      const initRes = await HighScoreModel.init();
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

router.get('/highscores/:playerId', async (req: Request, res: Response) => {

    try {
      const userId = parseInt(req.params.playerId);
      if (!userId) {
        return res.json({
          "message": "Error occured",
          "error": "Error updating the player"
        })
      }
      let scoreData = await HighScoreModel.getHighscoreById(userId);
      return res.json(scoreData);
  
    } catch (e) {
      console.error(e);
      return res.json({
        "message": "Error Occured",
        "error": e
      });
    }
});

router.get('/highscores/level/:levelNumber', async (req: Request, res: Response) => {

  try {
    const levelNumber = parseInt(req.params.levelNumber);
    if (!levelNumber) {
      return res.json({
        "message": "Error occured",
        "error": "Error fetching level highscores"
      })
    }
    let scoreData = await HighScoreModel.getHighscoresByLevel(levelNumber);
    return res.json(scoreData);

  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error Occured",
      "error": e
    });
  }
});

router.put('/highscores', async (req: Request, res: Response) => {

    const { playerId, level, score } = req.body;

      try {
          const highscore = await HighScoreModel.getHighscoreById(playerId);
          console.log(highscore);
          if (highscore.length == 0) {
            await HighScoreModel.addHighscore(parseInt(playerId), parseInt(level), score);
          } else {
            await HighScoreModel.updateHighscore(parseInt(playerId), parseInt(level), score);
          }
          res.status(201).json({ message: 'Highscore updated successfully' });
      } catch (e) {
          console.error(e);
          return res.json({
          "message": "Error adding highscore:",
          "error": e
          })
      }
});

// router.put('/highscores/:playerId/:level', async (req: Request, res: Response) => {
//     const { playerId, level } = req.params;
//     const newScore = req.body.score;
//     try {
//         await HighScoreModel.updateHighscore(parseInt(playerId), parseInt(level), newScore);
//         res.json({ message: 'Highscore updated successfully' });
//     } catch (e) {
//     console.error(e);
//     return res.json({
//       "message": "Error occured",
//       "error": e
//     })
//   }
// });

// router.post('/highscores', async (req: Request, res: Response) => {
//     const { playerId, level, score } = req.body;
//     try {
//         await HighScoreModel.addHighscore(parseInt(playerId), parseInt(level), score);
//         res.status(201).json({ message: 'Highscore added successfully' });
//     } catch (e) {
//         console.error(e);
//         return res.json({
//         "message": "Error adding highscore:",
//         "error": e
//         })
//     }
// });

router.delete('/highscores/:playerId/:level', async (req: Request, res: Response) => {
    try {
      await HighScoreModel.deleteHighscore(parseInt(req.params.playerId), parseInt(req.params.level));
      res.json({ message: 'Highscore deleted successfully' });
    } catch (error) {
      console.error('Error deleting highscore:', error);
      res.status(500).json({ message: 'Failed to delete highscore' });
    }
});

export default router;