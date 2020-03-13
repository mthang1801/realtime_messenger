function convertTimerTitleMessenger(timeStamp){
  if(!timeStamp){
    return "";
  }
  return moment(timeStamp).locale("vi").format("LLLL");
}

function convertDateTimeMessenger(timeStamp){
  if(!timeStamp){
    return "";
  }
  return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
}

function chatTextAndEmoji(targetId){  
  $(".emojionearea").off("keyup").on("keyup", function(event){    
    let currentText=  $(this);
    if(event.which ==13){
      let messengerValue = $(`#chat-text-${targetId}`).val();    
      let conversationType = $(`#chat-text-${targetId}`).data("conversation-type");
      let isGroup = conversationType == "group" ? true : false ;
      console.log(isGroup)
      if(messengerValue.trim()==""){
        return ; 
      }
      let data = {targetId, messenger : messengerValue, isGroup};      
      $.ajax({
        type: "post",
        url: "/conversation/chat-text-and-emoji",
        data: data,
        global : false ,
        success: function (response) {
          if(response.success){
            let {message} = response ;
            //1: get outerHTML item messenger at right side            
            let myMessageOuter= $(`<div class="right-side__middle-content--me bubble" title="${convertTimerTitleMessenger(message.createdAt)}" data-message-id="${message._id}"></div>`);
            let myAvatar = `<img src="images/users/${message.sender.avatar}" class="right-side__middle-content-avatar right-side__middle-content-avatar--me" >`;
            let myMessage = `<div class="right-side__middle-content-messenger-text right-side__middle-content-messenger-text--me" data-message-id="${message._id}">${message.text}</div>`              
            myMessageOuter.html(`${myAvatar} ${emojione.toImage(myMessage)}`);       
            //2 : append message at right side
            $(`.right-side__middle-content[data-chat = ${targetId}]`).append(myMessageOuter);
            //3 :resize niceScroll
            $(`.right-side__middle-content[data-chat = ${targetId}]`).getNiceScroll().resize();
            niceScrollChatBox(targetId);
            switchTabConversation();
            //4: remove all input data
            $(`#chat-text-${targetId}`).val("");   
            currentText.find(".emojionearea-editor").text("");
            //5: change person(group) info messenger and time
            let textMessenger = message.text.length  >  15 ? message.text.substring(0,12) + "..." : message.text;
            $(`.person[data-chat = ${targetId}]`).find(".person__infor--messenger").css("color", "#4A4A4A").html( emojione.toImage(textMessenger));
            $(`.person[data-chat = ${targetId}]`).find(".person__config--time").css({"color": "#4A4A4A", "fontWeight" : "400", "fontSize": ".8rem","opacity" : ".8"}).text( convertDateTimeMessenger(message.createdAt));

            // $(`.person[data-chat = ${targetId}]`).on("pushConversationItemToTop", function(){
            //   let dataToMove = $(this).parent();
            //   $(this).closest("ul").prepend(dataToMove);
            //   $(this).off("pushConversationItemToTop");
            // })
            // $(`.person[data-chat = ${targetId}]`).trigger("pushConversationItemToTop");
            let dataToEmit = { targetId , message}            
            //6: socket send message to convertion
            if(isGroup){
              dataToEmit.groupId = targetId ;              
              socket.emit("send-messenger-text-and-emoji-group", dataToEmit);
            }else{
              socket.emit("send-messenger-text-and-emoji", dataToEmit);             
            }
            //increase new number message more than current message is 1
            updateNumberOfMessages(targetId);
             //7: call function to check status
             checkStatusConversation(dataToEmit); 
             socket.emit("chect-status");
            typingOff(targetId);
          }
        },
        error : function(error){
          console.log(error);
        }
      });
    }
  })
};

