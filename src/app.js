console.log("Starting a new Project");

const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

const app = express();

app.use(express.json());//processing json data middle ware and no route means applicable for all app routes

app.post("/signup",async (req, res) => {
    
    try { 
        const user = new User(req.body);
        await user.save();
        res.send("User saved successfully");
    } catch(err) {
        res.status(400).send("Error Saving User", err.message)
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
        res.status(400).send("Something went wrong.")
    }
});

//Feed API - fetch all users
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong.")
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
        res.status(400).send("Something went wrong.")
    }
});


//Update data of the user
app.patch("/user", async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({ _id : userId }, data, {
            returnDocument:"after"
        });//any other data apart from scheema is ignored
        console.log("🚀 ~ app.patch ~ user:", user)
        if(!user) return res.status(404).send("User not found");
        res.send("User updated sucessfully");
    } catch (err) {
        res.status(400).send("Something went wrong.")
    }
});

connectDB()
.then(
    ()=>{
        console.log('db connected');
        app.listen(3000,()=>{console.log("server listening on 3000")});
    }
) 
.catch(err=>console.error('db connection failed due to ,',err));

