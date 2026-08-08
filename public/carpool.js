// CARPOOL Master Interactive Single Page Application Logic
(function () {
  'use strict';

  const React = window.React;
  const ReactDOM = window.ReactDOM;
  const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

  // --- SVG Icons Definition ---
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
      iconSvgs[name] || iconSvgs.car
    );
  }

  const KOLKATA_LOCATIONS = {
    'bally': [22.6500, 88.3400],
    'ballygunge': [22.5280, 88.3650],
    'park street': [22.5510, 88.3524],
    'sector v': [22.5804, 88.4378],
    'salt lake': [22.5804, 88.4378],
    'new town': [22.5851, 88.4807],
    'eco space': [22.5851, 88.4807],
    'howrah': [22.5830, 88.3426],
    'gariahat': [22.5186, 88.3653],
    'shyambazar': [22.6030, 88.3713],
    'dum dum': [22.6420, 88.4312],
    'behala': [22.4988, 88.3190],
    'alipore': [22.5320, 88.3300],
    'esplanade': [22.5645, 88.3520],
    'science city': [22.5448, 88.3920],
    'em bypass': [22.5448, 88.3920],
    'chingrighata': [22.5690, 88.4050],
    'ultadanga': [22.5950, 88.3850],
    'rajarhat': [22.6200, 88.4600],
    'dankuni': [22.6800, 88.3000],
    'jadavpur': [22.4990, 88.3710],
    'tollygunge': [22.4940, 88.3450],
    'airport': [22.6547, 88.4467],
    'cc2': [22.6180, 88.4550],
    'ruby': [22.5130, 88.4020],
  };

  function getKolkataCoords(locName, fallback) {
    if (!locName) return fallback;
    const q = String(locName).toLowerCase().trim();
    for (const key of Object.keys(KOLKATA_LOCATIONS)) {
      if (q.includes(key)) {
        return KOLKATA_LOCATIONS[key];
      }
    }
    let hash = 0;
    for (let i = 0; i < q.length; i++) {
      hash = (hash << 5) - hash + q.charCodeAt(i);
      hash |= 0;
    }
    const latOffset = ((Math.abs(hash) % 80) - 40) / 1000;
    const lngOffset = (((Math.abs(hash) >> 2) % 80) - 40) / 1000;
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
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [mapType, setMapType] = useState('satellite');

    useEffect(() => {
      if (!mapRef.current || !window.L) return;

      const L = window.L;
      const isLight = document.documentElement.classList.contains('light');

      const startC = getKolkataCoords(startName, [22.5510, 88.3524]);
      const destC = getKolkataCoords(destName, [22.5804, 88.4378]);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(startC, 13);
      mapInstanceRef.current = map;

      // Select Base Tile Layer based on chosen Map Type
      if (mapType === 'satellite') {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
        }).addTo(map);

        L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          opacity: 0.85,
        }).addTo(map);

        L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          opacity: 0.9,
        }).addTo(map);
      } else if (mapType === 'traffic' || !isLight) {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(map);
      } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(map);
      }

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const roadWaypoints = getKolkataRoadPath(startC, destC, startName, destName);

      // Dark Road Edge Casing
      L.polyline(roadWaypoints, {
        color: '#09090b',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Multi-Color Live Traffic Flow Segments
      const totalPts = roadWaypoints.length;
      const seg1End = Math.max(1, Math.floor(totalPts * 0.35));
      const seg2End = Math.max(seg1End + 1, Math.floor(totalPts * 0.75));

      const seg1 = roadWaypoints.slice(0, seg1End + 1);
      const seg2 = roadWaypoints.slice(seg1End, seg2End + 1);
      const seg3 = roadWaypoints.slice(seg2End);

      L.polyline(seg1, { color: '#10b981', weight: 6, opacity: 1, lineCap: 'round' }).addTo(map);
      L.polyline(seg2, { color: '#f59e0b', weight: 6, opacity: 1, lineCap: 'round' }).addTo(map);
      if (seg3.length > 1) {
        L.polyline(seg3, { color: '#ef4444', weight: 6, opacity: 1, lineCap: 'round' }).addTo(map);
      }

      // Start Marker
      const startHtml = `<div style="background:#10b981;width:28px;height:28px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 4px 14px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:900;">A</div>`;
      L.marker(startC, {
        icon: L.divIcon({ className: 's-pin', html: startHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
      }).addTo(map).bindPopup(`<b>🟢 Origin (Pickup)</b><br>${startName}`).openPopup();

      // Destination Marker
      const destHtml = `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 4px 14px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:900;">B</div>`;
      L.marker(destC, {
        icon: L.divIcon({ className: 'd-pin', html: destHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
      }).addTo(map).bindPopup(`<b>🔴 Destination (Dropoff)</b><br>${destName}`);

      // Vehicle Marker if in live tracking
      if (showSimulation) {
        const midIdx = Math.floor(totalPts / 2);
        const midPos = roadWaypoints[midIdx] || startC;
        const carHtml = `<div style="background:#eab308;color:#000;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #ffffff;box-shadow:0 0 18px rgba(234,179,8,0.9);font-size:16px;font-weight:bold;">🚗</div>`;
        const carMarker = L.marker(midPos, {
          icon: L.divIcon({ className: 'c-pin', html: carHtml, iconSize: [34, 34], iconAnchor: [17, 17] }),
        }).addTo(map);
        carMarker.bindPopup(`<b>🚗 Live Vehicle: Swift Dzire (WB02AB1234)</b><br>Speed: 34 km/h • On Road`);
      }

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
      // Floating Map Type Switcher
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
      // Floating Traffic HUD
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
      React.createElement('div', { ref: mapRef, className: 'w-full h-full' })
    );
  }

    const isLightContainer = document.documentElement.classList.contains('light');
    return React.createElement('div', {
      ref: mapRef,
      className: isLightContainer ? 'w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl relative' : 'w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative',
      style: { height },
    });
  }

  // --- SVG Charts ---
  function FuelTrendSvg() {
    const pts = [
      { m: 'Jan', v: 14.5, y: 180 },
      { m: 'Feb', v: 15.2, y: 160 },
      { m: 'Mar', v: 16.1, y: 135 },
      { m: 'Apr', v: 15.8, y: 145 },
      { m: 'May', v: 17.2, y: 105 },
      { m: 'Jun', v: 17.8, y: 85 },
      { m: 'Jul', v: 18.4, y: 65 },
    ];

    const polylineStr = pts.map((p, i) => `${40 + i * 65},${p.y}`).join(' ');

    return React.createElement(
      'svg',
      { viewBox: '0 0 480 220', className: 'w-full h-full' },
      // Grid lines
      [50, 100, 150, 190].map((gy, idx) =>
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
      // Target line (16 km/L)
      React.createElement('line', {
        x1: 30,
        y1: 135,
        x2: 450,
        y2: 135,
        stroke: '#64748b',
        strokeDasharray: '5 5',
        strokeWidth: 1.5,
      }),
      React.createElement(
        'text',
        { x: 380, y: 128, fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
        'Target 16.0 km/L'
      ),
      // Actual line
      React.createElement('polyline', {
        fill: 'none',
        stroke: '#06b6d4',
        strokeWidth: 3,
        points: polylineStr,
      }),
      // Dots & Labels
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
            { x: 40 + i * 65, y: 210, fill: '#64748b', fontSize: 11, textAnchor: 'middle' },
            p.m
          )
        )
      )
    );
  }

  function CostliestVehiclesSvg() {
    const bars = [
      { name: 'Innova (GJ01CD778)', cost: '₹9.4k', w: 220, color: '#f43f5e' },
      { name: 'Swift (GJ01AB1234)', cost: '₹6.2k', w: 160, color: '#fb923c' },
      { name: 'City (GJ01CD7788)', cost: '₹5.9k', w: 145, color: '#facc15' },
      { name: 'Alto (GJ01AB5034)', cost: '₹4.1k', w: 110, color: '#38bdf8' },
      { name: 'Nexon EV (GJ01EV)', cost: '₹1.8k', w: 55, color: '#4ade80' },
    ];

    return React.createElement(
      'svg',
      { viewBox: '0 0 460 210', className: 'w-full h-full' },
      bars.map((b, i) =>
        React.createElement(
          'g',
          { key: i, transform: `translate(0, ${25 + i * 36})` },
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

  console.log('CARPOOL Core Application Script Loaded');
})();
