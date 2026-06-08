/**
 * Zustand store for global state management
 * Manages authentication and application-wide state
 */

import { create } from 'zustand';
import type { User, AuthTokens, Property, PropertyState, AgentDashboardStats } from '@/types';
import apiService from '@/services/api';

// ============================================================================
// Auth Store
// ============================================================================

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    full_name: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const tokens = await apiService.login({ email, password });
      const user = await apiService.getCurrentUser();
      set({
        user,
        token: tokens.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await apiService.register({
        ...data,
        role: 'buyer',
      });
      set({
        user,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    await apiService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await apiService.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setError: (error: string) => set({ error }),
}));

// ============================================================================
// Properties Store
// ============================================================================

interface PropertiesStore {
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;

  // Actions
  fetchProperties: (page?: number, filters?: any) => Promise<void>;
  fetchPropertyDetail: (id: number) => Promise<void>;
  createProperty: (data: any) => Promise<void>;
  updateProperty: (id: number, data: any) => Promise<void>;
  deleteProperty: (id: number) => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const usePropertiesStore = create<PropertiesStore>((set) => ({
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,

  fetchProperties: async (page = 1, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const skip = (page - 1) * 20;
      const response = await apiService.listProperties({
        skip,
        limit: 20,
        ...filters,
      });
      set({
        properties: response.items,
        total: response.total,
        page,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchPropertyDetail: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const property = await apiService.getPropertyDetail(id);
      set({
        currentProperty: property,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  createProperty: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const property = await apiService.createProperty(data);
      set((state) => ({
        properties: [property, ...state.properties],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  updateProperty: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiService.updateProperty(id, data);
      set((state) => ({
        properties: state.properties.map((p) => (p.id === id ? updated : p)),
        currentProperty:
          state.currentProperty?.id === id ? updated : state.currentProperty,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteProperty(id);
      set((state) => ({
        properties: state.properties.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = apiService.getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setError: (error: string) => set({ error }),
}));

// ============================================================================
// Agent Dashboard Store
// ============================================================================

interface AgentDashboardStore {
  stats: AgentDashboardStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: (userId: number) => Promise<void>;
  clearError: () => void;
}

export const useAgentDashboardStore = create<AgentDashboardStore>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      const stats: AgentDashboardStats = {
        total_listings: 15,
        active_listings: 12,
        total_leads: 48,
        new_leads: 5,
        conversion_rate: 18.5,
        views_this_month: 1200,
      };
      set({
        stats,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: apiService.getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
