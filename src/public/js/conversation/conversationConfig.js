function conversationConfig(){
  $(".person__config--setting").off("click").on("click", function(e){
    e.stopPropagation();
    let targetId = $(this).parent().data("uid");
    
    if( $(`.person__config--menu[data-uid = ${targetId}]`).is(":visible")){
      $(`.person__config--menu[data-uid = ${targetId}]`).hide();
    }else{
       $(".person__config--menu").each( function(index, elem){
        $(this).hide();
      })
      $(`.person__config--menu[data-uid = ${targetId}]`).show();
      $(document).on("click", function(){
        $(".person__config--menu").hide();
      })
      $(".remove-conversation").off("click").on("click", function(e){
        e.stopPropagation();
        let targetId = $(this).parent().data("uid");
        let isShowScreen = $(`#to-${targetId}`).hasClass("active");
        console.log(targetId);
        $.ajax({
          type: "put",
          url: "/conversation/delete-conversation",
          data: {targetId: targetId},
          success: function (response) {
            if(response.success){
              //remove left side
              $(`.person[data-chat = ${targetId}]`).parent().remove();
              //remove right side
              $(`#to-${targetId}`).remove();
              if(isShowScreen){
                $(".initial-conversation").show();
              }
            }
          },
          error: function (error) {
            alertify.notify(error.responseText, "error" , 7);
            console.log(error);
          }
        });
      })
    }
  });
 
  
}

$(document).ready(function () {
  conversationConfig();
});
