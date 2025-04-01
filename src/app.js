console.log("Starting a new Project");

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json());//reads json data middleware and no route means applicable for all app routes
app.use(cookieParser());//reads cookie data middleware

app.post("/signup",async (req, res) => {
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

app.post("/login",async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId })
        if(!user){
            throw new Error("Invalid credentials")
        }

        isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid credentials")
        }
        const token = await jwt.sign(
            {_id: user._id},
            "DEV@CONNECT$123");

        res.cookie("token",token)
        res.send("User loggedin sucessfully");
    } catch(err) {
        res.status(400).json({ error: "Error:", message: err.message });    
    }
});

app.get("/profile", async (req,res) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error("Invalid token");
        }
        const decodedMessage = await jwt.verify(token, "DEV@CONNECT$123");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        res.send(user);
    } catch (err) {
        res.status(400).json({ error: "Error:", message: err.message });    
    }
});

//Get user by emailId
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({ emailId: userEmail });
        if(!user) return res.status(404).send("User not found");
        res.send(user);
    } catch (err) {
        res.status(400).json("Something went wrong.")
    }
});

//Feed API - fetch all users
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).json("Something went wrong.")
    }
});

//Delete API
app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({ _id : userId });
        if(!user) return res.status(404).send("User not found");
        res.send("User deleted sucessfully");
    } catch (err) {
        res.status(400).json("Something went wrong.")
    }
});


//Update data of the user
app.patch("/user/:userId", async (req,res) => {
    const userId = req.params.userId;
    const data = req.body;
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender"];
    try{
        const isUpdateAllowed = Object.keys(data).every(k=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Skills can not be more than 10");
        }
        const user = await User.findByIdAndUpdate({ _id : userId }, data, {
            returnDocument:"after",
            runValidators: true //now custom age valiadtor is run 
        });//any other data apart from scheema is ignored
        if(!user) return res.status(404).send("User not found");
        res.send("User updated sucessfully");
    } catch (err) {
        res.status(400).json("Something went wrong."+err)
    }
});

connectDB()
.then(
    ()=>{
        console.log('db connected');
        app.listen(3007,()=>{console.log("server listening on 3007")});
    }
) 
.catch(err=>console.error('db connection failed due to ,',err));

