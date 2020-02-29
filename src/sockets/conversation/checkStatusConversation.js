import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let checkStatusConversation = io => {
  let clients = {};
  io.on("connection", socket => {
    clients= pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    });
  

    socket.on("check-status-conversation", data => {
      let  {targetId, message} = data; 
      if(!clients[targetId]){
        clients[message.senderId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-check-status-conversation-is-offline", message) ;
        })
      }else{
        clients[message.senderId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-check-status-conversation-is-online", message) ;
        })
      }      
    });

    socket.on("receiver-has-seen-message", data => { 
      if(clients[data.senderId]){
        clients[data.senderId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-receiver-has-seen-message", {receiverId :data.receiverId , senderId : data.senderId});
        })
      }
    })


    socket.on("disconnect", () =>{
      removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        removeSocketIdOutOfArray(clients, group._id, socket.id);
      })
    })
  })
}

module.exports = checkStatusConversation;
