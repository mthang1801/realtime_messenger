//create read more search  all users
//it is triggered when button read-more-see-all-user is clicked
function readMoreSearchAllUsers(searchKey=null){
  $("#btn-read-more-search-all-users").off("click").on("click", function(){
    let skipNumber = $("#search-users-box").find("ul").children().length;
    if(skipNumber==0){
      return false ;
    }
    $.ajax({
      type: "get",
      url: `/contact/read-more-search-all-users?skipNumber=${skipNumber}&searchKey=${searchKey}`,
      global : false ,
      beforeSend: function(){
        $(".search-users-box__read-more").hide();
        $(".search-users-box__loading").show();
      },
      success: function (data) {
        if(data){  
          $(".search-users-box__read-more").hide();
          $(".search-users-box__loading").hide();
          $("#search-users-box").find("ul.search-users-box__list-users").append(data);          
          addContact();
          cancelRequestAddContact();
          rejectRequestAddContact();
          acceptRequestAddContact();
        }else{
          $("#search-users-box").find("ul.search-users-box__list-users").empty().html(`<h5 class="mt-5 text-danger text-center"><i class="far fa-frown"></i> Không tìm thấy người dùng</h5>`);
          $(".search-users-box__read-more").hide();
          $(".search-users-box__loading").hide();
        }        
      },
      error : function(error){
        console.log(error);        
      }
    });
  })
};

//read more for request-contact-sent-box panel
function readMoreRequestContactSent(){
  $("#btn-read-more-request-contact-sent").off("click").on("click", function(){
    let skipNumber = $("#link-request-contact-sent ul.request-contact-sent-list").children().length;
    if(skipNumber==0){
      return false ;
    }
    $.ajax({
      type: "get",
      url: `/contact/read-more-request-contact-sent?skipNumber=${skipNumber}`,
      beforeSend : function(){
        $(".request-contact-sent-box__read-more").hide();
        $(".request-contact-sent-box__loading").show();
      },
      success: function (data) {
        if(data){
          $("#link-request-contact-sent").find("ul.request-contact-sent-list").append(data);
          $(".request-contact-sent-box__read-more").show();
          $(".request-contact-sent-box__loading").hide();
          readMoreRequestContactSent();
          cancelRequestAddContact();          
        }else{
          $(".request-contact-sent-box__read-more").hide();
          $(".request-contact-sent-box__loading").show();
        }
      },
      error : function (error) {
        if(error){
          alertify.notify(error.responseText, "error", 7);
          $(".request-contact-sent-box__read-more").hide();
          $(".request-contact-sent-box__loading").hide();
        }
      }
    });
  })
};

//read more for request-contact-received-box panel
function readMoreRequestContactReceived(){
  $("#btn-read-more-request-contact-received").off("click").on("click", function(){
    let skipNumber = $("#link-request-contact-received").find("ul.request-contact-received-list").children().length ;
    if(skipNumber==0){
      return false ;
    }
    $.ajax({
      type: "get",
      url: `/contact/read-more-request-contact-received?skipNumber=${skipNumber}`,
      beforeSend : function(){
        $(".request-contact-received-box__read-more").hide();
        $(".request-contact-received-box__loading").show();
      },
      success: function (data) {
        if(data){
          $(".request-contact-received-box__read-more").show();
          $(".request-contact-received-box__loading").hide();
          $("#link-request-contact-received").find("ul.request-contact-received-list").prepend(data);
          readMoreRequestContactReceived();
          acceptRequestAddContact();
          rejectRequestAddContact();
        }else{
          $(".request-contact-received-box__read-more").hide();
          $(".request-contact-received-box__loading").hide();
        }
      },
      error : function(error){
        alertify.notify(error.responseText, "error", 7);
        $(".request-contact-received-box__read-more").hide();
        $(".request-contact-received-box__loading").hide();
      }
    });
  })
};

$(document).ready(function () {
  readMoreRequestContactSent();
  readMoreRequestContactReceived();
});
