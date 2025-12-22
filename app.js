const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/customError.js");
const wrapAsync = require("./utils/AsyncWrap.js");
const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user")

const app = express();


const sessionOptions = {
    secret : "crt",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true,
    }
};

app.get("/", (req, res) => {
    res.send("server is started");
});


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currUser = req.user ;
    next();
})


// Import Routers
const listingRouter = require("./Routers/listing.js");
const reviewRouter = require("./Routers/reviews.js");
const userRouter = require("./Routers/user.js");

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
app.use("/" , userRouter);


// Mongoose Connection
main().then(() => console.log("mongoose is connected"))
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


// Home Route

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
