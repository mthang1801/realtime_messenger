import notificationModel from "../models/notificationModel";
import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
import {getTimelineOfNotificationItem} from "../helpers/clientHelper";
import {transErrors} from "../../lang/vi";
import _ from "lodash";

const limited_notifications = +process.env.LIMIT_NOTIFICATIONS;

let getNotification = (userId) => {
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
}

module.exports ={
  getNotification : getNotification,
  countUnreadNotifications : countUnreadNotifications,
  readMoreNotification : readMoreNotification
}
