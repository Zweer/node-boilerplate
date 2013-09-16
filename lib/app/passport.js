module.exports = function passportSetup () {
  passport = require('passport');

  passport.use(new (require('passport-local').Strategy)(function (username, password, done) {
    done(null, username);
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};