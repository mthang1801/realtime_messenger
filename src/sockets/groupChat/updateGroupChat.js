import {pushSocketIdIntoArray, removeSocketIdOutOfArray, emitResponseToArray} from "../../helpers/socketIOHelper";

let updateGroupChat = io => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    })

    socket.on("update-group-chat" , data => {     
      let {groupAfterUpdating, notificationHTML } = data ;
      groupAfterUpdating.members.forEach( member => {
        if(clients[member.userId] && member.userId != socket.request.user._id){                    
          emitResponseToArray(io, clients, member.userId, "response-update-group-chat", data);
        }        
      })
    });

    socket.on("disconnect", () =>{
      clients = removeSocketIdOutOfArray(io, socket, clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(io, socket, clients, group._id, socket.id);
      })
    })
  })
}

module.exports = updateGroupChat;
