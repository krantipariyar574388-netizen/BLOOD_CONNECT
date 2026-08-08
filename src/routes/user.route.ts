import express, { Router } from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    toggleAvailability,
    forgotPassword,
    resetPassword,
    getEligibleDonors
} from '../controllers/user.controller';
import { uploader } from "../middlewares/multer.middleware";
import { authentication } from '../middlewares/auth.middleware';

const router: Router = express.Router();

// multer uploader
const upload = uploader();

// Auth Endpoints
router.post("/register", upload.single("profile_image") ,register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get('/donors', getEligibleDonors);

router.post("/logout", authentication(), logout);
router.get("/me", authentication(), getMe);
router.patch("/profile", authentication(), upload.single("profile_image"), updateProfile);
router.patch("/change-password", authentication(), changePassword);
router.patch("/toggle-availability", authentication(), toggleAvailability);

export default router;