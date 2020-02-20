import userModel from "../models/userModel";
import fsExtra from "fs-extra";
import {app} from "../config/app";
import bcrypt from "bcrypt";
import {transErrors} from "../../lang/vi";

const saltRounds = +process.env.SALT_ROUNDS;

let updateAvatar = (userId, userUpdateItem) => {
  return new Promise( async (resolve, reject) => {
    try {  
      //update       
      let user = await userModel.updateUserAvatar(userId, userUpdateItem);    
      if(user.avatar != "avatar-default-man.jpeg" && user.avatar != "avatar-default-woman.png"){
        await fsExtra.remove(`${app.avatar_directory}/${user.avatar}`);
      }  
      let keys = Object.keys(userUpdateItem)  ;
      keys.forEach( key => {
        user[key] = userUpdateItem[key];
      })     
      resolve(user);
    } catch (error) {
      reject(error);
    }
  })
};

let updateInfo = (userId, userUpdateItem) => {
  return new Promise( async (resolve, reject) => {
    try {
      let user = await userModel.updateUserInfo(userId, userUpdateItem);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {String} userId 
 * @param {String} currentPassword 
 * @param {String} newPassword 
 * 1. get user by id
 * 2. compare password 
 * 3. hash new password and update
 */
let updatePassword = (userId, currentPassword, newPassword) => {
  return new Promise( async (resolve, reject) => {
    try {    
      let user = await userModel.findUserByIdHasPassword(userId);
      let checkPassword = await user.comparePassword(currentPassword);      
      if(!checkPassword){
        return reject(transErrors.wrong_password);
      }
      let salt = bcrypt.genSaltSync(saltRounds);
      let hashPassword = bcrypt.hashSync(newPassword, salt);
      let userUpdatePassword = await userModel.findUserByIdAndUpdateNewPassword(userId, hashPassword);     
      resolve(userUpdatePassword);
    } catch (error) {
      reject(error);
    }
  })
}
module.exports ={
  updateAvatar : updateAvatar,
  updateInfo : updateInfo,
  updatePassword : updatePassword
}
