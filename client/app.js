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
        $('.list-of-books').append('<div class="book-desc card"><div class="book-op"><button class="button is-info is-outlined edit-book"><i class="fa fa-pencil"></i></button><button class="button is-danger is-outlined delete-book"><i class="fa fa-times"></i></button></div><p class="book-title"><span>Title: </span><span>'+ data[i].title +'<span><p><div class="book-authors"><p>Author(s):<p></div></div>');
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
  $('#bookModal').addClass('is-active');
})

$('#add-book-button').on('click',function() {
  var $modal = $('#bookModal');
  var bookTitle = $modal.find('#book-title').val();
  var bookAuthors = $modal.find('#book-authors').val();
   bookAuthors = bookAuthors.split(',');
  var authorsArray = [];
  for (var i in bookAuthors) {
    var nameArray = bookAuthors[i].trim().split(' ');
    authorsArray.push({
      firstname: nameArray[0] || '\n',
      middlename: nameArray[1] || '\n',
      lastname: nameArray[2] || '\n'
    })
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
  }
  console.log(authorsArray);
});
