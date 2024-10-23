const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');
const mongoose = require('mongoose');



router.get('/:phone', async (req, res) => {
  let user = await User.findOne({ phone: req.params.phone })
  let cart = await Cart.findOne({ user: user._id }).populate('products')

  res.json(cart);
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

  console.log("**************************");
  console.log(req.body);
  console.log("**************************");

  var messageResponse = 'Producto agragado exitosamente'
  var statusResponse = 'success'

  let product = await Product.findOne({ id: req.body.id });
  let user = await User.findOne({ phone: req.body.phone })
  let cart = await Cart.findOne({ user: user._id })

  if (!product) {
    product = new Product({
      id: req.body.id,
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
    });

    await product.save().catch((err) => {
      console.log(err);
    });
    if (cart) {
      Cart.updateOne({ _id: cart._id }, {
        $push: { products: product._id }
      }, {
        multi: true
      }).exec();
    } else {
      statusResponse = 'error'
      messageResponse = 'No se encontro carrito de compras para el usuario actual'
    }
  } else {
    await Product.findByIdAndUpdate(
      product._id,
      { $inc: { quantity: req.body.quantity } },
      { new: true }
    )
  }

  res.json({ "status": statusResponse, "message": messageResponse });

});
router.put('/remove-product/:idproduct', async (req, res) => {

  console.log(req.body);

  let product = await Product.findOne({ id: req.params.idproduct })
  let user = await User.findOne({ phone: req.body.phone })
  let cart = await Cart.findOne({ user: user._id })

  if (cart) {
    Cart.updateOne({ _id: cart._id }, {
      $pull: { products: product._id }
    }, {
      multi: true
    }).exec();
    res.json({ status: 'success' });
  } else {
    res.json({ status: 'error' });
  }
});

router.delete('/:phone', async (req, res) => {
  let user = await User.findOne({ phone: req.params.phone })
  let cart = await Cart.findOne({ user: user._id })

  if (cart) {
    await Cart.findByIdAndDelete(cart._id);
    res.json({ 'status': 'success', 'message': 'Carrito eliminado' });
  } else {
    res.json({ 'status': 'error', 'message': 'Carrito no encontrado' });
  }
});

module.exports = router;