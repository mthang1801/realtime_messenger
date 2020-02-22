import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let removeCurrentContact = (io) => {
  let clients = {};
  io.on('connection', socket =>{
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.on("remove-current-contact", data => {
      let {_id} = socket.request.user;
      let currentUserItem = {_id};
      if(clients[data.targetId]){
        clients[data.targetId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-remove-current-contact", currentUserItem);
        })
      }
    })
    socket.on("disconnect", () =>{
      removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
    })
  })
};

module.exports = removeCurrentContact;
