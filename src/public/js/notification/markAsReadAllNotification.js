function markAsReadAllNotification(){
  $("#btn-mark-as-read-all-notification").on("click", function(){
    $.ajax({
      type: "put",
      url: "/notification/mark-as-read-all-notifications",
      success: function (data) {
        if(data.success){
          console.log(data);
          $.get("/notification/get-notifications", function(response){
            $("#notification-dashboard-body").find("ul.card-notifications").empty().append(response.data);         
          })
        }
      },
      error : function(error){
        alertify.notify(error.responseText, "error", 7);
      }
    });
  })
}

$(document).ready(function () {
  markAsReadAllNotification();
});
