import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";
/**
 * 
 * @param  io from socket.io
 */
let addNewContact = (io) => {
  let clients = {};
  io.on("connection", socket => {  
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);   
    socket.on("add-new-contact", (data) => {
      let {_id, username, avatar, address} = socket.request.user;
      let currentUser = {_id, username, avatar, address, contactCreatedAt : data.contactCreatedAt, notificationId: data.notificationId} 
      if(clients[data.contactId]){
        clients[data.contactId].forEach( socketId => {
          io.sockets.connected[socketId].emit("response-add-new-contact", currentUser);
        })
      }
    })

    socket.on("disconnect", () => {
      removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
    })
  })

};

module.exports = addNewContact;
