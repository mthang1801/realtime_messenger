import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";

let typingOff = io => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);
    socket.request.user.listGroupsId.forEach( group => {
      clients = pushSocketIdIntoArray(clients, group._id, socket.id);
    })
    socket.on("user-blur-typing", data => {     
      if(data.groupId){
        let dataToEmit ={ 
          user : socket.request.user, 
          groupId : data.groupId
        }
        if(clients[data.groupId]){
          emitResponseToArray(io, clients, data.groupId, "response-user-blur-typing", dataToEmit);          
        }
      }else{
        let dataToEmit = {
          user : socket.request.user
        }
        if(clients[data.targetId]){
          emitResponseToArray(io, clients, data.targetId, "response-user-blur-typing", dataToEmit);    
        }
      }
    })

    socket.on("disconnect", () => {
      clients = removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
      socket.request.user.listGroupsId.forEach( group => {
        clients = removeSocketIdOutOfArray(clients, group._id, socket.id);
      })
    })
  });
}

module.exports = typingOff;
