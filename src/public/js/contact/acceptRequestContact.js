function acceptRequestAddContact(){
  $(".btn-accept-request-contact").off("click").on("click", function(){
    let userId = $(this).data("uid");
    $.ajax({
      type: "put",
      url: "/contact/accept-request-contact-received",
      data: {userId},
      success: function (data) {   
       if(data.success){        
          let {user, contact, notificationId} = data.data; 
          console.log(user)             ;
          console.log(contact);
          //decrese number request contact received
          decreaseCountContactNumber("count-request-contact-received");
          //incrase number of contacts at contact panel
          increaseCountContactNumber("count-contact-users");
          //decrease number notification count
          decreaseNotificationNumber("contact-count");
          //remove item at request-contact-received panel
          $("#link-request-contact-received ul.request-contact-received-list").find(`li[data-uid = ${user._id}]`).remove();          
          //remove item at search contact 
          $("#search-users-box ul.search-users-box__list-users").find(`li[data-uid = ${user._id}]`).remove();
          //remove modal notification item 
          $(`#modalUserInfor-${user._id}`).modal("hide");
          $(`#modalUserInfor-${user._id}`).on("hidden.bs.modal", function(){
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            $(`#modalUserInfor-${user._id}`).remove();
          })
          //#region create new item at contact panel
          let contactHTML = `
          <li class="contact-list__item" data-uid="${user._id}">
            <div class="card-user">
              <div class="card-user__body">
                <div class="card-user__body-avatar">
                  <img src="images/users/${user.avatar}" class="card-user__body-avatar--image">
                </div>
                <div class="card-user__body-text">
                  <div class="card-user__body-text--username">
                    ${user.username}
                  </div>
                  <div class="card-user__body-text-address">
                    ${user.address ? user.address : ""}
                  </div>
                </div>
              </div>
              <div class="card-user__footer">
                <button class="btn btn-success btn-sm btn-chat" data-uid="${user._id}">Trò Chuyện</button>
                <button class="btn btn-danger btn-sm btn-remove-contact" data-uid="${user._id}">Xóa Quan hệ bạn bè</button>
              </div>
            </div>
          </li>
          `;
          $("#contacts ul.contact-list").append(contactHTML);
          //#endregion
          
          //#region create new user contact at left Side
          let timer = getTimelineOfNotificationItem(contact.updatedAt)
          let userContactLeftSideHTML =` 
            <li class="list-messenger-users__item" data-uid=${user._id}>
              <div class="list-messenger-users__item-avatar">
                <img src="images/users/${user.avatar}" title="${user.username}" alt="${user.username}" class="list-messenger-users__item-avatar-image">
              </div>
              <div class="list-messenger-users__item-text">
                <div class="list-messenger-users__item-text--username">
                  ${user.username}
                </div>
                <div class="list-messenger-users__item-text--chat">
                  
                </div>						
              </div>
              <div class="list-messenger-users__item-timer">
                ${timer}
              </div>
            </li>											
          `;
          $("#left-side").find("ul.list-messenger-users").prepend(userContactLeftSideHTML);
          //#endregion
          //create notify accept successfully
          alertify.notify(`${user.username} đã được thêm vào danh sách liên lạc`, "success", 7);
          //solve LeftSide and RightSide

          //create socket 
          socket.emit("accept-request-contact-received", {userId, updatedAt: contact.updatedAt, notificationId});

          removeCurrentContact();
       }
      },
      error : function (error) {
        console.log(error);
      }
    });
  })
};

socket.on("response-accept-request-contact-received", user => { 
  //notify user has accepted
  alertify.notify(`${user.username} đã chấp nhận lời mời kết bạn của bạn`, "success", 7);
  //#region embed accept notification on dashboard
  let timer = getTimelineOfNotificationItem(user.contactUpdateAt);  
  let notificationItemHTML =`
  <li class="card-notifications__item card-unread" data-notification-uid="${user.notificationId}" data-uid="${user._id}">
    <div class="card-notifications__avatar">
      <img src="images/users/${user.avatar}" class="card-notifications__avatar-image">
    </div>
    <div class="card-notifications__text">
      <div class="card-notifications__text--primary">
        <span class="card-notifications__text--primary--username">
          ${user.username}
        </span>
        <span class="Card-notifications__text--primary--content">
          đã chấp nhận lời mời kết bạn của bạn
        </span>
      </div>
      <div class="card-notifications__text--sub">
        ${timer }
      </div>
    </div>
  </li>
  `;
  $("#notification-dashboard-body").find("ul.card-notifications").prepend(notificationItemHTML);
  //#endregion
  //increse number notification up 1
  increaseNotificationNumber("notification-bell-count");
  //decrese number notification from contact down 1 because it move to contact list
  decreaseNotificationNumber("contact-count");
  //decrease number contact-request-sent 1 and remove it out of request-contact panel
  decreaseCountContactNumber("count-request-contact-sent");
  //incrase number of contacts at contact panel
  increaseCountContactNumber("count-contact-users")  
  $("#link-request-contact-sent ul.request-contact-sent-list").find(`li[data-uid = ${user._id}]`).remove();
  //remove item at search contact 
  $("#search-users-box ul.search-users-box__list-users").find(`li[data-uid = ${user._id}]`).remove();
  //#region create new item at contact panel
  let contactHTML = `
  <li class="contact-list__item" data-uid="${user._id}">
    <div class="card-user">
      <div class="card-user__body">
        <div class="card-user__body-avatar">
          <img src="images/users/${user.avatar}" class="card-user__body-avatar--image">
        </div>
        <div class="card-user__body-text">
          <div class="card-user__body-text--username">
            ${user.username}
          </div>
          <div class="card-user__body-text-address">
            ${user.address ? user.address : ""}
          </div>
        </div>
      </div>
      <div class="card-user__footer">
        <button class="btn btn-success btn-sm btn-chat" data-uid="${user._id}">Trò Chuyện</button>
        <button class="btn btn-danger btn-sm btn-remove-contact" data-uid="${user._id}">Xóa Quan hệ bạn bè</button>
      </div>
    </div>
  </li>
  `;
  $("#contacts ul.contact-list").append(contactHTML);
  //#endregion
   //solve LeftSide and RightSide
   //#region create new User Contact at LeftSide
   let userContactLeftSideHTML =` 
      <li class="list-messenger-users__item" data-uid=${user._id}>
        <div class="list-messenger-users__item-avatar">
          <img src="images/users/${user.avatar}" title="${user.username}" alt="${user.username}" class="list-messenger-users__item-avatar-image">
        </div>
        <div class="list-messenger-users__item-text">
          <div class="list-messenger-users__item-text--username">
            ${user.username}
          </div>
          <div class="list-messenger-users__item-text--chat">
            
          </div>						
        </div>
        <div class="list-messenger-users__item-timer">
          ${timer}
        </div>
      </li>											
    `;
    $("#left-side").find("ul.list-messenger-users").prepend(userContactLeftSideHTML);
   removeCurrentContact();
   eventNotificationItem();
})

$(document).ready(function () {
  acceptRequestAddContact();
});