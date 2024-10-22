const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');
const mongoose = require('mongoose');



router.get('/:id', async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  res.send(cart);
});

router.post('/', async (req, res) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (user) {
    const cart = new Cart({
      user: user._id,
      date: new Date(),
      products: []
    });

    await cart.save().catch((err) => {
      console.log(err);
    });
    res.send(cart);
  } else {
    res.json({ status: 'error', message: 'Usuario no encontrado, no se puede crear el carrito' })
  }
});

router.put('/:id', async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, {
    user: req.body.user,
    date: new Date(),
    products: []

  }, { new: true });
  res.send(cart);
});
router.put('/add-product/:id', async (req, res) => {

  let product = await Product.findOne({ id: req.body.id });
  if (!product) {
    product = new Product({
      id: req.body.id,
      name: req.body.name,
      quantity: req.body.quantity,
    });

    await product.save().catch((err) => {
      console.log(err);
    });
  }

  console.log(req.params);


  Cart.updateOne({ _id: req.params.id }, {
    $push: { products: product._id }
  }, {
    multi: true
  }).exec();

  let cart = Cart
    .findById(req.params.id)
    .populate('products')


  res.json({ status: 'success' });
});
router.put('/remove-product/:id', async (req, res) => {

  console.log(req.body);


  Cart.updateOne({ _id: req.params.id }, {
    $pull: { products: req.body.product }
  }, {
    multi: true
  }).exec();


  let cart = Cart
    .findById(req.params.id)
    .populate('products')


  res.json({ status: 'success' });
});

router.delete('/:id', async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.send('Carrito eliminado');
});

module.exports = router;