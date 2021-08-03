import express from "express";
// const express = require("express");
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
// import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }))
app.use("/", globalRouter)
// app.use("/users", userRouter);
app.use("/video", videoRouter);

export default app;