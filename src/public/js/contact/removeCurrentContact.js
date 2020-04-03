//Remove current User in list contact
function removeCurrentContact(){
  $(".btn-remove-contact").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    let username = $(this).closest("li").find(".card-user__body-text--username").text().trim();
    Swal.fire({
      icon : "error", 
      html : `<h3>Xóa liên lạc với <span style="color:#c0392b;font-weight:bold">${username}</span></h3>`,
      showCancelButton : true ,
      cancelButtonText : "Quay lại",
      confirmButtonText : "Xóa", 
      confirmButtonColor : "#E1141E",
      cancelbuttonColor : "#007bff",      
      width : "40%",
      reverseButtons : true
    }).then( result => {
      if(result.value){
        $.ajax({
          type: "delete",
          url: "/contact/remove-contact",
          data: {targetId},
          success: function (data) {
            if(data){
              //decrese number of contact in contact panel
              decreaseCountContactNumber("count-contact-users");
              //remove out of contact list
              $("#contacts ul.contact-list").find(`li[data-uid = ${targetId}]`).remove();
               //remove user contact at leftSide
              $(".left-side-conversations__content-list").find(`a.person[data-chat = ${targetId}]`).parent().remove();
              //remove user contact at rightSide
              $(`#to-${targetId}`).remove();
              if( !$(".screen-chat").find(".tab-pane").hasClass("active")){
                $(".initial-conversation").show();
              }
              //remove user at create new group modal                        
              $("#current-list-users").find(`li[data-chat = ${targetId}]`).remove();          
              socket.emit("remove-current-contact", {targetId});
            }
          },
          error : function(error){
            console.log(error);
          }
        });
      }
    })
  });  
};

socket.on("response-remove-current-contact", user => {
  console.log(user);
  //decrese number of contact in contact panel
  decreaseCountContactNumber("count-contact-users");
  //remove out of contact list
  $("#contacts ul.contact-list").find(`li[data-uid = ${user._id}]`).remove();
  //remove user contact at leftSide
  $(".left-side-conversations__content-list").find(`a.person[data-chat = ${user._id}]`).parent().remove();
  //remove user contact at rightSide
  $(`#to-${user._id}`).remove();
   //remove user at create new group modal                        
   $("#current-list-users").find(`li[data-chat = ${user._id}]`).remove();          
  if( !$(".screen-chat").find(".tab-pane").hasClass("active")){
    $(".initial-conversation").show();
  }
  switchTabConversation();
});

$(document).ready(function () {
  removeCurrentContact();
});
