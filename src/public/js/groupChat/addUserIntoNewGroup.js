function addUserIntoNewGroup(){
  $(".list-users-item__button-add").off("click").on("click", function(){
    let targetId = $(this).data("chat");
    let outerHTML = $(this).closest("li")[0].outerHTML ; 
    $(this).closest("li").remove();
    $("#list-users-group").append(outerHTML);

    if($("#list-users-group").children().length){
      $("#btn-create-new-group").attr("disabled", false);
    }else{
      $("#btn-create-new-group").attr("disabled","disabled");
    }
    $("#list-users-group").find(`li[data-chat = ${targetId}] .list-users-item__button-add`).css("display", "none");
    $("#list-users-group").find(`li[data-chat = ${targetId}] .list-users-item__button-remove`).css("display", "inline-block");
    removeUserOutOfNewGroup();
    
  })
}


$(document).ready(function () {
  addUserIntoNewGroup();
});