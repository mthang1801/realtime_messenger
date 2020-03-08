import userModel from "../models/userModel";
import chatGroupModel from "../models/chatGroupModel";

/**
 * searching users except userId
 * @param {string} userId 
 * @param {string} searchKey 
 */
let searchUsers = (userId, searchKey) => {
  return new Promise(async (resolve, reject) => {
    try{    
      let usersList = await userModel.findUsersToAddNewGroup(userId, searchKey);      
      usersList.sort( (a,b) => a["username"].localeCompare(b["username"]));
      resolve(usersList);
    }catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * @param {string} groupName 
 * @param {array} listUsersId 
 * create new group
 * notify to each member that they have joined group
 */
let createNewGroup = (userId, groupName, listUsersId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let members = [{userId: userId}];
      listUsersId.forEach( userId => {
        members.push({userId: userId})
      })     
      let newGroupItem = {
        name : groupName,
        userAmount :listUsersId.length,
        admin : [{userId : userId}],
        members : members,      
      }
      let newGroup = await chatGroupModel.createNew(newGroupItem);
      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  searchUsers : searchUsers,
  createNewGroup : createNewGroup,
}