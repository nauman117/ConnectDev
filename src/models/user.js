const mongoose = require('mongoose');

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
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        min: 18
    },
    gender:{
        type: String,
        validate(value){//only run when createing new object not while patching by default and we will need to enable runValidators 
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender is Invalid");
            }
        }
    },
    photoUrl:{
        type: String
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

const User = mongoose.model("User", userSchema);

module.exports={
    User
}