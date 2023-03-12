
const getReviews = async (req, res) => {
    res.status(200).send('Reviews TEST')

}

const createReview = async (req, res) => {
    res.status(200).send('create Review')

}

const getReview = async (req, res) => {
    res.status(200).send('show Review by id')

}
const getEditedReview = async (req, res) => {
    res.status(200).send('show edited Review by id')

}
const updateReview = async (req, res) => {
    res.status(200).send('update  Review by id')

}
const deleteReview = async (req, res) => {
    res.status(200).send('delete Review by id')

}

module.exports = { getReviews, createReview, getReview, updateReview, deleteReview, getEditedReview }
