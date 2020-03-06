function callVideo(listenerId){
  $(`#video-chat-${listenerId}`).off("click").on("click", function(){
    //need 4 things includes : caller name, caller id(myself), listener name, listener id (target)
    let callerName = $("#dropdownId").find(".navigation__nav-username").text().trim();
    let callerId = $("#dropdownId").data("user-id");
    let listenerName = $(`#to-${listenerId}`).find(".right-side__top--leftside-username").text().trim();

    let dataToEmit = {
      callerId,
      callerName,
      listenerId,
      listenerName
    }
   
    socket.emit("caller-send-request-to-check-listener-is-online", dataToEmit);

    var mediaStream = null;
    navigator.getUserMedia(
        {
            audio: true,
            video: true
        },
        function (stream) {
            mediaStream = stream;
            mediaStream.stop = function () {
                this.getAudioTracks().forEach(function (track) {
                    track.stop();
                });
                this.getVideoTracks().forEach(function (track) { //in case... :)
                    track.stop();
                });
            };
            /*
             * Rest of your code.....
             * */
        });

    /*
    * somewhere insdie your code you call
    * */
    mediaStream.stop();
  })
}

function playVideoStream(videoTargetId, stream){
  let video = document.getElementById(videoTargetId);
  video.srcObject = stream ; 
  video.onloadeddata = () => {
    video.play();
  }
};

function stopVideoStream(stream){
  return stream.getTracks().forEach( track => track.stop());
}

