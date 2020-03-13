function callSearchUsers(event){
  if(event.which == 13 || event.type == "click"){
    let searchKey = $("#input-search-users").val();
    
    if(searchKey == ""){
      alertify.notify("Để tìm kiếm người dùng khác, vui lòng nhập tên của họ", "error",7 )  ;
      $("#search-users-box").find("ul.search-users-box__list-users").empty();
      return false ;
    }
    
    $.get(`/contact/find-users?searchKey=${searchKey}`, function(data){
  
      if(data.trim()!=""){  
        $("#search-users-box").find("ul.search-users-box__list-users").empty().append(data);
        $(".search-users-box__read-more").show();
        readMoreSearchAllUsers(searchKey);
        addContact();
        cancelRequestAddContact();
        rejectRequestAddContact();
        acceptRequestAddContact();
      }else{
        $("#search-users-box").find("ul.search-users-box__list-users").empty().html(`<h5 class="mt-5 text-danger text-center"><i class="far fa-frown"></i> Không tìm thấy người dùng</h5>`)
      }     
    }).fail(function(err){
      console.log(err);
    })
  }
}

$(document).ready(function () {
  $("#input-search-users").on("keyup", callSearchUsers);
  $("#btn-search-users").on("click", callSearchUsers);
});
