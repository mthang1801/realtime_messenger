let originGroupAvatar = "";
let originGroupName = "";
let groupData = new FormData();
let convertDateTimeToString = (timeStamp) => {
  let dateTime  = new Date(timeStamp);
  let day = dateTime.getDay();
  let dayOfWeek = "";
  switch(day){
    case 0 : dayOfWeek = "Chủ nhật"; break;
    case 1 : dayOfWeek = "Thứ Hai"; break;
    case 2 : dayOfWeek = "Thứ Ba"; break;
    case 3 : dayOfWeek = "Thứ Tư"; break;
    case 4 : dayOfWeek = "Thứ Năm"; break;
    case 5 : dayOfWeek = "Thứ Sáu"; break;
    case 6 : dayOfWeek = "Thứ Bảy"; break;
  };
  //get date
  let date = dateTime.getDate();
  //get month 
  let month = dateTime.getMonth()+1;
  //get year
  let year  = dateTime.getFullYear();
  //get hour
  let hour = dateTime.getHours();
  //get minutes
  let minutes = dateTime.getMinutes();
  if(hour<10){
    hour = "0"+hour;
  }
  if(minutes< 10){
    minutes = "0"+minutes;
  }
  return `${hour}:${minutes}, ${dayOfWeek} ngày ${date}/${month}/${year}`;
}

function changeGroupChatAvatar(){
  $(".group-avatar-image").off("click").on("click", function(e){
    let targetId = $(this).data("uid");    
    $(`#input-update-group-avatar-${targetId}`).click();
    $(`#input-update-group-avatar-${targetId}`).off("change").on("change", function(){      
      let fileData = $(this).prop("files")[0];
      let match = ["image/png", "image/jpg", "image/jpeg"];
      if($.inArray(fileData.type, match) == -1){
        alertify.notify("Kiểu file định dạng không hợp lệ", "error" , 7);
        $(this).val("");
        groupData.delete("group-avatar");
        return false ;
      }

      if(fileData.size > 1024*1024){
        alertify.notify("Kích thước file quá lớn, không thể tải lên được", "error", 7);
        $(this).val("");
        groupData.delete("group-avatar");
        return false ;
      }

      if(typeof (FileReader) != undefined){
        let imagePreview = $(`#group-avatar-box-${targetId}`);
        originGroupAvatar = $(`#group-avatar-image-${targetId}`).attr("src");        
        imagePreview.empty();
        let fileReader = new FileReader();
        
        fileReader.onload = event =>{          
          $("<img>", {
            "src" : event.target.result,
            "class" : "group-avatar-image",
            "id" : `group-avatar-image-${targetId}`,            
            "alt" : fileData.name,
            "data-uid" : targetId
          }).appendTo(imagePreview);
          //call event when you want change image for next time
          changeGroupChatAvatar();
          $(`#input-update-group-avatar-${targetId}`).val("") ;
        };              
        fileReader.readAsDataURL(fileData); 
        groupData.delete("group-avatar");
        groupData.append("group-avatar", fileData);        
      }else{
        alertify.notify("Trình duyệt của bạn không hỗ trợ tính năng này", "error", 7);
      }
      
    })
  })
};

function changeGroupName(){
  $(".input-group-name").off("change").on("change", function(){
    let targetId = $(this).data("uid");
    let val = $(this).val();
    let match=  /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;
    if(!match.test(val)|| val.length < 3 ) {
      alertify.notify("Tên nhóm không hợp lệ", "error", 7);
      $(this).valal("");
      groupData.delete("group-name");
      return false ;
    }      
  })
}

function enableEditGroup(){
  $(".group-info-edit").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    $(`#input-group-name-${targetId}`).removeAttr("disabled").focus();

  })
}


