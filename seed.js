const faker = require('faker')

const Post = require('./models/Post')



const genFakePosts = async () => {
    await Post.deleteMany({})
    for (let i = 0; i <= 40; i++) {

        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: {
                "_id": "6411f57de28ec365fb1cdc3d",
                "username": "mimoune"
            }

        }
        await Post.create(post)
    }
    console.log(' 40 posts created')

}


module.exports = genFakePosts