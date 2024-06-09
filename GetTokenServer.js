// GetTokenServer.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

let temporaryData = null;

app.post('/receiveToken', (req, res) => {
  const { accessToken, userId } = req.body;
  if (accessToken && userId) {
    temporaryData = { accessToken, userId };
    console.log(`Received access token for user ${userId}`);
    res.status(200).send('Access token received');
  } else {
    res.status(400).send('Invalid request');
  }
});

app.get('/viewToken', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewToken.html'));
});

app.get('/api/token', (req, res) => {
  if (temporaryData) {
    res.json(temporaryData);
    temporaryData = null; // 데이터 일회성 사용 후 제거
  } else {
    res.status(404).send('No data available');
  }
});

app.listen(4000, () => {
  console.log('ReceiverServer listening on port 4000');
});

