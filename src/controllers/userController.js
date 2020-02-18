import multer from "multer";
import {app} from "../config/app";
import {transErrors, transSuccess} from "../../lang/vi";
import {user} from "../services";

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
}).single("avatar")

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
      console.log(userUpdateItem);
      let statusUpdate = await user.updateAvatar(userId, userUpdateItem);
      return res.status(200).send({success : !!statusUpdate, data : statusUpdate});
    }catch(error){
      return res.status(500).send(error);
    }
  })
}

module.exports = {
  updateAvatar : updateAvatar
}
