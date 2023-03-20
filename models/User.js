const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Must provide a username.'],
        unique: true
    },
    password: {
        type: String,
        // required: [true, 'Must provide a password.'],
    }, email: {
        type: String,
        required: [true, 'Must provide an email address.'],
        unique: true
    },
    image: {
        type: String,
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post'
        }
    ]

})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)