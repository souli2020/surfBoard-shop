const isLoggin = async (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.error = 'You need to be logged in to do that!';
    req.session.redirectTo = req.originalUrl;
    console.log(req.session)
    res.redirect('/login');
}

module.exports = isLoggin;