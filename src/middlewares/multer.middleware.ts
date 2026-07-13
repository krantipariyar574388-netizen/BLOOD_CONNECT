import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";
import { AppError } from "../utils/customError.util";

export const uploader = () => {
  const folder = "uploads/";
  const fileSize = 5 * 1024 * 1024; // 5MB in bytes
  const allowed_extensions = [".png", ".jpg", ".webp", ".jpeg", ".svg", ".pdf"];
  const allowed_mimetypes = [
    "image/png",
    "image/jpg",
    "image/webp",
    "image/jpeg",
    "image/svg+xml",
    "application/pdf",
  ];

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const filename = Date.now() + "-" + file.originalname;
      cb(null, filename);
    },
  });

  // file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const file_ext = path.extname(file.originalname);

    // check if file ext is allowed
    if (!allowed_extensions.includes(file_ext)) {
      cb(
        new AppError(
          `Invalid file extension.Only ${allowed_extensions.join(",")} are allowed.`,
          400,
        ),
      );
      return;
    }

    // check is file type allowed
    if (!allowed_mimetypes.includes(file.mimetype)) {
      cb(
        new AppError(
          `Invalid file extension.Only ${allowed_mimetypes.join(",")} are allowed.`,
          400,
        ),
      );
      return;
    }
    cb(null, true); //upload current file
  };

  // multer upload instance
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: fileSize, // file size limit
    },
  });
  return upload;
};

export default uploader;
