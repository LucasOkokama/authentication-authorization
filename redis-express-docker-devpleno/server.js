const express = require('express');
const app = express();

const { createClient } = require('redis');
const client = createClient({
  url: 'redis://redis:6379',
});

const getAllProducts = async () => {
  const responseTimeMS = Math.random() * 5000;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(['Prod 1', 'Prod 2']);
    }, responseTimeMS);
  });
};

app.get('/', async (req, res) => {
  const productsFromCache = await client.get('getAllProducts');

  if (!productsFromCache) {
    const products = await getAllProducts();
    await client.set('getAllProducts', JSON.stringify(products));

    return res.json({
      products,
    });
  }

  return res.json({
    products: JSON.parse(productsFromCache),
  });
});

const startup = async () => {
  await client.connect();

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
};

startup();
