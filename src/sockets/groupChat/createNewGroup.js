import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let createNewGroup = io => {
  let clients = {};
  io.on("connection",  socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    })
   
    socket.on("create-new-group", data => {
      clients = pushSocketIdIntoArray(clients, data.group._id , socket.id);      
      data.group.members.forEach( member => {
        if(clients[member.userId] && member.userId != socket.request.user._id){                    
          emitResponseToArray(io, clients, member.userId, "response-create-new-group", data);
        }
        
      })
    });

    socket.on("user-received-new-group", data => {
      clients = pushSocketIdIntoArray(clients, data.group._id, socket.id)      
    })

    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(io, socket, clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(io, socket, clients, group._id, socket.id);
      })
    })
  })
}

module.exports = createNewGroup;
