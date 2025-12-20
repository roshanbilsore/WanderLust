const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/customError.js");
const wrapAsync = require("../utils/AsyncWrap.js");
const { scheama } = require("../schema.js");
const Listing = require("../models/listing.js");

// Validate Listing Middleware
const validateListing = (req, res, next) => {
    let { error } = scheama.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// ----------------------------
// All Listing Routes
// ----------------------------

// Get All Listings
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find();
    res.render("listing.ejs", { allListing });
}));

// Create New Listing Form
router.get("/new", (req, res) => {
    res.render("newListing.ejs");
});

// Show Single Listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("show.ejs", { listing });
}));

// Create Listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const listData = req.body.listing;
    const list1 = new Listing(listData);
    await list1.save();
    res.redirect("/listing");
}));

// Edit Listing Form
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
}));

// Update Listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listing/" + id);
}));

// Delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

module.exports = router;
