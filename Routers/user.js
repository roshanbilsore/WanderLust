const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// Signup form
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// Signup submission (POST)
router.post("/signup", async(req, res) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registerUser = await User.register(newUser , password);
        req.login(registerUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "WEL-COME To WonderLust");
            res.redirect("/listing");
        })
    
    }catch(e){
        console.log("Signup Error:", e);
        req.flash("failure" , e.message);
        res.redirect("/signup");
    }
});

router.get("/login" , (req , res) =>{
    res.render("users/login.ejs");
})

router.post("/login" ,
    saveRedirectUrl ,
    passport.authenticate("local" , { failureRedirect : "/login" , failureFlash : true}) ,
    async(req , res) =>{
    req.flash("success" , "WEL-COME Back to WanderLust");
    let redirect = res.locals.redirectUrl || "/listing";
    res.redirect(redirect);
})

router.get("/logout" , (req , res) => {
    req.logOut((err) =>{
        if(err) {
           return next(err);
        }
        req.flash("success" , "you are logged out!!");
        res.redirect("/listing");
    })
})

module.exports = router;
