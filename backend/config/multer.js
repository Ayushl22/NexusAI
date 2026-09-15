import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/documents");
const isVercel = Boolean(process.env.VERCEL);

if (!isVercel && !fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Vercel's filesystem is ephemeral. Keep serverless uploads in memory long
// enough to extract their text, while retaining disk-backed local development.
const storage = isVercel
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },

        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);

            cb(
                null,
                `${uniqueSuffix}${path.extname(file.originalname)}`
            );
        },
    });

const configuredMaxFileSize = Number(process.env.MAX_FILE_SIZE);
const localMaxFileSize = Number.isFinite(configuredMaxFileSize) && configuredMaxFileSize > 0
    ? configuredMaxFileSize
    : 10 * 1024 * 1024;
const maxFileSize = isVercel
    ? Math.min(localMaxFileSize, 4 * 1024 * 1024)
    : localMaxFileSize;

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, DOC, DOCX and TXT files are allowed"
            ),
            false
        );
    }
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxFileSize,
    },
});

export default upload;
