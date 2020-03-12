socket.emit("check-status");

socket.on("server-send-list-users-online", listUsersId => {
  console.log(listUsersId);
  listUsersId.forEach( userId => {
    $(`.person[data-chat = ${userId}]`).find(".person__avatar").addClass("avatar-online");
    $(`.person[data-chat = ${userId}]`).find(".person__avatar--dot").addClass("online");
    $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar").addClass("avatar-online");
    $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar--dot").addClass("online");
  })
});

socket.on("server-send-new-user-is-online" , userId => { 
  $(`.person[data-chat = ${userId}]`).find(".person__avatar").addClass("avatar-online");
  $(`.person[data-chat = ${userId}]`).find(".person__avatar--dot").addClass("online");
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar").addClass("avatar-online");
    $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar--dot").addClass("online");
});

socket.on("server-send-user-is-offline" , userId  => {
  console.log(userId);
  $(`.person[data-chat = ${userId}]`).find(".person__avatar").removeClass("avatar-online");
  $(`.person[data-chat = ${userId}]`).find(".person__avatar--dot").removeClass("online");
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar").removeClass("avatar-online");
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar--dot").removeClass("online");
})


$(document).ready(function () {
  socket.emit("new-user-is-online");
});
