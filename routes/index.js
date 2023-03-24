const express = require('express');

const router = express.Router();
const { getRegister, getLogin, register,
  getProfile, updateProfile, deleteProfile, login, logOut, forgetPw, updatePw, resetPw, updateResetPw } = require('../controllers/users');
const authenticateUser = require('../middleware/authenticat');
const isLoggin = require('../middleware/checkLog');
const isValidPassword = require('../middleware/isValidPassword');
const { cloudinary, storage } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop -Home' });
});

router.get('/register', getRegister)
router.post('/register', upload.single("image"), register)
router.get('/login', getLogin)
router.post('/login', login)
router.get('/logout', logOut)
router.get('/profile', isLoggin, getProfile)
router.put('/profile', isLoggin, upload.single('image'), updateProfile)
router.get('/forgot-pw', forgetPw)
router.put('/forgot-pw', updatePw)
router.get('/reset/:token', resetPw)
router.put('/reset/:token', updateResetPw)
router.delete('/', deleteProfile)
module.exports = router;
