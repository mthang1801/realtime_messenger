import {check} from "express-validator/check";
import {transErrors} from "../../lang/vi";
let createNewGroup = [
  check("groupName", transErrors.lengthCreateNewGroup).isLength({min: 3, max: 50}),
  check("listUsersId", transErrors.empty_array_userId).isLength({min: 1})
];

module.exports = {
  createNewGroup : createNewGroup
}
