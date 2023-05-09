import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500,
        default: ""
    },
    img: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    dislike: {
        type: Array,
        default: []
    }

}, {timestamps: true});

const postModel = mongoose.model("post", PostSchema);
export default postModel;