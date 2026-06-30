import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sellerService } from './seller.service.js';

class SellerController {
  /**
   * GET /api/seller/dashboard
   * Retrieves dashboard statistics, charts, and recent records for the logged-in seller.
   */
  public getDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sellerId = (req.user as any)._id;
    const data = await sellerService.getDashboardData(sellerId);
    res.status(200).json({
      success: true,
      message: 'Seller dashboard retrieved successfully.',
      data,
    });
  });
}

export const sellerController = new SellerController();
export default sellerController;
