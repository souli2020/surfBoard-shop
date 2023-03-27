const Post = require('../models/Post')
const Review = require('../models/Review')
const { cloudinary } = require('../cloudinary')

//stringify the req.query   to use it in links
const querystring = require('querystring')

function removeSpecialChars(str) {
    // Define a regular expression to match all non-alphanumeric characters
    const pattern = /[^a-zA-Z0-9\s]/g;
    // Use the replace() method to replace all matches with an empty string
    return str.replace(pattern, '');
}

//get all posts and the filters
const getPosts = async (req, res) => {
    const searchParams = req.query;

    // build query object based on search params
    let query = {};

    // set avgRating filter only if provided
    if (searchParams.avgRating) {
        query.avgRating = {
            $in: Array.isArray(searchParams.avgRating) ?
                searchParams.avgRating.map((r) => Number(r)) :
                [Number(searchParams.avgRating)]
        };
    }

    // set price filter only if provided
    if (searchParams.price) {

        query.price = { $lt: Number(searchParams.price) };
    }



    if (searchParams.search) {
        let search = new RegExp(removeSpecialChars(searchParams.search), 'i');
        console.log(search)
        query.$or = [
            { title: search },
            { description: search },
            { location: search }

            // { description: { $regex: searchParams.search, $options: 'i' } }
        ];
    }

    const result = await Post.paginate(query, {
        page: req.query.page || 1,
        limit: 10,
        sort: { 'updatedAt': -1 }
    });

    console.log(`this the result :${result}`);


    if (result.docs.length < 1) {
        req.session.error = "No results found";
        return res.status(404).redirect('/');
    }

    const queryString = querystring.stringify(searchParams);



    res.render('posts/index', { result, title: 'All Posts', searchParams, queryString });

};
////////////////////////////////////////////////////


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

    // We dont need the code below, becausewe defined the post @ the middleware in res.locals.post
    // const postId = req.params.id
    // const post = await Post.findOne({ _id: postId })
    // res.status(200).render('posts/edit', { post, title: `Edit Post` })

    // console.log(res.locals.post)
    res.status(200).render('posts/edit');
}
const updatePost = async (req, res) => {
    // console.log(req.body)

    // we have access to the post from the isAuthor middleware and we can change the code below
    //to be const {post} = res.locals.post

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
    // Since we have access to the post from the isAuthor middleware and we can
    //change the code below to be const:
    // {post} = res.locals.post  "WE DON'T NEED TO SEARCH FOR THE POST BY MONGOOSE"
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