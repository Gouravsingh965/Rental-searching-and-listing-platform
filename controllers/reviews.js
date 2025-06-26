const Review = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.reviewPost = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); //passing to backend
  newReview.author = req.user._id;
  console.log(newReview.author);
  listing.reviews.push(newReview); //passing Our review into review Schema .ie listing=> reviews
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Added!");

  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
