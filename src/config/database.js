const { default: mongoose } = require("mongoose")
const pass = "naumancodes";
const user = "naumancodes";
const dbName = "connect_dev";
const connString = `mongodb+srv://${user}:${pass}@connectdev.1sp34.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const connectDB = async () => {
    await mongoose.connect(connString);
}
module.exports={
    connectDB
}