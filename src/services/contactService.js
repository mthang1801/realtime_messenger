import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
/**
 * 
 * @param {String} currentUserId 
 * @param {String} searchKey 
 * 1. get ContactId from contact List which contains userId 
 * 2. save contactId into deprecatedUserId in order not to appear when search
 * 
 */
let findUsersContact = (currentUserId, searchKey) => {
  return new Promise( async (resolve, reject) => {
    try {
      let deprecatedUsersId = [currentUserId.toString()] ;      
      let contactList = await contactModel.findAllContactByUserId(currentUserId);
      contactList.forEach( contact => {
        if(contact.userId == currentUserId){
          deprecatedUsersId.push(contact.contactId.toString());
          return;
        }
        deprecatedUsersId.push(contact.userId.toString());
      })    
     
      let usersList = await userModel.findUserWithDeprecatedUsersId(deprecatedUsersId, searchKey);
      resolve(usersList);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  findUsersContact: findUsersContact
}
