console.log("Starting a new Project");

const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");

const app = express();


app.get("/getUserData",(req,res)=>{
    // try{
        throw new Error ("abc");
        res.send("User Data Sent");
    // }
    // catch(err){
    //     res.status(500).send("Something went Wrong from api");
    // }    
});

//catches errors of all apis for which try catch not used explicitly
app.use("/",(err,req, res, next)=>{
    if(err) res.status(500).send("Something went Wrong from middleware");
});
//keep it at the end else it wont match after api starts executing 

app.listen(3000,()=>{console.log("server listening on 3000")});
