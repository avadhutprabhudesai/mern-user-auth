const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const expressSessionRouter = require('./routes/express-session');
const passportLocalRouter = require('./routes/passport-local-auth');
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
