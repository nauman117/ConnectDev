const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req,res,next)=>{
    try {        
        console.log("User Auth is getting checked");
        // Read the token from re cookies    
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid");
        }

        // Validate the token
        const decodedObj = await jwt.verify(token, "DEV@CONNECT$123");

        // Find the user
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR: "+ err.message);
    }
}

module.exports={
    userAuth
}