const passport = require('passport')
// In your controller file
const authenticateUser = passport.authenticate('local',
    {
        // successRedirect: '/',
        // successMessage: "user logged successfuly",
        failWithError: true,
        failureRedirect: "/login",
        // failureMessage: "user unauthenticated"
    })
// const authenticateUser = (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (err) {
//             console.log(err);
//             return next(err);
//         }

//         if (!user) {
//             req.flash('error', info.message);
//             return res.redirect('/login');
//         }

//         req.logIn(user, (err) => {
//             if (err) {
//                 console.log(err);
//                 return next(err);
//             }
//             return res.redirect('/');
//         });
//     })(req, res, next);
// };




module.exports = authenticateUser