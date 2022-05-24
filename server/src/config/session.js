const MongoStore = require('connect-mongo');

const sessionOptions = {
  cookie: {
    maxAge: 60 * 60 * 1000, //hr to ms conversion
    httpOnly: true,
    secure: true,
  },
  resave: false,
  saveUninitialized: true,
  secret: 'foobar',
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
};

module.exports = sessionOptions;
