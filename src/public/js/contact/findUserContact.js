function callSearchUsers(event){
  if(event.which == 13 || event.type == "click"){
    let keyWord = $("#input-search-users").val();
    
    if(keyWord == ""){
      alertify.notify("Để tìm kiếm người dùng khác, vui lòng nhập tên của họ", "error",7 )  ;
      return false ;
    }
    
    $.get(`/users/find-users?searchKey=${keyWord}`, function(data){
      if(data){       
        $("#search-users-box").find("ul.search-users-box__list-users").empty().append(data);
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
