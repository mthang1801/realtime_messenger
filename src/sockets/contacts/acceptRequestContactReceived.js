import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let acceptRequestContactReceived = (io) =>{
  let clients = {}; 
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.on("accept-request-contact-received", data => {      
      let {_id, username, avatar, address } = socket.request.user; 
      let currentUserItem = {_id, username, avatar, address, notificationId : data.notificationId, contactUpdateAt : data.updatedAt}
      if(clients[data.userId]){
        clients[data.userId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-accept-request-contact-received", currentUserItem);
        })
      }
    })
    socket.on("disconnect", () =>{
      removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
    })
  })
}

module.exports = acceptRequestContactReceived;
