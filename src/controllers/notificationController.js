import {notification} from "../services";
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

module.exports = {
  readMoreNotification : readMoreNotification
}