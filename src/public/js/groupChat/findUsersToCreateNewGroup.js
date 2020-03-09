function findUsersToCreateNewGroup(event){
  if(event.which == 13 || event.type == "click"){
    $("#list-users-searching").empty();    
    let searchKey = $("#input-search-users-new-group").val();
    if(searchKey == "") {
      $("#list-users-searching").empty();    
      return false ;
    }
    let contactList = [];
    $("#current-list-users").find("li").each( function(index, elem ){
      contactList.push($(this).data("chat"));
    })

    $.ajax({
      type: "get",
      url: `/group-chat/search-users?searchKey=${searchKey}`,
      data : {contactList },
      global : false ,
      beforeSend : function(){
        $("#list-users-searching").append(`<div class="loading-search-user-new-group"><div></div><div></div><div></div></div>`);
      },
      success: function (data) {
        if(data){          
          $("#list-users-searching").append(data);
          addUserIntoNewGroup();
          removeUserOutOfNewGroup();        
        }else{
          $("#list-users-searching").append(`<li class="text-danger text-center mt-5"><h6><i class="far fa-dizzy"></i>Không tìm thấy người dùng này.</h6></li>`)
        }
        $("#list-users-searching").find(".loading-search-user-new-group").remove();        
      },
      error : function(error){
        console.log(error);
      }
    });
  }
}


$(document).ready(function () {
  //open modal box search public users 
  $("#btn-search-more-users").off("click").on("click", function(e){
    e.stopPropagation();
    $("#modal-search-more-users").modal("show");   
    $("#modalGroupChat").css("opacity", "0");
  });
  //when opening modal box search public users
  $("#input-search-users-new-group").off("keyup").on("keyup", findUsersToCreateNewGroup);
  $("#btn-search-users-new-group").off("click").on("click", findUsersToCreateNewGroup);

  $("#modalGroupChat").on("shown.bs.modal", function(){
    $("#input-search-users-new-group").focus();
    $("#btn-create-new-group").attr("disabled", "disabled");
    createGroupChat();
  })

  $("#modal-search-more-users").on("shown.bs.modal", function(){
    $("#input-search-users-new-group").focus();
  })
  $("#modal-search-more-users").on("hidden.bs.modal", function(e){   
    $("#modalGroupChat").css("opacity", "1");
  })

  $("#modalGroupChat").on("hidden.bs.modal", function(e){   ;         
    $("#input-search-users-new-group").val("");  
  })
});