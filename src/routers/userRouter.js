import express from "express";
import {
    see, //
    getEdit,
    postEdit,
    getPassword,
    postPassword,
    githubLogin,
    githubCallback,
} from "../controllers/userController";
import {
    uploadAvatar, //
    protectorMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter //
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(uploadAvatar.single("avatar"), postEdit);
userRouter //
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getPassword)
    .post(postPassword);
userRouter.get("/github", githubLogin);
userRouter.get("/github/callback", githubCallback);
userRouter.get("/:id", see);
// userRouter.get("/logout", protectorMiddleware, logout)

export default userRouter;
