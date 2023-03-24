const passport = require('passport')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dgd8mcevc',
    api_key: '795329721125445',
    api_secret: process.env.CLOUDINARY_SECRET

})
const User = require("../models/User");
const Post = require('../models/Post')
//register
const getRegister = async (req, res) => {
    res.render('register', {
        title: 'Register',
        username: "",
        email: ""
    })
}

const register = async (req, res) => {
    // console.log(req.file);


    const { username, password, email, image } = req.body
    console.log(req.body)
    console.log('registering user');
    const userExists = await User.findOne({ email })

    if (userExists) {
        req.session.error = "User with the given email already exists";
        return res.redirect('/register')
    }
    const newUser = new User({ username, email, image })
    //check if the user add a profile image if not the default image will be used
    if (req.file) {

        newUser.image.secure_url = req.file.path
        newUser.image.public_id = req.file.filename

    }

    // console.log(newUser)
    let user = await User.register(newUser, password);

    req.login(user, function (err) {
        if (err) {
            req.session.error = "Something went wrong. We can't login the user."
            res.redirect('/register')
        }
        req.session.success = `Welcome to Surf Shop, ${user.username}!`;
        res.redirect('/');
    });

}


//login
const getLogin = async (req, res) => {
    if (req.isAuthenticated()) {
        req.session.success = 'You are already logged in';
        return res.redirect('/')
    }

    res.status(200).render('login', { title: 'Login' })


}
const login = async (req, res) => {
    const { username, password } = req.body;
    const { user, error } = await User.authenticate()(username, password);
    if (!user && error) {
        req.session.error = "Wrong password or username";
        return res.redirect('/login')
    }
    req.login(user, function (err) {
        if (err) {
            req.session.error = "Something went wrong";
        }
        req.session.success = `Welcome back, ${username}!`;
        const redirectUrl = req.session.redirectTo || '/posts'
        console.log(req.originalUrl)
        // console.log(req.isAuthenticated());
        res.status(302).redirect(redirectUrl);
        // delete req.session.redirectTo;
    });

}
const logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.success = "See you later";
        res.redirect('/');
    });
}





const getProfile = async (req, res) => {
    //the posts are returned in res.locals.posts in isLoggin middleware
    const posts = await Post.find().where('author').equals(req.user.id).limit(10)
    console.log(posts.length);
    res.status(200).render('profile', { posts })

}

const updateProfile = async (req, res) => {
    const { username, userEmail } = req.body
    // console.log(res.locals)
    res.locals.user = req.user;

    const { email } = req.user

    const user = await User.findOne({ email }).populate('image')
    console.log(`the user in update profile: ${user}`)
    if (!user) {
        req.session.error = "User not found";
        return res.redirect('/profile')
    }

    try {
        //check if the user want to update the profile image so the previous one should be deleted
        if (req.file) {
            const previousImageId = user.image.public_id;
            if (previousImageId) {
                await cloudinary.uploader.destroy(previousImageId);
                user.image.public_id = req.file.filename;
                user.image.secure_url = req.file.path;
                await user.save()
            }
            //check if the profile image is the default image
            else if (user.image.secure_url === "/images/default-profile.jpg") {
                user.image.public_id = req.file.filename;
                user.image.secure_url = req.file.path;
                await user.save()
            }

        }
        const newUser = await User.findOneAndUpdate({ email }, req.body, { new: true, runValidators: true })
        newUser.image.public_id = user.image.public_id;
        newUser.image.secure_url = user.image.secure_url;
        await newUser.save()
        await req.login(newUser, function (err) {
            if (err) {
                req.session.error = "Error logging in after profile update"
                return res.redirect('/profile')
            }
            req.session.success = "Profile Updated Successfully!"
            res.status(200).redirect('/profile')
        })
    } catch (err) {
        console.error(err)
        if (err.code === 11000) {
            req.session.error = "Username or email already exists";
            return res.redirect('/profile')
        }
        else
            req.session.error = "Error updating profile"
        return res.redirect('/profile')
    }

}








const deleteProfile = async (req, res) => {
    res.status(200).send('delete ¨rofile page')
}


const forgetPw = async (req, res) => {
    res.status(200).render('forgot-pw')
}





const updatePw = async (req, res) => {
    res.status(200).send('password updated')
}
const resetPw = async (req, res) => {
    res.status(200).send('password forgeten page')
}
const updateResetPw = async (req, res) => {
    res.status(200).send('password forgeten page')
}






module.exports = { getRegister, getLogin, register, getProfile, updateProfile, deleteProfile, login, logOut, forgetPw, resetPw, updatePw, updateResetPw }