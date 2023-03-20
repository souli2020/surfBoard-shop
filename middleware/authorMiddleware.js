const Post = require('../models/Post')


const isAuthor = async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    if (post.author.equals(req.user._id)) {
        res.locals.post = post
        return next()
    }
    req.session.error = "Access denied!"
    res.redirect(`/posts`)
}

module.exports = isAuthor