import {notification} from "../services";

let getHome =async (req, res) => {

  let getNotification = await notification.getNotification(req.user._id);
  
  return res.render("main/home/home",{
    activeSuccess : req.flash("activeSuccess"),
    user : req.user,  
  });
}


module.exports = {
  getHome : getHome
}
