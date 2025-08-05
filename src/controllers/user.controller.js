import { asyncHandler } from "../utils/asynchandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apierror.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiresponse.js"


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body
    if (
        [username, email, fullname, password].some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields Are Required!!")
    }
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(400, "User Already Existed")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;
    console.log(avatarLocalPath)

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required!!")
    }
    const avatar3 = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar3) {
        throw new ApiError(400, "Avatar 3is Required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar3.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something Went wrong Try again to registered")
    }

    return res.status(201).json(

        new ApiResponse(200, createdUser, "User Registered Succesfully !!")
    )
})

export { registerUser }
//Will do soon