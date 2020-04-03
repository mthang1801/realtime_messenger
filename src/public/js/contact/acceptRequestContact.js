function convertTimerTitleMessenger(timeStamp){
  if(!timeStamp){
    return "";
  }
  return moment(timeStamp).locale("vi").format("LLLL");
}
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
          //group chat setting
          $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).find(".btn-reject-request-contact").remove();
          $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).find(".btn-accept-request-contact").remove();
          $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).append(`
            <button class="btn btn-sm btn-success btn-chat-member" data-uid="${user._id}">Nhắn tin</button>       
          `)  
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
          <li class="nav-item left-side-conversations__content-item" >
            <a class="nav-link person"  href="javascript:void(0)" data-target="#to-${user._id}" data-chat="${user._id}" id="left-side-${user._id}" >
              <div class="person__avatar">
                <span class="person__avatar--dot"></span>
                <img src="images/users/${user.avatar}" class="person__avatar-image" >
              </div>
              <div class="person__infor">
                <div class="person__infor--username">
                  ${user.username}
                </div>
                <div class="person__infor--messenger convert-emoji">
                  các bạn đã trở thành bạn bè của nhau
                </div>
              </div>
              <div class="person__config" data-uid="${ user._id }">                
                <div class="person__config--time" data-uid="${user._id}">${timer}</div>
                <div class="person__config--setting" >
                  <img src="images/icons/three_dots.png" class="person__config--setting-icon">
                </div>
                <div class="person__config--menu" data-uid="${user._id}">
                  <div class="remove-conversation">Xóa hội thoại</div>
                </div>
              </div>
            </a>
          </li>            
          `;
         
          //#endregion
          //create notify accept successfully
          alertify.notify(`${user.username} đã được thêm vào danh sách liên lạc`, "success", 7);
          //embed contact item into left side
          $("#all-conversations").find("ul.left-side-conversations__content-list").prepend(userContactLeftSideHTML);
          $("#private-conversations").find("ul.left-side-conversations__content-list").prepend(userContactLeftSideHTML);
          //embed contact item into right side
          //#region 
          let userContactRightSideHTML=`
          <div class="right-side__screen tab-pane" id="to-${user._id}" >
            <div class="right-side__top">
              <div class="right-side__top--leftside">
                <div class="right-side__top--leftside-avatar">
                  <div class="right-side__top--leftside-avatar--dot"></div>
                  <img src="images/users/${user.avatar}" alt="${user.avatar}" class="right-side__top--leftside-avatar--image"/>
                </div>
                <span class="right-side__top--leftside-username">
                  ${user.username}
                </span>
              </div>
              <div class="right-side__top--rightside">
                <span class="right-side__top--rightside-item">
                  <a href="#modalImage-${user._id}" data-toggle="modal" class="btn-link btn-dark-grey image-libraries" data-uid="${user._id}">Hình ảnh <i class="fas fa-image"></i></a>
                </span>
                <span class="right-side__top--rightside-item">
                  <a href="#modalAttachFile-${user._id}" data-toggle="modal" class="btn-link btn-dark-grey">Tệp đính kèm <i class="fas fa-paperclip"></i></a>
                </span>
              </div>
            </div>
            <div class="right-side__middle ">
              <div class="right-side__middle-content convert-emoji" data-chat="${user._id}">
              </div>
            </div>
            <div class="right-side__bottom convert-emoji" data-chat="${user._id}">
              <input type="text" class="right-side__bottom-write write-chat" id="chat-text-${user._id}" data-conversation-type="private"  data-chat="${user._id}" style="display:none">
              <div class="right-side__bottom-icons">
                <div class="right-side__bottom-icons-item" >
                  <a href="#" class="icon-chat"><i class="fas fa-smile"></i></a>
                </div>					
                <div class="right-side__bottom-icons-item">                  
                  <label for="image-chat-${user._id}" class="image-chat" data-chat="${user._id}"><input type="file" class="d-none" id="image-chat-${user._id}" name="msg-image-chat"><i class="fas fa-image"></i></label>
                </div>
                <div class="right-side__bottom-icons-item">                
                  <label for="attach-chat-${user._id}" data-chat="${user._id}">  <input type="file" class="d-none" id="attach-chat-${user._id}" name="msg-attachment-chat"><i class="fas fa-paperclip"></i></label>
                </div>
                <div class="right-side__bottom-icons-item">
                  <a href="javascript:void(0)"  data-toggle="modal" id="video-chat-${user._id}"><i class="fas fa-video"></i></a>
                </div>				
              </div>
            </div>
          </div>
          `
          $("#screen-chat").prepend(userContactRightSideHTML);
          switchTabConversation();      
          //#endregion

          //insert into list contact at create new group modal
          let userNewGroupChat =`
          <li class="list-users-item" data-chat="${user._id}">
            <div class="list-users-item__avatar">
              <img src="images/users/${user.avatar}" class="list-users-item__avatar-image">
            </div>
            <div class="list-users-item__info">
              <div class="list-users-item__info-username">
                ${user.username}
              </div>
              <div class="list-users-item__info-address">
                ${user.address ? user.address : ""}
              </div>
            </div>
            <div class="list-users-item__button">
            <button class="list-users-item__button-add" data-chat="${user._id}">Thêm vào nhóm</button>
            <button class="list-users-item__button-remove" data-chat="${user._id}">Xóa khỏi nhóm</button>
            </div>
          </li>
          `;         
          $("#current-list-users").append(userNewGroupChat);
          addUserIntoNewGroup();
          removeUserOutOfNewGroup();
          //create socket 
          socket.emit("accept-request-contact-received", {userId, updatedAt: contact.updatedAt, notificationId});
          socket.emit("check-status");
          

          chatWithMemberFromGroupChatSetting();
          switchTabConversation();      
          removeCurrentContact();
          eventNotificationItem();
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
  //group chat setting
  $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).find(".btn-cancel-request-contact-sent").remove();
  $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).append(`
    <button class="btn btn-sm btn-success btn-chat-member" data-uid="${user._id}">Nhắn tin</button>       
  `)  
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
   <li class="nav-item left-side-conversations__content-item" >
    <a class="nav-link person"  href="javascript:void(0)" data-target="#to-${user._id}" data-chat="${user._id}" id="left-side-${user._id}" >
      <div class="person__avatar">
        <span class="person__avatar--dot"></span>
        <img src="images/users/${user.avatar}" class="person__avatar-image" >
      </div>
      <div class="person__infor">
        <div class="person__infor--username">
          ${user.username}
        </div>
        <div class="person__infor--messenger convert-emoji">
          các bạn đã trở thành bạn bè của nhau
        </div>
      </div>
      <div class="person__config" data-uid="${ user._id }">                
        <div class="person__config--time" data-uid="${user._id}">${timer}</div>
        <div class="person__config--setting" >
          <img src="images/icons/three_dots.png" class="person__config--setting-icon">
        </div>
        <div class="person__config--menu" data-uid="${user._id}">
          <div class="remove-conversation">Xóa hội thoại</div>
        </div>
      </div>
    </a>
  </li>            
                
    `;
    $("#all-conversations").find("ul.left-side-conversations__content-list").prepend(userContactLeftSideHTML);
    $("#private-conversations").find("ul.left-side-conversations__content-list").prepend(userContactLeftSideHTML);

    //embed user to right side
    let userContactRightSideHTML=`
    <div class="right-side__screen tab-pane" id="to-${user._id}" >
      <div class="right-side__top">
        <div class="right-side__top--leftside">
          <div class="right-side__top--leftside-avatar">
            <div class="right-side__top--leftside-avatar--dot"></div>
            <img src="images/users/${user.avatar}" alt="${user.avatar}" class="right-side__top--leftside-avatar--image"/>
          </div>
          <span class="right-side__top--leftside-username">
            ${user.username}
          </span>
        </div>
        <div class="right-side__top--rightside">
          <span class="right-side__top--rightside-item">
            <a href="#modalImage-${user._id}" data-toggle="modal" class="btn-link btn-dark-grey image-libraries" data-uid="${user._id}">Hình ảnh <i class="fas fa-image"></i></a>
          </span>
          <span class="right-side__top--rightside-item">
            <a href="#modalAttachFile-${user._id}" data-toggle="modal" class="btn-link btn-dark-grey">Tệp đính kèm <i class="fas fa-paperclip"></i></a>
          </span>
        </div>
      </div>
      <div class="right-side__middle ">
        <div class="right-side__middle-content convert-emoji" data-chat="${user._id}">
        </div>
      </div>
      <div class="right-side__bottom convert-emoji" data-chat="${user._id}">
        <input type="text" class="right-side__bottom-write write-chat" id="chat-text-${user._id}" data-conversation-type="private"  data-chat="${user._id}" style="display:none">
        <div class="right-side__bottom-icons">
          <div class="right-side__bottom-icons-item">
            <a href="#" class="icon-chat"><i class="fas fa-smile"></i></a>
          </div>					
          <div class="right-side__bottom-icons-item">            
            <label for="image-chat-${user._id}" class="image-chat" data-chat="${user._id}"><input type="file" class="d-none" id="image-chat-${user._id}" name="msg-image-chat"><i class="fas fa-image"></i></label>
          </div>
          <div class="right-side__bottom-icons-item">
          <label for="attach-chat-${user._id}" data-chat="${user._id}">  <input type="file" class="d-none" id="attach-chat-${user._id}" name="msg-attachment-chat"><i class="fas fa-paperclip"></i></label>
          </div>
          <div class="right-side__bottom-icons-item">
            <a href="javascript:void(0)" data-toggle="modal" id="video-chat-${user._id}"><i class="fas fa-video"></i></a>
          </div>				
        </div>
      </div>
    </div>
    `

     //insert into list contact at create new group modal
     let userNewGroupChat =`
     <li class="list-users-item" data-chat="${user._id}">
       <div class="list-users-item__avatar">
         <img src="images/users/${user.avatar}" class="list-users-item__avatar-image">
       </div>
       <div class="list-users-item__info">
         <div class="list-users-item__info-username">
           ${user.username}
         </div>
         <div class="list-users-item__info-address">
           ${user.address ? user.address : ""}
         </div>
       </div>
       <div class="list-users-item__button">
       <button class="list-users-item__button-add" data-chat="${user._id}">Thêm vào nhóm</button>
       <button class="list-users-item__button-remove" data-chat="${user._id}">Xóa khỏi nhóm</button>
       </div>
     </li>
     `;         
     $("#current-list-users").append(userNewGroupChat);
     addUserIntoNewGroup();
     removeUserOutOfNewGroup();
     
    $("#screen-chat").prepend(userContactRightSideHTML);
    socket.emit("check-status");
    switchTabConversation();     
    chatWithMemberFromGroupChatSetting() ;
   removeCurrentContact();
   eventNotificationItem();
})

$(document).ready(function () {
  acceptRequestAddContact();
});