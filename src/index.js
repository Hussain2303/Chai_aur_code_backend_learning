import  dotenv from "dotenv"
dotenv.config()
import express from "express"
import connectDb from "./db/config.js";

const app=express();
//require('dotenv').config()

connectDb();

app.listen(process.env.PORT,(req,res)=>{
    console.log(`App is Running on port ${process.env.PORT}`);
})