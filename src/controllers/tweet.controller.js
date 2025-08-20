import mongoose from "mongoose";
import { Tweet } from "../models/tweets.model";
import { asyncHandler } from "../utils/asynchandler";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse";
import { User } from "../models/user.model.js"
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content || content.trim() === "") {
        throw new ApiError(401, "Tweet Can't be empty !!")
    }
    const tweet = await Tweet.create({
        content,
        Owner: req.user?._id
    })
    if (!tweet) {
        throw new ApiError(500, "Something went Wrong while tweeting !!")
    }
    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet Post Successfully!")
    )
})
const getUserTweets = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "Unauthorize Request")
    }
    const tweets = await Tweet.find({ Owner: user._id }).sort({ createdAt: -1 })

    if (!tweets || tweets.length === 0) {
        throw new ApiError(404, "No tweets found for this user!");
    }

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched Successfully!!")
    )
})
const updateTweets = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(401, "Bad Request!!")
    }
    const { content } = req.body
    if (!content||content.trim() === "") {
        throw new ApiError(401, "Tweet cannot be empty!!")
    }
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(401, "Tweet Not Found !!")
    }
    if (tweet.Owner.toString() !== user._id.toString()) {
        throw new ApiError(401, "You are not allowed to change this tweet!!")
    }

    tweet.content = content
    await tweet.save()

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet Update Successfully!!")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(401, "Bad Request!!");
    }

    const { tweetId } = req.params;

    // 🔹 Pehle tweet find karo
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found!!");
    }

    // 🔹 Owner check karo
    if (tweet.Owner.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this tweet!!");
    }

    // 🔹 Agar owner match kar gya to delete karo
    await tweet.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet Deleted Successfully!!")
    );
});


export {
    createTweet,
    getUserTweets,
    updateTweets,
    deleteTweet
}