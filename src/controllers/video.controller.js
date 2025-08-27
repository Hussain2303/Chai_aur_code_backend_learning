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


export {
getAllVideos
}