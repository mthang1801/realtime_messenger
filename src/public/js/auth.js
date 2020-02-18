function spinLoading(){
  $(".loading-ring").css("display", "inline-block");
  $(".loading-modal").css("display","block");
}
function spinLoaded(){
  $(".loading-ring").css("display", "none");
  $(".loading-modal").css("display","none");
}

function ajaxLoading(){
  $(document).ajaxStart(function(){
    spinLoading();
  }).ajaxStop(function(){
    spinLoaded();
  })
}
function showRegisterForm(){
  $(".tab-pane").each(function(index,element) {
    $(element).removeClass("active show");
  })
  $(".nav-link").each(function(index,element) {
    $(element).removeClass("active");
  })
  
  $("#btn-register").click();
}

function showLoginForm(){
  $(".tab-pane").each(function(index,element){    
    $(element).removeClass("active show");
  })
  $(".nav-link").each(function(index,element){
    $(element).removeClass("active");
  })  
  $("#btn-login").click();
}

function enableRegisterForm(){  
  $("#btn-register-form").addClass("disabled");
  $("#term-register").on("change" , function(){
    if(!this.checked){
      $("#btn-register-form").addClass("disabled");
      return;
    }
    $("#btn-register-form").removeClass("disabled");
  })
}

//show form application when click term button
function showTermApplication(){
  let termApllicationHTML= `    
      <div id="la" class="d-none">

      <p>The MIT License (MIT)</p>
      
      <p>Copyright (c) 2014 Mohammad Younes</p>
      
      <p>Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
      </p>

      <p>The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.</p>
      
      <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
      </p>
      </div>
    `
    $("body").append(termApllicationHTML);
    var pre = document.createElement('pre');
    //custom style.
    pre.style.maxHeight = "400px";
    pre.style.margin = "0";
    pre.style.padding = "24px";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.textAlign = "justify";
    pre.appendChild(document.createTextNode($('#la').text()));

    // let pre = $("<pre></pre>").html(termApllicationHTML);
    // pre.css({"maxHeight" : "400px", "margin": 0, "padding": "24px", "whiteSpace" : "pre-wrap", "textAlign" : "justify"});
    // //show as confirm
    // console.log(pre.get(0))
    console.log(pre);
    alertify.confirm(pre, function(){
            alertify.success('Accepted');
        },function(){
            alertify.error('Declined');
        }).setHeader("Điều khoản ứng dụng").set({labels:{ok:'Đồng ý', cancel: 'Hủy bỏ'}, padding: false});
}


function showForgotPasswordForm(){
  $(".tab-pane").each(function(index,element){    
    $(element).removeClass("active show");
  })
  $(".nav-link").each(function(index,element){
    $(element).removeClass("active");
  })  
  $("#forgot-pw-form").addClass("active show");
}

