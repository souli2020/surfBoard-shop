const express = require('express')
const { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost } = require('../controllers/posts')
const router = express.Router()

router.get('/', getPosts)
router.get('/new', getNewPost)
router.post('/', createPost)
router.get('/:id', getPost)
router.get('/:id/edit', getEditedPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)





module.exports = router