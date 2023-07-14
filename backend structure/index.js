require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const User = require('./models/user');
const app = express();
const session = require('express-session');
const connectDB = require("./db/conn")
const userroutes = require("./routes/user")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const setRole = require("./middleware/setRole")

// Sessions config
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


connectDB();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('cookie-parser')());
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    


// Serving files 

app.get("/login" , (req,res) => {
    res.sendFile(__dirname + '/public/login.html')
})


// Can be used when we have to upload a file . We have to make an image.html page
app.get("/image" , (req,res) => {
    if(!req.isAuthenticated()) {return res.redirect("/login")}
    res.sendFile(__dirname + "/public/image.html")
}) 

app.use("/images", require("./routes/image"))


app.use("/user" , userroutes)
// Roles if we have to distinguish between user and admin but i haven't thought yet how and where should we set a normal user to admin
app.use(setRole);
// To check if he is admin
app.get("/admin" , async (req,res,next) => {
    if(!req.isAuthenticated()) {return res.redirect("/login")}
    const passportSession = req.session?.passport;

    if(passportSession.role!="admin") {
        return res.send("you are not an admin")
    }
    next();
}, (req,res) => {
    res.send("<h1> Admin page </h1>")
})

// Home page
app.use("/home" , (req,res) => {
    if(!req.isAuthenticated()) {return res.redirect("/login")}
    res.send("HI");
})













app.listen(3000, function () {
    console.log("Server started at port 3000");
}) 