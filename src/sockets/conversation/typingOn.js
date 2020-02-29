import {pushSocketIdIntoArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let typingOn = io => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    });
    
    socket.on("user-is-typing" , data=> {
      console.log(data);
      // if(data.groupId){
      //   let dataToEmit ={ 
      //     user : socket.request.user, 
      //     groupId : data.groupId
      //   }
      //   if(clients[data.groupId]){
      //     clients[data.groupId].forEach( socketId => {
      //       io.sockets.connected[socketId].emit("response-user-is-typing", dataToEmit);
      //     })
      //   }
      // }else{
      //   let dataToEmit = {
      //     user : socket.request.user
      //   }
      //   if(clients[data.targetId]){
      //     clients[data.targetId].forEach(socketId => {
      //       io.sockets.connected[socketId].emit("response-user-is-typing", dataToEmit);
      //     })
      //   }
      // }
    })

    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(clients, group._id, socket.id);
      })
    })
  })
}

module.exports = typingOn;