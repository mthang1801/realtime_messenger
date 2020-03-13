import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper.js";

let chatAttachment = (io) => {
  let clients = {};
  let newGroupArray = [];
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    });

    socket.on("create-new-group", data => {
      clients = pushSocketIdIntoArray(clients, data.group._id , socket.id);
      newGroupArray.push(data.group._id);
    });

    socket.on("user-received-new-group", data => {
      clients = pushSocketIdIntoArray(clients, data.group._id, socket.id)      
    });

    socket.on("send-messenger-attachment-group", data => {
      let {targetId, message, groupId} = data; 
      if(clients[data.groupId]){
        let socketGroup = clients[data.groupId].filter( socketId => socketId != socket.id );
        socketGroup.forEach(socketId => {
          io.sockets.connected[socketId].emit("response-send-messenger-attachment-group", message)
        })
      }
    })
    socket.on("send-messenger-attachment", data => {
      let {targetId, message} = data; 
      if(clients[targetId]){
        emitResponseToArray(io, clients, targetId, "response-send-messenger-attachment", message);
      }
    })

    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(io, socket, clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(io, socket, clients, group._id, socket.id);
        let index =  newGroupArray.indexOf(group._id); 
        if(index != -1){
          clients = removeSocketIdOutOfArray(io, socket, clients, group._id, socket.id);
          newGroupArray.splice(index,1) ;    
        }
      });
      if(newGroupArray.length){
        newGroupArray.forEach( (groupId,index) => {              
          clients = removeSocketIdOutOfArray(io, socket, clients, groupId, socket.id);
          newGroupArray.splice(index,1) ;        
        })
       }
    })
  })
}

module.exports = chatAttachment;
