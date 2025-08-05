import  dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})
import express from "express"
import connectDb from "./db/config.js";
import { app } from "./app.js";
//require('dotenv').config()



connectDb();

app.listen(process.env.PORT,(req,res)=>{
    console.log(`App is Running on port ${process.env.PORT}`);
})