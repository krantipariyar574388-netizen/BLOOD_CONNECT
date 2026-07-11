import { Router } from 'express';
import {
    register,
    login,
    getEligibleDonors
} from '../controllers/user.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/donors', getEligibleDonors);

export default router;