//when click btn-chat, leftSide will prepend conversation 
function chatWithUserContact(){
  $(".btn-chat").off("click").on("click", function(e){
    e.preventDefault();
    let targetId = $(this).data("uid");
    let targetName = $(`.contact-list__item[data-uid = ${targetId}]`).find(".card-user__body-text--username").text().trim();
    let targetOriginalAvatar =  $(`.contact-list__item[data-uid = ${targetId}]`).find("div.card-user__body-avatar > img").attr("src");
    let targetAvatar = targetOriginalAvatar.split("/")[2];  
    let checkExistsConversationAtLeftSide = $("ul.left-side-conversations__content-list").find(`.person[data-chat = ${targetId}]`).length;
    if(checkExistsConversationAtLeftSide==0){
     //#region conversation left side
      let userConversationLeftSide = `
      <li class="nav-item left-side-conversations__content-item" >
        <a class="nav-link person"  href="javascript:void(0)" data-target="#to-${targetId}" data-chat="${targetId}" >
          <div class="person__avatar">
            <img src="images/users/${targetAvatar}" class="person__avatar-image" >
          </div>
          <div class="person__infor">
            <div class="person__infor--username">
              ${targetName}
            </div>
            <div class="person__infor--messenger convert-emoji">
              Bắt đầu trò chuyện
            </div>
          </div>
          <div class="person__config" data-uid="${targetId}">
            <div class="person__config--setting">
              <span>...</span>       
            </div>
            <div class="person__config--menu" data-uid="${targetId}">
              <div class="remove-conversation">Xóa hội thoại</div>
            </div>
            <div class="person__config--time" data-uid="${targetId}">
              
            </div>
          </div>          
        </a>
      </li> 
    `

    $("#all-conversations").find("ul").prepend(userConversationLeftSide);
    $("#private-conversations").find("ul").prepend(userConversationLeftSide);
    
    //#endregion

    //#region conversation right side
    let userConversationRightSide = `
    <div class="right-side__screen tab-pane" id="to-${targetId}" >
      <div class="right-side__top">
        <div class="right-side__top--leftside">
          To :
          <span class="right-side__top--leftside-username">
            ${targetName}
          </span>
        </div>
        <div class="right-side__top--rightside">
          <span class="right-side__top--rightside-item">
            <a href="#modalImage-${targetId}" data-toggle="modal" class="btn-link btn-dark-grey image-libraries" data-uid="${targetId}">Hình ảnh <i class="fas fa-image"></i></a>
          </span>
          <span class="right-side__top--rightside-item">
            <a href="#modalAttachFile-${targetId}" data-toggle="modal" class="btn-link btn-dark-grey">Tệp đính kèm <i class="fas fa-paperclip"></i></a>
          </span>
        </div>
      </div>
      <div class="right-side__middle ">
        <div class="right-side__middle-content convert-emoji" data-chat="${targetId}">
          
        </div>
      </div>
      <div class="right-side__bottom convert-emoji" data-chat="${targetId}">
        <input type="text" class="right-side__bottom-write write-chat" id="chat-text-${targetId}" data-conversation-type="private"  data-chat="${targetId}" style="display:none">
        <div class="right-side__bottom-icons">
          <div class="right-side__bottom-icons-item">
            <a href="#" class="icon-chat"><i class="fas fa-smile"></i></a>
          </div>					
          <div class="right-side__bottom-icons-item">        
            <label for="image-chat-${targetId}" class="image-chat" data-chat="${targetId}"><input type="file" class="d-none" id="image-chat-${targetId}" name="msg-image-chat"><i class="fas fa-image"></i></label>
          </div>
          <div class="right-side__bottom-icons-item">
            <label for="attach-chat-${targetId}" data-chat="${targetId}">  <input type="file" class="d-none" id="attach-chat-${targetId}" name="msg-attachment-chat"><i class="fas fa-paperclip"></i></label>
          </div>
          <div class="right-side__bottom-icons-item">
            <a href="#modalVideoCall" data-toggle="modal" id="video-chat"><i class="fas fa-video"></i></a>
          </div>				
        </div>
      </div>
    </div>
    `

    $("#screen-chat").append(userConversationRightSide);
    $(".right-side__screen").removeClass("active");
    //#endregion

    //#region conversation image modal
    let userConversationImageModal = `
    <div class="modal fade" id="modalImage-${targetId}" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thư viện Hình Ảnh</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="modal-body">
            <div class="all-images" style="visibility: hidden;background-color: #DADDE1">
                    
            </div>
          </div>				
        </div>
      </div>
    </div>
    `

    $("body").append(userConversationImageModal);
    //#endregion

    //#region user conversation attachment modal
    let userConversationAttachmentModal = `      
    <div class="modal fade" id="modalAttachFile-${targetId}" tabindex="-1" role="dialog" aria-labelledby="modelTitleId" aria-hidden="true"-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tập tin đính kèm</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body modal-attachment-libraries">
              
            </div>        
          </div>
        </div>
      </div>
    `

    $("body").prepend(userConversationAttachmentModal);
    
    }else{
      $(`.person[data-chat = ${targetId}]`).on("pushConversationToTop", function(){
        let dataToMove = $(this).parent();
        $(this).closest().prepend(dataToMove);
        $(this).off("pushConversationToTop");
      });
      $(`.person[data-chat = ${targetId}]`).trigger("pushConversationToTop");
    }
   
    $("#modalContact").modal("hide");
    $("#modalContact").on("hidden.bs.modal" , function(){
      $(".initial-conversation").hide();
      $(".person").removeClass("active");
      $(".right-side__screen").removeClass("active");    
      $(`.person[data-chat = ${targetId}]`).addClass("active");
      $(`#to-${targetId}`).addClass("active");
      $(`#to-${targetId}`).getNiceScroll().resize();
      niceScrollChatBox(targetId);
      switchTabConversation();    
      enableEmojiChat(targetId);    
      chatTextAndEmoji(targetId) ;  
      chatImage(targetId);
      chatAttachment(targetId);
      receiverHasSeenMessage(targetId);  
      photoSetGrid();
    })
  })
}

$(document).ready(function () {
  chatWithUserContact();
});
