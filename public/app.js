// CARPOOL Enterprise Mobility Platform - Master Standalone Application Bundle
(function () {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

  // --- Initial Mock Data: West Bengal Kolkata Corridors & Tech Hubs ---
  const INITIAL_USERS = [
    {
      id: 'usr-1',
      name: 'Raj Patel',
      email: 'raj.patel@odoo.com',
      mobile: '+91 98765 43210',
      employeeId: 'EMP-1048',
      department: 'Engineering',
      manager: 'A. Shah',
      officeLocation: 'Kolkata Tech Hub (Sector V)',
      role: 'employee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      platformAccess: 'granted',
      status: 'active',
      rating: 4.9,
      totalTrips: 42,
      walletBalance: 1250,
    },
    {
      id: 'usr-2',
      name: 'Krishna Singh',
      email: 'krishna.singh@odoo.com',
      mobile: '+91 98234 56789',
      employeeId: 'EMP-1049',
      department: 'Sales',
      manager: 'R. Mehta',
      officeLocation: 'Kolkata Central (Park Street)',
      role: 'employee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      platformAccess: 'granted',
      status: 'active',
      rating: 4.8,
      totalTrips: 38,
      walletBalance: 820,
    },
    {
      id: 'usr-3',
      name: 'Swapnil Shaw',
      email: 'swapnil.shaw@odoo.com',
      mobile: '+91 97123 45678',
      employeeId: 'EMP-1050',
      department: 'Product',
      manager: 'A. Shah',
      officeLocation: 'New Town Campus (Action Area II)',
      role: 'employee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      platformAccess: 'granted',
      status: 'active',
      rating: 4.95,
      totalTrips: 56,
      walletBalance: 2100,
    },
    {
      id: 'usr-4',
      name: 'Bhavya',
      email: 'bhavya.m@odoo.com',
      mobile: '+91 99887 76655',
      employeeId: 'EMP-1051',
      department: 'Design',
      manager: 'A. Shah',
      officeLocation: 'Kolkata Tech Hub (Sector V)',
      role: 'employee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      platformAccess: 'granted',
      status: 'active',
      rating: 4.85,
      totalTrips: 29,
      walletBalance: 450,
    },
    {
      id: 'usr-admin',
      name: 'Priya Nair (Admin)',
      email: 'admin@odoo.com',
      mobile: '+91 98980 12345',
      employeeId: 'ADM-0001',
      department: 'HR & Mobility Operations',
      manager: 'Executive Board',
      officeLocation: 'New Town Corporate Headquarters',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      platformAccess: 'granted',
      status: 'active',
      rating: 5.0,
      totalTrips: 163,
      walletBalance: 5000,
    },
  ];

  const INITIAL_VEHICLES = [
    {
      id: 'veh-1',
      userId: 'usr-1',
      driverName: 'Raj Patel',
      model: 'Swift Dzire',
      registrationNumber: 'WB02AB1234',
      seatingCapacity: 4,
      vehicleType: 'Sedan',
      fuelType: 'Petrol',
      status: 'approved',
      isDefault: true,
    },
    {
      id: 'veh-2',
      userId: 'usr-2',
      driverName: 'Krishna Singh',
      model: 'Alto 800',
      registrationNumber: 'WB06AB5034',
      seatingCapacity: 3,
      vehicleType: 'Hatchback',
      fuelType: 'Petrol',
      status: 'approved',
      isDefault: true,
    },
    {
      id: 'veh-3',
      userId: 'usr-admin',
      driverName: 'Priya Nair',
      model: 'Innova Crysta',
      registrationNumber: 'WB20CD778',
      seatingCapacity: 6,
      vehicleType: 'SUV',
      fuelType: 'Diesel',
      status: 'inactive',
      isDefault: false,
    },
    {
      id: 'veh-4',
      userId: 'usr-3',
      driverName: 'Swapnil Shaw',
      model: 'Tata Nexon EV',
      registrationNumber: 'WB06EV9921',
      seatingCapacity: 4,
      vehicleType: 'EV',
      fuelType: 'Electric',
      status: 'approved',
      isDefault: true,
    },
    {
      id: 'veh-5',
      userId: 'usr-4',
      driverName: 'Bhavya',
      model: 'Honda City',
      registrationNumber: 'WB02CD7788',
      seatingCapacity: 4,
      vehicleType: 'Sedan',
      fuelType: 'Petrol',
      status: 'approved',
      isDefault: true,
    },
  ];

  const INITIAL_RIDES = [
    {
      id: 'ride-101',
      driverId: 'usr-1',
      driverName: 'Raj Patel',
      driverRating: 4.9,
      driverPhone: '+91 98765 43210',
      driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      vehicleModel: 'Swift Dzire',
      registrationNumber: 'WB02AB1234',
      startLocation: 'Park Street, Kolkata',
      destinationLocation: 'Sector V, Salt Lake, Kolkata',
      startCoords: [22.5510, 88.3524],
      destCoords: [22.5804, 88.4378],
      departureDate: '18/July/26',
      departureTime: '07:00 PM',
      availableSeats: 2,
      totalSeats: 4,
      farePerSeat: 120,
      distanceKm: 14.8,
      estimatedMinutes: 28,
      isRecurring: true,
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      notes: 'AC On, Corporate ID mandatory, Pickups along EM Bypass / Science City allowed',
      status: 'scheduled',
      createdAt: '2026-07-17T10:00:00Z',
    },
    {
      id: 'ride-102',
      driverId: 'usr-2',
      driverName: 'Krishna Singh',
      driverRating: 4.8,
      driverPhone: '+91 98234 56789',
      driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      vehicleModel: 'Alto 800',
      registrationNumber: 'WB06AB5034',
      startLocation: 'Gariahat, Kolkata',
      destinationLocation: 'Sector V, Salt Lake, Kolkata',
      startCoords: [22.5186, 88.3653],
      destCoords: [22.5804, 88.4378],
      departureDate: '18/July/26',
      departureTime: '08:00 PM',
      availableSeats: 2,
      totalSeats: 3,
      farePerSeat: 120,
      distanceKm: 16.2,
      estimatedMinutes: 30,
      isRecurring: true,
      recurringDays: ['Mon', 'Wed', 'Fri'],
      notes: 'Direct express route via EM Bypass, minimal stops',
      status: 'scheduled',
      createdAt: '2026-07-17T11:30:00Z',
    },
    {
      id: 'ride-103',
      driverId: 'usr-3',
      driverName: 'Swapnil Shaw',
      driverRating: 4.95,
      driverPhone: '+91 97123 45678',
      driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      vehicleModel: 'Tata Nexon EV',
      registrationNumber: 'WB06EV9921',
      startLocation: 'Howrah Station, Kolkata',
      destinationLocation: 'New Town Eco Space, Kolkata',
      startCoords: [22.5958, 88.2636],
      destCoords: [22.5851, 88.4807],
      departureDate: '19/July/26',
      departureTime: '08:30 AM',
      availableSeats: 3,
      totalSeats: 4,
      farePerSeat: 150,
      distanceKm: 21.5,
      estimatedMinutes: 40,
      isRecurring: true,
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      notes: 'Zero emission green commute! Quiet ride, Wi-Fi hotspot available',
      status: 'scheduled',
      createdAt: '2026-07-17T14:00:00Z',
    },
    {
      id: 'ride-104',
      driverId: 'usr-4',
      driverName: 'Bhavya',
      driverRating: 4.85,
      driverPhone: '+91 99887 76655',
      driverAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      vehicleModel: 'Honda City',
      registrationNumber: 'WB02CD7788',
      startLocation: 'Shyambazar, Kolkata',
      destinationLocation: 'Sector V, Salt Lake, Kolkata',
      startCoords: [22.6030, 88.3713],
      destCoords: [22.5804, 88.4378],
      departureDate: '19/July/26',
      departureTime: '09:00 AM',
      availableSeats: 2,
      totalSeats: 4,
      farePerSeat: 110,
      distanceKm: 12.8,
      estimatedMinutes: 24,
      isRecurring: false,
      notes: 'Friendly music playlist, comfortable sedan',
      status: 'scheduled',
      createdAt: '2026-07-17T16:00:00Z',
    },
  ];

  const INITIAL_TRIPS = [
    {
      id: 'trip-active-1',
      rideId: 'ride-101',
      driverId: 'usr-1',
      driverName: 'Raj Patel',
      driverPhone: '+91 98765 43210',
      driverRating: 4.9,
      vehicleModel: 'Swift Dzire',
      registrationNumber: 'WB02AB1234',
      startLocation: 'Park Street',
      destinationLocation: 'Sector V, Salt Lake',
      startCoords: [22.5510, 88.3524],
      destCoords: [22.5804, 88.4378],
      date: '18/July/26',
      time: '07:00 PM',
      fare: 120,
      seatNumber: 'Seat 1',
      seatsBooked: 1,
      status: 'active',
      paymentStatus: 'pending',
      paymentMethod: 'UPI',
      currentLocation: [22.5690, 88.4050],
      etaMinutes: 6,
      distanceRemainingKm: 3.8,
      passengers: [
        {
          passengerId: 'usr-2',
          passengerName: 'Krishna Singh',
          passengerPhone: '+91 98234 56789',
          seatsBooked: 1,
          pickupLocation: 'Park Street',
          dropLocation: 'Sector V',
          farePaid: 120,
          paymentStatus: 'pending',
        }
      ]
    },
    {
      id: 'trip-hist-1',
      rideId: 'ride-hist-1',
      driverId: 'usr-1',
      driverName: 'Raj Patel',
      driverPhone: '+91 98765 43210',
      driverRating: 4.9,
      vehicleModel: 'Swift Dzire',
      registrationNumber: 'WB02AB1234',
      startLocation: 'Park Street to Sector V',
      destinationLocation: 'Sector V, Salt Lake',
      startCoords: [22.5510, 88.3524],
      destCoords: [22.5804, 88.4378],
      date: '18/July/26',
      time: '07:00 PM',
      fare: 120,
      seatNumber: 'Seat 2',
      seatsBooked: 1,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
    },
    {
      id: 'trip-hist-2',
      rideId: 'ride-hist-2',
      driverId: 'usr-2',
      driverName: 'Krishna Singh',
      driverPhone: '+91 98234 56789',
      driverRating: 4.8,
      vehicleModel: 'Alto 800',
      registrationNumber: 'WB06AB5034',
      startLocation: 'Gariahat to Sector V',
      destinationLocation: 'Sector V, Salt Lake',
      startCoords: [22.5186, 88.3653],
      destCoords: [22.5804, 88.4378],
      date: '19/July/26',
      time: '09:00 PM',
      fare: 120,
      seatNumber: 'Seat 1',
      seatsBooked: 1,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'Wallet',
    },
  ];

  const INITIAL_TRANSACTIONS = [
    {
      id: 'tx-1001',
      userId: 'usr-1',
      type: 'credit',
      amount: 500,
      description: 'Wallet Top-up via UPI (raj@okaxis)',
      timestamp: '18 Jul 2026, 04:15 PM',
      paymentMethod: 'UPI',
      status: 'success',
      referenceId: 'UPI-9848102394',
    },
    {
      id: 'tx-1002',
      userId: 'usr-1',
      type: 'debit',
      amount: 120,
      description: 'Fare payment for Trip to Salt Lake Sector V',
      timestamp: '18 Jul 2026, 07:45 PM',
      paymentMethod: 'Wallet',
      status: 'success',
      referenceId: 'RIDE-PAY-101',
    },
    {
      id: 'tx-1003',
      userId: 'usr-1',
      type: 'credit',
      amount: 1000,
      description: 'Monthly Kolkata Corporate Mobility Allowance',
      timestamp: '01 Jul 2026, 09:00 AM',
      paymentMethod: 'NetBanking',
      status: 'success',
      referenceId: 'CORP-ALLOW-771',
    },
  ];

  const INITIAL_PAYMENT_METHODS = [
    {
      id: 'pm-1',
      userId: 'usr-1',
      type: 'UPI',
      title: 'UPI Payment',
      details: 'raj@okaxis',
      isDefault: true,
    },
    {
      id: 'pm-2',
      userId: 'usr-1',
      type: 'Card',
      title: 'HDFC Corporate Credit Card',
      details: '•••• 4892 (Exp 09/29)',
      isDefault: false,
    },
    {
      id: 'pm-3',
      userId: 'usr-1',
      type: 'Wallet',
      title: 'Carpool Corporate Wallet',
      details: 'Available Balance: ₹1,250',
      isDefault: false,
    },
    {
      id: 'pm-4',
      userId: 'usr-1',
      type: 'Cash',
      title: 'Cash Payment',
      details: 'Pay directly to driver',
      isDefault: false,
    },
  ];

  const INITIAL_COMPANY_SETTINGS = {
    companyName: 'Odoo Pvt. Ltd.',
    registeredAddress: 'Sector V, Salt Lake, Kolkata, West Bengal - 700091, India',
    industry: 'Enterprise Software & Cloud Mobility',
    adminContact: 'admin@odoo.com',
    totalEmployees: 48,
    fuelCostPerLiter: 106.03,
    costPerKm: 8.50,
    travelCostOperational: 2.50,
    defaultCarpoolingPolicy: 'Mandatory ID verification, min 2 passengers per pooled trip, full CO2 reduction credits to employee sustainability score.',
    maxSeatsPerRide: 6,
    autoApproveVehicles: true,
  };

  const INITIAL_SAVED_PLACES = [
    {
      id: 'sp-1',
      userId: 'usr-1',
      label: 'Home',
      address: 'Park Street, Kolkata - 700016',
      coords: [22.5510, 88.3524],
    },
    {
      id: 'sp-2',
      userId: 'usr-1',
      label: 'Office',
      address: 'Sector V Tech Tower, Salt Lake, Kolkata - 700091',
      coords: [22.5804, 88.4378],
    },
    {
      id: 'sp-3',
      userId: 'usr-1',
      label: 'Gym',
      address: 'Gariahat Club, Kolkata - 700019',
      coords: [22.5186, 88.3653],
    },
  ];

  const INITIAL_MONTHLY_SUMMARY = [
    { month: 'Jan', revenue: 170000, fuelCost: 60000, maintenance: 20000, netProfit: 90000, ridesCount: 142, co2SavedKg: 1850 },
    { month: 'Feb', revenue: 185000, fuelCost: 62000, maintenance: 18000, netProfit: 105000, ridesCount: 155, co2SavedKg: 2010 },
    { month: 'Mar', revenue: 210000, fuelCost: 71000, maintenance: 22000, netProfit: 117000, ridesCount: 178, co2SavedKg: 2320 },
    { month: 'Apr', revenue: 195000, fuelCost: 68000, maintenance: 21000, netProfit: 106000, ridesCount: 164, co2SavedKg: 2150 },
    { month: 'May', revenue: 230000, fuelCost: 75000, maintenance: 24000, netProfit: 131000, ridesCount: 192, co2SavedKg: 2580 },
    { month: 'Jun', revenue: 245000, fuelCost: 78000, maintenance: 23000, netProfit: 144000, ridesCount: 205, co2SavedKg: 2790 },
    { month: 'Jul', revenue: 260000, fuelCost: 82000, maintenance: 25000, netProfit: 153000, ridesCount: 218, co2SavedKg: 2940 },
  ];


  // --- LocalStorage Store ---
  const store = {
    get(k, def) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : def;
      } catch (e) {
        return def;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
        window.dispatchEvent(new CustomEvent('carpool_store_event', { detail: { key: k } }));
      } catch (e) {}
    },
    init() {
      if (!localStorage.getItem('cp_users')) store.set('cp_users', INITIAL_USERS);
      if (!localStorage.getItem('cp_vehicles')) store.set('cp_vehicles', INITIAL_VEHICLES);
      if (!localStorage.getItem('cp_rides')) store.set('cp_rides', INITIAL_RIDES);
      if (!localStorage.getItem('cp_trips')) store.set('cp_trips', INITIAL_TRIPS);
      if (!localStorage.getItem('cp_txs')) store.set('cp_txs', INITIAL_TRANSACTIONS);
      if (!localStorage.getItem('cp_pms')) store.set('cp_pms', INITIAL_PAYMENT_METHODS);
      if (!localStorage.getItem('cp_settings')) store.set('cp_settings', INITIAL_COMPANY_SETTINGS);
      if (!localStorage.getItem('cp_summary')) store.set('cp_summary', INITIAL_MONTHLY_SUMMARY);
      if (!localStorage.getItem('cp_cur_user')) store.set('cp_cur_user', INITIAL_USERS[0]);
    },
    getCurrentUser() {
      return store.get('cp_cur_user', INITIAL_USERS[0]);
    },
    setCurrentUser(u) {
      store.set('cp_cur_user', u);
    },
    getUsers() {
      return store.get('cp_users', INITIAL_USERS);
    },
    setUsers(arr) {
      store.set('cp_users', arr);
    },
    getVehicles() {
      return store.get('cp_vehicles', INITIAL_VEHICLES);
    },
    setVehicles(arr) {
      store.set('cp_vehicles', arr);
    },
    getRides() {
      return store.get('cp_rides', INITIAL_RIDES);
    },
    setRides(arr) {
      store.set('cp_rides', arr);
    },
    getTrips() {
      return store.get('cp_trips', INITIAL_TRIPS);
    },
    setTrips(arr) {
      store.set('cp_trips', arr);
    },
    getTxs() {
      return store.get('cp_txs', INITIAL_TRANSACTIONS);
    },
    setTxs(arr) {
      store.set('cp_txs', arr);
    },
    getSettings() {
      return store.get('cp_settings', INITIAL_COMPANY_SETTINGS);
    },
    setSettings(s) {
      store.set('cp_settings', s);
    },
    getSummary() {
      return store.get('cp_summary', INITIAL_MONTHLY_SUMMARY);
    },
    getTheme() {
      return localStorage.getItem('carpool_theme') || 'dark';
    },
    setTheme(t) {
      localStorage.setItem('carpool_theme', t);
      if (t === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      }
      window.dispatchEvent(new CustomEvent('carpool_store_event', { detail: { key: 'carpool_theme', theme: t } }));
    },
  };

  store.init();


  // --- SVG Icons Helper ---
  function Icon({ name, className = 'w-4 h-4' }) {
    const icons = {
      car: React.createElement('path', { d: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.4V16c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' }),
      search: React.createElement('path', { d: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z' }),
      calendar: React.createElement('path', { d: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' }),
      plus: React.createElement('path', { d: 'M12 5v14M5 12h14' }),
      clock: React.createElement('path', { d: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z' }),
      wallet: React.createElement('path', { d: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4' }),
      creditcard: React.createElement('path', { d: 'M2 7h20M2 11h20M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' }),
      settings: React.createElement('path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' }),
      chart: React.createElement('path', { d: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3' }),
      history: React.createElement('path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5M12 7v5l4 2' }),
      bell: React.createElement('path', { d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0' }),
      user: React.createElement('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' }),
      users: React.createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' }),
      shield: React.createElement('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }),
      navigation: React.createElement('path', { d: 'm3 11 19-9-9 19-2-8-8-2z' }),
      pin: React.createElement('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' }),
      star: React.createElement('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }),
      arrowRight: React.createElement('path', { d: 'M5 12h14M12 5l7 7-7 7' }),
      arrowUpDown: React.createElement('path', { d: 'm21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16' }),
      phone: React.createElement('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' }),
      message: React.createElement('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }),
      check: React.createElement('path', { d: 'M20 6 9 17l-5-5' }),
      x: React.createElement('path', { d: 'M18 6 6 18M6 6l12 12' }),
      trash: React.createElement('path', { d: 'M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
      edit: React.createElement('path', { d: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' }),
      sparkles: React.createElement('path', { d: 'm12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z' }),
      leaf: React.createElement('path', { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' }),
      qr: React.createElement('path', { d: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM14 15h2v2h-2zM18 15h3v3h-3zM14 19h3v2h-3zM19 19h2v2h-2z' }),
    };

    return React.createElement(
      'svg',
      {
        className: className,
        fill: name === 'star' ? 'currentColor' : 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        viewBox: '0 0 24 24',
      },
      icons[name] || icons.car
    );
  }

  // --- Toast Manager ---
  let toastFn = null;
  function showToast(title, msg, type = 'success') {
    if (toastFn) toastFn({ title, msg, type, id: Date.now() });
  }

  window.CARPOOL = { store, showToast };

  console.log('CARPOOL Core Initialized');
})();
