const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //validations
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){            
            return  res.send(400).json({
                message:"Invalid status type: " + status
            })
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return  res.send(404).json({
                message:"User not found "
            })
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(existingConnectionRequest){  
            return  res.send(400).json({
                message:"Connection request already exist: "
            })
        }

        const connectionRequest = ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + status + toUser.firstName,
            data: connectionRequest
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const { requestId, status} = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)) {
            throw new Error("Status not allowed!");
        }

        var connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if(!connectionRequest) {
            return res.status(404).json({
                message: "connection request not found"
            })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "Connection request "+ status, data});
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;