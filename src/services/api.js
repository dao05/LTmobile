/**
 * API Service
 * Manages all API calls to backend services
 * Currently using mock data, can be connected to real backend
 */

import axios from 'axios';

// API Base URL - change this to your actual API endpoint
const API_BASE_URL = 'https://api.example.com';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Room Services
 */
export const RoomService = {
  getAll: async () => {
    try {
      // const response = await apiClient.get('/rooms');
      // return response;
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      // return await apiClient.get(`/rooms/${id}`);
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },

  create: async (roomData) => {
    try {
      // return await apiClient.post('/rooms', roomData);
      return Promise.resolve(roomData);
    } catch (error) {
      throw error;
    }
  },

  update: async (id, roomData) => {
    try {
      // return await apiClient.put(`/rooms/${id}`, roomData);
      return Promise.resolve(roomData);
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // return await apiClient.delete(`/rooms/${id}`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  getAvailable: async () => {
    try {
      // return await apiClient.get('/rooms/available');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Tenant Services
 */
export const TenantService = {
  getAll: async () => {
    try {
      // return await apiClient.get('/tenants');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      // return await apiClient.get(`/tenants/${id}`);
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },

  create: async (tenantData) => {
    try {
      // return await apiClient.post('/tenants', tenantData);
      return Promise.resolve(tenantData);
    } catch (error) {
      throw error;
    }
  },

  update: async (id, tenantData) => {
    try {
      // return await apiClient.put(`/tenants/${id}`, tenantData);
      return Promise.resolve(tenantData);
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // return await apiClient.delete(`/tenants/${id}`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  getByRoom: async (roomId) => {
    try {
      // return await apiClient.get(`/tenants/room/${roomId}`);
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Invoice Services
 */
export const InvoiceService = {
  getAll: async () => {
    try {
      // return await apiClient.get('/invoices');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      // return await apiClient.get(`/invoices/${id}`);
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },

  create: async (invoiceData) => {
    try {
      // return await apiClient.post('/invoices', invoiceData);
      return Promise.resolve(invoiceData);
    } catch (error) {
      throw error;
    }
  },

  update: async (id, invoiceData) => {
    try {
      // return await apiClient.put(`/invoices/${id}`, invoiceData);
      return Promise.resolve(invoiceData);
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // return await apiClient.delete(`/invoices/${id}`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  markAsPaid: async (id) => {
    try {
      // return await apiClient.patch(`/invoices/${id}/pay`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  getUnpaid: async () => {
    try {
      // return await apiClient.get('/invoices/unpaid');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },

  getOverdue: async () => {
    try {
      // return await apiClient.get('/invoices/overdue');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Contract Services
 */
export const ContractService = {
  getAll: async () => {
    try {
      // return await apiClient.get('/contracts');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      // return await apiClient.get(`/contracts/${id}`);
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },

  create: async (contractData) => {
    try {
      // return await apiClient.post('/contracts', contractData);
      return Promise.resolve(contractData);
    } catch (error) {
      throw error;
    }
  },

  update: async (id, contractData) => {
    try {
      // return await apiClient.put(`/contracts/${id}`, contractData);
      return Promise.resolve(contractData);
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // return await apiClient.delete(`/contracts/${id}`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  renew: async (id, newEndDate) => {
    try {
      // return await apiClient.patch(`/contracts/${id}/renew`, { newEndDate });
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  getExpiring: async (days = 30) => {
    try {
      // return await apiClient.get(`/contracts/expiring?days=${days}`);
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },
};

/**
 * User Services
 */
export const UserService = {
  getAll: async () => {
    try {
      // return await apiClient.get('/users');
      return Promise.resolve([]);
    } catch (error) {
      throw error;
    }
  },

  updateRole: async (userId, role) => {
    try {
      // return await apiClient.patch(`/users/${userId}/role`, { role });
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  toggleStatus: async (userId) => {
    try {
      // return await apiClient.patch(`/users/${userId}/toggle-status`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      // return await apiClient.get('/users/current');
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      // return await apiClient.put('/users/profile', userData);
      return Promise.resolve(userData);
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Dashboard Services
 */
export const DashboardService = {
  getStats: async () => {
    try {
      // return await apiClient.get('/dashboard/stats');
      return Promise.resolve({
        totalRooms: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        totalRevenue: 0,
        unpaidInvoices: 0,
        totalTenants: 0,
      });
    } catch (error) {
      throw error;
    }
  },

  getReports: async (startDate, endDate) => {
    try {
      // return await apiClient.get('/dashboard/reports', {
      //   params: { startDate, endDate }
      // });
      return Promise.resolve({});
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
