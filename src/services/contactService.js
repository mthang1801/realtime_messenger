import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
import {transErrors} from "../../lang/vi";
import notificationModel from "../models/notificationModel";

const limit_contact_users = +process.env.LIMIT_CONTACT;

/**
 * 
 * @param {string} currentUserId 
 * @param {string} searchKey 
 * 1. get ContactId from contact List which contains userId 
 * 2. save contactId into deprecatedUserId in order not to appear when search
 * 
 */
let findUsersContact = (currentUserId, searchKey) => {
  return new Promise( async (resolve, reject) => {
    try {
      let deprecatedUsersId = [currentUserId.toString()] ;      
      let listUserId = [];
      let contactStatusTrueList = await contactModel.findAllContactWithStatusTrueByUserId(currentUserId);
      contactStatusTrueList.forEach( contact => {
        if(contact.userId == currentUserId){
          deprecatedUsersId.push(contact.contactId.toString());         
          return;
        }
        deprecatedUsersId.push(contact.userId.toString());
      })    
      let contactStatusFalseList = await contactModel.findAllContactWithStatusFalseByUserId(currentUserId);  
      
      // let usersList = await userModel.findUserWithDeprecatedUsersId(deprecatedUsersId, searchKey);
      let usersList = await userModel.findLimitedUserWithDeprecatedUsersId(deprecatedUsersId, searchKey, limit_contact_users);
      let newUsersList = [];
      usersList.forEach( (user, index) => {
        user = user.toObject();
        user.hasContact = 0; // no contact
        for(let i  = 0 ; i < contactStatusFalseList.length ; i++){
          if(contactStatusFalseList[i].userId == user._id ){
            user.hasContact = 2; // has contact and currentUser request add contact
            break;
          }
          if(contactStatusFalseList[i].contactId == user._id){
            user.hasContact = 1 ; // has contact and currentUser is receiver request add contact
            break;
          }
        }  
        newUsersList.push(user);      
      })         
      
      resolve(newUsersList); 
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * @param {string} contactId 
 * create contact 
 */
let addContact = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkContactExist = await contactModel.checkContactExist(userId, contactId);
      if(checkContactExist){
        return reject(transErrors.existed_contact);
      }
      let newContactItem = {
        userId : userId , 
        contactId : contactId
      }
      let newContact = await contactModel.createNew(newContactItem);                      
      let getContactInfo = await userModel.findUserById(contactId);                  
      //notification 
      let notificationItem = {
        senderId : userId , 
        receiverId : contactId ,
        type : notificationModel.types.ADD_CONTACT ,        
      }
      let notification = await notificationModel.model.createNew(notificationItem);

      resolve({contactCreatedAt : newContact.createdAt, getContactInfo, notificationId : notification._id});
    } catch (error) {
      reject(error);
    }
  })
};

