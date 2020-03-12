let loadingAllConversations = true ;
let loadingPrivateConversations = true ;
let loadingGroupConversations= true ;
function readMoreConversation(){
  $(".left-side").off("scroll").on("scroll", function(){
    let conversationType = $("#select-type-chat").val();
    let conversationTarget = $("option:checked","#select-type-chat").data("target");    
    let skipNumbersGroupConversations = $("#group-conversations").find("ul").children().length;
    let skipNumbersPrivateConversations = $("#private-conversations").find("ul").children().length;  
    let currentOffsetTop = $(this).scrollTop();
    if($(this)[0].scrollHeight - $(this)[0].clientHeight <= $(this).scrollTop()  + 15){     
      switch(conversationType){
        case "all-chat" : readMoreAllConversations(skipNumbersPrivateConversations, skipNumbersGroupConversations, currentOffsetTop); break;
        case "private-chat": readMorePrivateConversations(skipNumbersPrivateConversations, currentOffsetTop); break;
        case "group-chat" : readMoreGroupConversations(skipNumbersGroupConversations, currentOffsetTop); break;
       };
    }
  })
};

function readMoreAllConversations(skipPrivates, skipGroups, currentOffsetTop){
  if(loadingAllConversations){
    loadingAllConversations = false ;
    console.log("OK");
    $.ajax({
      type: "get",
      url: `/conversation/read-more-all-conversations?skipPrivates=${skipPrivates}&skipGroups=${skipGroups}`,  
      global : false ,
      beforeSend: function(){
        $("#all-conversations").find("ul").append(`<div class="loading-read-more-conversations"><div></div><div></div><div></div><div></div></div>`);
      },
      success: function (data) {
        let  {
          readMoreAllConversationsLeftSide,
          readMorePrivateConversationsLeftSide, 
          readMoreGroupConversationsLeftSide,
          readMoreAllConversationsRightSide,
          readMoreAllConversationsImageModal,
          readMoreAllConversationsAttachmentModal
        } = data ;         
          $("#all-conversations").find(".loading-read-more-conversations").remove();
           //embed left side includes all-conversations, private conversations and group conversation
          $("#all-conversations").find("ul").append(readMoreAllConversationsLeftSide);
          //check conversation has whether existed, if it has existed , remove before render
          let listConversationsId = [];
          let listConversationRemove = [];
          $("#all-conversations").find(".person").each( function(index, elem) {
              listConversationsId.push($(this).data("chat"));
          });                           
          for(let i = 0 ; i < listConversationsId.length - 1; i++){                      
            for(let j = i+1 ; j < listConversationsId.length ; j++){
              if(listConversationsId[i] == listConversationsId[j] && i != j){               
                listConversationRemove.push(j);                
              }
            }
          }         
          $("#all-conversations").find(".person").each( function(index, elem) {
            for(item of listConversationRemove){
              if(index == item){
                $(elem).parent().remove();
              }
            }
          });    
          listConversationsId = [];
          listConversationRemove = [];
          
          $("#private-conversations").find("ul").append(readMorePrivateConversationsLeftSide);
          $("#private-conversations").find(".person").each( function(index, elem) {
            listConversationsId.push($(this).data("chat"));
          });                           
          for(let i = 0 ; i < listConversationsId.length - 1; i++){                      
            for(let j = i+1 ; j < listConversationsId.length ; j++){
              if(listConversationsId[i] == listConversationsId[j] && i != j){               
                listConversationRemove.push(j);                
              }
            }
          }                 
          $("#private-conversations").find(".person").each( function(index, elem) {
            for(item of listConversationRemove){
              if(index == item){
                $(elem).parent().remove();
              }
            }
          });    
          $("#group-conversations").find("ul").append(readMoreGroupConversationsLeftSide);          
          $(".left-side").getNiceScroll().resize();
          $(".left-side").scrollTop(currentOffsetTop)
          switchTabConversation();
           //display setting button conversation when hover to conversation Item at left side
          $(".left-side-conversations__content-item").on("mouseover", function(){
            $(this).find(".person__config--setting").css("display", "block");
          });
          $(".left-side-conversations__content-item").on("mouseout", function(){
            $(this).find(".person__config--setting").css("display", "none");
          });
          //embed right side #screen-chat
          $("#screen-chat").append(readMoreAllConversationsRightSide);
          //embed image modal to body
          $("body").append(readMoreAllConversationsImageModal);
          //embed attachment modal to body
          $("body").append(readMoreAllConversationsAttachmentModal);
          loadingAllConversations=true;
          readMoreConversation();
          switchTabConversation();
          socket.emit("check-status");
      },
      error : function(error){
        $("#all-conversations").find(".loading-read-more-conversations").remove();
      }
    });
  }
};

