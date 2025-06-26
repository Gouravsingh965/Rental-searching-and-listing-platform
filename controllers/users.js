const Review = require("../models/review");
const Listing = require("../models/listing.js");
const User=require("../models/user.js");


module.exports.getSignup=(req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.getLogin=(req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.postSignup=(async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);  //passport used here
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
         return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })

  module.exports.postLogin=(async (req, res) => {
    req.flash("success","Welcome to wanderlust you are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  })

  module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
      if(err){

        next(err);
      }
      req.flash("success","You are logged out!");
      res.redirect("/listings");
    })
}