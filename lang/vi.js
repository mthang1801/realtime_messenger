export const authInvalidation = {
  email_invalidation  : "Địa chỉ email không hợp lệ",
  gender_invalidation : "Vui lòng không thay đổi trường giới tính",
  password_invalidation : "Mật khẩu không hợp lệ, mật khẩu hợp lệ phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ in hoa, số, và ký tự đặc biệt",
  confirm_password_invalidation : "Mật khẩu nhập lại không trùng khớp với mật khẩu trên",
  confirm_email_wrong : "Mật khẩu xác thực không đúng"
}

export const transErrors = {
  email_existence : "Địa chỉ email này đã tồn tại, vui lòng sử dụng email khác",
  email_deleted : "Tài khoản này đã bị bị vô hiệu hóa",
  email_isNotActive : "Tài khoản đã được tạo thành công nhưng chưa được kích họat, vui lòng kiểm tra email để kích hoạt tài khoản",
  email_isBlocked : "Tài khoản đã bị khóa, nếu bạn có thắc mắc hay khiếu nại vui lòng liên hệ vui quản trị viên để tìm hiểu thêm",
  send_email_failed : "Có lỗi xảy ra, tạo tài khoản thất bại, vui lòng thử lại",
  invalid_verify_token : "Địa chỉ kích họat không tồn tại hoặc đã hết hạn",
  activeAccountFail : "Có lỗi xảy ra, vui lòng thử lại",
  email_not_existence : "Tài khoản này không tồn tại",
  username_or_password_wrong : "Sai tài khoản hoặc mật khẩu",
  general_fail : "Có lỗi xảy ra, vui lòng thử lại",
  empty_request : "Vui lòng nhập đầy đủ thông tin các trường",
  verifyNumber_wrong : "Mã xác thực không chính xác",
  server_error : "Lỗi xảy ra từ hệ thống",
  typeof_avatar : "Kiểu file không chính xác, file hình ảnh phải có đuôi png, jpeg, hoặc jpg",
  overSize_avatar : "Kích thước tập tin quá lớn, cập nhật thất bại",
  invalid_update_username : "username không hợp lệ, username không chứa ký tự đặc biệt",
  invalid_update_gender : "Không được phép thay đổi giá trị của trường này",
  invalid_update_address : "Địa chỉ quá dài!!!",
  invalid_update_phone : "Số điện thoại không hợp lệ",
  invalid_password : "Mật khẩu không hợp lệ, mật khẩu hợp lệ phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ in hoa, số, và ký tự đặc biệt",
  invalid_newpassword : "Mật khẩu mới không hợp lệ, mật khẩu hợp lệ phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ in hoa, số, và ký tự đặc biệt",
  invalid_confirm_newpassword : "Mật khẩu xác nhận không trùng với mật khẩu mới",
  invalid_newpassword_and_currentpassword_are_the_same : "Mật khẩu mới không được giống với mật khẩu cũ",
  wrong_password : "Mật khẩu hiện tại không đúng",
  existed_contact : "Người này đã được lưu vào danh sách kết bạn",
  unexisted_contact : "Người dùng liên lạc không tồn tại"
}

export const transSuccess = {
  email_register : (email) => {
    return `Đăng ký tài khoản <b>${email}</b> thành công, để có thể đăng nhập vào ứng dụng vui lòng kiểm tra email để kích hoạt tài khoản`
  },
  activeAccount : `Tài khoản đã được kích hoạt thành công, bạn có thể đăng nhập vào ứng dụng`,
  login_success : (username) => {
    return `Chào mừng <b>${username}</b> đã đến với Messenger Chat, chúc bạn có phút giây trải nghiệm tuyệt vời`
  },
  loggout_success : "Đăng xuất tài khoản thành công.",
  mail_forgot_success : "Yêu cầu khôi phục mật khẩu của bạn thành công, vui lòng kiểm tra email để lấy mã xác nhận kích hoạt lại mật khẩu"
}


export const transEmail = {
  mail_register_subject : "Messenger Chat: Xác nhận kích hoạt tài khoản",
  mail_register_template : (email, linkVerify) => {
    return  `
      <h3>Xin chào ${email}</h3>
      <h4>Bạn đã đăng ký thành công tài khoản trên Messenger Chat, để  tiến hành đăng nhập vào ứng dụng, bạn vui lòng nhấn vào link dưới đây để kích hoạt tài khoản</h4>
      <h4><a href="${linkVerify}" target="_blank">Vui lòng nhấn vào đây</a></h4>  
      <h4>Cám ơn vì bạn đã sử dụng ứng dụng, trân trọng</h4>
    `
  },
  mail_forgot_subject : "Messenger Chat: Xác nhận kích hoạt lại mật khẩu",
  mail_forgot_template : (username,verifyNumber) => {
    return `
      <h3>Xin chào ${username}</h3>
      <h4>Chúng tôi đã nhận được một đề nghị khôi phục lại mật khẩu của bạn, để tiến hành khôi phục mật khẩu, bạn cần phải nhập mã xác nhận vào mẫu yêu cầu</h4>
      <h4>Đây là mã xác nhận: <span style="color:blue;font-size:20px"><strong>${verifyNumber}</strong><span></h4>
      <h4 style="color:red"><strong>Xin lưu ý, đề đảm bảo an toàn cho tài khoản, không chia sẻ mã này cho bất kỳ ai. Trân trọng</strong></h4>
    `
  }
}
