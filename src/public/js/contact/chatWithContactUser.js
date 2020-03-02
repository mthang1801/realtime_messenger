//when click btn-chat, leftSide will prepend conversation 
function chatWithUserContact(){
  $(".btn-chat").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    let checkExistsConversationAtLeftSide =  $("ul.left-side-conversations__content-list").find(`.person[data-chat = ${targetId}]`).length;
    if(checkExistsConversationAtLeftSide)    {
      //prepend existed conversation to top at left side
      $(`.person[data-chat = ${targetId}]`).on("pushConversationToTop", function(){
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("pushConversationToTop");
      })
      $(`.person[data-chat = ${targetId}]`).trigger("pushConversationToTop");
      switchTabConversation();
      chatTextAndEmoji();
    }else{
      $.ajax({
        type: "get",
        url: `/conversation/get-user-conversation?userId=${targetId}`,
        success: function (data) {     
          let {user} = data ;
          console.log(user);
          $(".initial-conversation").hide();    
          $(".person").removeClass("active");
          $(".right-side__screen").removeClass("active");
          $(".left-side-conversations__content-list").prepend(data.userConversationLeftSide);
          $("#screen-chat").prepend(data.userConversationRightSide);
          
          $(".left-side-conversations__content-item").eq(0).find(".nav-link").click();
          enableEmojiChat(targetId); 
          $("#modalContact").modal("hide");
          $("#modalContact").on("hidden.bs.modal", function(){
          $(`.right-side__bottom[data-chat = ${targetId}]`).find(".emojionearea-editor").focus();            
            chatTextAndEmoji(targetId);
            chatImage(targetId);
            switchTabConversation();
          })
         
        }
      });
    }
  })
}

$(document).ready(function () {
  chatWithUserContact();
});
