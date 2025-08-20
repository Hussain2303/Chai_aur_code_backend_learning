import mongoose from "mongoose";
import {Comment} from "../models/comments.model.js"
import { User } from "../models/user.model.js";
import {Video} from "../models/video.model.js";
import {Tweet} from "../models/tweets.model.js"
import {Like} from "../models/like.model.js"
import {asyncHandler} from "../utils/asynchandler.js"
import{ApiResponse} from "../utils/apiresponse.js"
import { ApiError } from "../utils/apierror.js";

const toggleVideoLike=asyncHandler(async(req,res)=>{
const userId=req.user._id
const {videoId}=req.params
if(!userId)
{
    throw new ApiError(401,"Unauthorized request!!")
}
const existingLike= await Like.findOne({ Video :videoId ,likedBy:userId})
if(existingLike)
{
   await Like.findByIdAndDelete(existingLike._id)
   return res.status(200).json(
    new ApiResponse(200,{},"Like Removed Successfully !!")
   )
}

else{
    await Like.create({
        Video:videoId,
        likedBy:userId
    })
     return res
            .status(201)
            .json(new ApiResponse(201, {}, "Video liked successfully"))
}
})

const toggleCommentLike=asyncHandler(async(req,res)=>{
const userId= req.user?._id
const {commentId}=req.params
if(!userId)
{
    throw new ApiError(401,"Unauthorized Request!!")
}
const existingLike= await findOne({Comment:commentId,likedBy:userId})

if(existingLike)
{
    await  Like.findByIdAndDelete(existingLike._id)
    return res.status(200).json(
        new ApiResponse(200,{},"Liked Remove Successfully!!")
    )
}
else{
    await Like.create({
        Comment:commentId,
        likedBy:userId
    })
    return res.status(200).json(
        new ApiResponse(200,{},"Liked Successfully!!")
    )
}


})
const toggleTweetLike=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
    const {tweetId} =req.params
    if(!userId)
{
    throw new ApiError(401,"Unauthorized Request!!")
}
const existingLike= await Like.findOne({likedBy:userId,tweet:tweetId})
if(existingLike)
{
await findByIdAndDelete(existingLike._id)
  return res.status(200).json(
        new ApiResponse(200,{},"Liked Remove Successfully!!")
    )
}
else{
    await Like.create({
        likedBy:userId,
        tweet:tweetId
    })
    return res.status(200).json(
        new ApiResponse(200,{},"Liked Successfully!!")
    )
}
const getLikedVideos=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    if(!userId)
    {
        throw new ApiError(401,"Unauthorize request !!")
    }
    const likedVideos = await Like.find({likedBy:userId}).populate("Video")
    if(!likedVideos||likedVideos.length===0)
    {
        return res.status(200).json(
            new ApiResponse(200,{},"User didnt Like any Video!")
        )
    }
    else{
         return res.status(200).json(
            new ApiResponse(200,likedVideos,"Liked Videos Fetched Successfully!")
        )
    }
})

})
export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    
}

