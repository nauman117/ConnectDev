const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    console.log("sending connection request");
    res.send(req.user.firstName + " connection request sent");
})

module.exports = requestRouter;