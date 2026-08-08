// CARPOOL Enterprise Mobility Platform - Master Application
// Full Interactive Admin Employee & Vehicle Management, Dynamic Kolkata Geolocation & Dual Theme
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
      return localStorage.getItem('carpool_theme') || 'dark';
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

    const toast = useToast();

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
      showRecharge &&
        React.createElement(
          'div',
          { className: `fixed inset-0 z-[99999] flex items-center justify-center p-4 ${isLight ? 'bg-slate-900/60' : 'bg-slate-950/85'} backdrop-blur-md text-xs animate-fade-in` },
          React.createElement(
            'div',
            { className: `relative z-[100000] w-full max-w-md rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-slate-900 border-slate-800 shadow-2xl text-white'} p-6 space-y-4` },
            React.createElement('h3', { className: `text-base font-bold ${isLight ? 'text-black' : 'text-white'}` }, 'Recharge Corporate Wallet'),
            React.createElement('input', { type: 'number', defaultValue: 500, className: `w-full ${isLight ? 'bg-slate-50 border-slate-300 text-black' : 'bg-slate-950 border-slate-800 text-white'} border rounded-xl p-3 font-mono text-lg font-bold` }),
            React.createElement(
              'div',
              { className: 'flex justify-end gap-2' },
              React.createElement('button', { onClick: () => setShowRecharge(false), className: `px-3 py-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, 'Cancel'),
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
                  className: `px-5 py-2.5 rounded-xl ${isLight ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold border border-yellow-500' : 'bg-emerald-600 text-white font-bold'}`,
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
