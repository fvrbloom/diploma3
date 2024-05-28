const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    const regex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

router.get("/", (req, res) => {
    res.send("Welcome to the registration API");
});

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({ status: "exist", username: user.username, isAdmin: user.isAdmin });
            } else {
                res.json("wrongpassword");
            }
        } else {
            res.json("notexist");
        }
    } catch (e) {
        res.json("fail");
    }
});

router.post("/signup", async (req, res) => {
    const { email, password, username } = req.body;

    if (!validateEmail(email)) {
        res.json("invalidemail");
        return;
    }

    if (!validatePassword(password)) {
        res.json("weakpassword");
        return;
    }

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            res.json("exist");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email: email,
                password: hashedPassword,
                username: username,
            });
            await newUser.save();
            res.json("notexist");
        }
    } catch (e) {
        res.json("fail");
    }
});

module.exports = router;
