let getHome = (req, res) => {
  return res.render("main/home/home",{
    activeSuccess : req.flash("activeSuccess"),
    user : req.user
  });
}


module.exports = {
  getHome : getHome
}
