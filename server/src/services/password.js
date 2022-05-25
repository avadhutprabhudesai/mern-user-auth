const { pbkdf2Sync } = require('crypto');

function generateHash(secret, salt) {
  const hash = pbkdf2Sync(secret, salt, 100000, 64, 'sha512');
  return [salt, hash.toString('hex')];
}

module.exports = {
  generateHash,
};
