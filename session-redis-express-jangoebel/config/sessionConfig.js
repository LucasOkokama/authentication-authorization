const { RedisStore } = require('connect-redis');
const redisClient = require('./redisConfig');

module.exports = {
  store: new RedisStore({
    client: redisClient,
    prefix: 'sess:',
  }),
  secret: 'mySecret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 30,
  },
};
