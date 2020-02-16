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
  email_isBlocked : "Tài khoản đã bị khóa, nếu bạn có thắc mắc hay khiếu nại vui lòng liên hệ vui quản trị viên để tìm hiểu thêm"
}

export const transSuccess = {
  email_register : (email) => {
    return `Đăng ký tài khoản <b>${email}</b> thành công, để có thể đăng nhập vào ứng dụng vui lòng kiểm tra email để kích hoạt tài khoản`
  }
}
