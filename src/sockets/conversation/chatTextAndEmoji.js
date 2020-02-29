import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper.js";

let chatTextAndEmoji = (io) => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.on("send-messenger-text-and-emoji", data => {
      let {targetId, message} = data; 
      if(clients[targetId]){
        clients[targetId].forEach(socketId => {
          io.sockets.connected[socketId].emit("response-send-messenger-text-and-emoji", message);
        })
      }
    })
    socket.on("disconnect", () => {
      removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id)
    })
  })
}

module.exports = chatTextAndEmoji;