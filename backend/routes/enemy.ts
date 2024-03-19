import express from 'express';
import { Request, Response } from 'express';
import enemyModel from '../models/enemy';

const router = express.Router()

router.get('/enemy/init', async (req: Request, res: Response) => {
  try {
    const initRes = await enemyModel.init();
    if (initRes) {
      return res.json({
        "message": "Enemy table initialized in db"
      }) 
    } else {
      return res.json({
        "message": "Error occurred",
        "error": "Enemy table not created"
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

router.get('/enemy', async (req: Request, res: Response) => {
  try {
    const enemies = await enemyModel.getAllEnemies();
    return res.json({ enemies });
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error occured",
      "error": e
    })
  }
});

router.post('/enemy/create', async (req: Request, res: Response) => {
  const { name, damage, hp, movementSpeed } = req.body

  try {
    const createdEnemy = await enemyModel.createEnemy(name, damage, hp, movementSpeed);
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
  const id = parseInt(req.params.id);

  try {
    const enemy = await enemyModel.getEnemyById(id);

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

router.post('/enemy/get', async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const enemy = await enemyModel.getEnemyByName(name);

    if (enemy) {
      return res.json({ enemy });
    } else {
      return res.json({ "message": `Enemy with name ${name} not found` });
    }
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error Occured",
      "error": e
    });
  }
});

router.delete('/enemy/:id', async (req, res) => {
  let id: number = parseInt(req.params.id);

  try {
    const deleteRes = await enemyModel.deleteEnemy(id);
    if (deleteRes) {
      return res.json({
        "message": `Enemy with id ${id} deleted`
      })
    } else {
      return res.json({
        "message": "ERROR: Something went wrong"
      })
    }
    
  } catch (e) {
    console.error(e);
    return res.json({
      "message": "Error Occurred",
      "error": e
    });
  }
})

export default router;