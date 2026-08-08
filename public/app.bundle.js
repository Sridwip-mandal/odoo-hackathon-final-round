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

  // --- Leaflet OpenStreetMap View ---
  function MapView({ startName = 'ISKCON Cross Road', destName = 'Infocity', height = '380px', showSimulation = false }) {
    const containerRef = useRef(null);

    useEffect(() => {
      if (!containerRef.current || !window.L) return;

      const L = window.L;
      const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView([23.0276, 72.5074], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const waypoints = [
        [23.0276, 72.5074], // ISKCON
        [23.0600, 72.5250], // SG Highway
        [23.1100, 72.5600], // Vaishnodevi Circle
        [23.1600, 72.6000], // Koba Circle
        [23.1970, 72.6322], // Infocity
      ];

      L.polyline(waypoints, { color: '#3b82f6', weight: 5, opacity: 0.9 }).addTo(map);

      const startHtml = `<div style="background:#10b981;width:22px;height:22px;border-radius:50%;border:3px solid #0f172a;box-shadow:0 4px 10px rgba(0,0,0,0.5);"></div>`;
      L.marker([23.0276, 72.5074], {
        icon: L.divIcon({ className: 'spin', html: startHtml, iconSize: [22, 22], iconAnchor: [11, 11] }),
      }).addTo(map).bindPopup(`<b style="color:#0f172a;">${startName}</b>`);

      const destHtml = `<div style="background:#ef4444;width:22px;height:22px;border-radius:50%;border:3px solid #0f172a;box-shadow:0 4px 10px rgba(0,0,0,0.5);"></div>`;
      L.marker([23.1970, 72.6322], {
        icon: L.divIcon({ className: 'dpin', html: destHtml, iconSize: [22, 22], iconAnchor: [11, 11] }),
      }).addTo(map).bindPopup(`<b style="color:#0f172a;">${destName}</b>`);

      if (showSimulation) {
        const carHtml = `<div style="background:#2563eb;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 0 15px #3b82f6;">🚗</div>`;
        const carMarker = L.marker([23.1100, 72.5600], {
          icon: L.divIcon({ className: 'cpin', html: carHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
        }).addTo(map);
        carMarker.bindPopup(`<b style="color:#0f172a;">Live Fleet: Swift Dzire (GJ01AB1234)</b>`);
      }

      map.fitBounds(L.polyline(waypoints).getBounds().pad(0.2));

      return () => map.remove();
    }, [startName, destName, showSimulation]);

    return React.createElement('div', {
      ref: containerRef,
      className: 'w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative',
      style: { height },
    });
  }

  // --- SVG Charts ---
  function FuelTrendSvg() {
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
          stroke: '#1e293b',
          strokeDasharray: '3 3',
        })
      ),
      React.createElement('line', {
        x1: 30,
        y1: 130,
        x2: 450,
        y2: 130,
        stroke: '#64748b',
        strokeDasharray: '5 5',
        strokeWidth: 1.5,
      }),
      React.createElement(
        'text',
        { x: 370, y: 124, fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        'Target 16 km/L'
      ),
      React.createElement('polyline', {
        fill: 'none',
        stroke: '#06b6d4',
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
            fill: '#06b6d4',
            stroke: '#0f172a',
            strokeWidth: 2,
          }),
          React.createElement(
            'text',
            {
              x: 40 + i * 65,
              y: p.y - 10,
              fill: '#ffffff',
              fontSize: 10,
              textAnchor: 'middle',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            },
            `${p.v}`
          ),
          React.createElement(
            'text',
            { x: 40 + i * 65, y: 200, fill: '#64748b', fontSize: 11, textAnchor: 'middle' },
            p.m
          )
        )
      )
    );
  }

  function CostliestVehiclesSvg() {
    const bars = [
      { name: 'Innova (GJ01CD778)', cost: '₹9.4k', w: 210, color: '#f43f5e' },
      { name: 'Swift (GJ01AB1234)', cost: '₹6.2k', w: 150, color: '#fb923c' },
      { name: 'City (GJ01CD7788)', cost: '₹5.9k', w: 140, color: '#facc15' },
      { name: 'Alto (GJ01AB5034)', cost: '₹4.1k', w: 100, color: '#38bdf8' },
      { name: 'Nexon EV (GJ01EV)', cost: '₹1.8k', w: 50, color: '#4ade80' },
    ];

    return React.createElement(
      'svg',
      { viewBox: '0 0 460 210', className: 'w-full h-full' },
      bars.map((b, i) =>
        React.createElement(
          'g',
          { key: i, transform: `translate(0, ${22 + i * 36})` },
          React.createElement(
            'text',
            { x: 10, y: 14, fill: '#cbd5e1', fontSize: 11, fontWeight: '500' },
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
              fill: '#ffffff',
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

  console.log('CARPOOL Core bundle initialized');
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
