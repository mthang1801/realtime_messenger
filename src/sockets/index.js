import addNewContact from "./contacts/addNewContact";
import removeAddNewContact from "./contacts/removeAddNewContact";
import rejectRequestAddContact from "./contacts/rejectRequestAddContact";
let initSockets = (io) => {
  addNewContact(io);
  removeAddNewContact(io);
  rejectRequestAddContact(io);
};


module.exports = initSockets;
