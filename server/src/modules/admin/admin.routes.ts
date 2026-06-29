import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/authorize.middleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(auth, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.patch('/users/:id', adminController.updateUser);

export default router;
