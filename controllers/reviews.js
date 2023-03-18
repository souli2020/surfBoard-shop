const Post = require('../models/Post')
const Review = require('../models/Review')



const createReview = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('reviews').exec()
    let haveReviewed = post.reviews.find(review => review.author.equals(req.user._id))
    console.log(haveReviewed)
    if (haveReviewed) {
        req.session.error = "You have already reviewed this post"
        return res.status(400).redirect(`/posts/${post._id}`)
    }
    req.body.author = req.user._id
    const review = await Review.create(req.body)
    post.reviews.push(review)
    await post.save()

    res.status(200).redirect(`/posts/${post._id}`)

}



const updateReview = async (req, res) => {
    console.log(req.params)

    const postId = req.params.id
    const reviewId = req.params.review_id
    const review = await Review.findByIdAndUpdate(reviewId, req.body, { new: true, runValidators: true })
    req.session.success = "Review Updated successfully!"
    res.status(200).redirect(`/posts/${postId}`)

}
const deleteReview = async (req, res) => {
    const postId = req.params.id
    const reviewId = req.params.review_id
    await Review.findByIdAndRemove(reviewId)
    await Post.findByIdAndUpdate(postId, { $pull: { reviews: reviewId } });
    req.session.success = "Review Deleted successfully!"


    res.status(200).redirect(`/posts/${postId}`)

}

module.exports = { createReview, updateReview, deleteReview }
