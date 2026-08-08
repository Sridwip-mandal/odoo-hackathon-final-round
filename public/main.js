// CARPOOL Enterprise Mobility Platform - Complete Master Application
(function () {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const { useState, useEffect, useRef } = React;
  const store = window.CARPOOL.store;
  const { MapView, FuelTrendSvg, CostliestVehiclesSvg, Icon, DynamicQrCode, ToastProvider, useToast } = window.CARPOOL_COMPONENTS;

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
    };

    return { route, navigate };
  }

  // --- Reusable StatCard ---
  function StatCard({ title, value, subtitle, iconName, colorScheme = 'blue', trend, onClick }) {
    const colors = {
      blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-400',
      cyan: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400',
      purple: 'from-purple-600/20 to-purple-900/10 border-purple-500/20 text-purple-400',
      emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400',
    };

    return React.createElement(
      'div',
      {
        onClick,
        className: `group relative overflow-hidden rounded-2xl bg-gradient-to-b ${colors[colorScheme]} p-5 border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
          onClick ? 'cursor-pointer' : ''
        }`,
      },
      React.createElement(
        'div',
        { className: 'flex items-start justify-between' },
        React.createElement(
          'div',
          null,
          React.createElement('p', { className: 'text-xs font-semibold uppercase tracking-wider text-slate-400' }, title),
          React.createElement('h3', { className: 'mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight' }, value)
        ),
        React.createElement(
          'div',
          { className: 'p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-inner' },
          React.createElement(Icon, { name: iconName, className: 'w-5 h-5' })
        )
      ),
      (trend || subtitle) &&
        React.createElement(
          'div',
          { className: 'mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80' },
          trend &&
            React.createElement(
              'span',
              { className: 'text-emerald-400 font-semibold flex items-center gap-1' },
              React.createElement(Icon, { name: 'leaf', className: 'w-3 h-3' }),
              trend
            ),
          subtitle && React.createElement('span', { className: 'text-slate-400 truncate' }, subtitle)
        )
    );
  }

  // --- Master App Container with Navigation and Pages ---
  function MainApp() {
    const { route, navigate } = useHashRouter();
    const [currentUser, setCurrentUser] = useState(() => store.getCurrentUser());
    const [users, setUsers] = useState(() => store.getUsers());
    const [vehicles, setVehicles] = useState(() => store.getVehicles());
    const [rides, setRides] = useState(() => store.getRides());
    const [trips, setTrips] = useState(() => store.getTrips());
    const [txs, setTxs] = useState(() => store.getTxs());
    const [settings, setSettings] = useState(() => store.getSettings());

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
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const toast = useToast();

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

    // --- Page 1: Splash Screen (wireframe page 17) ---
    if (route === '/' || route === '/splash') {
      return React.createElement(
        'div',
        { className: 'min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden' },
        React.createElement('div', { className: 'absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none' }),
        React.createElement(
          'div',
          { className: 'relative z-10 max-w-lg w-full p-8 sm:p-12 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-2xl space-y-6' },
          React.createElement(
            'div',
            { className: 'w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 animate-bounce', style: { animationDuration: '2.5s' } },
            React.createElement(Icon, { name: 'car', className: 'w-12 h-12' })
          ),
          React.createElement(
            'div',
            { className: 'space-y-2' },
            React.createElement('div', { className: 'text-[11px] font-bold uppercase tracking-widest text-cyan-400' }, 'Enterprise Mobility Platform'),
            React.createElement('h1', { className: 'text-4xl sm:text-5xl font-extrabold text-white tracking-tight' }, 'CARPOOL'),
            React.createElement('p', { className: 'text-lg font-medium text-cyan-300' }, '“Ride Together, Save Together”'),
            React.createElement('p', { className: 'text-xs text-slate-400 pt-2' }, 'Connecting corporate employees for secure, shared commutes.')
          ),
          React.createElement(
            'div',
            { className: 'pt-4 space-y-3' },
            React.createElement(
              'button',
              {
                onClick: () => navigate('/login'),
                className: 'w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2',
              },
              React.createElement('span', null, 'Proceed to Login'),
              React.createElement(Icon, { name: 'arrowRight', className: 'w-4 h-4' })
            )
          )
        )
      );
    }

    // --- Page 2: Login Page (wireframe page 16) ---
    if (route === '/login') {
      return React.createElement(
        'div',
        { className: 'min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden' },
        React.createElement(
          'div',
          { className: 'sm:mx-auto sm:w-full sm:max-w-md text-center mb-6' },
          React.createElement(
            'div',
            { onClick: () => navigate('/'), className: 'inline-flex items-center gap-2 cursor-pointer' },
            React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center' }, React.createElement(Icon, { name: 'car', className: 'w-5 h-5' })),
            React.createElement('span', { className: 'text-2xl font-extrabold text-white' }, 'CARPOOL')
          ),
          React.createElement('h2', { className: 'mt-3 text-2xl font-bold text-white' }, 'Login To Continue'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Enterprise Employee & Admin Sign In')
        ),
        React.createElement(
          'div',
          { className: 'sm:mx-auto sm:w-full sm:max-w-md' },
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-5 text-xs' },
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
                React.createElement('label', { className: 'text-slate-300 font-semibold block mb-1' }, 'Email / Mobile *'),
                React.createElement('input', {
                  type: 'text',
                  defaultValue: currentUser.email,
                  required: true,
                  className: 'w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white font-mono',
                })
              ),
              React.createElement(
                'div',
                null,
                React.createElement('label', { className: 'text-slate-300 font-semibold block mb-1' }, 'Password *'),
                React.createElement('input', {
                  type: 'password',
                  defaultValue: 'password123',
                  required: true,
                  className: 'w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-white font-mono',
                })
              ),
              React.createElement(
                'div',
                { className: 'flex justify-between items-center text-slate-400' },
                React.createElement('label', { className: 'flex items-center gap-1.5 cursor-pointer' }, React.createElement('input', { type: 'checkbox', defaultChecked: true }), ' Remember me'),
                React.createElement('span', { className: 'text-cyan-400 cursor-pointer hover:underline' }, 'Forgot Password?')
              ),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: 'w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/30 transition',
                },
                'Login'
              )
            ),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/signup'),
                className: 'w-full py-2.5 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 font-semibold hover:text-white',
              },
              'Create New Account'
            ),
            React.createElement(
              'div',
              { className: 'pt-2 border-t border-slate-800' },
              React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-400 block mb-2' }, '⚡ Quick Demo User Switcher'),
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
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`,
                    },
                    React.createElement('img', { src: u.avatar, className: 'w-6 h-6 rounded-full object-cover shrink-0' }),
                    React.createElement('div', { className: 'truncate' }, React.createElement('div', { className: 'text-[11px] truncate text-white' }, u.name), React.createElement('div', { className: 'text-[9px] uppercase text-slate-500' }, u.role))
                  )
                )
              )
            )
          )
        )
      );
    }

    // --- Page 3: Sign Up (wireframe page 14) ---
    if (route === '/signup') {
      return React.createElement(
        'div',
        { className: 'min-h-screen bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8' },
        React.createElement(
          'div',
          { className: 'max-w-xl mx-auto w-full space-y-6' },
          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement('h2', { className: 'text-2xl font-extrabold text-white' }, 'Sign Up - Create Account'),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, 'Register for the corporate carpool platform')
          ),
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl text-xs space-y-4' },
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Account Created!', 'Welcome to CARPOOL. ₹500 welcome subsidy added.');
                  navigate('/dashboard');
                },
                className: 'space-y-3.5',
              },
              React.createElement('input', { type: 'text', required: true, placeholder: 'Full Name (e.g. Sridwip Mandal)', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
              React.createElement('input', { type: 'email', required: true, placeholder: 'Corporate Email (name@odoo.com)', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono' }),
              React.createElement('input', { type: 'text', required: true, placeholder: 'Mobile Number (+91 98765...)', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono' }),
              React.createElement('input', { type: 'text', placeholder: 'Employee ID (EMP-1052)', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono' }),
              React.createElement('input', { type: 'password', required: true, placeholder: 'Password', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
              React.createElement('input', { type: 'password', required: true, placeholder: 'Confirm Password', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
              React.createElement(
                'button',
                {
                  type: 'submit',
                  className: 'w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition',
                },
                'Create Account'
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => navigate('/login'),
                  className: 'w-full py-2.5 text-slate-400 hover:text-white',
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
          { className: 'sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-xl' },
          React.createElement(
            'div',
            { className: 'mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8' },
            React.createElement(
              'div',
              { onClick: () => navigate('/admin/dashboard'), className: 'flex items-center gap-3 cursor-pointer' },
              React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30' }, React.createElement(Icon, { name: 'shield', className: 'w-5 h-5' })),
              React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'flex items-center gap-2' }, React.createElement('span', { className: 'font-extrabold text-white text-base' }, settings.companyName), React.createElement('span', { className: 'bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-500/30' }, 'ADMIN')),
                React.createElement('span', { className: 'text-[10px] text-slate-400' }, 'Enterprise Mobility Console')
              )
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement(
                'button',
                {
                  onClick: () => navigate('/dashboard'),
                  className: 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold',
                },
                React.createElement(Icon, { name: 'arrowUpDown', className: 'w-3.5 h-3.5' }),
                'Employee View'
              ),
              React.createElement(
                'div',
                { className: 'flex items-center gap-2.5 pl-2 border-l border-slate-800' },
                React.createElement('img', { src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', className: 'w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/50' }),
                React.createElement(
                  'button',
                  { onClick: () => navigate('/login'), className: 'text-xs text-rose-400 hover:underline' },
                  'Logout'
                )
              )
            )
          )
        );
      }

      // Employee Top Nav (matching wireframes: Dashboard, My Trips, Ride History, My Vehicle, Wallet, Setting, Report, User)
      return React.createElement(
        'header',
        { className: 'sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-xl' },
        React.createElement(
          'div',
          { className: 'mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8' },
          React.createElement(
            'div',
            { onClick: () => navigate('/dashboard'), className: 'flex items-center gap-2.5 cursor-pointer' },
            React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30' }, React.createElement(Icon, { name: 'car', className: 'w-5 h-5' })),
            React.createElement(
              'div',
              { className: 'flex flex-col' },
              React.createElement('span', { className: 'font-extrabold text-white text-base tracking-tight' }, 'CARPOOL'),
              React.createElement('span', { className: 'text-[9px] text-slate-400 -mt-1' }, 'Ride Together, Save Together')
            )
          ),
          React.createElement(
            'nav',
            { className: 'hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800' },
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
                  className: `px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                    route === link.to
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
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
            React.createElement(
              'button',
              {
                onClick: () => setShowSearch(true),
                className: 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs',
              },
              React.createElement(Icon, { name: 'search', className: 'w-3.5 h-3.5 text-cyan-400' }),
              React.createElement('span', { className: 'hidden sm:inline font-mono' }, '⌘K')
            ),
            React.createElement(
              'button',
              {
                onClick: () => navigate('/admin/dashboard'),
                className: 'hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold',
              },
              React.createElement(Icon, { name: 'shield', className: 'w-3 h-3' }),
              'Admin'
            ),
            React.createElement(
              'div',
              { onClick: () => navigate('/settings'), className: 'flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer' },
              React.createElement('img', { src: currentUser.avatar, className: 'w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50' }),
              React.createElement('span', { className: 'hidden md:inline text-xs font-bold text-white' }, currentUser.name)
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
          { className: 'sticky top-20 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-xl space-y-1' },
          links.map((link) =>
            React.createElement(
              'button',
              {
                key: link.to,
                onClick: () => navigate(link.to),
                className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  route === link.to
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`,
              },
              React.createElement(Icon, { name: link.icon, className: 'w-4 h-4' }),
              React.createElement('span', null, link.label)
            )
          ),
          React.createElement(
            'div',
            { className: 'pt-3 mt-3 border-t border-slate-800 px-2' },
            React.createElement(
              'button',
              {
                onClick: () => navigate('/offer-ride'),
                className: 'w-full py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-600 hover:text-white transition',
              },
              React.createElement(Icon, { name: 'plus', className: 'w-3.5 h-3.5' }),
              'Publish Ride'
            )
          )
        )
      );
    };

    // --- Admin Sidebar Navigation ---
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
          { className: 'rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-xl space-y-1' },
          adminLinks.map((link) =>
            React.createElement(
              'button',
              {
                key: link.to,
                onClick: () => navigate(link.to),
                className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  route === link.to
                    ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30'
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

    // --- Main Page Routing ---
    const renderPageContent = () => {
      // 1. Employee Dashboard (wireframe page 10 & 1)
      if (route === '/dashboard') {
        const upcomingTrip = trips.find((t) => t.status === 'upcoming' || t.status === 'active');
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-white' }, `Welcome back, ${currentUser.name}! 👋`),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-1' }, `${currentUser.department} • Base: ${currentUser.officeLocation} • Pool together along SG Highway.`)
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2.5' },
              React.createElement(
                'button',
                { onClick: () => navigate('/find-ride'), className: 'px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg' },
                'Find Ride'
              ),
              React.createElement(
                'button',
                { onClick: () => setShowRecharge(true), className: 'px-4 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold' },
                'Recharge Wallet'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
            React.createElement(StatCard, { title: 'Available Rides', value: rides.length, subtitle: 'Active routes', iconName: 'car', colorScheme: 'blue', onClick: () => navigate('/find-ride') }),
            React.createElement(StatCard, { title: 'Upcoming Trips', value: trips.filter((t) => t.status === 'upcoming').length, subtitle: 'Scheduled', iconName: 'clock', colorScheme: 'cyan', onClick: () => navigate('/my-trips') }),
            React.createElement(StatCard, { title: 'Total Trips', value: currentUser.totalTrips || 42, subtitle: 'Shared commutes', iconName: 'chart', colorScheme: 'purple', onClick: () => navigate('/ride-history') }),
            React.createElement(StatCard, { title: 'Wallet Balance', value: `₹${currentUser.walletBalance}`, subtitle: 'Instant debit', iconName: 'wallet', colorScheme: 'emerald', onClick: () => setShowRecharge(true) })
          ),
          upcomingTrip &&
            React.createElement(
              'div',
              { className: 'rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950/60 to-slate-900 p-6 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
              React.createElement(
                'div',
                null,
                React.createElement('span', { className: 'text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full' }, 'Upcoming Commute'),
                React.createElement('h3', { className: 'text-lg font-bold text-white mt-1' }, `${upcomingTrip.startLocation} → ${upcomingTrip.destinationLocation}`),
                React.createElement('p', { className: 'text-xs text-slate-300' }, `Driver: ${upcomingTrip.driverName} (${upcomingTrip.vehicleModel}) • ${upcomingTrip.date} at ${upcomingTrip.time}`)
              ),
              React.createElement(
                'button',
                { onClick: () => navigate('/live-tracking'), className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg' },
                'Open Live Tracking'
              )
            ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(
              'div',
              { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4' },
              React.createElement('div', { className: 'flex justify-between' }, React.createElement('h3', { className: 'font-bold text-white text-sm' }, 'Fuel Efficiency Trend (km/L)'), React.createElement('span', { className: 'text-xs font-mono text-cyan-400' }, '18.4 km/L')),
              React.createElement(FuelTrendSvg)
            ),
            React.createElement(
              'div',
              { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4' },
              React.createElement('div', { className: 'flex justify-between' }, React.createElement('h3', { className: 'font-bold text-white text-sm' }, 'Top Costliest Vehicles'), React.createElement('span', { className: 'text-xs text-slate-500 font-mono' }, 'July 2026')),
              React.createElement(CostliestVehiclesSvg)
            )
          )
        );
      }

      // 2. Find Ride (wireframe page 9, 10, 15)
      if (route === '/find-ride') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-4 text-xs' },
            React.createElement('h1', { className: 'text-xl font-extrabold text-white' }, 'Find A Carpool Ride'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
              React.createElement('div', null, React.createElement('label', { className: 'text-slate-400 block mb-1 font-semibold' }, 'Start Location'), React.createElement('input', { type: 'text', defaultValue: 'ISKCON Cross Road, Ahmedabad', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' })),
              React.createElement('div', null, React.createElement('label', { className: 'text-slate-400 block mb-1 font-semibold' }, 'Destination Location'), React.createElement('input', { type: 'text', defaultValue: 'Infocity, Gandhinagar', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }))
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1' },
              React.createElement('div', null, React.createElement('label', { className: 'text-slate-400 block mb-1' }, 'Date & Time'), React.createElement('input', { type: 'text', readOnly: true, value: '18 Jul, 5:12PM', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono' })),
              React.createElement('div', null, React.createElement('label', { className: 'text-slate-400 block mb-1' }, 'Number of Seats'), React.createElement('select', { className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white' }, React.createElement('option', null, 'Seat 1'), React.createElement('option', null, 'Seat 2'))),
              React.createElement('div', { className: 'flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800' }, React.createElement('span', { className: 'text-white font-bold' }, 'Recurring Ride'), React.createElement('input', { type: 'checkbox', defaultChecked: true }))
            ),
            React.createElement(
              'button',
              {
                onClick: () => toast.show('Search Updated', 'Matching corridor rides refreshed.'),
                className: 'w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 text-sm',
              },
              'Find Ride'
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
            React.createElement(
              'div',
              { className: 'lg:col-span-6 space-y-3' },
              React.createElement('h3', { className: 'text-sm font-bold text-white' }, 'Interactive Gujarat Route Map'),
              React.createElement(MapView, { startName: 'ISKCON Cross Road', destName: 'Infocity', height: '420px' })
            ),
            React.createElement(
              'div',
              { className: 'lg:col-span-6 space-y-4' },
              React.createElement('h3', { className: 'text-sm font-bold text-white' }, 'Available Rides Today'),
              rides.map((r) =>
                React.createElement(
                  'div',
                  { key: r.id, className: 'p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3 text-xs' },
                  React.createElement(
                    'div',
                    { className: 'flex justify-between items-start' },
                    React.createElement(
                      'div',
                      { className: 'flex items-center gap-3' },
                      React.createElement('img', { src: r.driverAvatar, className: 'w-10 h-10 rounded-full object-cover ring-2 ring-blue-500' }),
                      React.createElement(
                        'div',
                        null,
                        React.createElement('h4', { className: 'font-bold text-white text-sm' }, r.driverName),
                        React.createElement('p', { className: 'text-[11px] text-slate-400' }, `${r.vehicleModel} • ${r.registrationNumber}`)
                      )
                    ),
                    React.createElement('div', { className: 'font-mono font-extrabold text-emerald-400 text-base' }, `₹${r.farePerSeat}`)
                  ),
                  React.createElement(
                    'div',
                    { className: 'p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between' },
                    React.createElement('span', { className: 'text-white' }, r.startLocation.split(',')[0]),
                    React.createElement('span', { className: 'text-slate-500' }, '→'),
                    React.createElement('span', { className: 'text-white' }, r.destinationLocation.split(',')[0])
                  ),
                  React.createElement(
                    'div',
                    { className: 'flex justify-between items-center pt-2' },
                    React.createElement('span', { className: 'text-slate-400' }, `${r.availableSeats} seats left • ${r.departureTime}`),
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
                        className: 'px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold',
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

      // 3. Live Tracking (wireframe page 12)
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
              React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'Live Trip Tracking'),
              React.createElement('p', { className: 'text-xs text-slate-400' }, `${activeTrip.startLocation} → ${activeTrip.destinationLocation}`)
            ),
            React.createElement('div', { className: 'p-3 bg-blue-950/80 border border-blue-500/40 rounded-2xl text-cyan-300 font-bold text-xs' }, 'Coming in 5 Minutes')
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
                { className: 'p-5 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-3' },
                React.createElement('h4', { className: 'font-bold text-white text-sm' }, activeTrip.driverName),
                React.createElement('p', { className: 'text-slate-400' }, `${activeTrip.vehicleModel} • ${activeTrip.registrationNumber}`),
                React.createElement(
                  'div',
                  { className: 'grid grid-cols-2 gap-2 pt-2' },
                  React.createElement('button', { onClick: () => setShowChat(true), className: 'py-2.5 rounded-xl bg-slate-800 text-cyan-400 font-bold border border-slate-700' }, 'Chat with Driver'),
                  React.createElement('button', { onClick: () => setShowCall(true), className: 'py-2.5 rounded-xl bg-slate-800 text-emerald-400 font-bold border border-slate-700' }, 'Call Driver')
                ),
                React.createElement('button', { onClick: () => toast.show('SOS Alert Dispatched', 'Security and dispatch alerted.', 'error'), className: 'w-full py-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 font-bold' }, 'Emergency SOS')
              ),
              React.createElement(
                'div',
                { className: 'p-5 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-3' },
                React.createElement('div', { className: 'flex justify-between' }, React.createElement('span', { className: 'text-slate-400' }, 'Fare Payable:'), React.createElement('span', { className: 'font-mono font-bold text-white text-base' }, `₹${activeTrip.fare}`)),
                React.createElement(
                  'button',
                  {
                    onClick: () => {
                      setPaymentTrip(activeTrip);
                      setShowPayment(true);
                    },
                    className: 'w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold',
                  },
                  `Pay ₹${activeTrip.fare} Now`
                )
              )
            )
          )
        );
      }

      // 4. My Trips (wireframe page 7 & 8)
      if (route === '/my-trips') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'My Trips'),
            React.createElement('button', { onClick: () => navigate('/find-ride'), className: 'px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold' }, 'Book New Ride')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-xs' },
            trips.map((t) =>
              React.createElement(
                'div',
                { key: t.id, className: 'p-5 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-3' },
                React.createElement(
                  'div',
                  { className: 'flex justify-between' },
                  React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase' }, t.status),
                  React.createElement('span', { className: 'font-mono text-slate-400' }, `${t.time} • ${t.date}`)
                ),
                React.createElement('h3', { className: 'text-sm font-bold text-white' }, `${t.startLocation} → ${t.destinationLocation}`),
                React.createElement('p', { className: 'text-slate-400' }, `Driver: ${t.driverName} • ${t.vehicleModel} (${t.registrationNumber})`),
                React.createElement(
                  'div',
                  { className: 'flex justify-between items-center pt-2 border-t border-slate-800' },
                  React.createElement('span', { className: 'font-bold text-emerald-400 font-mono text-base' }, `₹${t.fare}`),
                  React.createElement(
                    'div',
                    { className: 'flex gap-2' },
                    React.createElement('button', { onClick: () => navigate('/trip-details'), className: 'px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300' }, 'Details'),
                    React.createElement('button', { onClick: () => navigate('/live-tracking'), className: 'px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold' }, 'Track')
                  )
                )
              )
            )
          )
        );
      }

      // 5. Trip Details (wireframe page 8)
      if (route === '/trip-details') {
        const t = trips[0];
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto text-xs' },
          React.createElement(
            'div',
            { className: 'p-6 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-4' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Trip Details'),
            React.createElement(
              'div',
              { className: 'grid grid-cols-2 sm:grid-cols-4 gap-3' },
              React.createElement('div', { className: 'p-3 bg-slate-950 rounded-xl' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Driver'), React.createElement('strong', { className: 'text-white' }, t.driverName)),
              React.createElement('div', { className: 'p-3 bg-slate-950 rounded-xl' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Vehicle'), React.createElement('strong', { className: 'text-white' }, t.vehicleModel)),
              React.createElement('div', { className: 'p-3 bg-slate-950 rounded-xl' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Seat'), React.createElement('strong', { className: 'text-white' }, t.seatNumber)),
              React.createElement('div', { className: 'p-3 bg-slate-950 rounded-xl' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Fare'), React.createElement('strong', { className: 'text-emerald-400' }, `₹${t.fare}`))
            ),
            React.createElement(MapView, { startName: t.startLocation, destName: t.destinationLocation, height: '300px' }),
            React.createElement(
              'div',
              { className: 'flex justify-end gap-3 pt-2' },
              React.createElement('button', { onClick: () => setShowChat(true), className: 'px-4 py-2 rounded-xl bg-slate-800 text-white' }, 'Chat with Driver'),
              React.createElement('button', { onClick: () => navigate('/trip-finish'), className: 'px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold' }, `Pay ₹${t.fare} Now`)
            )
          )
        );
      }

      // 6. Trip Finish / Payment (wireframe page 7 & 4)
      if (route === '/trip-finish') {
        const t = trips[0];
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-2xl mx-auto text-xs' },
          React.createElement(
            'div',
            { className: 'p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-5' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Trip Finish & Payment Settlement'),
            React.createElement(
              'div',
              { className: 'p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2' },
              React.createElement('p', { className: 'font-bold text-white text-sm' }, `${t.startLocation} to ${t.destinationLocation}`),
              React.createElement('p', { className: 'text-slate-400' }, `Driver: ${t.driverName} • Total Fare: ₹${t.fare}`)
            ),
            React.createElement(
              'div',
              { className: 'p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3' },
              React.createElement('span', { className: 'text-slate-300 font-bold block' }, 'Scan QR to Pay via UPI'),
              React.createElement(DynamicQrCode, { value: 'raj@okaxis', fare: t.fare }),
              React.createElement('span', { className: 'font-mono text-cyan-400 font-bold' }, '@raj@okaxis')
            ),
            React.createElement(
              'button',
              {
                onClick: () => {
                  toast.show('Payment Completed Successfully', `₹${t.fare} settled.`);
                  navigate('/ride-history');
                },
                className: 'w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl',
              },
              `Pay ₹${t.fare} Now`
            )
          )
        );
      }

      // 7. Offer Ride (wireframe page 9)
      if (route === '/offer-ride') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-4xl mx-auto text-xs' },
          React.createElement(
            'div',
            { className: 'p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Offer & Publish A Ride'),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Ride Published Successfully', 'Colleagues can now book seats on your route.');
                  navigate('/find-ride');
                },
                className: 'space-y-4',
              },
              React.createElement('input', { type: 'text', required: true, defaultValue: 'ISKCON Cross Road, Ahmedabad', placeholder: 'Start Location', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white' }),
              React.createElement('input', { type: 'text', required: true, defaultValue: 'Infocity, Gandhinagar', placeholder: 'Destination Location', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white' }),
              React.createElement(
                'div',
                { className: 'grid grid-cols-2 gap-3' },
                React.createElement('input', { type: 'text', readOnly: true, value: '18 Jul, 5:12PM', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono' }),
                React.createElement('input', { type: 'number', defaultValue: 120, placeholder: 'Fare / Seat', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono' })
              ),
              React.createElement(
                'button',
                { type: 'submit', className: 'w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg' },
                'Publish Ride'
              )
            )
          )
        );
      }

      // 8. My Vehicle (wireframe page 3)
      if (route === '/my-vehicle') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'My Vehicle'),
            React.createElement('button', { onClick: () => setShowAddVehicle(true), className: 'px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold' }, '+ Add Vehicle')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-xs' },
            vehicles.map((v) =>
              React.createElement(
                'div',
                { key: v.id, className: 'p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3' },
                React.createElement(
                  'div',
                  { className: 'flex justify-between' },
                  React.createElement('h4', { className: 'font-bold text-white text-sm' }, v.model),
                  React.createElement('span', { className: 'font-mono text-cyan-400 font-bold' }, v.registrationNumber)
                ),
                React.createElement('p', { className: 'text-slate-400' }, `Seating Capacity: ${v.seatingCapacity} • Assigned Driver: ${v.driverName}`),
                React.createElement(
                  'div',
                  { className: 'flex justify-end gap-2 pt-2 border-t border-slate-800' },
                  React.createElement('button', { onClick: () => toast.show('Vehicle Status Updated', 'Active'), className: 'px-3 py-1 rounded-lg bg-slate-800 text-slate-300' }, 'Manage')
                )
              )
            )
          )
        );
      }

      // 9. Wallet & Payment Methods (wireframe page 6 & 4)
      if (route === '/wallet' || route === '/payment-methods') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: 'p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4' },
            React.createElement(
              'div',
              null,
              React.createElement('span', { className: 'text-slate-400 block' }, 'Wallet Balance'),
              React.createElement('h2', { className: 'text-3xl font-bold font-mono text-emerald-400' }, `₹ ${currentUser.walletBalance}`)
            ),
            React.createElement('button', { onClick: () => setShowRecharge(true), className: 'px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold' }, '+ Recharge Wallet')
          ),
          React.createElement(
            'div',
            { className: 'p-6 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-3' },
            React.createElement('h3', { className: 'font-bold text-white text-sm' }, 'Transaction History'),
            React.createElement(
              'div',
              { className: 'divide-y divide-slate-800 font-mono' },
              txs.map((tx) =>
                React.createElement(
                  'div',
                  { key: tx.id, className: 'py-3 flex justify-between' },
                  React.createElement('span', { className: 'text-white' }, tx.description),
                  React.createElement('span', { className: tx.type === 'credit' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold' }, `${tx.type === 'credit' ? '+' : '-'}₹${tx.amount}`)
                )
              )
            )
          )
        );
      }

      // 10. Ride History (wireframe page 5)
      if (route === '/ride-history') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'Ride History'),
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl' },
            React.createElement(
              'table',
              { className: 'w-full text-left' },
              React.createElement(
                'thead',
                { className: 'bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]' },
                React.createElement('tr', null, React.createElement('th', { className: 'p-4' }, 'Driver'), React.createElement('th', { className: 'p-4' }, 'Route'), React.createElement('th', { className: 'p-4' }, 'Vehicle'), React.createElement('th', { className: 'p-4' }, 'Date & Time'), React.createElement('th', { className: 'p-4' }, 'Fare'))
              ),
              React.createElement(
                'tbody',
                { className: 'divide-y divide-slate-800' },
                trips.map((r) =>
                  React.createElement(
                    'tr',
                    { key: r.id, className: 'hover:bg-slate-800/40' },
                    React.createElement('td', { className: 'p-4 font-bold text-white' }, r.driverName),
                    React.createElement('td', { className: 'p-4 text-slate-300' }, `${r.startLocation.split(',')[0]} to ${r.destinationLocation.split(',')[0]}`),
                    React.createElement('td', { className: 'p-4 text-cyan-400 font-mono' }, r.registrationNumber),
                    React.createElement('td', { className: 'p-4 text-slate-400' }, `${r.time} ${r.date}`),
                    React.createElement('td', { className: 'p-4 font-mono font-bold text-emerald-400' }, `₹${r.fare}`)
                  )
                )
              )
            )
          )
        );
      }

      // 11. Settings (wireframe page 2)
      if (route === '/settings') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs max-w-3xl mx-auto' },
          React.createElement(
            'div',
            { className: 'p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Settings & Profile'),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Profile Saved', 'Corporate settings updated.');
                },
                className: 'space-y-3.5',
              },
              React.createElement('input', { type: 'text', defaultValue: currentUser.name, placeholder: 'Name', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
              React.createElement('input', { type: 'email', defaultValue: currentUser.email, placeholder: 'Email', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
              React.createElement('input', { type: 'text', defaultValue: currentUser.mobile, placeholder: 'Mobile', className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
              React.createElement('button', { type: 'submit', className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold' }, 'Save Changes')
            )
          )
        );
      }

      // 12. Reports (wireframe page 1)
      if (route === '/reports') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'Reports'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs' },
            React.createElement('div', { className: 'p-5 rounded-2xl bg-slate-900 border border-slate-800' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Total Fuel Cost'), React.createElement('h3', { className: 'text-2xl font-bold text-white' }, 'Rs. 2.6L')),
            React.createElement('div', { className: 'p-5 rounded-2xl bg-slate-900 border border-slate-800' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Rides This Month'), React.createElement('h3', { className: 'text-2xl font-bold text-cyan-400' }, '163')),
            React.createElement('div', { className: 'p-5 rounded-2xl bg-slate-900 border border-slate-800' }, React.createElement('span', { className: 'text-slate-400 block' }, 'Utilization Rate'), React.createElement('h3', { className: 'text-2xl font-bold text-emerald-400' }, '82%'))
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement('div', { className: 'p-6 rounded-3xl bg-slate-900 border border-slate-800' }, React.createElement('h4', { className: 'font-bold text-white mb-2' }, 'Fuel Efficiency Trend (km/L)'), React.createElement(FuelTrendSvg)),
            React.createElement('div', { className: 'p-6 rounded-3xl bg-slate-900 border border-slate-800' }, React.createElement('h4', { className: 'font-bold text-white mb-2' }, 'Top 5 Costliest Vehicles'), React.createElement(CostliestVehiclesSvg))
          )
        );
      }

      // --- Admin Pages (wireframe pages 18, 19, 20) ---
      if (route === '/admin/dashboard' || route === '/admin') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in' },
          React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'Admin Dashboard'),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
            React.createElement(StatCard, { title: 'Total Employees', value: 48, subtitle: 'Registered', iconName: 'users', colorScheme: 'purple', onClick: () => navigate('/admin/employees') }),
            React.createElement(StatCard, { title: 'Registered Vehicles', value: 22, subtitle: 'Fleet', iconName: 'car', colorScheme: 'blue', onClick: () => navigate('/admin/vehicles') }),
            React.createElement(StatCard, { title: 'Rides This Month', value: 163, subtitle: 'Commutes', iconName: 'navigation', colorScheme: 'cyan', onClick: () => navigate('/admin/rides') }),
            React.createElement(StatCard, { title: 'Active Rides', value: 8, subtitle: 'Live now', iconName: 'chart', colorScheme: 'emerald', onClick: () => navigate('/admin/rides') })
          )
        );
      }

      if (route === '/admin/employees') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Employees Tab'),
            React.createElement('button', { onClick: () => setShowAddEmp(true), className: 'px-4 py-2 rounded-xl bg-purple-600 text-white font-bold' }, '+ Add Employee')
          ),
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden' },
            React.createElement(
              'table',
              { className: 'w-full text-left' },
              React.createElement('thead', { className: 'bg-slate-950 text-slate-400 uppercase text-[10px]' }, React.createElement('tr', null, React.createElement('th', { className: 'p-4' }, 'Name'), React.createElement('th', { className: 'p-4' }, 'Email'), React.createElement('th', { className: 'p-4' }, 'Department'), React.createElement('th', { className: 'p-4' }, 'Manager'), React.createElement('th', { className: 'p-4' }, 'Access'))),
              React.createElement(
                'tbody',
                { className: 'divide-y divide-slate-800' },
                users.map((u) =>
                  React.createElement(
                    'tr',
                    { key: u.id, className: 'hover:bg-slate-800/40' },
                    React.createElement('td', { className: 'p-4 font-bold text-white' }, u.name),
                    React.createElement('td', { className: 'p-4 text-slate-300' }, u.email),
                    React.createElement('td', { className: 'p-4 text-slate-300' }, u.department),
                    React.createElement('td', { className: 'p-4 text-slate-400' }, u.manager),
                    React.createElement('td', { className: 'p-4' }, React.createElement('span', { className: 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold' }, `[${u.platformAccess || 'Granted'}]`))
                  )
                )
              )
            )
          )
        );
      }

      if (route === '/admin/vehicles') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: 'flex justify-between items-center' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Vehicles Tab'),
            React.createElement('button', { onClick: () => setShowAddVehicle(true), className: 'px-4 py-2 rounded-xl bg-purple-600 text-white font-bold' }, '+ Add Vehicle')
          ),
          React.createElement(
            'div',
            { className: 'rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden' },
            React.createElement(
              'table',
              { className: 'w-full text-left' },
              React.createElement('thead', { className: 'bg-slate-950 text-slate-400 uppercase text-[10px]' }, React.createElement('tr', null, React.createElement('th', { className: 'p-4' }, 'Registration Number'), React.createElement('th', { className: 'p-4' }, 'Model'), React.createElement('th', { className: 'p-4' }, 'Seating Capacity'), React.createElement('th', { className: 'p-4' }, 'Driver'), React.createElement('th', { className: 'p-4' }, 'Status'))),
              React.createElement(
                'tbody',
                { className: 'divide-y divide-slate-800 font-mono' },
                vehicles.map((v) =>
                  React.createElement(
                    'tr',
                    { key: v.id, className: 'hover:bg-slate-800/40' },
                    React.createElement('td', { className: 'p-4 font-bold text-cyan-400' }, v.registrationNumber),
                    React.createElement('td', { className: 'p-4 font-sans text-white font-bold' }, v.model),
                    React.createElement('td', { className: 'p-4 text-slate-300' }, v.seatingCapacity),
                    React.createElement('td', { className: 'p-4 font-sans text-slate-300' }, v.driverName),
                    React.createElement('td', { className: 'p-4' }, React.createElement('span', { className: 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold' }, `[${v.status === 'approved' ? 'Active' : 'Inactive'}]`))
                  )
                )
              )
            )
          )
        );
      }

      if (route === '/admin/settings') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in text-xs' },
          React.createElement(
            'div',
            { className: 'p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-4' },
            React.createElement('h1', { className: 'text-xl font-bold text-white' }, 'Settings Tab'),
            React.createElement(
              'form',
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  toast.show('Settings saved successfully.', 'Company parameters updated.');
                },
                className: 'space-y-4',
              },
              React.createElement('div', { className: 'grid grid-cols-2 gap-3' }, React.createElement('input', { type: 'text', defaultValue: 'Odoo Pvt. Ltd.', placeholder: 'Company Name', className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white' }), React.createElement('input', { type: 'text', defaultValue: 'Gandhinagar', placeholder: 'Registered Address', className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white' })),
              React.createElement('div', { className: 'grid grid-cols-3 gap-3' }, React.createElement('input', { type: 'text', defaultValue: 'Rs. 96.50', placeholder: 'Fuel Cost / Liter', className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white' }), React.createElement('input', { type: 'text', defaultValue: 'Rs. 8.00', placeholder: 'Cost Per KM', className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white' }), React.createElement('input', { type: 'text', defaultValue: 'Rs. 2.50 / Km', placeholder: 'Travel Cost (Operational)', className: 'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white' })),
              React.createElement('button', { type: 'submit', className: 'px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold' }, 'Save Settings')
            )
          )
        );
      }

      // 13. Help & Support Chat Page
      if (route === '/help-chat') {
        return React.createElement(
          'div',
          { className: 'space-y-6 animate-fade-in max-w-5xl mx-auto text-xs' },
          React.createElement(
            'div',
            null,
            React.createElement('h1', { className: 'text-2xl font-extrabold text-white' }, 'Help & Corporate Mobility Support'),
            React.createElement('p', { className: 'text-slate-400 mt-1' }, '24/7 Carpooling guidelines, emergency SOS protocol, and mobility concierge')
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
            React.createElement(
              'div',
              { className: 'lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl space-y-4' },
              React.createElement(
                'div',
                { className: 'flex items-center gap-3 pb-3 border-b border-slate-800' },
                React.createElement('div', { className: 'w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold' }, React.createElement(Icon, { name: 'sparkles', className: 'w-4 h-4' })),
                React.createElement(
                  'div',
                  null,
                  React.createElement('h4', { className: 'font-bold text-white text-sm' }, 'Carpool AI Concierge'),
                  React.createElement('span', { className: 'text-[10px] text-emerald-400 font-semibold' }, '● Live Assistance Online')
                )
              ),
              React.createElement(
                'div',
                { className: 'space-y-2 bg-slate-950/60 p-3 rounded-2xl' },
                React.createElement('div', { className: 'p-3 rounded-xl bg-slate-800 text-slate-200' }, 'Hello Raj! How can I assist you with your SG Highway corridor carpools, fuel credits, or route matching today?'),
                React.createElement('div', { className: 'p-3 rounded-xl bg-blue-600 text-white ml-auto max-w-[80%]' }, 'What is the fuel subsidy rate for corporate drivers?'),
                React.createElement('div', { className: 'p-3 rounded-xl bg-slate-800 text-slate-200' }, 'Under Odoo Mobility Policy 2026, verified pooled rides earn ₹8.00/km in fuel tax credits with instant wallet settlement.')
              ),
              React.createElement(
                'div',
                { className: 'flex gap-2' },
                React.createElement('input', { type: 'text', placeholder: 'Ask about routes, pickup points, or cancellation policy...', className: 'flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white' }),
                React.createElement('button', { onClick: () => toast.show('Query Sent', 'Mobility concierge answered your request.'), className: 'px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold' }, 'Send')
              )
            ),
            React.createElement(
              'div',
              { className: 'lg:col-span-5 space-y-4' },
              React.createElement(
                'div',
                { className: 'p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-3' },
                React.createElement('h4', { className: 'font-bold text-white text-sm' }, 'Corporate Safety & Protocols'),
                React.createElement(
                  'ul',
                  { className: 'space-y-1.5 text-slate-400 list-disc list-inside' },
                  React.createElement('li', null, 'Always verify passenger corporate ID badge.'),
                  React.createElement('li', null, 'Zero toll fees via corporate FASTag.'),
                  React.createElement('li', null, '100% refund for cancellations >15m before trip.')
                )
              ),
              React.createElement(
                'div',
                { className: 'p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-2' },
                React.createElement('h4', { className: 'font-bold text-white text-sm' }, 'Mobility Desk Hotline'),
                React.createElement('p', { className: 'text-slate-300 font-mono' }, '📞 +91 79 4000 1234 (Ext 804)'),
                React.createElement('p', { className: 'text-cyan-400 font-mono' }, '✉️ mobility-support@odoo.com')
              )
            )
          )
        );
      }

      // Default fallback to Dashboard
      return React.createElement('div', { className: 'p-8 text-center text-slate-400' }, 'Page not found. Redirecting to Dashboard...');
    };

    return React.createElement(
      'div',
      { className: 'min-h-screen bg-slate-950 text-slate-100 flex flex-col' },
      renderHeader(),
      React.createElement(
        'div',
        { className: 'flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8' },
        isAdmin ? renderAdminSidebar() : renderSidebar(),
        React.createElement('main', { className: 'flex-1 min-w-0' }, renderPageContent())
      ),
      // --- Recharge Modal ---
      showRecharge &&
        React.createElement(
          'div',
          { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md text-xs' },
          React.createElement(
            'div',
            { className: 'w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4' },
            React.createElement('h3', { className: 'text-base font-bold text-white' }, 'Recharge Wallet'),
            React.createElement('input', { type: 'number', defaultValue: 500, className: 'w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-lg' }),
            React.createElement(
              'div',
              { className: 'flex justify-end gap-2' },
              React.createElement('button', { onClick: () => setShowRecharge(false), className: 'px-3 py-1.5 text-slate-400' }, 'Cancel'),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    const u = { ...currentUser, walletBalance: currentUser.walletBalance + 500 };
                    store.setCurrentUser(u);
                    setCurrentUser(u);
                    toast.show('Wallet Recharged!', '₹500 added successfully.');
                    setShowRecharge(false);
                  },
                  className: 'px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold',
                },
                'Add ₹500'
              )
            )
          )
        ),
      // --- Global Search Modal (Ctrl+K) ---
      showSearch &&
        React.createElement(
          'div',
          { className: 'fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md text-xs' },
          React.createElement(
            'div',
            { className: 'w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-2xl space-y-3' },
            React.createElement('input', {
              type: 'text',
              autoFocus: true,
              placeholder: 'Search employees, routes, vehicles...',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: 'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white',
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
                    className: 'p-2.5 rounded-xl hover:bg-slate-800 cursor-pointer flex justify-between',
                  },
                  React.createElement('span', { className: 'text-white font-bold' }, `${r.startLocation.split(',')[0]} → ${r.destinationLocation.split(',')[0]}`),
                  React.createElement('span', { className: 'text-emerald-400 font-mono' }, `₹${r.farePerSeat}`)
                )
              )
            ),
            React.createElement('button', { onClick: () => setShowSearch(false), className: 'w-full py-2 text-center text-slate-500' }, 'Close (Esc)')
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
