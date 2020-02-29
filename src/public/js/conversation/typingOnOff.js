function typingOn(targetId){  
  if($(`#chat-text-${targetId}`).hasClass("chat-in-group")){
    socket.emit("user-is-typing", {groupId: targetId});
  }else{
    socket.emit("user-is-typing", {targetId: targetId});
  }
}

$(document).ready(function () {

  

  socket.on("response-user-is-typing", data => {
    console.log(data);
  })
});