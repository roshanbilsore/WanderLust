module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure" , "You Must Be Logged in  You Are Not Logged Yet!!");
        return res.redirect("/login");
    }
    next();
};

//session is also update hence all data get updated
module.exports.saveRedirectUrl = (req , res ,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};