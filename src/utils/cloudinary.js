import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name:"dlwo4wsfr", 
  api_key:"392362643896565", 
  api_secret:"bCpASZILj9dNicEUXhrWIiuQR5A" 
});
// console.log("Cloudinary name:",process.env.CLOUDINARY_NAME);
// console.log("API key:",process.env.CLOUDINARY_KEY);
// console.log("API secret:",process.env.CLOUDINARY_SECRET);
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}