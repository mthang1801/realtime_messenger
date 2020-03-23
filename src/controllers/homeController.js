import {notification, contact, conversation, groupChat} from "../services";
import {convertDateTimeToString, convertToMessengerTimeStamp, getLastItemInArray, bufferToBase64, convertDateTimeMessenger} from "../helpers/clientHelper";
import  request from "request";
let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);  
    // let options = {
    //   url: "https://global.xirsys.net/_turn/messenger",      
    //   method: "PUT",
    //   headers: {
    //       "Authorization": "Basic " + Buffer.from("mthang1801:29d7bddc-5f78-11ea-acee-0242ac110004").toString("base64"),
    //       "Content-Type": "application/json",
    //       "Content-Length": bodyString.length
    //   }
    // };

    // //Call request to get ICE 
    // request(options, (error, response, body) => {
    //   if(error){
    //     console.log("get ICE occurs error: ", );
    //     return reject(error);
    //   }
    //   let bodyJSON = JSON.parse(body);     
      // resolve(bodyJSON.v.iceServers)
      resolve([]);
    // })
  })
};

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
  //get group members
  let getGroupMembers = await groupChat.getGroupMembers(req.user._id);
  let ICEServerList = await getICETurnServer();
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
    convertToMessengerTimeStamp : convertToMessengerTimeStamp,
    allConversations : getAllConversations,
    groupChatMembers : getGroupMembers,
    getLastItemInArray : getLastItemInArray,
    bufferToBase64 : bufferToBase64,
    convertDateTimeMessenger : convertDateTimeMessenger,
    ICEServerList : JSON.stringify(ICEServerList)
  });
};

module.exports = {
  getHome : getHome
}
