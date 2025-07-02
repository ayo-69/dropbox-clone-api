const express = require('express');
const router = express.Router();

const multer = require('multer');
const File = require('../models/file'); 
require("dotenv").config();

const createMinioClient = require('../utils/file');
const minioClient = createMinioClient();
const upload = multer({ storage: multer.memoryStorage() });

// POST /files
router.post('/', upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    // Upload the file to MinIO
    const filename = req.file.originalname;
    const fileBuffer = req.file.buffer;
    const contentType = req.file.mimetype;

    minioClient.putObject(process.env.MINIO_BUCKET, filename, fileBuffer, contentType, (err) => {
        if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).send("Error uploading file");
        }
        res.status(200).send("File uploaded successfully");
    });

    // Save file metadata
    const fileData = new File({
        name: filename,
        size: req.file.size,
        dateUploaded: Date.now(),
    });
    fileData.save()
    .then(() => {
        console.log("File metadata saved successfully");
    })
    .catch((err) => {
        console.error("Error saving file metadata:", err);
    });
});

// GET /files/:filename
router.get("/:filename", (req, res) => {
    const { filename } = req.params;

    minioClient.getObject(process.env.MINIO_BUCKET, filename, (err, dataStream) => {
        if (err) {
            console.error("Error fetching file:", err);
            return res.status(404).send("File not found");
        }

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        dataStream.pipe(res);
    });
});

// GET /files
router.get("/", (req, res) => {
    const files = File.find({})
    .then((files) => {
        res.status(200).json(files);
    })
    .catch((err) => {
        console.error("Error fetching files:", err);
        return res.status(500).send("Error fetching files");
    });
});

router.delete("/:filename", (req, res) => {
    const { filename } = req.params;

    // Delete file from MinIO
    minioClient.removeObject(process.env.MINIO_BUCKET, filename, (err) => {
        if (err) {
            console.error("Error deleting file from MinIO:", err);
            return res.status(500).send("Error deleting file");
        }

        // Delete file metadata from MongoDB
        File.deleteOne({ name: filename })
        .then(() => {
            res.status(200).send("File deleted successfully");
        })
        .catch((err) => {
            console.error("Error deleting file metadata:", err);
            return res.status(500).send("Error deleting file metadata");
        });
    });
});

module.exports = router;