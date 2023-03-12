const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({

    title: {
        type: String,
    },
    price: {
        type: String,
    },
    description: {
        type: String,

    },
    images: [
        String
    ],
    location: String,
    lat: Number,
    long: Number,
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Review'
        }
    ]


}, { timestamps: true })


module.exports = mongoose.model('Post', PostSchema)