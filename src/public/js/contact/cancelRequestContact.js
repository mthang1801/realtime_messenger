function cancelRequestAddContact(){
  $(".btn-cancel-request-contact-sent").off("click").on("click", function(){
    let contactId = $(this).data("uid");
    $.ajax({
      type: "delete",
      url: "/contact/remove-add-contact",
      data: {contactId : contactId},
      success: function (response) {
        if(response.success){
          $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${contactId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${contactId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${contactId}]`).hide();          
          $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${contactId}]`).show();
          //group chat setting
          $(`.list-group-members-item__button[data-contact-uid = ${contactId}]`).find(".btn-cancel-request-contact-sent").remove();
          $(`.list-group-members-item__button[data-contact-uid = ${contactId}]`).append(`
            <button class="btn btn-sm btn-primary btn-request-add-contact" data-uid="${contactId}">Kết bạn</button>    
          `);         
          decreaseCountContactNumber("count-request-contact-sent");
          decreaseNotificationNumber("contact-count");
          //remove this html element in request-contact-sent-box at nav Contact
          $("#link-request-contact-sent ul.request-contact-sent-list").find(`li.request-contact-sent-list__item[data-uid = ${contactId}]`).remove(); 
          $(`#modalUserInfor-${contactId}`).modal("hide");
          $(`#modalUserInfor-${contactId}`).on("hidden.bs.modal", function(){
            $("body").removeClass("modal-open");
            $(".modal-backdrop").remove();
            $(`#modalUserInfor-${contactId}`).remove();
          })          
          //remove user contact at leftSide
          $("#left-side ul.list-messenger-users").find(`li[data-uid = ${contactId}]`).remove();
          socket.emit("remove-add-new-contact", {contactId});
          addContact();
          eventNotificationItem();       
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  })
};

socket.on("response-remove-add-new-contact", function(user){  
  $(".search-users-box__list-users-item").find(`.btn-cancel-request-contact-sent[data-uid = ${user._id}]`).hide();
  $(".search-users-box__list-users-item").find(`.btn-reject-request-contact[data-uid = ${user._id}]`).hide();
  $(".search-users-box__list-users-item").find(`.btn-accept-request-contact[data-uid = ${user._id}]`).hide();          
  $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${user._id}]`).show();
  //group chat setting
  $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).find(".btn-accept-request-contact").remove();
  $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).find(".btn-reject-request-contact").remove();
  $(`.list-group-members-item__button[data-contact-uid = ${user._id}]`).append(`
    <button class="btn btn-sm btn-primary btn-request-add-contact" data-uid="${user._id}">Kết bạn</button>      
  `)  
  decreaseNotificationNumber("contact-count");
  decreaseCountContactNumber("count-request-contact-received");
  $("#link-request-contact-received ul.request-contact-received-list").find(`li.request-contact-received-list__item[data-uid = ${user._id}]`).remove();
  //remove user contact at left side
  $("#left-side ul.list-messenger-users").find(`li[data-uid = ${user._id}]`).remove();
  addContact();
})

$(document).ready(function () {
  cancelRequestAddContact();
});
