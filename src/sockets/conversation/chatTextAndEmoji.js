import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper.js";

let chatTextAndEmoji = (io) => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.on("send-messenger-text-and-emoji", data => {
      let {targetId, message} = data; 
      if(clients[targetId]){
        emitResponseToArray(io, clients, targetId, "response-send-messenger-text-and-emoji", message);
      }
    })
    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id)
    })
  })
}

module.exports = chatTextAndEmoji;
