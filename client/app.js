$(document).ready(function() {
  var token = localStorage.getItem('swagger_accessToken');
  console.log(token);
  if (!token || token === undefined) {
    $('#loginModal').addClass('is-active');
  }
});

$('#login-button').on('click',function(e) {
  var modal = $('#loginModal');
  var _email = modal.find('#user-email').val();
  var _password = modal.find('#user-password').val();
  var request = $.ajax({
    url: '/api/persons/login',
    data: {
      'email': _email,
      'password': _password
    },
    method: "POST"
  });
  request.done(function(msg) {
    localStorage.setItem('swagger_accessToken',msg.id);
    location.reload();
  })
});

$('#logout').on('click',function() {
  var token = localStorage.getItem('swagger_accessToken');
  $.ajax({
    url: '/api/logout?access_token='+token,
    method: 'GET'
  }).then(function() {
    localStorage.removeItem('swagger_accessToken');
    location.reload();
  })
});
