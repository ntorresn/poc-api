const express = require('express');
const router = express.Router();
const Product = require('../models/cart');

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.send(product);
});

router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    quantiy: req.body.quantiy,
  });

  await product.save().catch((err) => {
    console.log(err);
  });
  res.send(product);
});

router.put('/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    quantity: req.body.quantity,
  }, { new: true });
  res.send(product);
});

router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send('Producto eliminado');
});

module.exports = router;