import {conversation} from "../services";
import {promisify} from "util";
import ejs from "ejs";
import {getLastItemInArray, convertToMessengerTimeStamp, bufferToBase64, convertDateTimeMessenger, convertDateTimeToString} from "../helpers/clientHelper";
import multer from "multer";
import {app} from "../config/app";
import {transErrors} from "../../lang/vi";
const  renderFile = promisify(ejs.renderFile).bind(ejs);
let chatTextAndEmoji =async(req, res) => {
 try {
  let messengerText = req.body.messenger ;
  let receiverId = req.body.targetId ;
  let isGroup = req.body.isGroup == "true" ? true : false ;  
  let userId = req.user._id ;
  let userName = req.user.username ; 
  let userAvatar = req.user.avatar;
  let lastTimeOnline = req.user.otherProps.lastTimeOnline;

  let sendStatus = await conversation.chatTextAndEmoji(userId, userName, userAvatar, receiverId , messengerText, isGroup); 
  return res.status(200).send({success: !!sendStatus, message: sendStatus})
 } catch (error) {
   return res.status(500).send(error);
 }
};


let updateMessageHasBeenReceived = async (req, res)=>{
  try {
    let messageId = req.body.messageId ;    
    let updateStatus = await conversation.updateMessageHasBeenReceived(messageId);    
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
    let userConversationRightSide =await renderFile("src/views/server_render/conversation/_userChatRightSide.ejs", dataToRender);
    let userConversationImageModal = await renderFile("src/views/server_render/conversation/_imageModal.ejs", dataToRender);
    let userConversationAttachmentModal = await renderFile("src/views/server_render/conversation/_attachmentModal.ejs", dataToRender);
    return res.status(200).send({
      userConversationLeftSide: userConversationLeftSide,
      userConversationRightSide:userConversationRightSide,
      userConversationImageModal : userConversationImageModal,
      userConversationAttachmentModal : userConversationAttachmentModal,
      user : req.user});
  } catch (error) {
    return res.status(500).send(error);
  }
};
//#region config messenger Image
let messengerImageStorage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, app.messenger_chat_directory);
  },
  filename : (req, file, cb) => {
    if(!app.messenger_chat_type.includes(file.mimetype)){
      return cb(transErrors.invalid_messenger_type);
    }
    let fileName = `${Date.now()}-${(Math.random()*10000000).toString(16)}-${file.originalname}`;
    cb(null, fileName);
  }
})

let messengerImageUploadFile = multer({
  storage : messengerImageStorage,
  limits : {fileSize : app.messenger_chat_maxSize}
}).single("msg-image-chat");

let chatImage =  (req, res) => {
  messengerImageUploadFile(req, res, async error => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.messenger_oversize);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        username : req.user.username , 
        avatar : req.user.avatar 
      }
      let receiverId = req.body.targetId;
      let isChatGroup = req.body.isChatGroup == "true" ? true : false ;
      
      let messengerValue = req.file;
      let newMessengerImage = await conversation.chatImage(req.user._id, sender, receiverId, isChatGroup, messengerValue);
      return res.status(200).send(newMessengerImage);
    } catch (error) {
      return res.status(500).send(error);
    }
  })
};
//#endregion

//#region config messenger Attachment
let attachmentStorage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, app.attachment_chat_directory);
  }, 
  filename : (req, file, cb) => {
    if(app.attachment_chat_type.includes(file.mimetype)){
      return cb(transErrors.not_attachment_chat, null);
    }
    let fileName = `${Date.now()}-${(Math.random()*1000000).toString(16)}-${file.originalname}`;
    cb(null, fileName);
  }
});

let attachmentUploadFile = multer({
  storage : attachmentStorage,
  limits : {fileSize : app.attachment_chat_maxSize}
}).single("msg-attachment-chat");

let chatAttachment = (req, res) => {
  attachmentUploadFile(req, res, async error =>{
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.attachment_oversize);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        username : req.user.username , 
        avatar : req.user.avatar 
      }
      let messengerValue = req.file;
      let receiverId = req.body.targetId;
      let isChatGroup = req.body.isChatGroup;
      let newMessengerAttachment = await conversation.chatAttachment(req.user._id, sender, receiverId, isChatGroup, messengerValue);
      return res.status(200).send(newMessengerAttachment)
    } catch (error) {
      return res.status(500).send(error)
    }
  })
};

