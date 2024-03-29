const express = require('express')
const router = express.Router()
const multer = require('multer')
const { cloudinary, storage } = require('../cloudinary')
const upload = multer({ storage })


const isAuthor = require('../middleware/authorMiddleware')

const { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost } = require('../controllers/posts')
router.get('/', getPosts)
router.get('/new', getNewPost)
router.post('/', upload.array('images', 4), createPost)
router.get('/:id', getPost)
router.get('/:id/edit', isAuthor, getEditedPost)
router.put('/:id', isAuthor, upload.array('images', 4), updatePost)
router.delete('/:id', isAuthor, deletePost)





module.exports = router