import contactModel from "../models/contactModel";
import userModel from "../models/userModel";
import chatGroupModel from "../models/chatGroupModel";
import messengerModel from "../models/messageModel";
import {transErrors} from "../../lang/vi";
import fsExtra from "fs-extra";
import _ from "lodash";
/**
 * 
 * @param {string} userId 
 * step 1 : get contact with updatedAt and status true 
 * step 2 : filter contact list deprecate userId out of array
 */
const messengers_limitation = +process.env.LIMIT_MESENGERS;
const conversations_limitation = +process.env.LIMIT_CONVERSATIONS;
let getAllConversations = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      //update mySelf is online 
      let updateMySelfHasOnline = await userModel.updateMySelfHasOnline(userId);      

      //get Messages from Users
      let contacts = await contactModel.getLimitedContactListFromMsgUpdatedAt(userId, conversations_limitation);          
      let usersConversationPromise = contacts.map( async contact => {        
        if(contact.userId == userId){
          let user = await userModel.findUserById(contact.contactId);
          user = user.toObject();
          user.msgUpdatedAt = contact.msgUpdatedAt;
          return user;
        }

        let user=  await userModel.findUserById(contact.userId);
        user = user.toObject();
        user.msgUpdatedAt = contact.msgUpdatedAt;
        return user;
      })    
      let usersConversation = await Promise.all(usersConversationPromise);                 
      let updateStatusIsReceived = messengerModel.model.updateStatusMessengerIsReceived(userId);
     
      let usersConversationWithMessengersPromise = usersConversation.map( async user => {                
        let getMessengerFromUser = await messengerModel.model.getPrivateMessengers(userId, user._id, messengers_limitation);
        getMessengerFromUser = _.reverse(getMessengerFromUser);
        user.messages = getMessengerFromUser;
        return user;
      })
      let userConversationWithMessengers = await  Promise.all(usersConversationWithMessengersPromise);    

      //get Messages from Groups
      let groupsConversation = await chatGroupModel.findLimitedGroupConversationByUserId(userId, conversations_limitation);
      let groupsConversationWithMessengersPromise = groupsConversation.map( async group => {
        group = group.toObject();
       
        let getMessengerFromGroup = await messengerModel.model.getGroupMessengers(group._id , messengers_limitation);                      
        getMessengerFromGroup = _.reverse( getMessengerFromGroup);
        group.messages = getMessengerFromGroup;
        return group;
      })
      let groupsConversationWithMessengers = await Promise.all(groupsConversationWithMessengersPromise);          
      let allConversations = [...userConversationWithMessengers, ...groupsConversationWithMessengers];
            
      allConversations=  _.sortBy(allConversations, item => -item.msgUpdatedAt);       
      
      resolve(allConversations);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreAllConversations = (userId, skipPrivates, skipGroups) => {
  return new Promise(async (resolve, reject) => {
    try {
       
      //get Messages from Users
      let contacts = await contactModel.getLimitedContactListFromMsgUpdatedAtWithSkipNumber(userId, skipPrivates, conversations_limitation);                
      let usersConversationPromise = contacts.map( async contact => {        
        if(contact.userId == userId){
          let user = await userModel.findUserById(contact.contactId);
          user = user.toObject();
          user.msgUpdatedAt = contact.msgUpdatedAt;
          return user;
        }

        let user=  await userModel.findUserById(contact.userId);
        user = user.toObject();
        user.msgUpdatedAt = contact.msgUpdatedAt;
        return user;
      })    
      let usersConversation = await Promise.all(usersConversationPromise);                 
      let updateStatusIsReceived = messengerModel.model.updateStatusMessengerIsReceived(userId);
     
      let usersConversationWithMessengersPromise = usersConversation.map( async user => {                
        let getMessengerFromUser = await messengerModel.model.getPrivateMessengers(userId, user._id, messengers_limitation);
        getMessengerFromUser = _.reverse(getMessengerFromUser);
        user.messages = getMessengerFromUser;
        return user;
      })
      let userConversationWithMessengers = await  Promise.all(usersConversationWithMessengersPromise);    

      //get Messages from Groups
      let groupsConversation = await chatGroupModel.findLimitedGroupConversationByUserIdWithSkipNumbers(userId, skipGroups, conversations_limitation);
      let groupsConversationWithMessengersPromise = groupsConversation.map( async group => {
        group = group.toObject();
       
        let getMessengerFromGroup = await messengerModel.model.getGroupMessengers(group._id , messengers_limitation);                      
        getMessengerFromGroup = _.reverse( getMessengerFromGroup);
        group.messages = getMessengerFromGroup;
        return group;
      })
      let groupsConversationWithMessengers = await Promise.all(groupsConversationWithMessengersPromise);          
      let allConversations = [...userConversationWithMessengers, ...groupsConversationWithMessengers];
            
      allConversations=  _.sortBy(allConversations, item => -item.msgUpdatedAt);       
      
      resolve(allConversations);
    } catch (error) {
      reject(error);
    }
  })
};

