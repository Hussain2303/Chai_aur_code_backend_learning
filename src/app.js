import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const  app=express();

app.use(cors())

app.use(express.json())
app.use(cookieParser())


//routes
import userRouter from './routes/user.routes.js'

//routes decleration
app.use("/api/v1/users",userRouter)

export {app}