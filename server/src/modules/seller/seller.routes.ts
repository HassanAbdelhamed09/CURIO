import { Router } from 'express';
import { sellerController } from './seller.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { role } from '../../middlewares/role.middleware.js';

const router = Router();

router.get('/dashboard', auth, role('seller', 'admin'), sellerController.getDashboard);

export default router;
