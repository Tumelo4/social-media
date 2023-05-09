import mongoose from "mongoose";

const Userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    profile_picture: {
        type: String,
        default: ""
    },
    cover_picture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 300,
        default: ""
    },
    city: {
        type: String,
        max: 100,
        default: ""
    },
    from: {
        type: String,
        max: 100,
        default: ""
    },
    relationship: {
        type: String,
        enum: ['single', 'married', 'separated'],
        default: 'single'
    },
    
}, {timestamps: true});

const userModel = mongoose.model("user", Userschema);
export default userModel;