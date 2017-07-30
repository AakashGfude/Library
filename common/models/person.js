'use strict';

module.exports = function(Person) {
  // this Operation Hook is to attach a role to each user;
  Person.observe('loaded',function(ctx,next) {
    var Role = ctx.Model.super_.app.models.Role;
    var RoleMapping = ctx.Model.super_.app.models.RoleMapping;
    Role.isInRole('admin',{principalType: RoleMapping.USER,
      principalId: ctx.instance.id},function(err,role) {
        if (role) {
          ctx.instance.role = 'admin';
          next();
        } else {
          ctx.instance.role = 'user';
          next();
        }
      });
  });

  Person.getPersonData = function(id,cb) {
    //console.log(Person.super_.app.models.Book);
    var Book = Person.super_.app.models.Book;
    console.log(id);
    Book.find({where: {userId:id}},function(err,books) {
      cb(null,books);
    });
  };
  Person.remoteMethod('getPersonData', {
    accepts: [
      {arg: 'id', type: 'string'},
    ],
    returns: {arg: 'data', type: 'object'},
    http: {path:'/books', verb: 'get'}
  });
  // Person.deleteBookUser = function(userId,id,cb) {
  //   //console.log(Person.super_.app.models.Book);
  //   var Book = Person.super_.app.models.Book;
  //   Book.update({id:id},{$unset: { userId: ""}}, {multi:true},function(err,books) {
  //     cb(null,true);
  //   })
  //   // col.update({ _id: 1234 }, { $unset : { description : 1} });
  //   // console.log(id);
  //   // Book.find({where: {userId:id}},function(err,books) {
  //   //   cb(null,books);
  //   // });
  // };
  // Person.remoteMethod('deleteBookUser', {
  //   accepts: [
  //     {arg: 'userId', type: 'string'},
  //     {arg: 'id', type: 'string'}
  //   ],
  //   returns: {arg: 'data', type: 'object'},
  //   http: {path:'/delete-book', verb: 'delete'}
  // });
};
