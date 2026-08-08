import { User, Vehicle, Ride, Trip, WalletTransaction, PaymentMethodItem, SavedPlace, NotificationItem, CompanySettings, MonthlyFinancialSummary } from '../types';
import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_RIDES,
  INITIAL_TRIPS,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_SAVED_PLACES,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_MONTHLY_SUMMARY,
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'carpool_current_user',
  USERS: 'carpool_users',
  VEHICLES: 'carpool_vehicles',
  RIDES: 'carpool_rides',
  TRIPS: 'carpool_trips',
  TRANSACTIONS: 'carpool_transactions',
  PAYMENT_METHODS: 'carpool_payment_methods',
  SAVED_PLACES: 'carpool_saved_places',
  NOTIFICATIONS: 'carpool_notifications',
  SETTINGS: 'carpool_settings',
  MONTHLY_SUMMARY: 'carpool_monthly_summary',
  SPLASH_SHOWN: 'carpool_splash_shown',
};

// Safe storage getter and setter
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('carpool_storage_update', { detail: { key, value } }));
    } catch (e) {
      console.warn(`Error writing to localStorage key "${key}":`, e);
    }
  },

  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      storage.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      storage.set(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RIDES)) {
      storage.set(STORAGE_KEYS.RIDES, INITIAL_RIDES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
      storage.set(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      storage.set(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS)) {
      storage.set(STORAGE_KEYS.PAYMENT_METHODS, INITIAL_PAYMENT_METHODS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_PLACES)) {
      storage.set(STORAGE_KEYS.SAVED_PLACES, INITIAL_SAVED_PLACES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      storage.set(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      storage.set(STORAGE_KEYS.SETTINGS, INITIAL_COMPANY_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MONTHLY_SUMMARY)) {
      storage.set(STORAGE_KEYS.MONTHLY_SUMMARY, INITIAL_MONTHLY_SUMMARY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      storage.set(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Default to Raj Patel
    }
  },

  // Auth
  getCurrentUser: (): User => {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser: (user: User): void => {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Users
  getUsers: (): User[] => storage.get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => storage.set(STORAGE_KEYS.USERS, users),
  addUser: (newUser: User) => {
    const users = storage.getUsers();
    users.push(newUser);
    storage.setUsers(users);
  },
  updateUser: (updatedUser: User) => {
    const users = storage.getUsers().map((u) => (u.id === updatedUser.id ? updatedUser : u));
    storage.setUsers(users);
    const currentUser = storage.getCurrentUser();
    if (currentUser.id === updatedUser.id) {
      storage.setCurrentUser(updatedUser);
    }
  },

  // Vehicles
  getVehicles: (): Vehicle[] => storage.get<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES),
  setVehicles: (vehicles: Vehicle[]) => storage.set(STORAGE_KEYS.VEHICLES, vehicles),
  addVehicle: (vehicle: Vehicle) => {
    const vehicles = storage.getVehicles();
    vehicles.unshift(vehicle);
    storage.setVehicles(vehicles);
    storage.addNotification({
      id: `notif-${Date.now()}`,
      userId: vehicle.userId,
      title: 'Vehicle Added',
      message: `${vehicle.model} (${vehicle.registrationNumber}) has been registered.`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      type: 'vehicle',
      link: '/my-vehicle',
    });
  },
  updateVehicle: (updated: Vehicle) => {
    const vehicles = storage.getVehicles().map((v) => (v.id === updated.id ? updated : v));
    storage.setVehicles(vehicles);
  },
  deleteVehicle: (id: string) => {
    const vehicles = storage.getVehicles().filter((v) => v.id !== id);
    storage.setVehicles(vehicles);
  },

  // Rides (Available Rides pool)
  getRides: (): Ride[] => storage.get<Ride[]>(STORAGE_KEYS.RIDES, INITIAL_RIDES),
  setRides: (rides: Ride[]) => storage.set(STORAGE_KEYS.RIDES, rides),
  addRide: (newRide: Ride) => {
    const rides = storage.getRides();
    rides.unshift(newRide);
    storage.setRides(rides);
    storage.addNotification({
      id: `notif-${Date.now()}`,
      userId: newRide.driverId,
      title: 'Ride Published',
      message: `Your ride from ${newRide.startLocation} to ${newRide.destinationLocation} is now available.`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      type: 'ride',
      link: '/find-ride',
    });
  },

  // Trips
  getTrips: (): Trip[] => storage.get<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS),
  setTrips: (trips: Trip[]) => storage.set(STORAGE_KEYS.TRIPS, trips),
  addTrip: (newTrip: Trip) => {
    const trips = storage.getTrips();
    trips.unshift(newTrip);
    storage.setTrips(trips);

    // Also deduct or reserve seats in Rides pool
    const rides = storage.getRides().map((r) => {
      if (r.id === newTrip.rideId) {
        return { ...r, availableSeats: Math.max(0, r.availableSeats - newTrip.seatsBooked) };
      }
      return r;
    });
    storage.setRides(rides);

    // Add notification
    const currentUser = storage.getCurrentUser();
    storage.addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Ride Booked Successfully',
      message: `Confirmed seat on trip with ${newTrip.driverName} to ${newTrip.destinationLocation}.`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      type: 'ride',
      link: '/my-trips',
    });
  },
  updateTrip: (updated: Trip) => {
    const trips = storage.getTrips().map((t) => (t.id === updated.id ? updated : t));
    storage.setTrips(trips);
  },
  cancelTrip: (id: string) => {
    const trips = storage.getTrips().map((t) => (t.id === id ? { ...t, status: 'cancelled' as const } : t));
    storage.setTrips(trips);
    const currentUser = storage.getCurrentUser();
    storage.addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Trip Cancelled',
      message: 'Your booking has been cancelled and any paid fare has been refunded to your wallet.',
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      type: 'ride',
      link: '/my-trips',
    });
  },

  // Wallet & Transactions
  getTransactions: (): WalletTransaction[] => storage.get<WalletTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  addTransaction: (tx: WalletTransaction) => {
    const txs = storage.getTransactions();
    txs.unshift(tx);
    storage.set(STORAGE_KEYS.TRANSACTIONS, txs);

    // Update current user wallet balance
    const user = storage.getCurrentUser();
    const newBalance = tx.type === 'credit' ? user.walletBalance + tx.amount : Math.max(0, user.walletBalance - tx.amount);
    const updatedUser = { ...user, walletBalance: newBalance };
    storage.updateUser(updatedUser);

    storage.addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: tx.type === 'credit' ? 'Wallet Recharged' : 'Payment Completed',
      message: `₹${tx.amount} ${tx.type === 'credit' ? 'added to' : 'deducted from'} your Carpool wallet.`,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      type: 'payment',
      link: '/wallet',
    });
  },

  // Payment Methods
  getPaymentMethods: (): PaymentMethodItem[] => storage.get<PaymentMethodItem[]>(STORAGE_KEYS.PAYMENT_METHODS, INITIAL_PAYMENT_METHODS),
  setPaymentMethods: (methods: PaymentMethodItem[]) => storage.set(STORAGE_KEYS.PAYMENT_METHODS, methods),

  // Saved Places
  getSavedPlaces: (): SavedPlace[] => storage.get<SavedPlace[]>(STORAGE_KEYS.SAVED_PLACES, INITIAL_SAVED_PLACES),
  setSavedPlaces: (places: SavedPlace[]) => storage.set(STORAGE_KEYS.SAVED_PLACES, places),

  // Notifications
  getNotifications: (): NotificationItem[] => storage.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  addNotification: (notif: NotificationItem) => {
    const notifs = storage.getNotifications();
    notifs.unshift(notif);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  markNotificationRead: (id: string) => {
    const notifs = storage.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  markAllNotificationsRead: () => {
    const notifs = storage.getNotifications().map((n) => ({ ...n, read: true }));
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Company Settings
  getSettings: (): CompanySettings => storage.get<CompanySettings>(STORAGE_KEYS.SETTINGS, INITIAL_COMPANY_SETTINGS),
  setSettings: (settings: CompanySettings) => storage.set(STORAGE_KEYS.SETTINGS, settings),

  // User Feedbacks
  getFeedbacks: (): UserFeedback[] => {
    return storage.get<UserFeedback[]>('carpool_feedbacks', [
      {
        id: 'fb-1',
        userName: 'Priya Mukherjee',
        userEmail: 'priya.m@odoo.com',
        category: 'Ride Experience',
        rating: 5,
        route: 'Park Street → Sector V, Salt Lake',
        comments: 'Extremely smooth commute along Maa Flyover. Car was clean and arrived on time!',
        status: 'Resolved',
        createdAt: 'Today, 10:45 AM',
      },
      {
        id: 'fb-2',
        userName: 'Sridwip Mandal',
        userEmail: 'sridwip@odoo.com',
        category: 'App Usability & Map',
        rating: 5,
        route: 'Howrah → New Town Kolkata',
        comments: 'High-res satellite view and live GPS telemetry on Leaflet.js works wonderfully.',
        status: 'Resolved',
        createdAt: 'Yesterday, 04:30 PM',
      },
    ]);
  },
  addFeedback: (fb: UserFeedback) => {
    const list = storage.getFeedbacks();
    list.unshift(fb);
    storage.set('carpool_feedbacks', list);
    const currentUser = storage.getCurrentUser();
    storage.addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Feedback Received',
      message: 'Thank you for sharing your feedback! Our mobility team is reviewing your response.',
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
      type: 'system',
      link: '/help-chat',
    });
  },

  // Monthly Summary
  getMonthlySummary: (): MonthlyFinancialSummary[] => storage.get<MonthlyFinancialSummary[]>(STORAGE_KEYS.MONTHLY_SUMMARY, INITIAL_MONTHLY_SUMMARY),

  // Reset to initial
  resetDemo: () => {
    localStorage.clear();
    storage.init();
  },
};
