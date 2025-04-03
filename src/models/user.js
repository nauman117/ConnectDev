const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:2,
        maxLenght: 50
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is Invalid");
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password");
            }
        }
    },
    age:{
        type: Number,
        min: 18
    },
    gender:{
        type: String,
        enum:{
            values = ['male','female','others'],
            message = `{VALUE} is not a valid gender type`
        },
        validate(value){//only run when createing new object not while patching by default and we will need to enable runValidators 
            if(!['male','female','others'].includes(value)) {
                throw new Error("Gender is Invalid");
            }
        }
    },
    photoUrl:{
        type: String,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("PhotoUrl is Invalid");
            }
        }
    },
    about:{
        type: String,
        default: "default value"
    },
    skills:{
        type: [String]
    },
},
{ 
    timestamps: true
}
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign(
        { _id: user._id },
        "DEV@CONNECT$123",
        { expiresIn: "1d" }
    );

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = bcrypt.compare(
        passwordInputByUser, 
        passwordHash
    );

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports={
    User
}