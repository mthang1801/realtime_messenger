export const pushSocketIdIntoArray = (clients, userId, socketId) => {
  if(clients[userId]){
    clients[userId].push(socketId);
  }else{
    clients[userId] = [socketId];
  }
  return clients;
};

export const emitResponseToArray = (io, clients, userId, eventName, data) => {
  clients[userId].forEach(socketId => {
    try {
      io.to(socketId).emit(eventName, data);
    } catch (error) {
      console.log(error)
    }
  })
}

export const removeSocketIdOutOfArray = (io, socket, clients, userId, socketId) => {  
  // if(clients[userId].indexOf(socketId) != -1 && clients[userId].length==1) {       
   
  //   // io.sockets.emit("server-send-current-user-is-offline", userId)
  // }
  clients[userId] = clients[userId].filter(socketIdItem => socketIdItem != socketId);  
  if(!clients[userId].length){
    socket.broadcast.emit("server-send-user-is-offline", userId);
    delete clients[userId];
  }
  return clients;
}
