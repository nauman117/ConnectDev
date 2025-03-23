console.log("Starting a new Project");

const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");

const app = express();


app.use("/admin",adminAuth);
app.use("/user",userAuth);

app.get("/user",(req,res)=>{
    res.send("Hi user");    
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data Sent");
})

app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted USer");    
})

app.listen(3000,()=>{console.log("server listening on 3000")});
