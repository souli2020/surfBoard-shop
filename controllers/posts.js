const Post = require('../models/Post')
const getPosts = async (req, res) => {
    const posts = await Post.find({}).sort('-updatedAt')
    if (posts.length < 1) {
        return res.status(404).send('No Posts yet')
    }
    res.status(200).render('posts/index', { posts })
    // res.status(200).json({ posts })

}
//new post form
const getNewPost = async (req, res) => {
    res.status(200).render('posts/new')

}
const createPost = async (req, res) => {
    const { title, price, description } = req.body
    const newPost = await Post.create({ ...req.body })
    // res.status(200).render('posts/new', { newPost })
    res.status(200).redirect(`/posts/${newPost._id}`)

}

const getPost = async (req, res) => {
    const postId = req.params.id

    const post = await Post.findOne({ _id: postId })
    res.status(200).render('posts/show', { post })

}
//show the dit post page
const getEditedPost = async (req, res) => {
    const postId = req.params.id
    const post = await Post.findOne({ _id: postId })

    res.status(200).render('posts/edit', { post })

}
const updatePost = async (req, res) => {
    const postId = req.params.id
    const post = await Post.findOneAndUpdate({ _id: postId }, req.body, { new: true, runValidators: true })


    res.status(200).redirect(`/posts/${post._id}`)

}

const deletePost = async (req, res) => {
    const postId = req.params.id
    console.log(postId)
    const post = await Post.findByIdAndDelete({ _id: postId })
    res.status(200).redirect('/posts')

}

module.exports = { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost }