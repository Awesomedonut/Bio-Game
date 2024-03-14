import express from 'express'
import User from '../models/user'

const router = express.Router()

router.get('/all', async (req, res) => {
  try {
    const users = await User.find()
    res.json({ msg: 'Success', users: users }).status(200)
  } catch (e) {
    res.json(e).status(500)
  }
})

router.post('/user/new', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const newUser = new User({
      username,
      email,
      password
    });
    const savedUser = await newUser.save()
    res.json({ msg: 'Success', user: savedUser }).status(200)
  } catch (e) {
    res.json(e).status(500)
  }
})

export default router