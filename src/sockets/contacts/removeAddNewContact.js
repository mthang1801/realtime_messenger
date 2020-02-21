import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/clientHelper";

let removeAddNewContact = (io) => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.on("remove-add-new-contact", data => {
      let {_id, username, avatar, address} = socket.request.user;
      let currentUser = {_id, username, avatar, address};     
      if(clients[data.contactId]){
        clients[data.contactId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-remove-add-new-contact", currentUser);
        })
      }
    })

    socket.on("disconnect", () => {
      removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
    })
  })
};

module.exports = removeAddNewContact;
