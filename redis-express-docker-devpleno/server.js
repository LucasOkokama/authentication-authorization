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
  const products = await getAllProducts();
  res.send({
    products,
  });
});

const startup = async () => {
  await client.connect();

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
};

startup();
