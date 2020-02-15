let getLoginRegister = (req,res) => {
  return res.render("authentication/loginRegister");
}

module.exports = {
  getLoginRegister : getLoginRegister
}
