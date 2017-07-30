'use strict';

module.exports = function(Book) {
  console.log(Book.super)
  var Person = Book.super_.app.models.Person;
  Book.listRemBooks = function(id,cb) {
    Book.find({
    },function(err,books) {
      books = books.filter(function(data){
        if (!data.userId) {
          return data;
        }
        Person.__findById__books({id: id},function(err,data) {
          console.log(data);
        })
      })
      cb(null,books);
    });
  };
  Book.remoteMethod('listRemBooks', {
    accepts: [
      {arg: 'id', type: 'string'},
    ],
    returns: {arg: 'books', type: 'array'},
    http: {path:'/remaining-books', verb: 'get'}
  });
};
