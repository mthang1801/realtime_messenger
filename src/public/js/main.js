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
  console.log($(`.right-side__middle-content[data-chat = ${chatBoxId}]`)[0].scrollHeight);
  $(`.right-side__middle-content[data-chat = ${chatBoxId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#4A4A4A',
    cursorwidth: '7px',
    scrollspeed: 50,
    autohidemode : "leave",
  });
  $(`.right-side__middle-content[data-chat = ${chatBoxId}]`).attr("zIndex", "1000").scrollTop($(`.right-side__middle-content[data-chat = ${chatBoxId}]`)[0].scrollHeight);
};

let spinLoaded = () => {
  $("#loading").css("display" , "none");
  $(".modal-loading").css("display", "none");
};

let spinLoading = () => {
  $("#loading").css("display", "block");
  $(".modal-loading").css("display", "block");
};

let ajaxLoading = () => {
  $(document).ajaxStart(() =>{
    spinLoading();
  }).ajaxStop(() => {
    spinLoaded();        
  })
};

let showModalContacts = () => {
  $("#modalContact").on("show.bs.modal", () => {
    $("#contact-count").fadeOut("fast");
  })
};

let photoSetGrid = (layoutNumber) => {
  let countRows = Math.ceil($("#modalImage").find("div.all-images>img").length / layoutNumber );
  let layoutStr = new Array(countRows).fill(layoutNumber).join("");  
  $("#modalImage").find("div.all-images").photosetGrid({
    gutter : "5px",
    layout : layoutStr,
    highresLinks : true ,
    rel: 'withhearts-gallery',
    onInit : () => {}, 
    onComplete : () => {
      $(".all-images").attr("style", "");
      $(".all-images a").colorbox({
        photo: true,
        scalePhotos: true,
        maxHeight: '90%',
        maxWidth: '90%'
      });
    }
  })
};

let switchButtonGroupChat = () => {
  $("#select-type-chat").on("change" , function(e){
    if($(this).val() == "private-chat"){
      $("#btn-create-group-chat").hide();
    }else{
      $("#btn-create-group-chat").show();
    }
  })
}

let enableEmojiChat = (dataID) => {
  $(`.write-chat[data-chat=${dataID}]`).emojioneArea({
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
        $(".write-chat").val(this.getText());
      }    
    }
  });

 
  
  $(".icon-chat").on("click" ,  function(){  
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
    $("#notification-board").fadeToggle("fast");
    $("#notification-bell-count").fadeOut("fast");
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
 

  $("#left-side ul.list-messenger-users").find("li:first-child").click();

  $("#select-type-chat").on("change", function(){
    let targetId = $("option:selected", this).data("target");
    $(".tab-pane").each( function(index, elem){
      $(elem).removeClass("show active");
    })    
    $(`${targetId}`).addClass("show active");
    $(".left-side").getNiceScroll().resize();   
  })
};

function switchTabConversation(){
  $(".left-side__conversations-item").off("click").on("click", function(){
    let targetId = $(this).find("a").data("chat");
    $(".nav-link").removeClass("active");
    $(`.a[data-chat = ${targetId}]`).addClass("active");
   
    $(this).find(".nav-link").tab("show");
    let timer = setInterval(()=>{niceScrollChatBox(targetId.toString())},500)
    clearInterval(timer);
    
  })
}

function flashMasterNotify(){
  let notify = $(".alert-master-success").text();  
  if(notify.length){
    alertify.set('notifier','position', 'right-bottom');
    alertify.success(notify);
  }
}


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

  //set grid for photo at image Modal
  photoSetGrid(3);

  //create emotion for chatbox 
  enableEmojiChat("1234");

  toggleNotificationBoard();

  //flash message at master screen
  flashMasterNotify();

  switchTabConversation();
   
  if($(".left-side__conversations-item").length){
    $(".left-side__conversations-item:first-child").find(".nav-link:first-child").click();
  }

});
