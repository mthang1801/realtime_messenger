
$(document).ready(function () {
  $("#modalGroupChat").on("shown.bs.modal", function(){
    $("#input-search-friends-add-new-group").focus();
    $("#input-search-friends-add-new-group").off("keyup").on("keyup", function(){
      let value = $(this).val();
      if(value != ""){
        $("#current-list-users").find("li").each( function(index, elem){
          let match = new RegExp(value,"i");
          if(match.test($(this).find(".list-users-item__info-username").text().trim())){
            $(this).css("display","block");
          }else{
            $(this).css("display", "none");
          }
        })
      }else{
        $("#current-list-users").find("li").each( function(index, elem){
          $(this).css("display", "block")
        })
      }
    
    });
  })
});