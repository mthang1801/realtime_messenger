let showRegisterForm = () => {
  $(".tab-pane").each((index,element) => {
    $(element).removeClass("active show");
  })
  $(".nav-link").each((index,element) => {
    $(element).removeClass("active");
  })
  
  $("#btn-register").click();
}

let showLoginForm = () => {
  $(".tab-pane").each((index,element) => {
    $(element).removeClass("active show");
  })
  $(".nav-link").each((index,element) => {
    $(element).removeClass("active");
  })
  
  $("#btn-login").click();
}

$(document).ready(function () {

});


