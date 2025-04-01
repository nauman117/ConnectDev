console.log("Starting a new Project");

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());//reads json data middleware and no route means applicable for all app routes
app.use(cookieParser());//reads cookie data middleware

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
            "DEV@CONNECT$123",
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 3600000)
        })
        res.send("User loggedin sucessfully");
    } catch(err) {
        res.status(400).json({ error: "Error:", message: err.message });    
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).json({ error: "Error:", message: err.message });    
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    console.log("sending connection request");
    res.send(req.user.firstName + " connection request sent");
})

connectDB()
.then(
    ()=>{
        console.log('db connected');
        app.listen(3007,()=>{console.log("server listening on 3007")});
    }
) 
.catch(err=>console.error('db connection failed due to ,',err));

