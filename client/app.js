$(document).ready(function() {
  window.token = localStorage.getItem('accessToken');
  window.role = localStorage.getItem('role');
  window.currentUser = localStorage.getItem('id');
  if (!token || token === undefined) {
    $('#loginModal').addClass('is-active');
  }
  if(role == 'admin') {
    $.ajax({
      url:'/api/Books?access_token=' + token,
      method: "GET"
    }).then(function(data){
      console.log(data);
      var $listOfBooks = $('.list-of-books');
      data = data.filter(function(book) {
          if (!book.userId) {
            return book;
          }
      })
      for(var i in data) {
        $listOfBooks.append('<div class="book-desc card" id="'+ data[i].id +'"><div class="book-op"><button class="button is-info is-outlined edit-book"><i class="fa fa-pencil"></i></button><button class="button is-danger is-outlined delete-book"><i class="fa fa-times"></i></button></div><p class="book-title"><span>Title: </span><span>'+ data[i].title +'<span><p><div class="book-authors"><p>Author(s):<p></div></div>');
        for(var k in data[i].authors) {
          $($listOfBooks.find('.book-desc')[i]).find('.book-authors').append('<p class="author-name"><span>'+ data[i].authors[k].firstname+'</span><span> ' + data[i].authors[k].middlename +'</span><span> '+ data[i].authors[k].lastname + '</span></p>')
        }
      }
    });
    $.ajax({
      url: '/api/persons?access_token=' + token,
      method: "GET"
    }).then(function(data) {
      console.log(data);
      var users = data.filter(function(user) {
        if(user.role == 'user') {
          return user;
        }
      }).map(function(user) {
        $('.list-of-users').append('<div class="user-desc card" id="'+ user.id +'"><div class="user-op"><button class="button is-info is-outlined add-book-user"><span>Add Book</span></button><button class="button is-danger is-outlined show-book-user"><span>View Book(s)</span></button></div><p class="user-name"><span>Email: </span><span>'+ user.email +'<span></p></div>')
      });
    })
  } else if (role == 'user'){
    $('.for-admin').addClass('hide');
    $.ajax({
      url: '/api/persons/books?access_token=' + token + '&id=' + currentUser,
      method: "GET"
    }).then(function(data){
      var book = data.data;
      var $listOfBooks = $('.list-of-books');
      for(var i in book) {
        $listOfBooks.append('<div class="book-desc card" id="'+ book[i].id +'"><div class="book-op"><button class="button is-danger is-outlined delete-user-book"><i class="fa fa-times"></i></button></div><p class="book-title"><span>Title: </span><span>'+ book[i].title +'<span><p><div class="book-authors"><p>Author(s):<p></div></div>');
        for(var k in book[i].authors) {
          $($listOfBooks.find('.book-desc')[i]).find('.book-authors').append('<p class="author-name"><span>'+ book[i].authors[k].firstname+'</span><span> ' + book[i].authors[k].middlename +'</span><span> '+ book[i].authors[k].lastname + '</span></p>')
        }
      }
    })
  }
});

var openRemainingBookModal = function(userId) {
  $.ajax({
    url:'/api/persons/remaining-books?access_token=' + token + '&id=' + userId,
    method: "GET"
  }).then(function(data) {
    var books = data.books;
    $('#bookListModal').addClass('is-active');
    $('#list-unassigned').removeClass('hide');
    $('#list-assigned').addClass('hide');
    $('.list-of-unassigned-books').html('');
    for(var i in books) {
      $('.list-of-unassigned-books').append('<div class="book-desc card" id="'+ books[i].id +'"><p class="book-title">' + books[i].title + '</p><div class="book-authors"><p>Authors:</p></div></div>');
      for(var k in books[i].authors) {
        $($('.list-of-unassigned-books').find('.book-desc')[i]).find('.book-authors').append('<p class="author-name"><span>'+ books[i].authors[k].firstname+'</span><span> ' + books[i].authors[k].middlename +'</span><span> '+ books[i].authors[k].lastname + '</span></p>')
      }
    }
  });
}

$('.list-of-books').on('click','.delete-user-book',function(e) {
  var $this = $(e.target);
  var id = $this.closest('.book-desc').attr('id');
  $.ajax({
    url: '/api/persons/'+ currentUser + '/books/' + id + '?access_token=' + token,
    method: 'DELETE'
  }).then(function(data) {
      location.reload();
  })
});


$('.modal-close').on('click',function(e) {
  var $this = $(e.target);
  $this.closest('.modal').removeClass('is-active');
})

$('#login-button').on('click',function(e) {
  var $modal = $('#loginModal');
  var email = $modal.find('#user-email').val();
  var password = $modal.find('#user-password').val();
  var request = $.ajax({
    url: '/api/persons/login',
    data: {
      'email': email,
      'password': password
    },
    method: "POST"
  });
  request.done(function(msg) {
    localStorage.setItem('accessToken',msg.token);
    localStorage.setItem('role',msg.role);
    localStorage.setItem('id',msg.id);
    location.reload();
  })
});

$('#logout').on('click',function() {
  $.ajax({
    url: '/api/logout?access_token='+token,
    method: 'GET'
  }).then(function() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    location.reload();
  })
});

$('#addBook').on('click',function(e) {
  if (role == 'admin') {
    var $modal = $('#bookModal');
    $modal.addClass('is-active');
    $modal.find('#edit-book-button').addClass('hide');
    $modal.find('#add-book-button').removeClass('hide');
  } else if (role == 'user') {
    // var $this = $(e.target);
    // userId = $this.closest('.user-desc').attr('id');
    openRemainingBookModal(currentUser);
  }
})

