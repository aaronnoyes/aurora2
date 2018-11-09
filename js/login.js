$(document).ready(function(){

  var email = "";
  var password = "";

  $("#login-email").bind('input', function(){
      email = $(this).val();
      console.log(email);
  });

  $("#login-password").bind('input', function() {
      password = $(this).val();
      console.log(password);
  });

  $("#login-submit-button").click(function() {
    document.location.href = "./home.html";
  });

});
