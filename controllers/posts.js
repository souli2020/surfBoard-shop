const Post = require('../models/Post')
const Review = require('../models/Review')

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
    console.log(req.files)
    for (let file of req.files) {
        let image = await cloudinary.uploader.upload(file.path);
        req.body.images.push({
            url: image.secure_url,
            public_id: image.public_id
        })
    }

    const newPost = await Post.create({ ...req.body, images: req.body.images })
    // res.status(200).render('posts/new', { newPost })

    req.session.success = "New Post successfuly created"

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
    console.log(post)

    res.status(200).render('posts/edit', { post, title: `Edit Post` })

}
const updatePost = async (req, res) => {
    // console.log(req.body)
    // console.log(req.body.deleteImages)

    let post = await Post.findById(req.params.id)
    console.log(post.images)

    if (req.body.deleteImages && req.body.deleteImages.length) {
        let deleteImages = req.body.deleteImages

        for (let public_id of deleteImages) {
            await cloudinary.uploader.destroy(public_id)
            post.images = post.images.filter(img => img.public_id !== public_id)
        }

    }
    if (req.files) {
        for (let file of req.files) {
            let image = await cloudinary.uploader.upload(file.path);
            post.images.push({
                url: image.secure_url,
                public_id: image.public_id
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
        console.log(img.public_id)
        await cloudinary.uploader.destroy(img.public_id)
    }
    // await Post.deleteOne({ post })
    await post.remove()
    req.session.success = "Post deleted successfully!"
    res.status(200).redirect('/posts')

}

module.exports = { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost }