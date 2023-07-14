const User = require('../models/user');

const setRole = (async (req,res,next) => {
    if(!req.isAuthenticated()) {return res.redirect("/login")}
    const passportSession = req.session?.passport;
    const user = await User.findOne({username : passportSession.user }).exec()
    passportSession.role = user.role

    // console.log(passportSession);
    next();
})

module.exports = setRole