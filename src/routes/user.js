const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({message: "Data fetched successfully", data: connectionRequests});
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => { 
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.equal(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data: data});
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;