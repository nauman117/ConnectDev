const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { password } = req.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User saved successfully");
    } catch(err) {
        res.status(400).json({ error: "Error Saving User", message: err.message });    
    }
});

authRouter.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId })
        if(!user){
            throw new Error("Invalid credentials")
        }

        isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid){
            throw new Error("Invalid credentials")
        }
        const token = await user.getJWT();

        res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 3600000)
        })
        res.send("User loggedin sucessfully");
    } catch(err) {
        res.status(400).json({ error: "Error:", message: err.message });    
    }
});

module.exports = authRouter;