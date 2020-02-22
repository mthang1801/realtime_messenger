//section reject add contact
function rejectRequestAddContact(){
  $(".btn-reject-request-contact").off("click").on("click", function(){
    let userId = $(this).data("uid");   
    $.ajax({
      type: "delete",
      url: "/contact/reject-request-contact",
      data: {userId},
      success: function (data) {        
        if(data.success){
          $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${userId}]`).show();
          $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${userId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${userId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${userId}]`).hide();  
          
          $("#link-request-contact-received ul.request-contact-received-list").find(`li.request-contact-received-list__item[data-uid = ${userId}]`).remove();
          decreaseCountContactNumber("count-request-contact-received");          
          socket.emit("reject-request-add-contact", {userId});
          addContact(); //when user search users contact , it allows click add contact
        }
      },
      error : function(error){
        console.log(error);
      }
    });
  })
};

socket.on("response-reject-request-add-contact", contactId =>{
  $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${contactId}]`).show();
  $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${contactId}]`).hide();
  $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${contactId}]`).hide();
  $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${contactId}]`).hide();
  //remove out of request contact sent
  $("#link-request-contact-sent ul.request-contact-sent-list").find(`li.request-contact-sent-list__item[data-uid = ${contactId}]`).remove();

  decreaseCountContactNumber("count-request-contact-sent");
  decreaseNotificationNumber("contact-count");
  addContact();
})

$(document).ready(function () {
  rejectRequestAddContact();
});
