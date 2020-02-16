function showRegisterForm(){
  $(".tab-pane").each(function(index,element) {
    $(element).removeClass("active show");
  })
  $(".nav-link").each(function(index,element) {
    $(element).removeClass("active");
  })
  
  $("#btn-register").click();
}

function showLoginForm(){
  $(".tab-pane").each(function(index,element){    
    $(element).removeClass("active show");
  })
  $(".nav-link").each(function(index,element){
    $(element).removeClass("active");
  })  
  $("#btn-login").click();
}


