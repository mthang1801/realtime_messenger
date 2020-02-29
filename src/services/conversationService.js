import contactModel from "../models/contactModel";
import userModel from "../models/userModel";
import chatGroupModel from "../models/chatGroupModel";
import messengerModel from "../models/messageModel";
import {transErrors} from "../../lang/vi";
import _ from "lodash";
import { chownSync } from "fs-extra";
/**
 * 
 * @param {string} userId 
 * step 1 : get contact with updatedAt and status true 
 * step 2 : filter contact list deprecate userId out of array
 */
const messengers_limitation = +process.env.LIMIT_MESENGERS;
let getAllConversations = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContactListFromMsgUpdatedAt(userId);    
      
      let usersConversationPromise = contacts.map( async contact => {        
        if(contact.userId == userId){
          let user = await userModel.findUserById(contact.contactId);
          user = user.toObject();
          user.msgUpdatedAt = contact.get("msgUpdatedAt");
          return user;
        }

        let user=  await userModel.findUserById(contact.userId);
        user = user.toObject();
        user.msgUpdatedAt = contact.get("msgUpdatedAt");
        return user;
      })    
      let usersConversation = await Promise.all(usersConversationPromise); 
      let groupsConversation = await chatGroupModel.findGroupConversationByUserId(userId);      
      
      let updateStatusIsReceived = messengerModel.model.updateStatusMessengerIsReceived(userId);
      
      //get Messages From users and group conversation      
      let usersConversationWithMessengersPromise = usersConversation.map( async user => {                
        let getMessengerFromUser = await messengerModel.model.getPrivateMessengers(userId, user._id, messengers_limitation);
        getMessengerFromUser = _.reverse(getMessengerFromUser);
        user.messages = getMessengerFromUser;
        return user;
      })
      let userConversationWithMessengers = await  Promise.all(usersConversationWithMessengersPromise);     
      let groupsConversationWithMessengersPromise = groupsConversation.map( async group => {
        group = group.toObject();
       
        let getMessengerFromGroup = await messengerModel.model.getGroupMessengers(group._id , messengers_limitation);           
        let seenersInfoPromise = getMessengerFromGroup.map( async group => {
          group = group.toObject();
          let seenersInfoPromise = group.groupSeen.map(async seener => {            
              return await  userModel.findSeenerInfoById(seener.userId);            
          })
          let seenersInfo = await Promise.all(seenersInfoPromise);          
          group.seenersInfo = seenersInfo;
          return group;
        })
        let seenersInfo = await Promise.all(seenersInfoPromise);       
        getMessengerFromGroup = _.reverse( seenersInfo);
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

let updateMessageHasBeenReceived = message => {
  return new Promise( async (resolve, reject) => {
    try {      
      let updateStatus = await messengerModel.model.updateMessageHasBeenReceived(message._id);
      resolve(updateStatus);
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


module.exports ={
  getAllConversations : getAllConversations,
  getAllMessengersContent : getAllMessengersContent,
  chatTextAndEmoji : chatTextAndEmoji,
  updateMessageHasBeenReceived : updateMessageHasBeenReceived,
  updateHasSeenMessage : updateHasSeenMessage,
}
