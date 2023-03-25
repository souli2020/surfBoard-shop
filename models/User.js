const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Must provide a username.'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        // required: [true, 'Must provide a password.'],
    },
    email: {
        type: String,
        required: [true, 'Must provide an email address.'],
        unique: true,
        trim: true,
    },
    image: {
        secure_url: {
            type: String,
            default: '/images/default-profile.jpg'
        },
        public_id: String
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post'
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date

})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)