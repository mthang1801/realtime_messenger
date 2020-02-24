import notificationModel from "../models/notificationModel";
import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
import {getTimelineOfNotificationItem} from "../helpers/clientHelper";
import {transErrors} from "../../lang/vi";
import _ from "lodash";

const limited_notifications = +process.env.LIMIT_NOTIFICATIONS;

let getNotifications = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let getListNotification = await notificationModel.model.findNotificationByReceiverId(userId, limited_notifications);     
      let listUsersPromise = getListNotification.map( async notificationItem => {
        let senderInfo = await userModel.findUserById(notificationItem.senderId);                      
        let timer = getTimelineOfNotificationItem(notificationItem.createdAt);
        return await notificationModel.contents.getContent(notificationItem._id, notificationItem.type, notificationItem.isRead, senderInfo._id, senderInfo.username, senderInfo.avatar, timer);
      })
      
      resolve(await Promise.all(listUsersPromise));
    } catch (error) {
      reject(error);
    }
  })
};

let countUnreadNotifications = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let unreadNotifications = await notificationModel.model.getUnreadNotificationByReceiverId(userId);
      resolve(unreadNotifications.length);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreNotification = (userId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listNotification = await notificationModel.model.readMoreNotification(userId,skipNumber,limited_notifications);
      if(!listNotification.length){
        return reject(transErrors.empty_notification);
      }
      let usersNotificationPromise = listNotification.map( async notificationItem => {
        let user = await userModel.findUserById(notificationItem.senderId);
        let timer = getTimelineOfNotificationItem(notificationItem.createdAt);
        return notificationModel.contents.getContent(notificationItem._id, notificationItem.type, notificationItem.isRead, user._id, user.username, user.avatar, timer);
      });
      let usersNotification = await Promise.all(usersNotificationPromise);
      resolve({usersNotification});
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
let getNotificationInfo = (userId, senderId, notificationId) =>{
  return new Promise( async (resolve, reject) => {
    try {
      //step 1 : get senderInfor
      let senderInfor = await userModel.findUserById(senderId);
      senderInfor = senderInfor.toObject();
      //step 2 :  get type notification 
      let notificationInfor = await notificationModel.model.findNotificationByIdAndUpdate(notificationId);    
      senderInfor.notificationType = notificationInfor.type;
      //step 3 : determine contact status, if no status return 0, else if status = false return 1, else if status = true return 2
      //senderId as userId and userId as contactId in database
      let contactInfor = await contactModel.findContact(senderId, userId);      
          
      if(!contactInfor){
        senderInfor.hasContact = 0;
      }else if(contactInfor.status==false){
        senderInfor.isSender = false ;
        if(contactInfor.userId == userId){
          senderInfor.isSender = true;
        }
        senderInfor.hasContact = 1;
        senderInfor.createdAtContact = contactInfor.createdAt;
      }else if(contactInfor.status==true){
        senderInfor.hasContact = 2; 
        senderInfor.updatedAtContact = contactInfor.updatedAt;
      }
      resolve(senderInfor);
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
      let listNotifications = await notificationModel.model.getAllNotificationsByReceiverId(userId);
      let usersContactPromise = listNotifications.map( async notificationItem => {
        let senderInfo = await userModel.findUserById(notificationItem.senderId);                      
        let timer = getTimelineOfNotificationItem(notificationItem.createdAt);
        return await notificationModel.contents.getContent(notificationItem._id, notificationItem.type, notificationItem.isRead, senderInfo._id, senderInfo.username, senderInfo.avatar, timer);
      })
      let usersContact = await Promise.all(usersContactPromise);     
      resolve(usersContact);
    } catch (error) {
      reject(error);
    }
  })
};

let markAsReadAllNotifications = userId => {
  return new Promise(async (resolve, reject) =>{
    try {
      let updateStatus = await  notificationModel.model.updateAllNotificationAsRead(userId);
      if(updateStatus.nModified == 0){
        return reject(transErrors.unable_updateNotification)
      }
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
