import {pushSocketIdIntoArray, emitResponseToArray, removeSocketIdOutOfArray} from "../../helpers/socketIOHelper";
import { emit } from "nodemon";

let callVideo = io => {
  let clients = {} ; 
  io.on("connection", socket => {
    clients=  pushSocketIdIntoArray(clients, socket.request.user._id, socket.id);

    socket.on("caller-send-request-to-check-listener-is-online", data => {
      let {callerId, callerName, listenerId, listenerName } = data;
      if(clients[listenerId]){
        //online
        emitResponseToArray(io, clients, listenerId, "server-request-listener-online-peerId", data );

      }else{
        //offline
        emitResponseToArray(io, clients, callerId, "server-send-listener-is-offline", data );
      }
    });

    socket.on("listener-send-peerId-to-server", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId } = data;
      if(clients[callerId]){
        emitResponseToArray(io, clients, callerId, "server-send-listener-peerId-to-caller",  data);
      }
    });

    socket.on("caller-request-call-to-server", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId } = data;
      if(clients[listenerId]){
        emitResponseToArray(io, clients, listenerId, "server-send-request-call-to-listener", data) ;
      }
    });

    socket.on("caller-cancel-request-call", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId } = data;
      if(clients[listenerId]){
        emitResponseToArray(io, clients, listenerId, "listener-received-caller-cancel" , data);
      }
    });

    socket.on("listener-reject-call", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId } = data;
      if(clients[callerId]){
        emitResponseToArray(io, clients, callerId, "caller-received-listener-reject-call", data);
      }
    });

    socket.on("listener-accept-call", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId } = data;
      if(clients[callerId]){
        emitResponseToArray(io, clients, callerId, "server-send-accept-call-to-caller", data);
      }
      if(clients[listenerId]){
        emitResponseToArray(io, clients, listenerId, "server-send-accept-call-to-listener", data);
      }
    });

    socket.on("caller-request-end-call", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId, stream } = data;
      if(clients[listenerId]){
        emitResponseToArray(io, clients, listenerId, "server-send-caller-request-end-call", data) ;
      }
    });

    socket.on("listener-request-end-call", data => {
      let {callerId, callerName, listenerId, listenerName, listenerPeerId, stream } = data;
      if(clients[callerId]){
        emitResponseToArray(io, clients, callerId, "server-send-listener-request-end-call", data);
      }
    })
    socket.on("disconnect", () => {
      clients= removeSocketIdOutOfArray(clients, socket.request.user._id, socket.id);
    })
  })
}

module.exports = callVideo;
