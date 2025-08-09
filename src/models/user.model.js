import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        unique: true,

    },
    fullname: {
        type: String,
        require: true,
    },
    avatar: {
        type: String, //Cloudinary URL
        require: true,
    },
    coverImage: {
        type: String, //Cloudinary URL
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        require: [true, 'Password is Required!!']
    },
    refreshToken: {
        type: String,

    }


}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        return next()
    }
    next()
})
userSchema.methods.isPasswordCorrect=async  function(password)
{
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken =function(){
return jwt.sign({ //payload requires these things only id can do but add what you want
    _id:this._id,
    email:this.email,
    username:this.username
},process.env.ACCESS_TOKEN_SECRETE,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}
userSchema.methods.generateRefreshToken =function(){
    return jwt.sign({ //payload requires these things only id can do but add what you want
    _id:this._id,
},process.env.REFRESH_TOKEN_SECRETE,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}
export const User = mongoose.model("User", userSchema)

//Refres token stores in database while access token not