import addNewContact from "./contacts/addNewContact";
import removeAddNewContact from "./contacts/removeAddNewContact";
import rejectRequestAddContact from "./contacts/rejectRequestAddContact";
import acceptRequestContactReceived from "./contacts/acceptRequestContactReceived";
import removeCurrentContact from "./contacts/removeCurrentContact";
import chatTextAndEmoji from "./conversation/chatTextAndEmoji";
import checkStatusConversation from "./conversation/checkStatusConversation";
import typingOn from "./conversation/typingOn";
import typingOff from "./conversation/typingOff";
import chatImage from "./conversation/chatImage";
import chatAttachment from "./conversation/chatAttachment";
import callVideo from "./conversation/callVideo";
let initSockets = (io) => {
  addNewContact(io);
  removeAddNewContact(io);
  rejectRequestAddContact(io);
  acceptRequestContactReceived(io);
  removeCurrentContact(io);
  chatTextAndEmoji(io);
  checkStatusConversation(io);
  typingOn(io);
  typingOff(io);
  chatImage(io);
  chatAttachment(io);
  callVideo(io);
};


module.exports = initSockets;
