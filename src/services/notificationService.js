import notificationModel from "../models/notificationModel";

let getNotification = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let getListNotification = await notificationModel.findNotificationByUserId(userId);
      console.log(getListNotification);
    } catch (error) {
      reject(error);
    }
  })
};

module.exports ={
  getNotification : getNotification
}
