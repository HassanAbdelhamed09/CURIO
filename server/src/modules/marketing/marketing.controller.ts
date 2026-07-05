import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { marketingService } from './marketing.service.js';
import { ApiError } from '../../utils/ApiError.js';

export class MarketingController {
  /**
   * POST /api/marketing/subscribe
   */
  public subscribe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email address is required for subscribing.', 'VALIDATION_ERROR');
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Invalid email address format.', 'VALIDATION_ERROR');
    }

    await marketingService.subscribeEmail(email);

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to the CURIO newsletter. Check your inbox for confirmation!',
    });
  });
}

export const marketingController = new MarketingController();
