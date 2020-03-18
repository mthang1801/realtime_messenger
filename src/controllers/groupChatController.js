import {groupChat} from "../services";
import {validationResult} from "express-validator/check";
import {getLastItemInArray, convertToMessengerTimeStamp, bufferToBase64, convertDateTimeMessenger, convertDateTimeToString} from "../helpers/clientHelper";
import {promisify} from "util";
import ejs from "ejs";
import multer from "multer";
import {app} from "../config/app";
import {transErrors} from "../../lang/vi";
const renderFile = promisify(ejs.renderFile).bind(ejs)

let searchUsers = async (req, res) => {
  try {
    let searchKey = req.query.searchKey;
    let userId = req.user._id ; 
    let contactList = req.query.contactList;
    let usersList = await groupChat.searchUsers(userId,contactList, searchKey);   
    let dataToRender = {
      usersList : usersList
    }   
    return res.status(200).render("server_render/groupChat/_searchUsers", dataToRender);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let createNewGroup =  async(req, res) => {
  let errorsArr = [];
  
  if(!validationResult(req).isEmpty()){
    let errors = Object.values(validationResult(req).mapped());    
    errors.forEach( error => {
      errorsArr.push(error.msg);
    })
    return res.status(500).send(errorsArr);
  }
  try {
    let groupName = req.body.groupName;
    let listUsersId = req.body.listUsersId ;
    let userId = req.user._id ;
    let userName = req.user.username ;
    let userAvatar = req.user.avatar; 
    let data = await groupChat.createNewGroup(userId, userName, userAvatar, groupName, listUsersId);    
    let dataToRender = {
      conversation : data.newGroup,
      getLastItemInArray : getLastItemInArray,
      bufferToBase64 : bufferToBase64,
      convertToMessengerTimeStamp : convertToMessengerTimeStamp,  
      convertDateTimeToString : convertDateTimeToString,
      user : req.user ,
    }

    let groupChatLeftSide = await renderFile("src/views/server_render/groupChat/_groupChatLeftSide.ejs", dataToRender);
    let groupChatRightSide = await renderFile("src/views/server_render/groupChat/_groupChatRightSide.ejs", dataToRender);
    let groupChatImageModal = await renderFile("src/views/server_render/groupChat/_groupChatImageModal.ejs", dataToRender);
    let groupChatAttachmentModal = await renderFile("src/views/server_render/groupChat/_groupChatAttachmentModal.ejs", dataToRender);
    let groupChatSettingModal = await renderFile("src/views/server_render/groupChat/_groupChatSettingModal.ejs", dataToRender);
    let groupChatSettingModalForMembers = await renderFile("src/views/server_render/groupChat/_memberGroupChatSettingModal.ejs", dataToRender);
    return res.status(200).send({
      groupChatLeftSide,
      groupChatRightSide,
      groupChatImageModal,
      groupChatAttachmentModal,
      group : data.newGroup,
      groupChatSettingModal,
      groupChatSettingModalForMembers,
      notification : data.notificationHTML
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let groupChatStorage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, app.group_avatar_directory);
  },
  filename : (req, file, cb) => {
    if(!app.group_avatar_type.includes(file.mimetype)){
      return cb(transErrors.group_avatar_error_type);
    }
    let fileName= `${Date.now()}-${(Math.random()*0xfffffff).toString(16)}-${file.originalname}`;
    cb(null, fileName);
  }
});

let groupChatUploadFile = multer({
  storage : groupChatStorage,
  limits : { fileSize : app.group_avatar_maxSize}
}).single("group-avatar");

let updateGroupChat = (req, res) => {
  groupChatUploadFile(req, res, async error => {
    if(error){
      if(error.message){
        console.log(error);
        return res.status(500).send(transErrors.group_avatar_oversize);
      }
      return res.status(500).send(error);
    }    
    try {
      let groupName = req.body["group-name"] ?  req.body["group-name"] : null;
      let file = req.file ? req.file : null ;      
      let groupId = req.body.groupId;
      let userId = req.user._id ;
      let userName = req.user.username ;
      let userAvatar = req.user.avatar;
     
      let data = await groupChat.updateGroupChat(userId, userName, userAvatar, groupId, file, groupName);
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  })
}

module.exports = {
  searchUsers : searchUsers,
  createNewGroup : createNewGroup,
  updateGroupChat : updateGroupChat
}