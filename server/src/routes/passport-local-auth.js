const express = require('express');
const { randomBytes } = require('crypto');
const session = require('express-session');
const passport = require('passport');
const sessionOptions = require('../config/session');
const User = require('../model/User');
const { generateHash } = require('../services/utils');

const passportLocalRouter = express.Router();

/**
 * ===================================
 *    Middlewares
 * ===================================
 */
passportLocalRouter.use(session(sessionOptions));

passportLocalRouter.use(passport.initialize());
passportLocalRouter.use(passport.session());

/**
 * ===================================
 *    Routes
 * ===================================
 */

passportLocalRouter.post('/register', async (req, res, next) => {
  const [salt, hash] = generateHash(
    req.body.password,
    randomBytes(16).toString('hex')
  );
  try {
    const created = await User.create({
      username: req.body.username,
      hash,
      salt,
    });
    return res.status(201).json(created);
  } catch (error) {
    let err = new Error(`Error creating a new user. ${error.message}`);
    err.status = 400;
    next(err);
  }
});

passportLocalRouter.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/local/failure',
    successRedirect: '/local/success',
  })
);

passportLocalRouter.get('/failure', (req, res) => {
  return res.status(400).json({
    error: 'Authentication Failure',
  });
});
passportLocalRouter.get('/success', (req, res) => {
  return res.status(200).json({
    username: req.user.username,
  });
});

passportLocalRouter.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      data: 'Protected data',
    });
  } else {
    return res.status(401).json({
      error: 'Unauthrized access',
    });
  }
});

passportLocalRouter.get('/logout', (req, res) => {
  req.logOut(() => {
    return res.status(200).json({
      message: 'Successfuly logged out',
    });
  });
});

module.exports = passportLocalRouter;
