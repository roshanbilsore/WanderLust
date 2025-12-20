const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/customError.js");
const wrapAsync = require("./utils/AsyncWrap.js");
const { reviewSchema } = require("./schema.js");



const app = express();

// Import Routers
const listingRouter = require("./Routers/listing.js");
const reviewRouter = require("./Routers/reviews.js");

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
app.use("/", reviewRouter);


// Mongoose Connection
main().then(() => console.log("mongoose is connected"))
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


// Home Route
app.get("/", (req, res) => {
    res.send("server is started");
});

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
