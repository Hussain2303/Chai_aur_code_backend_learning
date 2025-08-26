import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const createPlaylist=asyncHandler(async(req,res)=>{
const userId=req.user?._id
    const {name,description}=req.body
if(!userId)
{
    throw new ApiError(401,"Logged in First !!")
}
if(!name || name.trim()==="")
{
    throw new ApiError(401,"Name of the Palylist cannot be empty !!")
}
const existedAlready=await Playlist.findOne({Owner:userId, name:name})
if(existedAlready)
{
    throw new ApiError(401,"Playlist Already Existed with this name !!")
}

const playlist=await Playlist.create({
    Owner:userId,
    description:description,
    name:name
})

if(!playlist)
{
    throw new ApiError(500,"Error in creating playlist Try again in few seconds!!")
}

return res.status(200).json(
    new ApiResponse(200,playlist,"Playlist Created Successfully !!")
)





})

export{
    createPlaylist
}