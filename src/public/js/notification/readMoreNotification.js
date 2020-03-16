//create variable to prevent request too many times
let loading = false ; 

function readMoreNotification(){
  $("#notification-dashboard-body").off("scroll").on("scroll", function(e){ 
    if(loading){
      return;
    }
    let skipPrivateNumbers = $(this).find("li.card-notifications__item:not('.notification-group')").length;
    let skipGroupNumbers = $(this).find("li.card-notifications__item.notification-group").length;       
    let offsetPage =  $(this).scrollTop()  + 100;    
    if($(this)[0].scrollHeight - $(this)[0].clientHeight <= $(this).scrollTop()  + 20){      
      loading = true ;
      $(".notification-loading").show();
      $(this).scrollTop($(this)[0].scrollTop + 50);
      $.ajax({
        type: "get",
        url: `/notification/read-more-notifications?skipPrivateNumbers=${skipPrivateNumbers}&skipGroupNumbers=${skipGroupNumbers}`,
        global: false ,
        success: function (data) {          
          if(data){
           let {allNotificationsContent} = data.allNotificationsContent;           
           $("#notification-dashboard-body ul.card-notifications").append(allNotificationsContent);
          
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
