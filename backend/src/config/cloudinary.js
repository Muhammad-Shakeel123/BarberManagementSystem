import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../utils/ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = (buffer, folder) =>
  new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      reject(new ApiError(503, "Image upload is not configured on the server"));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(new ApiError(502, "Unable to upload profile image"));
          return;
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
