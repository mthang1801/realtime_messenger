let userAvatar = null;
let userInformation = {}; //global variable to save modified fields
let userOriginalInformation = {};
let userOriginalAvatar = null;
function updateUserInfor(){
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
      $(this).val(userInformation.username) ;
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
      $(this).val("");
      delete userInformation.phone;
      return false ;
    };
    userInformation.phone = value ;
  });
};

function updateUserAvatarAndInfor(){
  $("#btn-update-profile").on("click", function(){   
    if($.isEmptyObject(userInformation) && !userAvatar){
      alertify.notify("Bạn chưa thay đổi thông tin của bất kỳ trường nào để tiến hành cập nhật", "error", 7);
      return false;
    };
    if(userAvatar && $.isEmptyObject(userInformation)){
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
            $("#alert-update-profile-error").empty().hide();
            $("#alert-update-profile-success").empty().show().text("Cập nhật ảnh đại diện thành công");
          }
        },
        error: function(error){
          $("#btn-cancel-update-profile").click();
          $("#alert-update-profile-success").empty().hide();
          $("#alert-update-profile-error").show().text(`Cập nhật ảnh đại diện không thành công, ${error.responseText}`);
          return false ;
        }
      });
    } 

    //userInformation exist but userAvatar none
    if(!$.isEmptyObject(userInformation) && !userAvatar){
      $.ajax({
        type: "put",
        url: "/user/update-info",
        data: userInformation,
        success: function (response) {
          if(response.success){
            $("#alert-update-profile-success").text("Cập nhật tài khoản thành công").show();
            $("#alert-update-profile-error").empty().hide();      
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
        }
      });
    }
  })  
};

$(document).ready(function () {
  updateUserInfor();
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


  //solve btn-cancel-update-profile
  $("#btn-cancel-update-profile").on("click", function(){  
    console.log(userOriginalInformation) ;
    $("#input-change-username-profile").val(userOriginalInformation.username) ;
    userOriginalInformation.gender == "male" ? $("#input-change-gender-male").checked :  $("#input-change-gender-female").checked;
    $("#input-change-address-profile").val(userOriginalInformation.address);
    $("#input-change-phone-profile").val(userOriginalInformation.phone);
    $("#image-update-avatar").attr("src", userOriginalAvatar);
    $("#input-change-avatar").val("");
    userInformation = {};
    userAvatar = null;   
  })

  //update user avatar and user infor ( solve btn-update-profile)
  updateUserAvatarAndInfor();

});
