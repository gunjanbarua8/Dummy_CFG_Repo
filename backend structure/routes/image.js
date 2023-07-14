const router = require("express").Router();
const multer = require("multer");
const { storage } = require("../api/image")
const upload = multer({ storage: storage });
const User = require("../models/user")
const Image = require("../models/image")
const passport = require("passport");
const copyPaste = require('copy-paste');



router.post("/post-image", upload.array("image"), async (req, res) => {
    const user = req.session?.passport?.user;
    console.log("New", user);
    const curr_user = await User.findOne({ username: user }).exec();

    for (const img of req.files) {
        const imgi = await Image.create({
            ImageUrl: img.path,
            Filename: img.filename,
        });
        curr_user.images.push(imgi._id);
        console.log(curr_user.images);
    }

    console.log("New", curr_user);
    await curr_user.save();

    // Copy the first image URL to the clipboard
    const firstImage = req.files[0];
    if (firstImage) {
        copyPaste.copy(firstImage.path, () => {
            console.log("Image URL copied to clipboard:", firstImage.path);
        });
    }

    res.send("See console");
});

// Didnt made get image yet
module.exports = router;