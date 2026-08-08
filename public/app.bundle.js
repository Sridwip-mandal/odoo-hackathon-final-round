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

  // --- Kolkata Road-Following Router & Real-Time Traffic Engine ---
  function getKolkataRoadPath(startC, destC, startName, destName) {
    const qStart = String(startName || '').toLowerCase();
    const qDest = String(destName || '').toLowerCase();

    // 1. Park Street / Central to Sector V / Salt Lake Corridor (via Maa Flyover, EM Bypass, Chingrighata)
    if ((qStart.includes('park') || qStart.includes('central') || qStart.includes('esplanade')) &&
        (qDest.includes('sector') || qDest.includes('salt') || qDest.includes('town') || qDest.includes('eco'))) {
      return [
        [22.5510, 88.3524], // Park Street Origin
        [22.5480, 88.3610], // Mullick Bazar
        [22.5435, 88.3680], // Park Circus 7-Point
        [22.5420, 88.3750], // Maa Flyover Entry Ramp
        [22.5430, 88.3840], // Maa Flyover Mid-Span (45 km/h)
        [22.5448, 88.3920], // Science City / EM Bypass
        [22.5550, 88.3960], // EM Bypass - Metropolitan
        [22.5640, 88.4010], // EM Bypass - Beleghata Crossing
        [22.5690, 88.4050], // Chingrighata Flyover Junction (Traffic Hotspot)
        [22.5710, 88.4140], // Salt Lake Bypass / Jal Vayu Vihar
        [22.5735, 88.4230], // Nicco Park / Broadway Ring
        [22.5770, 88.4310], // Webel Bhavan / Sector V Entry
        [22.5804, 88.4378], // Sector V Tech Hub Destination
      ];
    }

    // 2. Bally / Howrah North to Sector V Corridor (via Belgharia Expressway, VIP Road, Major Arterial Road)
    if ((qStart.includes('bally') || qStart.includes('dankuni') || qStart.includes('howrah')) &&
        (qDest.includes('sector') || qDest.includes('salt') || qDest.includes('town') || qDest.includes('eco'))) {
      return [
        startC, // [22.6500, 88.3400] Bally
        [22.6480, 88.3550], // Vivekananda Setu (Nivedita Setu)
        [22.6450, 88.3700], // BT Road Crossing / Belgharia Expressway
        [22.6460, 88.3950], // Belgharia Expressway Mid-Span (60 km/h)
        [22.6420, 88.4312], // Airport 1 No Gate / VIP Road Junction
        [22.6300, 88.4480], // Chinar Park / Rajarhat Road
        [22.6100, 88.4550], // City Centre 2 New Town
        [22.5950, 88.4680], // Major Arterial Road New Town
        [22.5851, 88.4807], // Eco Space New Town
        [22.5820, 88.4550], // New Town to Salt Lake Connecting Bridge
        destC,  // [22.5804, 88.4378] Sector V
      ];
    }

    // 3. South Kolkata (Gariahat / Ruby / Behala / Jadavpur) to Sector V Corridor (via EM Bypass)
    if (qStart.includes('garia') || qStart.includes('ruby') || qStart.includes('behala') || qStart.includes('jadavpur') || qStart.includes('tolly')) {
      return [
        startC,
        [22.5130, 88.4020], // Ruby Hospital / Kasba Connector
        [22.5280, 88.3990], // VIP Bazar / EM Bypass
        [22.5448, 88.3920], // Science City
        [22.5580, 88.3985], // EM Bypass Silver Spring
        [22.5690, 88.4050], // Chingrighata Flyover
        [22.5735, 88.4230], // Nicco Park
        destC,
      ];
    }

    // 4. Procedural Road Path with realistic street spline bends connecting startC -> destC
    const deltaLat = destC[0] - startC[0];
    const deltaLng = destC[1] - startC[1];
    const count = 12;
    const path = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const bend = Math.sin(t * Math.PI) * 0.008;
      const microBend = Math.sin(t * 3 * Math.PI) * 0.003;
      const lat = startC[0] + deltaLat * t + bend;
      const lng = startC[1] + deltaLng * t + microBend;
      path.push([lat, lng]);
    }
    return path;
  }

  // --- High-Resolution Satellite & Live Traffic Map for Kolkata Transit ---
  function MapView({ startName = 'Park Street, Kolkata', destName = 'Sector V, Salt Lake, Kolkata', height = '420px', showSimulation = false }) {
    const containerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [mapType, setMapType] = useState('satellite'); // 'satellite' | 'traffic' | 'streets'

    useEffect(() => {
      if (!containerRef.current || !window.L) return;

      const L = window.L;
      const isLight = document.documentElement.classList.contains('light');

      // Resolve exact coordinates dynamically
      const startC = getKolkataCoords(startName, [22.5510, 88.3524]);
      const destC = getKolkataCoords(destName, [22.5804, 88.4378]);

      // Remove existing instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false }).setView(startC, 13);
      mapInstanceRef.current = map;

      // Select Base Tile Layer based on chosen Map Type with ultra-reliable Google Satellite & OSM CDNs
      if (mapType === 'satellite') {
        // Google Satellite Hybrid (High-Resolution Satellite + Crisp Road Vectors + Labels)
        L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }).addTo(map);
      } else if (mapType === 'traffic' || !isLight) {
        // Dark Navigation Map with Illuminated Traffic Corridors
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);
      } else {
        // OpenStreetMap Standard / Carto Voyager
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
      }

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Generate road-following path precisely along Kolkata arterial roads
      const roadWaypoints = getKolkataRoadPath(startC, destC, startName, destName);

      // 1. Dark Road Edge Casing Polyline (Ensures 100% visibility on both dark & light backgrounds)
      L.polyline(roadWaypoints, {
        color: '#09090b',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // 2. Multi-Color Live Traffic Flow Segments
      const totalPts = roadWaypoints.length;
      const seg1End = Math.max(1, Math.floor(totalPts * 0.35));
      const seg2End = Math.max(seg1End + 1, Math.floor(totalPts * 0.75));

      const seg1 = roadWaypoints.slice(0, seg1End + 1);
      const seg2 = roadWaypoints.slice(seg1End, seg2End + 1);
      const seg3 = roadWaypoints.slice(seg2End);

      // Segment 1: 🟢 Free Flow Traffic (48 km/h) - Emerald Green Glow
      L.polyline(seg1, {
        color: '#10b981',
        weight: 6,
        opacity: 1,
        lineCap: 'round',
      }).addTo(map).bindPopup('<b>🟢 Free Flowing Traffic</b><br>Speed: 48 km/h • Smooth Commute');

      // Segment 2: 🟡 Moderate Traffic (28 km/h) - Golden Amber Glow
      L.polyline(seg2, {
        color: '#f59e0b',
        weight: 6,
        opacity: 1,
        lineCap: 'round',
      }).addTo(map).bindPopup('<b>🟡 Moderate Commute Corridor</b><br>Speed: 28 km/h • EM Bypass Flow');

      // Segment 3: 🔴 Congested Peak Segment (14 km/h) - Crimson Red Glow
      if (seg3.length > 1) {
        L.polyline(seg3, {
          color: '#ef4444',
          weight: 6,
          opacity: 1,
          lineCap: 'round',
        }).addTo(map).bindPopup('<b>🔴 Bottleneck Junction / Flyover</b><br>Speed: 14 km/h • Peak Rush');
      }

      // Origin Marker Pin A with High-Contrast Badge
      const startHtml = `<div style="background:#10b981;width:28px;height:28px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 4px 14px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:900;letter-spacing:-0.5px;">A</div>`;
      L.marker(startC, {
        icon: L.divIcon({ className: 'spin', html: startHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
      }).addTo(map).bindPopup(`<b>🟢 Origin (Pickup)</b><br>${startName}`).openPopup();

      // Destination Marker Pin B with High-Contrast Badge
      const destHtml = `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 4px 14px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:900;letter-spacing:-0.5px;">B</div>`;
      L.marker(destC, {
        icon: L.divIcon({ className: 'dpin', html: destHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
      }).addTo(map).bindPopup(`<b>🔴 Destination (Dropoff)</b><br>${destName}`);

      // Real-Time Vehicle Marker Animation along the road path
      if (showSimulation) {
        const midIdx = Math.floor(totalPts / 2);
        const midPos = roadWaypoints[midIdx] || startC;
        const carHtml = `<div style="background:#eab308;color:#000;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #ffffff;box-shadow:0 0 18px rgba(234,179,8,0.9);font-size:16px;font-weight:bold;">🚗</div>`;
        const carMarker = L.marker(midPos, {
          icon: L.divIcon({ className: 'cpin', html: carHtml, iconSize: [34, 34], iconAnchor: [17, 17] }),
        }).addTo(map);
        carMarker.bindPopup(`<b>🚗 Live Fleet Vehicle</b><br>Swift Dzire (WB02AB1234)<br>Speed: 34 km/h • On Road`);
      }

      // Smoothly fit bounds along entire road corridor
      map.fitBounds(L.polyline(roadWaypoints).getBounds().pad(0.25));

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [startName, destName, showSimulation, mapType]);

    const isLightContainer = document.documentElement.classList.contains('light');

    return React.createElement(
      'div',
      {
        className: isLightContainer
          ? 'w-full rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xl relative'
          : 'w-full rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative',
        style: { height },
      },
      // Floating Map Type Switcher Controls
      React.createElement(
        'div',
        { className: 'absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md' },
        React.createElement(
          'button',
          {
            onClick: () => setMapType('satellite'),
            className: `px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
              mapType === 'satellite' ? 'bg-yellow-400 text-black shadow-md border border-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`,
          },
          '🛰️ Satellite (Hybrid)'
        ),
        React.createElement(
          'button',
          {
            onClick: () => setMapType('traffic'),
            className: `px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
              mapType === 'traffic' ? 'bg-yellow-400 text-black shadow-md border border-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`,
          },
          '🚦 Live Traffic'
        ),
        React.createElement(
          'button',
          {
            onClick: () => setMapType('streets'),
            className: `px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
              mapType === 'streets' ? 'bg-yellow-400 text-black shadow-md border border-yellow-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`,
          },
          '🗺️ Street Map'
        )
      ),
      // Floating Real-Time Traffic HUD Overlay
      React.createElement(
        'div',
        { className: 'absolute bottom-3 left-3 z-[1000] p-2.5 sm:p-3 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md text-[10px] sm:text-xs text-white' },
        React.createElement(
          'div',
          { className: 'flex flex-wrap items-center gap-2' },
          React.createElement('span', { className: 'font-bold text-yellow-400 flex items-center gap-1' }, '🚦 Live Traffic:'),
          React.createElement('span', { className: 'text-emerald-400 font-bold' }, '🟢 Fast (48 km/h)'),
          React.createElement('span', { className: 'text-slate-500' }, '•'),
          React.createElement('span', { className: 'text-amber-400 font-bold' }, '🟡 Moderate (28 km/h)'),
          React.createElement('span', { className: 'text-slate-500' }, '•'),
          React.createElement('span', { className: 'text-rose-400 font-bold' }, '🔴 Slow (14 km/h)'),
          React.createElement('span', { className: 'px-2 py-0.5 rounded-lg bg-blue-950/90 border border-blue-500/40 text-cyan-300 font-mono font-bold ml-1' }, 'ETA: 19 Mins')
        )
      ),
      // Map DOM Mount Point
      React.createElement('div', { ref: containerRef, className: 'w-full h-full' })
    );
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

