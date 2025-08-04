import  dotenv from "dotenv"
import express from "express"
import connectDb from "./db/config.js";
import { app } from "./app.js";
//require('dotenv').config()

dotenv.config({
    path:"./.env"
})

connectDb();

app.listen(process.env.PORT,(req,res)=>{
    console.log(`App is Running on port ${process.env.PORT}`);
})