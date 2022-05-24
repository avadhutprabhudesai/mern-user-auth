const express = require('express');
const session = require('express-session');

const sessionOptions = require('../config/session');

const expressSessionRouter = express.Router();

expressSessionRouter.use(session(sessionOptions));

expressSessionRouter.get('/', (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 1;
  }
  res.send(
    `<h1>You have visited this website ${req.session.viewCount} time(s)</h1>`
  );
});

module.exports = expressSessionRouter;
