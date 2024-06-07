// ClientServer.js

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
const path = require('path')
const fs = require('fs');
const mqtt = require('mqtt');
const tls = require('tls');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const CLIENT_ID = "23PJ58"
const CLIENT_SECRET = "541c583975a201a357ff6ef3ed2c7d78"
const CALLBACK_URL = "https://c347-2001-2d8-e680-92cb-882b-1a82-1c7c-141f.ngrok-free.app/auth/fitbit/callback"

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'UI', 'view'));
app.use(express.static(path.join(__dirname, 'UI')));
app.use('/auth', express.static(path.join(__dirname, 'UI')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'UI', 'view', 'login.html'));
});

const User = {
  findOrCreate: (criteria, callback) => {
    const user = { id: criteria.fitbitId }; // Mock user object
    callback(null, user);
  }
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new FitbitStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    User.findOrCreate({ fitbitId: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      const userIdTopic = `hikingMetrics/${user.id}`;
      client.subscribe(userIdTopic, function (err) {
        if (!err) {
          console.log('Subscribed to topic:', userIdTopic);
        }
      });
      
      return done(null, user);
    });

  }
));

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/fitbit', 
  passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] })
);

app.get('/auth/fitbit/callback', 
  passport.authenticate('fitbit', { 
    successRedirect: '/auth/fitbit/success',
    failureRedirect: '/auth/fitbit/failure' 
  })
);

app.get('/auth/fitbit/success', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/fitbit/failure');
    }
    res.render('index', { user: req.user });        
});

app.get('/auth/fitbit/failure', (req, res) => {
  res.send('<h1>Authentication Failed</h1>');
});

const ENDPOINT = "ahye6s6lodn9-ats.iot.ap-northeast-2.amazonaws.com";
const THING_NAME = 'raspberrypi';
const CERTPATH =  "/home/team6/fitbitOAuth/raspberrypi.cert.pem"; // cert파일 경로
const KEYPATH = "/home/team6/fitbitOAuth/raspberrypi.private.key"; // key 파일 경로
const CAROOTPATH = "/home/team6/fitbitOAuth/root-CA.crt"; // RootCaPem 파일 경로
// const TOPIC = 'hikingMetrics'; //주제

const options = {
  clientId: THING_NAME,
  protocol: 'mqtts',
  port: 8883,
  rejectUnauthorized: true,
  key: fs.readFileSync(KEYPATH),
  cert: fs.readFileSync(CERTPATH),
  ca: fs.readFileSync(CAROOTPATH),
  ciphers: null,
  secureProtocol: 'TLSv1_2_method'
};

const client = mqtt.connect(`mqtts://${ENDPOINT}`, options);

// client.on('connect', function () {
//   console.log('connected');
//   client.subscribe(TOPIC, function (err) {
//     if (!err) {
//       console.log('Subscribed to topic:', TOPIC);
//     }
//   });
// });

client.on('message', function (topic, message) {
  console.log(topic + ':' + message.toString());
  io.emit('mqttMessage', message.toString());
  console.log('done')
});

process.on('SIGINT', function () {
  client.end();
  console.log('\n');
});

server.listen(3000, () => {
  console.log('ClientServer listening on port 3000');
});