let count = 0;
let times_wrong = 0
//after submit forgot-password form, verify code number will be shown
function directToPageInputKeySecret(){
  $("#btn-restore-password").on("click", function(e){  
    if(e.which == 13 || e.type == "click"){
      let email = $("#email-forgot").val().trim().toLowerCase();
      let confirm_email = $("#confirm-email-forgot").val().trim().toLowerCase();
      $("#form__box").find(".alert").remove();
      if(email != confirm_email){
        $(".form__legend").after(`<div class="alert alert-danger success" role="alert">Email nhập lại không đúng</div>`);
        $("#email-forgot").val("");
        $("#confirm-email-forgot").val("");
        return false;
      }   
      $.post("/user/forgot-password", {email : email, confirm_email : confirm_email},
        function (data) {
          if(data.success != ""){
            //proceed open verify form. Firstly, close all form
            $("#tab-form").find(".tab-pane").each( (index, elem) => {
              $(elem).removeClass("active show");
            })
            $(".nav-link").each(function(index,element){
              $(element).removeClass("active");
              //disabled button to prevent user click cause exitting current page
              $(element).addClass("disabled");
              $(element).parent().css("display", "none");
            });
            $("#confirm-email-forgot").val("");
            $("#email-forgot").val("");
            let formVerificationHTML = `
            <div class="tab-pane fade active show animate-fade" id="verification-form" role="tabpanel" aria-labelledby="pills-profile-tab">
              <div class="form__box">
                <form>
                  <legend class="form__legend" style="font-size:1.2rem"><span>XÁC THỰC KHÔI PHỤC MẬT KHẨU</span></legend>
                  
                  <div class="alert alert-success" id="alert-verify">
                    ${data.success}
                  </div>                
                  <input type="hidden" class="form-control" id="email-restore" value="${data.email}">                                                            
                
                  <div class="form-group">
                    <label for="verify-number">Mã xác thực <span class="text-danger">(*)</span></label>
                    <input type="text" class="form-control" id="verify-number" placeholder="Nhập Mã xác thực" required>
                  </div>
                
                
                  <div class="form-group text-right">
                    <button type="button" class="btn btn-primary" id="btn-verify-number">Tiếp theo</button>            
                  </div>              
                </form>
              </div>
            </div>
            `
            $("#tab-form").append(formVerificationHTML);
            //solve verify Form
            verifyForm("btn-verify-number");
          };
                  
        }
      ).fail(function(error){
        console.log(error);
        $(".form__legend").after(`<div class="alert alert-danger success" role="alert">${error.responseText}</div>`)
        $("#email-forgot").val("");
        $("#confirm-email-forgot").val("");
        return false;
      });
    }   
  })

  $(document).on("keyup" , function(e){
    if(e.which == 13){
      $("#btn-restore-password").trigger("click");
    }
  })
};
//when submit verify Form, if input wrong 3 times, button will be disabled, 
// else if input correctly, 
// update new password Form will be show, and this form will be removed
function verifyForm(btnId){
  $(`#${btnId}`).off("click").on("click", function(){        
    count++;
    console.log(count);
    let email = $("#email-restore").val().trim().toLowerCase();
    let verifyNumber = $("#verify-number").val().trim();
    $("#alert-verify").text("");
    if(email == "" || verifyNumber == ""){
      $("#alert-verify").removeClass("alert-success").addClass("alert-danger").text("Vui lòng nhập mã xác thực");     
      return false;
    }
    if(count > 2){
      count = 0;
      times_wrong++;      
      let c = 0 ;
      let timerInterval = setInterval(()=>{        
        c++;
        console.log(c);
        if(c < 300 * times_wrong){
          $(`#${btnId}`).addClass("disabled");
           $("#alert-verify").removeClass("alert-success").addClass("alert-danger").text(`Bạn đã nhập sai quá nhiều lần không thể nhập tiếp, còn ${300- c} giây để tiếp tục`);
          
        }else{
          c= 0;
          $(`#${btnId}`).removeClass("disabled");
          clearInterval(timerInterval);
        }        
      }, 1000);
      return;
    }
    
    $.post("/user/forgot-password/verify", {email : email, verifyNumber : verifyNumber},
      function(data){
       if(data){
        times_wrong= 0;
        $("#tab-form").find("#verification-form").remove();
        let formUpdateNewPassword = `
        <div class="tab-pane fade active show animate-fade" id="update-newpassword-form" role="tabpanel" aria-labelledby="pills-profile-tab">
            <div class="form__box">
              <form>
                <legend class="form__legend" style="font-size:1.2rem"><span>CẬP NHẬT MẬT KHẨU MỚI</span></legend>
                
                <div class="alert alert-success d-none" id="alert-update"></div>                
                <input type="hidden" class="form-control" id="email-verify-hidden" value="${email}">                                                            
              
                <div class="form-group">
                  <label for="new-password">Mật khẩu mới <span class="text-danger">(*)</span></label>
                  <input type="password" class="form-control" id="new-password" placeholder="Nhập Mật khẩu mới" required>
                </div>
                <div class="form-group">
                  <label for="confirm-new-password">Xác nhận mật khẩu: <span class="text-danger">(*)</span></label>
                  <input type="password" class="form-control" id="confirm-new-password" placeholder="Xác nhận mật khẩu mới" required>
                </div>
                            
                <div class="form-group text-right">
                  <button type="button" class="btn btn-primary" id="btn-update-password">Thay đổi</button>                                         
                </div>              
              </form>
            </div>
          </div>
        `;

        $("#tab-form").append(formUpdateNewPassword);        
        updateNewPassword("btn-update-password",email);
       }
      }
    ).fail(function(err){
      $("#alert-verify").removeClass("alert-success").addClass("alert-danger").text(err.responseText);
    })
  })  
};

//proceed update new password after verifying number correctly
function updateNewPassword(btnId, initEmail){
  $(`#${btnId}`).off("click").on("click", function(){
    Swal.fire({
      title: 'Bạn có chắc chắn muốn cập nhật mật khẩu mới?',
      text: "Bạn sẽ không thể hoàn tác sau khi đồng ý",
      icon: 'info',
      showCancelButton: true,
      width : "50rem",
      allowOutsideClick : false ,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Xem lại'
    }).then((result) => {
      if (result.value) {
        let email = $("#email-verify-hidden").val().trim();
        let newPassword = $("#new-password").val().trim();
        let confirmNewPassword = $("#confirm-new-password").val().trim();
        $("#alert-update").text("");
        if(email == "" || email != initEmail){
          $("#alert-update").removeClass("alert-success d-none").addClass("alert-danger").text("Vui lòng không xóa hoặc thay đổi trường này");
          return false ;
        }
        if(newPassword != confirmNewPassword){
          $("#alert-update").removeClass("alert-success d-none").addClass("alert-danger").text("Mật khẩu không trùng khớp với nhau");
          $("#new-password").val("");
          $("#confirm-new-password").val("");
          return false;
        }
        let match = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
        if(!match.test(newPassword)){
          $("#alert-update").removeClass("alert-success d-none").addClass("alert-danger").text("Mật khẩu không hợp lệ, phải có ít nhất 8 ký tự, gồm số, chữ cái thường, chữ in hoa và ký tự đặc biệt");
          $("#new-password").val("");
          $("#confirm-new-password").val("");
          return false;
        }
        $.post("/user/forgot-password/verify/new-update-password", {email : email, password : newPassword}, function(data){
          if(data){
            $("#alert-update").removeClass("alert-danger d-none").addClass("alert-success").text("Cập nhật mật khẩu mới thành công");
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Hoàn tất cập nhật mật khẩu, chuẩn bị về  màn hình chính',
              showConfirmButton: false,
              timer: 2500
            }).then( result => {
              $("#tab-form").find("#update-newpassword-form").remove();               
              $(".nav-link").each(function(index,element){
                $(element).removeClass("active");
                //disabled button to prevent user click cause exitting current page
                $(element).removeClass("disabled");
                $(element).parent().css("display", "block");
              });
              $("#btn-login").click();
            })
          }
        }).fail(function(err){
          $("#alert-update").removeClass("alert-success d-none").addClass("alert-danger").text(err.responseText);
        })
      }
    })    
  })
};



$(document).ready(function () {

  //switch loading when request ajax 
  ajaxLoading();

  //enable button register form when checked term
  enableRegisterForm();

  //direct to page which to input key secret from email when click button from forgot-password-form-data
  directToPageInputKeySecret();

});
