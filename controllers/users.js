// const User = require('../models/User')
// const User = require('../models/User')

const User = require("../models/User");

const register = async (req, res) => {
    const { username, password, email, image } = req.body
    console.log('registering user');
    const newUser = new User({ username, email, image })

    await User.register(newUser, password)
    res.redirect('/');

}








const getRegister = async (res, rs) => {
    res.status(200).json('get register form')
}


const getLogin = async (req, res) => {
    res.status(200).send('login page')
}
const login = async (req, res) => {
    res.status(200).send('User logged')
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






module.exports = { getRegister, getLogin, register, getProfile, updateProfile, deleteProfile, login, forgetPw, resetPw, updatePw, updateResetPw }