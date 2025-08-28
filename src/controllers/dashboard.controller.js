import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"


const getChannelStats=asyncHandler(async(req,res)=>{
const userId=req.user?._id
if(!userId)
{
    throw new ApiError(401,"User Must be logged in!!")
}
const totalVideos=await Video.countDocuments({owner:userId})
const viewAgg= await Video.aggregate([
    {
        $match:{owner:mongoose.Types.ObjectId(userId)}
    },
    {
        $group:{_id:null,totalViews:{$sum:"views"}}
    }
])
const totalViews=viewAgg.length>0?viewAgg[0].totalViews:0

const totalSubscribers=await Subscription.countDocuments({channel:userId})
const channelVideos= await Video.find({owner:userId}).select("_id")
const videosId= channelVideos.map(v=>v._id)
let totalLikes=0;
if(videosId.length>0)
{
    totalLikes= await Like.countDocuments({video:{$in:videosId

    }})
}

return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched successfully")
    );
});
const getChannelVideos = asyncHandler(async (req, res) => {
    const userId= req.user?._id
    if(!userId)
    {
        throw new ApiError(401,"user Must be logged in to view channel videos!!")
    }
const videos=await Video.find({owner:userId}).sort({createdAt:-1}).select("title description views likes createdAt thumbnail")
 return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    );

})
export {
    getChannelStats,
    getChannelVideos
}