const Listing = require("../models/listing.js");
const axios = require('axios');

// Geocoding using OpenStreetMap
async function getCoordinates(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'TranquilTripsApp/1.0 (your_email@example.com)' // Use your real email
    }
  });

  if (response.data.length === 0) {
    throw new Error('Location not found');
  }

  const { lat, lon } = response.data[0];
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon)
  };
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing requested was not found or deleted!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// Create route
module.exports.createListings = async (req, res, next) => {
  try {
    const coords = await getCoordinates(req.body.listing.location);
    const listing = new Listing(req.body.listing);

    listing.geometry = {
      type: 'Point',
      coordinates: [coords.longitude, coords.latitude]
    };

    listing.owner = req.user._id; // Set owner info

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing requested was not found or deleted!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListings = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
