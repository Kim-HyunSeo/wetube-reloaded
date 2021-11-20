import express from "express";
import {
    watch,
    getUpload,
    postUpload,
    getEdit,
    postEdit,
    deleteVideo,
} from "../controllers/videoController";
import {
    uploadVideo,
    protectorMiddleware
} from "../middlewares";

const videoRouter = express.Router();

videoRouter
    .get("/:id([0-9a-f]{24})", watch);
videoRouter
    .route("/:id([0-9a-f]{24})/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(postEdit);
videoRouter
    // mongoose make 24digits hexadecimal id
    .route("/:id([0-9a-f]{24})/delete")
    .all(protectorMiddleware)
    .get(deleteVideo);
videoRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getUpload)
    .post(uploadVideo.single("video"), postUpload);

export default videoRouter