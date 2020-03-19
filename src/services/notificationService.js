import notificationModel from "../models/notificationModel";
import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
import chatGroupModel from "../models/chatGroupModel";
import {getTimelineOfNotificationItem} from "../helpers/clientHelper";
import {transErrors} from "../../lang/vi";
import _ from "lodash";

const limited_notifications = +process.env.LIMIT_NOTIFICATIONS;

let getNotifications = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      //get private notifications

      let getListNotification = await notificationModel.model.findNotificationByReceiverId(userId, limited_notifications);     
      let listUsersNotificationsInfoPromise = getListNotification.map( async notificationItem => {
        let senderInfo = await userModel.findUserById(notificationItem.senderId);                      
        let notificationInfo = {
          id: notificationItem._id, 
          type: notificationItem.type, 
          isRead : notificationItem.isRead,
          userId : senderInfo._id,
          userName : senderInfo.username, 
          userAvatar : senderInfo.avatar, 
          createdAt : notificationItem.createdAt
         }
         return notificationInfo;       
      })
      let listUsersNotificationsInfo = await Promise.all(listUsersNotificationsInfoPromise);
      
      //get group notifications
      let getListGroups = await chatGroupModel.findGroupConversationByUserId(userId);
      let listGroupsNotificationsPromise = getListGroups.map( async group => {
        return  await notificationModel.model.findNotificationByGroupId(group._id);        
      })

      let listDiscreteArrayNotifications = await Promise.all(listGroupsNotificationsPromise);
      listDiscreteArrayNotifications = listDiscreteArrayNotifications.slice(0, limited_notifications);
      let listArrayGroupNotifications = [];
      listDiscreteArrayNotifications.forEach( arrayNotifications => {
        arrayNotifications.forEach( notification => {
          listArrayGroupNotifications.push(notification);
        })
      })
      let listArrayNotifications = listArrayGroupNotifications.filter( notificationItem => notificationItem.senderId != userId);
      let listGroupNotificationsInfoPromise = listArrayNotifications.map( async notificationItem => {
        
        let senderInfo = await userModel.findUserById(notificationItem.senderId);    
        let groupInfo = await chatGroupModel.findGroupById(notificationItem.receiverId);        
        let isRead = false ;
        for(let i = 0 ; i< notificationItem.membersRead.length ; i++){
          if(notificationItem.membersRead[i].userId == userId){
            isRead = true ; break;
          }
        }
        
        let notificationInfo = {
          id: notificationItem._id, 
          type: notificationItem.type, 
          isRead : isRead,
          userId : senderInfo._id,
          userName : senderInfo.username, 
          userAvatar : senderInfo.avatar, 
          createdAt : notificationItem.createdAt,
          groupId : groupInfo._id,
          groupName : groupInfo.name,
          groupOldName : groupInfo.oldName
         }
         return notificationInfo;
      })
      let listGroupNotificationsInfo = await  Promise.all(listGroupNotificationsInfoPromise);     
      let allNotificationsInfo = [...listUsersNotificationsInfo, ...listGroupNotificationsInfo];
      allNotificationsInfo = _.sortBy(allNotificationsInfo, item => -item.createdAt).slice(0,limited_notifications);
      let allNotificationsContent = allNotificationsInfo.map( notificationInfo => {
        let  {id, type, isRead, userId, userName, userAvatar, createdAt, groupId, groupName, groupOldName } = notificationInfo;
        let timeStamp = getTimelineOfNotificationItem(createdAt);
        return notificationModel.contents.getContent(id, type, isRead, userId, userName, userAvatar, timeStamp, groupId, groupName, groupOldName);
      })    
      resolve(allNotificationsContent);
    } catch (error) {
      reject(error);
    }
  })
};

