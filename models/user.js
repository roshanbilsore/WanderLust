const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// FIX: import default function
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

// APPLY PLUGIN
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
