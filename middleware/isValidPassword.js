const User = require('../models/User');

const isValidPassword = async (req, res, next) => {
    const { newPassword, passwordConfirmation } = req.body;



    const { user } = await User.authenticate()(req.user.username, req.body.currentPassword)
    if (user) {
        // check if new password values exist
        if (newPassword && passwordConfirmation) {
            // destructure user from res.locals
            // check if new passwords match
            if (newPassword === passwordConfirmation) {
                // set new password on user object
                await user.setPassword(newPassword);
                await user.save()
                // go to next middleware
                next();
            } else {
                // flash error
                req.session.error = 'New passwords must match!';
                // short circuit the route middleware and redirect to /profile
                return res.redirect('/profile');
            }
        } else {
            // go to next middleware
            next();
        }

    } else {
        // flash an error
        req.session.error = 'Incorrect Current Password!';
        // short circuit the route middleware and redirect to /profile
        return res.redirect('/profile');
    }
}

module.exports = isValidPassword 