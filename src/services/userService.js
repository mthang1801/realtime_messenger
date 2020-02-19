import userModel from "../models/userModel";
import fsExtra from "fs-extra";
import {app} from "../config/app";
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
}
module.exports ={
  updateAvatar : updateAvatar,
  updateInfo : updateInfo
}
