function removeUserOutOfNewGroup(){
  $(".list-users-item__button-remove").off("click").on("click", function(){
    let targetId = $(this).data("chat");
    let outerHTML = $(this).closest("li")[0].outerHTML;    
    $(this).closest("li").remove();
    if(!$("#list-users-group").children().length){
      $("#btn-create-new-group").attr("disabled","disabled");
    }

    let currentContactListId = [];
    //get contact list from contact modal
    $("ul.contact-list").find("li").each( function(index, elem){
      currentContactListId.push($(this).data("uid"));
    })
    console.log($.inArray(targetId, currentContactListId))
    if($.inArray(targetId, currentContactListId) == -1){
      $("#list-users-searching").prepend(outerHTML);
      $("#list-users-searching").find(`li[data-chat= ${targetId}] .list-users-item__button-add`).css("display", "inline-block");
      $("#list-users-searching").find(`li[data-chat= ${targetId}] .list-users-item__button-remove`).css("display", "none");   
    }else{
      $("#current-list-users").prepend(outerHTML);
      $("#current-list-users").find(`li[data-chat= ${targetId}] .list-users-item__button-add`).css("display", "inline-block");
      $("#current-list-users").find(`li[data-chat= ${targetId}] .list-users-item__button-remove`).css("display", "none");   
    }
    
    
    addUserIntoNewGroup();
    
  })
}

$(document).ready(function () {
  removeUserOutOfNewGroup()
});