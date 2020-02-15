let getLoginRegister = (req,res) => {
  return res.render("authentication/master");
}

module.exports = {
  getLoginRegister : getLoginRegister
}
