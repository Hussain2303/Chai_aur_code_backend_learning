import { Router } from "express";
import { changeCurrentPassword, currentUser, getUserChannelProfile, getUserWatchHistory, LoginUser, logoutUser, refreshAccessToken, registerUser, UpdateAccountDetails, UpdateAvatar, UpdateCoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()

router.route("/Register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser

)
router.route("/login").post(LoginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,currentUser)
router.route("/update-account").patch(verifyJWT,UpdateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),UpdateAvatar)
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),UpdateCoverImage)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getUserWatchHistory)


export default router