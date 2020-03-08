function createGroupChat(){
  $("#btn-create-new-group").off("click").on("click", function(){
    let listUsersId = [];
    let groupName = $("#input-create-new-group").val();
    if(groupName.length < 3 || groupName.length > 50){
      alertify.notify("Tên nhóm không hợp lệ",  "error", 7);
      $("#input-create-new-group").val("");
      return false ;
    }

    $("#list-users-group").find("li").each( function(index, elem){
      listUsersId.push($(this).data("chat"));
    });

    if(!listUsersId.length){
      alertify.notify("Để tạo nhóm cần ít nhất 1 thành viên", "error", 7 );
      return false ;
    }
    let data = { groupName, listUsersId};
    $.ajax({
      type: "post",
      url: "/group-chat/create-new-group-chat",
      data: data ,
      success: function (data) {
        let {groupChatLeftSide, groupChatRightSide, groupChatImageModal, groupChatAttachmentModal, group} = data ;         
        //left side
        $("#all-conversations").find("ul").prepend(groupChatLeftSide);      
        $("#group-conversations").find("ul").prepend(groupChatLeftSide);
       //  $("#group-conversations").find("ul").prepend(groupChatLeftSide);          
        //right side
        $("#screen-chat").append(groupChatRightSide);
        //image modal
        $("body").append(groupChatImageModal);
        //attachment modal
        $("body").append(groupChatAttachmentModal);
      
        $("#modalGroupChat").modal("hide");
        $(".initial-conversation").hide();
        $(".person").removeClass("active");
        $(".right-side__screen").removeClass("active");    
        $(`.person[data-chat = ${group._id}]`).click().addClass("active");
        $(`#to-${group._id}`).addClass("active");
        $(`#to-${group._id}`).getNiceScroll().resize();
        niceScrollChatBox(group._id);
        switchTabConversation();    
        enableEmojiChat(group._id);    
        chatTextAndEmoji(group._id) ;  
        chatImage(group._id);
        chatAttachment(group._id);
        receiverHasSeenMessage(group._id);  
        callVideo(group._id);
        photoSetGrid();

        socket.emit("create-new-group", data);
        socket.emit("check-status");

      },
      error : function(error){       
        error.responseJSON.forEach( err => {
          alertify.notify(err, "error" , 7);
        })
        
      }
    });
  })
}







$(document).ready(function () {
  createGroupChat();
  socket.on("response-create-new-group", data => {
    console.log(data);
    let {groupChatLeftSide, groupChatRightSide, groupChatImageModal, groupChatAttachmentModal, group} = data ;         
    //left side
    $("#all-conversations").find("ul.left-side-conversations__content-list").prepend(groupChatLeftSide);
    $("#group-conversations").find("ul.left-side-conversations__content-list").prepend(groupChatLeftSide);          
    //right side
    $("#screen-chat").append(groupChatRightSide);
    //image modal
    $("body").append(groupChatImageModal);
    //attachment modal
    $("body").append(groupChatAttachmentModal);
    //emit when member received group
    socket.emit("user-received-new-group", data );  
    //check status online
    socket.emit("check-status");
    // $(".initial-conversation").hide();
    // $(".person").removeClass("active");
    // $(".right-side__screen").removeClass("active");    
    // $(`.person[data-chat = ${group._id}]`).addClass("active");
    // $(`#to-${group._id}`).addClass("active");
    $(`#to-${group._id}`).getNiceScroll().resize();
    niceScrollChatBox(group._id);
    switchTabConversation();    
    enableEmojiChat(group._id);    
    chatTextAndEmoji(group._id) ;  
    chatImage(group._id);
    chatAttachment(group._id);
    receiverHasSeenMessage(group._id);  
    callVideo(group._id);
    photoSetGrid();
    
   
  })
});
