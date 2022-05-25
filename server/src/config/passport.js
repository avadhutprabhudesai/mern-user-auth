const { timingSafeEqual } = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');
const { generateHash } = require('../services/password');

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        done(null, false);
      }
      const [, derivedHash] = generateHash(password, user.salt);
      if (
        timingSafeEqual(
          Buffer.from(user.hash, 'hex'),
          Buffer.from(derivedHash, 'hex')
        )
      ) {
        done(null, user);
      }
    } catch (error) {
      console.log(error);
      done(error);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (user, done) => {
  const userObj = await User.findById(user);
  done(null, userObj);
});
