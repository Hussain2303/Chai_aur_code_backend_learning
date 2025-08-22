import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { populate } from "dotenv"


const toggleSubscription = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const { channelId } = req.params
    if (!userId) {
        throw new ApiError(401, "User Must be login !!")
    }
    const Subscribed = await Subscription.findOne({
        Subscriber: userId,
        Channel: channelId
    })
    if (Subscribed) {
        await Subscription.findByIdAndDelete(Subscribed._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed Successfully!!")
        )
    }
    else {
        await Subscription.create({
            Subscriber: userId,
            Channel: channelId
        })
        return res.status(200).json(
            new ApiResponse(200, {}, "Channel Subscribed Successfully!!")
        )
    }


})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId=req.user?._id
if (!userId) {
        throw new ApiError(401, "User Must be login !!")
    }
const subscriber = await Subscription.find({Channel: channelId}).populate("Subscriber","username email avatar")
return res.status(200).json(
    new ApiResponse(200,{count:subscriber.length,subscriber},"Subscribers fetched successfully"))
})
import mongoose from "mongoose";

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User must be logged in !!");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        Subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users", // User collection name in DB (usually lowercase plural)
        localField: "Channel",
        foreignField: "_id",
        as: "channelInfo",
      },
    },
    { $unwind: "$channelInfo" },
    {
      $project: {
        _id: 0,
        "channelInfo._id": 1,
        "channelInfo.username": 1,
        "channelInfo.email": 1,
        "channelInfo.profilePic": 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { count: channels.length, channels },
      "Subscribed channels fetched successfully"
    )
  );
});
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels

}