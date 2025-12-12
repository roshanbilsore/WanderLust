const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");


main().then(() => {
     console.log("database  is connected");
})
.catch((err) => {
   console.log(err)
});

async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
   
}

const init = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("database initiase sucessfully....");
};


init();