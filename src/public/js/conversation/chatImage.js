function bufferToBase64(buffer){
  return btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

function convertTimerTitleMessenger(timeStamp){
  if(!timeStamp){
    return "";
  }
  return moment(timeStamp).locale("vi").format("LLLL");
}

function chatImage(targetId){
  $(`#image-chat-${targetId}`).off("change").on("change", function(){
    let fileData = $(this).prop("files")[0];
    console.log(fileData)
    let match = ["image/png", "image/jpg", "image/jpeg"];
    let maxSize = 1024*1024;
    if($.inArray(fileData.type, match)==-1){
      alertify.notify("File hình ảnh phải có đuôi png, jpg hoặc jpeg", "error", 7);
      return false ;
    }
    if(fileData.size > maxSize){
      alertify.notify("Kích thước file quá lớn", "error", 7);
      return false ;
    }
    let messengerFormData = new FormData();
    messengerFormData.append("msg-image-chat", fileData);
    messengerFormData.append("targetId" , targetId);
    let isGroup = false;
    if($(this).hasClass("chat-in-group")){
      messengerFormData.append("isChatGroup", true)
      isGroup = true ;
    };

    $.ajax({
      type: "post",
      url: "/conversation/chat-image",
      data: messengerFormData,
      cache : false,
      processData: false ,
      contentType: false ,
      global : false ,
      success: function (data) {       
        let message = data ; 
        let myMessageOuter = $(`<div class="right-side__middle-content--me bubble" title="${convertTimerTitleMessenger(message.createdAt)}" data-message-id="${message._id}"></div>`);
        let myAvatar = `<img src="images/users/${message.sender.avatar}" class="right-side__middle-content-avatar right-side__middle-content-avatar--me" >`;
        let myImageMessage = ` 
        <span data-message-id="${message._id}" >
          <img src="data:${message.file.contentType};base64,${bufferToBase64(message.file.data.data)}" class="show-image-file">
        </span> `;
        myMessageOuter.html(`${myAvatar} ${myImageMessage}`);
         //2 : append message at right side
        $(`.right-side__middle-content[data-chat = ${targetId}]`).append(myMessageOuter);
         //3 :resize niceScroll
         $(`.right-side__middle-content[data-chat = ${targetId}]`).getNiceScroll().resize();
         niceScrollChatBox(targetId);
        switchTabConversation();
        
        //4: change person(group) info messenger and time
        $(`.person[data-chat = ${targetId}]`).find(".person__infor--messenger").css("color", "#4A4A4A").html(`Tệp hình ảnh`);
        $(`.person[data-chat = ${targetId}]`).find(".person__config--time").css({"color": "#4A4A4A", "fontWeight" : "400", "fontSize": ".8rem","opacity" : ".8"}).text( convertDateTimeMessenger(message.createdAt));
        $(`.person[data-chat = ${targetId}]`).on("pushConversationItemToTop", function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("pushConversationItemToTop");
        });
        $(`.person[data-chat = ${targetId}]`).trigger("pushConversationItemToTop");
        let dataToEmit = { targetId , message};
       
        if(isGroup){
          dataToEmit.groupId = targetId ; 
          socket.emit("send-messenger-image-group", dataToEmit);
        }else{
          socket.emit("send-messenger-image", dataToEmit);    
                 
        }            
         //increase new number message more than current message is 1
         updateNumberOfMessages(targetId);
         checkStatusConversation(dataToEmit);
         //update modal image
         let imageItem = $(`<img src="data:${message.file.contentType};base64,${bufferToBase64(message.file.data.data)}" title="${message.file.fileName}" data-image-id="${message._id}">`)  
         $(`#modalImage-${targetId}`).find(".all-images").append(imageItem);         
         photoSetGrid();
      },
      error : function(error){
        alerttify.notify(error.responseText, "error", 7);
      }
    });
  })
}


