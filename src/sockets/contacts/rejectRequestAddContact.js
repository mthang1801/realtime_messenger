import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let rejectRequestAddContact = (io) => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    
    socket.on("reject-request-add-contact", data => {
      let {_id} = socket.request.user;
      if(clients[data.userId]){
        clients[data.userId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-reject-request-add-contact", _id );
        })
      }
    })
    socket.on("disconnect", () => {
      removeSocketIdOutOfArray(clients,socket.request.user._id, socket.id);
    })
  })
};

module.exports = rejectRequestAddContact;
