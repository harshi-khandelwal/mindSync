import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been loaded 
        // console.log("file is uploaded in cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response;


    } catch (error) {
       if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload function got failed
        return null;
    }
}

export {uploadOnCloudinary}