module.exports = function(app) {
  var User = app.models.Person;
  var Book = app.models.Book;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  // User.create({email: 'bugs@bunny.com', password: 'bugs'}, function(err, userInstance) {
  //   console.log(userInstance);
  // });

  //login functionality
  app.post('/api/persons/login', function(req, res) {
    User.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token) {
      Role.isInRole('admin',{principalType: RoleMapping.USER,
      principalId: token.userId},function(err,role) {
        if (role) {
          res.json({
            role:"admin",
            token: token.id,
            id: token.userId
          })
        } else if (!role){
          console.log(token.userId);
          res.json({
            role:"user",
            token: token.id,
            id: token.userId
          })
        }
      })
      // if (err) {
      //   res.render('response', { //render view named 'response.ejs'
      //     title: 'Login failed',
      //     content: err,
      //     redirectTo: '/',
      //     redirectToLinkText: 'Try again'
      //   });
      //   return;
      // }
      // res.render('home', { //login user and render 'home' view
      //   email: req.body.email,
      //   accessToken: token.id
      // });
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

  app.get('/api/persons/remaining-books',function(req,res) {
    var access_token = req.query.access_token;
    var id = req.query.id;
    var bookFinal = [];
    Book.find({
    },function(err,books) {
      var titles = [];
      console.log(books);
      for (var i =0; i<books.length;i++) {
        console.log(books[i].title)
        console.log(books[i].toJSON().userId);
        if (books[i].toJSON().userId) {
          titles.push(books[i].title);
        }
      }
      console.log(titles);
      books = books.filter(function(data){
        if (!data.toJSON().userId) {
          return data;
        }
      });
      for (var i=0; i< books.length; i++) {
        var count = 0;
        for (var j=0; j< titles.length;j++) {
          if (books[i].title == titles[j]) {
            count++;
          }
        }
        if (!count) {
          bookFinal.push(books[i]);
        }
      }
      console.log(bookFinal);
      res.json({
        "books": bookFinal
      })
    });
  })
}
