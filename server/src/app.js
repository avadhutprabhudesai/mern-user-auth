const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

/**
 * IMPORTANT:
 * - In order for google social sign on to work properly, comment passport-local-config import and uncomment passport-google-config import
 * - In order for local auth to work properly, uncomment passport-local-config import and comment passport-google-config import
    

  The reason is both the config adds serializeUser and deserializeUser on the passport app which creates an issue.
 */
require('./config/passport-local-config'); //comment this for google-auth to work properly
require('./config/passport-jwt-config');
require('./config/passport-google-config'); //comment this for local-auth to work properly

const expressSessionRouter = require('./routes/express-session');
const passportLocalRouter = require('./routes/passport-local-auth');
const passportJWTRouter = require('./routes/passport-jwt-auth');
const passportGoogleOAuthRouter = require('./routes/passport-google-oauth');
require('dotenv').config();

/**
 * ===================================
 *    Middlewares
 * ===================================
 */
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '..', 'public')));

/**
 * ===================================
 *    Routes
 * ===================================
 */

app.use('/session', expressSessionRouter);
app.use('/local', passportLocalRouter);
app.use('/jwt', passportJWTRouter);
app.use('/google', passportGoogleOAuthRouter);

/**
 * ===================================
 *    Error Handling
 * ===================================
 */
app.use((err, req, res, next) => {
  return res.status(err.status).json({
    message: err.message,
  });
});

module.exports = app;
