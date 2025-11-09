import {
  uploadToS3,
  listUserFiles,
  getFileUrl,
  updateFileInS3,
  deleteFileFromS3,
} from "../services/s3Service.js";
import { getAllFarmers } from "../services/userService.js";
import { getAllUsers, deleteUser } from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { username } = req.params;
    await deleteUser(username);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getFilesByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const files = await listUserFiles(username);

    // Get presigned URLs
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        key: file.Key,
        url: await getFileUrl(file.Key),
      }))
    );

    res.json({ files: filesWithUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

export const deleteFileByAdmin = async (req, res) => {
  try {
    const { key } = req.body;
    await deleteFileFromS3(key);
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete file" });
  }
};

// ✅ Get all farmers (for expert dashboard)
export const getFarmers = async (req, res) => {
  try {
    const farmers = await getAllFarmers();
    res.json({ farmers });
  } catch (err) {
    console.error("Error fetching farmers:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get files of a specific farmer
export const getFarmerFiles = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const files = await listUserFiles(farmerId);

    // Generate presigned URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        key: file.Key,
        url: await getFileUrl(file.Key),
      }))
    );

    res.json({ files: filesWithUrls });
  } catch (err) {
    console.error("Error fetching farmer files:", err);
    res.status(500).json({ message: err.message });
  }
};


// Upload
export const uploadFile = async (req, res) => {
  try {
    const userId = req.user["cognito:username"];
    const result = await uploadToS3(req.file, userId);
    res.json({ message: "File uploaded successfully", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserFiles = async (req, res) => {
  try {
    const userId = req.user["cognito:username"] || req.user.sub;
    console.log("Fetching files for user:", userId);

    const files = await listUserFiles(userId);

    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        name: file.Key.split("/").pop(),
        key: file.Key,
        url: await getFileUrl(file.Key),
      }))
    );

    res.json({ files: filesWithUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Generate download link
export const downloadFile = async (req, res) => {
  try {
    const { key } = req.params;
    const url = await getFileUrl(key);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit (replace)
export const editFile = async (req, res) => {
  try {
    const userId = req.user["cognito:username"];
    const result = await updateFileInS3(req.file, userId);
    res.json({ message: "File updated successfully", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: Delete
export const deleteFile = async (req, res) => {
  try {
    const { key } = req.params;
    await deleteFileFromS3(key);
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