$(document).ready(function () {
  callVideo();

  //listener is offline
  socket.on("repsonse-listener-is-offline", data => {
    alertify.notify(`${data.listenerName} hiện không trực tuyến, vui lòng liên hệ sau!!!`, "error" , 8);
  })

  let stringICEServer = $("#ice-server").val();
  ICEServerList = JSON.parse(stringICEServer);
  let peer = new Peer({
    key : "peerjs" , 
    host : "peerjs-server-trungquandev.herokuapp.com" ,
    port : 443 , 
    secure : true  ,
    config : {'iceServers' : ICEServerList} ,
    debug : 3
  });
  let getPeerId = "";
  peer.on("open", function(peerId){
    getPeerId = peerId;    
  })
  //listener is online
  socket.on("server-request-listener-online-peerId", data => {    
    let dataToEmit = {...data, listenerPeerId : getPeerId };
    socket.emit("listener-send-peerId-to-server" , dataToEmit);
  })
  
  //caller request server to call or cancel call
  let timerInterval = 0 ; 
  socket.on("server-send-listener-peerId-to-caller", data => {    
    //data :  callerId, callerName,  listenerId, listenerName, listenerPeerId
    socket.emit("caller-request-call-to-server", data);
    
    Swal.fire({
      html : `<h4>Đang kết nối cuộc gọi đến &nbsp;<span style="color:#09f">${data.listenerName}</span></h4>
              <div>Thời gian chờ cuộc gọi <strong style="color:#f00e0e"></strong> giây</div>
              <div>...</div>
              <div class="mt-2">
                <button id="btn-cancel-call" class="btn btn-danger"><i class="fas fa-video-slash"></i></button>
              </div>
      `,

      showConfirmButton : false , 
      width : "50%" ,
      allowOutsideClick : false ,
      backdrop : "rgba(85,85,85,0.4)",
      timer : 5000,
      onBeforeOpen : function(){              
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.floor(Swal.getTimerLeft() / 1000 )
        }, 100);

        $("#btn-cancel-call").on("click", function(){
          Swal.close();          
          socket.emit("caller-cancel-call", data);
        });

        socket.on("caller-received-listener-reject-call", data => {
          Swal.close();         
          Swal.fire({          
            html : `<h5><span style="color:#09f">${data.listenerName}</span> hiện đang bận không thể bắt máy</h5>`,            
            width : "35rem" ,           
            backdrop : "rgba(85,85,85,0.4)",
            confirmButtonColor : "#34ace0"
          });
        })
      },
      onClose : function(){        
        clearInterval(timerInterval);
      }      
    }).then( result => {
      if(result.dismiss=="timer"){
        Swal.fire({          
          html : `<h5><span style="color:#09f">${data.listenerName}</span> hiện đang bận không thể bắt máy</h5>`,            
          width : "35rem" ,           
          backdrop : "rgba(85,85,85,0.4)",
          confirmButtonColor : "#34ace0"
        });
      }
    })
  });

  //listern listen request call from server
  socket.on("server-send-request-call-to-listener", data => {
    Swal.fire({
      html : `
              <h4><span style="color:#09f">${data.callerName}</span>&nbsp; đang gọi video cho bạn</h4>
              <div>Thời gian chờ cuộc gọi <strong style="color:#f00e0e"></strong> giây</div>
              <div>...</div>
              <div class="mt-2">
                <button id="btn-accept-call" class="btn btn-success mr-2"><i class="fas fa-video"></i></button>
                <button id="btn-reject-call" class="btn btn-danger"><i class="fas fa-video-slash"></i></button>
              </div>
          `,
      showConfirmButton : false , 
      width : "50%" ,
      allowOutsideClick : false ,
      backdrop : "rgba(85,85,85,0.4)",
      timer : 5000,
      onOpen : function(){
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.floor(Swal.getTimerLeft() / 1000 )
        }, 100);        
        $("#btn-reject-call").on("click", function(){
          Swal.close();          
          socket.emit("listener-reject-call", data);
        });
        $("#btn-accept-call").on("click", function(){
          Swal.close();
          socket.emit("listener-accept-call", data);
        })
        socket.on("listener-received-caller-cancel", data => {
          Swal.close();             
        })
      },            
      onClose : function(){
        Swal.close();       
        clearInterval(timerInterval);
      }
    })
  });
 
  //server send call to caller
  socket.on("server-send-accept-call-to-caller", data => {
    Swal.close();
    clearInterval(timerInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia).bind(navigator);
    getUserMedia({video: true, audio: false}, stream => {
      //open modal video call
      $("#modalVideoCall").modal({
        backdrop: "static",
        keyboard : false ,
        show : true
      })
      //call to listener via peerId of listener
      let call = peer.call( data.listenerPeerId, stream );
      //open local stream
      playVideoStream( "local-stream", stream);
      //wait listener allow stream 
      call.on("stream", remoteStream => {
        playVideoStream("remote-stream", remoteStream);
      })
      //event click btn-end-call from caller 
      $("#btn-end-call").on("click", function(){
        $("#modalVideoCall").modal("hide");       
      })
      //after end call, socket is created and annouce to listener caller ended call
      $("#modalVideoCall").on("hidden.bs.modal", function(){
        stopVideoStream(stream);
        data.stream = stream ;
        socket.emit("caller-request-end-call", data);
      })
    }, function(err){
      if(err.toString() === "NotAllowedError: Permission denied"){
        alertify.notify("Bạn đã tắt quyền truy cập vào định vị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt trình duyệt" , "error" , 10);
      }
      if(err.toString() === "NotFoundError: Requested device not found"){
        alertify.notify("Thiết bị của bạn không hỗ trợ tính năng nghe gọi" , "error" , 10);
      }
    })
  })

  //server send call to listener
  socket.on("server-send-accept-call-to-listener", data => {     
    Swal.close();
    let getUserMedia =  (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia).bind(navigator);
    peer.on("call" , call => {
      getUserMedia({video: true, audio: false}, stream => {      
        call.answer(stream);
        $("#modalVideoCall").modal({
          backdrop: "static",
          keyboard : false ,
          show : true
        })
        playVideoStream("local-stream", stream);
        call.on("stream", remoteStream => {
          playVideoStream("remote-stream", remoteStream);
        });

         //event click btn-end-call from caller 
        $("#btn-end-call").on("click", function(){
          $("#modalVideoCall").modal("hide");       
        })
        //after end call, socket is created and annouce to listener caller ended call
        $("#modalVideoCall").on("hidden.bs.modal", function(){
          stopVideoStream(stream);
          data.stream = stream ;
          socket.emit("listener-request-end-call", data);
        })
      }, function(err){
        if(err.toString() === "NotAllowedError: Permission denied"){
          alertify.notify("Bạn đã tắt quyền truy cập vào định vị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt trình duyệt" , "error" , 10);
        }
        if(err.toString() === "NotFoundError: Requested device not found"){
          alertify.notify("Thiết bị của bạn không hỗ trợ tính năng nghe gọi" , "error" , 10);
        }
      })
    })
  });

  //when caller end call, socket immediately send to listener to annouce this call came to end
  socket.on("server-send-caller-request-end-call", data => {   
    if($("#modalVideoCall").hasClass("show")){
      $("#modalVideoCall").modal("hide");
      Swal.fire({          
        html : `<h5>cuộc gọi với &nbsp;<span style="color:#09f">${data.callerName}</span> đã kết thúc</h5>`,            
        width : "35rem" ,           
        backdrop : "rgba(85,85,85,0.4)",
        confirmButtonColor : "#34ace0"
      })
    }   
  });

   //when caller end call, socket immediately send to listener to annouce this call came to end
  socket.on("server-send-listener-request-end-call", data => {   
    if($("#modalVideoCall").hasClass("show")){
      $("#modalVideoCall").modal("hide");
      Swal.fire({          
        html : `<h5>cuộc gọi với &nbsp;<span style="color:#09f">${data.listenerName}</span> đã kết thúc</h5>`,            
        width : "35rem" ,           
        backdrop : "rgba(85,85,85,0.4)",
        confirmButtonColor : "#34ace0"
      })
    }
  })
});
