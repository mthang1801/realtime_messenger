socket.emit("check-status");

socket.on("server-send-list-users-online", listUsersId => {    
  listUsersId.forEach( userId => {
    $(`.person[data-chat = ${userId}]`).find(".person__avatar").addClass("avatar-online");
    $(`.person[data-chat = ${userId}]`).find(".person__avatar--dot").addClass("online");
    $(`.person[data-chat = ${userId}]`).attr("data-last-online", "-1");
    $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar").addClass("avatar-online");
    $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar--dot").addClass("online");
    $(`.list-group-members-item[data-uid= ${userId}]`).find(".list-group-members-item__avatar").addClass("avatar-online");
    $(`.list-group-members-item[data-uid= ${userId}]`).find(".list-group-members-item__avatar-dot").addClass("online");
    $(`#to-${userId}`).find(".right-side__top--leftside-avatar").addClass("avatar-online");
    $(`#to-${userId}`).find(".right-side__top--leftside-avatar--dot").addClass("online");
    $(`#to-${userId}`).find(".right-side__top--leftside-status").text("Vừa mới truy cập");
  })
});

socket.on("server-send-new-user-is-online" , userId => { 
  $(`.person[data-chat = ${userId}]`).find(".person__avatar").addClass("avatar-online");
  $(`.person[data-chat = ${userId}]`).find(".person__avatar--dot").addClass("online");
  $(`.person[data-chat = ${userId}]`).attr("data-last-online", "-1");
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar").addClass("avatar-online");
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar--dot").addClass("online");
  $(`.list-group-members-item[data-uid= ${userId}]`).find(".list-group-members-item__avatar").addClass("avatar-online");
    $(`.list-group-members-item[data-uid= ${userId}]`).find(".list-group-members-item__avatar-dot").addClass("online");
  $(`#to-${userId}`).find(".right-side__top--leftside-avatar").addClass("avatar-online");
  $(`#to-${userId}`).find(".right-side__top--leftside-avatar--dot").addClass("online");
  $(`#to-${userId}`).find(".right-side__top--leftside-status").text("Vừa mới truy cập");
});


socket.on("server-send-user-is-offline" , userId  => {
  console.log(userId);
  $(`.person[data-chat = ${userId}]`).find(".person__avatar").removeClass("avatar-online");
  $(`.person[data-chat = ${userId}]`).find(".person__avatar--dot").removeClass("online");
  $(`.person[data-chat = ${userId}]`).attr("data-last-online", Date.now());
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar").removeClass("avatar-online");
  $(`.contact-list__item[data-uid = ${userId}]`).find(".card-user__body-avatar--dot").removeClass("online");
  $(`.list-group-members-item[data-uid= ${userId}]`).find(".list-group-members-item__avatar").removeClass("avatar-online");
    $(`.list-group-members-item[data-uid= ${userId}]`).find(".list-group-members-item__avatar-dot").removeClass("online");
  $(`#to-${userId}`).find(".right-side__top--leftside-avatar").removeClass("avatar-online");
  $(`#to-${userId}`).find(".right-side__top--leftside-avatar--dot").removeClass("online");
  $(`#to-${userId}`).find(".right-side__top--leftside-status").text("Vừa mới offline"); 
});


$( window ).off("upload").on("unload" , function() {    
  let url = "/user/update-user-has-been-offline";
  let data = "";
  navigator.sendBeacon(url, data)
});

$(document).ready(function () {
  socket.emit("new-user-is-online");

  
});
