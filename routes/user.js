const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Expresserror = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.getSignup)
.post(wrapAsync(userController.postSignup));

router.route("/login")
.get(userController.getLogin)
.post(
  saveRedirectUrl,
  passport.authenticate("local", { //passport.authenticate() is a MW used to check existing Data in DB
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.postLogin)
);

router.get("/logout", userController.logOut);

module.exports = router;