let removeAddContact = (userId, contactId) => {
  return new Promise( async(resolve, reject) => {
    try {
      let checkAndRemoveContact = await contactModel.checkAndRemoveContact(userId, contactId);      
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * get list users who have userId request add contact
 */
let getRequestContactSent = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let contactList = await contactModel.getLimitedContactStatusFalseByUserId(userId, limit_contact_users);
      let listUsersPromise = contactList.map( async contact => {
        return await userModel.findUserById(contact.contactId);
      }) 
      resolve(await Promise.all(listUsersPromise));
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * get list users who have userId received add contact 
 */
let getRequestContactReceived = (userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let contactList = await contactModel.getContactStatusFalseByContactId(userId, limit_contact_users);
      let contactUsersReceiver = contactList.map(async contact => {
        return await userModel.findUserById(contact.userId);
      });
      resolve(await  Promise.all(contactUsersReceiver));
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * @param {string: myselft} contactId 
 * delete document in contact collection which contains userId and contactId
 */
let rejectRequestContact = (userId, contactId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let removeContact = await contactModel.checkAndRemoveContact(userId, contactId);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string : user request contact} userId 
 * @param {string : myself } contactId 
 * update status contact as true 
 * create notification to user who requested that add contact succesfully
 */
let acceptRequestContact = (userId, contactId) => {
  return new Promise( async (resolve, reject)=>{
    try {
      let contact = await contactModel.updateContactStatusAsTrue(userId, contactId);
      if(!contact){
        return reject(transErrors.unexisted_contact);
      }
      let getUserRequestContactInfo = await userModel.findUserById(userId);     
      //create notification 
      let notificationItem = {
        senderId : contactId , 
        receiverId : userId ,
        type : notificationModel.types.ACCEPT_CONTACT
      }
      let notification = await notificationModel.model.createNew(notificationItem);
      let data = {
        user : getUserRequestContactInfo, 
        contact : contact, 
        notificationId : notification._id
      }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string: either userId or contactId} userId 
 * get contactList with userId is either userId or contactId and condition is status must be true
 */
let getContactList = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      let contactList = await contactModel.getContactListByUserId(userId);   
      
      let userContactPromise = contactList.map( async contact => {        
        if(contact.userId == userId){
          let user = await userModel.findUserById(contact.contactId);
          user = user.toObject();
          user.contactUpdatedAt = contact.updatedAt;
          return user;
        }

        let user=  await userModel.findUserById(contact.userId);
        user = user.toObject();
        user.contactUpdatedAt = contact.updatedAt;
        return user;
      })
      let userContact = await Promise.all(userContactPromise);   
      resolve(userContact);
    } catch (error) {
      reject(error);
    }
  })
};

let removeContact = (userId, contactId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let removeContact = await contactModel.removeContact(userId, contactId);
      if(removeContact.n == 0){
        return reject(transErrors.deleted_contact);
      }      
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreSearchAllUsers = (currentUserId, skipNumber, searchKey) => {
  return new Promise( async (resolve, reject) => {
    try {
      let deprecatedUsersId = [currentUserId.toString()] ;      
      let listUserId = [];
      let contactStatusTrueList = await contactModel.findAllContactWithStatusTrueByUserId(currentUserId);
      contactStatusTrueList.forEach( contact => {
        if(contact.userId == currentUserId){
          deprecatedUsersId.push(contact.contactId.toString());         
          return;
        }
        deprecatedUsersId.push(contact.userId.toString());
      })    
      let contactStatusFalseList = await contactModel.findAllContactWithStatusFalseByUserId(currentUserId);  
      
      // let usersList = await userModel.findUserWithDeprecatedUsersId(deprecatedUsersId, searchKey);
      let usersList = await userModel.findUserWithDeprecatedUsersIdAndSkipNumber(deprecatedUsersId, searchKey, skipNumber);      
      let newUsersList = [];
      usersList.forEach( (user, index) => {
        user = user.toObject();
        user.hasContact = 0; // no contact
        for(let i  = 0 ; i < contactStatusFalseList.length ; i++){
          if(contactStatusFalseList[i].userId == user._id ){
            user.hasContact = 2; // has contact and currentUser request add contact
            break;
          }
          if(contactStatusFalseList[i].contactId == user._id){
            user.hasContact = 1 ; // has contact and currentUser is receiver request add contact
            break;
          }
        }  
        newUsersList.push(user);      
      })         
      
      resolve(newUsersList); 
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreRequestContactSent = (userId, skipNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contactList = await contactModel.getLimitedContactStatusFalseByUserId(userId, limit_contact_users, skipNumber);
      let listUsersPromise = contactList.map( async contact => {
        return await userModel.findUserById(contact.contactId);
      }) 
      let listUsers = await Promise.all(listUsersPromise);
      if(!listUsers.length){
        return reject(transErrors.empty_request_contact_sent)
      }
      resolve(listUsers);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreRequestContactReceived = (userId, skipNumber) => {
  return new Promise( async (resolve, reject) => {
    try {
      let contactList = await contactModel.getContactStatusFalseByContactId(userId, limit_contact_users, skipNumber);
      let contactUsersReceiverPromise = contactList.map(async contact => {
        return await userModel.findUserById(contact.userId);
      });
      let contactUsersReceiver = await  Promise.all(contactUsersReceiverPromise);
      if(!contactUsersReceiver.length){
        return reject(transErrors.empty_request_contact_received);
      }

      resolve(contactUsersReceiver);
    } catch (error) {
      reject(error);
    }
  })
};

let countRequestContactSent =(userId) => {
  return new Promise( async (resolve, reject) => {
    try {
      let countContactSent = await contactModel.countContactSentByUserId(userId);      
      resolve(countContactSent);
    } catch (error) {
      reject(error);
    }
  })
};

let countRequestContactReceived = (userId) => {
  return new Promise(async(resolve, reject) => {
    try {
      let countContactReceived = await contactModel.countContactReceivedByContactId(userId);      
      resolve(countContactReceived);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  findUsersContact: findUsersContact,
  addContact : addContact,
  removeAddContact : removeAddContact,
  getRequestContactSent : getRequestContactSent,
  getRequestContactReceived : getRequestContactReceived,
  rejectRequestContact : rejectRequestContact,
  acceptRequestContact : acceptRequestContact,
  getContactList : getContactList,
  removeContact : removeContact,
  readMoreSearchAllUsers : readMoreSearchAllUsers,
  readMoreRequestContactSent : readMoreRequestContactSent,
  readMoreRequestContactReceived : readMoreRequestContactReceived,
  countRequestContactSent : countRequestContactSent,
  countRequestContactReceived : countRequestContactReceived,
}
