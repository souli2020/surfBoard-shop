const mongoose = require('mongoose')
const Review = require('./Review')
const paginate = require('mongoose-paginate-v2')

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
        { url: String, public_id: String }
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
    ],
    avgRating: {
        type: Number,
        default: 0
    }


}, { timestamps: true })

//remove the reviews after the post been deleted
PostSchema.pre('remove', async function () {
    const post = this
    await Review.remove({
        _id: {
            $in: post.reviews
        }
    })
})

//calculate the average rating
PostSchema.methods.calculateAvgRating = async function () {
    const post = this
    let totalRatings = 0;
    if (post.reviews.length) {

        post.reviews.forEach(review => {
            return totalRatings += review.rating
        });
        post.avgRating = Math.round((totalRatings / post.reviews.length) * 10) / 10
    }
    else {
        post.avgRating = totalRatings;
    }

    let floorRating = Math.floor(post.avgRating)
    await post.save()
    return floorRating
}

//paginate
PostSchema.plugin(paginate);


module.exports = mongoose.model('Post', PostSchema)