let getHome = (req, res) => {
  return res.render("main/home/home",{
    activeSuccess : req.flash("activeSuccess")
  });
}


module.exports = {
  getHome : getHome
}
