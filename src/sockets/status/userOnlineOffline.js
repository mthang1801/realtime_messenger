import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let userOnlineOffline = io => {
  let clients = {} ;
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    });

    let listUsersIdOnline = Object.keys(clients);
    socket.emit("server-send-list-users-online", listUsersIdOnline);

    socket.on("new-user-is-online", () => {     
      socket.broadcast.emit("server-send-new-user-is-online", socket.request.user._id);
    });
    
    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(clients, group._id, socket.id);
      });

      listUsersIdOnline = listUsersIdOnline.filter( userId => userId != socket.request.user._id);
      socket.broadcast.emit("server-send-user-is-offline", socket.request.user._id );
    })
  })

}

module.exports = userOnlineOffline; 