function updateGroupChat(){
  $(".btn-update-group").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    
    if( $(`#input-group-name-${targetId}`).val() == originGroupName && $(`#group-avatar-image-${targetId}`).attr("src") == originGroupAvatar ){
      alertify.notify("Bạn chưa thay đổi nội dung mới", "error", 7);
      return false ;
    }
    groupData.append("groupId", targetId);   
    let match=  /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/;    
    let groupName = $(`#input-group-name-${targetId}`).val();
    if(!match.test(groupName) || groupName.trim().length < 3 || groupName.trim().length > 50){
      alertify.notify("Tên mới không hợp lệ", "error", 7);
      $(`#input-group-name-${targetId}`).val(originGroupName);
      groupData = new FormData();
      $(".btn-cancel-update-group").trigger("click");
      return false ;
    }
    groupData.append("group-name", groupName.trim())
    $.ajax({
      type: "put",
      url: "/group-chat/update-group-chat",
      data: groupData,
      cache : false ,
      contentType: false ,
      processData : false ,
      success: function (response) {
        let {groupAfterUpdating, notificationHTML } = response;
        //reset global variable (groupData)
        groupData = new FormData();
        
        originGroupName = groupAfterUpdating.name ; 
        originGroupAvatar = groupAfterUpdating.avatar;      
        //after updating successfully, input name group will be disabled, and change name and avatar at left,right side
        $(`#input-group-name-${targetId}`).attr('disabled',"disabled");
        $(`#left-side-${targetId}`).find(".person__avatar-image").attr("src", `images/users/${originGroupAvatar}`);
        $(`#left-side-${targetId}`).find(".person__infor--username").text( originGroupName);
        $(`#to-${targetId}`).find(".right-side__top--leftside-avatar--image").attr("src",`images/users/${originGroupAvatar}`);
        $(`#to-${targetId}`).find(".right-side__top--leftside-username").text( originGroupName);
        $(`#group-updatedAt-${targetId}`).text(convertDateTimeToString(groupAfterUpdating.updatedAt));
        alertify.notify("Cập nhật thành công", "success" , 7);
        //create socket to send notification and update group when other members is current online
        socket.emit("update-group-chat", response );
      },
      error : function(error){
        alertify.notify(error.responseText, "error", 7);
        $(".btn-cancel-update-group").trigger("click");
      }
    });
  });
}


$(document).ready(function () {

  changeGroupChatAvatar();
  changeGroupName();
  enableEditGroup();
  //event update group
  updateGroupChat();

  //open modal group
  $(".btn-open-modal-group").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    $(`#modalSettingGroup-${targetId}`).modal("show");   
    originGroupName = $(`#input-group-name-${targetId}`).val();
    originGroupAvatar = $(`#group-avatar-image-${targetId}`).attr("src").split("/")[ $(`#group-avatar-image-${targetId}`).attr("src").split("/").length-1];     
    console.log(originGroupAvatar);
  })

  //event cancel update
  $(".btn-cancel-update-group").off("click").on("click", function(){
    let targetId = $(this).data("uid");
    $(`#input-group-name-${targetId}`).val(originGroupName);
    $(`#group-avatar-image-${targetId}`).removeAttr("src").attr("src" , `${originGroupAvatar}`);
  })


  socket.on("response-update-group-chat", data =>{
    let  {groupAfterUpdating, notificationHTML } = data;   
    console.log(groupAfterUpdating);
    $(`#left-side-${groupAfterUpdating._id}`).find(".person__avatar-image").attr("src", `images/users/${groupAfterUpdating.avatar}`);
    $(`#left-side-${groupAfterUpdating._id}`).find(".person__infor--username").text( groupAfterUpdating.name);
    $(`#to-${groupAfterUpdating._id}`).find(".right-side__top--leftside-avatar--image").attr("src",`images/users/${groupAfterUpdating.avatar}`);
    $(`#to-${groupAfterUpdating._id}`).find(".right-side__top--leftside-username").text( groupAfterUpdating.name);
    //update avatar and name in modal setting group
    $(`#group-avatar-image-${groupAfterUpdating._id}`).attr("src",  `images/users/${groupAfterUpdating.avatar}`);
    $(`#group-name-${groupAfterUpdating._id}`).text(groupAfterUpdating.name);
    $(`#group-updatedAt-${groupAfterUpdating._id}`).text(convertDateTimeToString(groupAfterUpdating.updatedAt));
     //embed notification
     $("#notification-dashboard-body").find("ul").prepend(data.notificationHTML);     
     $("#notification-bell-count").fadeIn(100);
     increaseNotificationNumber("notification-bell-count")     
     alertify.notify("Bạn vừa có một thông báo mới", "infor", 7);
     eventNotificationItem();
  })
});


