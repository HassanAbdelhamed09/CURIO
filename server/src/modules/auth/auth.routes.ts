import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { rateLimiter } from '../../middlewares/rateLimit.middleware.js';
import { auth } from '../../middlewares/auth.middleware.js';
import { registerSchema, loginSchema, resetPasswordSchema } from './auth.validation.js';

const router = Router();

// Apply strict rate limiting to sensitive routes
const authRateLimit = rateLimiter(5, 15); // 5 requests per 15 mins

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authRateLimit, validate(loginSchema), authController.login);
router.post('/google', authRateLimit, authController.googleLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Verification and recovery endpoints mapped to active controllers
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authRateLimit, authController.resendVerification);
router.post('/forgot-password', authRateLimit, authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Authenticated password modification
router.post('/change-password', auth, authController.changePassword);

// Phone OTP endpoints
router.post('/phone/request-otp', authRateLimit, authController.requestPhoneOtp);
router.post('/phone/verify-otp', authController.verifyPhoneOtp);

export default router;
