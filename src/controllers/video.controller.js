import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query
    page=parseInt(page)
    limit=parseInt(limit)

    const filter={}
    if(query)
    {
        filter.title={$regex:query,$options:"i"}
    }
    if(userId)
    {
        filter.owner=userId
    }

    const sort ={}
sort[sortBy]=sortType==="asc"?1:-1


const videos=await Video.find(filter).sort(sort).skip((page-1)*limit).limit(limit)
const totalVideos= await Video.countDocuments(filter)
return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                total: totalVideos,
                page,
                limit,
                totalPages: Math.ceil(totalVideos / limit),
            },
        }, "Videos fetched successfully")
    );
})
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    const userId=req.user?._id

    if(!userId)
    {
        throw new ApiError(401,"You must be logged in to publish a video !!")
    }

    if(!(title && description))
    {
        throw new ApiError("Title and description are required!!")
    }

    const localVideoPath=req.files?.videoFile?.[0].path;
    const thumbnailPath=req.files?.thumbnail?.[0].path;
    if(!(localVideoPath && thumbnailPath))
    {
        throw new ApiError(401,"Thumbnail and Video are required!!")
    }
    const videoUpload=uploadOnCloudinary(localVideoPath)
    const thumbnailUpload=uploadOnCloudinary(localVideoPath)

if (!videoUpload || !thumbnailUpload) {
        throw new ApiError(500, "Failed to upload video or thumbnail to Cloudinary");
    }

    const duration=videoUpload.duration
    const video=await Video.create({
        title,
        description,
        videoFile:videoUpload.secure_url,
        thumbnail:thumbnailUpload.secure_url,
        duration,
        owner:userId
    })
        return res
        .status(201)
        .json(new ApiResponse(201, video, "Video published successfully ✅")); 
})


export {
getAllVideos,
publishAVideo
}