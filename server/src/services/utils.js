const { pbkdf2Sync } = require('crypto');
const { timingSafeEqual } = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '..', 'private.pem'));

function generateHash(secret, salt) {
  const hash = pbkdf2Sync(secret, salt, 100000, 64, 'sha512');
  return [salt, hash.toString('hex')];
}

function verifyPassword(password, salt, hash) {
  const [, derivedHash] = generateHash(password, salt);
  return timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(derivedHash, 'hex')
  );
}

function issueJWT(user) {
  const payload = {
    sub: user._id,
    iat: Math.floor(Date.now / 1000),
  };
  const expiresIn = 2;
  const options = {
    algorithm: 'RS256',
    expiresIn: expiresIn,
  };
  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, options);

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
}

module.exports = {
  generateHash,
  verifyPassword,
  issueJWT,
};
