const express = require('express')
const { getReviews, getNewReview, createReview, getReview, updateReview, deleteReview, getEditedReview } = require('../controllers/reviews')
const router = express.Router({ mergeParams: true })

router.get('/', getReviews)

router.post('/', createReview)
router.get('/:review_id', getReview)
router.get('/:review_id/edit', getEditedReview)
router.put('/:review_id', updateReview)
router.delete('/:review_id', deleteReview)

module.exports = router