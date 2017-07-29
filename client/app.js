$(document).ready(function() {
  window.token = localStorage.getItem('accessToken');
  window.role = localStorage.getItem('role');
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

      for(var i in data) {
        $('.list-of-books').append('<div class="book-desc card" id="'+ data[i].id +'"><div class="book-op"><button class="button is-info is-outlined edit-book"><i class="fa fa-pencil"></i></button><button class="button is-danger is-outlined delete-book"><i class="fa fa-times"></i></button></div><p class="book-title"><span>Title: </span><span>'+ data[i].title +'<span><p><div class="book-authors"><p>Author(s):<p></div></div>');
        for(var k in data[i].authors) {
          $($listOfBooks.find('.book-desc')[i]).find('.book-authors').append('<p class="author-name"><span>'+ data[i].authors[k].firstname+'</span><span> ' + data[i].authors[k].middlename +'</span><span> '+ data[i].authors[k].lastname + '</span></p>')
        }
      }
    })
  }
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
    location.reload();
  })
});

$('#addBook').on('click',function() {
  var $modal = $('#bookModal');
  $modal.addClass('is-active');
  $modal.find('#edit-book-button').addClass('hide');
  $modal.find('#add-book-button').removeClass('hide');
})

var converttoAuthorArray = function(bookAuthors) {
  var authorsArray = [];
  bookAuthors = bookAuthors.split(',');
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
    console.log(data);
  })
  console.log(authorsArray);
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
})
