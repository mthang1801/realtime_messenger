import {notification} from "../services";
import {convertDateTimeToString} from "../helpers/clientHelper";
let readMoreNotification =async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;
    let userId = req.user._id ; 
    let usersNotification = await notification.readMoreNotification(userId, skipNumber);  
    return res.status(200).send({usersNotification: usersNotification})
  } catch (error) {
    return res.status(500).send(error);
  }
};

let getNotificationInfo = async (req, res) => {
  try {
    let senderId = req.query.senderId;
    let notificationId = req.query.id;
    let userId = req.user._id ; 
    let senderInfo = await notification.getNotificationInfo(userId, senderId, notificationId);     
    return res.status(200).render("server_render/notification/_senderInfo.ejs", {senderInfo,convertDateTimeToString});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readAllNotifications = async (req, res) => {
  try {
    let userId = req.user._id ;
    
    let usersContact = await notification.readAllNotifications(userId);
    return res.status(200).send(usersContact);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let markAsReadAllNotifications = async (req, res) => {
  try {
    let userId = req.user._id ; 
    let resultUpdate = await notification.markAsReadAllNotifications(userId);
    return res.status(200).send({success : resultUpdate});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let getNotifications = async (req, res) =>{
  try {
    let userId = req.user._id ; 
    let getNotifications = await notification.getNotifications(userId);   
    return res.status(200).send({data :getNotifications});
  } catch (error) {
    return res.status(500).send(error);
  }
}
 
module.exports = {
  readMoreNotification : readMoreNotification,
  getNotificationInfo : getNotificationInfo,
  readAllNotifications : readAllNotifications,
  markAsReadAllNotifications : markAsReadAllNotifications,
  getNotifications : getNotifications,
}