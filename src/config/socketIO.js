import passportSocketIo from "passport.socketio";

let configPassportSocketIO = (cookieParser, sessionStore, io) => {
  io.use(passportSocketIo.authorize({
    cookieParser : cookieParser,
    key : process.env.SESSION_KEY,
    secret : process.env.SESSION_SECRET,
    store : sessionStore,
    success : (data, accept) => {
      if(!data.user.logged_in){
        return accept("Invalid user", false);
      }
      return accept(null, true);
    },
    fail : (data, message, error, accept) => {
      return accept(error, false);
    }
  }))
}

module.exports = configPassportSocketIO;
