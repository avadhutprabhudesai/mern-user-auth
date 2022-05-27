const express = require('express');
const passport = require('passport');
const User = require('../model/User');
const { issueJWT, generateHash, verifyPassword } = require('../services/utils');
const { randomBytes } = require('crypto');

const passportJWTRouter = express.Router();
passportJWTRouter.use(passport.initialize());

passportJWTRouter.post('/register', async (req, res, next) => {
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
    return res.status(201).json({
      success: true,
      user: created,
    });
  } catch (error) {
    let err = new Error(`Error creating a new user. ${error.message}`);
    err.status = 400;
    next(err);
  }
});
passportJWTRouter.post('/login', async (req, res, next) => {
  // fetch user from db
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      throw new Error('User authentication failed');
    }
    const isValid = verifyPassword(req.body.password, user.salt, user.hash);
    if (isValid) {
      const signedToken = issueJWT(user);
      return res.status(200).json({
        success: true,
        user,
        ...signedToken,
      });
    } else {
      throw new Error('User authentication failed');
    }
  } catch (error) {
    let err = new Error(`Error loggin in. ${error.message}`);
    err.status = 400;
    next(err);
  }
});
passportJWTRouter.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).send('You have been authorized');
  }
);
passportJWTRouter.get('/logout', (req, res) => {
  req.logOut(() => {
    return res.status(200).send('Successfully logged out');
  });
});

module.exports = passportJWTRouter;
