//create event "click" when user click notification item at dashboard notification
function eventNotificationItem(){  
  $(".card-notifications__item ").off("click").on("click", function(){       
    let notificationId = $(this).data("notification-uid");
    let senderId = $(this).data("uid");  
    let isGroup = false;
    let groupId = "";
    if($(this).hasClass("notification-group")){
      isGroup = true ; 
      groupId = $(this).data("group-uid");
    }
   
    // let groupId = $(this).data("group-uid");
    $(this).attr({"data-toggle": "modal", "data-target" : `#modalUserInfor-${senderId}`});
    $(this).removeClass("card-unread");
    $.ajax({
      type: "get",
      url: `/notification/info?senderId=${senderId}&id=${notificationId}&isGroup=${isGroup}&groupId=${groupId}`,
      success: function (data) {
        let {dataRender, type} = data;
        console.log(dataRender);
        if(type=="private"){         
          $("body").find(`#modalUserInfor-${senderId}`).remove();
          $("body").append(dataRender);
          //decrease number of notification 
          decreaseNotificationNumber("notification-bell-count");
          $(`#modalUserInfor-${senderId}`).modal("show");   
          $("#notification-board").hide();
          addContact();
          acceptRequestAddContact();   
          rejectRequestAddContact();
          cancelRequestAddContact();            
        }else{
          $("body").find(`#modalGroupNotificationInfo-${groupId}`).remove();
          $("body").append(dataRender);
          decreaseNotificationNumber("notification-bell-count");
          $(`#modalGroupNotificationInfo-${groupId}`).modal("show");
          $("#notification-board").hide();
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
