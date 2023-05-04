const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minLength: 3,
        required: true,

    },
},
{
    timestamps: true
});

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema);

module.exports = User;