function filterUsersCreateNewGroup(targetId){
  let listCurrentId = [];

  $("#list-users-group").find("li").each( function(index, elem ){
    listCurrentId.push($(this).data("chat"));
  });

  if($.inArray(targetId, listCurrentId) == -1){
    return true;
  }
  return false ;
}