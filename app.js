if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //used to create templates
const Expresserror = require("./utils/ExpressError");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js"); // requires the model with Passport-Local Mongoose plugged in
const dbUrl=process.env.DB_URL;


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method"));
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //to parse the data in req (req.body)
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); //tu use style.css in public folder

const store=MongoStore.create({
  mongoUrl: dbUrl,
 crypto:{
   secret : process.env.SECRET
 },
 touchAfter : 24*3600,
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires : Date.now() + 7 * 24 * 60 *60 * 1000,
    maxAge : 7 * 24 * 60 *60 * 1000,
    httpOnly: true
  }
}
store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// use static authenticate method of model in LocalStrategy  // authenticate() Generates a function that is used in Passport's LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  // serializeUser() Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());// deserializeUser() Generates a function that is used by Passport to deserialize users into the session



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;

  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/privacy", (req, res) => {
  //privacy route
  let siteName = "tranquiltrips.com";
  res.render("includes/privacy.ejs", { siteName });
});

app.get("/terms", (req, res) => {
  //terms route
  let siteName = "tranquiltrips.com";
  res.render("includes/terms.ejs", { siteName });
});

app.get("/refund", (req, res) => {
  //refund route
  let siteName = "tranquiltrips.com";
  res.render("includes/refund.ejs", { siteName });
});

app.get("/disclaimer", (req, res) => {
  //privacy route
  let siteName = "tranquiltrips.com";
  res.render("includes/disclaimer.ejs", { siteName });
});
app.get("/contact", (req, res) => {
  //privacy route
  let siteName = "tranquiltrips.com";
  res.render("includes/contact.ejs", { siteName });
});

app.get("/shipping", (req, res) => {
  //shipping route
  let siteName = "tranquiltrips.com";
  res.render("includes/shipping.ejs", { siteName });
});


app.all("*", (req, res) => {
  res.redirect("/listings");
});

app.use((err, req, res, next) => {
  let { status = 501, message = "Something went wrong" } = err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Sever is listening to port 8080");
});
