const express = require('express');

const app = express();

const getAllProducts = async () => {
  const responseTimeMS = Math.random() * 5000;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(['Prod 1', 'Prod 2']);
    }, responseTimeMS);
  });
};

app.get('/', async (req, res) => {
  const products = await getAllProducts();
  res.send({
    products,
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
