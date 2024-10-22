const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get('/:phone', async (req, res) => {
  const user = await User.findOne({ phone: req.params.phone.trim() });

  res.json(user);
});

router.post('/', async (req, res) => {
  const foundUser = await User.findOne({ phone: req.body.phone.trim() })
  if (!foundUser) {
    const user = new User({
      phone: req.body.phone,
      welcome: false,
    });
    await user.save().catch((err) => {
      console.log(err);
    });
    res.send(user);
  } else {
    res.json({ message: 'El usuario ya existe' })
  }
});

router.put('/:phone', async (req, res) => {

  const foundUser = await User.findOne({ phone: req.params.phone })

  const user = await User.findByIdAndUpdate(foundUser._id, {
    welcome: req.body.welcome,
  }, { new: true });
  res.send(user);
});

router.delete('/:phone', async (req, res) => {
  const foundUser = await User.findOne({ phone: req.params.phone })

  await User.findByIdAndDelete(foundUser._id);
  res.send('Usuario eliminado');
});

module.exports = router;