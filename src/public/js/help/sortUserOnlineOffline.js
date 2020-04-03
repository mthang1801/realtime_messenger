//sort at contact modal
function sortContactOnlineOffline(){
  let listUsersOnline = [];
  $("#contacts ul.contact-list").find("li").each( function(index, elem ){
    if($(this).find("div.card-user__body-avatar").hasClass("avatar-online")){
      listUsersOnline.push($(this).data("uid"))
    }
  })
  //reverse array  in order to prepend each item by order
  listUsersOnline = listUsersOnline.reverse();
  
  listUsersOnline.forEach( userId => {
    let dataToMove = $("#contacts ul.contact-list").find(`li[data-uid = ${userId}]`);
    dataToMove.closest("ul").prepend(dataToMove);
  })
}

//sort at group chat setting 