function addUserIntoNewGroup(){
  $(".list-users-item__button-add").off("click").on("click", function(){
    let targetId = $(this).data("chat");
    let outerHTML = $(this).closest("li")[0].outerHTML ; 
    $(this).closest("li").remove();
    if($("#current-list-users").find(`li[data-chat = ${targetId}]`).length){
      $("#current-list-users").find(`li[data-chat = ${targetId}]`).remove();
    };
    //after click add to new group, modal will be closed
    $("#modal-search-more-users").modal("hide");
    $("#input-search-users-new-group").val("");
   
    if(filterUsersCreateNewGroup(targetId)){
      $("#list-users-group").append(outerHTML);
      //callback filter user in order to prevent equivalent components appear in the same time
      
      if($("#list-users-group").children().length){
        $("#btn-create-new-group").attr("disabled", false);
      }else{
        $("#btn-create-new-group").attr("disabled","disabled");
      };
      $("#list-users-group").find(`li[data-chat = ${targetId}] .list-users-item__button-add`).css("display", "none");
      $("#list-users-group").find(`li[data-chat = ${targetId}] .list-users-item__button-remove`).css("display", "inline-block");
      removeUserOutOfNewGroup();
    }
   
    
  })
}


$(document).ready(function () {
  addUserIntoNewGroup();
});