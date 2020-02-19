import {check} from "express-validator/check";
import {transErrors} from "../../lang/vi";
let userUpdate = [
  check("username", transErrors.invalid_update_username)
    .isLength({min:3})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", transErrors.invalid_update_gender).isIn(['male', 'female']).optional(),
  check("address", transErrors.invalid_update_address).isLength({max: 255}).optional(),
  check("phone", transErrors.invalid_update_phone).matches(/^(0)[0-9]{9,10}$/).optional()
];

module.exports = {
  userUpdate : userUpdate
}