const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/customError.js");
const wrapAsync = require("./utils/AsyncWrap.js");
const { reviewSchema } = require("./schema.js");

const app = express();

// Import Routers
const listingRouter = require("./Routers/listing.js");

// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Use Listing Router
app.use("/listing", listingRouter);

// Mongoose Connection
main().then(() => console.log("mongoose is connected"))
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// Validate Reviews Middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// Home Route
app.get("/", (req, res) => {
    res.send("server is started");
});

// ---------------------------
// Review Routes
// ---------------------------

// Create Review
app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
}));

// Delete Review
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}));

// 404 Handler
app.use((req, res) => {
    throw new ExpressError(404, "Page Not Found");
});

// Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).render("error.ejs", { err });
});

// Start Server
app.listen(8080, () => {
    console.log("app is listening...");
});
