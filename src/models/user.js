const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({


    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,      
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Invalid password");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum:{
            values: ["male", "female","others"],
            message: '{VALUE} is not supported'
         },
        // validate(value) {
        //     if(!["male", "female","others"].includes(value)) { 
        //         throw new Error("Invalid gender");
        //     }
        // }
    },
    photourl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL");
            }   
        }
    },
    about: {
        type: String,
        default: "This is default about the user"
    },
    skills: {
        type: [String],
        validate: {
            validator: function (value) {
                return value.length <= 10;
            },
            message: "You can add a maximum of 10 skills only"
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('photoUrl').get(function () {
    return this.photourl;
});

//7
userSchema.methods.getJwt = async function() {
    const user = this;
    const token = await jwt.sign({ id: user._id }, "DevTinder@2026", { expiresIn: "1d" });
    return token; 
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    //5
    const isPasswordValid = await bcrypt.compare
    (passwordInputByUser,
     passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);