const express = require('express');
const passport = require('passport');
const session = require('express-session');
const sessionOptions = require('../config/session');

const passportGoogleOAuthRouter = express.Router();

passportGoogleOAuthRouter.use(session(sessionOptions));
passportGoogleOAuthRouter.use(passport.initialize());
passportGoogleOAuthRouter.use(passport.session());

// /auth/google
passportGoogleOAuthRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// /auth/google/callback
passportGoogleOAuthRouter.get(
  '/auth/callback',
  passport.authenticate('google', {
    failureRedirect: '/google/failure',
    successRedirect: '/google/profile',
  }),
  function (req, res) {
    res.status(200).send('<h1>Welcome</h1>');
  }
);

// /failure
passportGoogleOAuthRouter.get('/failure', (req, res) => {
  res.status(400).send('<h1>Something went wrong</h1>');
});

// /protected
passportGoogleOAuthRouter.get(
  '/profile',
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return res.status(403).send('<h1>Please login first</h1>');
    }
  },
  (req, res) => {
    return res.status(200).send(`<h1>Welcome ${req.user.displayName}</h1>`);
  }
);

module.exports = passportGoogleOAuthRouter;
