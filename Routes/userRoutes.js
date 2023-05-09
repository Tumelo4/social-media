import express from "express";
import { validateIdRequest } from "../Middlewares/userMiddlewares.js";
import {
    deleteUser,
    followingUsers,
    getUser,
    partialUpdateUser,
    unfollowUser
} from "../Controllers/userController.js";

const userRoutes = express.Router();

userRoutes.patch("/:id", validateIdRequest, partialUpdateUser);
userRoutes.delete("/:id", validateIdRequest, deleteUser);
userRoutes.get("/:id", getUser);
userRoutes.patch("/:id/follow", validateIdRequest, followingUsers);
userRoutes.patch("/:id/unfollow", validateIdRequest, unfollowUser);

export default userRoutes;