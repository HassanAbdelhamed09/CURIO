import { http } from './http.js';
import type { ApiResponse } from '../types/api.types.js';

export interface DashboardStats {
  customers: number;
  sellers: number;
  products: number;
  orders: number;
  revenue: number;
}

export interface MonthlyDataPoint {
  month: string;
  year: number;
  value: number;
}

export interface CategoryDataPoint {
  category: string;
  count: number;
}

export interface DashboardCharts {
  salesPerMonth: MonthlyDataPoint[];
  ordersPerMonth: MonthlyDataPoint[];
  productsPerCategory: CategoryDataPoint[];
}

export interface RecentOrder {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface RecentSeller {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface DashboardRecent {
  orders: RecentOrder[];
  sellers: RecentSeller[];
  products: RecentProduct[];
}

export interface DashboardData {
  stats: DashboardStats;
  charts: DashboardCharts;
  recent: DashboardRecent;
}

export interface UserRegistryItem {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  status: 'active' | 'blocked' | 'deleted';
  createdAt: string;
}

export interface PaginatedUsersData {
  users: UserRegistryItem[];
  total: number;
  pages: number;
  page: number;
}

export const adminApi = {
  async fetchDashboardData(): Promise<ApiResponse<DashboardData>> {
    const response = await http.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return response.data;
  },

  async fetchUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<PaginatedUsersData>> {
    const response = await http.get<ApiResponse<PaginatedUsersData>>('/admin/users', { params });
    return response.data;
  },

  async updateUser(
    id: string,
    payload: {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: 'customer' | 'seller' | 'admin';
      status?: 'active' | 'blocked' | 'deleted';
    }
  ): Promise<ApiResponse<UserRegistryItem>> {
    const response = await http.patch<ApiResponse<UserRegistryItem>>(`/admin/users/${id}`, payload);
    return response.data;
  },
};

export default adminApi;
