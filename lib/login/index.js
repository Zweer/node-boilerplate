var express = require('express');
var app = module.exports = express();

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});