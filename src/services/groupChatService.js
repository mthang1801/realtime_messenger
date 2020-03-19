import userModel from "../models/userModel";
import chatGroupModel from "../models/chatGroupModel";
import notificationModel  from "../models/notificationModel";
import fsExtra from "fs-extra";
import {convertDateTimeMessenger, convertToMessengerTimeStamp} from "../helpers/clientHelper";
import {transErrors} from "../../lang/vi";
/**
 * searching users except contactList
 * @param {string} userId 
 * @param {string} searchKey 
 * @param {array} contactList
 * 
 */
let searchUsers = (userId,contactList, searchKey) => {
  return new Promise(async (resolve, reject) => {
    try{         
      contactList.push(userId);
      let usersList = await userModel.findUsersToAddNewGroup(contactList, searchKey);      
      usersList.sort( (a,b) => a["username"].localeCompare(b["username"]));
      resolve(usersList);
    }catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * @param {string} groupName 
 * @param {array} listUsersId 
 * create new group
 * notify to each member that they have joined group
 */
let createNewGroup = (userId, userName, userAvatar, groupName, listUsersId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let members = [{userId: userId}];
      listUsersId.forEach( userId => {
        members.push({userId: userId})
      })     
      let newGroupItem = {
        name : groupName,
        userAmount :listUsersId.length,
        admins : [{userId : userId}],
        members : members,      
      }
      let newGroup = await chatGroupModel.createNew(newGroupItem);
      //notify to member that he has joined groupName
      let notificationItem = {
        senderId : userId , 
        receiverId : newGroup._id ,
        type : notificationModel.types.CREATE_NEW_GROUP ,   
      }
      let notification = await notificationModel.model.createNew(notificationItem);
      let notificationHTML = notificationModel.contents.getContent(notification._id, notification.type, notification.isRead, userId, userName, userAvatar, convertToMessengerTimeStamp(notification.createdAt),  newGroup._id, groupName);    
      resolve({newGroup, notificationHTML});
    } catch (error) {
      reject(error);
    }
  })
};

let updateGroupChat = (userId, userName, userAvatar, groupId, file, newGroupName ) => {
  return new Promise( async (resolve, reject) => {
    try {
    let oldGroup = {};
    let currentGroup = await chatGroupModel.findGroupById(groupId) ;
    let currentGroupName = currentGroup.name ; 
    // create notification   
    let newNotificationItem = {
      senderId : userId , 
      receiverId : groupId ,     
     }   
    if(file && newGroupName){      
      
      //determine type of notification
      if(currentGroupName != newGroupName){       
       await chatGroupModel.checkUserIsAdminAndUpdateBothAvatarAndName(userId, groupId, file.filename, newGroupName, currentGroupName);
        newNotificationItem.type = notificationModel.types.UPDATE_GROUP ;
      }else{
       await chatGroupModel.checkUserIsAdminAndUpdateBothAvatarAndName(userId, groupId, file.filename, newGroupName);
        newNotificationItem.type = notificationModel.types.UPDATE_AVATAR_GROUP;
      }
      //remove old avatar
      if(currentGroup.avatar != "group-avatar.jpeg"){
        await fsExtra.remove(`${file.destination}/${currentGroup.avatar}`);
      }     
     }
     else if( !file && newGroupName ){      
       newNotificationItem.type = notificationModel.types.UPDATE_GROUP ;
        await chatGroupModel.checkUserIsAdminAndUpdateGroupName(userId,groupId,newGroupName, currentGroupName);
     }
     
     if(oldGroup == null){
       return reject(transErrors.permission_update_group)
     }  
     let notification = await notificationModel.model.create(newNotificationItem);
     let notificationHTML = notificationModel.contents.getContent(notification._id, notification.type, notification.isRead, userId, userName, userAvatar, convertToMessengerTimeStamp(notification.createdAt), groupId, newGroupName, currentGroupName);    

     let groupAfterUpdating = await chatGroupModel.findGroupById(groupId);
     resolve({groupAfterUpdating : groupAfterUpdating , notificationHTML :notificationHTML })
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  searchUsers : searchUsers,
  createNewGroup : createNewGroup,
  updateGroupChat : updateGroupChat
}