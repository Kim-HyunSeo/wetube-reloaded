import express from "express";
// const express = require("express");

const PORT = 8080;

const app = express();

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const handleHome = (req, res) => {
    return res.send("Middlewares");
};

app.get("/", logger, handleHome);

const handleListening = () =>
    console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);