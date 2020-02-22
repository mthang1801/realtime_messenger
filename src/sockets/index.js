import addNewContact from "./contacts/addNewContact";
import removeAddNewContact from "./contacts/removeAddNewContact";
import rejectRequestAddContact from "./contacts/rejectRequestAddContact";
import acceptRequestContactReceived from "./contacts/acceptRequestContactReceived";
let initSockets = (io) => {
  addNewContact(io);
  removeAddNewContact(io);
  rejectRequestAddContact(io);
  acceptRequestContactReceived(io);
};


module.exports = initSockets;
