import {conversation} from "../services";
import {promisify} from "util";
import ejs from "ejs";
import {getLastItemInArray, convertToMessengerTimeStamp} from "../helpers/clientHelper";
const  renderFile = promisify(ejs.renderFile).bind(ejs);
let chatTextAndEmoji =async(req, res) => {
 try {
  let messengerText = req.body.messenger ;
  let receiverId = req.body.targetId ;
  let isGroup = req.body.isGroup == "true" ? true : false ;  
  let userId = req.user._id ;
  let userName = req.user.username ; 
  let userAvatar = req.user.avatar;
  
  let sendStatus = await conversation.chatTextAndEmoji(userId, userName, userAvatar, receiverId , messengerText, isGroup); 
  return res.status(200).send({success: !!sendStatus, message: sendStatus})
 } catch (error) {
   return res.status(500).send(error);
 }
};


let updateMessageHasBeenReceived = async (req, res)=>{
  try {
    let message = req.body.message ;    
    let updateStatus = await conversation.updateMessageHasBeenReceived(message);    
    return res.status(200).send({success : !!updateStatus});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let receiverHasSeenMessage = async (req, res) => {
  try {
    let senderId = req.body.senderId ;r 
    let receiverId = req.user._id ; 
    let updateStatus = await conversation.updateHasSeenMessage(senderId, receiverId);   
    return res.status(200).send({success : !!updateStatus, receiverId : receiverId});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeConversation = async (req, res) => {
 try {
    let contactId = req.body.targetId;
    let userId = req.user._id ; 
    let status = await conversation.removeConversation(userId, contactId);
    return res.status(200).send({success : !!status});
 } catch (error) {
   return res.status(500).send(error); 
 }
};

let getUserConversation = async(req, res) => {
  try {
    let targetId = req.query.userId;
    let userInfo= await conversation.getUserConversation(targetId);
    let dataToRender = {
      user : userInfo ,
      getLastItemInArray : getLastItemInArray,
      convertToMessengerTimeStamp : convertToMessengerTimeStamp
    }
    let userConversationLeftSide = await renderFile("src/views/server_render/conversation/_userChatLeftSide.ejs", dataToRender);
    let userConversationRightSide =await renderFile("src/views/server_render/conversation/_userChatRightSide.ejs", dataToRender)
    return res.status(200).send({userConversationLeftSide: userConversationLeftSide, userConversationRightSide:userConversationRightSide});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  chatTextAndEmoji : chatTextAndEmoji,
  updateMessageHasBeenReceived : updateMessageHasBeenReceived,
  receiverHasSeenMessage : receiverHasSeenMessage,
  removeConversation : removeConversation,
  getUserConversation : getUserConversation
}
