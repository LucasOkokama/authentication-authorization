const express = require('express');
const app = express();

const { createClient } = require('redis');
const client = createClient({
  url: 'redis://redis:6379',
});

const { v4: uuidv4 } = require('uuid');

const products = [
  '0bb07723-682e-465e-8409-62f56fec23d9',
  '9d92a1bf-57f6-4e15-8e66-ada7deb0fffe',
];

const getAllProducts = async () => {
  const responseTimeMS = Math.random() * 15000;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(products);
    }, responseTimeMS);
  });
};

app.get('/', async (req, res) => {
  const products = [];
  const productsFromCache = await client.get('getAllProducts');
  const isProductsFromCacheStale = !(await client.get(
    'getAllProducts:validation'
  ));

  // Stale-While-Revalidate
  if (isProductsFromCacheStale) {
    const isRefetching = !!(await client.get('getAllProducts:is-refetching'));
    if (!isRefetching) {
      await client.set('getAllProducts:is-refetching', 'true', { EX: 20 });
      setTimeout(async () => {
        products = await getAllProducts();
        await client.set('getAllProducts', JSON.stringify(products));
        await client.set('getAllProducts:validation', 'true', { EX: 5 });
        await client.del('getAllProducts:is-refetching');
      }, 0);
    }
  }

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

app.get('/add', async (req, res) => {
  await client.del('getAllProducts');
  products.push(uuidv4());
  return res.redirect('http://localhost:3000');
});

const startup = async () => {
  await client.connect();

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
};

startup();
