import express, { Router } from 'express';
import {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequestStatus,
  deleteBloodRequest,
} from '../controllers/bloodRequest.controller';

const router : Router = express.Router();

router.post('/', createBloodRequest);
router.get('/', getAllBloodRequests);
router.get('/:id',getBloodRequestById);
router.patch('/:id/status', updateBloodRequestStatus);
router.delete('/:id/',deleteBloodRequest);

export default router;