import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { adminService } from './admin.service.js';

class AdminController {
  /**
   * GET /api/admin/dashboard
   * Returns consolidated dashboard data: stats, charts, and recent items.
   */
  public getDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await adminService.getDashboardData();

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully.',
      data,
    });
  });

  /**
   * GET /api/admin/users
   * Returns a paginated, filterable list of user profiles.
   */
  public getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await adminService.getUsers(req.query);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully.',
      data,
    });
  });

  /**
   * PATCH /api/admin/users/:id
   * Updates user credentials, role, status, or soft-deletes account.
   */
  public updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const requesterId = req.user!._id.toString();

    const data = await adminService.updateUser(id, req.body, requesterId);

    res.status(200).json({
      success: true,
      message: 'User account updated successfully.',
      data,
    });
  });

  /**
   * GET /api/admin/sellers
   * Returns a paginated, aggregated list of sellers.
   */
  public getSellers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await adminService.getSellers(req.query);

    res.status(200).json({
      success: true,
      message: 'Sellers retrieved successfully.',
      data,
    });
  });

  /**
   * GET /api/admin/reviews
   * Returns a list of all reviews.
   */
  public getReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await adminService.getReviews(req.query);
    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully.',
      data,
    });
  });

  /**
   * PATCH /api/admin/reviews/:id
   * Updates moderation status of a review.
   */
  public updateReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await adminService.updateReview(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      data,
    });
  });

  /**
   * DELETE /api/admin/reviews/:id
   * Permanently deletes a review.
   */
  public deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await adminService.deleteReview(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  });
}

export const adminController = new AdminController();
