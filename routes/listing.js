const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListings } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer=require('multer');
const {storage}= require("../cloudConfig.js")
const upload= multer({storage})

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(
      isLoggedin,
      upload.single("listing[image]"),
    validateListings,
    wrapAsync(listingController.createListings)
  );
 

  router.get("/new", isLoggedin, wrapAsync(listingController.renderNewForm));

  
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedin,
    isOwner,
    wrapAsync(listingController.destroyListings)
  );

//to add new route

//Edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
