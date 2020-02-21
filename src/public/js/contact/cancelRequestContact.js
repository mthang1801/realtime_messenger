function cancelRequestAddContact(){
  $(".btn-cancel-request-contact-sent").off("click").on("click", function(){
    let contactId = $(this).data("uid");
    $.ajax({
      type: "delete",
      url: "/contact/remove-add-contact",
      data: {contactId : contactId},
      success: function (response) {
        if(response.success){
          $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${contactId}]`).hide("fast");
          $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${contactId}]`).hide("fast");
          $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${contactId}]`).hide("fast");          
          $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${contactId}]`).show("fast");
          
          decreaseCountContactNumber("count-request-contact-sent");
          socket.emit("remove-add-new-contact", {contactId});
          //remove this html element in request-contact-sent-box at nav Contact
          $("#link-request-contact-sent ul.request-contact-sent-list").find(`li.request-contact-sent-list__item[data-uid = ${contactId}]`).remove();
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  })
};

socket.on("response-remove-add-new-contact", function(user){
  console.log(user);
  decreaseNotificationNumber("notification-contact-count");
  decreaseCountContactNumber("count-request-contact-received");
  $("#link-request-contact-received ul.request-contact-received-list").find(`li.request-contact-received-list__item[data-uid = ${user._id}]`).remove();
})

$(document).ready(function () {
  cancelRequestAddContact();
});
