const express = require("express");
const router = require("express").Router();
const User = require("../models/user");
const passport = require("passport");

router.post("/register" , async (req,res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect("/home")
            // res.send("registered successfully...")
        })
    } catch (e) {
        // req.flash('error', e.message);
        console.log("issue");
        res.redirect('register');
    }
})

router.post("/login" , passport.authenticate('local' , {failureFlash : true , failureRedirect : "/login"} ) , (req,res) => {
    res.redirect("/home")
})

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});



module.exports = router;