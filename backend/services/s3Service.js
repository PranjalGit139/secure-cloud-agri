import { s3 } from "../config/awsConfig.js";
import dotenv from "dotenv";
dotenv.config();

// ✅ Upload new file
export const uploadToS3 = (file, userId) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `data/farmer/${userId}/${file.originalname}`,
    Body: file.buffer,
  };
  return s3.upload(params).promise();
};

// ✅ List files belonging to a farmer
export const listUserFiles = async (userId) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `data/farmer/${userId}/`,
  };
  const data = await s3.listObjectsV2(params).promise();
  return data.Contents || [];
};

// ✅ Generate download URL (presigned)
export const getFileUrl = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 60 * 5, // valid for 5 minutes
  };
  return s3.getSignedUrlPromise("getObject", params);
};

// ✅ Replace file (upload again to same key)
export const updateFileInS3 = async (file, userId) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `data/farmer/${userId}/${file.originalname}`,
    Body: file.buffer,
  };
  return s3.upload(params).promise();
};

// ✅ Optional: Delete file
export const deleteFileFromS3 = async (key) => {
  const params = { Bucket: process.env.S3_BUCKET_NAME, Key: key };
  return s3.deleteObject(params).promise();
};
