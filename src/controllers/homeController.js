import {notification, contact} from "../services";
let getHome =async (req, res) => {

  let getNotifications = await notification.getNotification(req.user._id);
  let countUnreadNotifications = await notification.countUnreadNotifications(req.user._id);
  let getRequestContactSender = await contact.getRequestContactSent(req.user._id);
  let getRequestContactReceiver = await contact.getRequestContactReceived(req.user._id);
  return res.render("main/home/home",{
    activeSuccess : req.flash("activeSuccess"),
    user : req.user,  
    notifications : getNotifications,
    usersContactSent : getRequestContactSender ,
    countUnreadNotifications : countUnreadNotifications,
    usersContactReceived : getRequestContactReceiver,
  });
};

module.exports = {
  getHome : getHome
}
