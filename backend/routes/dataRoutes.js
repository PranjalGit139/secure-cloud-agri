import express from "express";
import multer from "multer";
import {
  uploadFile,
  getUserFiles,
  downloadFile,
  editFile,
  deleteFile,
} from "../controllers/dataController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getFarmers, getFarmerFiles } from "../controllers/dataController.js";
import { getUsers, deleteUserByAdmin, getFilesByUser, deleteFileByAdmin } from "../controllers/dataController.js";


const router = express.Router();
const upload = multer();

// Upload
router.post("/upload", authenticateUser, upload.single("file"), uploadFile);

// View all files
router.get("/list", authenticateUser, getUserFiles);

// Download
router.get("/download/:key", authenticateUser, downloadFile);

// Edit (re-upload)
router.put("/edit", authenticateUser, upload.single("file"), editFile);

// Optional: Delete
router.delete("/delete/:key", authenticateUser, deleteFile);

router.get("/farmers", authenticateUser, getFarmers);

// Expert: get files of a specific farmer
router.get("/farmer/:farmerId/files", authenticateUser, getFarmerFiles);


// Admin routes
router.get("/users", authenticateUser, getUsers); // list all users
router.delete("/user/:username", authenticateUser, deleteUserByAdmin); // delete a user
router.get("/user/:username/files", authenticateUser, getFilesByUser); // get files of a user
router.delete("/file", authenticateUser, deleteFileByAdmin); // delete a file



export default router;
