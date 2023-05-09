import express from "express";
import { validateIdRequest } from "../Middlewares/userMiddlewares.js";
import {
    createPost,
    deletePost,
    disLikePost,
    getAlltimeline,
    likePost,
    updatePost
} from "../Controllers/postController.js";

const postRoutes = express.Router();
// create a post
postRoutes.post("/", validateIdRequest, createPost);
// get timeline post
postRoutes.get("/:id", getAlltimeline);
// update post
postRoutes.put("/:id", updatePost);
//  partial update post with likes
postRoutes.patch("/:id/likes", likePost);
//  partial update post with dislike
postRoutes.patch("/:id/dislike", disLikePost);
// delete a post
postRoutes.delete("/:id", deletePost);

export default postRoutes;