function removeUserOutOfNewGroup(){
  $(".list-users-item__button-remove").off("click").on("click", function(){
    let targetId = $(this).data("chat");
    let outerHTML = $(this).closest("li")[0].outerHTML;    
    $(this).closest("li").remove();
    if($("#list-users-group").children().length == 0){
      $(".form-new-group").css("display", "none");
    }
    $("#list-users-searching").prepend(outerHTML);
    $("#list-users-searching").find(`li[data-chat= ${targetId}] .list-users-item__button-add`).css("display", "inline-block");
    $("#list-users-searching").find(`li[data-chat= ${targetId}] .list-users-item__button-remove`).css("display", "none");   
    addUserIntoNewGroup();
    
  })
}

$(document).ready(function () {
  removeUserOutOfNewGroup()
});