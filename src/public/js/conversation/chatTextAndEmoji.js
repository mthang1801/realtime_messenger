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

            $(`.person[data-chat = ${targetId}]`).on("pushConversationItemToTop", function(){
              let dataToMove = $(this).parent();
              $(this).closest("ul").prepend(dataToMove);
              $(this).off("pushConversationItemToTop");
            })
            $(`.person[data-chat = ${targetId}]`).trigger("pushConversationItemToTop");
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
