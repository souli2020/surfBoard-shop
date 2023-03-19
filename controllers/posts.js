const Post = require('../models/Post')
const Review = require('../models/Review')
const { cloudinary } = require('../cloudinary')
// cloudinary.config({
//     cloud_name: 'dgd8mcevc',
//     api_key: '795329721125445',
//     api_secret: process.env.CLOUDINARY_SECRET

// })

const getPosts = async (req, res) => {

    const result = await Post.paginate({}, {
        page: req.query.page || 1,
        limit: 10,
        sort: { 'updatedAt': -1 }
    })


    if (result.docs.length < 1) {
        return res.status(404).redirect('/')
    }
    req.session.success = "welcome"
    res.status(200).render('posts/index', { result, title: 'All Posts' })
    // res.status(200).json({ posts })

}
//new post form
const getNewPost = async (req, res) => {
    res.status(200).render('posts/new', { title: 'Add new Post' })

}
const createPost = async (req, res) => {
    req.body.images = []
    req.body.author = req.user._id
    // console.log(req.files)
    for (let file of req.files) {
        // let image = await cloudinary.uploader.upload(file.path);
        req.body.images.push({
            path: file.path,
            filename: file.filename
        })
    }

    const newPost = await Post.create({ ...req.body, images: req.body.images })
    // res.status(200).render('posts/new', { newPost })

    req.session.success = "New Post successfuly created"
    // console.log(newPost.images)

    res.status(200).redirect(`/posts/${newPost._id}`)

}
//show post 
const getPost = async (req, res) => {
    const postId = req.params.id
    const post = await Post.findOne({ _id: postId }).populate(
        {
            path: 'reviews',
            options: {
                sort: { createdAt: -1 }
            },
            populate: {
                path: 'author',
                model: "User"
            }
        }).populate({
            path: 'author',
            select: 'username' // Select the fields you want to return from the User model
        })
    const floorRating = await post.calculateAvgRating()
    res.status(200).render('posts/show', { post, floorRating, title: `${post.title}` })

}
//show the edit post page
const getEditedPost = async (req, res) => {
    const postId = req.params.id
    const post = await Post.findOne({ _id: postId })
    // console.log(post)

    res.status(200).render('posts/edit', { post, title: `Edit Post` })

}
const updatePost = async (req, res) => {
    // console.log(req.body)

    let post = await Post.findById(req.params.id)

    if (req.body.deleteImages && req.body.deleteImages.length) {
        let deleteImages = req.body.deleteImages

        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename)
            post.images = post.images.filter(img => img.filename !== filename)
        }

    }
    if (req.files) {
        for (let file of req.files) {
            // let image = await cloudinary.uploader.upload(file.path);
            post.images.push({
                path: file.path,
                filename: file.filename
            })
        }
    }
    post.title = req.body.title
    post.price = req.body.price
    post.description = req.body.description
    post.location = req.body.location
    post.save()
    // await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })


    res.status(200).redirect(`/posts/${post._id}`)

}

const deletePost = async (req, res) => {
    const postId = req.params.id
    const post = await Post.findById({ _id: postId })
    let images = post.images
    for (let img of images) {

        await cloudinary.uploader.destroy(img.filename)
    }
    // await Post.deleteOne({ post })
    await post.remove()
    req.session.success = "Post deleted successfully!"
    res.status(200).redirect('/posts')

}

module.exports = { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost }