let userAvatar = null;
let userInformation = {}; //global variable to save modified fields
let userOriginalInformation = {};
let userOriginalAvatar = null;
function eventUpdateUserProfile(){
  $("#input-change-avatar").on("change", function(){
      let fileData = $(this).prop("files")[0];
      let match = ["image/png", "image/jpg", "image/jpeg"];
      let maxSize = 1024*1024;      
      if($.inArray(fileData.type, match)==-1){
        alertify.notify("File hình ảnh phải có đuôi jpg, jpeg, hoặc png", "error", 7);
        $(this).val("");
        return false ;
      }      
      if(fileData.size > maxSize) {
        alertify.notify("Kích thước của file quá lớn, vui lòng chọn file có kích thước không quá 1MB", "error", 7);
        $(this).val("");
        return false ;
      }      

      if(typeof(FileReader) !== undefined){
        let imagePreview = $("#update-avatar");
        imagePreview.empty();

        let fileReader = new FileReader();
        fileReader.onload = (event)=>{          
          $("<img>", {
            "src" : event.target.result,
            "class" : "general-setting__update-avatar-image",
            "id" : "image-update-avatar",
            "alt" : fileData.name
          }).appendTo(imagePreview);
        };              
        fileReader.readAsDataURL(fileData)
        let formData = new FormData();

         formData.append("avatar", fileData)
         userAvatar = formData;        
      }else{
        alertify.notify("Trình duyệt của bạn không hỗ trợ trình đọc file, vui lòng chọn trình duyệt khác","error", 7);
      }      
  });
  //change username
  $("#input-change-username-profile").on("change", function(){
    let value = $(this).val().trim();
    let match = /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    if(!match.test(value) || value == ""|| value.length < 3){
      alertify.notify("username không được để trống hoặc chứa các ký tự đặc biệt và có ít nhất 3 ký tự", "error", 7);
      $(this).val(userOriginalInformation.username) ;
      delete userInformation.username;
      return false ;
    }
    userInformation.username = value;
  });
  //change gender male
  $("#input-change-gender-male").on("change", function(){
   let value = $(this).val();
   if(value != "male"){
     alertify.notify("Bạn đã thay đổi giá trị của trường này, điều này là không hợp lệ và vi phạm chính sách người dùng", "error", 7);
     $(this).val("male");
     delete userInformation.gender;
     return false ;
   }
   userInformation.gender = value;
  });
  //change gender female
  $("#input-change-gender-female").on("change", function(){
    let value = $(this).val();
    if(value != "female"){
      alertify.notify("Bạn đã thay đổi giá trị của trường này, điều này là không hợp lệ và vi phạm chính sách người dùng", "error", 7);
      $(this).val("female");
      delete userInformation.gender;
      return false ;
    }
    userInformation.gender = value;
  });
  //change address
  $("#input-change-address-profile").on("change", function(){
    let value= $(this).val();    
    if(value.length > 255){
      alertify.notify("Địa chỉ của bạn quá dài, vui lòng nhập không quá 255 ký tự","error", 7);
      $(this).val(userOriginalInformation.address);
      delete userInformation.address;
      return false ;
    };
    userInformation.address = value ;
  });
  //change phone number
  $("#input-change-phone-profile").on("change", function(){
    let value= $(this).val();  
    let match = /^(0)[0-9]{9,10}$/
    if(!match.test(value)){
      alertify.notify("Số điện thoại không hợp lệ","error", 7);
      $(this).val(userOriginalInformation.phone);
      delete userInformation.phone;
      return false ;
    };
    userInformation.phone = value ;
  });
};


function updateUserAvatarAndInfor(){
  $("#btn-update-profile").on("click", function(){       
    Swal.fire({
      icon : "warning",
      title : "Bạn có đồng ý cập nhật tài khoản không?",
      showCancelButton : true ,
      cancelButtonText : "Quay lại",
      confirmButtonText : "Đồng ý",
      cancelButtonColor : "#d62e18",
      confirmButtonColor : "#070be6",
      width : "40rem"
    }).then(result => {
      if(result.value){
        if($.isEmptyObject(userInformation) && !userAvatar){
          alertify.notify("Bạn chưa thay đổi thông tin của bất kỳ trường nào để tiến hành cập nhật", "error", 7);
          return false;
        };
      
        //userAvatar exists, but userInformation does not
        if(userAvatar && $.isEmptyObject(userInformation)){
          updateUserAvatar();      
        } 

        //userInformation exist but userAvatar does not
        if(!$.isEmptyObject(userInformation) && !userAvatar){
          updateUserInfo();
        }

        //both userInformaton and userAvatar exist
        if(!$.isEmptyObject(userInformation) && userAvatar){
          updateBothAvatarAndInfor();
        }    
      }
    })       
  })  
};