let readMoreMessengers = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber ; 
    let targetId = req.query.targetId;
    let userId = req.user._id ; 
    let messengersList = await conversation.readMoreMessengers(userId, targetId, skipNumber);
    let dataToRender=  {
      messages : messengersList,
      user : req.user, 
      bufferToBase64 : bufferToBase64,
      convertDateTimeMessenger : convertDateTimeMessenger
    }    
    return res.status(200).render("server_render/conversation/_readMoreMessengers", dataToRender);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreAllConversations = async(req, res) => {
  try {
    let skipPrivates = +req.query.skipPrivates;
    let skipGroups = +req.query.skipGroups;
    let userId = req.user._id ; 
    let listConversations = await conversation.readMoreAllConversations(userId, skipPrivates, skipGroups);
    let dataToRender = {
      allConversations: listConversations,
      getLastItemInArray : getLastItemInArray ,
      convertToMessengerTimeStamp : convertToMessengerTimeStamp,
      convertDateTimeMessenger : convertDateTimeMessenger,
      bufferToBase64 : bufferToBase64,
      convertDateTimeToString : convertDateTimeToString,
      user : req.user
    };
    let readMoreAllConversationsLeftSide = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsLeftSide.ejs", dataToRender);
    let readMorePrivateConversationsLeftSide = await renderFile("src/views/server_render/conversation/_readMorePrivateConversationsLeftSide.ejs", dataToRender);
    let readMoreGroupConversationsLeftSide = await renderFile("src/views/server_render/conversation/_readMoreGroupConversationsLeftSide.ejs", dataToRender);
    let readMoreAllConversationsRightSide = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsRightSide.ejs", dataToRender);
    let readMoreAllConversationsImageModal = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsImageModal.ejs", dataToRender);    
    let readMoreAllConversationsAttachmentModal = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsAttachmentModal.ejs", dataToRender);   
    return res.status(200).send({
      readMoreAllConversationsLeftSide,
      readMorePrivateConversationsLeftSide, 
      readMoreGroupConversationsLeftSide,
      readMoreAllConversationsRightSide,
      readMoreAllConversationsImageModal,
      readMoreAllConversationsAttachmentModal
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMorePrivateConversations = async (req, res) => {
  try {
    let skipPrivates = +req.query.skipPrivates;
    let userId = req.user._id ;
    let listConversations = await conversation.readMoreAllConversations(userId, skipPrivates);
    let dataToRender = {
      allConversations: listConversations,
      getLastItemInArray : getLastItemInArray ,
      convertToMessengerTimeStamp : convertToMessengerTimeStamp,
      convertDateTimeMessenger : convertDateTimeMessenger,
      bufferToBase64 : bufferToBase64,
      convertDateTimeToString : convertDateTimeToString,
      user : req.user
    };
    let readMorePrivateConversationsLeftSide = await renderFile("src/views/server_render/conversation/_readMorePrivateConversationsLeftSide.ejs", dataToRender);
    let readMoreAllConversationsRightSide = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsRightSide.ejs", dataToRender);
    let readMoreAllConversationsImageModal = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsImageModal.ejs", dataToRender);    
    let readMoreAllConversationsAttachmentModal = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsAttachmentModal.ejs", dataToRender);   
    return res.status(200).send({     
      readMorePrivateConversationsLeftSide,    
      readMoreAllConversationsRightSide,
      readMoreAllConversationsImageModal,
      readMoreAllConversationsAttachmentModal
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreGroupConversations = async (req, res) => {
  try {
    let skipGroups = +req.query.skipGroups;
    let userId = req.user._id ;
    let listConversations = await conversation.readMoreGroupConversations(userId, skipGroups);
    let dataToRender = {
      allConversations: listConversations,
      getLastItemInArray : getLastItemInArray ,
      convertToMessengerTimeStamp : convertToMessengerTimeStamp,
      convertDateTimeMessenger : convertDateTimeMessenger,
      bufferToBase64 : bufferToBase64,
      convertDateTimeToString : convertDateTimeToString,
      user : req.user
    };
    let readMoreGroupConversationsLeftSide = await renderFile("src/views/server_render/conversation/_readMoreGroupConversationsLeftSide.ejs", dataToRender);
    let readMoreAllConversationsRightSide = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsRightSide.ejs", dataToRender);
    let readMoreAllConversationsImageModal = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsImageModal.ejs", dataToRender);    
    let readMoreAllConversationsAttachmentModal = await renderFile("src/views/server_render/conversation/_readMoreAllConversationsAttachmentModal.ejs", dataToRender);   
    return res.status(200).send({      
      readMoreGroupConversationsLeftSide,
      readMoreAllConversationsRightSide,
      readMoreAllConversationsImageModal,
      readMoreAllConversationsAttachmentModal
    })
  } catch (error) {
    return res.status(500).send(error);
  }
};


module.exports = {
  chatTextAndEmoji : chatTextAndEmoji,
  updateMessageHasBeenReceived : updateMessageHasBeenReceived,
  receiverHasSeenMessage : receiverHasSeenMessage,
  removeConversation : removeConversation,
  getUserConversation : getUserConversation,
  chatImage : chatImage,
  chatAttachment : chatAttachment,
  readMoreMessengers : readMoreMessengers,
  readMoreAllConversations : readMoreAllConversations,
  readMorePrivateConversations : readMorePrivateConversations,
  readMoreGroupConversations : readMoreGroupConversations,
}
