import notificationModel from "../models/notificationModel";
import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
import {getTimelineOfNotificationItem} from "../helpers/clientHelper";
import _ from "lodash";
let getNotification = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let getListNotification = await notificationModel.model.findNotificationByReceiverId(userId);     
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
}
module.exports ={
  getNotification : getNotification,
  countUnreadNotifications : countUnreadNotifications,
}
