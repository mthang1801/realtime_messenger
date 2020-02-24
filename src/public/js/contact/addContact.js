//Request user to make friend
function addContact(){
  $(".btn-request-add-contact").off("click").on("click" , function(){    
    let contactId = $(this).data("uid");  
    console.log(contactId)  ;
    $.ajax({
      type: "post",
      url: "/contact/add-contact",
      data: {contactId : contactId},
      global : false ,
      success: function (response) {
        if(response.success){                  
          let {getContactInfo, contactCreatedAt, notificationId} = response.data ;          
          $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${contactId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${contactId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${contactId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${contactId}]`).show();          
          
          //show count-contact-request at nav
          increaseCountContactNumber("count-request-contact-sent");          
          //use socket to create realtime
          socket.emit("add-new-contact",{contactId, contactCreatedAt , notificationId});       
          //create card request-contact-sent html
          // #region create card-request-contact-html
          let cardRequestContactSentHTML = `
            <li class="request-contact-sent-list__item" data-uid="${getContactInfo._id}">
              <div class="card-user">
                <div class="card-user__body">
                  <div class="card-user__body-avatar">
                    <img src="images/users/${getContactInfo.avatar}" class="card-user__body-avatar--image">
                  </div>
                  <div class="card-user__body-text">
                    <div class="card-user__body-text--username">
                      ${getContactInfo.username}
                    </div>
                    <div class="card-user__body-text-address">
                      ${getContactInfo.address ? getContactInfo.address : ""}
                    </div>
                  </div>
                </div>
                <div class="card-user__footer">           
                  <button class="btn btn-danger btn-sm btn-cancel-request-contact-sent" data-uid="${getContactInfo._id}">Hủy yêu cầu</button>												
                </div>
              </div>
            </li>
          `;
          //#endregion
          
          //embed request-contact-sent-box at nav Contact
          $("#link-request-contact-sent").find("ul.request-contact-sent-list").prepend(cardRequestContactSentHTML);
          //after add contact, if we would like to cancel request , we embed cancel request function
          cancelRequestAddContact();                    
          removeCurrentContact();         
        
          $(`#modalUserInfor-${contactId}`).modal("hide");
          $(`#modalUserInfor-${contactId}`).on("hidden.bs.modal", function(){
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            $(`#modalUserInfor-${contactId}`).remove();
          })
          
        }
      },
      error : function(error){
        console.log(error);
      }
     
    });
  })
};

socket.on("response-add-new-contact", function(user){
  console.log(user);
  $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${user._id}]`).hide();
  $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${user._id}]`).show();
  $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${user._id}]`).show();
  $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${user._id}]`).hide();          
  increaseNotificationNumber("contact-count");
  increaseNotificationNumber("notification-bell-count");
  increaseCountContactNumber("count-request-contact-received");
  // #region create card-request-contact-receievd html
  let cardRequestContactReceivedHTML = `
  <li class="request-contact-received-list__item" data-uid="${user._id}">                
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
        <button class="btn btn-success btn-sm btn-accept-request-contact" data-uid="${user._id}">Chấp nhận</button>
        <button class="btn btn-danger btn-sm btn-reject-request-contact" data-uid="${user._id}">Từ chối</button>												
      </div>
    </div>                  
  </li>
  `;
  // #endregion
  //embed card-request-contact-received into parent box
  $("#link-request-contact-received").find("ul.request-contact-received-list").prepend(cardRequestContactReceivedHTML);

  //#region create card notification html 
  let timer = getTimelineOfNotificationItem(user.contactCreatedAt);  
  let cardNotificationHTML = `
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
          đã gửi cho bạn một lời mời kết bạn
        </span>
      </div>
      <div class="card-notifications__text--sub">
        ${timer }
      </div>
    </div>
  </li>
  ` ;
  //#endregion
  //embed card notification into box containing this one
  $("#notification-dashboard-body").find("ul.card-notifications").prepend(cardNotificationHTML);
  alertify.notify(`<b>${user.username}</b> đã gửi cho bạn một lời mời kết bạn`, "success", 5);
  eventNotificationItem();
  rejectRequestAddContact();
  acceptRequestAddContact();
  
})

