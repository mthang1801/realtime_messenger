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
         socket.emit("check-status");
      },
      error : function(error){
        alerttify.notify(error.responseText, "error", 7);
      }
    });
  })
}


$(document).ready(function () {
  socket.on("response-send-messenger-image", message => {
    if(!$(`.person[data-chat = ${message.senderId}]`).length){
      //#region embed left side
       let leftSideConversation = `
       <li class="nav-item left-side-conversations__content-item" >
         <a class="nav-link person"  href="javascript:void(0)" data-target="#to-${message.senderId}" data-chat="${message.senderId}" >
           <div class="person__avatar">
             <span class="person__avatar--dot"></span>
             <img src="images/users/${message.sender.avatar}" class="person__avatar-image" >
           </div>
           <div class="person__infor">
             <div class="person__infor--username">
               ${message.sender.username}
             </div>
             <div class="person__infor--messenger convert-emoji">
               <span>Hình ảnh</span>
             </div>
           </div>
           <div class="person__config" data-uid="${message.senderId}">                 
             <div class="person__config--time" data-uid="${message.senderId}">
               ${convertDateTimeMessenger(message.createdAt)}
             </div>
             <div class="person__config--setting" >
               <img src="images/icons/three_dots.png" class="person__config--setting-icon">
             </div>
             <div class="person__config--menu" data-uid="${message.senderId}">
               <div class="remove-conversation">Xóa hội thoại</div>
             </div>
           </div>                 
         </a>
       </li>            
       `
       //#endregion
   
       $("#all-conversations").find("ul").append(leftSideConversation);
       $("#private-conversations").find("ul").append(leftSideConversation);
       $(".left-side").getNiceScroll().resize();
       switchTabConversation();
       //#region embed right side
       let rightSideConversation = `
       <div class="right-side__screen tab-pane" id="to-${message.senderId}" >
         <div class="right-side__top">
           <div class="right-side__top--leftside">
             To :
             <span class="right-side__top--leftside-username">
               ${message.sender.username}
             </span>
           </div>
           <div class="right-side__top--rightside">
             <span class="right-side__top--rightside-item">
               <a href="#modalImage-${message.senderId}" data-toggle="modal" class="btn-link btn-dark-grey image-libraries" data-uid="${message.senderId}">Hình ảnh <i class="fas fa-image"></i></a>
             </span>
             <span class="right-side__top--rightside-item">
               <a href="#modalAttachFile-${message.senderId}" data-toggle="modal" class="btn-link btn-dark-grey">Tệp đính kèm <i class="fas fa-paperclip"></i></a>
             </span>
           </div>
         </div>
         <div class="right-side__middle ">
           <div class="right-side__middle-content convert-emoji" data-chat="${message.senderId}">
          
           </div>
         </div>
         <div class="right-side__bottom convert-emoji" data-chat="${message.senderId}">
           <input type="text" class="right-side__bottom-write write-chat" id="chat-text-${message.senderId}" data-conversation-type="private"  data-chat="${message.senderId}" style="display:none">
           <div class="right-side__bottom-icons">
             <div class="right-side__bottom-icons-item">
               <a href="#" class="icon-chat"><i class="fas fa-smile"></i></a>
             </div>					
             <div class="right-side__bottom-icons-item">        
               <label for="image-chat-${message.senderId}" class="image-chat" data-chat="${message.senderId}"><input type="file" class="d-none" id="image-chat-${message.senderId}" name="msg-image-chat"><i class="fas fa-image"></i></label>
             </div>
             <div class="right-side__bottom-icons-item">
               <label for="attach-chat-${message.senderId}" data-chat="${message.senderId}">  <input type="file" class="d-none" id="attach-chat-${message.senderId}" name="msg-attachment-chat"><i class="fas fa-paperclip"></i></label>
             </div>
             <div class="right-side__bottom-icons-item">
               <a href="javascript:void(0)" data-toggle="modal" id="video-chat-${message.senderId}"><i class="fas fa-video"></i></a>
             </div>				
           </div>
         </div>
       </div>  
       `;
       
       //#endregion
   
       $("#screen-chat").append(rightSideConversation);
   
       //#region embed image modal
       let conversationImageModal = `
       <div class="modal fade" id="modalImage-${message.senderId}" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
         <div class="modal-dialog modal-lg" role="document">
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title">Thư viện Hình Ảnh</h5>
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                   <span aria-hidden="true">&times;</span>
                 </button>
             </div>
             <div class="modal-body">
               <div class="all-images" style="visibility: hidden;background-color: #DADDE1">
                       
               </div>
             </div>				
           </div>
         </div>
       </div>  
       `;
       //#endregion
       $("body").append(conversationImageModal);
   
       //#region embed attachment Modal
       let conversationAttachmentModal = `
       <div class="modal fade" id="modalAttachFile-${message.senderId}" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true"-hidden="true">
         <div class="modal-dialog modal-dialog-scrollable" role="document">
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title">Tập tin đính kèm</h5>
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                   <span aria-hidden="true">&times;</span>
                 </button>
             </div>
             <div class="modal-body modal-attachment-libraries">
               
             </div>        
           </div>
         </div>
       </div>
       `
       //#endregion
       $("body").append(conversationAttachmentModal);
   
     }
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
    socket.emit("check-status");
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
