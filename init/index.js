//For initailization of data
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const ListingData = require("./data.js");

async function main() {
  await mongoose.connect("mongodb+srv://khatipk14:jrT05LIiv9Z4ilKm@cluster0.5zdsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}
main()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({}); //To clear the database at initialization
  ListingData.data = ListingData.data.map((obj) => ({
    ...obj,
    owner: "66dcad8637f55218869e8820",
  }));
  await Listing.insertMany(ListingData.data);
  console.log("Database initialised with all the listing in data.js file");
};

initDB();
