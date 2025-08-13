import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    Subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},{timestamps:true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);