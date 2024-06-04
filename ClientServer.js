// ClientServer.js

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
const path = require('path')
const app = express();

const CLIENT_ID = ""
const CLIENT_SECRET = ""
const CALLBACK_URL = ""

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

app.listen(3000, () => {
  console.log('ClientServer listening on port 3000');
});