let countUnreadNotifications = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      //count unread private notification 
      let unreadNotifications = await notificationModel.model.countUnreadNotificationByReceiverId(userId);
      //count unread group chat notification
      let listGroupChat = await chatGroupModel.findGroupConversationByUserId(userId);
      if(listGroupChat.length){
        //count number of notifications with unread userId
        let unreadNotificationsGroupChat = 0 ;
        listGroupChat.forEach( async (group,index) => {
          unreadNotificationsGroupChat += await notificationModel.model.countUnreadNotificationsGroupChat(userId, group._id);     
          if(index == listGroupChat.length - 1){
            let totalUnreadNotifications = unreadNotificationsGroupChat + unreadNotifications;                          
            return resolve(totalUnreadNotifications);
          }
        })
      }else{
        resolve(unreadNotifications)     
      }           
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreNotification = (userId, skipPrivateNumbers, skipGroupNumbers) => {
  return new Promise(async (resolve, reject) => {
    try {
      //get private notification      
      let getListNotification = await notificationModel.model.readMoreNotification(userId, skipPrivateNumbers, limited_notifications);     
      if(!getListNotification.length){
        return reject(transErrors.empty_notification);
      }
      let listUsersNotificationsInfoPromise = getListNotification.map( async notificationItem => {
        let senderInfo = await userModel.findUserById(notificationItem.senderId);                      
        let notificationInfo = {
          id: notificationItem._id, 
          type: notificationItem.type, 
          isRead : notificationItem.isRead,
          userId : senderInfo._id,
          userName : senderInfo.username, 
          userAvatar : senderInfo.avatar, 
          createdAt : notificationItem.createdAt
         }
         return notificationInfo;       
      })
      let listUsersNotificationsInfo = await Promise.all(listUsersNotificationsInfoPromise);
     
      //get group notifications
      let getListGroups = await chatGroupModel.findGroupConversationByUserId(userId);
      let listGroupsNotificationsPromise = getListGroups.map( async group => {
        return  await notificationModel.model.findNotificationByGroupId(group._id);        
      })

      let listDiscreteArrayNotifications = await Promise.all(listGroupsNotificationsPromise);
    
      listDiscreteArrayNotifications = [].concat(...listDiscreteArrayNotifications);      
      listDiscreteArrayNotifications= _.sortBy(listDiscreteArrayNotifications, notificationItem => -notificationItem.createdAt)
      listDiscreteArrayNotifications = listDiscreteArrayNotifications.slice(skipGroupNumbers, skipGroupNumbers + limited_notifications);    
      let listArrayNotifications = listDiscreteArrayNotifications.filter( notificationItem => notificationItem.senderId != userId);
      let listGroupNotificationsInfoPromise = listArrayNotifications.map( async notificationItem => {        
        let senderInfo = await userModel.findUserById(notificationItem.senderId);    
        let groupInfo = await chatGroupModel.findGroupById(notificationItem.receiverId);
        let isRead = false ;
         for(let i = 0 ; i< notificationItem.membersRead.length ; i++){
           if(notificationItem.membersRead[i].userId == userId){
             isRead = true ; break;
           }
         }
        let notificationInfo = {
          id: notificationItem._id, 
          type: notificationItem.type, 
          isRead : isRead,
          userId : senderInfo._id,
          userName : senderInfo.username, 
          userAvatar : senderInfo.avatar, 
          createdAt : notificationItem.createdAt,
          groupId : groupInfo._id,
          groupName : groupInfo.name,
          groupOldName : groupInfo.oldName
         }
         return notificationInfo;
      })
      let listGroupNotificationsInfo = await  Promise.all(listGroupNotificationsInfoPromise);

      let allNotificationsInfo = [...listUsersNotificationsInfo, ...listGroupNotificationsInfo];
       
      allNotificationsInfo = _.sortBy(allNotificationsInfo, item => -item.createdAt).slice(0,limited_notifications);
     
      let allNotificationsContent = allNotificationsInfo.map( notificationInfo => {
        let  {id, type, isRead, userId, userName, userAvatar, createdAt, groupId, groupName, groupOldName } = notificationInfo;
        let timeStamp = getTimelineOfNotificationItem(createdAt);
        return notificationModel.contents.getContent(id, type, isRead, userId, userName, userAvatar, timeStamp, groupId, groupName, groupOldName);
      })
      resolve({allNotificationsContent});
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * @param {string : current user} userId 
 * @param {string : sender} senderId 
 * @param {string : id notification} notificationId 
 * remember senderId is sender , userId is receiver
 * step1 : get sender Infor
 * step2 : get type notification (add_cotact, accep_friend) and update is read
 * step3 : determine contact status, if no status return 0, else if status = false return 1, else if status = true return 2
 * step4 : if contact status = false, need to determine userId in contact is sender or receiver
 */
let getNotificationInfo = (userId, senderId, notificationId, isGroup, groupId) =>{
  return new Promise( async (resolve, reject) => {
    try {   
      //solve for private
      if(!isGroup){
        //step 1 : get senderInfo
        let senderInfo = await userModel.findUserById(senderId);
        senderInfo = senderInfo.toObject();
        //step 2 :  get type notification 
        let notificationInfor = await notificationModel.model.findNotificationByIdAndUpdate(notificationId);         
        senderInfo.notificationType = notificationInfor.type;
        //step 3 : determine contact status, if no status return 0, else if status = false return 1, else if status = true return 2
        //senderId as userId and userId as contactId in database
        let contactInfor = await contactModel.findContact(senderId, userId);      
            
        if(!contactInfor){
          senderInfo.hasContact = 0;
        }else if(contactInfor.status==false){
          senderInfo.isSender = false ;
          if(contactInfor.userId == userId){
            senderInfo.isSender = true;
          }
          senderInfo.hasContact = 1;
          senderInfo.createdAtContact = contactInfor.createdAt;
        }else if(contactInfor.status==true){
          senderInfo.hasContact = 2; 
          senderInfo.updatedAtContact = contactInfor.updatedAt;
        }
        return resolve({senderInfo: senderInfo});
      }
      //solve for group
      
      let updatePushUserIdIntoReadMembers = await notificationModel.model.findNotificationByIdAndPushMemberIdToMembersRead(userId, notificationId);      
      let groupInfo = await chatGroupModel.findGroupById(groupId);    
      let senderInfo = await userModel.findUserById(senderId);
      groupInfo = groupInfo.toObject();
      groupInfo.senderName = senderInfo.username; 
      groupInfo.senderAvatar = senderInfo.avatar;    
      let notificationInfo = {};
      if(updatePushUserIdIntoReadMembers==null){
        notificationInfo = await notificationModel.model.findNotificationById(notificationId);
      }else{
        notificationInfo= updatePushUserIdIntoReadMembers;
      }
      groupInfo.notificationType  =  notificationInfo.type; 
      resolve({groupInfo : groupInfo})
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string: current User} userId 
 * step 1 : get list notifications with user as receiverId 
 * step 2 : 
 */
let readAllNotifications = userId =>{
  return new Promise( async (resolve, reject) =>{
    try {   
      //get private notifications
      let getListNotification = await notificationModel.model.getAllNotificationsByReceiverId(userId);     
      let listUsersNotificationsInfoPromise = getListNotification.map( async notificationItem => {
        let senderInfo = await userModel.findUserById(notificationItem.senderId);                      
        let notificationInfo = {
          id: notificationItem._id, 
          type: notificationItem.type, 
          isRead : notificationItem.isRead,
          userId : senderInfo._id,
          userName : senderInfo.username, 
          userAvatar : senderInfo.avatar, 
          createdAt : notificationItem.createdAt
          }
          return notificationInfo;       
       })
       let listUsersNotificationsInfo = await Promise.all(listUsersNotificationsInfoPromise);
      
       //get group notifications
       let getListGroups = await chatGroupModel.findGroupConversationByUserId(userId);
      
       let listGroupsNotificationsPromise = getListGroups.map( async group => {
         return  await notificationModel.model.getAllNotificationsByReceiverId(group._id);        
       })
 
       let listDiscreteArrayNotifications = await Promise.all(listGroupsNotificationsPromise);
        listDiscreteArrayNotifications = listDiscreteArrayNotifications;
        let listArrayGroupNotifications = [];
        listDiscreteArrayNotifications.forEach( arrayNotifications => {
          arrayNotifications.forEach( notification => {
            listArrayGroupNotifications.push(notification);
          })
        })        
       let listArrayNotifications = listArrayGroupNotifications.filter( notificationItem => notificationItem.senderId != userId);
       let listGroupNotificationsInfoPromise = listArrayNotifications.map( async notificationItem => {
         
         let senderInfo = await userModel.findUserById(notificationItem.senderId);    
         let groupInfo = await chatGroupModel.findGroupById(notificationItem.receiverId);        
         let isRead = false ;
         for(let i = 0 ; i< notificationItem.membersRead.length ; i++){
           if(notificationItem.membersRead[i].userId == userId){
             isRead = true ; break;
           }
         }
         
         let notificationInfo = {
           id: notificationItem._id, 
           type: notificationItem.type, 
           isRead : isRead,
           userId : senderInfo._id,
           userName : senderInfo.username, 
           userAvatar : senderInfo.avatar, 
           createdAt : notificationItem.createdAt,
           groupId : groupInfo._id,
           groupName : groupInfo.name,
           groupOldName : groupInfo.oldName
          }
          return notificationInfo;
       })
       let listGroupNotificationsInfo = await  Promise.all(listGroupNotificationsInfoPromise);
 
       let allNotificationsInfo = [...listUsersNotificationsInfo, ...listGroupNotificationsInfo];
       allNotificationsInfo = _.sortBy(allNotificationsInfo, item => -item.createdAt);
       let allNotificationsContent = allNotificationsInfo.map( notificationInfo => {
         let  {id, type, isRead, userId, userName, userAvatar, createdAt, groupId, groupName, groupOldName } = notificationInfo;
         let timeStamp = getTimelineOfNotificationItem(createdAt);
         return notificationModel.contents.getContent(id, type, isRead, userId, userName, userAvatar, timeStamp, groupId, groupName, groupOldName);
       })
   
       resolve(allNotificationsContent);
    } catch (error) {
      reject(error);
    }
  })
};

let markAsReadAllNotifications = userId => {
  return new Promise(async (resolve, reject) =>{
    try {
      //update private notification
      let updateStatus = await  notificationModel.model.updateAllNotificationAsRead(userId);     
      //update group notification
      let getListGroups = await chatGroupModel.findGroupConversationByUserId(userId);      
      getListGroups.forEach( async group => {
        //group._id plays as receiverId in notificationModel, now push userId into notificationModel with receiverId is group._id
        await notificationModel.model.pushMemberIdIntoNotificationWithReceiverIdIsGroupId(userId, group._id)              
      })
      return resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  getNotifications : getNotifications,
  countUnreadNotifications : countUnreadNotifications,
  readMoreNotification : readMoreNotification,
  getNotificationInfo  : getNotificationInfo,
  readAllNotifications  : readAllNotifications,
  markAsReadAllNotifications : markAsReadAllNotifications
}
