import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let userOnlineOffline = io => {
  let clients = {} ;
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

    socket.on("check-status", () => {
      let listUsersIdOnline = Object.keys(clients);       
      socket.emit("server-send-list-users-online", listUsersIdOnline);

      socket.broadcast.emit("server-send-new-user-is-online", socket.request.user._id);
    })
    
    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(clients, group._id, socket.id);
      });
      if(newGroupArray.length){
        newGroupArray.forEach( (groupId,index) => {              
          clients = removeSocketIdOutOfArray(clients, groupId, socket.id);
          newGroupArray.splice(index,1) ;        
        })
      }
      
      socket.broadcast.emit("server-send-user-is-offline", socket.request.user._id );
    })
  })

}

module.exports = userOnlineOffline; 
