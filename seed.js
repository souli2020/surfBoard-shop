const faker = require('faker')

const Post = require('./models/Post')



const genFakePosts = async () => {
    await Post.deleteMany({})

    for (let i = 0; i <= 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random5 = Math.floor(Math.random() * 6);
        const title = faker.lorem.word();
        const description = faker.lorem.text();
        const postData = {
            title,
            description,
            price: random1000,
            avgRating: random5,
            author: '6420541eeab9760eb41d2efe'
        }
        let post = await Post.create(postData);
        await post.save();
    }
    console.log('600 new posts created');

}


module.exports = genFakePosts