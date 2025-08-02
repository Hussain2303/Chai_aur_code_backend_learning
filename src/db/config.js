import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDb = async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`MongoDB connected Successfully!!`) 
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    
}
export default connectDb;