import {conversation} from "../services";

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
    let senderId = req.body.senderId ; 
    let receiverId = req.user._id ; 
    let updateStatus = await conversation.updateHasSeenMessage(senderId, receiverId);   
    return res.status(200).send({success : !!updateStatus, receiverId : receiverId});
  } catch (error) {
    return res.status(500).send(error);
  }
};


module.exports = {
  chatTextAndEmoji : chatTextAndEmoji,
  updateMessageHasBeenReceived : updateMessageHasBeenReceived,
  receiverHasSeenMessage : receiverHasSeenMessage,
}
