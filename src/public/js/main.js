/**
 * created by MVT on 13/02/2020
 */

let niceScrollLeftSide = () => {
  $(".left-side").niceScroll({
    cursorcolor: "#828282", // change cursor color in hex  
    scrollspeed: 50,
    smoothscroll: true, // scroll with ease movement
    cursormaxheight: 32,
    horizrailenabled: false,
    autohidemode : "leave"
  })
};

let niceScrollChatBox = () => {
  $(".right-side__middle-content").niceScroll({
    cursorcolor : "#828282", 
    scrollspeed: 50,
    smoothscroll: true, // scroll with ease movement
    cursormaxheight: 32,
    horizrailenabled: false,
    autohidemode : "leave"
  })
  $(".right-side__middle-content").scrollTop($(".right-side__middle-content")[0].scrollHeight);
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
    $("#notification-contact-count").fadeOut("fast");
  })
};

let photoSetGrid = (layoutNumber) => {
  let countRows = Math.ceil($("#modalImage").find("div.all-images>img").length / layoutNumber );
  let layoutStr = new Array(countRows).fill(layoutNumber).join("");
  console.log(layoutStr);;
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
    $("#notification-count").fadeOut("fast");
    return false;
  })
  $(document).on("click" , () => {
    $("#notification-board").fadeOut("fast");    
  })
};

let initialConfigure = () => {
  $("#notification-board").fadeToggle();  
};

$("#select-type-chat").on("change" , function(){
  console.log($(this).val());
})


$(document).ready(function () {
  initialConfigure();

  //create nice scroll with smooth for left side
  niceScrollLeftSide();

  //create nice scroll with smooth for right side middle
  niceScrollChatBox();

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

});
