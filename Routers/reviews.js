const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/AsyncWrap.js");
const ExpressError = require("../utils/customError.js");

const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// ---------------------------
// Validate Reviews Middleware
// ---------------------------
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// ---------------------------
// Create Review
// POST /listing/:id/reviews
// ---------------------------
router.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) throw new ExpressError(404, "Listing Not Found");

    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    req.flash("success" , "Review Is Added")

    res.redirect(`/listing/${listing._id}`);
}));

// ---------------------------
// Delete Review
// DELETE /listing/:id/reviews/:reviewId
// ---------------------------
router.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "review is Deleted!!")

    res.redirect(`/listing/${id}`);
}));

module.exports = router;
