const express = require("express");
const bodyParser = require('body-parser');
const users = require('./users.json');
const crypto = require('crypto');

const { AUTH_SECRET } = process.env;

const app = express();
app.use(bodyParser.json())

const createToken = username => {
  const sha256 = crypto.createHash('sha256');
  const today = new Date().toISOString().slice(0, 10);
  sha256.update(`${username}:${today}:${AUTH_SECRET}`);
  return `${username}:${sha256.digest('base64')}`;
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.json({ token: createToken(username) });
  } else {
    res.status(401).json({ message: 'invalid credentials' });
  }
});

app.post('/token_check', (req, res) => {
  const { token } = req.body;
  const [ username ] = token.split(':');
  if (token === createToken(username)) {
    res.json({ message: 'valid' });
  } else {
    res.status(401).json({ message: 'invalid' });
  }
});

app.listen(3001, () => console.log('Auth service listening on 3001'));