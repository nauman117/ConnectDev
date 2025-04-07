const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //refernce to the user collection //replacement of joins
            required: true
        },
        toUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status:{
            type: String,
            required: true,
            enum: {
                values = ["ignored", "interested" ,"accepted", "rejected"],
                message = `{VALUE} is incorrect status`
            }
        }
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself");
    }
    next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {
    ConnectionRequest
}
