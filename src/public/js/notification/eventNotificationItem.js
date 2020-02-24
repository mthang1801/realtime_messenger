//create event "click" when user click notification item at dashboard notification
function eventNotificationItem(){  
  $(".card-notifications__item ").off("click").on("click", function(){       
    let notificationId = $(this).data("notification-uid");
    let senderId = $(this).data("uid");           
    $(this).attr({"data-toggle": "modal", "data-target" : `#modalUserInfor-${senderId}`});
    $(this).removeClass("card-unread");
    $.ajax({
      type: "get",
      url: `/notification/info?senderId=${senderId}&id=${notificationId}`,
      success: function (data) {
        if(data){         
          $("body").find(`#modalUserInfor-${senderId}`).remove();
          $("body").append(data);

          $(`#modalUserInfor-${senderId}`).modal("show");   
          $("#notification-board").hide();
          addContact();
          acceptRequestAddContact();   
          rejectRequestAddContact();
          cancelRequestAddContact();            
        }
      },
      error : function(error){
        console.log(error.responseText);
      }
    });
  })
};

$(document).ready(function () {
  eventNotificationItem();    
});
