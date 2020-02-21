import addNewContact from "./contacts/addNewContact";
import removeAddNewContact from "./contacts/removeAddNewContact";
let initSockets = (io) => {
  addNewContact(io);
  removeAddNewContact(io);
};


module.exports = initSockets;
