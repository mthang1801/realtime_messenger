// when user click see-all-notification, it will show
function readAllNotifications(){
  $("#see-all-notifications").off("click").on("click", function(){
    let modalTarget = $(this).attr("href");
    $(`${modalTarget}`).modal("show");
    $.ajax({
      type: "get",
      url: "/notification/read-all",
      success: function (data) {
        let ul = $("<ul></ul>");
        ul.attr({"class": "read-all-notifications__list", "list-style": "none"});
        ul.append(data);        
        ul.find("li, div, span").css({"fontSize" : "1em"})
        ul.find("li").css({"width" : "90%", "margin" : "auto", "marginBottom" : ".5rem"})
        ul.find("li").addClass("read-all-notifications__item")
        $("#read-all-notifications-modal-body").append(ul);
       
        eventNotificationItem();
      },
      error : function(error){
        console.log(error);
      }
    });
  })
}

$(document).ready(function () {
  readAllNotifications();
  $("#modalNotificationExtense").on("hidden.bs.modal", function(){
    $(".modal-backdrop").remove();
  })
});
