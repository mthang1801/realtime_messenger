import {notification, contact} from "../services";
import {convertDateTimeToString} from "../helpers/clientHelper";
let getHome =async (req, res) => {

  let getNotifications = await notification.getNotifications(req.user._id);
  let countUnreadNotifications = await notification.countUnreadNotifications(req.user._id);
  let countRequestContactSent = await contact.countRequestContactSent(req.user._id);
  let countRequestContactReceived = await contact.countRequestContactReceived(req.user._id);
  let getRequestContactSender = await contact.getRequestContactSent(req.user._id);
  let getRequestContactReceiver = await contact.getRequestContactReceived(req.user._id);
  let getContactList = await contact.getContactList(req.user._id);

  
  return res.render("main/home/home",{
    activeSuccess : req.flash("activeSuccess"),
    user : req.user,  
    notifications : getNotifications,
    usersContactSent : getRequestContactSender ,
    unreadNotifications : countUnreadNotifications,
    usersContactReceived : getRequestContactReceiver,
    usersContactList : getContactList,
    countRequestContactSent : countRequestContactSent,
    countRequestContactReceived : countRequestContactReceived
  });
};

module.exports = {
  getHome : getHome
}
