module.exports = function(app) {
  var User = app.models.Person;
  // User.create({email: 'bugs@bunny.com', password: 'bugs'}, function(err, userInstance) {
  //   console.log(userInstance);
  // });

  //login functionality
  app.post('/persons/login', function(req, res) {
    User.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token) {
      if (err) {
        res.render('response', { //render view named 'response.ejs'
          title: 'Login failed',
          content: err,
          redirectTo: '/',
          redirectToLinkText: 'Try again'
        });
        return;
      }

      res.render('home', { //login user and render 'home' view
        email: req.body.email,
        accessToken: token.id
      });
    });
  });

  // logout functionality
  app.get('/api/logout', function (req, res, next) {
		const access_token = req.query.access_token;
    console.log(access_token);
		// if (!access_token) {
		// 	res.status(400).json({"error": "access token required"});
		// 	return;
		// }
		User.logout(access_token, function (err,data) {
      console.log('callback me aaya',err,data);
			if (err) {
				res.status(404).json({"error": "logout failed"});
				return;
			}
			res.status(204);
      res.json({
        "title": 'User successfully logged out'
      })
		});
	});
}
