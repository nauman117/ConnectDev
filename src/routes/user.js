const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        // }).populate("fromUserId", ["firstName", "lastName", "about", "skills"]); //populates fields of ref
        }).populate("fromUserId", "firstName lastName photoUrl age about skills");

        res.json({message: "Data fetched successfully", data: connectionRequests});
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;