let readMorePrivateConversations = (userId, skipPrivates) => {
  return new Promise(async (resolve, reject) => {
    try {
       
      //get Messages from Users
      let contacts = await contactModel.getLimitedContactListFromMsgUpdatedAtWithSkipNumber(userId, skipPrivates, conversations_limitation);                
      let usersConversationPromise = contacts.map( async contact => {        
        if(contact.userId == userId){
          let user = await userModel.findUserById(contact.contactId);
          user = user.toObject();
          user.msgUpdatedAt = contact.msgUpdatedAt;
          return user;
        }

        let user=  await userModel.findUserById(contact.userId);
        user = user.toObject();
        user.msgUpdatedAt = contact.msgUpdatedAt;
        return user;
      })    
      let usersConversation = await Promise.all(usersConversationPromise);                 
      let updateStatusIsReceived = messengerModel.model.updateStatusMessengerIsReceived(userId);
     
      let usersConversationWithMessengersPromise = usersConversation.map( async user => {                
        let getMessengerFromUser = await messengerModel.model.getPrivateMessengers(userId, user._id, messengers_limitation);
        getMessengerFromUser = _.reverse(getMessengerFromUser);
        user.messages = getMessengerFromUser;
        return user;
      })
      let userConversationWithMessengers = await  Promise.all(usersConversationWithMessengersPromise);    
        
      let allConversations = [...userConversationWithMessengers];
            
      allConversations=  _.sortBy(allConversations, item => -item.msgUpdatedAt);       
      
      resolve(allConversations);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreGroupConversations = (userId, skipGroups) => {
  return new Promise(async (resolve, reject) => {
    try {

      //get Messages from Groups
      let groupsConversation = await chatGroupModel.findLimitedGroupConversationByUserIdWithSkipNumbers(userId, skipGroups, conversations_limitation);
      let groupsConversationWithMessengersPromise = groupsConversation.map( async group => {
        group = group.toObject();
       
        let getMessengerFromGroup = await messengerModel.model.getGroupMessengers(group._id , messengers_limitation);                      
        getMessengerFromGroup = _.reverse( getMessengerFromGroup);
        group.messages = getMessengerFromGroup;
        return group;
      })
      let groupsConversationWithMessengers = await Promise.all(groupsConversationWithMessengersPromise);          
      let allConversations = [...groupsConversationWithMessengers];
            
      allConversations=  _.sortBy(allConversations, item => -item.msgUpdatedAt);       
      
      resolve(allConversations);
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * 
 * @param {string} userId 
 * distinc private chat and groupChat , groupChat is always receiver
 * step 1: find group chat by UserId 
 * step 2: find all private messages without groupChat id as receiver
 * step 3: find all group messages chat by groupChat id , then assign it isGroup in order to distinc
 */
let getAllMessengersContent = userId => {
  return new Promise( async (resolve, reject) => {
    try {
      //step 1 
      let listGroups = await chatGroupModel.findGroupConversationByUserId(userId);
      //use to find all messsage in list group and to eliminate in private message
      let listGroupsId = []; 
      listGroups.forEach( group => {
        listGroupsId.push(group._id);
      })      
    
      //step 2 : find all private messages without groupChat id as receiver
      let listPrivateMessengers = await messengerModel.model.findAllPrivateMessages(userId, listGroupsId);
      let listConversationsId = [];
      listPrivateMessengers.forEach( message => {
        if(message.senderId == userId){
          listConversationsId.push(message.receiverId);
          return;
        }
        listConversationsId.push(message.senderId);
      });
      listConversationsId = _.uniqBy(listConversationsId);      
      let listPrivateMessengersFormat = [];
      listConversationsId.forEach( conversationId => {
        let privateMessengerObject = {};
        listPrivateMessengers.forEach( message => {
          if(message.senderId == conversationId) {
            if(Object.entries(privateMessengerObject).length==0){
              privateMessengerObject.userId = message.senderId;              
              privateMessengerObject.isGroup = false ;
              privateMessengerObject.userName = message.sender.username ;    
              privateMessengerObject.userAvatar = message.sender.avatar;                     
              privateMessengerObject.messages = [] ;            
              privateMessengerObject.messages = [...privateMessengerObject.messages, message]
            }else{              
              privateMessengerObject.messages = [...privateMessengerObject.messages, message]
            }
          }
          if(message.receiverId == conversationId){
            if(Object.entries(privateMessengerObject).length==0){
              privateMessengerObject.userId = message.receiverId;
              privateMessengerObject.receiverId = message.receiverId;   
              privateMessengerObject.username = message.receiver.username ; 
              privateMessengerObject.avatar = message.receiver.avatar;
              privateMessengerObject.isGroup = false ;                       
              privateMessengerObject.messages = [] ;            
              privateMessengerObject.messages = [...privateMessengerObject.messages, message]
            }else{              
              privateMessengerObject.messages = [...privateMessengerObject.messages, message]
            }
          }
        });
        listPrivateMessengersFormat.push(privateMessengerObject)
      })
      
      //step 3 : find all group messages chat by groupChat id , then assign it isGroup in order to distinc
      let listGroupsMessengers = await messengerModel.model.findAllGroupMessages(listGroupsId);        
      let listGroupMessengersFormar = []
      listGroupsId.forEach( groupId => {
        let groupMessengerObject = {};
        listGroupsMessengers.forEach( groupMessenger => {                     
          if(groupMessenger.receiverId == groupId){
            if(Object.entries(groupMessengerObject).length==0){
              groupMessengerObject.groupId = groupMessenger.receiverId;
              groupMessengerObject.groupName = groupMessenger.receiver.username;
              groupMessengerObject.groupAvatar = groupMessenger.receiver.avatar;
              groupMessengerObject.isGroup = true ;                          
              groupMessengerObject.messages = [];
              groupMessengerObject.messages = [...groupMessengerObject.messages, groupMessenger]
            }else{                     
              groupMessengerObject.messages = [...groupMessengerObject.messages, groupMessenger]
            }
          }         
        });
        listGroupMessengersFormar = [...listGroupMessengersFormar, groupMessengerObject];
      })   
      let listAllMessengers = [...listPrivateMessengersFormat, ...listGroupMessengersFormar];      
      resolve(listAllMessengers);
    } catch (error) {
      reject(error);
    }
  })
}
/**
 * distinct private or group chat
 * if priavte, create messenger with sender as userId and receiver as receiverId
 * if group, receiverId as groupId
 * update msgUpdatedAt in order to order contact list at left side 
 * @param {string} userId
 * @param {string} receiverId 
 * @param {string } messengerText 
 */
let chatTextAndEmoji = (userId, userName, userAvatar, receiverId , messengerText, isGroup) => {
  return new Promise( async (resolve, reject) => {
    try {
      //case for group
      if(isGroup){
        //find Group and update time when has new messenger     
        let groupInfo = await chatGroupModel.findGroupAndUpdateTimeWhenHasNewMessenger(receiverId);                        
        if(Object.entries(groupInfo).length==0){
          return reject(transErrors.send_message_fail);
        }
        let newMessengerItem = {
            senderId : userId , 
            receiverId : receiverId,
            conversationType :messengerModel.conversationType.GROUP,
            messageType : messengerModel.messageType.TEXT, 
            sender : {
              username : userName,
              avatar : userAvatar
            },
            receiver : {
              username : groupInfo.name , 
              avatar : groupInfo.avatar 
            },
            text : messengerText ,
            groupSeen : [{userId : userId}]            
        }

        //create new messenger
        let newMessenger = await messengerModel.model.createNew(newMessengerItem);              
        return resolve(newMessenger);
      }

      //case  for private 
      //1 : update contact msgUpdatedAt when has new messenger
      let updateContact = await contactModel.updateTimeWhenHasNewMessage(userId, receiverId);            
      if(Object.entries(updateContact).length==0){
        return reject(transErrors.send_message_fail);
      }
      let receiverInfo = await userModel.findUserById(receiverId);        
      let newMessengerItem = {
            senderId : userId , 
            receiverId : receiverId,
            conversationType :messengerModel.conversationType.PRIVATE,
            messageType : messengerModel.messageType.TEXT, 
            sender : {
              username : userName,
              avatar : userAvatar
            },
            receiver : {
              username : receiverInfo.username , 
              avatar : receiverInfo.avatar 
            },
            text : messengerText 
        };
        let newMessenger = await messengerModel.model.createNew(newMessengerItem);    
       
         resolve(newMessenger);
    } catch (error) {
      reject(error);
    }
  })
};

let updateMessageHasBeenReceived = messageId => {
  return new Promise( async (resolve, reject) => {
    try {      
      let updateStatus = await messengerModel.model.updateMessageHasBeenReceived(messageId);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * when user click conversation item, it immediately send to server update has seen message of that conversation
 */
let updateHasSeenMessage = (senderId, receiverId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let updateStatus = await messengerModel.model.updateHasSeenMessage(senderId, receiverId);       
      resolve(updateStatus);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * @param {string} contactId 
 * push userId to deprecatedMsgId at messengerModel
 * push userId to deprecatedMsgId at contactModel
 */
let removeConversation = (userId, contactId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let checkContactIdIsGroup = await chatGroupModel.findGroupById(contactId);
      if(checkContactIdIsGroup){
        return reject(transErrors.can_not_remove_group);
      }      
      let updateMessengers = await messengerModel.model.pushUserIdToRemoveMessagesList(userId, contactId);   
      
      let updateContactMessenger = await contactModel.pushUserIdToRemoveMessagesList(userId, contactId);
      
      // let removeConversation = await messengerModel.model.removeAllMessenger(userId, contactId);
      if(updateMessengers.nModified==0 && updateContactMessenger ==0){
        return reject(transErrors.update_failed);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

let getUserConversation = targetId => {
  return new Promise( async (resolve, reject) => {
    try {
      let userInfo = await userModel.findUserById(targetId);
      resolve(userInfo);
    } catch (error) {
      reject(error);
    }
  })
};

let chatImage = (senderId, sender, receiverId, isChatGroup, messengerValue) => {
  return new Promise( async (resolve, reject) => {
    try {

      let data = await fsExtra.readFile(messengerValue.path);
      let contentType = messengerValue.mimetype;
      let fileName = messengerValue.originalname;
      if(isChatGroup){
        //find Group and update time when has new messenger    
        let groupInfo = await chatGroupModel.findGroupById(receiverId);
  
        let newMessengerItem = {
          senderId : senderId , 
          receiverId : receiverId,
          conversationType :  messengerModel.conversationType.GROUP,
          messageType : messengerModel.messageType.IMAGE, 
          sender : sender,
          receiver : {
            username : groupInfo.name , 
            avatar : groupInfo.avatar
          },
          file : {data : data, contentType : contentType, fileName : fileName},
          hasReceived : true,
          groupSeen : [{userId : senderId}],         
        }
       
      
        //create new messenger
        let newMessenger = await messengerModel.model.createNew(newMessengerItem); 
        //remove file
        await  fsExtra.remove(messengerValue.path) ;
        return resolve(newMessenger);
      }

      //case  for private 
      //1 : update contact msgUpdatedAt when has new messenger
      let updateContact = await contactModel.updateTimeWhenHasNewMessage(senderId, receiverId);                 
      let receiverInfo = await userModel.findUserById(receiverId);        
      
      let newMessengerItem = {
            senderId : senderId , 
            receiverId : receiverId,
            conversationType :messengerModel.conversationType.PRIVATE,
            messageType : messengerModel.messageType.IMAGE, 
            sender : sender,
            receiver : {
              username : receiverInfo.username , 
              avatar : receiverInfo.avatar 
            },
            file : {data : data, contentType : contentType, fileName : fileName}
        };
        
        let newMessenger = await messengerModel.model.createNew(newMessengerItem);    
        //remove file 
        await fsExtra.remove(messengerValue.path);
         resolve(newMessenger);
    } catch (error) {
      reject(error);
    }
  })
};

let chatAttachment = (senderId, sender, receiverId, isChatGroup, messengerValue) => {
  return new Promise( async (resolve, reject) => {
    try {
      let data = await fsExtra.readFile(messengerValue.path);
      let contentType = messengerValue.mimetype;
      let fileName = messengerValue.originalname;
    
      if(isChatGroup){
        //find Group and update time when has new messenger    
        let groupInfo = await chatGroupModel.findGroupById(receiverId);  
        let newMessengerItem = {
          senderId : senderId , 
          receiverId : receiverId,
          conversationType :  messengerModel.conversationType.GROUP,
          messageType : messengerModel.messageType.FILE, 
          sender : sender,
          receiver : {
            username : groupInfo.name , 
            avatar : groupInfo.avatar
          },
          file : {data : data, contentType : contentType, fileName : fileName},
          hasReceived : true,
          groupSeen : [{userId : senderId}],         
        }
        //create new messenger
        let newMessenger = await messengerModel.model.createNew(newMessengerItem); 
        //remove file
        await  fsExtra.remove(messengerValue.path) ;
        return resolve(newMessenger);
      }

      //case  for private 
      //1 : update contact msgUpdatedAt when has new messenger
      let updateContact = await contactModel.updateTimeWhenHasNewMessage(senderId, receiverId);                 
      let receiverInfo = await userModel.findUserById(receiverId);        
      
      let newMessengerItem = {
            senderId : senderId , 
            receiverId : receiverId,
            conversationType :messengerModel.conversationType.PRIVATE,
            messageType : messengerModel.messageType.FILE, 
            sender : sender,
            receiver : {
              username : receiverInfo.username , 
              avatar : receiverInfo.avatar 
            },
            file : {data : data, contentType : contentType, fileName : fileName}
        };
        
        let newMessenger = await messengerModel.model.createNew(newMessengerItem);    
        //remove file 
        await fsExtra.remove(messengerValue.path);
         resolve(newMessenger);
    } catch (error) {
      reject(error);
    }
  
  })
};

let readMoreMessengers = (userId, targetId, skipNumber) => {
  return new Promise( async (resolve, reject) => {
    try {
      let messengersList = await messengerModel.model.readMoreMessengers(userId,targetId,skipNumber,messengers_limitation);
      if(!messengersList.length){
        return reject(error);
      }
      resolve(messengersList.reverse());
    } catch (error) {
      reject(error);
    }
  })
}
module.exports ={
  getAllConversations : getAllConversations,
  getAllMessengersContent : getAllMessengersContent,
  readMoreAllConversations : readMoreAllConversations,  
  readMorePrivateConversations : readMorePrivateConversations,
  readMoreGroupConversations : readMoreGroupConversations,
  chatTextAndEmoji : chatTextAndEmoji,
  updateMessageHasBeenReceived : updateMessageHasBeenReceived,
  updateHasSeenMessage : updateHasSeenMessage,
  removeConversation : removeConversation,
  getUserConversation : getUserConversation,
  chatImage : chatImage,
  chatAttachment : chatAttachment,
  readMoreMessengers : readMoreMessengers,
}
