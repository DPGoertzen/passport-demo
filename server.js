var express = require('express');
var bodyParser = require('body-parser');
var login = require('./routes/login');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');
var path = require('path');

var app = express();

var mongoURI = "mongodb://localhost:27017/prime_passport";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err){
  console.log("connection error", err);
});

MongoDB.once('open', function(){
  console.log('mongodb connection is open');
})

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    if(err) {
      return done(err);
    }
    done(null, user);
  });
});

passport.use('local', new localStrategy({
      passReqToCallback : true,
      usernameField: 'username'
  },
  function(req, username, password, done){
    User.findOne({ username: username }, function(err, user) {
      if (err) {
         throw err;
    };

      if (!user) {
        return done(null, false, {message: 'Incorrect username and password.'});
      }

      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          throw err;
        }

        if (isMatch) {
        return done(null, user);
        } else {
          done(null, false, { message: 'Incorrect username and password.' });
        }
      });
    });
  })
);


app.use(passport.initialize());

app.use(passport.session());

passport.use('local', new localStrategy({
      passReqToCallback : true,
      usernameField: 'username'
  },
  function(req, username, password, done){
    User.findOne({ username: username }, function(err, user) {
      if (err) {
         throw err
      };

      if (!user) {
        return done(null, false, {message: 'bad username.'});
      }

      // test a matching password
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          throw err;
        }

        if (isMatch) {
          return done(null, user);
        } else {
          done(null, false, { message: 'bad username or password.' });
        }
      });
    });
  })
);


app.use(session({
   secret: 'secret',
   key: 'user',
   resave: true,
   saveUninitialized: false,
   cookie: { maxAge: 60000, secure: false }
}));
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/register', register);
app.use('/login', login);

app.get('/', function(req,res,next){
  res.sendFile(path.resolve(__dirname, 'public/views/login.html'));
});






var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('ready and waiting on port', port);
})
