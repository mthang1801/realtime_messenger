import multer from "multer";
import {app} from "../config/app";
import {transErrors, transSuccess} from "../../lang/vi";
import {user} from "../services";
import {validationResult} from "express-validator/check";
import { compareSync } from "bcrypt";
//config storage to help control storing file to disk
let storageAvatar = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, app.avatar_directory);
  },
  filename : (req, file, cb) => {
    if(!app.avatar_type.includes(file.mimetype)){
      return cb(transErrors.typeof_avatar,null);
    }    
    let avatarName = `${Date.now()}-${(Math.round(Math.random()*10000000)).toString(16)}-${file.originalname}`;    
    cb(null, avatarName);
  }
});

let uploadAvatar = multer({
  storage : storageAvatar,
  limits : { fileSize : app.avatar_maxSize}
}).single("avatar");

let updateAvatar = (req, res) => {
  uploadAvatar(req, res, async err =>{
    if(err){    
      if(err.message=="File too large"){
        return res.status(500).send(transErrors.overSize_avatar);
      }
      return res.status(500).send(err);
    }  
    try{
      let userId = req.user._id;
      let userUpdateItem = {
        avatar : req.file.filename,
        updatedAt : Date.now()
      }    
      let statusUpdate = await user.updateAvatar(userId, userUpdateItem);
      return res.status(200).send({success : !!statusUpdate, data : statusUpdate});
    }catch(error){
      return res.status(500).send(error);
    }
  })
};

let updateInfo = async (req, res) => {
  let errorsArr = [];  
  if(!validationResult(req).isEmpty()){
    let errors = Object.values(validationResult(req).mapped());
    errors.forEach( error => {
      errorsArr.push(error.msg);
    })
    if(errorsArr.length){
      console.log("Error update info");
      console.log(errorsArr);
      return res.status(500).send(errorsArr);
    }
  }
  try {
    let userId = req.user._id ; 
    let keys = Object.keys(req.body);
    let userUpdateItem = {};
    keys.forEach( key => {
      userUpdateItem[key] = req.body[key];      
    });
    userUpdateItem.updatedAt = Date.now();
    let updateStatus = await user.updateInfo(userId, userUpdateItem);
    return res.status(200).send({data: updateStatus, success : !!updateStatus});
  } catch (error) {
    console.log("updateInfo");
    console.log(error);
    return status(500).send(error);
  }
};

let updatePassword = async (req,res) => {
  let errorsArr = [];
  if(!validationResult(req).isEmpty()){
    let errors = Object.values(validationResult(req).mapped());
    errors.forEach( error => {
      errorsArr.push(error.msg);
    })    
    return res.status(500).send({dataErrors : errorsArr});
  }
  try {
    let userId = req.user._id ;
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let statusUpdatePassword = await user.updatePassword(userId, currentPassword, newPassword);
    return res.status(200).send({success:!!statusUpdatePassword});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let updateUserHasBeenOffline = async (req, res) => {
  try {        
    let userId = req.user._id;
    let updateStatus = await user.updateUserHasBeenOffline(userId);
    return res.status(200).send({success : !!updateStatus})
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  updateAvatar : updateAvatar,
  updateInfo : updateInfo,
  updatePassword : updatePassword,
  updateUserHasBeenOffline : updateUserHasBeenOffline
}
