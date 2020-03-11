function readMoreMessengers(targetId){
  $(`.right-side__middle-content[data-chat = ${targetId}]`).off("scroll").on("scroll", function(){
  
    let skipNumber = $(this).children().length;
    let firstMessage = $(this).find("div.bubble:first");
    let currentOffsetTop = firstMessage.offset().top - $(this).scrollTop() ; 
    if($(this).scrollTop() == 0){           
      $.ajax({
        type: "get",
        url: `/conversation/read-more-messengers?skipNumber=${skipNumber}&targetId=${targetId}`,
        global : false,
        beforeSend: function(){   
          if(!$(`.right-side__middle-content[data-chat = ${targetId}]`).find(".loading-read-more-messengers").length){
            $(`.right-side__middle-content[data-chat = ${targetId}]`).prepend(`<div class="loading-read-more-messengers"><div></div><div></div><div></div></div>`)
          }
        },
        success: function (data) {
          $(`.right-side__middle-content[data-chat = ${targetId}]`).prepend(data);
          $(`.right-side__middle-content[data-chat = ${targetId}]`).find(".loading-read-more-messengers").remove();
          let scrollPage =  $(`.right-side__middle-content[data-chat = ${targetId}]`);     
          scrollPage.scrollTop(firstMessage.offset().top - currentOffsetTop);       
        },
      });
   }
  })
}

