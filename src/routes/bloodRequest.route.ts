import express, { Router } from 'express';
import {
  createBloodRequest,
  getActiveRequests,
  updateRequestStatus,
} from '../controllers/bloodRequest.controller';

const router : Router = express.Router();

router.post('/', createBloodRequest);
router.get('/', getActiveRequests);
router.patch('/:id/status', updateRequestStatus);

export default router;