import {groupChat} from "../services";
import {validationResult} from "express-validator/check";
import {getLastItemInArray, convertToMessengerTimeStamp, bufferToBase64, convertDateTimeMessenger} from "../helpers/clientHelper";
import {promisify} from "util";
import ejs from "ejs";

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
      convertToMessengerTimeStamp : convertToMessengerTimeStamp
    }
    let groupChatLeftSide = await renderFile("src/views/server_render/groupChat/_groupChatLeftSide.ejs", dataToRender);
    let groupChatRightSide = await renderFile("src/views/server_render/groupChat/_groupChatRightSide.ejs", dataToRender);
    let groupChatImageModal = await renderFile("src/views/server_render/groupChat/_groupChatImageModal.ejs", dataToRender);
    let groupChatAttachmentModal = await renderFile("src/views/server_render/groupChat/_groupChatAttachmentModal.ejs", dataToRender);
    return res.status(200).send({
      groupChatLeftSide,
      groupChatRightSide,
      groupChatImageModal,
      groupChatAttachmentModal,
      group : data.newGroup,
      notification : data.notificationHTML
    })
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  searchUsers : searchUsers,
  createNewGroup : createNewGroup,
}