// CARPOOL Enterprise REST API Client SDK
// Connects the frontend directly to the SQLite & Express backend.

(function () {
  'use strict';

  const BASE_URL = window.location.origin;

  async function request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('carpool_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API Client] ${endpoint} error:`, err.message);
      throw err;
    }
  }

  const CARPOOL_API = {
    // --- Auth API ---
    async login(email, password) {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (res.token) {
        localStorage.setItem('carpool_token', res.token);
        localStorage.setItem('cp_cur_user', JSON.stringify(res.user));
      }
      return res;
    },

    async signup(employeeData) {
      const res = await request('/api/auth/signup', {
        method: 'POST',
        body: employeeData,
      });
      if (res.token) {
        localStorage.setItem('carpool_token', res.token);
        localStorage.setItem('cp_cur_user', JSON.stringify(res.user));
      }
      return res;
    },

    async logout() {
      localStorage.removeItem('carpool_token');
      return await request('/api/auth/logout', { method: 'POST' });
    },

    async getMe() {
      return await request('/api/auth/me');
    },

    // --- Rides & Route Matching ---
    async getRides(filters = {}) {
      const params = new URLSearchParams();
      if (filters.start) params.append('start', filters.start);
      if (filters.end) params.append('end', filters.end);
      if (filters.seats) params.append('seats', filters.seats);
      if (filters.day) params.append('day', filters.day);

      const qs = params.toString();
      return await request(`/api/rides${qs ? '?' + qs : ''}`);
    },

    async publishRide(rideData) {
      return await request('/api/rides', {
        method: 'POST',
        body: rideData,
      });
    },

    async getRideDetails(rideId) {
      return await request(`/api/rides/${rideId}`);
    },

    // --- Bookings & Trips ---
    async bookRide(bookingData) {
      return await request('/api/bookings', {
        method: 'POST',
        body: bookingData,
      });
    },

    async getMyTrips() {
      return await request('/api/bookings/my');
    },

    async updateBookingStatus(bookingId, status) {
      return await request(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        body: { status },
      });
    },

    // --- Wallet & Settlements ---
    async getWallet() {
      return await request('/api/wallet');
    },

    async rechargeWallet(amount) {
      return await request('/api/wallet/recharge', {
        method: 'POST',
        body: { amount },
      });
    },

    // --- Admin Governance & Analytics ---
    async getAdminEmployees() {
      return await request('/api/admin/employees');
    },

    async toggleEmployeeAccess(employeeId, accessStatus) {
      return await request(`/api/admin/employees/${employeeId}`, {
        method: 'PATCH',
        body: { access_status: accessStatus },
      });
    },

    async getAdminVehicles() {
      return await request('/api/admin/vehicles');
    },

    async toggleVehicleStatus(vehicleId, status) {
      return await request(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        body: { status },
      });
    },

    async getAdminAnalytics() {
      return await request('/api/admin/analytics');
    },

    async getCompanySettings() {
      return await request('/api/admin/settings');
    },

    async updateCompanySettings(settings) {
      return await request('/api/admin/settings', {
        method: 'POST',
        body: settings,
      });
    },
  };

  window.CARPOOL_API = CARPOOL_API;
})();
