console.log("Starting a new Project");

const express = require("express");

const app = express();

// handling the requests
app.use("/test",(req,res)=>{
    res.send("Hello from the server");
});

app.listen(3000,()=>{console.log("server listening on 3000")});
