// CARPOOL Enterprise Mobility Platform - Complete Production Application Bundle
(function () {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

  // Global store & helper reference
  const CARPOOL = window.CARPOOL;
  const store = CARPOOL.store;

  // --- SVG Icons Helper ---
  function Icon({ name, className = 'w-4 h-4' }) {
    const iconSvgs = {
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
      arrowRight: React.createElement('path', { d: 'M5 12h14M12 5l7-7 7' }),
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
        className,
        fill: name === 'star' ? 'currentColor' : 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        viewBox: '0 0 24 24',
      },
      iconSvgs[name] || iconSvgs.car
    );
  }

  // --- Toast Manager Context ---
  const ToastContext = createContext(null);

  function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const show = (title, message, type = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    return React.createElement(
      ToastContext.Provider,
      { value: { show, success: (t, m) => show(t, m, 'success'), error: (t, m) => show(t, m, 'error'), info: (t, m) => show(t, m, 'info') } },
      children,
      React.createElement(
        'div',
        { className: 'fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none' },
        toasts.map((t) =>
          React.createElement(
            'div',
            {
              key: t.id,
              className: `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-up ${
                t.type === 'success'
                  ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100'
                  : t.type === 'error'
                  ? 'bg-rose-950/95 border-rose-500/40 text-rose-100'
                  : 'bg-slate-900/95 border-cyan-500/40 text-cyan-100'
              }`,
            },
            React.createElement(Icon, { name: t.type === 'success' ? 'check' : t.type === 'error' ? 'x' : 'sparkles', className: 'w-5 h-5 mt-0.5 shrink-0 text-cyan-400' }),
            React.createElement(
              'div',
              { className: 'flex-1 text-xs' },
              React.createElement('div', { className: 'font-bold text-white text-sm' }, t.title),
              t.message && React.createElement('div', { className: 'text-slate-300 mt-1' }, t.message)
            )
          )
        )
      )
    );
  }

  function useToast() {
    return useContext(ToastContext);
  }

  // --- Dynamic procedural QR Code SVG ---
  function DynamicQrCode({ value = 'raj@okaxis', fare = 120 }) {
    return React.createElement(
      'svg',
      { className: 'w-36 h-36 mx-auto rounded-2xl p-2 bg-white shadow-xl', viewBox: '0 0 100 100' },
      React.createElement('rect', { x: 5, y: 5, width: 26, height: 26, fill: '#0f172a', rx: 4 }),
      React.createElement('rect', { x: 9, y: 9, width: 18, height: 18, fill: '#ffffff', rx: 2 }),
      React.createElement('rect', { x: 13, y: 13, width: 10, height: 10, fill: '#0f172a', rx: 2 }),
      React.createElement('rect', { x: 69, y: 5, width: 26, height: 26, fill: '#0f172a', rx: 4 }),
      React.createElement('rect', { x: 73, y: 9, width: 18, height: 18, fill: '#ffffff', rx: 2 }),
      React.createElement('rect', { x: 77, y: 13, width: 10, height: 10, fill: '#0f172a', rx: 2 }),
      React.createElement('rect', { x: 5, y: 69, width: 26, height: 26, fill: '#0f172a', rx: 4 }),
      React.createElement('rect', { x: 9, y: 73, width: 18, height: 18, fill: '#ffffff', rx: 2 }),
      React.createElement('rect', { x: 13, y: 77, width: 10, height: 10, fill: '#0f172a', rx: 2 }),
      React.createElement('rect', { x: 36, y: 10, width: 8, height: 8, fill: '#0f172a' }),
      React.createElement('rect', { x: 48, y: 10, width: 14, height: 6, fill: '#0f172a' }),
      React.createElement('rect', { x: 36, y: 24, width: 26, height: 6, fill: '#0f172a' }),
      React.createElement('rect', { x: 10, y: 36, width: 18, height: 8, fill: '#0f172a' }),
      React.createElement('rect', { x: 34, y: 36, width: 12, height: 12, fill: '#2563eb' }),
      React.createElement('rect', { x: 50, y: 36, width: 16, height: 8, fill: '#0f172a' }),
      React.createElement('rect', { x: 70, y: 36, width: 20, height: 14, fill: '#0f172a' }),
      React.createElement('rect', { x: 10, y: 48, width: 12, height: 16, fill: '#0f172a' }),
      React.createElement('rect', { x: 26, y: 54, width: 8, height: 10, fill: '#0f172a' }),
      React.createElement('rect', { x: 38, y: 54, width: 28, height: 8, fill: '#0f172a' }),
      React.createElement('rect', { x: 70, y: 54, width: 24, height: 12, fill: '#0f172a' }),
      React.createElement('rect', { x: 36, y: 68, width: 10, height: 24, fill: '#0f172a' }),
      React.createElement('rect', { x: 50, y: 68, width: 20, height: 8, fill: '#0f172a' }),
      React.createElement('rect', { x: 74, y: 72, width: 20, height: 20, fill: '#0f172a' }),
      React.createElement('rect', { x: 50, y: 80, width: 16, height: 12, fill: '#0f172a' })
    );
  }

  // Kolkata Geocoding Engine for exact coordinates & custom input locations
  function getKolkataCoords(locationName, fallbackCoords) {
    if (!locationName || typeof locationName !== 'string') return fallbackCoords;
    const str = locationName.toLowerCase().trim();
    
    if (str.includes('ballygunge')) return [22.5280, 88.3650];
    if (str.includes('bally')) return [22.6500, 88.3400];
    if (str.includes('dankuni')) return [22.6842, 88.2917];
    if (str.includes('howrah')) return [22.5892, 88.3431];
    if (str.includes('park street') || str.includes('park st')) return [22.5510, 88.3524];
    if (str.includes('sector v') || str.includes('salt lake') || str.includes('tech hub')) return [22.5804, 88.4378];
    if (str.includes('new town') || str.includes('eco space') || str.includes('action area')) return [22.5851, 88.4807];
    if (str.includes('rajarhat')) return [22.6200, 88.5100];
    if (str.includes('gariahat')) return [22.5186, 88.3653];
    if (str.includes('shyambazar')) return [22.6030, 88.3713];
    if (str.includes('science city')) return [22.5448, 88.3920];
    if (str.includes('chingrighata') || str.includes('em bypass')) return [22.5690, 88.4050];
    if (str.includes('dum dum') || str.includes('dumdum')) return [22.6450, 88.4300];
    if (str.includes('airport') || str.includes('ccu')) return [22.6547, 88.4467];
    if (str.includes('behala')) return [22.4988, 88.3186];
    if (str.includes('alipore')) return [22.5312, 88.3275];
    if (str.includes('sealdah')) return [22.5670, 88.3711];
    if (str.includes('esplanade')) return [22.5645, 88.3517];
    if (str.includes('jadavpur')) return [22.4955, 88.3709];
    if (str.includes('tollygunge')) return [22.5009, 88.3444];
    if (str.includes('barasat')) return [22.7230, 88.4820];
    if (str.includes('barrackpore')) return [22.7600, 88.3700];
    if (str.includes('ultadanga')) return [22.5970, 88.3920];
    if (str.includes('ruby')) return [22.5130, 88.3990];
    if (str.includes('kasba')) return [22.5150, 88.3850];
    if (str.includes('kalighat')) return [22.5200, 88.3450];
    if (str.includes('khidirpur')) return [22.5350, 88.3250];
    if (str.includes('dakshineswar')) return [22.6550, 88.3570];
    if (str.includes('kankurgachi')) return [22.5780, 88.3880];
    if (str.includes('panihati')) return [22.6950, 88.3750];

    // Deterministic offset within Kolkata metropolitan bounding box
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
    const latOffset = ((Math.abs(hash) % 1000) / 1000) * 0.12 - 0.06;
    const lngOffset = ((Math.abs(hash >> 3) % 1000) / 1000) * 0.12 - 0.06;
    return [22.5650 + latOffset, 88.3800 + lngOffset];
  }

  // --- Leaflet OpenStreetMap View for Kolkata & West Bengal Transit Corridors ---
  function MapView({ startName = 'Park Street, Kolkata', destName = 'Sector V, Salt Lake, Kolkata', height = '380px', showSimulation = false }) {
    const containerRef = useRef(null);

    useEffect(() => {
      if (!containerRef.current || !window.L) return;

      const L = window.L;
      const isLight = document.documentElement.classList.contains('light');

      // Exact geocoded coordinates for start and destination
      const startCoords = getKolkataCoords(startName, [22.5510, 88.3524]);
      const destCoords = getKolkataCoords(destName, [22.5804, 88.4378]);

      // Initialize map centered between start and dest
      const centerLat = (startCoords[0] + destCoords[0]) / 2;
      const centerLng = (startCoords[1] + destCoords[1]) / 2;
      const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView([centerLat, centerLng], 12);

      // Select map tile provider based on theme
      const tileUrl = isLight
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Calculate realistic waypoints connecting the exact start and dest coordinates
      const mid1 = [
        (startCoords[0] * 2 + destCoords[0]) / 3 + 0.004,
        (startCoords[1] * 2 + destCoords[1]) / 3 + 0.006,
      ];
      const mid2 = [
        (startCoords[0] + destCoords[0] * 2) / 3 - 0.003,
        (startCoords[1] + destCoords[1] * 2) / 3 + 0.004,
      ];
      const waypoints = [startCoords, mid1, mid2, destCoords];

      const polylineColor = isLight ? '#ca8a04' : '#38bdf8';
      L.polyline(waypoints, { color: polylineColor, weight: 5, opacity: 0.95, lineCap: 'round' }).addTo(map);

      // Start Marker (Green with label)
      const startBorderColor = isLight ? '#09090b' : '#0f172a';
      const startHtml = `<div style="background:#10b981;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid ${startBorderColor};box-shadow:0 4px 10px rgba(0,0,0,0.4);color:#fff;font-size:11px;font-weight:bold;">A</div>`;
      L.marker(startCoords, {
        icon: L.divIcon({ className: 'spin', html: startHtml, iconSize: [24, 24], iconAnchor: [12, 12] }),
      }).addTo(map).bindPopup(`<b>Start: ${startName}</b>`).openPopup();

      // Destination Marker (Red with label)
      const destHtml = `<div style="background:#e11d48;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid ${startBorderColor};box-shadow:0 4px 10px rgba(0,0,0,0.4);color:#fff;font-size:11px;font-weight:bold;">B</div>`;
      L.marker(destCoords, {
        icon: L.divIcon({ className: 'dpin', html: destHtml, iconSize: [24, 24], iconAnchor: [12, 12] }),
      }).addTo(map).bindPopup(`<b>Destination: ${destName}</b>`);

      if (showSimulation) {
        const carHtml = `<div style="background:${isLight ? '#eab308' : '#2563eb'};color:${isLight ? '#000' : '#fff'};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid ${isLight ? '#000' : '#fff'};box-shadow:0 0 15px rgba(234,179,8,0.7);font-size:14px;font-weight:bold;">🚗</div>`;
        const carMarker = L.marker(mid1, {
          icon: L.divIcon({ className: 'cpin', html: carHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
        }).addTo(map);
        carMarker.bindPopup(`<b>Live Fleet: Swift Dzire (WB02AB1234) — En Route</b>`);
      }

      // Automatically fit bounds to exact locations
      map.fitBounds(L.polyline([startCoords, destCoords]).getBounds().pad(0.35));

      return () => map.remove();
    }, [startName, destName, showSimulation]);

    const isLightContainer = document.documentElement.classList.contains('light');
    return React.createElement('div', {
      ref: containerRef,
      className: isLightContainer ? 'w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl relative z-0' : 'w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative z-0',
      style: { height },
    });
  }

  // --- SVG Charts with Theme Adaptive Palette ---
  function FuelTrendSvg() {
    const isLight = document.documentElement.classList.contains('light');
    const pts = [
      { m: 'Jan', v: 14.5, y: 170 },
      { m: 'Feb', v: 15.2, y: 150 },
      { m: 'Mar', v: 16.1, y: 130 },
      { m: 'Apr', v: 15.8, y: 140 },
      { m: 'May', v: 17.2, y: 100 },
      { m: 'Jun', v: 17.8, y: 80 },
      { m: 'Jul', v: 18.4, y: 60 },
    ];
    const polylineStr = pts.map((p, i) => `${40 + i * 65},${p.y}`).join(' ');

    const gridStroke = isLight ? '#e4e4e7' : '#1e293b';
    const textFill = isLight ? '#71717a' : '#94a3b8';
    const curveStroke = isLight ? '#eab308' : '#06b6d4';
    const dotFill = isLight ? '#ca8a04' : '#06b6d4';

    return React.createElement(
      'svg',
      { viewBox: '0 0 480 210', className: 'w-full h-full' },
      [40, 80, 120, 160].map((gy, idx) =>
        React.createElement('line', {
          key: idx,
          x1: 30,
          y1: gy,
          x2: 450,
          y2: gy,
          stroke: gridStroke,
          strokeDasharray: '3 3',
        })
      ),
      React.createElement('line', {
        x1: 30,
        y1: 130,
        x2: 450,
        y2: 130,
        stroke: isLight ? '#a1a1aa' : '#64748b',
        strokeDasharray: '5 5',
        strokeWidth: 1.5,
      }),
      React.createElement(
        'text',
        { x: 370, y: 124, fill: textFill, fontSize: 10, fontFamily: 'monospace' },
        'Target 16 km/L'
      ),
      React.createElement('polyline', {
        fill: 'none',
        stroke: curveStroke,
        strokeWidth: 3,
        points: polylineStr,
      }),
      pts.map((p, i) =>
        React.createElement(
          'g',
          { key: i },
          React.createElement('circle', {
            cx: 40 + i * 65,
            cy: p.y,
            r: 5,
            fill: dotFill,
            stroke: isLight ? '#ffffff' : '#0f172a',
            strokeWidth: 2,
          }),
          React.createElement(
            'text',
            {
              x: 40 + i * 65,
              y: p.y - 10,
              fill: isLight ? '#09090b' : '#ffffff',
              fontSize: 10,
              textAnchor: 'middle',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            },
            `${p.v}`
          ),
          React.createElement(
            'text',
            { x: 40 + i * 65, y: 200, fill: textFill, fontSize: 11, textAnchor: 'middle' },
            p.m
          )
        )
      )
    );
  }

  function CostliestVehiclesSvg() {
    const isLight = document.documentElement.classList.contains('light');
    const bars = [
      { name: 'Innova (WB20CD778)', cost: '₹9.4k', w: 210, color: isLight ? '#e11d48' : '#f43f5e' },
      { name: 'Swift (WB02AB1234)', cost: '₹6.2k', w: 150, color: isLight ? '#eab308' : '#fb923c' },
      { name: 'City (WB02CD7788)', cost: '₹5.9k', w: 140, color: isLight ? '#facc15' : '#facc15' },
      { name: 'Alto (WB06AB5034)', cost: '₹4.1k', w: 100, color: isLight ? '#71717a' : '#38bdf8' },
      { name: 'Nexon EV (WB06EV)', cost: '₹1.8k', w: 50, color: isLight ? '#16a34a' : '#4ade80' },
    ];

    const labelFill = isLight ? '#27272a' : '#cbd5e1';

    return React.createElement(
      'svg',
      { viewBox: '0 0 460 210', className: 'w-full h-full' },
      bars.map((b, i) =>
        React.createElement(
          'g',
          { key: i, transform: `translate(0, ${22 + i * 36})` },
          React.createElement(
            'text',
            { x: 10, y: 14, fill: labelFill, fontSize: 11, fontWeight: '600' },
            b.name
          ),
          React.createElement('rect', {
            x: 170,
            y: 3,
            width: b.w,
            height: 16,
            rx: 6,
            fill: b.color,
          }),
          React.createElement(
            'text',
            {
              x: 180 + b.w,
              y: 15,
              fill: isLight ? '#09090b' : '#ffffff',
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 'bold',
            },
            b.cost
          )
        )
      )
    );
  }

  console.log('CARPOOL Core bundle initialized for Kolkata & West Bengal Transit');
  window.CARPOOL_COMPONENTS = {
    MapView,
    FuelTrendSvg,
    CostliestVehiclesSvg,
    Icon,
    DynamicQrCode,
    ToastProvider,
    useToast,
  };
})();

