import express from "express";
// const express = require("express");

const PORT = 8080;

const app = express();

const handleListening = () =>
    console.log(`Server listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening)