import express from "express";
// const express = require("express");
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";

const PORT = 8080;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter)
// app.use("/users", userRouter);
// app.use("/videos", videoRouter);



const handleListening = () =>
    console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);