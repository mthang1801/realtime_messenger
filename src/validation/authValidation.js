import {check} from "express-validator/check";
import  {authInvalidation } from "../../lang/vi";
let register = [
  check("email", authInvalidation.email_invalidation).isEmail().trim(),
  check("gender", authInvalidation.gender_invalidation).isIn(["male","female"]),
  check("password", authInvalidation.password_invalidation).isLength({min: 8}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("confirm_password", authInvalidation.confirm_password_invalidation)
  .custom((value,{req}) => {
    return Object.is(value,req.body.password);
  })
]

module.exports = {
  register : register
}
