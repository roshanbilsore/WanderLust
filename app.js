const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs" , ejsMate);


app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.set("view engine"  , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "/public")));

main().then(() => {
     console.log("mongoose is connected");
})
.catch((err) => {
   console.log(err)
});

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/" , (req , res) => {
    res.send("server is started");
})


app.get("/listing" , async (req , res) => {
   const allListing =  await  Listing.find();
    res.render("listing.ejs" , {allListing});
});

app.post("/listing" ,async (req ,res) => {
     const listing = req.body.listing;
     const list1 = new Listing(listing);
     await list1.save();
     res.redirect("/listing");
})

app.get("/testListing" , async (req , res)=>{
     let listing1 = new Listing({
         title : "My new Villa" ,
         description : "by the Beach" ,
         price : 1200,
         location : "Mumbai west",
         country : "India",
     });

     await listing1.save();
     console.log("sample was save");
     res.send("successfully testing");

});

//create new Listing
 
app.get("/listing/new" , (req , res)=>{
     res.render("newListing.ejs");
})

//Edit Existing Listing 

app.get("/listing/:id/edit" , async (req , res)=> {
      const {id} = req.params;
      const listing = await Listing.findById(id);
      res.render("edit.ejs" , {listing});
})

app.put("/listing/:id" , async (req , res) =>{
       const {id} = req.params;
       await Listing.findByIdAndUpdate(id , {...req.body.listing});
       res.redirect("/listing");
})
//delet Route
app.delete("/listing/:id" , async(req , res)=>{
     const {id} = req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listing");

})
app.get("/listing/:id" , async (req , res) => {
     const {id} = req.params;
     const listing = await Listing.findById(id);
     res.render("show.ejs" , {listing});
     
});
app.listen(8080 , () => {
    console.log("app is listening-....");
});

