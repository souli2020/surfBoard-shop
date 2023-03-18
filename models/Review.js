const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    rating: {
        type: Number,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

}, { timestamps: true })

module.exports = mongoose.model('Review', ReviewSchema)