import express, { Router } from 'express';
import {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequestStatus,
  deleteBloodRequest,
} from '../controllers/bloodRequest.controller';
import { uploader } from "../middlewares/multer.middleware";

const router : Router = express.Router();

// multer uploader
const upload = uploader();

router.post("/", upload.single("medicalDocument"), createBloodRequest);
router.get('/', getAllBloodRequests);
router.get('/:id',getBloodRequestById);
router.patch('/:id/status', updateBloodRequestStatus);
router.delete('/:id/',deleteBloodRequest);

export default router;