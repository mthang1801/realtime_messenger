//Request user to make friend
function addContact(){
  $(".btn-request-add-contact").on("click" , function(){    
    let contactId = $(this).data("uid");    
    $.ajax({
      type: "post",
      url: "/contact/add-contact",
      data: {contactId : contactId},
      success: function (response) {
        if(response.success){
          $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${contactId}]`).hide();
          $(".search-users-box__list-users-item").find(`.btn-remove-request-add-contact[data-uid = ${contactId}]`).css("display", "inline-block");
          //show count-contact-request at nav
          increaseCountContactNumber("count-request-contact-sent");
        }
      },
      error : function(error){
        console.log(error);
      }
     
    });
  })
}

function removeAddContact(){
  $(".btn-remove-request-add-contact").off("click").on("click", function(){
    let contactId = $(this).data("uid");
    $.ajax({
      type: "delete",
      url: "/contact/remove-add-contact",
      data: {contactId : contactId},
      success: function (response) {
        if(response.success){
          $(".search-users-box__list-users-item").find(`.btn-request-add-contact[data-uid = ${contactId}]`).show();
          $(".search-users-box__list-users-item").find(`.btn-remove-request-add-contact[data-uid = ${contactId}]`).css("display", "none");
          decreaseCountContactNumber("count-request-contact-sent");
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  })
}