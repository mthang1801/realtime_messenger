export const authInvalidation = {
  email_invalidation  : "Địa chỉ email không hợp lệ",
  gender_invalidation : "Vui lòng không thay đổi trường giới tính",
  password_invalidation : "Mật khẩu không hợp lệ, mật khẩu hợp lệ phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ in hoa, số, và ký tự đặc biệt",
  confirm_password_invalidation : "Mật khẩu nhập lại không trùng khớp với mật khẩu trên"
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
  general_fail : "Có lỗi xảy ra, vui lòng thử lại"
}

export const transSuccess = {
  email_register : (email) => {
    return `Đăng ký tài khoản <b>${email}</b> thành công, để có thể đăng nhập vào ứng dụng vui lòng kiểm tra email để kích hoạt tài khoản`
  },
  activeAccount : `Tài khoản đã được kích hoạt thành công, bạn có thể đăng nhập vào ứng dụng`,
  login_success : (username) => {
    return `Chào mừng <b>${username}</b> đã đến với Messenger Chat, chúc bạn có phút giây trải nghiệm tuyệt vời`
  },
  loggout_success : "Đăng xuất tài khoản thành công."
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
  }
}
