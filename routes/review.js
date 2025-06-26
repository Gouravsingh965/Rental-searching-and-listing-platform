const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedin,
  isReviewAuthor,
} = require("../middleware.js");
const { reviewPost } = require("../controllers/reviews.js");
const reviewController = require("../controllers/reviews.js");

//Review Post route
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.reviewPost)
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
