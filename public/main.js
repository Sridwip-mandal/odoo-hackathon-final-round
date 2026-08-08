// CARPOOL Enterprise Mobility Platform - Master Application
// Full Interactive Admin Employee & Vehicle Management, Dynamic Kolkata Geolocation & Dual Theme
(function () {
  'use strict';

  const React = window.React || (window.React = {});
  const ReactDOM = window.ReactDOM || (window.ReactDOM = {});
  const { useState, useEffect, useRef } = React;

  // Safe global store fallback
  const CARPOOL = window.CARPOOL || (window.CARPOOL = {});
  const store = CARPOOL.store || (CARPOOL.store = {
    getCurrentUser: () => {
      try {
        const u = localStorage.getItem('carpool_user');
        if (u) return JSON.parse(u);
      } catch (e) {}
      return {
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
        walletBalance: 1850,
      };
    },
    setCurrentUser: (u) => {
      try { localStorage.setItem('carpool_user', JSON.stringify(u)); } catch (e) {}
    },
    getUsers: () => {
      try {
        const u = localStorage.getItem('carpool_users');
        if (u) return JSON.parse(u);
      } catch (e) {}
      return [
        { id: 'usr-1', name: 'Raj Patel', email: 'raj.patel@odoo.com', department: 'Engineering', officeLocation: 'Kolkata Tech Hub (Sector V)', role: 'employee', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', platformAccess: 'granted', rating: 4.9, walletBalance: 1850, totalTrips: 42 },
        { id: 'usr-2', name: 'Krishna Singh', email: 'krishna.singh@odoo.com', department: 'Sales', officeLocation: 'Kolkata Central (Park Street)', role: 'employee', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', platformAccess: 'granted', rating: 4.8, walletBalance: 820, totalTrips: 38 },
        { id: 'usr-3', name: 'Swapnil Shaw', email: 'swapnil.shaw@odoo.com', department: 'Engineering', officeLocation: 'New Town Campus (Action Area II)', role: 'admin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', platformAccess: 'granted', rating: 5.0, walletBalance: 2450, totalTrips: 56 },
      ];
    },
    setUsers: (u) => {
      try { localStorage.setItem('carpool_users', JSON.stringify(u)); } catch (e) {}
    },
    getVehicles: () => {
      try {
        const v = localStorage.getItem('carpool_vehicles');
        if (v) return JSON.parse(v);
      } catch (e) {}
      return [
        { id: 'veh-1', model: 'Honda City i-VTEC', registrationNumber: 'WB02AB1234', driverName: 'Raj Patel', seatingCapacity: 4, fuelType: 'Petrol', status: 'approved', vehicleType: 'Sedan', color: 'Pearl White' },
        { id: 'veh-2', model: 'Tata Nexon EV Max', registrationNumber: 'WB06CD5678', driverName: 'Krishna Singh', seatingCapacity: 4, fuelType: 'Electric', status: 'approved', vehicleType: 'EV', color: 'Teal Blue' },
        { id: 'veh-3', model: 'Hyundai Creta SX', registrationNumber: 'WB20EF9012', driverName: 'Swapnil Shaw', seatingCapacity: 5, fuelType: 'Diesel', status: 'approved', vehicleType: 'SUV', color: 'Phantom Black' },
      ];
    },
    setVehicles: (v) => {
      try { localStorage.setItem('carpool_vehicles', JSON.stringify(v)); } catch (e) {}
    },
    getRides: () => {
      try {
        const r = localStorage.getItem('carpool_rides');
        if (r) return JSON.parse(r);
      } catch (e) {}
      return [
        { id: 'ride-1', driverName: 'Raj Patel', driverPhone: '+91 98765 43210', driverRating: 4.9, driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', vehicleModel: 'Honda City', registrationNumber: 'WB02AB1234', startLocation: 'Park Street, Kolkata', destinationLocation: 'Sector V, Salt Lake, Kolkata', departureDate: 'Today', departureTime: '08:30 AM', farePerSeat: 45, availableSeats: 3, status: 'active', recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        { id: 'ride-2', driverName: 'Krishna Singh', driverPhone: '+91 98234 56789', driverRating: 4.8, driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', vehicleModel: 'Tata Nexon EV', registrationNumber: 'WB06CD5678', startLocation: 'Howrah Station, Kolkata', destinationLocation: 'New Town Eco Space, Kolkata', departureDate: 'Today', departureTime: '09:00 AM', farePerSeat: 50, availableSeats: 2, status: 'upcoming', recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      ];
    },
    setRides: (r) => {
      try { localStorage.setItem('carpool_rides', JSON.stringify(r)); } catch (e) {}
    },
    getTrips: () => {
      try {
        const t = localStorage.getItem('carpool_trips');
        if (t) return JSON.parse(t);
      } catch (e) {}
      return [
        { id: 'trip-1', rideId: 'ride-1', driverName: 'Raj Patel', driverPhone: '+91 98765 43210', driverRating: 4.9, vehicleModel: 'Honda City', registrationNumber: 'WB02AB1234', startLocation: 'Park Street, Kolkata', destinationLocation: 'Sector V, Salt Lake, Kolkata', date: 'Today', time: '08:30 AM', fare: 45, seatNumber: 'Seat 1', status: 'upcoming', paymentStatus: 'paid' },
        { id: 'trip-2', rideId: 'ride-2', driverName: 'Krishna Singh', driverPhone: '+91 98234 56789', driverRating: 4.8, vehicleModel: 'Tata Nexon EV', registrationNumber: 'WB06CD5678', startLocation: 'Howrah Station, Kolkata', destinationLocation: 'New Town Eco Space, Kolkata', date: 'Yesterday', time: '09:00 AM', fare: 50, seatNumber: 'Seat 2', status: 'completed', paymentStatus: 'paid' },
      ];
    },
    setTrips: (t) => {
      try { localStorage.setItem('carpool_trips', JSON.stringify(t)); } catch (e) {}
    },
    getTxs: () => {
      try {
        const x = localStorage.getItem('carpool_transactions');
        if (x) return JSON.parse(x);
      } catch (e) {}
      return [
        { id: 'tx-1', type: 'credit', amount: 500, description: 'Razorpay Online Wallet Top-up (Payment ID: pay_init100)', timestamp: 'Today, 10:30 AM', paymentMethod: 'UPI', status: 'success', referenceId: 'REF-TOPUP100' },
        { id: 'tx-2', type: 'debit', amount: 45, description: 'Carpool Fare: Park Street → Sector V Salt Lake', timestamp: 'Yesterday, 06:15 PM', paymentMethod: 'Wallet', status: 'success', referenceId: 'BK-TRIP45' },
      ];
    },
    setTxs: (x) => {
      try { localStorage.setItem('carpool_transactions', JSON.stringify(x)); } catch (e) {}
    },
    getSettings: () => {
      try {
        const s = localStorage.getItem('carpool_settings');
        if (s) return JSON.parse(s);
      } catch (e) {}
      return { companyName: 'Odoo Pvt. Ltd. (Kolkata)', fuelCostPerLiter: 106.03, costPerKm: 8.50, operationalCostPerKm: 2.50 };
    },
    setSettings: (s) => {
      try { localStorage.setItem('carpool_settings', JSON.stringify(s)); } catch (e) {}
    },
    getPaymentMethods: () => {
      try {
        const m = localStorage.getItem('carpool_payment_methods');
        if (m) return JSON.parse(m);
      } catch (e) {}
      return [
        { id: 'pm-1', type: 'UPI', title: 'Corporate UPI Handle', details: 'raj@okaxis', upiId: 'raj@okaxis', isDefault: true, isVerified: true },
        { id: 'pm-2', type: 'Card', title: 'HDFC Corporate Visa Card', details: '•••• •••• •••• 4892', cardLast4: '4892', cardBrand: 'Visa', cardExpiry: '09/29', isDefault: false, isVerified: true },
        { id: 'pm-3', type: 'Wallet', title: 'Carpool Corporate Wallet', details: 'Pre-loaded Commute Balance', isDefault: false, isVerified: true },
        { id: 'pm-4', type: 'NetBanking', title: 'State Bank of India', details: 'Corporate Net Banking (•••• 9102)', bankName: 'State Bank of India', isDefault: false, isVerified: true },
      ];
    },
    setPaymentMethods: (m) => {
      try { localStorage.setItem('carpool_payment_methods', JSON.stringify(m)); } catch (e) {}
    },
    getFeedback: () => {
      try {
        const f = localStorage.getItem('carpool_feedback');
        if (f) return JSON.parse(f);
      } catch (e) {}
      return [
        { id: 'fb-1', userName: 'Raj Patel', userEmail: 'raj.patel@odoo.com', category: 'Ride Experience', rating: 5, message: 'Great corporate carpooling system! The Sector V route matching was very smooth.', createdAt: '2026-07-28T09:30:00Z' },
        { id: 'fb-2', userName: 'Krishna Singh', userEmail: 'krishna.singh@odoo.com', category: 'Payment', rating: 5, message: 'Instant UPI auto-credit and wallet top-up worked perfectly.', createdAt: '2026-08-01T14:15:00Z' },
      ];
    },
    setFeedback: (f) => {
      try { localStorage.setItem('carpool_feedback', JSON.stringify(f)); } catch (e) {}
    },
    addFeedback: (item) => {
      const list = store.getFeedback();
      list.unshift(item);
      store.setFeedback(list);
      try { fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }).catch(() => {}); } catch (e) {}
    },
    getTickets: () => {
      try {
        const t = localStorage.getItem('carpool_tickets');
        if (t) return JSON.parse(t);
      } catch (e) {}
      return [
        {
          id: 'tkt-1',
          ticketNumber: 'CK-10245',
          userId: 'usr-1',
          userName: 'Raj Patel',
          userEmail: 'raj.patel@odoo.com',
          subject: 'Request for New Town Action Area II Pickup Landmark',
          category: 'Ride Issues',
          description: 'Could we add a designated carpool pickup point near New Town Eco Space Gate 3?',
          priority: 'Medium',
          status: 'IN PROGRESS',
          createdAt: '2026-08-02T10:00:00Z',
          updatedAt: '2026-08-03T11:30:00Z',
          replies: [
            { id: 'rep-1', ticketId: 'tkt-1', senderName: 'Raj Patel', senderRole: 'employee', message: 'Could we add a designated carpool pickup point near New Town Eco Space Gate 3?', createdAt: '2026-08-02T10:00:00Z' },
            { id: 'rep-2', ticketId: 'tkt-1', senderName: 'Mobility Support Desk', senderRole: 'admin', message: 'Hello Raj, we have forwarded this to our Kolkata Transport Ops team to verify.', createdAt: '2026-08-03T11:30:00Z' }
          ]
        },
        {
          id: 'tkt-2',
          ticketNumber: 'CK-10246',
          userId: 'usr-1',
          userName: 'Raj Patel',
          userEmail: 'raj.patel@odoo.com',
          subject: 'Corporate Fuel Allowance Reconciliation',
          category: 'Payment Issues',
          description: 'Inquired about monthly GST invoice generation for Sector V rides.',
          priority: 'Low',
          status: 'RESOLVED',
          createdAt: '2026-07-29T16:00:00Z',
          updatedAt: '2026-07-30T12:00:00Z',
          replies: [
            { id: 'rep-3', ticketId: 'tkt-2', senderName: 'Raj Patel', senderRole: 'employee', message: 'Inquired about monthly GST invoice generation for Sector V rides.', createdAt: '2026-07-29T16:00:00Z' },
            { id: 'rep-4', ticketId: 'tkt-2', senderName: 'Finance Helpdesk', senderRole: 'admin', message: 'Invoices are available directly under the Wallet and Ride History page by clicking Receipt.', createdAt: '2026-07-30T12:00:00Z' }
          ]
        }
      ];
    },
    setTickets: (t) => {
      try { localStorage.setItem('carpool_tickets', JSON.stringify(t)); } catch (e) {}
    },
    addTicket: (t) => {
      const list = store.getTickets();
      list.unshift(t);
      store.setTickets(list);
      try { fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) }).catch(() => {}); } catch (e) {}
    },
    updateTicket: (updated) => {
      const list = store.getTickets().map((t) => (t.id === updated.id ? updated : t));
      store.setTickets(list);
    },
    addTicketReply: (ticketId, reply) => {
      const list = store.getTickets().map((t) => {
        if (t.id === ticketId) {
          const reps = t.replies || [];
          return { ...t, replies: [...reps, reply], updatedAt: new Date().toISOString() };
        }
        return t;
      });
      store.setTickets(list);
      try { fetch(`/api/tickets/${ticketId}/replies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reply) }).catch(() => {}); } catch (e) {}
    },
    getUserRideHistory: (userId) => {
      const uId = userId || store.getCurrentUser().id;
      const allTrips = store.getTrips();
      const allRides = store.getRides();

      const passengerTrips = allTrips.map((t) => ({
        id: t.id,
        rideId: t.rideId,
        type: 'passenger',
        driverName: t.driverName,
        driverPhone: t.driverPhone,
        driverRating: t.driverRating,
        driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        riderName: store.getCurrentUser().name,
        riderId: uId,
        startLocation: t.startLocation,
        destinationLocation: t.destinationLocation,
        vehicleModel: t.vehicleModel,
        registrationNumber: t.registrationNumber,
        date: t.date,
        time: t.time,
        fare: t.fare,
        seats: t.seatNumber ? 1 : 1,
        status: t.status,
        paymentStatus: t.paymentStatus || 'paid',
        paymentMethod: t.paymentMethod || 'UPI',
        distanceKm: 14.8,
        bookingDate: t.date,
        rating: 5.0,
      }));

      const driverRides = allRides
        .filter((r) => r.driverName === store.getCurrentUser().name || r.driverId === uId)
        .map((r) => ({
          id: r.id,
          rideId: r.id,
          type: 'driver',
          driverName: r.driverName,
          driverPhone: r.driverPhone,
          driverRating: r.driverRating,
          driverAvatar: r.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          riderName: 'Corporate Staff (2 Pooled)',
          riderId: 'pool-staff',
          startLocation: r.startLocation,
          destinationLocation: r.destinationLocation,
          vehicleModel: r.vehicleModel,
          registrationNumber: r.registrationNumber,
          date: r.departureDate,
          time: r.departureTime,
          fare: r.farePerSeat * 2,
          seats: 2,
          status: r.status === 'scheduled' ? 'upcoming' : r.status,
          paymentStatus: 'paid',
          paymentMethod: 'Wallet Credit',
          distanceKm: 16.5,
          bookingDate: r.departureDate,
          rating: r.driverRating || 4.9,
        }));

      const combined = [...passengerTrips, ...driverRides];
      const map = new Map();
      combined.forEach((item) => {
        if (!map.has(item.id)) map.set(item.id, item);
      });
      return Array.from(map.values());
    },
    calculateUserAnalytics: (userId, range = 'all') => {
      const history = store.getUserRideHistory(userId);
      const user = store.getCurrentUser();

      let filtered = history;
      if (range === '7d') filtered = history.filter((_, i) => i < 2 || i % 2 === 0);
      else if (range === '30d') filtered = history.filter((_, i) => i < 6);
      else if (range === '3m') filtered = history.filter((_, i) => i < 15);
      else if (range === '6m') filtered = history.filter((_, i) => i < 25);

      const totalRides = filtered.length;
      const completedRides = filtered.filter((r) => r.status === 'completed').length;
      const cancelledRides = filtered.filter((r) => r.status === 'cancelled').length;
      const pendingRides = filtered.filter((r) => r.status === 'upcoming' || r.status === 'active' || r.status === 'scheduled').length;
      const totalDistanceKm = filtered.reduce((acc, r) => acc + (r.distanceKm || 14.8), 0);
      const avgDistanceKm = totalRides > 0 ? Math.round((totalDistanceKm / totalRides) * 10) / 10 : 0;
      const passengerRides = filtered.filter((r) => r.type === 'passenger');
      const driverRides = filtered.filter((r) => r.type === 'driver');
      const totalSpent = passengerRides.reduce((acc, r) => acc + (r.fare || 0), 0);
      const totalEarned = driverRides.reduce((acc, r) => acc + (r.fare || 0), 0);
      const averageFare = totalRides > 0 ? Math.round(filtered.reduce((acc, r) => acc + r.fare, 0) / totalRides) : 0;
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
  });

  const COMPONENTS = window.CARPOOL_COMPONENTS || (window.CARPOOL_COMPONENTS = {});
  const MapView = COMPONENTS.MapView || function ({ startName, destName, height = '320px' }) {
    const mapRef = useRef(null);
    useEffect(() => {
      if (!mapRef.current || !window.L) return;
      try {
        const map = window.L.map(mapRef.current).setView([22.5726, 88.3639], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        window.L.marker([22.5510, 88.3524]).addTo(map).bindPopup('Park Street, Kolkata');
        window.L.marker([22.5800, 88.4370]).addTo(map).bindPopup('Sector V, Salt Lake, Kolkata');
        return () => map.remove();
      } catch (e) {}
    }, []);
    return React.createElement('div', { ref: mapRef, style: { height, width: '100%' }, className: 'rounded-2xl overflow-hidden' });
  };
  const FuelTrendSvg = COMPONENTS.FuelTrendSvg || function () { return React.createElement('div', { className: 'h-32 flex items-center justify-center text-slate-500 font-mono text-xs' }, '📊 ESG Fleet Fuel Trend: -18.4% Net Emissions'); };
  const CostliestVehiclesSvg = COMPONENTS.CostliestVehiclesSvg || function () { return React.createElement('div', { className: 'h-32 flex items-center justify-center text-slate-500 font-mono text-xs' }, '🚗 Fleet Utilization: 94.2% Shared Commute Efficiency'); };
  const Icon = COMPONENTS.Icon || function ({ name, className = 'w-4 h-4' }) {
    const svgs = {
      car: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.4V16c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',
      calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      plus: 'M12 5v14M5 12h14',
      clock: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
      wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1 M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
      creditcard: 'M2 7h20M2 11h20M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      chart: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
      history: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5M12 7v5l4 2',
      bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
      user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      navigation: 'm3 11 19-9-9 19-2-8-8-2z',
      arrowRight: 'M5 12h14M12 5l7 7-7 7',
      arrowUpDown: 'm21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16',
      qrcode: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM14 15h2v2h-2zM18 15h3v3h-3zM14 19h3v2h-3zM19 19h2v2h-2z',
      banknote: 'M2 6h20v12H2z M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M6 12h.01 M18 12h.01',
      building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
      trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
      star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      copy: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2 M16 4h2a2 2 0 0 1 2 2v4 M21 14H11a2 2 0 0 0-2 2v6h12v-8z',
      check: 'M20 6L9 17l-5-5',
      lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4',
      externalLink: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3',
      alertTriangle: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
      help: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
      message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
      mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
      fileText: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
      download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
      chevronDown: 'M6 9l6 6 6-6',
      chevronUp: 'M18 15l-6-6-6 6',
      pieChart: 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z',
      activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
      compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
      leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
      sparkles: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z',
      receipt: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z M14 8H8 M16 12H8 M13 16H8',
      eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
    };
    return React.createElement(
      'svg',
      { className, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' },
      React.createElement('path', { d: svgs[name] || svgs.car })
    );
  };
  const DynamicQrCode = COMPONENTS.DynamicQrCode || function () { return React.createElement('div', { className: 'w-32 h-32 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center font-mono text-xs' }, 'QR'); };
  const ToastProvider = COMPONENTS.ToastProvider || function ({ children }) {
    return React.createElement(React.Fragment, null, children);
  };
  const useToast = COMPONENTS.useToast || function () {
    return {
      show: (title, msg, type = 'success') => {
        const toastEl = document.createElement('div');
        toastEl.className = `fixed bottom-5 right-5 z-[999999] px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold animate-fade-in ${
          type === 'error' ? 'bg-rose-900 border-rose-500 text-white' : 'bg-slate-900 border-slate-700 text-white'
        }`;
        toastEl.innerHTML = `<div class="font-bold">${title}</div><div class="text-[11px] opacity-80 mt-0.5">${msg}</div>`;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3500);
      },
    };
  };

  // --- Router State Hook ---
  function useHashRouter() {
    const [route, setRoute] = useState(() => window.location.hash.replace(/^#/, '') || '/');

    useEffect(() => {
      const handleHashChange = () => {
        const h = window.location.hash.replace(/^#/, '') || '/';
        setRoute(h);
      };
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (path) => {
      window.location.hash = path;
      setRoute(path);
      window.scrollTo(0, 0);
    };

    return { route, navigate };
  }

  // --- Reusable StatCard with Dynamic Light & Dark Theme Support ---
  function StatCard({ title, value, subtitle, iconName, colorScheme = 'blue', trend, onClick, isLight = false }) {
    const darkColors = {
      blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-400',
      cyan: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400',
      purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/20 text-purple-400',
      emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400',
      yellow: 'from-yellow-600/20 to-yellow-900/10 border-yellow-500/20 text-yellow-400',
    };

    const lightColors = {
      blue: 'bg-white border-slate-200 text-slate-900 shadow-lg hover:border-yellow-400',
      cyan: 'bg-white border-slate-200 text-slate-900 shadow-lg hover:border-yellow-400',
      purple: 'bg-white border-slate-200 text-slate-900 shadow-lg hover:border-yellow-400',
      emerald: 'bg-white border-slate-200 text-slate-900 shadow-lg hover:border-yellow-400',
      yellow: 'bg-white border-yellow-300 text-slate-900 shadow-lg hover:border-yellow-500 ring-1 ring-yellow-400/30',
    };

    const lightIconBg = {
      blue: 'bg-yellow-400/20 text-yellow-800 border-yellow-300',
      cyan: 'bg-slate-100 text-slate-800 border-slate-200',
      purple: 'bg-slate-100 text-slate-800 border-slate-200',
      emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      yellow: 'bg-yellow-400 text-black border-yellow-500',
    };

    return React.createElement(
      'div',
      {
        onClick,
        className: `group relative overflow-hidden rounded-3xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isLight ? lightColors[colorScheme] : `bg-gradient-to-b ${darkColors[colorScheme]} backdrop-blur-xl`
        } ${onClick ? 'cursor-pointer' : ''}`,
      },
      React.createElement(
        'div',
        { className: 'flex items-start justify-between' },
        React.createElement(
          'div',
          null,
          React.createElement('p', { className: `text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}` }, title),
          React.createElement('h3', { className: `mt-2 text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${isLight ? 'text-black' : 'text-white'}` }, value)
        ),
        React.createElement(
          'div',
          { className: `p-3 rounded-2xl border ${isLight ? lightIconBg[colorScheme] : 'bg-slate-900 border-slate-800 text-cyan-400 shadow-inner'}` },
          React.createElement(Icon, { name: iconName, className: 'w-5 h-5' })
        )
      ),
      (trend || subtitle) &&
        React.createElement(
          'div',
          { className: `mt-4 flex items-center justify-between text-xs pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}` },
          trend &&
            React.createElement(
              'span',
              { className: `${isLight ? 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200' : 'text-emerald-400 font-semibold'} flex items-center gap-1` },
              React.createElement(Icon, { name: 'leaf', className: 'w-3 h-3' }),
              trend
            ),
          subtitle && React.createElement('span', { className: `truncate ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}` }, subtitle)
        )
    );
  }

  // --- Master App Container with Dual Theme & Admin Management ---
  function MainApp() {
    const { route, navigate } = useHashRouter();

    // Theme Management (Dark & Light)
    const [theme, setTheme] = useState(() => {
      if (store.getTheme) return store.getTheme();
      try {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem('carpool_theme') || 'dark';
        }
      } catch (e) {}
      return 'dark';
    });

    const isLight = theme === 'light';

    // State Variables
    const [currentUser, setCurrentUser] = useState(() => store.getCurrentUser());
    const [users, setUsers] = useState(() => store.getUsers());
    const [vehicles, setVehicles] = useState(() => store.getVehicles());
    const [rides, setRides] = useState(() => store.getRides());
    const [trips, setTrips] = useState(() => store.getTrips());
    const [txs, setTxs] = useState(() => store.getTxs());
    const [settings, setSettings] = useState(() => store.getSettings());

    // Interactive Dynamic Route Search State for Kolkata GPS
    const [startLocation, setStartLocation] = useState('Park Street, Kolkata');
    const [destLocation, setDestLocation] = useState('Sector V, Salt Lake, Kolkata');

    // Search and Filter states
    const [empSearch, setEmpSearch] = useState('');
    const [vehSearch, setVehSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('all');
    const [filterType, setFilterType] = useState('all');

    // Global Modal States
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showRecharge, setShowRecharge] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentTrip, setPaymentTrip] = useState(null);
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [showAddEmp, setShowAddEmp] = useState(false);

    // Payment Methods Management State
    const [paymentMethods, setPaymentMethods] = useState(() => (store.getPaymentMethods ? store.getPaymentMethods() : []));
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [addMethodTab, setAddMethodTab] = useState('UPI'); // 'UPI' | 'Card' | 'NetBanking'
    const [deleteTargetMethod, setDeleteTargetMethod] = useState(null);
    const [copiedMethodId, setCopiedMethodId] = useState(null);
    const [isMethodSaving, setIsMethodSaving] = useState(false);
    const [pmFormError, setPmFormError] = useState(null);

    // Form fields for Add Payment Method
    const [pmUpiId, setPmUpiId] = useState('');
    const [pmUpiHolder, setPmUpiHolder] = useState('');
    const [pmUpiDefault, setPmUpiDefault] = useState(false);

    const [pmCardNum, setPmCardNum] = useState('');
    const [pmCardHolder, setPmCardHolder] = useState('');
    const [pmCardExp, setPmCardExp] = useState('');
    const [pmCardBrand, setPmCardBrand] = useState('Visa');
    const [pmCardCvv, setPmCardCvv] = useState('');
    const [pmCardDefault, setPmCardDefault] = useState(false);

    const [pmNetBank, setPmNetBank] = useState('State Bank of India');
    const [pmNetHolder, setPmNetHolder] = useState('');
    const [pmNetAcc, setPmNetAcc] = useState('');
    const [pmNetDefault, setPmNetDefault] = useState(false);

    const toast = useToast();

    // Payment Methods Action Handlers
    const handleSetDefaultMethod = (id) => {
      const updated = paymentMethods.map((m) => ({ ...m, isDefault: m.id === id }));
      setPaymentMethods(updated);
      store.setPaymentMethods(updated);
      toast.show('Default Updated', 'Primary payment method saved for Kolkata commutes.');
      // Optional async sync to backend
      fetch(`/api/payment-methods/${id}/default`, { method: 'PATCH' }).catch(() => {});
    };

    const handleConfirmDeleteMethod = () => {
      if (!deleteTargetMethod) return;
      const targetId = deleteTargetMethod.id;
      const updated = paymentMethods.filter((m) => m.id !== targetId);
      setPaymentMethods(updated);
      store.setPaymentMethods(updated);
      toast.show('Payment Method Removed', `${deleteTargetMethod.title} removed successfully.`, 'info');
      setDeleteTargetMethod(null);
      // Optional async sync to backend
      fetch(`/api/payment-methods/${targetId}`, { method: 'DELETE' }).catch(() => {});
    };

    const handleCopyUpiMethod = (upiHandle, id) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(upiHandle);
        setCopiedMethodId(id);
        setTimeout(() => setCopiedMethodId(null), 2000);
        toast.show('Copied to Clipboard', upiHandle);
      }
    };

    const resetPmForm = () => {
      setPmUpiId('');
      setPmUpiHolder('');
      setPmUpiDefault(false);
      setPmCardNum('');
      setPmCardHolder('');
      setPmCardExp('');
      setPmCardBrand('Visa');
      setPmCardCvv('');
      setPmCardDefault(false);
      setPmNetBank('State Bank of India');
      setPmNetHolder('');
      setPmNetAcc('');
      setPmNetDefault(false);
      setPmFormError(null);
    };

    const handleAddMethodSubmit = (e) => {
      e.preventDefault();
      setPmFormError(null);

      let newMethod = null;
      const isDef = addMethodTab === 'UPI' ? pmUpiDefault : addMethodTab === 'Card' ? pmCardDefault : pmNetDefault;

      if (addMethodTab === 'UPI') {
        const clean = pmUpiId.trim().toLowerCase();
        if (!clean || !clean.includes('@') || clean.split('@')[0].length < 2 || clean.split('@')[1].length < 2) {
          setPmFormError('Please enter a valid UPI ID (e.g. yourname@okaxis or mobile@paytm).');
          return;
        }
        newMethod = {
          id: `pm-${Date.now()}`,
          userId: currentUser.id,
          type: 'UPI',
          title: pmUpiHolder.trim() ? `${pmUpiHolder.trim()} UPI` : 'Corporate UPI Handle',
          details: clean,
          upiId: clean,
          isDefault: isDef,
          isVerified: true,
        };
      } else if (addMethodTab === 'Card') {
        const rawDigits = pmCardNum.replace(/\s+/g, '');
        if (rawDigits.length < 15 || rawDigits.length > 16) {
          setPmFormError('Please enter a valid 16-digit card number.');
          return;
        }
        if (!pmCardExp || !/^\d{2}\/\d{2}$/.test(pmCardExp)) {
          setPmFormError('Please enter a valid expiry in MM/YY format (e.g. 08/29).');
          return;
        }
        const [month] = pmCardExp.split('/').map(Number);
        if (month < 1 || month > 12) {
          setPmFormError('Invalid expiry month (must be 01 to 12).');
          return;
        }

        // Security: Never save CVV or raw full number
        const last4 = rawDigits.slice(-4);
        newMethod = {
          id: `pm-${Date.now()}`,
          userId: currentUser.id,
          type: 'Card',
          title: `${pmCardBrand} Card (${pmCardHolder.trim() || 'Corporate'})`,
          details: `•••• •••• •••• ${last4}`,
          cardLast4: last4,
          cardBrand: pmCardBrand,
          cardExpiry: pmCardExp,
          isDefault: isDef,
          isVerified: true,
        };
      } else if (addMethodTab === 'NetBanking') {
        const rawAcc = pmNetAcc.replace(/\D/g, '');
        const last4 = rawAcc ? rawAcc.slice(-4) : '7721';
        newMethod = {
          id: `pm-${Date.now()}`,
          userId: currentUser.id,
          type: 'NetBanking',
          title: pmNetBank,
          details: `Corporate Net Banking (•••• ${last4})`,
          bankName: pmNetBank,
          isDefault: isDef,
          isVerified: true,
        };
      }

      if (!newMethod) return;

      setIsMethodSaving(true);
      setTimeout(() => {
        let updated = [...paymentMethods];
        if (isDef) {
          updated = updated.map((m) => ({ ...m, isDefault: false }));
        }
        updated.push(newMethod);
        setPaymentMethods(updated);
        store.setPaymentMethods(updated);
        setIsMethodSaving(false);
        setShowAddMethod(false);
        resetPmForm();
        toast.show('Payment Method Added', `${newMethod.title} is now active for rides.`);

        // Optional async sync to backend
        fetch('/api/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMethod),
        }).catch(() => {});
      }, 350);
    };

    // ==========================================
    // 1. REPORTS STATE & HANDLERS
    // ==========================================
    const [reportRange, setReportRange] = useState('all');
    const [reportChartView, setReportChartView] = useState('monthly');

    const handleExportReportCSV = () => {
      const metrics = store.calculateUserAnalytics(currentUser.id, reportRange);
      const csvRows = [
        ['Metric', 'Value'],
        ['Total Rides', metrics.totalRides],
        ['Completed Rides', metrics.completedRides],
        ['Cancelled Rides', metrics.cancelledRides],
        ['Total Distance (km)', metrics.totalDistanceKm],
        ['Total Spent (INR)', metrics.totalSpent],
        ['Total Earned (INR)', metrics.totalEarned],
        ['Average Fare (INR)', metrics.averageFare],
        ['Average Rating', metrics.averageRating],
        ['CO2 Emissions Reduced (kg)', metrics.co2SavedKg],
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `carpool_kolkata_report_${currentUser.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.show('Analytics Exported', 'CSV report downloaded successfully.');
    };

    // ==========================================
    // 2. HELP & SUPPORT STATE & HANDLERS
    // ==========================================
    const [helpTab, setHelpTab] = useState('help'); // 'help' | 'feedback' | 'tickets' | 'care' | 'helplines'
    const [faqSearch, setFaqSearch] = useState('');
    const [faqCategory, setFaqCategory] = useState('All');
    const [expandedFaqId, setExpandedFaqId] = useState('faq-1');

    // Feedback State
    const [feedbacks, setFeedbacks] = useState(() => (store.getFeedback ? store.getFeedback() : []));
    const [fbName, setFbName] = useState(currentUser.name || '');
    const [fbEmail, setFbEmail] = useState(currentUser.email || '');
    const [fbCategory, setFbCategory] = useState('Ride Experience');
    const [fbRating, setFbRating] = useState(5);
    const [fbMessage, setFbMessage] = useState('');
    const [fbSuccess, setFbSuccess] = useState(false);
    const [isSubmittingFb, setIsSubmittingFb] = useState(false);

    const handleFeedbackSubmit = (e) => {
      e.preventDefault();
      if (!fbMessage.trim()) {
        toast.show('Required Field', 'Please enter your feedback message.', 'error');
        return;
      }
      setIsSubmittingFb(true);
      setTimeout(() => {
        const item = {
          id: `fb-${Date.now()}`,
          userId: currentUser.id,
          userName: fbName.trim() || currentUser.name,
          userEmail: fbEmail.trim() || currentUser.email,
          category: fbCategory,
          rating: fbRating,
          message: fbMessage.trim(),
          createdAt: new Date().toISOString(),
        };
        store.addFeedback(item);
        setFeedbacks(store.getFeedback());
        setIsSubmittingFb(false);
        setFbSuccess(true);
        setFbMessage('');
        toast.show('Feedback Submitted', 'Thank you! Your feedback has been recorded.');
      }, 400);
    };

    // Support Ticket State
    const [tickets, setTickets] = useState(() => (store.getTickets ? store.getTickets() : []));
    const [showCreateTicket, setShowCreateTicket] = useState(false);
    const [activeTicketDetail, setActiveTicketDetail] = useState(null);
    const [tktSubject, setTktSubject] = useState('');
    const [tktCategory, setTktCategory] = useState('Ride Issues');
    const [tktDesc, setTktDesc] = useState('');
    const [tktPriority, setTktPriority] = useState('Medium');
    const [tktAttachName, setTktAttachName] = useState('');
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [tktReplyText, setTktReplyText] = useState('');

    const handleCreateTicketSubmit = (e) => {
      e.preventDefault();
      if (!tktSubject.trim() || !tktDesc.trim()) {
        toast.show('Required Fields', 'Subject and description cannot be empty.', 'error');
        return;
      }
      setIsCreatingTicket(true);
      setTimeout(() => {
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const ticketNumber = `CK-${randNum}`;
        const now = new Date().toISOString();
        const newTicket = {
          id: `tkt-${Date.now()}`,
          ticketNumber,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          subject: tktSubject.trim(),
          category: tktCategory,
          description: tktDesc.trim(),
          priority: tktPriority,
          attachment: tktAttachName || undefined,
          status: 'OPEN',
          createdAt: now,
          updatedAt: now,
          replies: [
            {
              id: `rep-${Date.now()}`,
              ticketId: `tkt-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: 'employee',
              message: tktDesc.trim(),
              createdAt: now,
            },
          ],
        };
        store.addTicket(newTicket);
        setTickets(store.getTickets());
        setIsCreatingTicket(false);
        setShowCreateTicket(false);
        setTktSubject('');
        setTktDesc('');
        setTktAttachName('');
        toast.show('Support Ticket Created', `Ticket #${ticketNumber} created successfully.`);
      }, 400);
    };

    const handleSendTicketReply = () => {
      if (!activeTicketDetail || !tktReplyText.trim()) return;
      const now = new Date().toISOString();
      const reply = {
        id: `rep-${Date.now()}`,
        ticketId: activeTicketDetail.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'employee',
        message: tktReplyText.trim(),
        createdAt: now,
      };
      store.addTicketReply(activeTicketDetail.id, reply);
      const updated = store.getTickets();
      setTickets(updated);
      const fresh = updated.find((t) => t.id === activeTicketDetail.id) || null;
      setActiveTicketDetail(fresh);
      setTktReplyText('');
      toast.show('Reply Sent', 'Your message was added to ticket thread.');
    };

    // Live AI Chat Concierge Assistant
    const [helpChatMsgs, setHelpChatMsgs] = useState([
      {
        sender: 'bot',
        text: `Hello ${currentUser.name}! I am your Carpool Kolkata Concierge Assistant. How can I assist you with your Sector V / Park Street commute, wallet auto-debits, or fleet guidelines today?`,
        time: '10:00 AM',
      },
    ]);
    const [helpChatInput, setHelpChatInput] = useState('');

    const handleSendHelpChat = (customText) => {
      const query = customText || helpChatInput;
      if (!query.trim()) return;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHelpChatMsgs((prev) => [...prev, { sender: 'user', text: query, time }]);
      setHelpChatInput('');

      setTimeout(() => {
        let botResponse = 'Thank you for reaching out. Our Kolkata Mobility Operations Desk is actively monitoring routes along Sector V and EM Bypass. How else may I assist you?';
        const q = query.toLowerCase();
        if (q.includes('fare') || q.includes('cost') || q.includes('price')) {
          botResponse = 'Standard pooled fares in Kolkata range between ₹45 to ₹120 depending on corridor distance (e.g. Park Street to Sector V is ~₹45 per seat with FASTag subsidy).';
        } else if (q.includes('cancel') || q.includes('refund')) {
          botResponse = 'Cancellations made 15 minutes before departure are 100% refunded instantly to your Carpool Wallet.';
        } else if (q.includes('sos') || q.includes('emergency') || q.includes('police')) {
          botResponse = '🚨 For immediate emergency assistance, call Kolkata Police at 100 / 112 or click the Important Helplines tab above.';
        } else if (q.includes('driver') || q.includes('offer')) {
          botResponse = 'To publish a ride as a verified employee driver, navigate to "Offer Ride" in the sidebar and choose your departure time.';
        }
        setHelpChatMsgs((prev) => [...prev, { sender: 'bot', text: botResponse, time }]);
      }, 500);
    };

    // ==========================================
    // 3. RIDE HISTORY STATE & HANDLERS
    // ==========================================
    const [rhSearch, setRhSearch] = useState('');
    const [rhStatus, setRhStatus] = useState('all');
    const [rhDate, setRhDate] = useState('all');
    const [rhType, setRhType] = useState('all');
    const [rhSelectedRecord, setRhSelectedRecord] = useState(null);

    const handleExportRhCSV = () => {
      const allHist = store.getUserRideHistory(currentUser.id);
      const csvRows = [
        ['Ride ID', 'Type', 'Driver', 'Rider', 'Origin', 'Destination', 'Vehicle', 'Plate', 'Date', 'Time', 'Fare (INR)', 'Payment Status', 'Ride Status'],
        ...allHist.map((r) => [
          r.id,
          r.type,
          r.driverName,
          r.riderName || currentUser.name,
          r.startLocation,
          r.destinationLocation,
          r.vehicleModel,
          r.registrationNumber,
          r.date,
          r.time,
          r.fare,
          r.paymentStatus,
          r.status,
        ]),
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `carpool_ride_history_${currentUser.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.show('Ride History Exported', 'CSV ride history ledger downloaded.');
    };

    // Apply theme to DOM on mount and change
    useEffect(() => {
      if (theme === 'light') {
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
    }, [theme]);

    // Theme Toggle Function
    const toggleTheme = (newTheme) => {
      const targetTheme = newTheme || (theme === 'dark' ? 'light' : 'dark');
      setTheme(targetTheme);
      if (store.setTheme) {
        store.setTheme(targetTheme);
      } else {
        localStorage.setItem('carpool_theme', targetTheme);
      }

      if (targetTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        toast.show('Light Theme Activated', 'Crisp White, Rich Black, Gray & Sunny Yellow palette enabled.');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        toast.show('Dark Theme Activated', 'Sleek Midnight Slate & Ambient Glow palette enabled.');
      }
    };

    // Listen for internal store updates
    useEffect(() => {
      const handleStore = () => {
        setCurrentUser(store.getCurrentUser());
        setUsers(store.getUsers());
        setVehicles(store.getVehicles());
        setRides(store.getRides());
        setTrips(store.getTrips());
        setTxs(store.getTxs());
        setSettings(store.getSettings());
      };
      window.addEventListener('carpool_store_event', handleStore);
      return () => window.removeEventListener('carpool_store_event', handleStore);
    }, []);

    // Helper to switch demo user
    const switchUser = (u) => {
      store.setCurrentUser(u);
      setCurrentUser(u);
      toast.show('Switched User', `Active as ${u.name} (${u.role.toUpperCase()})`);
      if (u.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    };

    // --- Page 1: Splash Screen ---
    if (route === '/' || route === '/splash') {
      return React.createElement(
        'div',
        { className: `min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col items-center justify-center p-4 text-center relative overflow-hidden transition-colors duration-300` },
        React.createElement('div', { className: `absolute w-[600px] h-[600px] ${isLight ? 'bg-yellow-400/20' : 'bg-blue-600/15'} rounded-full blur-3xl pointer-events-none` }),
        React.createElement(
          'div',
          { className: `relative z-10 max-w-lg w-full p-8 sm:p-12 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-2xl'} space-y-6` },
          React.createElement(
            'div',
            { className: `w-24 h-24 mx-auto rounded-3xl ${isLight ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/40' : 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-2xl shadow-blue-500/40'} flex items-center justify-center animate-bounce`, style: { animationDuration: '2.5s' } },
            React.createElement(Icon, { name: 'car', className: 'w-12 h-12' })
          ),
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('div', { className: `text-[11px] font-extrabold uppercase tracking-widest ${isLight ? 'text-yellow-800 bg-yellow-100 inline-block px-3 py-1 rounded-full border border-yellow-300' : 'text-cyan-400'}` }, 'Enterprise Mobility Platform • Kolkata, WB'),
            React.createElement('h1', { className: `text-4xl sm:text-5xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}` }, 'CARPOOL'),
            React.createElement('p', { className: `text-lg font-bold ${isLight ? 'text-yellow-700' : 'text-cyan-300'}` }, '“Ride Together, Save Together”'),
            React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} pt-2` }, 'Connecting Kolkata corporate employees for secure, shared commutes across Salt Lake Sector V, Park Street, EM Bypass & New Town.')
          ),
          React.createElement(
            'div',
            { className: 'pt-4 space-y-3' },
            React.createElement(
              'button',
              {
                onClick: () => navigate('/login'),
                className: `w-full py-4 px-6 rounded-2xl ${
                  isLight
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-xl shadow-yellow-500/30'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-xl shadow-blue-600/30'
                } text-sm transition transform hover:scale-[1.02] flex items-center justify-center gap-2`,
              },
              React.createElement('span', null, 'Proceed to Login'),
              React.createElement(Icon, { name: 'arrowRight', className: 'w-4 h-4' })
            ),
            React.createElement(
              'button',
              {
                onClick: () => toggleTheme(),
                className: `w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`,
              },
              React.createElement('span', null, isLight ? '🌙 Switch to Dark Theme' : '☀️ Switch to Light Theme (Yellow & Gray)')
            )
          )
        )
      );
    }

    // --- Page 2: Login Page ---
    if (route === '/login') {
      return React.createElement(
        'div',
        { className: `min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300` },
        React.createElement(
          'div',
          { className: 'sm:mx-auto sm:w-full sm:max-w-md text-center mb-6' },
          React.createElement(
            'div',
            { onClick: () => navigate('/'), className: 'inline-flex items-center gap-2 cursor-pointer' },
            React.createElement('div', { className: `w-10 h-10 rounded-xl ${isLight ? 'bg-yellow-400 text-black border border-yellow-500 shadow-md' : 'bg-blue-600 text-white'} flex items-center justify-center` }, React.createElement(Icon, { name: 'car', className: 'w-5 h-5' })),
            React.createElement('span', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'CARPOOL')
          ),
          React.createElement('h2', { className: `mt-3 text-2xl font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Login To Continue'),
          React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}` }, 'Enterprise Mobility Console • Kolkata & West Bengal Corridors')
        ),
        React.createElement(
          'div',
          { className: 'sm:mx-auto sm:w-full sm:max-w-md' },
          React.createElement(
            'div',
            { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-8 space-y-5 text-xs` },
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Login Successful', `Welcome back, ${currentUser.name}!`);
                  if (currentUser.role === 'admin') navigate('/admin/dashboard');
                  else navigate('/dashboard');
                },
                className: 'space-y-4',
              },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Email / Mobile *'),
                React.createElement('input', {
                  type: 'text',
                  defaultValue: currentUser.email,
                  required: true,
                  className: `w-full rounded-xl ${isLight ? 'bg-white border-slate-300 text-black focus:border-yellow-500 focus:ring-yellow-400' : 'bg-slate-950 border-slate-800 text-white'} border py-2.5 px-3.5 font-mono`,
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Password *'),
                React.createElement('input', {
                  type: 'password',
                  defaultValue: 'password123',
                  required: true,
                  className: `w-full rounded-xl ${isLight ? 'bg-white border-slate-300 text-black focus:border-yellow-500 focus:ring-yellow-400' : 'bg-slate-950 border-slate-800 text-white'} border py-2.5 px-3.5 font-mono`,
                })
              ),
              React.createElement(
                'div',
                { className: `flex justify-between items-center ${isLight ? 'text-slate-600' : 'text-slate-400'}` },
                React.createElement('label', { className: 'flex items-center gap-1.5 cursor-pointer' }, React.createElement('input', { type: 'checkbox', defaultChecked: true }), ' Remember me'),
                React.createElement('span', { className: `${isLight ? 'text-yellow-700 font-bold' : 'text-cyan-400'} cursor-pointer hover:underline` }, 'Forgot Password?')
              ),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: `w-full py-3 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-lg shadow-yellow-500/25' : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/30'} transition`,
                },
                'Login'
              )
            ),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/signup'),
                className: `w-full py-2.5 rounded-xl ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'} border font-semibold`,
              },
              'Create New Account'
            ),
            React.createElement(
              'div',
              { className: `pt-2 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
              React.createElement('span', { className: `text-[10px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'} block mb-2` }, '⚡ Quick Demo User Switcher'),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 gap-1.5' },
                users.map((u) =>
                  React.createElement(
                    'button',
                    {
                      key: u.id,
                      onClick: () => switchUser(u),
                      className: `p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                        currentUser.id === u.id
                          ? isLight
                            ? 'bg-yellow-100 border-yellow-400 text-yellow-900 font-bold'
                            : 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`,
                    },
                    React.createElement('img', { src: u.avatar, className: 'w-6 h-6 rounded-full object-cover shrink-0' }),
                    React.createElement('div', { className: 'truncate' }, React.createElement('div', { className: `text-[11px] truncate ${isLight ? 'text-black font-bold' : 'text-white'}` }, u.name), React.createElement('div', { className: 'text-[9px] uppercase text-slate-500' }, u.role))
                  )
                )
              )
            )
          )
        )
      );
    }

    // --- Page 3: Sign Up ---
    if (route === '/signup') {
      return React.createElement(
        'div',
        { className: `min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300` },
        React.createElement(
          'div',
          { className: 'max-w-xl mx-auto w-full space-y-6' },
          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement('h2', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Sign Up - Create Account'),
            React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-1` }, 'Register for the Kolkata Corporate Carpool Platform (Sector V, Salt Lake, West Bengal)')
          ),
          React.createElement(
            'div',
            { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-8 text-xs space-y-4` },
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Account Created!', 'Welcome to CARPOOL Kolkata. ₹500 welcome mobility credit added.');
                  navigate('/dashboard');
                },
                className: 'space-y-3.5',
              },
              React.createElement('input', { type: 'text', required: true, placeholder: 'Full Name (e.g. Sridwip Mandal)', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }),
              React.createElement('input', { type: 'email', required: true, placeholder: 'Corporate Email (name@odoo.com)', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 font-mono` }),
              React.createElement('input', { type: 'text', required: true, placeholder: 'Mobile Number (+91 98765...)', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 font-mono` }),
              React.createElement(
                'select',
                { className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` },
                React.createElement('option', null, 'Kolkata Tech Hub (Sector V, Salt Lake)'),
                React.createElement('option', null, 'Kolkata Central (Park Street)'),
                React.createElement('option', null, 'New Town Campus (Action Area II)'),
                React.createElement('option', null, 'New Town Corporate Headquarters')
              ),
              React.createElement('input', { type: 'password', required: true, placeholder: 'Password', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }),
              React.createElement('input', { type: 'password', required: true, placeholder: 'Confirm Password', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: `w-full py-3.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-lg shadow-yellow-500/25' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30'} transition`,
                },
                'Create Account'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => navigate('/login'),
                  className: `w-full py-2.5 ${isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'} font-semibold`,
                },
                'Back to Login'
              )
            )
          )
        )
      );
    }

    // --- Main Layout Header for Employee / Admin ---
    const isAdmin = route.startsWith('/admin');

    const renderHeader = () => {
      if (isAdmin) {
        return React.createElement(
          'header',
          { className: `sticky top-0 z-40 w-full border-b ${isLight ? 'bg-white/95 border-slate-200 shadow-md' : 'bg-slate-950/95 border-slate-800 shadow-xl'} backdrop-blur-xl transition-colors duration-300` },
          React.createElement(
            'div',
            { className: 'mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8' },
            React.createElement(
              'div',
              { onClick: () => navigate('/admin/dashboard'), className: 'flex items-center gap-3 cursor-pointer' },
              React.createElement('div', { className: `w-10 h-10 rounded-xl ${isLight ? 'bg-yellow-400 text-black border border-yellow-500 shadow-md' : 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'} flex items-center justify-center font-bold` }, React.createElement(Icon, { name: 'shield', className: 'w-5 h-5' })),
              React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: `font-extrabold text-base ${isLight ? 'text-black' : 'text-white'}` }, settings.companyName), React.createElement('span', { className: `${isLight ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'} text-[10px] font-bold px-2 py-0.5 rounded-md border` }, 'ADMIN CONSOLE')),
                React.createElement('span', { className: `text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}` }, 'Kolkata Enterprise Mobility Hub • Sector V')
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              // Theme Toggle Button in Admin
              React.createElement(
                'button',
                {
                  onClick: () => toggleTheme(),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                    isLight
                      ? 'bg-yellow-400 text-black border-yellow-500 shadow-md hover:bg-yellow-300'
                      : 'bg-slate-900 text-yellow-400 border-slate-800 hover:border-yellow-400'
                  }`,
                  title: 'Toggle Dark / Light Theme',
                },
                React.createElement('span', null, isLight ? '☀️ Light Mode' : '🌙 Dark Mode')
              ),
              React.createElement(
                'button',
                {
                  onClick: () => navigate('/dashboard'),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-blue-950/80 border-blue-500/30 text-blue-300 hover:text-white'} text-xs font-semibold`,
                },
                React.createElement(Icon, { name: 'arrowUpDown', className: 'w-3.5 h-3.5' }),
                'Employee View'
              ),
              React.createElement(
                'div',
                { className: `flex items-center gap-2.5 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'}` },
                React.createElement('img', { src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', className: 'w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/50' }),
                React.createElement(
                  'button',
                  { onClick: () => navigate('/login'), className: 'text-xs text-rose-500 hover:underline font-bold' },
                  'Logout'
                )
              )
            )
          )
        );
      }

      // Employee Top Nav with Theme Switcher
      return React.createElement(
        'header',
        { className: `sticky top-0 z-40 w-full border-b ${isLight ? 'bg-white/95 border-slate-200 shadow-md' : 'bg-slate-950/95 border-slate-800 shadow-xl'} backdrop-blur-xl transition-colors duration-300` },
        React.createElement(
          'div',
          { className: 'mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8' },
          React.createElement(
            'div',
            { onClick: () => navigate('/dashboard'), className: 'flex items-center gap-2.5 cursor-pointer' },
            React.createElement('div', { className: `w-10 h-10 rounded-xl ${isLight ? 'bg-yellow-400 text-black border border-yellow-500 shadow-md' : 'bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/30'} flex items-center justify-center` }, React.createElement(Icon, { name: 'car', className: 'w-5 h-5' })),
            React.createElement(
              'div',
              { className: 'flex flex-col' },
              React.createElement('span', { className: `font-extrabold text-base tracking-tight ${isLight ? 'text-black' : 'text-white'}` }, 'CARPOOL KOLKATA'),
              React.createElement('span', { className: `text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'} -mt-1` }, 'Sector V • Park St • New Town')
            )
          ),
          React.createElement(
            'nav',
            { className: `hidden lg:flex items-center gap-1 p-1 rounded-xl border ${isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900/60 border-slate-800'}` },
            [
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/my-trips', label: 'My Trips' },
              { to: '/ride-history', label: 'Ride History' },
              { to: '/my-vehicle', label: 'My Vehicle' },
              { to: '/wallet', label: 'Wallet' },
              { to: '/settings', label: 'Setting' },
              { to: '/reports', label: 'Report' },
            ].map((link) =>
              React.createElement(
                'button',
                {
                  key: link.to,
                  onClick: () => navigate(link.to),
                  className: `px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    route === link.to
                      ? isLight
                        ? 'bg-yellow-400 text-black shadow-md border border-yellow-500'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isLight
                      ? 'text-slate-600 hover:text-black hover:bg-slate-200'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`,
                },
                link.label
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'flex items-center gap-2.5' },
            // THEME TOGGLE BUTTON
            React.createElement(
              'button',
              {
                onClick: () => toggleTheme(),
                className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  isLight
                    ? 'bg-yellow-400 text-black border-yellow-500 shadow-md hover:bg-yellow-300'
                    : 'bg-slate-900 text-yellow-400 border-slate-800 hover:border-yellow-400 shadow-inner'
                }`,
                title: isLight ? 'Switch to Dark Mode' : 'Switch to Light Theme (Yellow, Black, Gray, White)',
              },
              React.createElement('span', null, isLight ? '☀️ Light' : '🌙 Dark')
            ),
            React.createElement(
              'button',
              {
                onClick: () => setShowSearch(true),
                className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'} text-xs font-medium`,
              },
              React.createElement(Icon, { name: 'search', className: `w-3.5 h-3.5 ${isLight ? 'text-yellow-600' : 'text-cyan-400'}` }),
              React.createElement('span', { className: 'hidden sm:inline font-mono' }, '⌘K')
            ),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/admin/dashboard'),
                className: `hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border ${isLight ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-purple-950/60 border-purple-500/30 text-purple-300'} text-xs font-bold`,
              },
              React.createElement(Icon, { name: 'shield', className: 'w-3 h-3' }),
              'Admin'
            ),
            React.createElement(
              'div',
              { onClick: () => navigate('/settings'), className: `flex items-center gap-2 pl-2 border-l ${isLight ? 'border-slate-200' : 'border-slate-800'} cursor-pointer` },
              React.createElement('img', { src: currentUser.avatar, className: `w-8 h-8 rounded-full object-cover ring-2 ${isLight ? 'ring-yellow-400' : 'ring-blue-500/50'}` }),
              React.createElement('span', { className: `hidden md:inline text-xs font-bold ${isLight ? 'text-black' : 'text-white'}` }, currentUser.name)
            )
          )
        )
      );
    };

    // --- Employee Sidebar Navigation ---
    const renderSidebar = () => {
      const links = [
        { to: '/dashboard', label: 'Dashboard', icon: 'car' },
        { to: '/find-ride', label: 'Find Ride', icon: 'search' },
        { to: '/my-trips', label: 'My Trips', icon: 'calendar' },
        { to: '/offer-ride', label: 'Offer Ride', icon: 'plus' },
        { to: '/ride-history', label: 'Ride History', icon: 'history' },
        { to: '/my-vehicle', label: 'My Vehicle', icon: 'car' },
        { to: '/wallet', label: 'Wallet', icon: 'wallet' },
        { to: '/payment-methods', label: 'Payment Methods', icon: 'creditcard' },
        { to: '/settings', label: 'Settings', icon: 'settings' },
        { to: '/reports', label: 'Reports', icon: 'chart' },
        { to: '/help-chat', label: 'Help & Support', icon: 'message' },
      ];

      return React.createElement(
        'aside',
        { className: 'hidden lg:block w-60 shrink-0' },
        React.createElement(
          'div',
          { className: `sticky top-20 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-950/80 border-slate-800 shadow-xl'} p-3 space-y-1` },
          links.map((link) =>
            React.createElement(
              'button',
              {
                key: link.to,
                onClick: () => navigate(link.to),
                className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  route === link.to
                    ? isLight
                      ? 'bg-yellow-400 text-black shadow-md border border-yellow-500'
                      : 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : isLight
                    ? 'text-slate-600 hover:text-black hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`,
              },
              React.createElement(Icon, { name: link.icon, className: 'w-4 h-4' }),
              React.createElement('span', null, link.label)
            )
          ),
          React.createElement(
            'div',
            { className: `pt-3 mt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'} px-2` },
            React.createElement(
              'button',
              {
                onClick: () => navigate('/offer-ride'),
                className: `w-full py-2.5 rounded-2xl ${
                  isLight
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-500 shadow-md font-extrabold'
                    : 'bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white font-bold'
                } text-xs flex items-center justify-center gap-1.5 transition`,
              },
              React.createElement(Icon, { name: 'plus', className: 'w-3.5 h-3.5' }),
              'Publish Kolkata Ride'
            )
          )
        )
      );
    };

    // --- Admin Sidebar Navigation (Clean: 1 Single Section, No Redundant Add Buttons in Sidebar) ---
    const renderAdminSidebar = () => {
      const adminLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'car' },
        { to: '/admin/employees', label: 'Employees', icon: 'users' },
        { to: '/admin/vehicles', label: 'Vehicles', icon: 'car' },
        { to: '/admin/rides', label: 'Rides', icon: 'navigation' },
        { to: '/admin/reports', label: 'Reports', icon: 'chart' },
        { to: '/admin/settings', label: 'Settings', icon: 'settings' },
      ];

      return React.createElement(
        'aside',
        { className: 'w-full md:w-60 shrink-0' },
        React.createElement(
          'div',
          { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-950/80 border-slate-800 shadow-xl'} p-3 space-y-1` },
          adminLinks.map((link) =>
            React.createElement(
              'button',
              {
                key: link.to,
                onClick: () => navigate(link.to),
                className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  route === link.to
                    ? isLight
                      ? 'bg-yellow-400 text-black shadow-md border border-yellow-500'
                      : 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30'
                    : isLight
                    ? 'text-slate-600 hover:text-black hover:bg-slate-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`,
              },
              React.createElement(Icon, { name: link.icon, className: 'w-4 h-4' }),
              React.createElement('span', null, link.label)
            )
          )
        )
      );
    };

    // --- Main Page Routing with Adaptive Light/Dark Theme & Kolkata GPS ---
    const renderPageContent = () => {
      // 1. Employee Dashboard
      if (route === '/dashboard') {
        const upcomingTrip = trips.find((t) => t.status === 'upcoming' || t.status === 'active');
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border-slate-800 shadow-2xl'} p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4` },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, `Welcome back, ${currentUser.name}! 👋`),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, `${currentUser.department} • Hub: ${currentUser.officeLocation} • Pool together along Kolkata EM Bypass & Sector V.`)
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2.5' },
              React.createElement(
                'button',
                { onClick: () => navigate('/find-ride'), className: `px-5 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 text-white font-bold shadow-lg'} text-xs` },
                'Find Ride'
              ),
              React.createElement(
                'button',
                { onClick: () => setShowRecharge(true), className: `px-4 py-2.5 rounded-xl ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300' : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'} border text-xs font-bold` },
                'Recharge Wallet'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
            React.createElement(StatCard, { isLight, title: 'Available Kolkata Rides', value: rides.length, subtitle: 'Active routes', iconName: 'car', colorScheme: 'yellow', onClick: () => navigate('/find-ride') }),
            React.createElement(StatCard, { isLight, title: 'Upcoming Trips', value: trips.filter((t) => t.status === 'upcoming').length, subtitle: 'Scheduled', iconName: 'clock', colorScheme: 'cyan', onClick: () => navigate('/my-trips') }),
            React.createElement(StatCard, { isLight, title: 'Total Shared Trips', value: currentUser.totalTrips || 42, subtitle: 'Commutes pooled', iconName: 'chart', colorScheme: 'purple', onClick: () => navigate('/ride-history') }),
            React.createElement(StatCard, { isLight, title: 'Wallet Balance', value: `₹${currentUser.walletBalance}`, subtitle: 'Instant auto-debit', iconName: 'wallet', colorScheme: 'emerald', onClick: () => setShowRecharge(true) })
          ),
          upcomingTrip &&
            React.createElement(
              'div',
              { className: `rounded-3xl border ${isLight ? 'bg-yellow-50/80 border-yellow-300 shadow-lg text-slate-900' : 'border-blue-500/40 bg-gradient-to-r from-blue-950/60 to-slate-900 text-white shadow-2xl'} p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4` },
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: `text-[10px] uppercase font-bold ${isLight ? 'text-yellow-900 bg-yellow-200 border border-yellow-400' : 'text-emerald-400 bg-emerald-500/10'} px-2 py-0.5 rounded-full` }, 'Upcoming Kolkata Commute'),
                React.createElement('h3', { className: `text-lg font-bold ${isLight ? 'text-black' : 'text-white'} mt-1` }, `${upcomingTrip.startLocation} → ${upcomingTrip.destinationLocation}`),
                React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}` }, `Driver: ${upcomingTrip.driverName} (${upcomingTrip.vehicleModel} - ${upcomingTrip.registrationNumber}) • ${upcomingTrip.date} at ${upcomingTrip.time}`)
              ),
              React.createElement(
                'button',
                { onClick: () => navigate('/live-tracking'), className: `px-5 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 text-white font-bold shadow-lg'} text-xs` },
                'Open Live GPS Tracking'
              )
            ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(
              'div',
              { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} p-6 space-y-4` },
              React.createElement('div', { className: 'flex justify-between' }, React.createElement('h3', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, 'Kolkata Corridor Fuel Efficiency (km/L)'), React.createElement('span', { className: `text-xs font-mono font-bold ${isLight ? 'text-yellow-700' : 'text-cyan-400'}` }, '18.4 km/L')),
              React.createElement(FuelTrendSvg)
            ),
            React.createElement(
              'div',
              { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} p-6 space-y-4` },
              React.createElement('div', { className: 'flex justify-between' }, React.createElement('h3', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, 'Top Costliest Fleet Vehicles (WB Plates)'), React.createElement('span', { className: `text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}` }, 'July 2026')),
              React.createElement(CostliestVehiclesSvg)
            )
          )
        );
      }

      // 2. Find Ride with Real-Time Reactive Kolkata GPS Geolocation
      if (route === '/find-ride') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4 text-xs` },
            React.createElement('h1', { className: `text-xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Find A Carpool Ride in Kolkata'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-400'} block mb-1 font-semibold` }, 'Start Location (Kolkata Origin)'),
                React.createElement('input', {
                  type: 'text',
                  value: startLocation,
                  onChange: (e) => setStartLocation(e.target.value),
                  placeholder: 'e.g. Bally, Howrah, Park Street, Gariahat, Dankuni...',
                  className: `w-full ${isLight ? 'bg-white border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 font-medium`,
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-400'} block mb-1 font-semibold` }, 'Destination Location (Tech Hub / Campus)'),
                React.createElement('input', {
                  type: 'text',
                  value: destLocation,
                  onChange: (e) => setDestLocation(e.target.value),
                  placeholder: 'e.g. Sector V, Salt Lake, New Town Eco Space...',
                  className: `w-full ${isLight ? 'bg-white border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 font-medium`,
                })
              )
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1' },
              React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-400'} block mb-1 font-semibold` }, 'Date & Time'), React.createElement('input', { type: 'text', readOnly: true, value: '18 Jul, 07:00 PM', className: `w-full ${isLight ? 'bg-slate-50 border-slate-200 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-mono` })),
              React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-400'} block mb-1 font-semibold` }, 'Number of Seats'), React.createElement('select', { className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` }, React.createElement('option', null, '1 Seat'), React.createElement('option', null, '2 Seats'))),
              React.createElement('div', { className: `flex items-center justify-between p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}` }, React.createElement('span', { className: `${isLight ? 'text-black' : 'text-white'} font-bold` }, 'Recurring Commute'), React.createElement('input', { type: 'checkbox', defaultChecked: true }))
            ),
            React.createElement(
              'button',
              {
                onClick: () => toast.show('Route Updated', `GPS telemetry recalculating route: ${startLocation} → ${destLocation}.`),
                className: `w-full py-3.5 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30'} text-sm`,
              },
              'Search Kolkata Commutes'
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
            React.createElement(
              'div',
              { className: 'lg:col-span-6 space-y-3' },
              React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'}` }, `Interactive GPS Route: ${startLocation.split(',')[0]} → ${destLocation.split(',')[0]}`),
              React.createElement(MapView, { startName: startLocation, destName: destLocation, height: '420px' })
            ),
            React.createElement(
              'div',
              { className: 'lg:col-span-6 space-y-4' },
              React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Available Rides Today (Kolkata Hubs)'),
              rides.map((r) =>
                React.createElement(
                  'div',
                  { key: r.id, className: `p-5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-xl text-white'} space-y-3 text-xs` },
                  React.createElement(
                    'div',
                    { className: 'flex justify-between items-start' },
                    React.createElement(
                      'div',
                      { className: 'flex items-center gap-3' },
                      React.createElement('img', { src: r.driverAvatar, className: `w-10 h-10 rounded-full object-cover ring-2 ${isLight ? 'ring-yellow-400' : 'ring-blue-500'}` }),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h4', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, r.driverName),
                        React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}` }, `${r.vehicleModel} • ${r.registrationNumber}`)
                      )
                    ),
                    React.createElement('div', { className: `font-mono font-extrabold text-base ${isLight ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200' : 'text-emerald-400'}` }, `₹${r.farePerSeat}`)
                  ),
                  React.createElement(
                    'div',
                    { className: `p-3 rounded-xl border flex justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}` },
                    React.createElement('span', { className: `font-semibold ${isLight ? 'text-slate-900' : 'text-white'}` }, r.startLocation.split(',')[0]),
                    React.createElement('span', { className: 'text-slate-400 font-bold' }, '→'),
                    React.createElement('span', { className: `font-semibold ${isLight ? 'text-slate-900' : 'text-white'}` }, r.destinationLocation.split(',')[0])
                  ),
                  React.createElement(
                    'div',
                    { className: 'flex justify-between items-center pt-2' },
                    React.createElement('span', { className: isLight ? 'text-slate-500 font-medium' : 'text-slate-400' }, `${r.availableSeats} seats left • ${r.departureTime}`),
                    React.createElement(
                      'button',
                      {
                        onClick: () => {
                          const newT = {
                            id: `trip-${Date.now()}`,
                            rideId: r.id,
                            driverName: r.driverName,
                            driverPhone: r.driverPhone,
                            driverRating: r.driverRating,
                            vehicleModel: r.vehicleModel,
                            registrationNumber: r.registrationNumber,
                            startLocation: r.startLocation,
                            destinationLocation: r.destinationLocation,
                            date: r.departureDate,
                            time: r.departureTime,
                            fare: r.farePerSeat,
                            seatNumber: 'Seat 1',
                            status: 'upcoming',
                            paymentStatus: 'pending',
                          };
                          const updatedTrips = [newT, ...trips];
                          store.setTrips(updatedTrips);
                          setTrips(updatedTrips);
                          toast.show('Ride Booked Successfully!', `Seat reserved with ${r.driverName} for ₹${r.farePerSeat}.`);
                          navigate('/my-trips');
                        },
                        className: `px-4 py-2 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold'}`,
                      },
                      'Book Ride'
                    )
                  )
                )
              )
            )
          )
        );
      }

      // 3. Live Tracking
      if (route === '/live-tracking') {
        const activeTrip = trips.find((t) => t.status === 'active' || t.status === 'upcoming') || trips[0];
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Live Kolkata GPS Trip Tracking'),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, `${activeTrip.startLocation} → ${activeTrip.destinationLocation} (via EM Bypass)`)
            ),
            React.createElement('div', { className: `p-3 rounded-2xl border text-xs font-extrabold ${isLight ? 'bg-yellow-100 border-yellow-300 text-yellow-900' : 'bg-blue-950/80 border-blue-500/40 text-cyan-300'}` }, 'Arriving at Pickup in ~5 Mins')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
            React.createElement(
              'div',
              { className: 'lg:col-span-8 space-y-4' },
              React.createElement(MapView, { startName: activeTrip.startLocation, destName: activeTrip.destinationLocation, height: '440px', showSimulation: true })
            ),
            React.createElement(
              'div',
              { className: 'lg:col-span-4 space-y-4 text-xs' },
              React.createElement(
                'div',
                { className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800'} space-y-3` },
                React.createElement('h4', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, activeTrip.driverName),
                React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, `${activeTrip.vehicleModel} • ${activeTrip.registrationNumber}`),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-2 gap-2 pt-2' },
                  React.createElement('button', { onClick: () => setShowChat(true), className: `py-2.5 rounded-xl font-bold border ${isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-800 text-cyan-400 border-slate-700'}` }, 'Chat with Driver'),
                  React.createElement('button', { onClick: () => setShowCall(true), className: `py-2.5 rounded-xl font-bold border ${isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-800 text-emerald-400 border-slate-700'}` }, 'Call Driver')
                ),
                React.createElement('button', { onClick: () => toast.show('Emergency SOS Triggered', 'Kolkata central dispatch alerted.', 'error'), className: 'w-full py-2.5 rounded-xl bg-rose-900/30 border border-rose-500/40 text-rose-500 font-bold' }, 'Emergency SOS Alert')
              ),
              React.createElement(
                'div',
                { className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800'} space-y-3` },
                React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', { className: isLight ? 'text-slate-600 font-medium' : 'text-slate-400' }, 'Fare Payable:'), React.createElement('span', { className: `font-mono font-extrabold text-base ${isLight ? 'text-black' : 'text-white'}` }, `₹${activeTrip.fare}`)),
                React.createElement(
                  'button',
                  {
                    onClick: () => {
                      setPaymentTrip(activeTrip);
                      setShowPayment(true);
                    },
                    className: `w-full py-3 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'}`,
                  },
                  `Pay ₹${activeTrip.fare} via QR / UPI`
                )
              )
            )
          )
        );
      }

      // 4. Offer Ride Page
      if (route === '/offer-ride') {
        return React.createElement(
          'div',
          { className: 'max-w-3xl mx-auto space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: `p-6 sm:p-8 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} space-y-5` },
            React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Publish Kolkata Commute Ride'),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const newRide = {
                    id: `ride-${Date.now()}`,
                    driverId: currentUser.id,
                    driverName: currentUser.name,
                    driverPhone: currentUser.mobile,
                    driverRating: 5.0,
                    driverAvatar: currentUser.avatar,
                    vehicleModel: form.offer_veh.value,
                    registrationNumber: 'WB02AB1234',
                    startLocation: form.offer_start.value,
                    destinationLocation: form.offer_dest.value,
                    startCoords: [22.5510, 88.3524],
                    destCoords: [22.5804, 88.4378],
                    departureDate: form.offer_date.value,
                    departureTime: form.offer_time.value,
                    availableSeats: parseInt(form.offer_seats.value),
                    totalSeats: 4,
                    farePerSeat: parseInt(form.offer_fare.value) || 120,
                    distanceKm: 14.8,
                    estimatedMinutes: 28,
                    isRecurring: true,
                    status: 'scheduled',
                    createdAt: new Date().toISOString(),
                  };
                  const updated = [newRide, ...rides];
                  store.setRides(updated);
                  setRides(updated);
                  toast.show('Ride Published!', `Your Kolkata commute from ${newRide.startLocation.split(',')[0]} is live.`);
                  navigate('/find-ride');
                },
                className: 'space-y-4',
              },
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Pickup Location *'), React.createElement('input', { name: 'offer_start', required: true, defaultValue: 'Park Street, Kolkata', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Destination Location *'), React.createElement('input', { name: 'offer_dest', required: true, defaultValue: 'Sector V, Salt Lake, Kolkata', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }))
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Departure Date'), React.createElement('input', { name: 'offer_date', defaultValue: '19/July/26', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Departure Time'), React.createElement('input', { name: 'offer_time', defaultValue: '08:30 AM', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Available Seats'), React.createElement('select', { name: 'offer_seats', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }, [1, 2, 3, 4].map((s) => React.createElement('option', { key: s, value: s }, `${s} Seats`))))
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Select Vehicle'), React.createElement('select', { name: 'offer_veh', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }, vehicles.map((v) => React.createElement('option', { key: v.id, value: v.model }, `${v.model} (${v.registrationNumber})`)))),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Fare Per Passenger (₹)'), React.createElement('input', { name: 'offer_fare', type: 'number', defaultValue: 120, className: `w-full ${isLight ? 'bg-white border-slate-300 text-black font-mono font-bold' : 'bg-slate-950 border-slate-800 text-white font-mono'} border rounded-xl px-3.5 py-2.5` }))
              ),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: `w-full py-4 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/30'} text-sm`,
                },
                'Publish Kolkata Carpool'
              )
            )
          )
        );
      }

      // 5. My Vehicle Page (Employee View)
      if (route === '/my-vehicle') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'My Registered Vehicles'),
              React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Manage your verified fleet vehicles for corporate carpooling in Kolkata.')
            ),
            React.createElement(
              'button',
              {
                onClick: () => setShowAddVehicle(true),
                className: `px-5 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold'} flex items-center gap-1.5`,
              },
              React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
              'Register New Vehicle'
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            vehicles.map((v) =>
              React.createElement(
                'div',
                { key: v.id, className: `p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} space-y-3` },
                React.createElement(
                  'div',
                  { className: 'flex justify-between items-start' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement('h3', { className: `font-extrabold text-base ${isLight ? 'text-black' : 'text-white'}` }, v.model),
                    React.createElement('span', { className: `inline-block mt-1 font-mono font-bold px-2 py-0.5 rounded-md ${isLight ? 'bg-slate-100 text-slate-900 border border-slate-300' : 'bg-slate-950 text-cyan-400 border border-slate-800'}` }, v.registrationNumber)
                  ),
                  React.createElement('span', { className: `px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${v.status === 'approved' ? (isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30') : 'bg-rose-500/20 text-rose-300'}` }, v.status)
                ),
                React.createElement(
                  'div',
                  { className: `grid grid-cols-2 gap-2 p-3 rounded-xl ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'}` },
                  React.createElement('div', null, React.createElement('span', { className: 'text-slate-400 block text-[10px]' }, 'Fuel Type'), React.createElement('span', { className: 'font-bold' }, v.fuelType)),
                  React.createElement('div', null, React.createElement('span', { className: 'text-slate-400 block text-[10px]' }, 'Capacity'), React.createElement('span', { className: 'font-bold' }, `${v.seatingCapacity} Seats`))
                )
              )
            )
          )
        );
      }

      // 6. Settings Page (with Theme Switcher Card)
      if (route === '/settings' || route === '/admin/settings') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto text-xs' },
          React.createElement(
            'div',
            null,
            React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Application Settings & Appearance'),
            React.createElement('p', { className: `${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Manage your profile, theme mode, corporate transit routes, and Kolkata office preferences.')
          ),
          // THEME SELECTOR CARD
          React.createElement(
            'div',
            { className: `p-6 sm:p-8 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} space-y-4` },
            React.createElement('h3', { className: `text-base font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, '🎨 Color Theme & Display Mode'),
            React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Choose between our elegant Dark Mode or the pleasant Light Theme (Yellow, Black, Gray, and White palette).'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2' },
              // Light Theme Box
              React.createElement(
                'div',
                {
                  onClick: () => toggleTheme('light'),
                  className: `p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isLight
                      ? 'border-yellow-500 bg-yellow-50/80 shadow-lg ring-2 ring-yellow-400/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`,
                },
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between mb-3' },
                  React.createElement('span', { className: `font-extrabold text-sm ${isLight ? 'text-black' : 'text-white'}` }, '☀️ Light Theme'),
                  isLight && React.createElement('span', { className: 'px-2 py-0.5 rounded-md bg-yellow-400 text-black font-extrabold text-[10px] border border-yellow-500' }, 'ACTIVE')
                ),
                React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'} mb-3` }, 'Clean white canvas with bold black typography, delicate gray borders, and sunny yellow highlights.'),
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm', title: 'White' }),
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-yellow-400 border border-yellow-500 shadow-sm', title: 'Yellow' }),
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-slate-900 border border-black shadow-sm', title: 'Black' }),
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-slate-200 border border-slate-300 shadow-sm', title: 'Gray' })
                )
              ),
              // Dark Theme Box
              React.createElement(
                'div',
                {
                  onClick: () => toggleTheme('dark'),
                  className: `p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    !isLight
                      ? 'border-blue-500 bg-blue-950/30 shadow-lg ring-2 ring-blue-500/40'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`,
                },
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between mb-3' },
                  React.createElement('span', { className: `font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}` }, '🌙 Dark Theme'),
                  !isLight && React.createElement('span', { className: 'px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px]' }, 'ACTIVE')
                ),
                React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'} mb-3` }, 'Deep midnight slate with ambient glow, electric cyan accents, and high-contrast dark maps.'),
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-slate-950 border border-slate-800 shadow-sm', title: 'Slate 950' }),
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-blue-600 border border-blue-400 shadow-sm', title: 'Blue' }),
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-cyan-400 border border-cyan-300 shadow-sm', title: 'Cyan' }),
                  React.createElement('span', { className: 'w-6 h-6 rounded-full bg-emerald-500 border border-emerald-400 shadow-sm', title: 'Emerald' })
                )
              )
            )
          ),
          // Profile & Corporate Settings Form
          React.createElement(
            'div',
            { className: `p-6 sm:p-8 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} space-y-4` },
            React.createElement('h3', { className: `text-base font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Corporate Employee Profile (Kolkata Hub)'),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Settings Updated', 'Profile & Kolkata transit preferences saved.');
                },
                className: 'space-y-4',
              },
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Full Name'), React.createElement('input', { type: 'text', defaultValue: currentUser.name, className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Corporate Email'), React.createElement('input', { type: 'email', defaultValue: currentUser.email, className: `w-full ${isLight ? 'bg-white border-slate-300 text-black font-mono' : 'bg-slate-950 border-slate-800 text-white font-mono'} border rounded-xl px-3.5 py-2.5` }))
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Primary Office Location'), React.createElement('select', { defaultValue: currentUser.officeLocation, className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }, React.createElement('option', null, 'Kolkata Tech Hub (Sector V)'), React.createElement('option', null, 'Kolkata Central (Park Street)'), React.createElement('option', null, 'New Town Campus (Action Area II)'), React.createElement('option', null, 'New Town Corporate Headquarters'))),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Registered Company Address'), React.createElement('input', { type: 'text', defaultValue: 'Sector V, Salt Lake, Kolkata, West Bengal - 700091', className: `w-full ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5` }))
              ),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: `px-6 py-3 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold'}`,
                },
                'Save Preferences'
              )
            )
          )
        );
      }

      // 8. Corporate Wallet & Instant Recharge Page (/wallet)
      if (route === '/wallet') {
        const totalCredits = txs.filter((t) => t.type === 'credit').reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const totalDebits = txs.filter((t) => t.type === 'debit').reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const filteredTxs = txs.filter((tx) => {
          if (filterType !== 'all' && tx.type !== filterType) return false;
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return (
            (tx.description && tx.description.toLowerCase().includes(q)) ||
            (tx.referenceId && tx.referenceId.toLowerCase().includes(q)) ||
            (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(q))
          );
        });

        const handleBackendRecharge = async (amt, method, promo) => {
          try {
            const resp = await fetch('/api/wallet/recharge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: amt, paymentMethod: method, promoCode: promo }),
            });
            const data = await resp.json();
            if (data.success) {
              const bonus = data.bonusAmount || 0;
              const totalAdd = amt + bonus;
              const u = { ...currentUser, walletBalance: currentUser.walletBalance + totalAdd };
              store.setCurrentUser(u);
              setCurrentUser(u);
              const updatedTxs = [data.transaction, ...txs];
              store.setTxs(updatedTxs);
              setTxs(updatedTxs);
              toast.show('Wallet Recharged! ⚡', `₹${amt}${bonus ? ` + ₹${bonus} bonus` : ''} added to your Carpool balance.`);
            }
          } catch (e) {
            // Fallback
            const u = { ...currentUser, walletBalance: currentUser.walletBalance + amt };
            store.setCurrentUser(u);
            setCurrentUser(u);
            const fallbackTx = {
              id: `tx-${Date.now()}`,
              type: 'credit',
              amount: amt,
              description: `Wallet Top-up via ${method}`,
              paymentMethod: method,
              timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              referenceId: `TXN-KOL-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'success',
            };
            const updated = [fallbackTx, ...txs];
            store.setTxs(updated);
            setTxs(updated);
            toast.show('Wallet Recharged!', `₹${amt} added successfully.`);
          }
        };

        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs max-w-6xl mx-auto' },
          // Top Header
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-black' : 'text-white'} tracking-tight` }, 'Corporate Carpool Wallet'),
              React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Manage your balance, top-up via UPI / Cards, view corporate mobility subsidies, and download GST receipts.')
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2.5' },
              React.createElement(
                'button',
                {
                  onClick: () => navigate('/payment-methods'),
                  className: `px-4 py-2.5 rounded-2xl border font-bold transition ${isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'}`,
                },
                'Saved Gateways →'
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setShowRecharge(true),
                  className: `flex items-center gap-2 px-5 py-2.5 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30'} transition hover:scale-105`,
                },
                React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
                '⚡ Quick Recharge'
              )
            )
          ),

          // Main Wallet Balance & Corporate Allowance Cards
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
            // Card 1: Live Available Balance (2 cols)
            React.createElement(
              'div',
              {
                className: `lg:col-span-2 relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl ${
                  isLight
                    ? 'bg-gradient-to-br from-white via-slate-50 to-yellow-50/50 border-slate-200'
                    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-slate-800'
                }`,
              },
              React.createElement(
                'div',
                { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6' },
                React.createElement(
                  'div',
                  { className: 'space-y-2' },
                  React.createElement(
                    'div',
                    { className: 'flex items-center gap-2' },
                    React.createElement('span', { className: `text-xs font-bold uppercase tracking-wider ${isLight ? 'text-yellow-800' : 'text-emerald-400'}` }, 'Available Carpool Balance'),
                    React.createElement('span', { className: `px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isLight ? 'bg-yellow-200 text-yellow-950 border border-yellow-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}` }, '⚡ Auto-Debit Active')
                  ),
                  React.createElement('h2', { className: `text-4xl sm:text-5xl font-extrabold font-mono tracking-tight ${isLight ? 'text-black' : 'text-white'}` }, `₹ ${currentUser.walletBalance.toLocaleString()}`),
                  React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Auto-debits securely on ride completion across Kolkata & West Bengal.')
                ),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-2 gap-3 font-mono text-xs w-full sm:w-auto' },
                  React.createElement(
                    'div',
                    { className: `p-3.5 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'}` },
                    React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500 block' }, 'Total Top-ups'),
                    React.createElement('span', { className: `text-sm font-bold block mt-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}` }, `+₹${totalCredits.toLocaleString()}`)
                  ),
                  React.createElement(
                    'div',
                    { className: `p-3.5 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'}` },
                    React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500 block' }, 'Ride Expenses'),
                    React.createElement('span', { className: 'text-sm font-bold text-rose-500 block mt-1' }, `-₹${totalDebits.toLocaleString()}`)
                  )
                )
              )
            ),

            // Card 2: Corporate Mobility Subsidy (Odoo Allowance)
            React.createElement(
              'div',
              {
                className: `rounded-3xl border p-6 shadow-xl backdrop-blur-xl space-y-3 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
                }`,
              },
              React.createElement(
                'div',
                { className: 'flex justify-between items-center' },
                React.createElement('span', { className: 'font-bold uppercase text-[10px] tracking-wider text-cyan-400' }, '🏢 Corporate Commute Quota'),
                React.createElement('span', { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-cyan-500/20 text-cyan-300'}` }, 'Odoo Pvt. Ltd.')
              ),
              React.createElement('h3', { className: `text-2xl font-extrabold font-mono ${isLight ? 'text-black' : 'text-white'}` }, '₹ 3,800 / ₹5,000'),
              React.createElement(
                'div',
                { className: `w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}` },
                React.createElement('div', { className: 'h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full', style: { width: '76%' } })
              ),
              React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Monthly mobility fuel & transit subsidy provided by Odoo West Bengal. Renews in 12 days.')
            )
          ),

          // IN-PAGE INTERACTIVE RECHARGE STUDIO
          React.createElement(
            'div',
            { className: `p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/95 border-slate-800'} space-y-6` },
            React.createElement(
              'div',
              { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/50 pb-4' },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-lg font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, '⚡ Instant Wallet Recharge & Top-up'),
                React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Select an amount, pick your preferred gateway (UPI / Cards / Net Banking), apply coupons and recharge in 1-click.')
              ),
              React.createElement('span', { className: `px-3 py-1 rounded-xl text-xs font-mono font-bold ${isLight ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}` }, 'Instant 0% Gateway Fee')
            ),

            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const amt = parseInt(form.recharge_amt.value) || 500;
                  const meth = form.recharge_meth.value;
                  const promo = form.recharge_promo.value.trim();
                  handleBackendRecharge(amt, meth, promo);
                },
                className: 'space-y-5',
              },
              // 1. Preset Chips & Custom Input
              React.createElement(
                'div',
                { className: 'space-y-2' },
                React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-bold uppercase tracking-wider text-[11px] block` }, 'Choose Recharge Amount (₹)'),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-2 sm:grid-cols-5 gap-2.5' },
                  [200, 500, 1000, 2000, 5000].map((val) =>
                    React.createElement(
                      'button',
                      {
                        key: val,
                        type: 'button',
                        onClick: (e) => {
                          const input = e.currentTarget.closest('form').querySelector('input[name="recharge_amt"]');
                          if (input) input.value = val;
                        },
                        className: `py-3 rounded-2xl font-mono font-bold text-sm border transition ${isLight ? 'bg-slate-50 hover:bg-yellow-100 border-slate-300 text-slate-900 hover:border-yellow-400' : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200 hover:border-slate-700'}`,
                      },
                      `+ ₹${val}`
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'relative pt-2' },
                  React.createElement('span', { className: 'absolute left-4 top-5 font-mono font-bold text-base text-slate-400' }, '₹'),
                  React.createElement('input', {
                    name: 'recharge_amt',
                    type: 'number',
                    defaultValue: 500,
                    min: 10,
                    max: 50000,
                    required: true,
                    className: `w-full rounded-2xl py-3 pl-9 pr-4 font-mono font-bold text-lg ${isLight ? 'bg-white border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'} border focus:outline-none`,
                  })
                )
              ),

              // 2. Gateways & Payment Mode
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-bold uppercase tracking-wider text-[11px] block mb-1.5` }, 'Payment Gateway / Mode *'),
                  React.createElement(
                    'select',
                    {
                      name: 'recharge_meth',
                      className: `w-full rounded-2xl py-3 px-3.5 ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border font-semibold`,
                    },
                    React.createElement('option', { value: 'UPI (GPay / PhonePe / Paytm)' }, '⚡ UPI (Google Pay, PhonePe, Paytm, BHIM)'),
                    React.createElement('option', { value: 'Corporate Credit Card (Visa / Mastercard)' }, '💳 Corporate Credit / Debit Card (Visa, Mastercard, RuPay)'),
                    React.createElement('option', { value: 'Net Banking (SBI / HDFC / ICICI)' }, '🏦 Net Banking (SBI, HDFC Bank, ICICI Bank, Axis)'),
                    React.createElement('option', { value: 'Odoo Corporate Mobility Allowance' }, '🏢 Odoo Enterprise Mobility Allowance Voucher')
                  )
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-bold uppercase tracking-wider text-[11px] block mb-1.5` }, 'Promo Code / Cashback Coupon'),
                  React.createElement('input', {
                    name: 'recharge_promo',
                    type: 'text',
                    placeholder: 'Enter KOLKATA50, ODOOFLEET, or CARPOOLWB',
                    className: `w-full rounded-2xl py-3 px-3.5 uppercase font-mono font-bold ${isLight ? 'bg-white border-slate-300 text-black placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'} border`,
                  })
                )
              ),

              // Coupon Chips
              React.createElement(
                'div',
                { className: 'flex flex-wrap items-center gap-2' },
                React.createElement('span', { className: `text-[10px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}` }, 'Active Coupons:'),
                ['KOLKATA50 (Flat ₹50 Bonus)', 'ODOOFLEET (₹100 Corporate Match)', 'CARPOOLWB (10% Cashback)'].map((c) =>
                  React.createElement(
                    'button',
                    {
                      key: c,
                      type: 'button',
                      onClick: (e) => {
                        const promoInput = e.currentTarget.closest('form').querySelector('input[name="recharge_promo"]');
                        if (promoInput) promoInput.value = c.split(' ')[0];
                      },
                      className: `px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border transition ${isLight ? 'bg-yellow-50 border-yellow-300 text-yellow-900 hover:bg-yellow-100' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'}`,
                    },
                    `⚡ ${c}`
                  )
                )
              ),

              // Action Recharge Button
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: `w-full py-4 rounded-2xl ${
                    isLight
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-xl shadow-yellow-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-600/30'
                  } text-sm transition hover:scale-[1.01] flex items-center justify-center gap-2`,
                },
                React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
                '⚡ Recharge Wallet Now'
              )
            )
          ),

          // TRANSACTION HISTORY & LEDGER
          React.createElement(
            'div',
            { className: `p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'} space-y-4` },
            React.createElement(
              'div',
              { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-lg font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Wallet Transaction Ledger'),
                React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Detailed record of all top-ups, subsidies, and ride auto-debits with GST tax invoices.')
              ),
              React.createElement(
                'div',
                { className: 'flex flex-wrap items-center gap-2 w-full sm:w-auto' },
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Search transaction or ref ID...',
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: `rounded-xl py-1.5 px-3 ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border`,
                }),
                React.createElement(
                  'div',
                  { className: `flex items-center rounded-xl border p-1 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'}` },
                  ['all', 'credit', 'debit'].map((t) =>
                    React.createElement(
                      'button',
                      {
                        key: t,
                        onClick: () => setFilterType(t),
                        className: `px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition ${
                          filterType === t
                            ? isLight
                              ? 'bg-yellow-400 text-black shadow-sm'
                              : 'bg-blue-600 text-white shadow-sm'
                            : isLight
                            ? 'text-slate-600 hover:text-black'
                            : 'text-slate-400 hover:text-white'
                        }`,
                      },
                      t
                    )
                  )
                )
              )
            ),

            // Transactions Table
            React.createElement(
              'div',
              { className: 'overflow-x-auto' },
              React.createElement(
                'table',
                { className: 'w-full text-left text-xs' },
                React.createElement(
                  'thead',
                  { className: `border-b ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'} font-bold uppercase text-[10px]` },
                  React.createElement(
                    'tr',
                    null,
                    React.createElement('th', { className: 'py-3 px-4' }, 'Reference ID'),
                    React.createElement('th', { className: 'py-3 px-4' }, 'Description / Route'),
                    React.createElement('th', { className: 'py-3 px-4' }, 'Date & Time'),
                    React.createElement('th', { className: 'py-3 px-4' }, 'Method'),
                    React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Amount (₹)'),
                    React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Action')
                  )
                ),
                React.createElement(
                  'tbody',
                  { className: `divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}` },
                  filteredTxs.map((tx) => {
                    const isCredit = tx.type === 'credit';
                    return React.createElement(
                      'tr',
                      { key: tx.id, className: isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40' },
                      React.createElement('td', { className: `py-3.5 px-4 font-mono font-bold ${isLight ? 'text-black' : 'text-white'}` }, tx.referenceId || 'TXN-KOL-884921'),
                      React.createElement('td', { className: `py-3.5 px-4 font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}` }, tx.description),
                      React.createElement('td', { className: `py-3.5 px-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, tx.timestamp),
                      React.createElement('td', { className: 'py-3.5 px-4' }, React.createElement('span', { className: `px-2 py-0.5 rounded-full font-bold text-[10px] ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-300'}` }, tx.paymentMethod || 'UPI')),
                      React.createElement('td', { className: `py-3.5 px-4 text-right font-mono font-extrabold text-sm ${isCredit ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-rose-500'}` }, `${isCredit ? '+' : '-'}₹${tx.amount}`),
                      React.createElement(
                        'td',
                        { className: 'py-3.5 px-4 text-center' },
                        React.createElement(
                          'button',
                          {
                            onClick: () => {
                              toast.show('Tax Invoice Generated', `GST Invoice for ${tx.referenceId || tx.id} ready.`);
                            },
                            className: `px-3 py-1 rounded-xl text-[10px] font-bold border transition ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`,
                          },
                          '📄 Receipt'
                        )
                      )
                    );
                  })
                )
              )
            )
          )
        );
      }

      // 8.5. Payment Methods Page (/payment-methods)
      if (route === '/payment-methods') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto pb-12 text-xs' },
          // Header
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-black' : 'text-white'} tracking-tight` }, 'Payment Methods'),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Manage your payment options')
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement(
                'div',
                { className: `hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'} font-semibold text-xs` },
                React.createElement(Icon, { name: 'shield', className: 'w-4 h-4 text-emerald-500' }),
                React.createElement('span', null, '256-Bit Encrypted')
              ),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    resetPmForm();
                    setShowAddMethod(true);
                  },
                  className: `flex items-center gap-2 px-5 py-2.5 rounded-2xl ${
                    isLight
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md'
                      : 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30'
                  } transition hover:scale-105`,
                },
                React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
                React.createElement('span', null, '+ Add Payment Method')
              )
            )
          ),

          // 4 Primary Overview Options
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
            // Card 1: UPI
            React.createElement(
              'div',
              { className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-xl text-white'} space-y-3` },
              React.createElement('div', { className: `p-3 rounded-2xl ${isLight ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'} w-fit` }, React.createElement(Icon, { name: 'qrcode', className: 'w-6 h-6' })),
              React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'UPI & QR Scan'),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed` }, 'Instant zero-fee settlement via PhonePe, Google Pay, Paytm, or BHIM.')
            ),
            // Card 2: Cards
            React.createElement(
              'div',
              { className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-xl text-white'} space-y-3` },
              React.createElement('div', { className: `p-3 rounded-2xl ${isLight ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'} w-fit` }, React.createElement(Icon, { name: 'creditcard', className: 'w-6 h-6' })),
              React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Cards (Debit/Credit)'),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed` }, 'Corporate Visa, Mastercard, and RuPay auto-billing with monthly expense receipts.')
            ),
            // Card 3: Wallet
            React.createElement(
              'div',
              { className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-xl text-white'} space-y-3` },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between' },
                React.createElement('div', { className: `p-3 rounded-2xl ${isLight ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'} w-fit` }, React.createElement(Icon, { name: 'wallet', className: 'w-6 h-6' })),
                React.createElement('span', { className: `font-mono font-bold text-xs ${isLight ? 'text-emerald-700' : 'text-emerald-400'}` }, `₹${currentUser.walletBalance?.toLocaleString() || '1,850'}`)
              ),
              React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Carpool Wallet'),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed` }, 'Pre-loaded corporate mobility balance with instant 1-click fare auto-deductions.')
            ),
            // Card 4: Net Banking
            React.createElement(
              'div',
              { className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-xl text-white'} space-y-3` },
              React.createElement('div', { className: `p-3 rounded-2xl ${isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'} w-fit` }, React.createElement(Icon, { name: 'building', className: 'w-6 h-6' })),
              React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Net Banking'),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed` }, 'Direct debit support across SBI, HDFC, ICICI, Axis, and all major Indian banks.')
            )
          ),

          // Connected Wallet Highlight Banner
          React.createElement(
            'div',
            {
              className: `rounded-3xl border p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isLight
                  ? 'bg-gradient-to-r from-white via-slate-50 to-purple-50/50 border-slate-200 text-slate-900'
                  : 'bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border-slate-800 text-white'
              }`,
            },
            React.createElement(
              'div',
              { className: 'flex items-center gap-4' },
              React.createElement(
                'div',
                { className: `p-3.5 rounded-2xl ${isLight ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}` },
                React.createElement(Icon, { name: 'wallet', className: 'w-7 h-7' })
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('h2', { className: `text-lg font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Carpool Corporate Mobility Wallet'),
                  React.createElement('span', { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}` }, '⚡ Auto-Debit Active')
                ),
                React.createElement(
                  'p',
                  { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-0.5` },
                  'Available Mobility Funds: ',
                  React.createElement('span', { className: `font-mono font-bold text-sm ${isLight ? 'text-emerald-700' : 'text-emerald-400'}` }, `₹${currentUser.walletBalance?.toLocaleString() || '1,850'}`),
                  ' • Pre-configured for zero-friction ride checkout'
                )
              )
            ),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/wallet'),
                className: `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`,
              },
              React.createElement('span', null, 'Use Wallet / Top-Up'),
              React.createElement(Icon, { name: 'externalLink', className: 'w-3.5 h-3.5' })
            )
          ),

          // Saved Payment Methods Section
          React.createElement(
            'div',
            { className: `rounded-3xl border p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-5 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'}` },
            React.createElement(
              'div',
              { className: `flex items-center justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}` },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Saved Payment Methods'),
                React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-0.5` }, 'Manage default cards, verified UPI IDs, and bank gateways')
              ),
              React.createElement(
                'span',
                { className: `px-3 py-1 rounded-full font-mono text-xs font-bold border ${isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'}` },
                `${paymentMethods.length} Active`
              )
            ),

            paymentMethods.length === 0
              ? React.createElement(
                  'div',
                  { className: 'py-12 text-center space-y-3' },
                  React.createElement('div', { className: `w-12 h-12 rounded-full ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'} flex items-center justify-center mx-auto` }, React.createElement(Icon, { name: 'creditcard', className: 'w-6 h-6' })),
                  React.createElement('h4', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'No payment methods saved yet'),
                  React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-sm mx-auto` }, 'Add your UPI handle or corporate card to enjoy zero-friction carpool commute payments in Kolkata.'),
                  React.createElement(
                    'button',
                    {
                      onClick: () => {
                        resetPmForm();
                        setShowAddMethod(true);
                      },
                      className: `mt-2 px-4 py-2 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold'} text-xs`,
                    },
                    '+ Add Payment Method'
                  )
                )
              : React.createElement(
                  'div',
                  { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                  paymentMethods.map((m) => {
                    const isUpi = m.type === 'UPI';
                    const isCard = m.type === 'Card';
                    const isNet = m.type === 'NetBanking';
                    const isWall = m.type === 'Wallet';

                    return React.createElement(
                      'div',
                      {
                        key: m.id,
                        className: `p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                          m.isDefault
                            ? isLight
                              ? 'bg-yellow-50/70 border-yellow-400 ring-2 ring-yellow-400/30 shadow-md'
                              : 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                            : isLight
                            ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`,
                      },
                      React.createElement(
                        'div',
                        { className: 'flex items-start justify-between gap-3' },
                        React.createElement(
                          'div',
                          { className: 'flex items-center gap-3' },
                          React.createElement(
                            'div',
                            {
                              className: `p-3 rounded-2xl border ${
                                isUpi
                                  ? isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                                  : isCard
                                  ? isLight ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                  : isNet
                                  ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : isLight ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                              }`,
                            },
                            isUpi && React.createElement(Icon, { name: 'qrcode', className: 'w-5 h-5' }),
                            isCard && React.createElement(Icon, { name: 'creditcard', className: 'w-5 h-5' }),
                            isNet && React.createElement(Icon, { name: 'building', className: 'w-5 h-5' }),
                            isWall && React.createElement(Icon, { name: 'wallet', className: 'w-5 h-5' })
                          ),
                          React.createElement(
                            'div',
                            null,
                            React.createElement(
                              'div',
                              { className: 'flex items-center gap-2' },
                              React.createElement('h4', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, m.title),
                              m.isDefault &&
                                React.createElement(
                                  'span',
                                  { className: `px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${isLight ? 'bg-yellow-200 text-yellow-950 border-yellow-400' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}` },
                                  React.createElement(Icon, { name: 'star', className: 'w-3 h-3 fill-current' }),
                                  'Default'
                                )
                            ),
                            React.createElement('p', { className: `font-mono text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'} mt-1` }, m.details)
                          )
                        ),
                        React.createElement(
                          'div',
                          { className: 'shrink-0' },
                          React.createElement(
                            'span',
                            { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-800 text-emerald-400 border-slate-700'}` },
                            React.createElement(Icon, { name: 'check', className: 'w-3 h-3 text-emerald-500' }),
                            'Verified'
                          )
                        )
                      ),

                      // Metadata line for cards
                      isCard &&
                        m.cardExpiry &&
                        React.createElement(
                          'div',
                          { className: `flex items-center justify-between text-[11px] font-mono pt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}` },
                          React.createElement('span', null, 'Brand: ', React.createElement('strong', { className: isLight ? 'text-black' : 'text-slate-200' }, m.cardBrand || 'Corporate Visa')),
                          React.createElement('span', null, 'Expires: ', React.createElement('strong', { className: isLight ? 'text-black' : 'text-slate-200' }, m.cardExpiry))
                        ),

                      // Card Actions Footer
                      React.createElement(
                        'div',
                        { className: `flex items-center justify-between pt-3 border-t gap-2 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}` },
                        React.createElement(
                          'div',
                          { className: 'flex items-center gap-2' },
                          isUpi &&
                            m.upiId &&
                            React.createElement(
                              'button',
                              {
                                onClick: () => handleCopyUpiMethod(m.upiId, m.id),
                                className: `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                  isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                }`,
                                title: 'Copy UPI Handle',
                              },
                              copiedMethodId === m.id
                                ? React.createElement(Icon, { name: 'check', className: 'w-3.5 h-3.5 text-emerald-500' })
                                : React.createElement(Icon, { name: 'copy', className: 'w-3.5 h-3.5' }),
                              React.createElement('span', null, copiedMethodId === m.id ? 'Copied' : 'Copy')
                            ),

                          isWall &&
                            React.createElement(
                              'button',
                              {
                                onClick: () => navigate('/wallet'),
                                className: `px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                  isLight ? 'bg-yellow-400 text-black border-yellow-500 font-extrabold' : 'bg-purple-600/30 text-purple-300 border-purple-500/40 hover:bg-purple-600 hover:text-white'
                                }`,
                              },
                              'Manage Wallet'
                            ),

                          !isWall &&
                            (!m.isDefault ? (
                              React.createElement(
                                'button',
                                {
                                  onClick: () => handleSetDefaultMethod(m.id),
                                  className: `px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                                    isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                                  }`,
                                },
                                'Set as Default'
                              )
                            ) : (
                              React.createElement('span', { className: `text-[11px] font-semibold px-2 ${isLight ? 'text-slate-600' : 'text-slate-500'}` }, 'Primary Method')
                            ))
                        ),

                        React.createElement(
                          'button',
                          {
                            onClick: () => setDeleteTargetMethod(m),
                            className: 'p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition',
                            title: 'Remove payment method',
                          },
                          React.createElement(Icon, { name: 'trash', className: 'w-4 h-4' })
                        )
                      )
                    );
                  })
                )
          )
        );
      }

      // =========================================================================
      // 8.6. REPORTS PAGE (/reports) — Comprehensive Real-Data Analytics
      // =========================================================================
      if (route === '/reports') {
        const metrics = store.calculateUserAnalytics(currentUser.id, reportRange);
        const hasData = metrics.totalRides > 0;

        const timeFilterOptions = [
          { label: 'Last 7 Days', value: '7d' },
          { label: 'Last 30 Days', value: '30d' },
          { label: 'Last 3 Months', value: '3m' },
          { label: 'Last 6 Months', value: '6m' },
          { label: 'Last 1 Year', value: '1y' },
          { label: 'All Time', value: 'all' },
        ];

        const months = ['March', 'April', 'May', 'June', 'July', 'August'];
        const monthlyData = months.map((m, idx) => {
          const mult = (idx + 1) / months.length;
          const count = Math.max(1, Math.round(metrics.totalRides * mult * 0.35 + (idx % 2 === 0 ? 3 : 1)));
          const spent = Math.round(metrics.totalSpent * mult * 0.3 + (idx * 120));
          const earned = Math.round(metrics.totalEarned * mult * 0.25 + (idx * 150));
          return {
            month: `${m} 2026`,
            rides: count,
            completed: Math.max(1, count - (idx % 3 === 0 ? 1 : 0)),
            spent,
            earned,
            netSaved: Math.round(spent * 0.42 + 250),
          };
        });

        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-6xl mx-auto pb-12 text-xs' },
          // Header
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                React.createElement('h1', { className: `text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-black' : 'text-white'} tracking-tight` }, 'Mobility Analytics & Reports'),
                React.createElement('span', { className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}` }, 'Live Data')
              ),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Real-time commute efficiency, trip expenditures, driver revenue, and ESG metrics for ', React.createElement('strong', { className: isLight ? 'text-black' : 'text-slate-200' }, currentUser.name), '.')
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2.5' },
              React.createElement(
                'button',
                {
                  onClick: handleExportReportCSV,
                  className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 shadow-md'} transition hover:scale-105`,
                },
                React.createElement(Icon, { name: 'download', className: `w-4 h-4 ${isLight ? 'text-black' : 'text-cyan-400'}` }),
                React.createElement('span', null, 'Export Report CSV')
              )
            )
          ),

          // Period Filter Toolbar
          React.createElement(
            'div',
            { className: `flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/80 border-slate-800 shadow-lg'} backdrop-blur-xl` },
            React.createElement(
              'div',
              { className: `flex items-center gap-2 ${isLight ? 'text-slate-700' : 'text-slate-400'} font-semibold` },
              React.createElement(Icon, { name: 'calendar', className: `w-4 h-4 ${isLight ? 'text-yellow-600' : 'text-cyan-400'}` }),
              React.createElement('span', null, 'Select Period:')
            ),
            React.createElement(
              'div',
              { className: 'flex flex-wrap items-center gap-1.5' },
              timeFilterOptions.map((opt) =>
                React.createElement(
                  'button',
                  {
                    key: opt.value,
                    onClick: () => setReportRange(opt.value),
                    className: `px-3.5 py-1.5 rounded-xl font-bold transition text-xs ${
                      reportRange === opt.value
                        ? isLight
                          ? 'bg-yellow-400 text-black shadow-md border border-yellow-500'
                          : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`,
                  },
                  opt.label
                )
              )
            )
          ),

          // Empty State or Real Content
          !hasData
            ? React.createElement(
                'div',
                { className: `p-12 text-center rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} space-y-4` },
                React.createElement('div', { className: `w-16 h-16 rounded-3xl ${isLight ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-500/10 text-blue-400'} flex items-center justify-center mx-auto` }, React.createElement(Icon, { name: 'car', className: 'w-8 h-8' })),
                React.createElement(
                  'div',
                  { className: 'space-y-1' },
                  React.createElement('h3', { className: `text-lg font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'No ride data available yet'),
                  React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-md mx-auto` }, 'Complete your first ride or publish a carpool commute to start generating your personal analytics.')
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-center gap-3 pt-2' },
                  React.createElement('button', { onClick: () => navigate('/find-ride'), className: 'px-5 py-2.5 rounded-2xl bg-yellow-400 text-black font-bold shadow-md' }, 'Find a Ride'),
                  React.createElement('button', { onClick: () => navigate('/offer-ride'), className: 'px-5 py-2.5 rounded-2xl bg-slate-800 text-white font-bold' }, 'Offer a Ride')
                )
              )
            : React.createElement(
                React.Fragment,
                null,
                // 8 Summary Cards Grid
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
                  React.createElement(StatCard, { isLight, title: 'Total Rides', value: metrics.totalRides, subtitle: `${metrics.completedRides} done • ${metrics.pendingRides} queued`, iconName: 'car', colorScheme: 'blue' }),
                  React.createElement(StatCard, { isLight, title: 'Completed Rides', value: metrics.completedRides, subtitle: `${metrics.totalRides > 0 ? Math.round((metrics.completedRides / metrics.totalRides) * 100) : 100}% Success rate`, iconName: 'activity', colorScheme: 'emerald' }),
                  React.createElement(StatCard, { isLight, title: 'Cancelled Rides', value: metrics.cancelledRides, subtitle: '100% Refunded to wallet', iconName: 'shield', colorScheme: 'purple' }),
                  React.createElement(StatCard, { isLight, title: 'Total Distance', value: `${metrics.totalDistanceKm} km`, subtitle: `Avg ${metrics.avgDistanceKm} km/ride`, iconName: 'compass', colorScheme: 'cyan' }),
                  React.createElement(StatCard, { isLight, title: 'Total Amount Spent', value: `₹${metrics.totalSpent.toLocaleString()}`, subtitle: 'Commute passenger fares', iconName: 'wallet', colorScheme: 'yellow' }),
                  React.createElement(StatCard, { isLight, title: 'Total Amount Earned', value: `₹${metrics.totalEarned.toLocaleString()}`, subtitle: 'From offered pooled seats', iconName: 'banknote', colorScheme: 'emerald' }),
                  React.createElement(StatCard, { isLight, title: 'Average Fare', value: `₹${metrics.averageFare}`, subtitle: 'Per pooled journey', iconName: 'chart', colorScheme: 'purple' }),
                  React.createElement(StatCard, { isLight, title: 'Average Rating', value: `⭐ ${metrics.averageRating.toFixed(1)}`, subtitle: `${metrics.co2SavedKg} kg CO₂ saved`, iconName: 'star', colorScheme: 'cyan' })
                ),

                // 6 Responsive SVG Charts Grid
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
                  // Chart 1: Line Chart
                  React.createElement(
                    'div',
                    { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                    React.createElement(
                      'div',
                      { className: 'flex items-center justify-between' },
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'} flex items-center gap-2` }, React.createElement(Icon, { name: 'chart', className: 'w-4 h-4 text-blue-400' }), React.createElement('span', null, '1. Rides Over Time')),
                        React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Daily and monthly ride progression')
                      ),
                      React.createElement(
                        'div',
                        { className: `flex items-center gap-1 p-1 rounded-xl border text-[10px] ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}` },
                        React.createElement('button', { onClick: () => setReportChartView('daily'), className: `px-2.5 py-1 rounded-lg font-bold ${reportChartView === 'daily' ? (isLight ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white') : (isLight ? 'text-slate-600' : 'text-slate-400')}` }, 'Daily'),
                        React.createElement('button', { onClick: () => setReportChartView('monthly'), className: `px-2.5 py-1 rounded-lg font-bold ${reportChartView === 'monthly' ? (isLight ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white') : (isLight ? 'text-slate-600' : 'text-slate-400')}` }, 'Monthly')
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'h-60 w-full pt-2' },
                      React.createElement(
                        'svg',
                        { className: 'w-full h-full overflow-visible', viewBox: '0 0 500 180' },
                        React.createElement(
                          'defs',
                          null,
                          React.createElement(
                            'linearGradient',
                            { id: 'rideLineGradMain', x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
                            React.createElement('stop', { offset: '0%', stopColor: '#3b82f6', stopOpacity: '0.4' }),
                            React.createElement('stop', { offset: '100%', stopColor: '#3b82f6', stopOpacity: '0.0' })
                          )
                        ),
                        React.createElement('line', { x1: '40', y1: '20', x2: '480', y2: '20', stroke: isLight ? '#e2e8f0' : '#1e293b', strokeDasharray: '3,3' }),
                        React.createElement('line', { x1: '40', y1: '60', x2: '480', y2: '60', stroke: isLight ? '#e2e8f0' : '#1e293b', strokeDasharray: '3,3' }),
                        React.createElement('line', { x1: '40', y1: '100', x2: '480', y2: '100', stroke: isLight ? '#e2e8f0' : '#1e293b', strokeDasharray: '3,3' }),
                        React.createElement('line', { x1: '40', y1: '140', x2: '480', y2: '140', stroke: isLight ? '#e2e8f0' : '#1e293b', strokeDasharray: '3,3' }),
                        React.createElement('path', { d: 'M 60,130 L 130,105 L 200,115 L 270,75 L 340,55 L 410,40 L 470,30 L 470,150 L 60,150 Z', fill: 'url(#rideLineGradMain)' }),
                        React.createElement('path', { d: 'M 60,130 L 130,105 L 200,115 L 270,75 L 340,55 L 410,40 L 470,30', fill: 'none', stroke: '#3b82f6', strokeWidth: '3', strokeLinecap: 'round' }),
                        [
                          { cx: 60, cy: 130, val: 2, label: 'W1' },
                          { cx: 130, cy: 105, val: 4, label: 'W2' },
                          { cx: 200, cy: 115, val: 3, label: 'W3' },
                          { cx: 270, cy: 75, val: 6, label: 'W4' },
                          { cx: 340, cy: 55, val: 8, label: 'W5' },
                          { cx: 410, cy: 40, val: 11, label: 'W6' },
                          { cx: 470, cy: 30, val: 14, label: 'Now' },
                        ].map((p, i) =>
                          React.createElement(
                            'g',
                            { key: i },
                            React.createElement('circle', { cx: p.cx, cy: p.cy, r: '4', fill: '#60a5fa', stroke: isLight ? '#ffffff' : '#0f172a', strokeWidth: '2' }),
                            React.createElement('text', { x: p.cx, y: p.cy - 8, fill: isLight ? '#1e40af' : '#93c5fd', fontSize: '10', fontWeight: 'bold', textAnchor: 'middle' }, p.val),
                            React.createElement('text', { x: p.cx, y: '165', fill: isLight ? '#64748b' : '#64748b', fontSize: '9', textAnchor: 'middle' }, p.label)
                          )
                        )
                      )
                    )
                  ),

                  // Chart 2: Bar Chart (Spending)
                  React.createElement(
                    'div',
                    { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                    React.createElement(
                      'div',
                      { className: 'flex items-center justify-between' },
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'} flex items-center gap-2` }, React.createElement(Icon, { name: 'banknote', className: 'w-4 h-4 text-emerald-400' }), React.createElement('span', null, '2. Spending Analysis')),
                        React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Monthly carpooling expenditure in INR (₹)')
                      ),
                      React.createElement('span', { className: `font-mono font-bold text-xs ${isLight ? 'text-emerald-800 bg-emerald-100 border-emerald-300' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'} px-2.5 py-1 rounded-full border` }, `₹${metrics.totalSpent} Total`)
                    ),
                    React.createElement(
                      'div',
                      { className: 'h-60 w-full pt-2' },
                      React.createElement(
                        'svg',
                        { className: 'w-full h-full overflow-visible', viewBox: '0 0 500 180' },
                        React.createElement('line', { x1: '40', y1: '145', x2: '480', y2: '145', stroke: isLight ? '#cbd5e1' : '#334155', strokeWidth: '1' }),
                        [
                          { month: 'Mar', spent: 340, x: 60, h: 55 },
                          { month: 'Apr', spent: 480, x: 130, h: 75 },
                          { month: 'May', spent: 620, x: 200, h: 95 },
                          { month: 'Jun', spent: 850, x: 270, h: 120 },
                          { month: 'Jul', spent: 960, x: 340, h: 130 },
                          { month: 'Aug', spent: metrics.totalSpent, x: 410, h: 140 },
                        ].map((b, idx) =>
                          React.createElement(
                            'g',
                            { key: idx },
                            React.createElement('rect', { x: b.x, y: 145 - b.h, width: '36', height: b.h, rx: '8', fill: idx === 5 ? '#10b981' : '#059669', opacity: 0.85 }),
                            React.createElement('text', { x: b.x + 18, y: 140 - b.h, fill: isLight ? '#065f46' : '#6ee7b7', fontSize: '9', fontWeight: 'bold', textAnchor: 'middle' }, `₹${b.spent}`),
                            React.createElement('text', { x: b.x + 18, y: '162', fill: isLight ? '#475569' : '#94a3b8', fontSize: '10', textAnchor: 'middle' }, b.month)
                          )
                        )
                      )
                    )
                  ),

                  // Chart 3: Donut Chart
                  React.createElement(
                    'div',
                    { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'} flex items-center gap-2` }, React.createElement(Icon, { name: 'pieChart', className: 'w-4 h-4 text-purple-400' }), React.createElement('span', null, '3. Ride Status Distribution')),
                      React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Completed vs Cancelled vs Pending proportions')
                    ),
                    React.createElement(
                      'div',
                      { className: 'flex flex-col sm:flex-row items-center justify-around gap-6 h-60' },
                      React.createElement(
                        'div',
                        { className: 'relative w-40 h-40 shrink-0' },
                        React.createElement(
                          'svg',
                          { className: 'w-full h-full -rotate-90', viewBox: '0 0 100 100' },
                          React.createElement('circle', { cx: '50', cy: '50', r: '38', fill: 'transparent', stroke: isLight ? '#f1f5f9' : '#1e293b', strokeWidth: '14' }),
                          React.createElement('circle', {
                            cx: '50',
                            cy: '50',
                            r: '38',
                            fill: 'transparent',
                            stroke: '#10b981',
                            strokeWidth: '14',
                            strokeDasharray: '238.7',
                            strokeDashoffset: 238.7 * (1 - (metrics.completedRides || 1) / (metrics.totalRides || 1)),
                            strokeLinecap: 'round',
                          })
                        ),
                        React.createElement(
                          'div',
                          { className: 'absolute inset-0 flex flex-col items-center justify-center pointer-events-none' },
                          React.createElement('span', { className: `text-xl font-extrabold ${isLight ? 'text-black' : 'text-white'} font-mono` }, metrics.totalRides),
                          React.createElement('span', { className: 'text-[9px] text-slate-400 uppercase font-bold' }, 'Total Rides')
                        )
                      ),
                      React.createElement(
                        'div',
                        { className: 'space-y-3 w-full max-w-xs' },
                        React.createElement(
                          'div',
                          { className: `flex items-center justify-between p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}` },
                          React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'w-3 h-3 rounded-full bg-emerald-500' }), React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Completed')),
                          React.createElement('span', { className: 'font-mono font-extrabold text-emerald-500' }, `${metrics.completedRides} rides (${metrics.totalRides > 0 ? Math.round((metrics.completedRides / metrics.totalRides) * 100) : 100}%)`)
                        ),
                        React.createElement(
                          'div',
                          { className: `flex items-center justify-between p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}` },
                          React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'w-3 h-3 rounded-full bg-rose-500' }), React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Cancelled')),
                          React.createElement('span', { className: 'font-mono font-extrabold text-rose-400' }, `${metrics.cancelledRides} rides (${metrics.totalRides > 0 ? Math.round((metrics.cancelledRides / metrics.totalRides) * 100) : 0}%)`)
                        ),
                        React.createElement(
                          'div',
                          { className: `flex items-center justify-between p-2 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'}` },
                          React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'w-3 h-3 rounded-full bg-blue-500' }), React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Upcoming')),
                          React.createElement('span', { className: 'font-mono font-extrabold text-blue-400' }, `${metrics.pendingRides} rides`)
                        )
                      )
                    )
                  ),

                  // Chart 4: Corridors
                  React.createElement(
                    'div',
                    { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'} flex items-center gap-2` }, React.createElement(Icon, { name: 'activity', className: 'w-4 h-4 text-cyan-400' }), React.createElement('span', null, '4. Corridor Route Utilization')),
                      React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Park Street ↔ Sector V and New Town corridor flows')
                    ),
                    React.createElement(
                      'div',
                      { className: 'space-y-4 pt-2' },
                      React.createElement(
                        'div',
                        null,
                        React.createElement('div', { className: 'flex justify-between text-xs mb-1.5 font-bold' }, React.createElement('span', { className: isLight ? 'text-slate-800' : 'text-slate-300' }, 'Park Street ↔ Sector V Corridor'), React.createElement('span', { className: 'text-cyan-400 font-mono' }, '68% frequency')),
                        React.createElement('div', { className: `w-full ${isLight ? 'bg-slate-100' : 'bg-slate-950'} rounded-full h-3 overflow-hidden border border-slate-800` }, React.createElement('div', { className: 'bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-[68%]' }))
                      ),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('div', { className: 'flex justify-between text-xs mb-1.5 font-bold' }, React.createElement('span', { className: isLight ? 'text-slate-800' : 'text-slate-300' }, 'Howrah Station ↔ New Town Eco Space'), React.createElement('span', { className: 'text-emerald-400 font-mono' }, '22% frequency')),
                        React.createElement('div', { className: `w-full ${isLight ? 'bg-slate-100' : 'bg-slate-950'} rounded-full h-3 overflow-hidden border border-slate-800` }, React.createElement('div', { className: 'bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full w-[22%]' }))
                      ),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('div', { className: 'flex justify-between text-xs mb-1.5 font-bold' }, React.createElement('span', { className: isLight ? 'text-slate-800' : 'text-slate-300' }, 'Gariahat ↔ Kolkata Tech Hub'), React.createElement('span', { className: 'text-purple-400 font-mono' }, '10% frequency')),
                        React.createElement('div', { className: `w-full ${isLight ? 'bg-slate-100' : 'bg-slate-950'} rounded-full h-3 overflow-hidden border border-slate-800` }, React.createElement('div', { className: 'bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full w-[10%]' }))
                      )
                    )
                  ),

                  // Chart 5: Distance Analysis
                  React.createElement(
                    'div',
                    { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'} flex items-center gap-2` }, React.createElement(Icon, { name: 'compass', className: 'w-4 h-4 text-amber-400' }), React.createElement('span', null, '5. Distance & ESG Eco Savings')),
                      React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Commute kilometers, travel duration, and carbon reduction')
                    ),
                    React.createElement(
                      'div',
                      { className: 'grid grid-cols-2 gap-3 pt-2' },
                      React.createElement(
                        'div',
                        { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} space-y-1` },
                        React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500' }, 'Cumulative Distance'),
                        React.createElement('div', { className: `text-xl font-extrabold ${isLight ? 'text-black' : 'text-white'} font-mono` }, `${metrics.totalDistanceKm} km`),
                        React.createElement('span', { className: 'text-[10px] text-emerald-500 font-semibold' }, 'Shared over EM Bypass')
                      ),
                      React.createElement(
                        'div',
                        { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} space-y-1` },
                        React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500' }, 'Avg Trip Distance'),
                        React.createElement('div', { className: 'text-xl font-extrabold text-cyan-400 font-mono' }, `${metrics.avgDistanceKm} km`),
                        React.createElement('span', { className: 'text-[10px] text-slate-500' }, '~26 mins duration')
                      ),
                      React.createElement(
                        'div',
                        { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} space-y-1` },
                        React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500' }, 'CO₂ Avoided'),
                        React.createElement('div', { className: 'text-xl font-extrabold text-teal-400 font-mono' }, `${metrics.co2SavedKg} kg`),
                        React.createElement('span', { className: 'text-[10px] text-teal-500' }, 'Equivalent to 4 trees')
                      ),
                      React.createElement(
                        'div',
                        { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'} space-y-1` },
                        React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500' }, 'Fuel Conserved'),
                        React.createElement('div', { className: 'text-xl font-extrabold text-amber-400 font-mono' }, `${Math.round((metrics.totalDistanceKm / 14.5) * 10) / 10} L`),
                        React.createElement('span', { className: 'text-[10px] text-amber-500' }, '₹106.03/L benchmark')
                      )
                    )
                  ),

                  // Chart 6: Monthly Summary Table
                  React.createElement(
                    'div',
                    { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'} flex items-center gap-2` }, React.createElement(Icon, { name: 'sparkles', className: 'w-4 h-4 text-emerald-400' }), React.createElement('span', null, '6. Monthly Financial Breakdown')),
                      React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Earnings, expenditures, and net employee savings')
                    ),
                    React.createElement(
                      'div',
                      { className: 'overflow-x-auto' },
                      React.createElement(
                        'table',
                        { className: 'w-full text-left text-xs' },
                        React.createElement(
                          'thead',
                          { className: `border-b ${isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'} font-bold uppercase text-[10px]` },
                          React.createElement(
                            'tr',
                            null,
                            React.createElement('th', { className: 'py-2.5 px-3' }, 'Month'),
                            React.createElement('th', { className: 'py-2.5 px-3' }, 'Rides'),
                            React.createElement('th', { className: 'py-2.5 px-3' }, 'Spent'),
                            React.createElement('th', { className: 'py-2.5 px-3' }, 'Earned'),
                            React.createElement('th', { className: 'py-2.5 px-3 text-right text-emerald-400' }, 'Savings')
                          )
                        ),
                        React.createElement(
                          'tbody',
                          { className: `divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'} font-mono` },
                          monthlyData.map((row, i) =>
                            React.createElement(
                              'tr',
                              { key: i, className: isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40' },
                              React.createElement('td', { className: `py-2.5 px-3 font-sans font-bold ${isLight ? 'text-black' : 'text-white'}` }, row.month),
                              React.createElement('td', { className: `py-2.5 px-3 ${isLight ? 'text-slate-700' : 'text-slate-300'}` }, row.rides),
                              React.createElement('td', { className: 'py-2.5 px-3 text-rose-400' }, `₹${row.spent}`),
                              React.createElement('td', { className: 'py-2.5 px-3 text-emerald-400' }, `₹${row.earned}`),
                              React.createElement('td', { className: 'py-2.5 px-3 text-right font-extrabold text-emerald-500' }, `+₹${row.netSaved}`)
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
        );
      }

      // =========================================================================
      // 8.7. HELP & SUPPORT PAGE (/help-chat) — Feedback, Tickets, Care & Helplines
      // =========================================================================
      if (route === '/help-chat') {
        const faqCategoriesList = ['All', 'Ride Issues', 'Payment Issues', 'Driver Issues', 'Passenger Issues', 'Account Issues', 'Cancellation & Refund', 'Technical Problems', 'Other'];
        const faqsList = [
          { id: 'faq-1', category: 'Ride Issues', question: 'How do I locate my driver at Kolkata pickup hubs (e.g. Sector V or Park Street)?', answer: 'Once booked, check the Live Tracking page for real-time GPS telemetry of your vehicle along EM Bypass. You can also view the driver’s vehicle registration number (e.g. WB02AB1234) and exact landmark instructions in your Trip Details.' },
          { id: 'faq-2', category: 'Cancellation & Refund', question: 'What is the corporate carpool cancellation and refund policy?', answer: 'Trips can be cancelled up to 15 minutes before scheduled departure time with an instant 100% refund credited back to your Carpool Corporate Wallet. Driver cancellations result in an immediate automatic refund.' },
          { id: 'faq-3', category: 'Payment Issues', question: 'How does the Wallet Auto-Debit and Razorpay UPI recharge work?', answer: 'Your Carpool Wallet automatically settles trip fares upon booking confirmation. You can top up your balance instantly using UPI (Google Pay, PhonePe, Paytm, BHIM) or corporate cards with zero convenience fees.' },
          { id: 'faq-4', category: 'Driver Issues', question: 'How do I qualify and publish rides as an employee driver in Kolkata?', answer: 'Navigate to "Offer Ride", select your registered corporate vehicle, enter your start corridor and campus destination, set available seats (1–4), and publish. Drivers earn ₹8.50/km in corporate mobility tax credits.' },
          { id: 'faq-5', category: 'Passenger Issues', question: 'What are the passenger cabin etiquette and luggage guidelines?', answer: 'Please arrive 5 minutes prior to scheduled pickup at designated stops. Ensure your registered corporate badge is visible. Clean cabin etiquette is required, and luggage is restricted to standard laptop backpacks and small bags.' },
          { id: 'faq-6', category: 'Account Issues', question: 'How do I update my Kolkata office hub or corporate contact details?', answer: 'Go to Settings > Profile to update your designated office location (Sector V Tech Hub, Park Street, or New Town Campus) or emergency contact phone numbers.' },
          { id: 'faq-7', category: 'Technical Problems', question: 'The live GPS radar is not updating my transit position. What should I do?', answer: 'Verify that browser location services are enabled for localhost/domain. In case of network delays, refresh the route or click "Recalculate Route" on Find Ride.' },
          { id: 'faq-8', category: 'Other', question: 'Are FASTag tolls and fuel subsidies covered by the enterprise?', answer: 'Yes! All fleet and registered employee vehicles utilizing approved carpool corridors have electronic FASTag automated clearance subsidized by the Odoo Enterprise mobility pool.' },
        ];

        const filteredFaqs = faqsList.filter((f) => {
          const matchCat = faqCategory === 'All' || f.category === faqCategory;
          if (!faqSearch) return matchCat;
          const q = faqSearch.toLowerCase();
          return matchCat && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
        });

        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-6xl mx-auto pb-12 text-xs' },
          // Header
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                React.createElement('h1', { className: `text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-black' : 'text-white'} tracking-tight` }, 'Help & Support Center'),
                React.createElement('span', { className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}` }, '24/7 Corporate Desk')
              ),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Search knowledge base, create support tickets, submit feedback, or contact Kolkata customer care.')
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'button',
                {
                  onClick: () => setShowCreateTicket(true),
                  className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30'} transition hover:scale-105`,
                },
                React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
                React.createElement('span', null, '+ Create Support Ticket')
              )
            )
          ),

          // Main Tabs Bar
          React.createElement(
            'div',
            { className: `flex items-center gap-1.5 p-1.5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/80 border-slate-800'} backdrop-blur-xl overflow-x-auto` },
            [
              { id: 'help', label: 'Help Center & FAQs', icon: 'help' },
              { id: 'feedback', label: 'Share Feedback', icon: 'star' },
              { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: 'fileText' },
              { id: 'care', label: 'Customer Care & Live Assistant', icon: 'message' },
              { id: 'helplines', label: '🚨 Important Helplines', icon: 'shield' },
            ].map((tab) =>
              React.createElement(
                'button',
                {
                  key: tab.id,
                  onClick: () => setHelpTab(tab.id),
                  className: `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition shrink-0 ${
                    helpTab === tab.id
                      ? isLight
                        ? 'bg-yellow-400 text-black shadow-md border border-yellow-500'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`,
                },
                React.createElement(Icon, { name: tab.icon, className: 'w-4 h-4' }),
                React.createElement('span', null, tab.label)
              )
            )
          ),

          // TAB 1: HELP CENTER & FAQS
          helpTab === 'help' &&
            React.createElement(
              'div',
              { className: 'space-y-6 animate-fade-in' },
              // Search Bar
              React.createElement(
                'div',
                { className: 'relative' },
                React.createElement(Icon, { name: 'search', className: 'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' }),
                React.createElement('input', {
                  type: 'text',
                  value: faqSearch,
                  onChange: (e) => setFaqSearch(e.target.value),
                  placeholder: 'Search help topics, payment guides, route matching rules, cancellation policies...',
                  className: `w-full ${isLight ? 'bg-white border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'} border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none shadow-xl`,
                })
              ),
              // Category Pills
              React.createElement(
                'div',
                { className: 'flex items-center gap-2 overflow-x-auto pb-1' },
                faqCategoriesList.map((cat) =>
                  React.createElement(
                    'button',
                    {
                      key: cat,
                      onClick: () => setFaqCategory(cat),
                      className: `px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
                        faqCategory === cat
                          ? isLight
                            ? 'bg-yellow-400 text-black border border-yellow-500 shadow-sm'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : isLight
                          ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                      }`,
                    },
                    cat
                  )
                )
              ),
              // Accordion List
              React.createElement(
                'div',
                { className: 'space-y-3' },
                filteredFaqs.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return React.createElement(
                    'div',
                    { key: faq.id, className: `rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-lg'} overflow-hidden transition` },
                    React.createElement(
                      'button',
                      {
                        onClick: () => setExpandedFaqId(isOpen ? null : faq.id),
                        className: `w-full p-4 flex items-center justify-between gap-4 text-left ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'} transition`,
                      },
                      React.createElement(
                        'div',
                        { className: 'flex items-center gap-3' },
                        React.createElement('span', { className: `px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-cyan-400 border border-slate-700'}` }, faq.category),
                        React.createElement('span', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, faq.question)
                      ),
                      React.createElement(Icon, { name: isOpen ? 'chevronUp' : 'chevronDown', className: 'w-4 h-4 text-slate-400 shrink-0' })
                    ),
                    isOpen && React.createElement('div', { className: `px-4 pb-4 pt-1 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'} border-t ${isLight ? 'border-slate-100' : 'border-slate-800/60'} leading-relaxed` }, faq.answer)
                  );
                })
              )
            ),

          // TAB 2: SHARE FEEDBACK
          helpTab === 'feedback' &&
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in' },
              // Form
              React.createElement(
                'div',
                { className: `lg:col-span-7 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 sm:p-7 space-y-5` },
                React.createElement(
                  'div',
                  null,
                  React.createElement('h2', { className: `text-xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Share Your Feedback'),
                  React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Your feedback directly improves vehicle cleanliness, route availability, and driver ratings in Kolkata.')
                ),
                fbSuccess &&
                  React.createElement(
                    'div',
                    { className: 'p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-start gap-3' },
                    React.createElement(Icon, { name: 'check', className: 'w-5 h-5 text-emerald-400 shrink-0 mt-0.5' }),
                    React.createElement(
                      'div',
                      null,
                      React.createElement('div', { className: 'font-bold text-sm text-emerald-400' }, 'Thank you! Your feedback has been submitted successfully.'),
                      React.createElement('div', { className: 'text-xs text-emerald-500 mt-0.5' }, 'Your ratings and suggestions have been securely saved to our database.')
                    )
                  ),
                React.createElement(
                  'form',
                  { onSubmit: handleFeedbackSubmit, className: 'space-y-4' },
                  React.createElement(
                    'div',
                    { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                    React.createElement('div', null, React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Your Name *'), React.createElement('input', { type: 'text', required: true, value: fbName, onChange: (e) => setFbName(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none` })),
                    React.createElement('div', null, React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Corporate Email *'), React.createElement('input', { type: 'email', required: true, value: fbEmail, onChange: (e) => setFbEmail(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none` }))
                  ),
                  React.createElement(
                    'div',
                    { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Category *'),
                      React.createElement(
                        'select',
                        { value: fbCategory, onChange: (e) => setFbCategory(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none` },
                        ['Ride Experience', 'Driver Experience', 'Payment', 'App/Website', 'Customer Support', 'Other'].map((c) => React.createElement('option', { key: c, value: c }, c))
                      )
                    ),
                    React.createElement(
                      'div',
                      null,
                      React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Rating (★★★★★) *'),
                      React.createElement(
                        'div',
                        { className: `flex items-center gap-1.5 p-2 ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'} border rounded-xl` },
                        [1, 2, 3, 4, 5].map((star) =>
                          React.createElement(
                            'button',
                            {
                              key: star,
                              type: 'button',
                              onClick: () => setFbRating(star),
                              className: 'p-1 hover:scale-110 transition',
                            },
                            React.createElement(Icon, { name: 'star', className: `w-5 h-5 ${star <= fbRating ? 'text-amber-400 fill-current' : 'text-slate-600'}` })
                          )
                        ),
                        React.createElement('span', { className: 'ml-2 font-mono font-bold text-xs text-amber-400' }, `${fbRating} / 5.0`)
                      )
                    )
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Feedback Message *'),
                    React.createElement('textarea', {
                      rows: 4,
                      required: true,
                      value: fbMessage,
                      onChange: (e) => setFbMessage(e.target.value),
                      placeholder: 'Share details of your commute, vehicle cleanliness, route suggestions...',
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl p-3.5 text-xs focus:outline-none`,
                    })
                  ),
                  React.createElement(
                    'button',
                    {
                      type: 'submit',
                      disabled: isSubmittingFb,
                      className: `w-full py-3 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30'} transition text-sm flex items-center justify-center gap-2`,
                    },
                    React.createElement(Icon, { name: 'check', className: 'w-4 h-4' }),
                    React.createElement('span', null, isSubmittingFb ? 'Submitting...' : 'Submit Feedback')
                  )
                )
              ),

              // Recent Feedback Community Ledger
              React.createElement(
                'div',
                { className: `lg:col-span-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} p-6 space-y-4` },
                React.createElement(
                  'div',
                  { className: `flex items-center justify-between border-b ${isLight ? 'border-slate-200' : 'border-slate-800'} pb-3` },
                  React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Recent Feedback Submissions'),
                  React.createElement('span', { className: 'text-[10px] font-mono text-slate-400' }, `${feedbacks.length} Saved`)
                ),
                React.createElement(
                  'div',
                  { className: 'space-y-3 max-h-[460px] overflow-y-auto pr-1' },
                  feedbacks.map((f) =>
                    React.createElement(
                      'div',
                      { key: f.id, className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'} space-y-2` },
                      React.createElement(
                        'div',
                        { className: 'flex items-center justify-between' },
                        React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, f.userName),
                        React.createElement(
                          'div',
                          { className: 'flex items-center gap-0.5' },
                          [...Array(f.rating || 5)].map((_, idx) => React.createElement(Icon, { key: idx, name: 'star', className: 'w-3 h-3 text-amber-400 fill-current' }))
                        )
                      ),
                      React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed` }, f.message),
                      React.createElement(
                        'div',
                        { className: 'flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1' },
                        React.createElement('span', { className: `px-2 py-0.5 rounded ${isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-900 text-cyan-400 border border-slate-800'}` }, f.category),
                        React.createElement('span', null, f.createdAt ? f.createdAt.split('T')[0] : '2026-08-01')
                      )
                    )
                  )
                )
              )
            ),

          // TAB 3: SUPPORT TICKETS
          helpTab === 'tickets' &&
            React.createElement(
              'div',
              { className: 'space-y-6 animate-fade-in' },
              React.createElement(
                'div',
                { className: `flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'}` },
                React.createElement(
                  'div',
                  null,
                  React.createElement('h2', { className: `text-lg font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Support Tickets & Service Requests'),
                  React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-0.5` }, 'Track issues with vehicle dispatch, corporate payments, and transit safety tickets.')
                ),
                React.createElement(
                  'button',
                  {
                    onClick: () => setShowCreateTicket(true),
                    className: `flex items-center gap-2 px-4 py-2 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30'} transition text-xs`,
                  },
                  React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
                  React.createElement('span', null, '+ Create Support Ticket')
                )
              ),
              // Tickets Table
              React.createElement(
                'div',
                { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} overflow-hidden` },
                React.createElement(
                  'div',
                  { className: 'overflow-x-auto' },
                  React.createElement(
                    'table',
                    { className: 'w-full text-left text-xs' },
                    React.createElement(
                      'thead',
                      { className: `border-b ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-400'} font-bold uppercase text-[10px]` },
                      React.createElement(
                        'tr',
                        null,
                        React.createElement('th', { className: 'py-3.5 px-4' }, 'Ticket ID'),
                        React.createElement('th', { className: 'py-3.5 px-4' }, 'Subject'),
                        React.createElement('th', { className: 'py-3.5 px-4' }, 'Category'),
                        React.createElement('th', { className: 'py-3.5 px-4' }, 'Priority'),
                        React.createElement('th', { className: 'py-3.5 px-4' }, 'Status'),
                        React.createElement('th', { className: 'py-3.5 px-4' }, 'Created Date'),
                        React.createElement('th', { className: 'py-3.5 px-4 text-center' }, 'Action')
                      )
                    ),
                    React.createElement(
                      'tbody',
                      { className: `divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}` },
                      tickets.map((t) =>
                        React.createElement(
                          'tr',
                          { key: t.id, className: isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40' },
                          React.createElement('td', { className: `py-3.5 px-4 font-mono font-bold ${isLight ? 'text-blue-700' : 'text-cyan-400'}` }, t.ticketNumber),
                          React.createElement('td', { className: `py-3.5 px-4 font-bold ${isLight ? 'text-black' : 'text-white'} max-w-xs truncate` }, t.subject),
                          React.createElement('td', { className: 'py-3.5 px-4' }, React.createElement('span', { className: `px-2 py-0.5 rounded-full ${isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-slate-300 border border-slate-700'} text-[10px]` }, t.category)),
                          React.createElement(
                            'td',
                            { className: 'py-3.5 px-4' },
                            React.createElement(
                              'span',
                              {
                                className: `px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                                  t.priority === 'High' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : t.priority === 'Medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                }`,
                              },
                              t.priority
                            )
                          ),
                          React.createElement(
                            'td',
                            { className: 'py-3.5 px-4' },
                            React.createElement(
                              'span',
                              {
                                className: `px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${
                                  t.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : t.status === 'IN PROGRESS' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : t.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                                }`,
                              },
                              t.status
                            )
                          ),
                          React.createElement('td', { className: 'py-3.5 px-4 font-mono text-slate-400 text-[11px]' }, t.createdAt ? t.createdAt.split('T')[0] : '2026-08-01'),
                          React.createElement(
                            'td',
                            { className: 'py-3.5 px-4 text-center' },
                            React.createElement('button', { onClick: () => setActiveTicketDetail(t), className: `px-3 py-1 rounded-xl font-bold border ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'} transition` }, 'View Thread')
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),

          // TAB 4: CUSTOMER CARE & LIVE AI ASSISTANT
          helpTab === 'care' &&
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in' },
              // Channels
              React.createElement(
                'div',
                { className: 'lg:col-span-5 space-y-4' },
                React.createElement(
                  'div',
                  { className: `p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} space-y-4` },
                  React.createElement(
                    'div',
                    null,
                    React.createElement('h3', { className: `text-base font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Need immediate help?'),
                    React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Connect with our dedicated Kolkata Mobility Operations Team.')
                  ),
                  React.createElement(
                    'div',
                    { className: 'space-y-3' },
                    React.createElement(
                      'a',
                      { href: 'tel:+913340001234', className: `flex items-center gap-3.5 p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200 hover:border-yellow-400' : 'bg-slate-950/80 border-slate-800 hover:border-blue-500/40'} transition group` },
                      React.createElement('div', { className: 'p-3 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:scale-110 transition' }, React.createElement(Icon, { name: 'phone', className: 'w-5 h-5' })),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h4', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, 'Call Customer Care'),
                        React.createElement('p', { className: 'font-mono text-[11px] text-cyan-400' }, '+91 33 4000 1234'),
                        React.createElement('span', { className: 'text-[10px] text-slate-500' }, 'Kolkata Office Desk • 8 AM - 10 PM')
                      )
                    ),
                    React.createElement(
                      'a',
                      { href: 'mailto:support@carpool-kolkata.odoo.com', className: `flex items-center gap-3.5 p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200 hover:border-yellow-400' : 'bg-slate-950/80 border-slate-800 hover:border-blue-500/40'} transition group` },
                      React.createElement('div', { className: 'p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition' }, React.createElement(Icon, { name: 'mail', className: 'w-5 h-5' })),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h4', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, 'Email Support'),
                        React.createElement('p', { className: 'font-mono text-[11px] text-emerald-400' }, 'support@carpool-kolkata.odoo.com'),
                        React.createElement('span', { className: 'text-[10px] text-slate-500' }, 'Guaranteed 2-hour SLA response')
                      )
                    ),
                    React.createElement(
                      'div',
                      { onClick: () => setShowCreateTicket(true), className: `flex items-center gap-3.5 p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200 hover:border-yellow-400' : 'bg-slate-950/80 border-slate-800 hover:border-blue-500/40'} transition group cursor-pointer` },
                      React.createElement('div', { className: 'p-3 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition' }, React.createElement(Icon, { name: 'fileText', className: 'w-5 h-5' })),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h4', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, 'Submit Support Ticket'),
                        React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}` }, 'Formal issue tracking with unique ticket ID'),
                        React.createElement('span', { className: 'text-[10px] text-slate-500' }, 'Auto-routed to regional transport lead')
                      )
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'} text-[11px] space-y-1` },
                  React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-slate-200'}` }, 'Kolkata Operations Hub:'),
                  React.createElement('p', null, 'Odoo Mobility Center, Sector V, Salt Lake, Kolkata, West Bengal 700091')
                )
              ),

              // AI Live Chat Assistant
              React.createElement(
                'div',
                { className: `lg:col-span-7 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} flex flex-col h-[520px] overflow-hidden` },
                React.createElement(
                  'div',
                  { className: `p-4 border-b ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'} flex items-center justify-between` },
                  React.createElement(
                    'div',
                    { className: 'flex items-center gap-3' },
                    React.createElement('div', { className: 'w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold' }, React.createElement(Icon, { name: 'sparkles', className: 'w-5 h-5' })),
                    React.createElement(
                      'div',
                      null,
                      React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Live Mobility Assistant'),
                      React.createElement('span', { className: 'text-[10px] text-emerald-400 font-semibold' }, '• Online & Ready')
                    )
                  )
                ),
                // Messages
                React.createElement(
                  'div',
                  { className: `flex-1 overflow-y-auto p-4 space-y-3 ${isLight ? 'bg-slate-50/50' : 'bg-slate-950/40'} text-xs` },
                  helpChatMsgs.map((m, i) =>
                    React.createElement(
                      'div',
                      { key: i, className: `flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}` },
                      React.createElement(
                        'div',
                        {
                          className: `max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                            m.sender === 'user'
                              ? isLight
                                ? 'bg-yellow-400 text-black rounded-tr-none font-medium'
                                : 'bg-blue-600 text-white rounded-tr-none shadow-lg'
                              : isLight
                              ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                          }`,
                        },
                        React.createElement('p', null, m.text)
                      ),
                      React.createElement('span', { className: 'text-[10px] text-slate-500 font-mono mt-1' }, m.time)
                    )
                  )
                ),
                // Chips
                React.createElement(
                  'div',
                  { className: `px-3 py-2 ${isLight ? 'bg-slate-100 border-t border-slate-200' : 'bg-slate-950 border-t border-slate-800/80'} flex items-center gap-1.5 overflow-x-auto` },
                  ['What are the commute fares?', 'How do cancellations work?', 'Emergency SOS protocol', 'How to publish a ride?'].map((chip, idx) =>
                    React.createElement(
                      'button',
                      {
                        key: idx,
                        onClick: () => handleSendHelpChat(chip),
                        className: `shrink-0 px-2.5 py-1 rounded-full text-[10px] border transition ${
                          isLight ? 'bg-white hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`,
                      },
                      chip
                    )
                  )
                ),
                // Input Bar
                React.createElement(
                  'div',
                  { className: `p-3 ${isLight ? 'bg-white border-t border-slate-200' : 'bg-slate-950 border-t border-slate-800'} flex items-center gap-2` },
                  React.createElement('input', {
                    type: 'text',
                    placeholder: 'Ask anything about Kolkata carpooling, route rules, or payments...',
                    value: helpChatInput,
                    onChange: (e) => setHelpChatInput(e.target.value),
                    onKeyDown: (e) => e.key === 'Enter' && handleSendHelpChat(),
                    className: `flex-1 rounded-xl ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-900 border-slate-800 text-white'} border px-3.5 py-2 text-xs placeholder-slate-500 focus:outline-none`,
                  }),
                  React.createElement(
                    'button',
                    {
                      onClick: () => handleSendHelpChat(),
                      disabled: !helpChatInput.trim(),
                      className: `p-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-500 font-bold' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'} transition disabled:opacity-50`,
                    },
                    React.createElement(Icon, { name: 'send', className: 'w-4 h-4' })
                  )
                )
              )
            ),

          // TAB 5: EMERGENCY HELPLINES
          helpTab === 'helplines' &&
            React.createElement(
              'div',
              { className: 'space-y-6 animate-fade-in' },
              // Banner
              React.createElement(
                'div',
                { className: 'p-6 rounded-3xl border border-rose-500/40 bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/60 shadow-2xl text-white space-y-2' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2.5 text-rose-400 font-extrabold text-sm uppercase tracking-wider' },
                  React.createElement(Icon, { name: 'shield', className: 'w-5 h-5' }),
                  React.createElement('span', null, 'Official Kolkata Emergency & Transit Helplines')
                ),
                React.createElement('p', { className: 'text-xs text-slate-300 max-w-2xl leading-relaxed' }, 'Verified government emergency contacts for West Bengal and Kolkata Metropolitan corridors. All numbers are toll-free and active 24 hours a day, 7 days a week.')
              ),
              // Helplines Grid
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
                [
                  { title: 'National Emergency SOS', number: '112', desc: 'Unified all-in-one emergency service for Police, Fire & Medical dispatch across India.', tag: 'Toll-Free 24/7' },
                  { title: 'Kolkata Police Control Room', number: '100', desc: 'Direct dispatch to Kolkata City Police patrol units across Sector V, Park Street & EM Bypass.', tag: 'Kolkata Police' },
                  { title: 'Women Safety Helpline', number: '1091 / 181', desc: 'Dedicated round-the-clock women safety assistance and transit emergency escort.', tag: 'Women Safety' },
                  { title: 'Kolkata Traffic Police Helpline', number: '1073', desc: 'Live traffic congestion, road blockage, accident reports, and route diversions.', tag: 'Traffic Control' },
                  { title: 'National Highway Helpline', number: '1033', desc: 'Highway breakdown, emergency towing, and ambulance on NH-12, NH-16, and expressways.', tag: 'NHAI Express' },
                  { title: 'Emergency Medical Ambulance', number: '108 / 102', desc: 'Instant emergency medical technician and ambulance dispatch in West Bengal.', tag: 'Ambulance' },
                ].map((item, idx) =>
                  React.createElement(
                    'div',
                    { key: idx, className: `p-5 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} space-y-3 flex flex-col justify-between` },
                    React.createElement(
                      'div',
                      { className: 'space-y-1.5' },
                      React.createElement('div', { className: 'flex items-center justify-between' }, React.createElement('span', { className: `px-2 py-0.5 rounded-full font-bold text-[10px] ${isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800 text-slate-300 border border-slate-700'}` }, item.tag), React.createElement(Icon, { name: 'alertTriangle', className: 'w-4 h-4 text-rose-500' })),
                      React.createElement('h3', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, item.title),
                      React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed` }, item.desc)
                    ),
                    React.createElement(
                      'a',
                      { href: `tel:${item.number.split('/')[0].trim()}`, className: `flex items-center justify-between p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200 hover:border-rose-400' : 'bg-slate-950 border-slate-800 hover:border-rose-500/50'} transition group` },
                      React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement(Icon, { name: 'phone', className: 'w-4 h-4 text-rose-400' }), React.createElement('span', { className: `font-mono font-extrabold text-base ${isLight ? 'text-black' : 'text-white'}` }, item.number)),
                      React.createElement('span', { className: 'text-[10px] font-bold text-rose-400 uppercase tracking-wider' }, 'Dial Now →')
                    )
                  )
                )
              )
            )
        );
      }

      // =========================================================================
      // 8.8. RIDE HISTORY PAGE (/ride-history) — Previous Journeys & Receipts
      // =========================================================================
      if (route === '/ride-history') {
        const allHist = store.getUserRideHistory(currentUser.id);

        const filteredHist = allHist.filter((r) => {
          if (rhType !== 'all' && r.type !== rhType) return false;
          if (rhStatus !== 'all') {
            if (rhStatus === 'pending' && r.status !== 'pending' && r.status !== 'upcoming') return false;
            if (rhStatus !== 'pending' && r.status !== rhStatus) return false;
          }
          if (rhSearch.trim()) {
            const q = rhSearch.toLowerCase();
            const mDriver = r.driverName?.toLowerCase().includes(q);
            const mRider = r.riderName?.toLowerCase().includes(q);
            const mStart = r.startLocation?.toLowerCase().includes(q);
            const mDest = r.destinationLocation?.toLowerCase().includes(q);
            const mVeh = r.vehicleModel?.toLowerCase().includes(q);
            const mPlate = r.registrationNumber?.toLowerCase().includes(q);
            const mId = r.id?.toLowerCase().includes(q);
            if (!mDriver && !mRider && !mStart && !mDest && !mVeh && !mPlate && !mId) return false;
          }
          return true;
        });

        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-6xl mx-auto pb-12 text-xs' },
          // Header
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                React.createElement('h1', { className: `text-2xl sm:text-3xl font-extrabold ${isLight ? 'text-black' : 'text-white'} tracking-tight` }, 'Ride History'),
                React.createElement('span', { className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${isLight ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}` }, `${allHist.length} Total Journeys`)
              ),
              React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1` }, 'Complete historical records of your Kolkata carpool commutes, route logs, driver ratings, and receipts.')
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2.5' },
              React.createElement(
                'button',
                {
                  onClick: handleExportRhCSV,
                  className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 shadow-md'} transition hover:scale-105`,
                },
                React.createElement(Icon, { name: 'download', className: `w-4 h-4 ${isLight ? 'text-black' : 'text-cyan-400'}` }),
                React.createElement('span', null, 'Export CSV')
              )
            )
          ),

          // Filters Toolbar
          React.createElement(
            'div',
            { className: `p-4 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} backdrop-blur-xl space-y-3` },
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3' },
              // Search
              React.createElement(
                'div',
                { className: 'relative' },
                React.createElement(Icon, { name: 'search', className: 'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' }),
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Search driver, route, plate, ID...',
                  value: rhSearch,
                  onChange: (e) => setRhSearch(e.target.value),
                  className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none`,
                })
              ),
              // Status
              React.createElement(
                'div',
                { className: 'flex items-center gap-1.5' },
                React.createElement('span', { className: 'text-slate-400 font-semibold shrink-0' }, 'Status:'),
                React.createElement(
                  'select',
                  { value: rhStatus, onChange: (e) => setRhStatus(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl py-2 px-3 text-xs focus:outline-none` },
                  React.createElement('option', { value: 'all' }, 'All Statuses'),
                  React.createElement('option', { value: 'completed' }, 'Completed'),
                  React.createElement('option', { value: 'cancelled' }, 'Cancelled'),
                  React.createElement('option', { value: 'pending' }, 'Pending / Upcoming')
                )
              ),
              // Date
              React.createElement(
                'div',
                { className: 'flex items-center gap-1.5' },
                React.createElement('span', { className: 'text-slate-400 font-semibold shrink-0' }, 'Period:'),
                React.createElement(
                  'select',
                  { value: rhDate, onChange: (e) => setRhDate(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl py-2 px-3 text-xs focus:outline-none` },
                  React.createElement('option', { value: 'all' }, 'All Time'),
                  React.createElement('option', { value: '7d' }, 'Last 7 Days'),
                  React.createElement('option', { value: '30d' }, 'Last 30 Days'),
                  React.createElement('option', { value: '3m' }, 'Last 3 Months'),
                  React.createElement('option', { value: '6m' }, 'Last 6 Months'),
                  React.createElement('option', { value: '1y' }, 'Last 1 Year')
                )
              ),
              // Type
              React.createElement(
                'div',
                { className: 'flex items-center gap-1.5' },
                React.createElement('span', { className: 'text-slate-400 font-semibold shrink-0' }, 'Type:'),
                React.createElement(
                  'select',
                  { value: rhType, onChange: (e) => setRhType(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl py-2 px-3 text-xs focus:outline-none` },
                  React.createElement('option', { value: 'all' }, 'All (Passenger & Driver)'),
                  React.createElement('option', { value: 'passenger' }, 'Passenger Rides Only'),
                  React.createElement('option', { value: 'driver' }, 'Offered Driver Rides')
                )
              )
            )
          ),

          // Table or Empty State
          filteredHist.length === 0
            ? React.createElement(
                'div',
                { className: `p-12 text-center rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} space-y-4` },
                React.createElement('div', { className: `w-16 h-16 rounded-3xl ${isLight ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-500/10 text-blue-400'} flex items-center justify-center mx-auto` }, React.createElement(Icon, { name: 'history', className: 'w-8 h-8' })),
                React.createElement(
                  'div',
                  { className: 'space-y-1' },
                  React.createElement('h3', { className: `text-lg font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'No Ride History Yet'),
                  React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-md mx-auto` }, 'Your completed and previous rides will appear here. Start by finding a ride to Sector V or offering a commute.')
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-center gap-3 pt-2' },
                  React.createElement('button', { onClick: () => navigate('/find-ride'), className: 'px-5 py-2.5 rounded-2xl bg-yellow-400 text-black font-bold shadow-md' }, 'Find a Ride'),
                  React.createElement('button', { onClick: () => navigate('/offer-ride'), className: 'px-5 py-2.5 rounded-2xl bg-slate-800 text-white font-bold' }, 'Offer a Ride')
                )
              )
            : React.createElement(
                'div',
                { className: `rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-2xl'} backdrop-blur-xl overflow-hidden` },
                React.createElement(
                  'div',
                  { className: 'overflow-x-auto' },
                  React.createElement(
                    'table',
                    { className: 'w-full text-left text-xs' },
                    React.createElement(
                      'thead',
                      { className: `border-b ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/70 border-slate-800 text-slate-400'} font-bold uppercase text-[10px]` },
                      React.createElement(
                        'tr',
                        null,
                        React.createElement('th', { className: 'py-4 px-4' }, 'Ride ID / Date'),
                        React.createElement('th', { className: 'py-4 px-4' }, 'Type'),
                        React.createElement('th', { className: 'py-4 px-4' }, 'Driver / Passenger'),
                        React.createElement('th', { className: 'py-4 px-4' }, 'Route Corridors'),
                        React.createElement('th', { className: 'py-4 px-4' }, 'Vehicle & Plate'),
                        React.createElement('th', { className: 'py-4 px-4' }, 'Fare (₹)'),
                        React.createElement('th', { className: 'py-4 px-4' }, 'Status'),
                        React.createElement('th', { className: 'py-4 px-4 text-center' }, 'Actions')
                      )
                    ),
                    React.createElement(
                      'tbody',
                      { className: `divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}` },
                      filteredHist.map((r) => {
                        const isComp = r.status === 'completed';
                        const isCanc = r.status === 'cancelled';
                        const isDriver = r.type === 'driver';

                        return React.createElement(
                          'tr',
                          { key: r.id, className: isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40' },
                          // ID & Date
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement('div', { className: `font-mono font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, r.id),
                            React.createElement('div', { className: 'text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5' }, React.createElement(Icon, { name: 'clock', className: 'w-3 h-3 text-cyan-400' }), React.createElement('span', null, `${r.date} • ${r.time}`))
                          ),
                          // Type
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement('span', { className: `px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${isDriver ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'}` }, isDriver ? 'Driver' : 'Passenger')
                          ),
                          // Driver / Rider
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement(
                              'div',
                              { className: 'flex items-center gap-2.5' },
                              React.createElement('img', { src: r.driverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', className: 'w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30' }),
                              React.createElement(
                                'div',
                                null,
                                React.createElement('div', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, isDriver ? r.riderName : r.driverName),
                                React.createElement('div', { className: 'flex items-center gap-1 text-[10px] text-amber-400 font-semibold' }, React.createElement(Icon, { name: 'star', className: 'w-3 h-3 fill-current' }), React.createElement('span', null, r.rating || 4.9))
                              )
                            )
                          ),
                          // Route
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement(
                              'div',
                              { className: 'space-y-0.5 max-w-[200px]' },
                              React.createElement('div', { className: `font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'} truncate flex items-center gap-1` }, React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0' }), React.createElement('span', { className: 'truncate' }, r.startLocation.split(',')[0])),
                              React.createElement('div', { className: `font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'} truncate flex items-center gap-1` }, React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0' }), React.createElement('span', { className: 'truncate' }, r.destinationLocation.split(',')[0]))
                            )
                          ),
                          // Vehicle
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement(
                              'div',
                              { className: 'flex items-center gap-1.5' },
                              React.createElement(Icon, { name: 'car', className: 'w-4 h-4 text-cyan-400 shrink-0' }),
                              React.createElement(
                                'div',
                                null,
                                React.createElement('div', { className: `font-mono font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, r.registrationNumber),
                                React.createElement('div', { className: 'text-[10px] text-slate-400' }, r.vehicleModel)
                              )
                            )
                          ),
                          // Fare
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement('div', { className: 'font-mono font-extrabold text-sm text-emerald-500' }, isDriver ? `+₹${r.fare}` : `₹${r.fare}`),
                            React.createElement('div', { className: 'text-[10px] text-slate-500' }, `${r.paymentMethod || 'UPI'} • ${r.paymentStatus || 'paid'}`)
                          ),
                          // Status
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4' },
                            React.createElement(
                              'span',
                              {
                                className: `px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                                  isComp ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : isCanc ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                }`,
                              },
                              r.status
                            )
                          ),
                          // Action
                          React.createElement(
                            'td',
                            { className: 'py-4 px-4 text-center' },
                            React.createElement('button', { onClick: () => setRhSelectedRecord(r), className: `px-3 py-1.5 rounded-xl font-bold border ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'} transition` }, 'View Details')
                          )
                        );
                      })
                    )
                  )
                )
              )
        );
      }

      // ==========================================
      // ADMIN CONSOLE PAGES
      // ==========================================

      // ADMIN 1: Admin Employees Page (/admin/employees) - Single Clean Primary Header Button
      if (route === '/admin/employees') {
        const filteredUsers = users.filter((u) => {
          if (deptFilter !== 'all' && u.department !== deptFilter) return false;
          if (!empSearch) return true;
          const q = empSearch.toLowerCase();
          return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.officeLocation.toLowerCase().includes(q) || (u.employeeId && u.employeeId.toLowerCase().includes(q));
        });

        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          // Header with Single Prominent Action Button
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Employee Directory & Governance'),
              React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Manage employee platform access, corporate IDs, office hubs, and mobility permissions.')
            ),
            React.createElement(
              'button',
              {
                onClick: () => setShowAddEmp(true),
                className: `px-5 py-3 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-lg shadow-yellow-500/25' : 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30'} flex items-center gap-2 transition hover:scale-105`,
              },
              React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
              '➕ Add New Employee'
            )
          ),
          // Top Stats
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-4 gap-4' },
            React.createElement(StatCard, { isLight, title: 'Total Staff Registered', value: users.length, subtitle: 'Corporate staff', iconName: 'users', colorScheme: 'yellow' }),
            React.createElement(StatCard, { isLight, title: 'Access Granted', value: users.filter((u) => u.platformAccess === 'granted').length, subtitle: 'Active riders', iconName: 'shield', colorScheme: 'emerald' }),
            React.createElement(StatCard, { isLight, title: 'Verified Drivers', value: vehicles.length, subtitle: 'Fleet operators', iconName: 'car', colorScheme: 'cyan' }),
            React.createElement(StatCard, { isLight, title: 'Total Commutes', value: '428', subtitle: 'This quarter', iconName: 'chart', colorScheme: 'purple' })
          ),
          // Filter & Search Toolbar
          React.createElement(
            'div',
            { className: `p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900 border-slate-800'} flex flex-col sm:flex-row justify-between items-center gap-3` },
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search employee name, email, ID, office...',
              value: empSearch,
              onChange: (e) => setEmpSearch(e.target.value),
              className: `w-full sm:w-80 ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2`,
            }),
            React.createElement(
              'div',
              { className: 'flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto' },
              ['all', 'Engineering', 'Sales', 'Product', 'Design', 'HR & Mobility Operations'].map((d) =>
                React.createElement(
                  'button',
                  {
                    key: d,
                    onClick: () => setDeptFilter(d),
                    className: `px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                      deptFilter === d
                        ? isLight
                          ? 'bg-yellow-400 text-black border border-yellow-500 shadow-sm'
                          : 'bg-purple-600 text-white shadow-md'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`,
                  },
                  d === 'all' ? 'All Depts' : d
                )
              )
            )
          ),
          // Employee Table
          React.createElement(
            'div',
            { className: `overflow-hidden rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-800 shadow-2xl'}` },
            React.createElement(
              'div',
              { className: 'overflow-x-auto' },
              React.createElement(
                'table',
                { className: 'w-full text-left' },
                React.createElement(
                  'thead',
                  { className: `${isLight ? 'bg-slate-100 border-b border-slate-200 text-slate-700' : 'bg-slate-950 border-b border-slate-800 text-slate-400'} uppercase font-bold text-[10px]` },
                  React.createElement(
                    'tr',
                    null,
                    React.createElement('th', { className: 'p-4' }, 'Employee'),
                    React.createElement('th', { className: 'p-4' }, 'Employee ID'),
                    React.createElement('th', { className: 'p-4' }, 'Department'),
                    React.createElement('th', { className: 'p-4' }, 'Office Hub'),
                    React.createElement('th', { className: 'p-4' }, 'Wallet'),
                    React.createElement('th', { className: 'p-4' }, 'Access'),
                    React.createElement('th', { className: 'p-4 text-right' }, 'Actions')
                  )
                ),
                React.createElement(
                  'tbody',
                  { className: `divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800'}` },
                  filteredUsers.map((u) =>
                    React.createElement(
                      'tr',
                      { key: u.id, className: isLight ? 'hover:bg-slate-50/80 transition' : 'hover:bg-slate-800/40 transition' },
                      React.createElement(
                        'td',
                        { className: 'p-4' },
                        React.createElement(
                          'div',
                          { className: 'flex items-center gap-3' },
                          React.createElement('img', { src: u.avatar, className: `w-9 h-9 rounded-full object-cover ring-2 ${isLight ? 'ring-yellow-400' : 'ring-purple-500'}` }),
                          React.createElement('div', null, React.createElement('div', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, u.name), React.createElement('div', { className: 'text-[11px] text-slate-400 font-mono' }, u.email))
                        )
                      ),
                      React.createElement('td', { className: `p-4 font-mono font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}` }, u.employeeId || 'EMP-1050'),
                      React.createElement('td', { className: 'p-4' }, React.createElement('span', { className: `px-2 py-0.5 rounded-md font-bold ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-300'}` }, u.department)),
                      React.createElement('td', { className: `p-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}` }, u.officeLocation),
                      React.createElement('td', { className: `p-4 font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}` }, `₹${u.walletBalance}`),
                      React.createElement(
                        'td',
                        { className: 'p-4' },
                        React.createElement(
                          'button',
                          {
                            onClick: () => {
                              const nextAcc = u.platformAccess === 'granted' ? 'revoked' : 'granted';
                              const updatedUsers = users.map((item) => (item.id === u.id ? { ...item, platformAccess: nextAcc } : item));
                              store.setUsers(updatedUsers);
                              setUsers(updatedUsers);
                              toast.show('Access Updated', `${u.name} access is now ${nextAcc.toUpperCase()}.`);
                            },
                            className: `px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase border transition ${
                              u.platformAccess === 'granted'
                                ? isLight
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : isLight
                                ? 'bg-rose-100 text-rose-900 border-rose-300'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`,
                          },
                          u.platformAccess === 'granted' ? '✓ Granted' : '✕ Revoked'
                        )
                      ),
                      React.createElement(
                        'td',
                        { className: 'p-4 text-right' },
                        React.createElement(
                          'button',
                          {
                            onClick: () => {
                              if (confirm(`Delete employee ${u.name}?`)) {
                                const updatedUsers = users.filter((item) => item.id !== u.id);
                                store.setUsers(updatedUsers);
                                setUsers(updatedUsers);
                                toast.show('Employee Removed', `${u.name} has been deleted.`);
                              }
                            },
                            className: 'px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 font-bold',
                          },
                          'Delete'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }

      // ADMIN 2: Admin Vehicles Page (/admin/vehicles) - Single Clean Primary Header Button
      if (route === '/admin/vehicles') {
        const filteredVehicles = vehicles.filter((v) => {
          if (!vehSearch) return true;
          const q = vehSearch.toLowerCase();
          return v.model.toLowerCase().includes(q) || v.registrationNumber.toLowerCase().includes(q) || v.driverName.toLowerCase().includes(q) || v.fuelType.toLowerCase().includes(q);
        });

        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          // Header with Single Prominent Action Button
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Corporate Fleet & Vehicles'),
              React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Manage company fleet approvals, West Bengal vehicle registrations, and seating capacities.')
            ),
            React.createElement(
              'button',
              {
                onClick: () => setShowAddVehicle(true),
                className: `px-5 py-3 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-lg shadow-yellow-500/25' : 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30'} flex items-center gap-2 transition hover:scale-105`,
              },
              React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
              '➕ Add Fleet Vehicle'
            )
          ),
          // Top Stats
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-4 gap-4' },
            React.createElement(StatCard, { isLight, title: 'Total Fleet Vehicles', value: vehicles.length, subtitle: 'WB Plates', iconName: 'car', colorScheme: 'yellow' }),
            React.createElement(StatCard, { isLight, title: 'Approved & Active', value: vehicles.filter((v) => v.status === 'approved').length, subtitle: 'Ready for pool', iconName: 'shield', colorScheme: 'emerald' }),
            React.createElement(StatCard, { isLight, title: 'Zero-Emission (EV)', value: vehicles.filter((v) => v.fuelType === 'Electric' || v.vehicleType === 'EV').length || 1, subtitle: 'Tata Nexon EV', iconName: 'leaf', colorScheme: 'cyan' }),
            React.createElement(StatCard, { isLight, title: 'Avg Capacity', value: '4.2 Seats', subtitle: 'Per vehicle', iconName: 'users', colorScheme: 'purple' })
          ),
          // Filter Toolbar
          React.createElement(
            'div',
            { className: `p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900 border-slate-800'} flex justify-between items-center` },
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search model, WB plate number, driver...',
              value: vehSearch,
              onChange: (e) => setVehSearch(e.target.value),
              className: `w-full sm:w-80 ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2`,
            })
          ),
          // Vehicle Table
          React.createElement(
            'div',
            { className: `overflow-hidden rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-800 shadow-2xl'}` },
            React.createElement(
              'div',
              { className: 'overflow-x-auto' },
              React.createElement(
                'table',
                { className: 'w-full text-left' },
                React.createElement(
                  'thead',
                  { className: `${isLight ? 'bg-slate-100 border-b border-slate-200 text-slate-700' : 'bg-slate-950 border-b border-slate-800 text-slate-400'} uppercase font-bold text-[10px]` },
                  React.createElement(
                    'tr',
                    null,
                    React.createElement('th', { className: 'p-4' }, 'Vehicle Model'),
                    React.createElement('th', { className: 'p-4' }, 'WB Plate Number'),
                    React.createElement('th', { className: 'p-4' }, 'Assigned Driver'),
                    React.createElement('th', { className: 'p-4' }, 'Capacity'),
                    React.createElement('th', { className: 'p-4' }, 'Fuel Type'),
                    React.createElement('th', { className: 'p-4' }, 'Status'),
                    React.createElement('th', { className: 'p-4 text-right' }, 'Actions')
                  )
                ),
                React.createElement(
                  'tbody',
                  { className: `divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800'}` },
                  filteredVehicles.map((v) =>
                    React.createElement(
                      'tr',
                      { key: v.id, className: isLight ? 'hover:bg-slate-50/80 transition' : 'hover:bg-slate-800/40 transition' },
                      React.createElement(
                        'td',
                        { className: 'p-4' },
                        React.createElement('div', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, v.model),
                        React.createElement('div', { className: 'text-[10px] text-slate-400' }, v.vehicleType || 'Sedan')
                      ),
                      React.createElement(
                        'td',
                        { className: 'p-4' },
                        React.createElement('span', { className: `px-2.5 py-1 rounded-md font-mono font-bold text-xs border ${isLight ? 'bg-yellow-50 border-yellow-300 text-yellow-950' : 'bg-slate-950 border-slate-700 text-cyan-300'}` }, v.registrationNumber)
                      ),
                      React.createElement('td', { className: `p-4 font-semibold ${isLight ? 'text-slate-800' : 'text-white'}` }, v.driverName),
                      React.createElement('td', { className: 'p-4' }, `${v.seatingCapacity} Seats`),
                      React.createElement(
                        'td',
                        { className: 'p-4' },
                        React.createElement('span', { className: `px-2 py-0.5 rounded-md font-bold text-[10px] ${v.fuelType === 'Electric' ? (isLight ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-500/20 text-emerald-300') : isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-300'}` }, v.fuelType)
                      ),
                      React.createElement(
                        'td',
                        { className: 'p-4' },
                        React.createElement(
                          'button',
                          {
                            onClick: () => {
                              const nextStat = v.status === 'approved' ? 'inactive' : 'approved';
                              const updatedVeh = vehicles.map((item) => (item.id === v.id ? { ...item, status: nextStat } : item));
                              store.setVehicles(updatedVeh);
                              setVehicles(updatedVeh);
                              toast.show('Vehicle Status Updated', `${v.model} status is now ${nextStat.toUpperCase()}.`);
                            },
                            className: `px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase border transition ${
                              v.status === 'approved'
                                ? isLight
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : isLight
                                ? 'bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`,
                          },
                          v.status === 'approved' ? '✓ Approved' : 'Inactive'
                        )
                      ),
                      React.createElement(
                        'td',
                        { className: 'p-4 text-right' },
                        React.createElement(
                          'button',
                          {
                            onClick: () => {
                              if (confirm(`Delete vehicle ${v.model} (${v.registrationNumber})?`)) {
                                const updatedVeh = vehicles.filter((item) => item.id !== v.id);
                                store.setVehicles(updatedVeh);
                                setVehicles(updatedVeh);
                                toast.show('Vehicle Removed', `${v.model} has been deleted.`);
                              }
                            },
                            className: 'px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 font-bold',
                          },
                          'Delete'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }

      // ADMIN 3: Admin Rides Page (/admin/rides)
      if (route === '/admin/rides') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Active Corporate Rides (Kolkata Corridor)'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            rides.map((r) =>
              React.createElement(
                'div',
                { key: r.id, className: `p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-slate-900/90 border-slate-800 shadow-xl text-white'} space-y-3` },
                React.createElement(
                  'div',
                  { className: 'flex justify-between items-start' },
                  React.createElement('div', null, React.createElement('h3', { className: 'font-bold text-base' }, r.driverName), React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, `${r.vehicleModel} • ${r.registrationNumber}`)),
                  React.createElement('span', { className: `font-mono font-extrabold text-base ${isLight ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200' : 'text-emerald-400'}` }, `₹${r.farePerSeat}`)
                ),
                React.createElement('div', { className: `p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}` }, `${r.startLocation} → ${r.destinationLocation}`),
                React.createElement('div', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, `${r.availableSeats} seats left • Departure: ${r.departureTime}`)
              )
            )
          )
        );
      }

      // ADMIN 4: Admin Reports Page (/admin/reports)
      if (route === '/admin/reports') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Executive Mobility & ESG Carbon Audit'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(
              'div',
              { className: `p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} space-y-4` },
              React.createElement('h3', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, 'Kolkata Corridor Fuel Efficiency (km/L)'),
              React.createElement(FuelTrendSvg)
            ),
            React.createElement(
              'div',
              { className: `p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} space-y-4` },
              React.createElement('h3', { className: `font-bold text-sm ${isLight ? 'text-black' : 'text-white'}` }, 'Top Costliest Fleet Vehicles (WB Plates)'),
              React.createElement(CostliestVehiclesSvg)
            )
          )
        );
      }

      // ADMIN 5: Admin Dashboard Page (/admin/dashboard)
      if (isAdmin) {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: `text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Kolkata Enterprise Mobility Console'),
              React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, 'Manage employee access, fleet vehicles, corporate subsidies, and live Kolkata transit radars.')
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'button',
                {
                  onClick: () => setShowAddEmp(true),
                  className: `px-4 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-purple-600 hover:bg-purple-500 text-white font-bold'} flex items-center gap-1.5`,
                },
                React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
                'Add Employee'
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setShowAddVehicle(true),
                  className: `px-4 py-2.5 rounded-xl ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold' : 'bg-slate-900 border-slate-800 text-cyan-300 font-bold'} flex items-center gap-1.5`,
                },
                React.createElement(Icon, { name: 'car', className: 'w-4 h-4' }),
                'Add Vehicle'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
            React.createElement(StatCard, { isLight, title: 'Total Registered Staff', value: users.length, subtitle: 'Kolkata office', iconName: 'users', colorScheme: 'yellow', onClick: () => navigate('/admin/employees') }),
            React.createElement(StatCard, { isLight, title: 'Active Fleet Vehicles', value: vehicles.length, subtitle: 'WB Plates verified', iconName: 'car', colorScheme: 'purple', onClick: () => navigate('/admin/vehicles') }),
            React.createElement(StatCard, { isLight, title: 'Total Commutes Pooled', value: '428 Trips', subtitle: 'This month', iconName: 'chart', colorScheme: 'emerald', onClick: () => navigate('/admin/reports') }),
            React.createElement(StatCard, { isLight, title: 'Corporate Fuel Subsidy', value: '₹42,800', subtitle: 'Disbursed', iconName: 'wallet', colorScheme: 'cyan', onClick: () => navigate('/admin/reports') })
          ),
          React.createElement(
            'div',
            { className: `p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900/90 border-slate-800 shadow-xl'} space-y-4` },
            React.createElement('h3', { className: `text-sm font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Kolkata Metropolitan Area Live Fleet GPS Radar'),
            React.createElement(MapView, { startName: 'Park Street, Kolkata', destName: 'Sector V, Salt Lake, Kolkata', height: '420px', showSimulation: true })
          )
        );
      }

      // Fallback redirect to dashboard
      return React.createElement('div', { className: 'p-8 text-center' }, React.createElement('button', { onClick: () => navigate('/dashboard'), className: 'px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-bold' }, 'Return to Kolkata Dashboard'));
    };

    // ==========================================
    // RENDER MAIN APPLICATION LAYOUT
    // ==========================================
    return React.createElement(
      'div',
      { className: `min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col transition-colors duration-300 relative` },
      renderHeader(),
      React.createElement(
        'div',
        { className: 'mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8' },
        React.createElement(
          'div',
          { className: 'flex flex-col lg:flex-row gap-6' },
          isAdmin ? renderAdminSidebar() : renderSidebar(),
          React.createElement('main', { className: 'flex-1 min-w-0' }, renderPageContent())
        )
      ),

      // ==========================================
      // MODAL 1: ADD NEW EMPLOYEE (ADMIN)
      // ==========================================
      showAddEmp &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-lg rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-slate-800 shadow-2xl text-white'} p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto` },
            React.createElement(
              'div',
              { className: `flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-lg font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Register New Corporate Employee'),
                React.createElement('p', { className: isLight ? 'text-slate-500' : 'text-slate-400' }, 'Add staff member to Kolkata carpooling directory')
              ),
              React.createElement('button', { onClick: () => setShowAddEmp(false), className: 'p-1 text-slate-400 hover:text-slate-600 font-bold text-sm' }, '✕')
            ),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const name = form.emp_name.value.trim();
                  const email = form.emp_email.value.trim();
                  const mobile = form.emp_mobile.value.trim() || '+91 98765 00000';
                  const employeeId = form.emp_empid.value.trim() || `EMP-${1050 + users.length}`;
                  const department = form.emp_dept.value;
                  const officeLocation = form.emp_office.value;
                  const role = form.emp_role.value;
                  const walletBalance = parseInt(form.emp_wallet.value) || 500;

                  if (!name || !email) {
                    toast.show('Validation Error', 'Please enter employee Name and Email.', 'error');
                    return;
                  }

                  const newEmp = {
                    id: `usr-${Date.now()}`,
                    name,
                    email,
                    mobile,
                    employeeId,
                    department,
                    manager: 'A. Shah',
                    officeLocation,
                    role,
                    avatar: `https://images.unsplash.com/photo-${1534528741775 + users.length * 1000}?w=150&auto=format&fit=crop&q=80`,
                    platformAccess: 'granted',
                    status: 'active',
                    rating: 5.0,
                    totalTrips: 0,
                    walletBalance,
                  };

                  const updatedUsers = [...users, newEmp];
                  store.setUsers(updatedUsers);
                  setUsers(updatedUsers);
                  toast.show('Employee Added Successfully!', `${name} (${employeeId}) registered with access GRANTED.`);
                  setShowAddEmp(false);
                },
                className: 'space-y-3.5',
              },
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Full Name *'), React.createElement('input', { name: 'emp_name', required: true, placeholder: 'e.g. Sridwip Mandal', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-medium` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Corporate Email *'), React.createElement('input', { name: 'emp_email', type: 'email', required: true, placeholder: 'sridwip.m@odoo.com', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-mono` }))
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Mobile Number'), React.createElement('input', { name: 'emp_mobile', defaultValue: '+91 98300 12345', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-mono` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Employee ID'), React.createElement('input', { name: 'emp_empid', defaultValue: `EMP-${1052 + users.length}`, className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-mono font-bold` }))
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Department'),
                  React.createElement(
                    'select',
                    { name: 'emp_dept', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    ['Engineering', 'Sales', 'Product', 'Design', 'HR & Mobility Operations', 'Marketing', 'Finance'].map((d) => React.createElement('option', { key: d, value: d }, d))
                  )
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Base Office Hub'),
                  React.createElement(
                    'select',
                    { name: 'emp_office', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    ['Kolkata Tech Hub (Sector V)', 'Kolkata Central (Park Street)', 'New Town Campus (Action Area II)', 'New Town Corporate Headquarters'].map((o) => React.createElement('option', { key: o, value: o }, o))
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Platform Role'),
                  React.createElement(
                    'select',
                    { name: 'emp_role', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    React.createElement('option', { value: 'employee' }, 'Employee (Carpool Rider/Driver)'),
                    React.createElement('option', { value: 'admin' }, 'Administrator (Full Console Access)')
                  )
                ),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Initial Wallet Credit (₹)'), React.createElement('input', { name: 'emp_wallet', type: 'number', defaultValue: 500, className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-mono font-bold` }))
              ),
              React.createElement(
                'div',
                { className: `flex justify-end gap-2.5 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
                React.createElement('button', { type: 'button', onClick: () => setShowAddEmp(false), className: `px-4 py-2 rounded-xl ${isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'}` }, 'Cancel'),
                React.createElement(
                  'button',
                  {
                    type: 'submit',
                    className: `px-6 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30'}`,
                  },
                  'Save & Grant Access'
                )
              )
            )
          )
        ),

      // ==========================================
      // MODAL 2: ADD NEW FLEET VEHICLE (ADMIN & EMPLOYEE)
      // ==========================================
      showAddVehicle &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-lg rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-slate-800 shadow-2xl text-white'} p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto` },
            React.createElement(
              'div',
              { className: `flex justify-between items-center pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-lg font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Register Corporate Fleet Vehicle'),
                React.createElement('p', { className: isLight ? 'text-slate-500' : 'text-slate-400' }, 'Add vehicle to Kolkata mobility pool with West Bengal plate')
              ),
              React.createElement('button', { onClick: () => setShowAddVehicle(false), className: 'p-1 text-slate-400 hover:text-slate-600 font-bold text-sm' }, '✕')
            ),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const model = form.veh_model.value.trim();
                  const registrationNumber = form.veh_reg.value.trim().toUpperCase();
                  const driverName = form.veh_driver.value.trim() || currentUser.name;
                  const seatingCapacity = parseInt(form.veh_seats.value) || 4;
                  const vehicleType = form.veh_type.value;
                  const fuelType = form.veh_fuel.value;
                  const color = form.veh_color.value.trim() || 'Pearl White';

                  if (!model || !registrationNumber) {
                    toast.show('Validation Error', 'Please enter Vehicle Model and Registration Number.', 'error');
                    return;
                  }

                  const newVeh = {
                    id: `veh-${Date.now()}`,
                    userId: currentUser.id,
                    driverName,
                    model,
                    registrationNumber,
                    seatingCapacity,
                    vehicleType,
                    fuelType,
                    color,
                    status: 'approved',
                    isDefault: false,
                    insuranceValidTill: '2027-12-31',
                    pucValidTill: '2027-06-30',
                    rating: 5.0,
                  };

                  const updatedVehicles = [...vehicles, newVeh];
                  store.setVehicles(updatedVehicles);
                  setVehicles(updatedVehicles);
                  toast.show('Vehicle Registered Successfully!', `${model} (${registrationNumber}) added to active fleet.`);
                  setShowAddVehicle(false);
                },
                className: 'space-y-3.5',
              },
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Vehicle Model *'), React.createElement('input', { name: 'veh_model', required: true, placeholder: 'e.g. Swift Dzire / Tata Nexon EV', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-medium` })),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'WB Plate Number *'), React.createElement('input', { name: 'veh_reg', required: true, placeholder: 'e.g. WB02AB1234', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2 font-mono uppercase font-bold` }))
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Assigned Driver / Owner'),
                  React.createElement(
                    'select',
                    { name: 'veh_driver', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    users.map((u) => React.createElement('option', { key: u.id, value: u.name }, `${u.name} (${u.department})`))
                  )
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Seating Capacity'),
                  React.createElement(
                    'select',
                    { name: 'veh_seats', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    ['3 Seats', '4 Seats', '5 Seats', '6 Seats', '7 Seats'].map((s) => React.createElement('option', { key: s, value: parseInt(s) }, s))
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Vehicle Type'),
                  React.createElement(
                    'select',
                    { name: 'veh_type', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    ['Sedan', 'Hatchback', 'SUV', 'EV'].map((t) => React.createElement('option', { key: t, value: t }, t))
                  )
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Fuel Type'),
                  React.createElement(
                    'select',
                    { name: 'veh_fuel', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` },
                    ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'].map((f) => React.createElement('option', { key: f, value: f }, f))
                  )
                ),
                React.createElement('div', null, React.createElement('label', { className: `${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold block mb-1` }, 'Color'), React.createElement('input', { name: 'veh_color', defaultValue: 'Pearl White', className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3 py-2` }))
              ),
              React.createElement(
                'div',
                { className: `flex justify-end gap-2.5 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
                React.createElement('button', { type: 'button', onClick: () => setShowAddVehicle(false), className: `px-4 py-2 rounded-xl ${isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'}` }, 'Cancel'),
                React.createElement(
                  'button',
                  {
                    type: 'submit',
                    className: `px-6 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-md' : 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30'}`,
                  },
                  'Save & Verify Vehicle'
                )
              )
            )
          )
        ),

      // --- Recharge Modal ---
      // --- Global Modal 1: Recharge Corporate Wallet with UPI Intent, Dynamic QR & Verified Ledger ---
      showRecharge &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-xl text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-scale-up ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}` },
            // Header
            React.createElement(
              'div',
              { className: `flex items-center justify-between p-5 border-b ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}` },
              React.createElement(
                'div',
                { className: 'flex items-center gap-2.5' },
                React.createElement('div', { className: `p-2 rounded-xl border ${isLight ? 'bg-yellow-100 text-yellow-900 border-yellow-300' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'}` }, React.createElement(Icon, { name: 'wallet', className: 'w-5 h-5' })),
                React.createElement(
                  'div',
                  null,
                  React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Recharge Carpool Corporate Wallet'),
                  React.createElement('p', { className: isLight ? 'text-slate-600' : 'text-slate-400' }, `User: ${currentUser.name} • Available: ₹${currentUser.walletBalance.toLocaleString()}`)
                )
              ),
              React.createElement('button', { onClick: () => setShowRecharge(false), className: `p-1.5 rounded-lg text-slate-400 hover:text-white ${isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'}` }, '✕')
            ),
            // Body
            React.createElement(
              'div',
              { className: 'p-6 space-y-5' },
              // Presets
              React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'flex justify-between items-center mb-2' }, React.createElement('label', { className: 'font-bold uppercase tracking-wider text-[11px] text-slate-400' }, 'Quick Select Amount'), React.createElement('span', { className: 'text-[10px] text-slate-500' }, 'Min: ₹200')),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-5 gap-2' },
                  [200, 500, 1000, 2000, 5000].map((amt) =>
                    React.createElement(
                      'button',
                      {
                        key: amt,
                        onClick: () => {
                          const inp = document.getElementById('main-recharge-amount-input');
                          if (inp) inp.value = amt;
                        },
                        className: `py-2.5 rounded-xl text-xs font-mono font-bold border transition ${isLight ? 'bg-slate-100 hover:bg-yellow-400 hover:text-black border-slate-300' : 'bg-slate-950 hover:bg-blue-600 hover:text-white border-slate-800 text-slate-200'}`
                      },
                      `₹${amt}`
                    )
                  )
                )
              ),
              // Custom input
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'font-bold uppercase tracking-wider text-[11px] text-slate-400 mb-1.5 block' }, 'Enter Recharge Amount (₹)'),
                React.createElement('input', {
                  id: 'main-recharge-amount-input',
                  type: 'number',
                  min: 200,
                  defaultValue: 500,
                  className: `w-full rounded-2xl border py-3 px-4 text-base font-mono font-bold ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'}`
                })
              ),
              // Payment Methods Apps
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'font-bold uppercase tracking-wider text-[11px] text-slate-400 mb-2 block' }, 'Select UPI App / Payment Gateway'),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2' },
                  [
                    { name: 'Google Pay', icon: '⚡' },
                    { name: 'PhonePe', icon: '🟣' },
                    { name: 'Paytm', icon: '🔵' },
                    { name: 'UPI QR', icon: '📱' },
                  ].map((app) =>
                    React.createElement(
                      'button',
                      {
                        key: app.name,
                        onClick: () => {
                          const inp = document.getElementById('main-recharge-amount-input');
                          const amt = inp ? parseFloat(inp.value) || 500 : 500;
                          const uri = `upi://pay?pa=carpool.kolkata@okaxis&pn=Carpool%20Kolkata&am=${amt}&cu=INR&tn=Wallet%20Recharge`;
                          toast.show(`Launching ${app.name}`, `Opening UPI intent for ₹${amt}...`);
                          try { window.location.href = uri; } catch (e) {}
                        },
                        className: `p-2.5 rounded-2xl border text-center font-bold flex flex-col items-center gap-1 ${isLight ? 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-black' : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'}`
                      },
                      React.createElement('span', { className: 'text-base' }, app.icon),
                      React.createElement('span', { className: 'text-[11px]' }, app.name)
                    )
                  )
                )
              ),
              // Dynamic QR Code Strip
              React.createElement(
                'div',
                { className: `p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}` },
                React.createElement(
                  'div',
                  { className: 'p-3 bg-white rounded-2xl shadow-xl shrink-0 text-center border border-slate-200' },
                  React.createElement(Icon, { name: 'qrcode', className: 'w-20 h-20 text-slate-950 mx-auto' }),
                  React.createElement('span', { className: 'block text-[9px] font-mono font-bold text-slate-900 mt-1' }, 'Scan with UPI')
                ),
                React.createElement(
                  'div',
                  { className: 'space-y-1.5 flex-1 text-center sm:text-left' },
                  React.createElement('span', { className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isLight ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}` }, 'Verified Merchant UPI'),
                  React.createElement('p', { className: isLight ? 'text-xs text-slate-600 font-medium' : 'text-xs text-slate-400 font-medium' }, 'Scan with Google Pay, PhonePe, Paytm, or BHIM.'),
                  React.createElement(
                    'div',
                    { className: 'flex items-center gap-2 pt-1 justify-center sm:justify-start' },
                    React.createElement('span', { className: `px-2.5 py-1 rounded-xl font-mono font-bold text-[11px] border ${isLight ? 'bg-white border-slate-300 text-black' : 'bg-slate-900 border-slate-800 text-white'}` }, 'carpool.kolkata@okaxis'),
                    React.createElement(
                      'button',
                      {
                        onClick: () => {
                          navigator.clipboard?.writeText('carpool.kolkata@okaxis');
                          toast.show('Copied!', 'UPI ID carpool.kolkata@okaxis copied.');
                        },
                        className: `px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${isLight ? 'bg-slate-200 border-slate-300 text-black' : 'bg-slate-800 border-slate-700 text-slate-200'}`
                      },
                      '📋 Copy'
                    )
                  )
                )
              ),
              // Demo Mode Controls
              React.createElement(
                'div',
                { className: `p-3.5 rounded-2xl border space-y-2 ${isLight ? 'bg-yellow-50/60 border-yellow-300 text-slate-900' : 'bg-blue-950/30 border-blue-500/30 text-white'}` },
                React.createElement('div', { className: `flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider ${isLight ? 'text-yellow-800' : 'text-blue-400'}` }, React.createElement('span', null, '🧪 DEMO PAYMENT CONTROLS'), React.createElement('span', { className: 'text-slate-400' }, 'Verification Flow')),
                React.createElement('p', { className: `text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Test server payment verification or failure states to verify balance changes only on verified success.'),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-2 gap-2 pt-1' },
                  React.createElement(
                    'button',
                    {
                      onClick: async () => {
                        const inp = document.getElementById('main-recharge-amount-input');
                        const amt = inp ? parseFloat(inp.value) || 500 : 500;
                        if (amt < 200) {
                          toast.show('Minimum Required', 'Minimum recharge amount is ₹200.', 'error');
                          return;
                        }
                        const txId = `tx-${Date.now()}`;
                        const refId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

                        try {
                          await fetch('/api/wallet/recharge', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ amount: amt, userId: currentUser.id, referenceId: refId }),
                          });
                        } catch (e) {}

                        const newBal = currentUser.walletBalance + amt;
                        const u = { ...currentUser, walletBalance: newBal };
                        store.setCurrentUser(u);
                        setCurrentUser(u);

                        const newTx = {
                          id: txId,
                          userId: currentUser.id,
                          type: 'credit',
                          amount: amt,
                          description: `Wallet Top-Up via UPI (Google Pay)`,
                          timestamp: 'Today, Just now',
                          paymentMethod: 'Google Pay',
                          status: 'SUCCESS',
                          referenceId: refId,
                        };
                        const updatedTxs = [newTx, ...(txs || [])];
                        setTxs(updatedTxs);
                        store.setTxs(updatedTxs);

                        toast.show('Wallet Recharged! ⚡', `₹${amt} credited to ${currentUser.name}'s wallet.`);
                        setShowRecharge(false);
                      },
                      className: `py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`
                    },
                    '✓ Simulate Success'
                  ),
                  React.createElement(
                    'button',
                    {
                      onClick: () => {
                        const inp = document.getElementById('main-recharge-amount-input');
                        const amt = inp ? parseFloat(inp.value) || 500 : 500;
                        const txId = `tx-${Date.now()}`;
                        const refId = `REF-FAIL-${Math.floor(100000 + Math.random() * 900000)}`;

                        const failedTx = {
                          id: txId,
                          userId: currentUser.id,
                          type: 'credit',
                          amount: amt,
                          description: `Wallet Top-Up via UPI - Gateway Failure`,
                          timestamp: 'Today, Just now',
                          paymentMethod: 'UPI',
                          status: 'FAILED',
                          referenceId: refId,
                        };
                        const updatedTxs = [failedTx, ...(txs || [])];
                        setTxs(updatedTxs);
                        store.setTxs(updatedTxs);

                        toast.show('Payment Failed', 'Bank gateway rejected transaction. Wallet balance unchanged.', 'error');
                        setShowRecharge(false);
                      },
                      className: 'py-2.5 rounded-xl font-bold text-xs bg-rose-600/80 hover:bg-rose-600 text-white transition flex items-center justify-center gap-1.5'
                    },
                    '✕ Simulate Failure'
                  )
                )
              ),
              // Cancel Button
              React.createElement(
                'div',
                { className: 'flex justify-between items-center pt-2' },
                React.createElement('span', { className: 'text-[10px] text-slate-500 font-mono' }, 'Carpool Kolkata Security'),
                React.createElement(
                  'button',
                  {
                    onClick: () => {
                      const inp = document.getElementById('main-recharge-amount-input');
                      const amt = inp ? parseFloat(inp.value) || 500 : 500;
                      const txId = `tx-${Date.now()}`;
                      const refId = `REF-CAN-${Math.floor(100000 + Math.random() * 900000)}`;

                      const cancelledTx = {
                        id: txId,
                        userId: currentUser.id,
                        type: 'credit',
                        amount: amt,
                        description: `Wallet Top-Up via UPI - Cancelled by User`,
                        timestamp: 'Today, Just now',
                        paymentMethod: 'UPI',
                        status: 'CANCELLED',
                        referenceId: refId,
                      };
                      const updatedTxs = [cancelledTx, ...(txs || [])];
                      setTxs(updatedTxs);
                      store.setTxs(updatedTxs);

                      toast.show('Payment Cancelled', 'Recharge was cancelled. Balance unchanged.');
                      setShowRecharge(false);
                    },
                    className: `px-4 py-2 rounded-xl border text-xs font-semibold ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'}`
                  },
                  'Cancel Payment'
                )
              )
            )
          )
        ),

      // --- Global Search Modal (Ctrl+K) ---
      showSearch &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-start justify-center pt-20 p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-xl rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl' : 'bg-slate-900 border-slate-800 shadow-2xl'} p-4 space-y-3` },
            React.createElement('input', {
              type: 'text',
              autoFocus: true,
              placeholder: 'Search Kolkata employees, routes, vehicles...',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-4 py-3`,
            }),
            React.createElement(
              'div',
              { className: 'space-y-1' },
              rides.map((r) =>
                React.createElement(
                  'div',
                  {
                    key: r.id,
                    onClick: () => {
                      setShowSearch(false);
                      navigate('/find-ride');
                    },
                    className: `p-2.5 rounded-xl ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'} cursor-pointer flex justify-between`,
                  },
                  React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'}` }, `${r.startLocation.split(',')[0]} → ${r.destinationLocation.split(',')[0]}`),
                  React.createElement('span', { className: `font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}` }, `₹${r.farePerSeat}`)
                )
              )
            ),
            React.createElement('button', { onClick: () => setShowSearch(false), className: `w-full py-2 text-center ${isLight ? 'text-slate-500' : 'text-slate-500'}` }, 'Close (Esc)')
          )
        ),

      // ==========================================
      // MODAL 3: PAYMENT VIA DYNAMIC QR & UPI (Z-INDEX PROTECTED)
      // ==========================================
      showPayment &&
        paymentTrip &&
        React.createElement(
          'div',
          { className: 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in' },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-sm rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-4 text-center ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}` },
            React.createElement(
              'div',
              { className: 'flex justify-between items-center' },
              React.createElement('span', { className: `text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${isLight ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}` }, 'UPI / QR Checkout'),
              React.createElement('button', { onClick: () => setShowPayment(false), className: 'text-slate-400 hover:text-slate-600 font-bold text-sm' }, '✕')
            ),
            React.createElement('h3', { className: `text-2xl font-extrabold font-mono ${isLight ? 'text-black' : 'text-white'}` }, `Pay Driver ₹${paymentTrip.fare}`),
            React.createElement('p', { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, `Scan with PhonePe, Google Pay, Paytm, or BHIM for trip to ${paymentTrip.destinationLocation.split(',')[0]}`),
            React.createElement(DynamicQrCode, { fare: paymentTrip.fare, value: `upi://pay?pa=carpool.${paymentTrip.driverName.toLowerCase().replace(/\s+/g, '')}@okaxis&pn=${encodeURIComponent(paymentTrip.driverName)}&am=${paymentTrip.fare}&cu=INR` }),
            React.createElement(
              'div',
              { className: `p-3 rounded-2xl border text-xs text-left space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}` },
              React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', { className: 'text-slate-400' }, 'Driver UPI ID:'), React.createElement('span', { className: `font-mono font-bold ${isLight ? 'text-black' : 'text-cyan-300'}` }, `carpool.${paymentTrip.driverName.toLowerCase().replace(/\s+/g, '')}@okaxis`)),
              React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', { className: 'text-slate-400' }, 'Amount Payable:'), React.createElement('span', { className: 'font-mono font-extrabold text-emerald-500' }, `₹${paymentTrip.fare}`))
            ),
            React.createElement(
              'button',
              {
                onClick: () => {
                  toast.show('Payment Completed Successfully!', `₹${paymentTrip.fare} paid via UPI to ${paymentTrip.driverName}.`);
                  setShowPayment(false);
                },
                className: `w-full py-3.5 rounded-2xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500 shadow-lg shadow-yellow-500/25' : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30'} text-sm transition`,
              },
              'Confirm UPI / Wallet Payment'
            ),
            React.createElement('button', { onClick: () => setShowPayment(false), className: `w-full py-1 text-xs ${isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'}` }, 'Cancel')
          )
        ),

      // ==========================================
      // MODAL 4: ADD PAYMENT METHOD (UPI / CARD / NET BANKING)
      // ==========================================
      showAddMethod &&
        React.createElement(
          'div',
          { className: 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in' },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-md rounded-3xl border ${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-slate-900 border-slate-800 text-slate-200 shadow-2xl'} p-6 sm:p-8 space-y-5 text-xs animate-scale-up` },
            // Modal Header
            React.createElement(
              'div',
              { className: `flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}` },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-lg font-extrabold ${isLight ? 'text-black' : 'text-white'}` }, 'Add Payment Method'),
                React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}` }, 'Add secure payment mode for Kolkata carpools')
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    setShowAddMethod(false);
                    resetPmForm();
                  },
                  className: `font-bold text-base p-1 ${isLight ? 'text-slate-400 hover:text-black' : 'text-slate-400 hover:text-white'}`,
                },
                '✕'
              )
            ),

            // Tab Selector: UPI | Card | Net Banking
            React.createElement(
              'div',
              { className: `grid grid-cols-3 gap-1.5 p-1 rounded-2xl border font-bold ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}` },
              ['UPI', 'Card', 'NetBanking'].map((tabKey) => {
                const label = tabKey === 'UPI' ? '○ UPI' : tabKey === 'Card' ? '○ Card' : '○ Net Bank';
                const iconName = tabKey === 'UPI' ? 'qrcode' : tabKey === 'Card' ? 'creditcard' : 'building';
                const isActive = addMethodTab === tabKey;
                return React.createElement(
                  'button',
                  {
                    key: tabKey,
                    type: 'button',
                    onClick: () => {
                      setAddMethodTab(tabKey);
                      setPmFormError(null);
                    },
                    className: `py-2 px-2 rounded-xl text-center transition flex items-center justify-center gap-1.5 ${
                      isActive
                        ? isLight
                          ? 'bg-yellow-400 text-black shadow-md border border-yellow-500'
                          : 'bg-blue-600 text-white shadow-md'
                        : isLight
                        ? 'text-slate-600 hover:text-black'
                        : 'text-slate-400 hover:text-white'
                    }`,
                  },
                  React.createElement(Icon, { name: iconName, className: 'w-3.5 h-3.5' }),
                  React.createElement('span', null, label)
                );
              })
            ),

            // Error Banner if validation error
            pmFormError &&
              React.createElement(
                'div',
                { className: 'p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs' },
                React.createElement(Icon, { name: 'alertTriangle', className: 'w-4 h-4 shrink-0 text-rose-500' }),
                React.createElement('span', null, pmFormError)
              ),

            // Form Content
            React.createElement(
              'form',
              { onSubmit: handleAddMethodSubmit, className: 'space-y-4' },
              // TAB 1: UPI
              addMethodTab === 'UPI' &&
                React.createElement(
                  'div',
                  { className: 'space-y-3' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'UPI Virtual Payment Address (VPA) *'),
                    React.createElement('input', {
                      type: 'text',
                      required: true,
                      placeholder: 'e.g. raj@okaxis or 9876543210@paytm',
                      value: pmUpiId,
                      onChange: (e) => setPmUpiId(e.target.value),
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'} border rounded-xl px-3.5 py-2.5 font-mono focus:outline-none`,
                    }),
                    React.createElement(
                      'div',
                      { className: 'flex flex-wrap items-center gap-1.5 mt-2' },
                      React.createElement('span', { className: `text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}` }, 'Quick handles:'),
                      ['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@upi'].map((suf) =>
                        React.createElement(
                          'button',
                          {
                            key: suf,
                            type: 'button',
                            onClick: () => {
                              const prefix = pmUpiId.split('@')[0] || currentUser.email.split('@')[0];
                              setPmUpiId(`${prefix}${suf}`);
                            },
                            className: `px-2 py-0.5 rounded-lg text-[10px] font-mono border transition ${
                              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`,
                          },
                          suf
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Account Holder Name (Optional)'),
                    React.createElement('input', {
                      type: 'text',
                      placeholder: currentUser.name,
                      value: pmUpiHolder,
                      onChange: (e) => setPmUpiHolder(e.target.value),
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'} border rounded-xl px-3.5 py-2.5 focus:outline-none`,
                    })
                  ),
                  React.createElement(
                    'label',
                    { className: 'flex items-center gap-2 pt-1 cursor-pointer' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: pmUpiDefault,
                      onChange: (e) => setPmUpiDefault(e.target.checked),
                      className: 'rounded border-slate-800 text-blue-600 focus:ring-blue-500',
                    }),
                    React.createElement('span', { className: isLight ? 'text-slate-700' : 'text-slate-300' }, 'Set as primary default payment method')
                  )
                ),

              // TAB 2: CARD
              addMethodTab === 'Card' &&
                React.createElement(
                  'div',
                  { className: 'space-y-3' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Cardholder Name *'),
                    React.createElement('input', {
                      type: 'text',
                      required: true,
                      placeholder: 'e.g. Raj Patel',
                      value: pmCardHolder,
                      onChange: (e) => setPmCardHolder(e.target.value),
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'} border rounded-xl px-3.5 py-2.5 focus:outline-none`,
                    })
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Card Number (16 Digits) *'),
                    React.createElement('input', {
                      type: 'text',
                      required: true,
                      placeholder: '4532 8901 2345 6789',
                      value: pmCardNum,
                      onChange: (e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const fmt = raw.replace(/(\d{4})/g, '$1 ').trim();
                        setPmCardNum(fmt);
                      },
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black font-mono focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white font-mono focus:border-blue-500'} border rounded-xl px-3.5 py-2.5 focus:outline-none`,
                    })
                  ),
                  React.createElement(
                    'div',
                    { className: 'grid grid-cols-3 gap-3' },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Brand'),
                      React.createElement(
                        'select',
                        {
                          value: pmCardBrand,
                          onChange: (e) => setPmCardBrand(e.target.value),
                          className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-2.5 py-2.5 focus:outline-none`,
                        },
                        React.createElement('option', { value: 'Visa' }, 'Visa'),
                        React.createElement('option', { value: 'Mastercard' }, 'Mastercard'),
                        React.createElement('option', { value: 'RuPay' }, 'RuPay'),
                        React.createElement('option', { value: 'Amex' }, 'Amex')
                      )
                    ),
                    React.createElement(
                      'div',
                      null,
                      React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Expiry *'),
                      React.createElement('input', {
                        type: 'text',
                        required: true,
                        placeholder: '08/29',
                        value: pmCardExp,
                        onChange: (e) => {
                          let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (raw.length >= 3) raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
                          setPmCardExp(raw);
                        },
                        className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black font-mono' : 'bg-slate-950 border-slate-800 text-white font-mono'} border rounded-xl px-3 py-2.5 text-center focus:outline-none`,
                      })
                    ),
                    React.createElement(
                      'div',
                      null,
                      React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'CVV *'),
                      React.createElement('input', {
                        type: 'password',
                        required: true,
                        maxLength: 4,
                        placeholder: '•••',
                        value: pmCardCvv,
                        onChange: (e) => setPmCardCvv(e.target.value.replace(/\D/g, '')),
                        className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black font-mono' : 'bg-slate-950 border-slate-800 text-white font-mono'} border rounded-xl px-3 py-2.5 text-center focus:outline-none`,
                      })
                    )
                  ),
                  React.createElement(
                    'div',
                    { className: `p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'}` },
                    React.createElement(Icon, { name: 'lock', className: 'w-3.5 h-3.5 text-emerald-500 shrink-0' }),
                    React.createElement('span', null, 'CVV is used for 1-time verification and is never stored on servers.')
                  ),
                  React.createElement(
                    'label',
                    { className: 'flex items-center gap-2 pt-1 cursor-pointer' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: pmCardDefault,
                      onChange: (e) => setPmCardDefault(e.target.checked),
                      className: 'rounded border-slate-800 text-blue-600 focus:ring-blue-500',
                    }),
                    React.createElement('span', { className: isLight ? 'text-slate-700' : 'text-slate-300' }, 'Set as primary default payment method')
                  )
                ),

              // TAB 3: NET BANKING
              addMethodTab === 'NetBanking' &&
                React.createElement(
                  'div',
                  { className: 'space-y-3' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Select Bank *'),
                    React.createElement(
                      'select',
                      {
                        value: pmNetBank,
                        onChange: (e) => setPmNetBank(e.target.value),
                        className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 focus:outline-none`,
                      },
                      React.createElement('option', { value: 'State Bank of India' }, 'State Bank of India (SBI)'),
                      React.createElement('option', { value: 'HDFC Bank' }, 'HDFC Bank'),
                      React.createElement('option', { value: 'ICICI Bank' }, 'ICICI Bank'),
                      React.createElement('option', { value: 'Axis Bank' }, 'Axis Bank'),
                      React.createElement('option', { value: 'Kotak Mahindra Bank' }, 'Kotak Mahindra Bank'),
                      React.createElement('option', { value: 'Punjab National Bank' }, 'Punjab National Bank')
                    )
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Account Holder Name (Optional)'),
                    React.createElement('input', {
                      type: 'text',
                      placeholder: currentUser.name,
                      value: pmNetHolder,
                      onChange: (e) => setPmNetHolder(e.target.value),
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white focus:border-blue-500'} border rounded-xl px-3.5 py-2.5 focus:outline-none`,
                    })
                  ),
                  React.createElement(
                    'div',
                    null,
                    React.createElement('label', { className: `font-semibold block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-200'}` }, 'Account Number (Last 4 Digits Saved)'),
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'e.g. 984029482910',
                      value: pmNetAcc,
                      onChange: (e) => setPmNetAcc(e.target.value.replace(/\D/g, '')),
                      className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black font-mono focus:border-yellow-500' : 'bg-slate-950 border-slate-800 text-white font-mono focus:border-blue-500'} border rounded-xl px-3.5 py-2.5 focus:outline-none`,
                    })
                  ),
                  React.createElement(
                    'label',
                    { className: 'flex items-center gap-2 pt-1 cursor-pointer' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: pmNetDefault,
                      onChange: (e) => setPmNetDefault(e.target.checked),
                      className: 'rounded border-slate-800 text-blue-600 focus:ring-blue-500',
                    }),
                    React.createElement('span', { className: isLight ? 'text-slate-700' : 'text-slate-300' }, 'Set as primary default payment method')
                  )
                ),

              // Modal Action Buttons
              React.createElement(
                'div',
                { className: `flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}` },
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    onClick: () => {
                      setShowAddMethod(false);
                      resetPmForm();
                    },
                    className: `px-4 py-2 rounded-xl font-semibold transition ${isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'}`,
                  },
                  'Cancel'
                ),
                React.createElement(
                  'button',
                  {
                    type: 'submit',
                    disabled: isMethodSaving,
                    className: `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition disabled:opacity-50 ${
                      isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                    }`,
                  },
                  isMethodSaving && React.createElement('div', { className: 'w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin' }),
                  React.createElement('span', null, isMethodSaving ? 'Saving Method...' : 'Save Payment Method')
                )
              )
            )
          )
        ),

      // ==========================================
      // MODAL 5: CONFIRM DELETE PAYMENT METHOD
      // ==========================================
      deleteTargetMethod &&
        React.createElement(
          'div',
          { className: 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in' },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-sm rounded-3xl border ${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-2xl' : 'bg-slate-900 border-slate-800 text-white shadow-2xl'} p-6 text-center space-y-4 animate-scale-up` },
            React.createElement(
              'div',
              { className: 'w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto' },
              React.createElement(Icon, { name: 'alertTriangle', className: 'w-6 h-6 text-rose-500' })
            ),
            React.createElement(
              'div',
              null,
              React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Remove Payment Method?'),
              React.createElement(
                'p',
                { className: `text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1.5 leading-relaxed` },
                'Are you sure you want to remove ',
                React.createElement('strong', { className: isLight ? 'text-black' : 'text-slate-200' }, deleteTargetMethod.title),
                ` (${deleteTargetMethod.details})? This action cannot be undone.`
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center justify-center gap-3 pt-2' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setDeleteTargetMethod(null),
                  className: `px-4 py-2 rounded-xl font-bold text-xs border transition ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`,
                },
                'Cancel'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: handleConfirmDeleteMethod,
                  className: 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition',
                },
                'Yes, Remove'
              )
            )
          )
        ),

      // ==========================================
      // MODAL 6: CREATE SUPPORT TICKET
      // ==========================================
      showCreateTicket &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-lg rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-slate-800 shadow-2xl text-white'} p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto` },
            React.createElement(
              'div',
              { className: `flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
              React.createElement(
                'div',
                null,
                React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, '+ Create Support Ticket'),
                React.createElement('p', { className: `text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Generate a tracked ticket for corporate mobility issues')
              ),
              React.createElement('button', { onClick: () => setShowCreateTicket(false), className: `p-2 rounded-xl ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'} transition` }, '✕')
            ),
            React.createElement(
              'form',
              { onSubmit: handleCreateTicketSubmit, className: 'space-y-4' },
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Subject *'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  placeholder: 'e.g. Fare mismatch on Sector V trip, vehicle delay...',
                  value: tktSubject,
                  onChange: (e) => setTktSubject(e.target.value),
                  className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none`,
                })
              ),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 gap-4' },
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Category *'),
                  React.createElement(
                    'select',
                    { value: tktCategory, onChange: (e) => setTktCategory(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none` },
                    ['Ride Issues', 'Payment Issues', 'Driver Issues', 'Passenger Issues', 'Account Issues', 'Cancellation & Refund', 'Technical Problems', 'Other'].map((c) => React.createElement('option', { key: c, value: c }, c))
                  )
                ),
                React.createElement(
                  'div',
                  null,
                  React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Priority *'),
                  React.createElement(
                    'select',
                    { value: tktPriority, onChange: (e) => setTktPriority(e.target.value), className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none` },
                    ['Low', 'Medium', 'High'].map((p) => React.createElement('option', { key: p, value: p }, p))
                  )
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Description *'),
                React.createElement('textarea', {
                  rows: 4,
                  required: true,
                  placeholder: 'Provide all relevant details: trip ID, date/time, vehicle plate, or transaction reference...',
                  value: tktDesc,
                  onChange: (e) => setTktDesc(e.target.value),
                  className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl p-3.5 text-xs focus:outline-none`,
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'text-slate-400 font-bold uppercase text-[10px] block mb-1' }, 'Attachment (Optional)'),
                React.createElement('input', {
                  type: 'file',
                  onChange: (e) => e.target.files?.[0] && setTktAttachName(e.target.files[0].name),
                  className: `w-full ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'} border rounded-xl p-2 text-xs text-slate-400 cursor-pointer`,
                })
              ),
              React.createElement(
                'div',
                { className: 'flex items-center justify-end gap-3 pt-2' },
                React.createElement('button', { type: 'button', onClick: () => setShowCreateTicket(false), className: `px-4 py-2 rounded-xl border ${isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-400'}` }, 'Cancel'),
                React.createElement('button', { type: 'submit', disabled: isCreatingTicket, className: `px-5 py-2 rounded-xl font-bold ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-500 shadow-md' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'} transition` }, isCreatingTicket ? 'Submitting...' : 'Submit Ticket')
              )
            )
          )
        ),

      // ==========================================
      // MODAL 7: SUPPORT TICKET CONVERSATION THREAD
      // ==========================================
      activeTicketDetail &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-xl rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-slate-800 shadow-2xl text-white'} p-6 sm:p-7 space-y-4 max-h-[90vh] flex flex-col overflow-hidden` },
            React.createElement(
              'div',
              { className: `flex items-start justify-between pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: `font-mono font-extrabold text-sm ${isLight ? 'text-blue-700' : 'text-cyan-400'}` }, `Ticket #${activeTicketDetail.ticketNumber}`),
                  React.createElement('span', { className: `px-2 py-0.5 rounded-full font-bold text-[10px] ${isLight ? 'bg-blue-100 text-blue-900' : 'bg-blue-500/20 text-blue-300'}` }, activeTicketDetail.status)
                ),
                React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'} mt-1` }, activeTicketDetail.subject),
                React.createElement('p', { className: 'text-[10px] text-slate-400 font-mono' }, `Category: ${activeTicketDetail.category} • Created: ${activeTicketDetail.createdAt?.split('T')[0] || '2026-08-01'}`)
              ),
              React.createElement('button', { onClick: () => setActiveTicketDetail(null), className: `p-2 rounded-xl ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'} transition` }, '✕')
            ),
            // Messages thread
            React.createElement(
              'div',
              { className: `flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'}` },
              activeTicketDetail.replies && activeTicketDetail.replies.length > 0
                ? activeTicketDetail.replies.map((r) => {
                    const isAdmin = r.senderRole === 'admin';
                    return React.createElement(
                      'div',
                      {
                        key: r.id,
                        className: `p-3.5 rounded-2xl border ${
                          isAdmin
                            ? isLight
                              ? 'bg-blue-50 border-blue-200 text-blue-950 ml-4'
                              : 'bg-blue-950/40 border-blue-500/30 text-blue-100 ml-4'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-900 mr-4'
                            : 'bg-slate-900 border-slate-800 text-slate-200 mr-4'
                        } space-y-1`,
                      },
                      React.createElement(
                        'div',
                        { className: 'flex items-center justify-between text-[10px]' },
                        React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'}` }, `${r.senderName} ${isAdmin ? '[Staff Lead]' : ''}`),
                        React.createElement('span', { className: 'font-mono text-slate-400' }, r.createdAt?.split('T')[0] || 'Today')
                      ),
                      React.createElement('p', { className: 'text-xs leading-relaxed' }, r.message)
                    );
                  })
                : React.createElement('div', { className: 'text-slate-500 text-center py-4' }, 'No messages yet.')
            ),
            // Reply Input
            React.createElement(
              'div',
              { className: 'pt-2 flex items-center gap-2' },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Type your message / update...',
                value: tktReplyText,
                onChange: (e) => setTktReplyText(e.target.value),
                onKeyDown: (e) => e.key === 'Enter' && handleSendTicketReply(),
                className: `flex-1 ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none`,
              }),
              React.createElement(
                'button',
                {
                  onClick: handleSendTicketReply,
                  disabled: !tktReplyText.trim(),
                  className: `px-4 py-2.5 rounded-xl font-bold transition disabled:opacity-50 ${isLight ? 'bg-yellow-400 text-black border border-yellow-500' : 'bg-blue-600 text-white'}`
                },
                'Send'
              )
            )
          )
        ),

      // ==========================================
      // MODAL 8: RIDE RECORD DETAILS & RECEIPT
      // ==========================================
      rhSelectedRecord &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-lg rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-slate-800 shadow-2xl text-white'} p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto` },
            React.createElement(
              'div',
              { className: `flex items-start justify-between pb-3 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}` },
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: `font-mono font-extrabold text-sm ${isLight ? 'text-blue-700' : 'text-cyan-400'}` }, rhSelectedRecord.id),
                  React.createElement('span', { className: `px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${isLight ? 'bg-emerald-100 text-emerald-900' : 'bg-emerald-500/15 text-emerald-400'}` }, rhSelectedRecord.status)
                ),
                React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'} mt-1` }, 'Ride Summary & Tax Invoice'),
                React.createElement('p', { className: 'text-[10px] text-slate-400 font-mono' }, `${rhSelectedRecord.date} at ${rhSelectedRecord.time} • Odoo Mobility Kolkata`)
              ),
              React.createElement('button', { onClick: () => setRhSelectedRecord(null), className: `p-2 rounded-xl ${isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'} transition` }, '✕')
            ),
            // Route
            React.createElement(
              'div',
              { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'} space-y-3` },
              React.createElement(
                'div',
                { className: 'flex items-start gap-3' },
                React.createElement('div', { className: 'w-3 h-3 rounded-full bg-emerald-400 mt-1 shrink-0' }),
                React.createElement('div', null, React.createElement('span', { className: 'text-[10px] text-slate-500 uppercase font-bold' }, 'Pickup Origin'), React.createElement('p', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, rhSelectedRecord.startLocation))
              ),
              React.createElement(
                'div',
                { className: 'flex items-start gap-3' },
                React.createElement('div', { className: 'w-3 h-3 rounded-full bg-rose-400 mt-1 shrink-0' }),
                React.createElement('div', null, React.createElement('span', { className: 'text-[10px] text-slate-500 uppercase font-bold' }, 'Drop Destination'), React.createElement('p', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, rhSelectedRecord.destinationLocation))
              ),
              React.createElement(
                'div',
                { className: `flex items-center justify-between text-[11px] font-mono ${isLight ? 'text-slate-600 border-t border-slate-200' : 'text-slate-400 border-t border-slate-800/80'} pt-2` },
                React.createElement('span', null, 'Estimated Distance: ', React.createElement('strong', null, `${rhSelectedRecord.distanceKm || 14.8} km`)),
                React.createElement('span', null, 'Seats Booked: ', React.createElement('strong', null, `${rhSelectedRecord.seats || 1} Seat`))
              )
            ),
            // Driver & Vehicle
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 gap-3' },
              React.createElement(
                'div',
                { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'} space-y-1` },
                React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500' }, 'Driver'),
                React.createElement('div', { className: `font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, rhSelectedRecord.driverName),
                React.createElement('div', { className: 'text-[10px] text-slate-400 font-mono' }, rhSelectedRecord.driverPhone || '+91 98765 43210'),
                React.createElement('div', { className: 'text-[10px] text-amber-400 font-semibold' }, `⭐ ${rhSelectedRecord.rating || 4.9} / 5.0`)
              ),
              React.createElement(
                'div',
                { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'} space-y-1` },
                React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-500' }, 'Vehicle'),
                React.createElement('div', { className: `font-mono font-bold ${isLight ? 'text-black' : 'text-white'} text-xs` }, rhSelectedRecord.registrationNumber),
                React.createElement('div', { className: 'text-[10px] text-slate-400' }, rhSelectedRecord.vehicleModel),
                React.createElement('div', { className: 'text-[10px] text-cyan-400 font-semibold' }, 'WB Verified Fleet')
              )
            ),
            // Payment Breakdown
            React.createElement(
              'div',
              { className: `p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'} space-y-2` },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between' },
                React.createElement('span', { className: `text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}` }, 'Payment Breakdown:'),
                React.createElement('span', { className: 'px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/15 text-emerald-400' }, (rhSelectedRecord.paymentStatus || 'PAID').toUpperCase())
              ),
              React.createElement('div', { className: 'flex justify-between text-xs pt-1' }, React.createElement('span', { className: 'text-slate-400' }, 'Carpool Base Commute Fare'), React.createElement('span', { className: `font-mono font-bold ${isLight ? 'text-black' : 'text-white'}` }, `₹${rhSelectedRecord.fare}`)),
              React.createElement('div', { className: 'flex justify-between text-xs' }, React.createElement('span', { className: 'text-slate-400' }, 'FASTag & Fuel Subsidy'), React.createElement('span', { className: 'font-mono text-emerald-400 font-bold' }, 'Included (₹0 Toll)')),
              React.createElement('div', { className: 'flex justify-between text-xs' }, React.createElement('span', { className: 'text-slate-400' }, 'Payment Gateway / Method'), React.createElement('span', { className: `font-mono font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}` }, rhSelectedRecord.paymentMethod || 'UPI')),
              React.createElement('div', { className: `flex justify-between text-xs pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}` }, React.createElement('span', { className: `font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Total Amount Settled'), React.createElement('span', { className: 'font-mono font-extrabold text-sm text-emerald-400' }, `₹${rhSelectedRecord.fare}`))
            ),
            // Actions
            React.createElement(
              'div',
              { className: 'flex items-center justify-between pt-2' },
              React.createElement('button', { type: 'button', onClick: () => toast.show('GST Invoice Ready', `Receipt for ${rhSelectedRecord.id} generated.`), className: `flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold border ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'} transition` }, React.createElement(Icon, { name: 'receipt', className: 'w-4 h-4 text-cyan-400' }), React.createElement('span', null, 'Download Tax Invoice')),
              React.createElement('button', { type: 'button', onClick: () => setRhSelectedRecord(null), className: `px-5 py-2 rounded-xl font-bold ${isLight ? 'bg-yellow-400 text-black border border-yellow-500' : 'bg-blue-600 text-white'} transition` }, 'Close')
            )
          )
        )
    );
  }

  function App() {
    return React.createElement(ToastProvider, null, React.createElement(MainApp));
  }

  // Mount to DOM
  const rootEl = document.getElementById('root');
  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(React.createElement(App));
  }
})();
