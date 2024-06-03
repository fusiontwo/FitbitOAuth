// AuthServer.js (안 쓰는 코드)

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const AUTH_CODE = '';
const ACCESS_TOKEN_SECRET = '';
const REFRESH_TOKEN_SECRET = '';

app.use(bodyParser.json());

app.post('/authorize', (req, res) => {
  const { client_id, response_type, redirect_uri, scope, state } = req.body;
  
  if (client_id !== CLIENT_ID || response_type !== 'code') {
    return res.status(400).send('Invalid request');
  }

  res.json({ code: AUTH_CODE });
});

app.post('/token', (req, res) => {
  const { client_id, client_secret, code, redirect_uri, grant_type } = req.body;
  
  if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET || code !== AUTH_CODE || grant_type !== 'authorization_code') {
    return res.status(400).send('Invalid request');
  }

  const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  res.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken
  });
});

app.listen(4000, () => {
  console.log('AuthorizationServer listening on port 4000');
});
