const User = require('../models/User')




const isUserExists = async (req, res, next) => {
    console.log(req.body)
    const { email } = req.body.email
    const userExists = await User.findOne({ email })
    // console.log(userExists)
    if (userExists) {
        req.session.error = 'User with same email already exists!'
        return res.status(200).redirect('back')
    }

    next()
}

module.exports = isUserExists