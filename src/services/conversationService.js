import contactModel from "../models/contactModel";
import userModel from "../models/userModel";
import chatGroupModel from "../models/chatGroupModel";
import messengerModel from "../models/messageModel";
import _ from "lodash";
/**
 * 
 * @param {string} userId 
 * step 1 : get contact with updatedAt and status true 
 * step 2 : filter contact list deprecate userId out of array
 */
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
      let groupConversation = await chatGroupModel.findGroupConversationByUserId(userId);
      let allConversations = [...usersConversation, ...groupConversation];     
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

module.exports ={
  getAllConversations : getAllConversations,
  getAllMessengersContent : getAllMessengersContent,
}
