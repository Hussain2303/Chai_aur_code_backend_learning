import { User } from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { Comment } from "../models/comments.model.js"


const addComment=asyncHandler(async(req,res)=>{
    const{videoId}=req.params
    const {content}=req.body
    const userId=req.user?._id
    if(!userId)
    {
        throw new ApiError(401,"User Must be login For comment !!")
    }
    if(!content || content.trim() ==="")
    {
        throw new ApiError(400,"Content is Required!!")
    }
const createdComment= await Comment.create({
content,
video:videoId,
owner:userId
})
if(!createdComment)
{
    throw new ApiError(402,"Something went wrong while creating comment !!")
}
res.status(200)
.json(
    new ApiResponse(200,createdComment,"Comment posted Successfully!!")
)

})

const updateComment=asyncHandler(async(req,res)=>{
    const{commentId}=req.params
    const userId=req.user?._id
    const{content}=req.body
    if(!userId)
    {
        throw new ApiError(401,"Unauthorized User!!")
    }
if(!content || content.trim()==="")
{
    throw new ApiError(401,"Comment cannot be empty!!")
}

const findComment= await Comment.findById(commentId)

if(!findComment)
{
    throw new ApiError(401,"Comment not Found!!")
}
if(findComment.owner.toString()!==req.user._id.toString())
{
    throw new ApiError(401,"You are not allowed to change this comment")
}

findComment.content=content
await findComment.save()
return res.status(200).json(
        new ApiResponse(200, findComment, "Comment Updated Successfully!!")
    )
})

const deleteComment=asyncHandler(async(req,res)=>{
const userId=req.user?._id
const {commentId}=req.params
  if(!userId)
    {
        throw new ApiError(401,"Unauthorized User!!")
    }
const comment= await Comment.findOneAndDelete({
  owner:userId,
  _id:commentId  
})
    if (!comment) {
        throw new ApiError(404, "Comment not found or you are not authorized to delete this comment !!");
    }
 return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully !!")
    );
})

const getVideoComments=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {page = 1, limit = 10} = req.query
const comments=await Comment.find({video:videoId}).populate(
    "owner","username email"
).sort({createdAt:-1}).skip((page-1)*limit).limit(Number(limit))

const totolComments=await Comment.countDocuments({video:videoId})  

if(!comments || comments.length===0)
{
    return res.status(200).json(
        new ApiResponse(200,[],`No comments found for this video !!`)
    )
}
    return res.status(200).json(
        new ApiResponse(200,comments,{
            totalComments:totolComments,
            currentPage:page,
            totalPages:Math.ceil(totolComments/limit)
        },"Comments fetched successfully !!")
    )



})
export{
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}