function readMorePrivateConversations(skipPrivates, currentOffsetTop){
  if(loadingPrivateConversations){    
    loadingPrivateConversations = false ;    
    $.ajax({
      type: "get",
      url: `/conversation/read-more-private-conversations?skipPrivates=${skipPrivates}`,  
      global : false ,
      beforeSend: function(){
        $("#private-conversations").find("ul").append(`<div class="loading-read-more-conversations"><div></div><div></div><div></div><div></div></div>`);
      },
      success: function (data) {
        console.log(data);
        let  {          
          readMorePrivateConversationsLeftSide,           
          readMoreAllConversationsRightSide,
          readMoreAllConversationsImageModal,
          readMoreAllConversationsAttachmentModal
        } = data ;         
          $("#private-conversations").find(".loading-read-more-conversations").remove();
           //embed left side includes all-conversations, private conversations and group conversation
          $("#all-conversations").find("ul").append(readMorePrivateConversationsLeftSide);
          //check conversation has whether existed, if it has existed , remove before render
          let listConversationsId = [];
          let listConversationRemove = [];
          $("#all-conversations").find(".person").each( function(index, elem) {
              listConversationsId.push($(this).data("chat"));
          });                           
          for(let i = 0 ; i < listConversationsId.length - 1; i++){                      
            for(let j = i+1 ; j < listConversationsId.length ; j++){
              if(listConversationsId[i] == listConversationsId[j] && i != j){               
                listConversationRemove.push(j);                
              }
            }
          }         
          $("#all-conversations").find(".person").each( function(index, elem) {
            for(item of listConversationRemove){
              if(index == item){
                $(elem).parent().remove();
              }
            }
          });    
          listConversationsId = [];
          listConversationRemove = [];
          
          $("#private-conversations").find("ul").append(readMorePrivateConversationsLeftSide);
          $("#private-conversations").find(".person").each( function(index, elem) {
            listConversationsId.push($(this).data("chat"));
          });                           
          for(let i = 0 ; i < listConversationsId.length - 1; i++){                      
            for(let j = i+1 ; j < listConversationsId.length ; j++){
              if(listConversationsId[i] == listConversationsId[j] && i != j){               
                listConversationRemove.push(j);                
              }
            }
          }                 
          $("#private-conversations").find(".person").each( function(index, elem) {
            for(item of listConversationRemove){
              if(index == item){
                $(elem).parent().remove();
              }
            }
          });      
                   
          $(".left-side").getNiceScroll().resize();
          $(".left-side").scrollTop(currentOffsetTop)
          switchTabConversation();
           //display setting button conversation when hover to conversation Item at left side
          $(".left-side-conversations__content-item").on("mouseover", function(){
            $(this).find(".person__config--setting").css("display", "block");
          });
          $(".left-side-conversations__content-item").on("mouseout", function(){
            $(this).find(".person__config--setting").css("display", "none");
          });
          //embed right side #screen-chat
          $("#screen-chat").append(readMoreAllConversationsRightSide);
          //embed image modal to body
          $("body").append(readMoreAllConversationsImageModal);
          //embed attachment modal to body
          $("body").append(readMoreAllConversationsAttachmentModal);
          loadingPrivateConversations=true;
          readMoreConversation();
          switchTabConversation();
          socket.emit("check-status");
      },
      error : function(error){
        $("#private-conversations").find(".loading-read-more-conversations").remove();
      }
    });
  }
};

function readMoreGroupConversations(skipGroups, currentOffsetTop){
  if(loadingGroupConversations){
    loadingGroupConversations = false ;
    
    $.ajax({
      type: "get",
      url: `/conversation/read-more-group-conversations?skipGroups=${skipGroups}`,  
      global : false ,
      beforeSend: function(){
        $("#group-conversations").find("ul").append(`<div class="loading-read-more-conversations"><div></div><div></div><div></div><div></div></div>`);
      },
      success: function (data) {
        console.log(data);
        let  {          
          readMoreGroupConversationsLeftSide,
          readMoreAllConversationsRightSide,
          readMoreAllConversationsImageModal,
          readMoreAllConversationsAttachmentModal
        } = data ;         
          $("#group-conversations").find(".loading-read-more-conversations").remove();
           //embed left side includes all-conversations, private conversations and group conversation
          $("#all-conversations").find("ul").append(readMoreGroupConversationsLeftSide);
          //check conversation has whether existed, if it has existed , remove before render
          let listConversationsId = [];
          let listConversationRemove = [];
          $("#all-conversations").find(".person").each( function(index, elem) {
              listConversationsId.push($(this).data("chat"));
          });                           
          for(let i = 0 ; i < listConversationsId.length - 1; i++){                      
            for(let j = i+1 ; j < listConversationsId.length ; j++){
              if(listConversationsId[i] == listConversationsId[j] && i != j){               
                listConversationRemove.push(j);                
              }
            }
          }         
          $("#all-conversations").find(".person").each( function(index, elem) {
            for(item of listConversationRemove){
              if(index == item){
                $(elem).parent().remove();
              }
            }
          });    
         
          $("#group-conversations").find("ul").append(readMoreGroupConversationsLeftSide);          
          $(".left-side").getNiceScroll().resize();
          $(".left-side").scrollTop(currentOffsetTop)
          switchTabConversation();
           //display setting button conversation when hover to conversation Item at left side
          $(".left-side-conversations__content-item").on("mouseover", function(){
            $(this).find(".person__config--setting").css("display", "block");
          });
          $(".left-side-conversations__content-item").on("mouseout", function(){
            $(this).find(".person__config--setting").css("display", "none");
          });
          //embed right side #screen-chat
          $("#screen-chat").append(readMoreAllConversationsRightSide);
          //embed image modal to body
          $("body").append(readMoreAllConversationsImageModal);
          //embed attachment modal to body
          $("body").append(readMoreAllConversationsAttachmentModal);
          loadingGroupConversations=true;
          readMoreConversation();
          switchTabConversation();
          socket.emit("check-status");
        
      },
      error : function(error){
        $("#group-conversations").find(".loading-read-more-conversations").remove();
      }
    });
  }
}
$(document).ready(function () {
  readMoreConversation();
})
