const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();
const app = require('./app');

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '..', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert.pem')),
  },
  app
);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await server.listen(PORT, () => {
    console.log(`Worker listening on ${PORT}`);
  });
}

startServer();
