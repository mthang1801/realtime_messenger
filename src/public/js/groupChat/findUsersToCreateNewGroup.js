function findUsersToCreateNewGroup(event){
  if(event.which == 13 || event.type == "click"){
    $("#list-users-searching").empty();    
    let searchKey = $("#search-users-new-group").val();
    if(searchKey == "") {
      $("#list-users-searching").empty();    
      return false ;
    }
  
    $.ajax({
      type: "get",
      url: `/group-chat/search-users?searchKey=${searchKey}`,
      global : false ,
      beforeSend : function(){
        $("#list-users-searching").append(`<div class="loading-search-user-new-group"><div></div><div></div><div></div></div>`);
      },
      success: function (data) {
        $("#list-users-searching").find(".loading-search-user-new-group").remove();
        $("#list-users-searching").append(data);
        addUserIntoNewGroup();
        removeUserOutOfNewGroup();        
      },
      error : function(error){
        console.log(error);
      }
    });
  }
}


$(document).ready(function () {
  $("#search-users-new-group").off("keyup").on("keyup", findUsersToCreateNewGroup);
  $("#btn-search-users-new-group").off("click").on("click", findUsersToCreateNewGroup);

  $("#modalGroupChat").on("shown.bs.modal", function(){
    $("#search-users-new-group").focus();
    $("#btn-create-new-group").attr("disabled", "disabled");
    createGroupChat();
  })

  $("#modalGroupChat").on("hidden.bs.modal", function(){
    $("#list-users-group").empty();
    $("#list-users-searching").empty();
    $("#search-users-new-group").val("");  
  })
});