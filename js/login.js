$(document).ready(function(){

  var email = "";
  var password = "";

  $("#login-email").change(function(){
      email = $(this).val();
      console.log(email);
  });

  $("#login-password").change(function() {
      password = $(this).val();
      console.log(password);
  });

  $("#login-submit-button").click(function() {
    document.location.href = "./home.html";
  });

});
