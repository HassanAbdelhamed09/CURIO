import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Category, CreateCategoryPayload } from '../types/product.types.js';
import { categoryApi } from '../api/product.api.js';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCategories = async (includeDeleted = false) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.getAll({ includeDeleted });
      if (response.success && response.data) {
        categories.value = response.data;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (payload: CreateCategoryPayload) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.create(payload);
      if (response.success && response.data) {
        categories.value.push(response.data);
      }
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id: string, payload: Partial<CreateCategoryPayload>) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.update(id, payload);
      if (response.success && response.data) {
        const idx = categories.value.findIndex((c) => c._id === id);
        if (idx !== -1) categories.value[idx] = response.data;
      }
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await categoryApi.delete(id);
      // Update local cache status instead of removing if we are in admin mode,
      // or filter it out if we just fetch all again. Let's toggle local status or refetch.
      const idx = categories.value.findIndex((c) => c._id === id);
      if (idx !== -1) {
        categories.value[idx].status = 'deleted';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const restoreCategory = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryApi.restore(id);
      if (response.success && response.data) {
        const idx = categories.value.findIndex((c) => c._id === id);
        if (idx !== -1) categories.value[idx] = response.data;
      }
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to restore category';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
  };
});

export default useCategoryStore;
