const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { User } = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).json({ error: "ERROR:", message: err.message });    
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile was added successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).json({ error: "ERROR:", message: err.message });    
    }
});

module.exports = profileRouter;