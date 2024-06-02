// AuthServer.js

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

const CLIENT_ID = '23PHBF';
const CLIENT_SECRET = 'ffc8252cd8b51f47e312c2819fef7141';
const AUTH_CODE = '4feb4bd42b8b0f861137ad5559a7174676e99d65';
const ACCESS_TOKEN_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1BIQkYiLCJzdWIiOiJCWlBHR0IiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByb3h5IHJudXQgcnBybyByc2xlIHJjZiByYWN0IHJsb2MgcnJlcyByd2VpIHJociBydGVtIiwiZXhwIjoxNzE3MzU3MDczLCJpYXQiOjE3MTczMjgyNzN9.GiFab4JV85-oTSnjKcQOQEW7f3b4CzcQFTD1QfqbGlE.eyJhdWQiOiIyM1BIQkYiLCJzdWIiOiJCWlBHR0IiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByb3h5IHJwcm8gcm51dCByc2xlIHJjZiByYWN0IHJyZXMgcmxvYyByd2VpIHJociBydGVtIiwiZXhwIjoxNzE3MzU1MjE5LCJpYXQiOjE3MTczMjY0MTl9.ZNXLALpxFtT2SOchvSwaQhiiELD6-5yRvBQ_1aOd-GE';
const REFRESH_TOKEN_SECRET = '701c4b07fbc06b0b41f6d187bc22411bb51b41e939b5f3f6b2130dd5702bd545';

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
