const passport = require('passport')

const User = require("../models/User");

//register
const getRegister = async (req, res) => {
    res.status(200).render('register', { title: 'Register' })
}

const register = async (req, res) => {
    const { username, password, email, image } = req.body
    console.log('registering user');
    const newUser = new User({ username, email, image })

    let user = await User.register(newUser, password);
    req.login(user, function (err) {
        if (err) { return next(err); }
        req.session.success = `Welcome to Surf Shop, ${user.username}!`;
        res.redirect('/');
    });

}


//login
const getLogin = async (req, res) => {
    // console.log(req.isAuthenticated())
    res.status(200).render('login', { title: 'Login' })
}
const login = async (req, res) => {
    const { username, password } = req.body;
    const { user, error } = await User.authenticate()(username, password);
    if (!user && error) {
        return next(error);
    }
    req.login(user, function (err) {
        if (err) return next(err);
        req.session.success = `Welcome back, ${username}!`;
        const redirectUrl = req.session.redirectTo || '/posts';
        // console.log(req.session.redirectTo)
        // console.log(req.isAuthenticated());
        res.status(302).redirect(redirectUrl);
        delete req.session.redirectTo;
    });

}
const logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
}







const getProfile = async (req, res) => {
    res.status(200).send('profile page')
}
const updateProfile = async (req, res) => {
    res.status(200).send('update profile page')
}
const deleteProfile = async (req, res) => {
    res.status(200).send('delete ¨rofile page')
}
const forgetPw = async (req, res) => {
    res.status(200).send('password forgeten page')
}
const updatePw = async (req, res) => {
    res.status(200).send('password forgeten page')
}
const resetPw = async (req, res) => {
    res.status(200).send('password forgeten page')
}
const updateResetPw = async (req, res) => {
    res.status(200).send('password forgeten page')
}






module.exports = { getRegister, getLogin, register, getProfile, updateProfile, deleteProfile, login, logOut, forgetPw, resetPw, updatePw, updateResetPw }