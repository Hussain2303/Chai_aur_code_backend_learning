import { asyncHandler } from "../utils/asynchandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apierror.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiresponse.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const AccessToken = user.generateAccessToken()
        const RefreshToken = user.generateRefreshToken()
        user.RefreshToken = RefreshToken
        await user.save({ ValidateBeforeSave: false })
        return { AccessToken, RefreshToken }
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong")
    }
}
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
    //const coverImagePath = req.files?.coverImage[0]?.path;
    //console.log(avatarLocalPath)
    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagePath = req.files.coverImage[0].path;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required!!")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar) {
        throw new ApiError(400, "Avatar 3is Required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
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
    console.log("Created User")

    return res.status(201).json(

        new ApiResponse(200, createdUser, "User Registered Succesfully !!")
    )
})



const LoginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email) {
        throw new ApiError(401, "Username or email Is Rrquired !!")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    }
    )
    if (!user) {
        throw new ApiError(401, "User Not Exist Enter correct username or email !!")

    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials!!")
    }

    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("RefreshToken", RefreshToken, options)
        .cookie("AccessToken", AccessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, AccessToken, RefreshToken
                },
                "User logged In Successfully"
            )
        )

})
const logoutUser = asyncHandler(async (req, res) => {
 await User.findByIdAndUpdate(req.user._id,{
    $set:{RefreshToken:undefined}
 },
 {new:true}
)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("AccessToken",AccessToken,options)
    .clearCookie("AccessToken", AccessToken, options)
    .json(new ApiResponse(200,{},"User Logout Successfully !!"))
})

export {
    registerUser,
    LoginUser,
    logoutUser
}
//Will do soon Inshallah