function updateUserAvatar(){
  $.ajax({
    type: "put",
    url: "/user/update-avatar",
    data: userAvatar,
    //to request FormData() type to server, we must set dataType, cache, contentType
    processData: false,
    cache: false,
    contentType : false ,
    success: function (response) {
      if(response.success){
        let data = response.data ; 
        $("#navbar-user-avatar").attr("src" , `images/users/${data.avatar}`);         
        userOriginalAvatar=`images/users/${data.avatar}`;
        $("#btn-cancel-update-profile").click();
        $("#alert-update-profile-error").empty().text("").hide();
        $("#alert-update-profile-success").text("Cập nhật ảnh đại diện thành công").show();
      }    
    },
    error: function(error){
      $("#btn-cancel-update-profile").click();
      $("#alert-update-profile-success").text("").hide();
      $("#alert-update-profile-error").text(`Cập nhật ảnh đại diện không thành công, ${error.responseText}`).show();
      return false ;
    }
  });
};

function updateUserInfo(){
  $.ajax({
    type: "put",
    url: "/user/update-info",
    data: userInformation,
    success: function (response) {
      if(response.success){
        $("#alert-update-profile-success").text("Cập nhật thông tin tài khoản thành công").show();
        $("#alert-update-profile-error").empty().text("").hide();      
        userOriginalInformation = {...response.data};
        console.log(userOriginalInformation);
        $(".navigation__nav-username").text(response.data.username);
      }      
    },
    error : function(error){
      let ul = $("<ul></ul>")
      ul.css("listStyle", "none");
      error.responseJSON.forEach( error => {
        ul.append(`<li>${error}</li>`);
      })
      $("#alert-update-profile-success").text("").hide();
      $("#alert-update-profile-error").append(ul).show();
      $("#btn-cancel-update-profile").click();
      return false;
    }
  });
};

function updateBothAvatarAndInfor(){
  $.ajax({
    type: "put",
    url: "/user/update-avatar",
    data: userAvatar,
    //to request FormData() type to server, we must set dataType, cache, contentType
    processData: false,
    cache: false,
    contentType : false ,
    success: function (response) {
      if(response.success){
        let data = response.data ;          
        $.ajax({
          type: "put",
          url: "/user/update-info",
          data: userInformation,
          success: function (response) {
            if(response.success){
              $("#navbar-user-avatar").attr("src" , `images/users/${data.avatar}`);         
              userOriginalAvatar=`images/users/${data.avatar}`;
              $("#alert-update-profile-success").text("Cập nhật tài khoản thành công").show();
              $("#alert-update-profile-error").empty().text("").hide();      
              userOriginalInformation = {...response.data};
              console.log(userOriginalInformation);
              $(".navigation__nav-username").text(response.data.username);
            }            
          },
          error : function(error){
            let ul = $("<ul></ul>")
            ul.css("listStyle", "none");
            error.responseJSON.forEach( error => {
              ul.append(`<li>${error}</li>`);
            })
            $("#alert-update-profile-success").text("").hide();
            $("#alert-update-profile-error").empty().append(ul).show();
            $("#btn-cancel-update-profile").click();
            return false;
          }
        });          
      }
      return;
    },
    error: function(error){
      $("#btn-cancel-update-profile").click();
      $("#alert-update-profile-success").empty().hide();
      $("#alert-update-profile-error").show().text(`Cập nhật ảnh đại diện không thành công, ${error.responseText}`);
      return false ;
    }
  });
};

