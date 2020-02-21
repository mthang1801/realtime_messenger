function acceptRequestAddContact(){
  $(".btn-accept-request-contact").off("click").on("click", function(){
    let userId = $(this).data("uid");
    console.log(userId);
  })
}
