
const getPosts = async (req, res) => {
    res.status(200).send('posts')

}
const getNewPost = async (req, res) => {
    res.status(200).send('new posts')

}
const createPost = async (req, res) => {
    res.status(200).send('create post')

}

const getPost = async (req, res) => {
    res.status(200).send('show post by id')

}
const getEditedPost = async (req, res) => {
    res.status(200).send('show edited post by id')

}
const updatePost = async (req, res) => {
    res.status(200).send('update  post by id')

}
const deletePost = async (req, res) => {
    res.status(200).send('delete post by id')

}

module.exports = { getPosts, getNewPost, createPost, getPost, updatePost, deletePost, getEditedPost }