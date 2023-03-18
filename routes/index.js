const express = require('express');

const router = express.Router();
const { getRegister, getLogin, register,
  getProfile, updateProfile, deleteProfile, login, logOut, forgetPw, updatePw, resetPw, updateResetPw } = require('../controllers/users');
const authenticateUser = require('../middleware/authenticat');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop -Home' });
});

router.get('/register', getRegister)
router.post('/register', register)
router.get('/login', getLogin)
router.post('/login', authenticateUser, login)
router.get('/logout', logOut)
router.get('/profile', getProfile)
router.put('/profile/:user_id', updateProfile)
router.get('/forgot-pw', forgetPw)
router.put('/forgot-pw', updatePw)
router.get('/reset/:token', resetPw)
router.put('/reset/:token', updateResetPw)
router.delete('/', deleteProfile)
module.exports = router;
