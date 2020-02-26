import {notification, contact, conversation} from "../services";
import {convertDateTimeToString, convertToMessengerTimer} from "../helpers/clientHelper";
let getHome =async (req, res) => {

  //get Notifcation list in order to render notification board
  let getNotifications = await notification.getNotifications(req.user._id);
  //count notification at navbar, request contact sent and request contact received at contact modal
  let countUnreadNotifications = await notification.countUnreadNotifications(req.user._id);
  let countRequestContactSent = await contact.countRequestContactSent(req.user._id);
  let countRequestContactReceived = await contact.countRequestContactReceived(req.user._id);
  //get contact (request) list at contact modal
  let getRequestContactSender = await contact.getRequestContactSent(req.user._id);
  let getRequestContactReceiver = await contact.getRequestContactReceived(req.user._id);
  let getContactList = await contact.getContactList(req.user._id);
  //get conversations
  let getAllConversations = await conversation.getAllConversations(req.user._id);
  let getAllMessengersContent = await conversation.getAllMessengersContent(req.user._id);
  return res.render("main/home/home",{
    activeSuccess : req.flash("activeSuccess"),
    user : req.user,  
    notifications : getNotifications,
    usersContactSent : getRequestContactSender ,
    unreadNotifications : countUnreadNotifications,
    usersContactReceived : getRequestContactReceiver,
    usersContactList : getContactList,
    countRequestContactSent : countRequestContactSent,
    countRequestContactReceived : countRequestContactReceived,
    convertDateTimeToString : convertDateTimeToString,
    convertToMessengerTimer : convertToMessengerTimer,
    allConversations : getAllConversations,
    allMessengers : getAllMessengersContent
  });
};

module.exports = {
  getHome : getHome
}
