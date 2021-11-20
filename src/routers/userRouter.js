import express from "express";
import {
    getEdit,
    postEdit,
    getPassword,
    postPassword,
} from "../controllers/userController";
import {
    uploadAvatar,
    protectorMiddleware,
} from "../middlewares";

const userRouter = express.Router();

// userRouter.get("/logout", protectorMiddleware, logout)
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(uploadAvatar.single("avatar"), postEdit);
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getPassword)
    .post(postPassword);

export default userRouter