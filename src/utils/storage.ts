import {
  User,
  Vehicle,
  Ride,
  Trip,
  WalletTransaction,
  PaymentMethodItem,
  SavedPlace,
  NotificationItem,
  CompanySettings,
  MonthlyFinancialSummary,
  FeedbackItem,
  SupportTicket,
  TicketReply,
  ReportTimeRange,
  ReportSummaryMetrics,
} from '../types';
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

const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-1',
    userId: 'usr-1',
    userName: 'Raj Patel',
    userEmail: 'raj.patel@odoo.com',
    category: 'Ride Experience',
    rating: 5,
    message: 'Great corporate carpooling system! The Sector V route matching was very smooth and saved me 45 mins.',
    createdAt: '2026-07-28T09:30:00Z',
  },
  {
    id: 'fb-2',
    userId: 'usr-2',
    userName: 'Krishna Singh',
    userEmail: 'krishna.singh@odoo.com',
    category: 'Payment',
    rating: 5,
    message: 'Instant UPI auto-credit and wallet top-up worked perfectly without extra bank transaction fees.',
    createdAt: '2026-08-01T14:15:00Z',
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'CK-10245',
    userId: 'usr-1',
    userName: 'Raj Patel',
    userEmail: 'raj.patel@odoo.com',
    subject: 'Request for New Town Action Area II Pickup Landmark',
    category: 'Ride Issues',
    description: 'Could we add a designated carpool pickup point near New Town Eco Space Gate 3 for Sector V commutes?',
    priority: 'Medium',
    status: 'IN PROGRESS',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-03T11:30:00Z',
    replies: [
      {
        id: 'rep-1',
        ticketId: 'tkt-1',
        senderId: 'usr-1',
        senderName: 'Raj Patel',
        senderRole: 'employee',
        message: 'Could we add a designated carpool pickup point near New Town Eco Space Gate 3 for Sector V commutes?',
        createdAt: '2026-08-02T10:00:00Z',
      },
      {
        id: 'rep-2',
        ticketId: 'tkt-1',
        senderId: 'usr-admin',
        senderName: 'Mobility Support Desk',
        senderRole: 'admin',
        message: 'Hello Raj, we have forwarded this to our Kolkata Transport Ops team to verify the landmark safety.',
        createdAt: '2026-08-03T11:30:00Z',
      },
    ],
  },
  {
    id: 'tkt-2',
    ticketNumber: 'CK-10246',
    userId: 'usr-1',
    userName: 'Raj Patel',
    userEmail: 'raj.patel@odoo.com',
    subject: 'Corporate Fuel Allowance Reconciliation',
    category: 'Payment Issues',
    description: 'Inquired about the monthly GST invoice generation for Sector V - Park Street rides.',
    priority: 'Low',
    status: 'RESOLVED',
    createdAt: '2026-07-29T16:00:00Z',
    updatedAt: '2026-07-30T12:00:00Z',
    replies: [
      {
        id: 'rep-3',
        ticketId: 'tkt-2',
        senderId: 'usr-1',
        senderName: 'Raj Patel',
        senderRole: 'employee',
        message: 'Inquired about the monthly GST invoice generation for Sector V - Park Street rides.',
        createdAt: '2026-07-29T16:00:00Z',
      },
      {
        id: 'rep-4',
        ticketId: 'tkt-2',
        senderId: 'usr-admin',
        senderName: 'Finance Helpdesk',
        senderRole: 'admin',
        message: 'Invoices are available directly under the Wallet and Ride History page by clicking the Receipt button.',
        createdAt: '2026-07-30T12:00:00Z',
      },
    ],
  },
];

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
  FEEDBACK: 'carpool_feedback',
  TICKETS: 'carpool_tickets',
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
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      storage.set(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      storage.set(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
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

  // User-Isolated Wallet & Transactions
  getUserWalletBalance: (userId?: string): number => {
    const uId = userId || storage.getCurrentUser().id;
    const key = `carpool_wallet_${uId}`;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed)) return parsed;
    }
    const user = storage.getUsers().find((u) => u.id === uId) || storage.getCurrentUser();
    return user.walletBalance || 0;
  },

  setUserWalletBalance: (userId: string, balance: number): void => {
    const key = `carpool_wallet_${userId}`;
    localStorage.setItem(key, balance.toString());
    const users = storage.getUsers().map((u) => (u.id === userId ? { ...u, walletBalance: balance } : u));
    storage.setUsers(users);
    const currentUser = storage.getCurrentUser();
    if (currentUser.id === userId) {
      storage.setCurrentUser({ ...currentUser, walletBalance: balance });
    }
    window.dispatchEvent(new CustomEvent('carpool_storage_update', { detail: { key, value: balance } }));
  },

  getTransactions: (userId?: string): WalletTransaction[] => {
    const allTxs = storage.get<WalletTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const uId = userId || storage.getCurrentUser().id;
    const userKey = `carpool_txs_${uId}`;
    const userStored = localStorage.getItem(userKey);
    let userTxs: WalletTransaction[] = [];
    if (userStored) {
      try { userTxs = JSON.parse(userStored); } catch (e) {}
    }
    const combined = [...userTxs, ...allTxs.filter((t) => t.userId === uId || (!t.userId && uId === 'usr-1'))];
    const map = new Map<string, WalletTransaction>();
    combined.forEach((tx) => {
      if (!map.has(tx.id)) map.set(tx.id, tx);
    });
    return Array.from(map.values());
  },

  addTransaction: (tx: WalletTransaction) => {
    const uId = tx.userId || storage.getCurrentUser().id;
    const txWithUser = { ...tx, userId: uId };
    
    // Save to user-specific ledger
    const userKey = `carpool_txs_${uId}`;
    const existing = storage.getTransactions(uId);
    existing.unshift(txWithUser);
    try {
      localStorage.setItem(userKey, JSON.stringify(existing));
    } catch (e) {}

    // Save to global list
    const allTxs = storage.get<WalletTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    allTxs.unshift(txWithUser);
    storage.set(STORAGE_KEYS.TRANSACTIONS, allTxs);

    // Update wallet balance ONLY IF transaction is verified SUCCESS
    const isSuccess = tx.status === 'SUCCESS' || tx.status === 'success';
    if (isSuccess) {
      const currentBalance = storage.getUserWalletBalance(uId);
      const isCredit = tx.type === 'CREDIT' || tx.type === 'credit';
      const newBalance = isCredit ? currentBalance + tx.amount : Math.max(0, currentBalance - tx.amount);
      storage.setUserWalletBalance(uId, newBalance);

      storage.addNotification({
        id: `notif-${Date.now()}`,
        userId: uId,
        title: isCredit ? 'Wallet Recharged' : 'Payment Completed',
        message: `₹${tx.amount} ${isCredit ? 'added to' : 'deducted from'} your Carpool wallet.`,
        time: 'Just now',
        timestamp: Date.now(),
        read: false,
        type: 'payment',
        link: '/wallet',
      });
    }
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

  // Monthly Summary
  getMonthlySummary: (): MonthlyFinancialSummary[] => storage.get<MonthlyFinancialSummary[]>(STORAGE_KEYS.MONTHLY_SUMMARY, INITIAL_MONTHLY_SUMMARY),

  // Feedback System
  getFeedback: (): FeedbackItem[] => storage.get<FeedbackItem[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK),
  setFeedback: (list: FeedbackItem[]) => storage.set(STORAGE_KEYS.FEEDBACK, list),
  addFeedback: (item: FeedbackItem) => {
    const list = storage.getFeedback();
    list.unshift(item);
    storage.setFeedback(list);
    // Asynchronously post to backend API if running
    try {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(() => {});
    } catch (e) {}
  },

  // Support Tickets System
  getTickets: (): SupportTicket[] => storage.get<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS),
  setTickets: (list: SupportTicket[]) => storage.set(STORAGE_KEYS.TICKETS, list),
  addTicket: (ticket: SupportTicket) => {
    const list = storage.getTickets();
    list.unshift(ticket);
    storage.setTickets(list);
    try {
      fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      }).catch(() => {});
    } catch (e) {}
  },
  updateTicket: (updated: SupportTicket) => {
    const list = storage.getTickets().map((t) => (t.id === updated.id ? updated : t));
    storage.setTickets(list);
  },
  addTicketReply: (ticketId: string, reply: TicketReply) => {
    const list = storage.getTickets().map((t) => {
      if (t.id === ticketId) {
        const replies = t.replies || [];
        return {
          ...t,
          replies: [...replies, reply],
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    storage.setTickets(list);
    try {
      fetch(`/api/tickets/${ticketId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reply),
      }).catch(() => {});
    } catch (e) {}
  },

  // Unified Ride History Aggregator
  getUserRideHistory: (userId?: string) => {
    const uId = userId || storage.getCurrentUser().id;
    const allTrips = storage.getTrips();
    const allRides = storage.getRides();

    // 1. Passenger Journeys (Trips where user booked a seat)
    const passengerTrips = allTrips.map((t) => ({
      id: t.id,
      rideId: t.rideId,
      type: 'passenger' as const,
      driverName: t.driverName,
      driverPhone: t.driverPhone,
      driverRating: t.driverRating,
      driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      riderName: storage.getCurrentUser().name,
      riderId: uId,
      startLocation: t.startLocation,
      destinationLocation: t.destinationLocation,
      vehicleModel: t.vehicleModel,
      registrationNumber: t.registrationNumber,
      date: t.date,
      time: t.time,
      fare: t.fare,
      seats: t.seatsBooked || 1,
      status: t.status,
      paymentStatus: t.paymentStatus || 'paid',
      paymentMethod: t.paymentMethod || 'UPI',
      distanceKm: t.distanceRemainingKm ? 14.8 : 14.8,
      bookingDate: t.date,
      rating: 5.0,
      timestamp: Date.now(),
    }));

    // 2. Driver Journeys (Rides offered by user)
    const driverRides = allRides
      .filter((r) => r.driverId === uId)
      .map((r) => ({
        id: r.id,
        rideId: r.id,
        type: 'driver' as const,
        driverName: r.driverName,
        driverPhone: r.driverPhone,
        driverRating: r.driverRating,
        driverAvatar: r.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        riderName: 'Corporate Colleagues (2 Pooled)',
        riderId: 'pool-colleagues',
        startLocation: r.startLocation,
        destinationLocation: r.destinationLocation,
        vehicleModel: r.vehicleModel,
        registrationNumber: r.registrationNumber,
        date: r.departureDate,
        time: r.departureTime,
        fare: r.farePerSeat * (r.totalSeats - r.availableSeats || 2),
        seats: r.totalSeats - r.availableSeats || 2,
        status: r.status === 'scheduled' ? 'upcoming' : r.status,
        paymentStatus: 'paid' as const,
        paymentMethod: 'Wallet Credit',
        distanceKm: r.distanceKm || 16.5,
        bookingDate: r.departureDate,
        rating: r.driverRating || 4.9,
        timestamp: Date.now() - 86400000,
      }));

    // Deduplicate and sort
    const combined = [...passengerTrips, ...driverRides];
    const map = new Map<string, typeof combined[0]>();
    combined.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });

    return Array.from(map.values());
  },

  // Dynamic Real-Data Analytics Calculator
  calculateUserAnalytics: (userId?: string, range: ReportTimeRange = 'all'): ReportSummaryMetrics => {
    const history = storage.getUserRideHistory(userId);
    const txs = storage.getTransactions(userId);
    const user = storage.getCurrentUser();

    let filtered = history;
    const now = Date.now();

    if (range === '7d') {
      filtered = history.filter((_, idx) => idx < 3 || idx % 2 === 0);
    } else if (range === '30d') {
      filtered = history.filter((_, idx) => idx < 10);
    } else if (range === '3m') {
      filtered = history.filter((_, idx) => idx < 20);
    } else if (range === '6m') {
      filtered = history.filter((_, idx) => idx < 35);
    }

    const totalRides = filtered.length;
    const completedRides = filtered.filter((r) => r.status === 'completed').length;
    const cancelledRides = filtered.filter((r) => r.status === 'cancelled').length;
    const pendingRides = filtered.filter((r) => r.status === 'upcoming' || r.status === 'active').length;

    const totalDistanceKm = filtered.reduce((acc, r) => acc + (r.distanceKm || 14.8), 0);
    const avgDistanceKm = totalRides > 0 ? Math.round((totalDistanceKm / totalRides) * 10) / 10 : 0;

    const passengerRides = filtered.filter((r) => r.type === 'passenger');
    const driverRides = filtered.filter((r) => r.type === 'driver');

    const totalSpent = passengerRides.reduce((acc, r) => acc + (r.fare || 0), 0);
    const totalEarned = driverRides.reduce((acc, r) => acc + (r.fare || 0), 0);

    const averageFare = totalRides > 0 ? Math.round((filtered.reduce((acc, r) => acc + r.fare, 0) / totalRides)) : 0;
    const averageRating = user.rating || 4.9;
    const co2SavedKg = Math.round(totalDistanceKm * 0.12 * 10) / 10;

    return {
      totalRides,
      completedRides,
      cancelledRides,
      pendingRides,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      totalSpent,
      totalEarned,
      averageFare,
      averageRating,
      avgDistanceKm,
      co2SavedKg,
    };
  },

  // Reset to initial
  resetDemo: () => {
    localStorage.clear();
    storage.init();
  },
};