socket.on("response-send-messenger-text-and-emoji", message => {   
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
            <span>${message.text}</span>
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
          <div class="right-side__top--leftside-avatar">
            <div class="right-side__top--leftside-avatar--dot"></div>
            <img src="images/users/${message.sender.avatar}" alt="${message.sender.avatar}" class="right-side__top--leftside-avatar--image"/>
          </div>
          <div class="right-side__top--leftside-username-status">
            <span class="right-side__top--leftside-username">
              ${message.sender.username}
            </span>
            <span class="right-side__top--leftside-status">             
                Vừa mới truy cập           
            </span>
          </div>
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
  let yourMessageOuterHTML = $(`<div class="right-side__middle-content--you bubble" title="${convertTimerTitleMessenger(message.createdAt)}" data-message-id="${message._id}"></div>`);
  let yourAvatar = `<img src="images/users/${message.sender.avatar}" class="right-side__middle-content-avatar right-side__middle-content-avatar--you" >`;
  let yourMessage = `<div class="right-side__middle-content-messenger-text right-side__middle-content-messenger-text--you" data-message-id="${message._id}">${message.text}</div>`              

  yourMessageOuterHTML.html(`${yourAvatar} ${emojione.toImage(yourMessage)}`);

  //append to right side
  $(`.right-side__middle-content[data-chat = ${message.senderId}]`).append(yourMessageOuterHTML);
  //resize scroll
  $(`.right-side__middle-content[data-chat = ${message.senderId}]`).getNiceScroll().resize();
  niceScrollChatBox(message.senderId);

  //left side
  let messengerText = message.text.length > 15 ? message.text.substring(0, 12)+ "..." : message.text ;
  $(`.person[data-chat = ${message.senderId}]`).find(".person__infor--messenger").css({"color": "black", "fontWeight": "bold", "fontSize": "1em"}).html( emojione.toImage(messengerText));
  $(`.person[data-chat = ${message.senderId}]`).find(".person__config--time").css({"color": "#d62e18", "fontWeight": "bold"}).text( convertDateTimeMessenger(message.createdAt));

  
  $(`.person[data-chat = ${message.senderId}]`).on("pushConversationToTop", function(){
    let dataToMove = $(this).parent();
    $(this).closest("ul").prepend(dataToMove);
    $(this).off("pushConversationToTop");
  });
  $(`.person[data-chat = ${message.senderId}]`).trigger("pushConversationToTop");
  socket.emit("check-status");
});


socket.on("response-send-messenger-text-and-emoji-group", message => {  
  //1: get outerHTML item messenger at right side
  let groupMessengerHTML = $(`<div class="right-side__middle-content--you bubble" title="${convertTimerTitleMessenger(message.createdAt)}" data-message-id="${message._id}">`);
  let groupAvatar = ` <img src="images/users/${message.sender.avatar}" class="right-side__middle-content-avatar right-side__middle-content-avatar--you">`;
  let groupText = `<div class="right-side__middle-content-messenger-text right-side__middle-content-messenger-text--you" data-message-id="${message._id}">${message.text}</div> `;
  groupMessengerHTML.html(`${groupAvatar} ${emojione.toImage(groupText)}`);
  //2 : append to right side of
  $(`.right-side__middle-content[data-chat = ${message.receiverId}]`).append(groupMessengerHTML);
  //3 :resize scroll
  $(`.right-side__middle-content[data-chat = ${message.receiverId}]`).getNiceScroll().resize();
  niceScrollChatBox(message.receiverId);
  //4 : left side
  let messengerText = message.text.length > 15 ? message.text.substring(0, 12) + "..." : message.text ;
  $(`.person[data-chat = ${message.receiverId}]`).find(".person__infor--messenger").css({"color": "black", "fontWeight": "bold", "fontSize": "1em"}).html( emojione.toImage(messengerText));
  $(`.person[data-chat = ${message.receiverId}]`).find(".person__config--time").css({"color": "#d62e18", "fontWeight": "bold"}).text( convertDateTimeMessenger(message.createdAt));

  $(`.person[data-chat = ${message.receiverId}]`).on("pushConversationToTop", function(){
    let dataToMove = $(this).parent();
    $(this).closest("ul").prepend(dataToMove);
    $(this).off("pushConversationToTop");
  });
  $(`.person[data-chat = ${message.receiverId}]`).trigger("pushConversationToTop");
});
