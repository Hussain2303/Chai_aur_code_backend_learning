import asyncHandler from "../utils/asynchandler.js"; 

const healthcheck = asyncHandler(async (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running smoothly 🚀"
    });
});

export { healthcheck}