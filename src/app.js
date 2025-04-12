console.log("Starting a new Project");

const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const cors = require("cors");


app.use(cors());
app.use(express.json());//reads json data middleware and no route means applicable for all app routes
app.use(cookieParser());//reads cookie data middleware

const authRouter = require("./Routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
.then(
    ()=>{
        console.log('db connected');
        app.listen(3007,()=>{console.log("server listening on 3007")});
    }
) 
.catch(err=>console.error('db connection failed due to ,',err));

