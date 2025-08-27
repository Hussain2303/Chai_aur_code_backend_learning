import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from "cloudinary";
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
const getVideoById=asyncHandler(async(req,res)=>{
    const{videoId}=req.params
const userId=req.user?._id
const video=await Video.findById(videoId)
if(!video)
{
    throw new ApiError(404,"Video didn't exist!!")
}
return res.status(200).json(
    new ApiResponse(200,video,"Video Fetched Successfully!!")
)
})
const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {title,description}=req.body
    const userId=req.user?._id
if(!userId)
{
    throw new ApiError(401,"You must be logged in to Update video details")
}
const video=await Video.findById(videoId)

if(!(video.owner.toString()===userId.toString()))
{
    throw new ApiError(401,"You are not allowed to change the details of video!!")
}

if(title)
{
    video.title=title
}
if(description)
{
    video.description=description
}
if(req.files?.thumbnail?.[0]?.path)
{
    const uplaodThumbnail=req.files?.thumbnail?.[0]?.path
    const thumbnail=uploadOnCloudinary(uplaodThumbnail)
    if(!thumbnail)
    {
        throw new ApiError(500,"thumbnail uplaod failed!!")
    }
    video.thumbnail.thumbnail.secure_url
}

await video.save()


  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully ✅"));
});
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId=req.user?._id
    if(!userId)
{
    throw new ApiError(401,"unauthorized request!!")
}
const video= await Video.findById(videoId)
if(!video)
{
    throw new ApiError(404,"Video Not Found")
}

if(!(video.owner.toString()===userId.toString()))
{
    throw new ApiError(401,"You are not allowed to delete this video!!")
}

const publicId=(url)=>{
    const parts=url.split("/")
    const fileWithExt = parts[parts.length - 1];
    return fileWithExt.split(".")[0];
}


if(video.videoFile)
{
     await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });

}

if (video.thumbnailPublicId) {
  await cloudinary.uploader.destroy(video.thumbnailPublicId, { resource_type: "image" });
}

await Video.findByIdAndDelete(videoId)

 return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully ✅"));
})
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // flip the value
    video.isPublished = !video.isPublished;

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video is now ${video.isPublished ? "Published" : "Unpublished"}`
        )
    );
});
export {
getAllVideos,
publishAVideo,
getVideoById,
updateVideo,
deleteVideo,
togglePublishStatus
}