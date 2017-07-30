module.exports = function(app) {
  var User = app.models.Person;
  var Book = app.models.Book;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  // User.create({email: 'daffy@duck.com', password: 'daffy'}, function(err, userInstance) {
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
          res.json({
            role:"user",
            token: token.id,
            id: token.userId
          })
        }
      })
    });
  });

  // logout functionality
  app.get('/api/logout', function (req, res, next) {
		const access_token = req.query.access_token;
		// if (!access_token) {
		// 	res.status(400).json({"error": "access token required"});
		// 	return;
		// }
		User.logout(access_token, function (err,data) {
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
      for (var i =0; i<books.length;i++) {
        if (books[i].toJSON().userId) {
          titles.push(books[i].title);
        }
      }
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
      res.json({
        "books": bookFinal
      })
    });
  })
}
