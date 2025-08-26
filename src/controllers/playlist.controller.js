import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apierror.js"
import {ApiResponse} from "../utils/apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {Video} from "../models/video.model.js"

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

const getUserPlaylists=asyncHandler(async(req,res)=>{
    const {userId}=req.params
if(!userId)
{
    throw new ApiError(401,"User id is Required!!")
}

const playlist= await Playlist.find({Owner:userId}).populate("Videos")
if(!playlist || playlist.length === 0)
{
    return res.status(200).json(
        new ApiResponse(200,{},"No Playlist found for this user!!")
    )
}
 return res.status(200).json(
        new ApiResponse(200,playlist,"Playlist fetched Successfully !!")
    )



})
const getPlaylistById=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
if(!playlistId)
{
    throw new ApiError(401,"Playlist Id is required!!")
}
const playlist=await Playlist.findOne({_id:playlistId})
if(!playlist)
{
    return res.status(200).json(
        new ApiResponse(200,{},"No playlist is found with this id!!")
    )
}

 return res.status(200).json(
        new ApiResponse(200,playlist,"Playlist fetched successfully!!")
 )

})

const addVideoToPlaylist=asyncHandler(async(req,res)=>{
    const{playlistId,videoId}=req.params
    if(!(playlistId && videoId))
    {
        throw new ApiError(401,"Playlist Id and Video Id is required")
    }
const playlist= await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(401,"PLaylist Not Existed!!")
    }
    const video= await Video.findById(videoId)
    if(!video)
    {
         throw new ApiError(401,"Video Not found!!")
    }
if(playlist.video.includes(videoId))
{
    return res.status(200).json(
            new ApiResponse(200, playlist, "Video already exists in playlist")
    )
}

playlist.push(videoId)
await playlist.save();
    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
 if(!(playlistId && videoId))
    {
        throw new ApiError(401,"Playlist Id and Video Id is required")
    }
const playlist= await Playlist.findById(playlistId)

    if(!playlist)
    {
        throw new ApiError(401,"PLaylist Not Existed!!")
    }
    const video= await Video.findById(videoId)
    if(!video)
    {
         throw new ApiError(401,"Video Not found!!")
    }

    const updatedPlaylist= await Playlist.findByIdAndUpdate(
        playlist,
        {
            $pull:{
                videos:videoId
            }
        },
        {
            new:true
        }
    )
       return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully!")
    );

})


const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId)
    {
        throw new ApiError(401,"Playlist Id is requied !!")
    }

    const playlist=await Playlist.findByIdAndDelete(playlistId)
    if(!playlist)
    {
        throw new ApiError(401,"Playlist Doesnt Exist !!")
    }
return res.status(200).json(
    new ApiResponse(200,{},"Playlist deleted Successfully!!")
)
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is required!!");
    }

    if (!name && !description) {
        throw new ApiError(400, "At least one field (name or description) is required to update!!");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { 
            ...(name && { name }), 
            ...(description && { description }) 
        },
        { new: true, runValidators: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found!!");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully!!")
    );
});




export{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist

}