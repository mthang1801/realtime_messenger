//############# Private Check status

/**
 * @param {data: object} data 
 * data includes : targetId, messageInfo
 * describe: 
 * send to socket to check status conversation
 * after checking,socket will send back sender
 */
function checkStatusConversation(data){
  let {targetId, message} = data ;
  //socket check status
  socket.emit("check-status-conversation", data);
};

socket.on("response-check-status-conversation-is-offline", message => {  
  let statusHTML = $(`<br/><span class="status-messenger status-messenger--me" data-message-uid="${message.receiverId}">Đã gửi</span>`);  
  $(`.right-side__middle-content[data-chat = ${message.receiverId}] div.bubble:last-child`).prev().find(".status-messenger").remove();
  $(`.right-side__middle-content[data-chat = ${message.receiverId}] div.bubble:last-child`).append(statusHTML);
  $(`.right-side__middle-content[data-chat = ${message.receiverId}]`).getNiceScroll().resize();
  niceScrollChatBox(message.receiverId);
});

socket.on("response-check-status-conversation-is-online", message => {
  //request server 
  $.ajax({
    type : "put", 
    url : "/conversation/update-message-has-been-received", 
    data : {messageId : message._id} ,
    global : false  ,
    success : function(data){
     if(data.success){            
      let statusHTML = $(`<br><span class="status-messenger status-messenger--me" data-message-uid="${message.receiverId}">Đã nhận</span>`);  
      
      $(`.right-side__middle-content[data-chat = ${message.receiverId}] div.bubble:last-child`).prev().find(".status-messenger").remove();
      $(`.right-side__middle-content[data-chat = ${message.receiverId}] div.bubble:last-child`).append(statusHTML);
      niceScrollChatBox(message.receiverId);
     }
    },
    error : function(error){
      console.log(error.responseText);
    }
  });
})

//################### Group check status

