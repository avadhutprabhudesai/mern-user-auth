const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');
const { verifyPassword } = require('../services/utils');

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        done(null, false);
      }
      if (verifyPassword(password, user.salt, user.hash)) {
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
