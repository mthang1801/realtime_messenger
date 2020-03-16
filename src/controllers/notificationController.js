import {notification} from "../services";
import {convertDateTimeToString} from "../helpers/clientHelper";
import {promisify} from "util";
import ejs from "ejs";
const renderFile = promisify(ejs.renderFile).bind(ejs);

let readMoreNotification =async (req, res) => {
  try {
    let skipPrivateNumbers = +req.query.skipPrivateNumbers;
    let skipGroupNumbers = +req.query.skipGroupNumbers;   
    let userId = req.user._id ; 
    let allNotificationsContent = await notification.readMoreNotification(userId, skipPrivateNumbers, skipGroupNumbers);  
    return res.status(200).send({allNotificationsContent: allNotificationsContent})
  } catch (error) {
    return res.status(500).send(error);
  }
};

let getNotificationInfo = async (req, res) => {
  try {
    let senderId = req.query.senderId;
    let notificationId = req.query.id;
    let isGroup = req.query.isGroup=="true" ? true : false ;
    let groupId = req.query.groupId ;
    let userId = req.user._id ; 
    let notificationInfo = await notification.getNotificationInfo(userId, senderId, notificationId, isGroup, groupId);
    let notificationModal = "";
    let type = "";
    if(notificationInfo.senderInfo){
      let senderInfo = notificationInfo.senderInfo;
      notificationModal =await renderFile("src/views/server_render/notification/_senderInfo.ejs", {senderInfo,convertDateTimeToString});
      type="private";
    }
    else {
      let groupInfo = notificationInfo.groupInfo;     
      notificationModal = await renderFile("src/views/server_render/notification/_groupInfo.ejs", {groupInfo, convertDateTimeToString});    
      type="group";
    }
    return res.status(200).send({
      dataRender: notificationModal,
      type : type 
    })
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