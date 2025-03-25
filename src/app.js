console.log("Starting a new Project");

const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const app = express();

app.post("/signup",async (req, res) => {
    const userObj = {
        firstName:"Nauman",
        lastName:"Ahmed",
        emailId:"NA@NA.com",
        password:"NA123",
    };
    try {
        const user = new User(userObj);
        await user.save();
        res.send("User saved successfully");
    } catch(err) {
        res.status(400).send("Error Saving User", err.message)
    }
})
connectDB()
.then(
    ()=>{
        console.log('db connected');
        app.listen(3000,()=>{console.log("server listening on 3000")});
    }
) 
.catch(err=>console.error('db connection failed due to ,',err));

