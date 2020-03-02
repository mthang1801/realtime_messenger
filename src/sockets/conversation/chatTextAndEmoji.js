import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper.js";

let chatTextAndEmoji = (io) => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    });
    socket.on("send-messenger-text-and-emoji-group", data => {
      let {targetId, message, groupId} = data; 
      if(clients[data.groupId]){
        let socketGroup = clients[data.groupId].filter( socketId => socketId != socket.id );
        socketGroup.forEach(socketId => {
          io.sockets.connected[socketId].emit("response-send-messenger-text-and-emoji-group", message)
        })
      }
    })
    socket.on("send-messenger-text-and-emoji", data => {
      let {targetId, message} = data; 
      if(clients[targetId]){
        emitResponseToArray(io, clients, targetId, "response-send-messenger-text-and-emoji", message);
      }
    })
    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(clients, group._id, socket.id);
      });
    })
  })
}

module.exports = chatTextAndEmoji;
