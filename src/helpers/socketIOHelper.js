export const pushSocketIdIntoArray = (clients, userId, socketId) => {
  if(clients[userId]){
    clients[userId].push(socketId);
  }else{
    clients[userId] = [socketId];
  }
  return clients;
};

export const removeSocketIdOutOfArray = (clients, userId, socketId) => {
  clients[userId] = clients[userId].filter(socketIdItem => socketIdItem !== socketId);

  if(!clients[userId].length){
    delete clients[userId];
  }
}