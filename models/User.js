const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
    },
    password: {
        type: String,
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