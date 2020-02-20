import {check} from "express-validator/check";
import {transErrors} from "../../lang/vi";
let userUpdateInfo = [
  check("username", transErrors.invalid_update_username)
    .isLength({min:3})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/).optional(),
  check("gender", transErrors.invalid_update_gender).isIn(['male', 'female']).optional(),
  check("address", transErrors.invalid_update_address).isLength({max: 255}).optional(),
  check("phone", transErrors.invalid_update_phone).matches(/^(0)[0-9]{9,10}$/).optional()
];

let userUpdatePassword = [
  check("currentPassword", transErrors.invalid_password).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("newPassword", transErrors.invalid_newpassword).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("newPassword", transErrors.invalid_newpassword_and_currentpassword_are_the_same)
    .custom( (value,{req})=>{
      return value != req.body.currentPassword;
    }),
  check("confirmNewPassword", transErrors.invalid_confirm_newpassword)
    .custom( (value,{req})=>{
      return value == req.body.newPassword;
    })
];


module.exports = {
  userUpdateInfo : userUpdateInfo,
  userUpdatePassword : userUpdatePassword
}