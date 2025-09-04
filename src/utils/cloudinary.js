import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
        api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
    });



// Uploads a file to Cloudinary

const uploadToCloudinary = async (localfilepath) => {
    try{
        if(!localfilepath) return null;
        //uploads file to cloudinary
        const response = await cloudinary.uploader.upload(localfilepath,{ resource_type : "auto"})
        console.log("File Uploaded successfully",response.url);
        return response;
    }   
    catch(error){
       //remove the file from local uploads folder if error occurs 
       fs.unlinkSync(localfilepath)
       return null;
    }
}

// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
export {uploadToCloudinary};