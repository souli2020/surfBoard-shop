const express = require('express')
const { createReview, updateReview, deleteReview } = require('../controllers/reviews')
const router = express.Router({ mergeParams: true })
const isReviewAuthor = require('../middleware/reviewAuthorMiddleware')


router.post('/', createReview)
router.put('/:review_id', isReviewAuthor, updateReview)
router.delete('/:review_id', isReviewAuthor, deleteReview)

module.exports = router