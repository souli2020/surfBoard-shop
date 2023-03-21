const passport = require('passport')

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
    const { username, password, email, image } = req.body
    console.log('registering user');
    const userExists = await User.findOne({ email })
    if (userExists) {
        const { username, email } = req.body
        req.session.error = "User with the given email already exists";
        return res.redirect('register')
    }
    const newUser = new User({ username, email, image })

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
    res.status(200).send('update profile page')
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