import express, { Router } from 'express';
import {
    register,
    login,
    getEligibleDonors
} from '../controllers/user.controller';
import { uploader } from "../middlewares/multer.middleware";

const router: Router = express.Router();

// multer uploader
const upload = uploader();

// Auth Endpoints
router.post("/register", upload.single("profile_image") ,register);
router.post("/login", login);
router.get('/donors', getEligibleDonors);

export default router;