var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../public/views/login.html'))
})

router.get('/', function(req, res, next) {
  res.json(req.isAuthenticated());
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/views/success.html',
    failureRedirect: '/views/failure.html'
  })
);

module.exports = router;
