module.exports = function(app) {
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  Role.create({
    name: 'user'
  }, function(err, role) {
    if (err) throw err;


    //make bugs an admin
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: '59797d492c0b994c500af648'
    }, function(err, principal) {
      if (err) throw err;

    });
  });

  Role.create({
    name: 'admin'
  }, function(err, role) {
    if (err) throw err;


    //make bugs an admin
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: '5979abb69c82ef8704b3b783'
    }, function(err, principal) {
      if (err) throw err;

    });
  });
};
