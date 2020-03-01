function typingOn(targetId){  
  if($(`#chat-text-${targetId}`).hasClass("chat-in-group")){
    socket.emit("user-is-typing", {groupId: targetId});
  }else{
    socket.emit("user-is-typing", {targetId: targetId});
  }
};

function typingOff(targetId){
  if($(`#chat-text-${targetId}`).hasClass("chat-in-group")){
    socket.emit("user-blur-typing", {groupId: targetId});
  }else{
    socket.emit("user-blur-typing", {targetId: targetId});
  }
}

$(document).ready(function () {
  socket.on("response-user-is-typing", data => {  
    let messageTyping = `<div class="right-side__middle-content--you bubble bubble-gif-icon">
      <span class="bubble-gif-icon-username">${data.user.username} đang soạn</span>
      <span class="bubble-gif-icon-dot--1">.</span>
      <span class="bubble-gif-icon-dot--2">.</span>
      <span class="bubble-gif-icon-dot--3">.</span>
    </div>`;    
    if(data.groupId){
      if(data.user._id != $(`#dropdownId`).data("user-id")){
        let isTyping = $(`.right-side__middle-content[data-chat = ${data.groupId}]`).find(".bubble-gif-icon");
        if(isTyping.length){
          return false ;
        }        
        $(`.right-side__middle-content[data-chat = ${data.groupId}]`).append(messageTyping);
        niceScrollChatBox(data.groupId);
      }
    }else{
      let isTyping = $(`.right-side__middle-content[data-chat = ${data.user._id}]`).find(".bubble-gif-icon");
      if(isTyping.length){
        return false ;
      }      
      $(`.right-side__middle-content[data-chat = ${data.user._id}]`).append(messageTyping);
      niceScrollChatBox(data.user._id);
    }
  });

  socket.on("response-user-blur-typing", data => {
    if(data.groupId){
      $(`.right-side__middle-content[data-chat = ${data.groupId}]`).find(".bubble-gif-icon").remove();
      niceScrollChatBox(data.groupId);
    }else{
      $(`.right-side__middle-content[data-chat = ${data.user._id}]`).find(".bubble-gif-icon").remove();
      niceScrollChatBox(data.user._id);
    }
  })
});