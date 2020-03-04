/**
 * created by MVT on 13/02/2020
 */

const socket = io();

function niceScrollLeftSide(){
  $(".left-side").niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#4A4A4A',
    cursorwidth: '7px',
    scrollspeed: 50
  })
 
};

function niceScrollChatBox(chatBoxId){   
  $(`.right-side__middle-content[data-chat = ${chatBoxId}]`).getNiceScroll().resize();
  $(`.right-side__middle-content[data-chat = ${chatBoxId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#4A4A4A',
    cursorwidth: '7px',
    scrollspeed: 50,
    autohidemode : "leave",
  });
  $(`.right-side__middle-content[data-chat = ${chatBoxId}]`).scrollTop($(`.right-side__middle-content[data-chat = ${chatBoxId}]`)[0].scrollHeight);
};


function spinLoaded(){
  $("#loading").css("display" , "none");
  $(".modal-loading").css("display", "none");
};

function spinLoading(){
  $("#loading").css("display", "block");
  $(".modal-loading").css("display", "block"); 
};

function ajaxLoading(){
  $(document).ajaxStart(() =>{
    spinLoading();
    console.log("ajax Start");
  }).ajaxStop(() => {
    spinLoaded();        
    console.log("ajax Stop")
  })
};

function showModalContacts(){
  $("#modalContact").on("show.bs.modal", () => {
    $("#contact-count").fadeOut("fast");
  })
};

function photoSetGrid(){
  $(".image-libraries").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    //get number images per row

    let originalPicture = $(`#modalImage-${targetId}`).find(".modal-body").html() ; 
    let layoutNumber = 4;
    let countRows = Math.ceil($(`#modalImage-${targetId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");  
    
    $(`#modalImage-${targetId}`).find("div.all-images").photosetGrid({
      gutter : "5px",
      layout : layoutStr,
      highresLinks : true ,
      rel: 'withhearts-gallery',
      onInit : () => {}, 
      onComplete : () => {
        $(`#modalImage-${targetId}`).find(".all-images").css({"visibility": "visible" }).attr("style" , "");
        $(`#modalImage-${targetId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '60%',
          maxWidth: '90%'
        });
      }
    });
    $(`#modalImage-${targetId}`).on("hidden.bs.modal", function(){
      $(this).find(".modal-body").html(originalPicture);
    })
  })
 
};

let switchButtonGroupChat = () => {
  $("#select-type-chat").off("change").on("change" , function(e){
    let tabPanelId = $("option:selected", this).data("target").replace("#","");
    //remove all active class at left side, then addClass active to selected value
    $(".left-side-conversations__content").removeClass("active");
    $(`#${tabPanelId}`).addClass("active");
    //resize niceScroll for left side after changing option value
    $(".left-side").getNiceScroll().resize();
    let targetId = "";
    let isGroupChat = false ;
    $(".person").each( function(index, element){
      if($(this).hasClass("active")){
        targetId = $(this).data("chat");
        isGroupChat = $(this).hasClass("group-chat") ? true : false ;
      }
    })
    
    if($(this).val() == "private-chat"){
      if(targetId != "" && !isGroupChat){
        $(`.person[data-chat = ${targetId}]`).addClass("active");
      }else{
        $(".person").removeClass("active");
        $(".right-side__screen").removeClass("active");
        $(".initial-conversation").show();
      }
    }
    else if($(this).val() == "group-chat"){
      if(targetId != "" && isGroupChat){        
        $(`.person[data-chat = ${targetId}]`).addClass("active");
      }else{
        $(".person").removeClass("active");
        $(".right-side__screen").removeClass("active");
        $(".initial-conversation").show();
      }
    }
    else if($(this).val() == "all-chat"){
    
      if(targetId != ""){
        $(`.person[data-chat = ${targetId}]`).addClass("active");
      }else{
        $(".person").removeClass("active");
        $(".right-side__screen").removeClass("active");
        $(".initial-conversation").show();
      }
    }

    if($(this).val() == "private-chat"){
      $("#btn-create-group-chat").hide();     
    }else{
      $("#btn-create-group-chat").show();
    }
    
    switchButtonGroupChat();
  })
}

function enableEmojiChat(targetId){
  $(`#chat-text-${targetId}`).emojioneArea({
    standalone : false ,
    search : false ,
    pickerPosition : "top",
    filterPosition : "bottom",
    autocomplete : false ,
    tones : false ,
    inline : true ,
    hidePickerOnBlur : true ,
    shortnames : false ,
    events  : {
      keyup : function(editor, event) {
        $(`#chat-text-${targetId}`).val(this.getText());
      },
      keypress : function(){
        typingOn(targetId);                
      },    
      click : function(){
        chatTextAndEmoji(targetId);
      },
      blur : function(){
        typingOff(targetId);
      }
    }
  });
  //create auto focus when every click conversation item at left side, right side will auto click into input tag
  $(`.right-side__bottom`).find(".emojionearea-editor").blur();
  $(`.right-side__bottom[data-chat = ${targetId}]`).find(".emojionearea-editor").focus();
  //when click this button, it will switch class "click-on" inorder to determine input has whether focus or not
  $(".icon-chat").off("click").on("click" ,  function(){  
    $(".icon-chat").toggleClass("click-on");
    if($(".icon-chat").hasClass("click-on")){
      $(".emojionearea-button").trigger("click");
      $(".emojionearea-editor").focus();
    }else{
      $(".emojionearea-editor").focusout();
    }
    return false;
  })
  //when click document except $(".icon-chat") , we must remove class ".icon-chat"
  $(document).on("click", function(e){
    if($(e.target).is(".emojionearea-button")){
      return;
    }else{
      $(".icon-chat").removeClass("click-on");
    }
  })
};


let toggleNotificationBoard = () => {
  $("#button-notification").on("click" , function(){    
    $("#notification-board").fadeToggle(200);
    $("#notification-bell-count").fadeOut(200);
    return false;
  })
  $("#notification-board").on("click", function(){    
    return false ;
  });
  
  $(document).on("click" , function() {
    $("#notification-board").fadeOut("fast");    
  })
};

let initialConfigure = () => {
  $("#notification-board").hide(); 
  $("#navbar-right").find("li:first-child a").addClass("active");
  $(".navigation__nav-item").on("click" , function(){
    $(".navigation__nav-link").each( (index,elem) => {
      $(elem).removeClass("active");
    });
    $(this).find("a.navigation__nav-link").addClass("active");
  });
  //hide loading conctact
  $(".search-users-box__loading").hide();
  $(".request-contact-sent-box__loading").hide();
  $(".request-contact-received-box__loading").hide();
  //if request-contact-sent-box has contains at least an item, it will show request-contact-sent-box__read-more, else none 
  if($("#link-request-contact-sent ul.request-contact-sent-list").children().length){
    $(".request-contact-sent-box__read-more").show();
  }else{
    $(".request-contact-sent-box__read-more").hide();
  }  
 

  // $("#left-side ul.list-messenger-users").find("li:first-child").click();

  $("#select-type-chat").on("change", function(){
    let targetId = $("option:selected", this).data("target");
    $(".tab-pane").each( function(index, elem){
      $(elem).removeClass("show active");
    })    
    $(`${targetId}`).addClass("show active");
    $(".left-side").getNiceScroll().resize();   
  })
};

// let enableSeenGroup = false ;
let enableSeenPrivate = false ;
let currentNumberOfMessages = 0;
let newNumberOfMessages = 0;

//bỏ bước đầu click chuột
let enableClickLeftSide = false ;
function switchTabConversation(){
  $(".left-side-conversations__content-item").off("click").on("click", function(){    
      let targetId = $(this).find("a").data("chat");
      $(".nav-link").removeClass("active");
      $(`.a[data-chat = ${targetId}]`).addClass("active");   
      $(this).find(".nav-link").tab("show");         
      $(".initial-conversation").hide();
      
      currentNumberOfMessages = +$(`.right-side__middle-content[data-chat = ${targetId}]`).find(".bubble").length;
      
      niceScrollChatBox(targetId);
      enableEmojiChat(targetId);    
      chatTextAndEmoji(targetId) ;  
      chatImage(targetId);
      chatAttachment(targetId);
      receiverHasSeenMessage(targetId);  
      photoSetGrid();
  })
};

function updateNumberOfMessages(receiverId){
  newNumberOfMessages = currentNumberOfMessages+1;
  checkScreenShow(receiverId);
}


//Have 2 cases occur: 
//case 1 : receiver click conversation item
//case 2 : receiver opened convesation before
function receiverHasSeenMessage(senderId){  
  if(enableSeenPrivate){
    $.ajax({
      type: "put",
      url: "/conversation/receiver-has-seen-message",
      data: {senderId},
      global :false ,
      success: function (data) {       
        if(data.success){             
          let {receiverId} = data;
          let dataToEmit = { senderId, receiverId };    
          socket.emit("receiver-has-seen-message", dataToEmit);
        }
      },
      error : function(err){
       
      }
    });
  }
  enableSeenPrivate=true;  
};
//check whether screen right side show or not, if show and message is sent, it status-message will be "seen"
function checkScreenShow(receiverId){
  newNumberOfMessages = +$(`.right-side__middle-content[data-chat = ${receiverId}]`).find(".bubble").length;
  if($(`#to-${receiverId}`).hasClass("active") && newNumberOfMessages > currentNumberOfMessages){
    receiverHasSeenMessage(receiverId)    
    currentNumberOfMessages = newNumberOfMessages;
    newNumberOfMessages = 0;
  }
}

socket.on("response-receiver-has-seen-message", data => {  
  $(`.right-side__middle-content[data-chat = ${data.receiverId}] div.bubble:last-child`).find(".status-messenger").text("Đã xem");
  checkScreenShow(data.receiverId);
}) 

function flashMasterNotify(){
  let notify = $(".alert-master-success").text();  
  if(notify.length){
    alertify.set('notifier','position', 'right-bottom');
    alertify.success(notify);
  }
}

function enableConverToImage(){
  $(".convert-emoji").each( function(){
    let original = $(this).html() ;     
    let converted = emojione.toImage(original) ; 
    $(this).html(converted);
  })
};


$(document).ready(function () {
  initialConfigure();

  //create nice scroll with smooth for left side
  niceScrollLeftSide();

  //init ajax Loadings
  ajaxLoading();

  //when type chat changing, button switch show/hide
  switchButtonGroupChat();

  //when show Modal contact, notification counter at contact toolbar in navagation will be hidden
  showModalContacts();

  // //create emotion for chatbox 
  // enableEmojiChat("1234");

  toggleNotificationBoard();

  //flash message at master screen
  flashMasterNotify();

  //Enable convert emoji to Images
  enableConverToImage();

  switchTabConversation();

  checkScreenShow();
  
  let dataTarget = $(".left-side-conversations__content-item").eq(0).find(".nav-link").attr("data-target");
  // $(".left-side-conversations__content-item").eq(0).find(".nav-link").attr("data-target","")
  $(".left-side-conversations__content-item").eq(0).find(".nav-link").click().removeClass("active");
  $(".initial-conversation").show();
  $(".screen-chat").find(".tab-pane:first-child").removeClass("show active");
 
 
});
