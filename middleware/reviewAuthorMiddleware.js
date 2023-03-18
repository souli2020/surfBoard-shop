const Review = require('../models/Review')


//NO NEED FOR THE MIDDELWARE IF YOU WANT TO JUST HIDE THE EDIT FROM THE VIEW

const isReviewAuthor = async (req, res, next) => {
    let review = await Review.findById(req.params.review_id)

    if (review.author.equals(req.user._id)) {
        return next()
    }
    req.session.error = " Only author can  edit or delete review"
    res.status(302).redirect('/posts')


}

module.exports = isReviewAuthor