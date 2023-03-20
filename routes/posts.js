const express = require('express')
const router = express.Router()
const multer = require('multer')
const { cloudinary, storage } = require('../cloudinary')
const upload = multer({ storage })

const isLoggin = require('../middleware/checkLog')
const isAuthor = require('../middleware/authorMiddleware')

const { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost } = require('../controllers/posts')
router.get('/', isLoggin, getPosts)
router.get('/new', isLoggin, getNewPost)
router.post('/', upload.array('images', 4), isLoggin, createPost)
router.get('/:id', isLoggin, getPost)
router.get('/:id/edit', isAuthor, getEditedPost)
router.put('/:id', isAuthor, upload.array('images', 4), updatePost)
router.delete('/:id', isAuthor, deletePost)





module.exports = router