var converttoAuthorArray = function(bookAuthors) {
  var authorsArray = [];
  if (typeof bookAuthors == 'string') {
    bookAuthors = bookAuthors.split(',');
  }
  for (var i in bookAuthors) {
    var nameArray = bookAuthors[i].trim().split(' ');
    authorsArray.push({
      firstname: nameArray[0] || '',
      middlename: nameArray[1] || '',
      lastname: nameArray[2] || ''
    })
  }
  return authorsArray;
}

$('#add-book-button').on('click',function() {
  var $modal = $('#bookModal');
  var bookTitle = $modal.find('#book-title').val();
  var bookAuthors = $modal.find('#book-authors').val();
  var authorsArray = converttoAuthorArray(bookAuthors);
  $.ajax({
    url: '/api/Books?access_token='+token,
    method: 'POST',
    data: {
      title: bookTitle,
      authors: authorsArray
    }
  }).then(function(data){
    location.reload();
  })
});


var id = null;

$('.list-of-books').on('click','.edit-book',function(e) {
  var $this = $(e.target);
  var $bookDesc = $this.closest('.book-desc');
  var title = $($bookDesc.find('.book-title').find('span')[1]).text();
  var authors = $bookDesc.find('.book-authors').find('.author-name');
  id = $bookDesc.attr('id');
  var $modal = $('#bookModal');
  var authorsArray = [];

  console.log(authors);
  for(var i=0;i<authors.length;i++) {
    console.log(authors[i]);
    var authorSpan = $($(authors[i]).find('span'));
    var authorName = '';
    for (var k=0; k< authorSpan.length;k++) {
      authorName += $(authorSpan[k]).text();
    }
    authorsArray.push(authorName);
  }
  console.log(authorsArray,id);
  $modal.addClass('is-active');
  $modal.find('#add-book-button').addClass('hide');
  $modal.find('#edit-book-button').removeClass('hide');
  $modal.find('#book-title').val(title);
  $modal.find('#book-authors').val(authorsArray.join(','));
});

$('#edit-book-button').on('click',function(e) {
  var $modal = $('#bookModal');
  var title = $modal.find('#book-title').val();
  var bookAuthors = $modal.find('#book-authors').val();
  var authors = converttoAuthorArray(bookAuthors);
  console.log(authors);
  $.ajax({
    url: '/api/Books?access_token='+token,
    method: 'PUT',
    data: {
      id: id,
      title: title,
      authors: authors
    }
  }).then(function() {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('role');
    location.reload();
  })
})

$('.list-of-books').on('click','.delete-book',function(e) {
  var $this = $(e.target);
  var id = $this.closest('.book-desc').attr('id');
  $.ajax({
    url: '/api/Books/'+ id + '?access_token=' + token,
    method: 'DELETE'
  }).then(function(data) {
    location.reload();
  })
});

var userId = null;
$('.list-of-users').on('click','.add-book-user',function(e) {
  var $this = $(e.target);
  userId = $this.closest('.user-desc').attr('id');
  openRemainingBookModal(userId);
});
$('.list-of-users').on('click','.show-book-user',function(e) {
  var $this = $(e.target);
  userId = $this.closest('.user-desc').attr('id');
  $.ajax({
    url: '/api/persons/books?access_token=' + token + '&id=' + userId,
    method: "GET"
  }).then(function(data){
    var books = data.data;
    $('#bookListModal').addClass('is-active');
    $('#list-unassigned').addClass('hide');
    $('#list-assigned').removeClass('hide');
    $('.list-of-unassigned-books').html('');
    for(var i in books) {
      $('.list-of-unassigned-books').append('<div class="book-desc-delete card" id="'+ books[i].id +'"><p class="book-title">' + books[i].title + '</p><button class="button is-danger is-outlined delete-book-user"><i class="fa fa-times"></i></button><div class="book-authors"><p>Authors:</p></div></div>');
      for(var k in books[i].authors) {
        $($('.list-of-unassigned-books').find('.book-desc-delete')[i]).find('.book-authors').append('<p class="author-name"><span>'+ books[i].authors[k].firstname+'</span><span> ' + books[i].authors[k].middlename +'</span><span> '+ books[i].authors[k].lastname + '</span></p>')
      }
    }
  })
})

$('.list-of-unassigned-books').on('click','.book-desc',function(e) {
  var $this = $(e.target);
  var id = $this.closest('.book-desc').attr('id');
  var $bookDesc = $this.closest('.book-desc');
  var title = $($bookDesc.find('.book-title')).text();
  var bookAuthors = $('#bookListModal').find('#book-authors').val();
  var authors = $bookDesc.find('.book-authors').find('.author-name');
  console.log(authors);
  var authorsArray = [];
  for(var i=0;i<authors.length;i++) {
    console.log(authors[i]);
    var authorSpan = $($(authors[i]).find('span'));
    var authorName = '';
    for (var k=0; k< authorSpan.length;k++) {
      authorName += $(authorSpan[k]).text();
    }
    authorsArray.push(authorName);
  }
  var authors = converttoAuthorArray(authorsArray);
  if (role == 'user') {
    userId = currentUser;
  }
  $.ajax({
    url: '/api/persons/'+ userId +'/books?access_token='+token,
    method: "POST",
    data: {
      userId: id,
      title: title,
      authors: authors
    }
  }).then(function(data) {
      location.reload();
  })
});

$('.list-of-unassigned-books').on('click','.delete-book-user',function(e) {
    var $this = $(e.target);
    var id = $this.closest('.book-desc-delete').attr('id');
    $.ajax({
      url: '/api/persons/'+ userId + '/books/' + id + '?access_token=' + token,
      method: 'DELETE'
    }).then(function(data) {
        location.reload();
    })
})