$(document).ready(function () {

  socket.on("response-send-messenger-image", message => {
    let yourMessageOuter = $(`<div class="right-side__middle-content--you bubble" title="${convertTimerTitleMessenger(message.createdAt)}" data-message-id="${message._id}"></div>`);
    let yourAvatar = `<img src="images/users/${message.sender.avatar}" class="right-side__middle-content-avatar right-side__middle-content-avatar--you" >`;
    let yourImageMessage = ` 
    <span data-message-id="${message._id}" >
      <img src="data:${message.file.contentType};base64,${bufferToBase64(message.file.data.data)}" class="show-image-file">
    </span> `;
    yourMessageOuter.html(`${yourAvatar} ${yourImageMessage}`);
    //2 : append message at right side
    $(`.right-side__middle-content[data-chat = ${message.senderId}]`).append(yourMessageOuter);
    //3 :resize niceScroll
    $(`.right-side__middle-content[data-chat = ${message.senderId}]`).getNiceScroll().resize();
    $(`.right-side__middle-content[data-chat = ${message.senderId}]`).getNiceScroll().resize();
    niceScrollChatBox(message.senderId);
    switchTabConversation();
    //4: change person(group) info messenger and time
    $(`.person[data-chat = ${message.senderId}]`).find(".person__infor--messenger").css("color", "#4A4A4A").html(`Tệp hình ảnh`);
    $(`.person[data-chat = ${message.senderId}]`).find(".person__config--time").css({"color": "#4A4A4A", "fontWeight" : "400", "fontSize": ".8rem","opacity" : ".8"}).text( convertDateTimeMessenger(message.createdAt));
    $(`.person[data-chat = ${message.senderId}]`).on("pushConversationItemToTop", function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("pushConversationItemToTop");
    });
    $(`.person[data-chat = ${message.senderId}]`).trigger("pushConversationItemToTop");

    //update modal image
    let imageItem = $(`<img src="data:${message.file.contentType};base64,${bufferToBase64(message.file.data.data)}" title="${message.file.fileName}" data-image-id="${message._id}">`)  
    $(`#modalImage-${message.senderId}`).find(".all-images").append(imageItem);    
    photoSetGrid();
  })

  socket.on("response-send-messenger-image-group", message => {
    console.log(message);
    let yourMessageOuter = $(`<div class="right-side__middle-content--you bubble" title="${convertTimerTitleMessenger(message.createdAt)}" data-message-id="${message._id}"></div>`);
    let yourAvatar = `<img src="images/users/${message.sender.avatar}" class="right-side__middle-content-avatar right-side__middle-content-avatar--you" >`;
    let yourImageMessage = ` 
    <span data-message-id="${message._id}" >
      <img src="data:${message.file.contentType};base64,${bufferToBase64(message.file.data.data)}" class="show-image-file">
    </span> `;
    yourMessageOuter.html(`${yourAvatar} ${yourImageMessage}`);
    //2 : append message at right side
    $(`.right-side__middle-content[data-chat = ${message.receiverId}]`).append(yourMessageOuter);
    //3 :resize niceScroll
    $(`.right-side__middle-content[data-chat = ${message.receiverId}]`).getNiceScroll().resize();
    niceScrollChatBox(message.receiverId);
    switchTabConversation();
    //4: change person(group) info messenger and time
    $(`.person[data-chat = ${message.receiverId}]`).find(".person__infor--messenger").css("color", "#4A4A4A").html(`Tệp hình ảnh`);
    $(`.person[data-chat = ${message.receiverId}]`).find(".person__config--time").css({"color": "#4A4A4A", "fontWeight" : "400", "fontSize": ".8rem","opacity" : ".8"}).text( convertDateTimeMessenger(message.createdAt));
    $(`.person[data-chat = ${message.receiverId}]`).on("pushConversationItemToTop", function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("pushConversationItemToTop");
    });
    $(`.person[data-chat = ${message.receiverId}]`).trigger("pushConversationItemToTop");
    //update modal image
    let imageItem = $(`<img src="data:${message.file.contentType};base64,${bufferToBase64(message.file.data.data)}" title="${message.file.fileName}" data-image-id="${message._id}">`)  
    $(`#modalImage-${message.receiverId}`).find(".all-images").append(imageItem);
    
    photoSetGrid();
  })
});