function updateUserPassword(){
  $("#btn-update-user-password").on("click", function(){
      Swal.fire({
        icon : "warning", 
        title : "Bạn có muốn cập nhật mật khẩu hiện tại?",
        showCancelButton : true , 
        cancelButtonText : "Xem lại",
        confirmButtonText : "Đồng ý",
        confirmButtonColor : "#27ae60",
        cancelButtonColor : "#d62e18",
        reverseButton : true 
      }).then( result => {
        if(result.value){
          let currentPassword = $("#input-current-password-profile").val();
          let newPassword = $("#input-new-password-profile").val();
          let confirmNewPassword = $("#input-confirm-new-password-profile").val();
          let match =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
          if(currentPassword == "" || newPassword == "" || confirmNewPassword == ""){
            $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().text("Các trường phải được điền đầy đủ").show();
            return false ;
          }

          if(!match.test(currentPassword)){
            $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().text("Mật khẩu hiện tại không đúng").show();
            $("#input-current-password-profile").val("");
            $("#input-new-password-profile").val("");
            $("#input-confirm-new-password-profile").val("");
            return false;
          }

          if(!match.test(newPassword)){
            $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().text("Mật khẩu mới không hợp lệ, mật khẩu gồm ít nhất 8 ký tự, gồm số, chữ thường, chữ hoa và ký tự đặc biệt").show();
            $("#input-current-password-profile").val("");
            $("#input-new-password-profile").val("");
            $("#input-confirm-new-password-profile").val("");
            return false;
          }

          if(currentPassword == newPassword){
            $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().text("Mật khẩu mới không được giống với mật khẩu hiện tại").show();
            $("#input-current-password-profile").val("");
            $("#input-new-password-profile").val("");
            $("#input-confirm-new-password-profile").val("");
            return false;
          }

          if(newPassword != confirmNewPassword){
            $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().text("Mật khẩu mới và mật khẩu xác nhận không giống nhau").show();
            $("#input-current-password-profile").val("");
            $("#input-new-password-profile").val("");
            $("#input-confirm-new-password-profile").val("");
            return false ;
          }
          let data = {
            currentPassword : currentPassword,
            newPassword : newPassword ,
            confirmNewPassword : confirmNewPassword
          }
          $.ajax({
            type: "put",
            url: "/user/update-password",
            data: data ,
            success: function (response) {
                if(response.success){
                  $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-success").empty().text("Cập nhật mật khẩu thành công").show();
                  Swal.fire({
                    icon : "success", 
                    position : "top-end",
                    html : "<h3>Hệ thống tự động đăng xuất sau <b></b> giây</h3>",
                    allowOutsideClick : false,
                    timer : 3000,
                    onBeforeOpen : () => {
                      Swal.showLoading();
                      setInterval(()=>{
                        Swal.getContent().querySelector("b").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                      },250)                      
                    }
                  }).then(result => {
                    $.get("/logout", function(){
                      location.reload();
                    })
                  })
                }
            },
            error: function(err){
              console.log(err);
              $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().text(err.responseText).show();                            
              $("#input-current-password-profile").val("");
              $("#input-new-password-profile").val("");
              $("#input-confirm-new-password-profile").val("");
              if(err.responseJSON.dataErrors !== undefined){
                let ul = $("<ul></ul>");
                ul.css("listStyle", "none");
                err.responseJSON.dataErrors.forEach( error => {
                  ul.append(`<li>${error}</li>`)
                })
                $("#alert-update-password-status").removeClass("alert-danger alert-success").addClass("alert-danger").empty().append(ul).show();
                $("#input-current-password-profile").val("");
                $("#input-new-password-profile").val("");
                $("#input-confirm-new-password-profile").val("");
                return;
              }
            }          
          });
        }
      })
  })
}


$(document).ready(function () {
  eventUpdateUserProfile();
  //get user information after page loaded
  userOriginalInformation = {
  //  email : $("#input-disabled-email-profile").val(), //get email in order to prevent user change another email
    username : $("#input-change-username-profile").val(),
    gender : $("#input-change-gender-male").is(":checked") ? "male" : "female",
    address : $("#input-change-address-profile").val(),
    phone : $("#input-change-phone-profile").val()
  };
  //get user avatar after page loaded
  userOriginalAvatar = $("#image-update-avatar").attr("src");


   //update user avatar and user infor ( solve btn-update-profile)
   updateUserAvatarAndInfor();

  //solve btn-cancel-update-profile
  $("#btn-cancel-update-profile").on("click", function(){  
    userInformation = {};
    userAvatar = null; 
    $("#input-change-username-profile").val(userOriginalInformation.username) ;
    userOriginalInformation.gender == "male" ? $("#input-change-gender-male").checked :  $("#input-change-gender-female").checked;
    $("#input-change-address-profile").val(userOriginalInformation.address);
    $("#input-change-phone-profile").val(userOriginalInformation.phone);
    $("#image-update-avatar").attr("src", userOriginalAvatar);
    $("#input-change-avatar").val("");
  })

 
  
  //update user password
  updateUserPassword();
});
