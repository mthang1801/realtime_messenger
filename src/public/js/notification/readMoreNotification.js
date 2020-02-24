//create variable to prevent request too many times
let loading = false ; 

function readMoreNotification(){
  $("#notification-dashboard-body").off("scroll").on("scroll", function(e){ 
    if(loading){
      return;
    }
    let skipNumber = $(this).find("ul").children().length;
    // console.log(`offset().top: ${$(this).find("li:last-child").offset().top}`)
    // console.log(`scrollTop: ${$(this).scrollTop()}`)
    // console.log(`scrollHeight: ${$(this)[0].scrollHeight}`);
    let offsetPage =  $(this).scrollTop()  + 100;
    // console.log(offsetPage)
    if($(this)[0].scrollHeight - $(this)[0].clientHeight <= $(this).scrollTop()  + 20){      
      loading = true ;
      $(".notification-loading").show();
      $(this).scrollTop($(this)[0].scrollTop + 50);
      $.ajax({
        type: "get",
        url: `/notification/read-more-notifications?skipNumber=${skipNumber}`,
        global: false ,
        success: function (data) {          
          if(data){
           let {usersNotification} = data.usersNotification;           
           $("#notification-dashboard-body ul.card-notifications").append(usersNotification);
          
           $("#notification-dashboard-body").scrollTop(offsetPage);
           loading = false;
           eventNotificationItem();
          }
        },
        error : function (error){
          alertify.notify(`${error.responseText}`, "error", 7);
          $(".notification-loading").hide();
          loading = true ;
        }
      });     
    }
  })
}

$(document).ready(function () {
  readMoreNotification();
});
