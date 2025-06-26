const Listing = require("./models/listing");
const Expresserror=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js"); //joi
const {reviewSchema}=require("./schema.js"); //for joi
const Review= require("./models/review");





module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        console.log(req.user);
        req.flash("error","You must be logged in to create listing");
        res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have access for this");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListings=(req,res,next)=>{
  let {error}= listingSchema.validate(req.body); //sending data of req.body to validate

  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new Expresserror(400,error)
  }else{
    next();
  }
}


module.exports.validateReview=(req,res,next)=>{
  let {error}= reviewSchema.validate(req.body); //sending data of req.body to validate

  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new Expresserror(400,error)
  }else{
    next();
  }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;  //reviewId in review.js routes
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
