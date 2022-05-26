const fs = require('fs');
const { generateKeyPairSync } = require('crypto');

function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(__dirname + '/public.pem', keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(__dirname + '/private.pem', keyPair.privateKey);
}

genKeyPair();
