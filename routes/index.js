app.get('/', function (req, res) {
  res.locals.csrf = req.csrfToken();
  res.locals.passport = req.session.passport;
  res.render('index');
});