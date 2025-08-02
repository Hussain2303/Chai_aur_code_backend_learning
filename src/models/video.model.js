import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new mongoose.Schema({

    videoFile:{
        type:String,
        require:true
    },
    thumbnail:{
        type:String,
        require:true
    },title:{
        type:String,
        require:true
    },
    description:{
           type:String,
        require:true
    },
    duration:{
           type:Number,
        require:true
    },
    Views:{
            type:Number,
        require:true,
        default:0
    },
    isPublishes:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{
    timestamps:true
})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video =mongoose.model("Video",videoSchema)