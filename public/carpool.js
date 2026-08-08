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

  // High-precision Kolkata Road Network Points (EM Bypass, Maa Flyover, Major Arterial Road, Belghoria Expressway)
  function getKolkataRoadRoute(startCoords, destCoords) {
    const sLat = startCoords[0];
    const sLng = startCoords[1];
    const dLat = destCoords[0];
    const dLng = destCoords[1];

    const pts = [startCoords];

    if (sLat > 22.62 || dLat > 22.62) {
      pts.push([(sLat * 3 + 22.6540) / 4, (sLng * 3 + 88.3580) / 4]);
      pts.push([22.6560, 88.3850]); // Belghoria Expressway
      pts.push([22.6520, 88.4250]); // Airport / Jessore Rd
      pts.push([22.6280, 88.4420]); // VIP Road
      pts.push([22.5950, 88.4400]); // Major Arterial Road
    } else {
      pts.push([(sLat * 2 + 22.5488) / 3, (sLng * 2 + 88.3610) / 3]); // Towards Park Circus 7-point
      pts.push([22.5442, 88.3750]); // Maa Flyover entrance
      pts.push([22.5435, 88.3915]); // Science City interchange
      pts.push([22.5512, 88.3980]); // EM Bypass Northbound
      pts.push([22.5645, 88.4045]); // Chingrighata Flyover
      pts.push([22.5710, 88.4210]); // Salt Lake Bypass / Broadway
      pts.push([22.5760, 88.4315]); // Sector V Entrance Ring
    }

    pts.push(destCoords);

    const denseRoad = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const steps = 12;
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        denseRoad.push([p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t]);
      }
    }
    denseRoad.push(destCoords);
    return denseRoad;
  }

  // --- Map Component using Leaflet for Kolkata Transit & Satellite Observation ---
  function MapView({ startName = 'Park Street, Kolkata', destName = 'Sector V, Salt Lake, Kolkata', height = '380px', showSimulation = false }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const vehicleMarkerRef = useRef(null);
    const routePolylineRef = useRef(null);
    const tileLayerRef = useRef(null);
    const labelsLayerRef = useRef(null);

    const [mapMode, setMapMode] = useState('satellite'); // 'satellite' | 'street'
    const [roadPoints, setRoadPoints] = useState([]);
    const [telemetry, setTelemetry] = useState({
      speed: 48,
      eta: 4,
      roadName: 'Maa Flyover / EM Bypass Corridor',
      heading: '45° NE',
      status: 'Driving on Satellite Road Asphalt (100% Lane-Matched)',
    });

    const isLight = document.documentElement.classList.contains('light');

    // Exact geocoded coordinates for start and destination
    const startCoords = getKolkataCoords(startName, [22.5510, 88.3524]);
    const destCoords = getKolkataCoords(destName, [22.5804, 88.4378]);

    // Function to switch tile layers
    const updateTileLayers = (map, mode) => {
      const L = window.L;
      if (!L || !map) return;

      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
      if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);

      if (mode === 'satellite') {
        tileLayerRef.current = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19, attribution: 'Tiles &copy; Esri &mdash; Kolkata Satellite Imagery' }
        ).addTo(map);

        labelsLayerRef.current = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
          { maxZoom: 19, subdomains: 'abcd' }
        ).addTo(map);
      } else {
        const streetUrl = isLight
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

        tileLayerRef.current = L.tileLayer(streetUrl, {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);
      }
    };

    useEffect(() => {
      if (!mapRef.current || !window.L) return;

      const L = window.L;
      const centerLat = (startCoords[0] + destCoords[0]) / 2;
      const centerLng = (startCoords[1] + destCoords[1]) / 2;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLng], 12);

      mapInstanceRef.current = map;
      updateTileLayers(map, mapMode);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      let initialRoad = getKolkataRoadRoute(startCoords, destCoords);
      setRoadPoints(initialRoad);

      const roadCasing = L.polyline(initialRoad, {
        color: '#000000',
        weight: 8,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const polylineGlow = mapMode === 'satellite'
        ? (isLight ? '#facc15' : '#38bdf8')
        : (isLight ? '#ca8a04' : '#38bdf8');

      const roadLine = L.polyline(initialRoad, {
        color: polylineGlow,
        weight: 5,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routePolylineRef.current = roadLine;

      const startBorder = isLight ? '#09090b' : '#0f172a';
      const startHtml = `<div style="background:#10b981;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid ${startBorder};box-shadow:0 4px 14px rgba(16,185,129,0.7);color:#fff;font-size:12px;font-weight:bold;">A</div>`;
      L.marker(startCoords, {
        icon: L.divIcon({ className: 's-pin', html: startHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
      }).addTo(map).bindPopup(`<b style="color:#0f172a;">Start: ${startName}</b>`).openPopup();

      const destHtml = `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid ${startBorder};box-shadow:0 4px 14px rgba(225,29,72,0.7);color:#fff;font-size:12px;font-weight:bold;">B</div>`;
      L.marker(destCoords, {
        icon: L.divIcon({ className: 'd-pin', html: destHtml, iconSize: [28, 28], iconAnchor: [14, 14] }),
      }).addTo(map).bindPopup(`<b style="color:#0f172a;">Destination: ${destName}</b>`);

      const carBg = isLight ? '#facc15' : '#38bdf8';
      const carText = isLight ? '#000000' : '#ffffff';
      const carBorder = isLight ? '#000000' : '#ffffff';
      const carHtml = `
        <div id="live-car-hud-carpool" style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;transition:transform 0.3s ease;">
          <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:${carBg};opacity:0.4;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position:relative;background:${carBg};color:${carText};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid ${carBorder};box-shadow:0 0 20px ${carBg};font-size:16px;font-weight:bold;z-index:2;">
            🚗
          </div>
        </div>
      `;

      const carMarker = L.marker(initialRoad[0] || startCoords, {
        icon: L.divIcon({ className: 'c-pin', html: carHtml, iconSize: [40, 40], iconAnchor: [20, 20] }),
      }).addTo(map);

      carMarker.bindPopup(`
        <div style="font-family:sans-serif;padding:3px;font-size:12px;">
          <b style="color:${isLight ? '#000' : '#38bdf8'};font-size:13px;">🚗 Swift Dzire (WB02AB1234)</b><br/>
          <span><b>Driver:</b> Raj Patel (4.9 ★)</span><br/>
          <span><b>Current Road:</b> Maa Flyover / EM Bypass</span><br/>
          <span style="color:#10b981;font-weight:bold;">Driving Speed: 48 km/h • ETA: 4 mins</span>
        </div>
      `);
      vehicleMarkerRef.current = carMarker;

      map.fitBounds(L.polyline([startCoords, destCoords]).getBounds().pad(0.35));

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
            const rawCoords = data.routes[0].geometry.coordinates;
            const realRoad = rawCoords.map((c) => [c[1], c[0]]);
            if (realRoad.length > 5) {
              setRoadPoints(realRoad);
              roadCasing.setLatLngs(realRoad);
              roadLine.setLatLngs(realRoad);
              map.fitBounds(roadLine.getBounds().pad(0.25));
            }
          }
        })
        .catch((e) => console.log('Using fallback Kolkata high-precision road network'));

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    }, [startName, destName, isLight]);

    // Live Turn-by-Turn driving along road
    useEffect(() => {
      if (!mapInstanceRef.current || !vehicleMarkerRef.current) return;

      const pts = roadPoints.length > 5 ? roadPoints : getKolkataRoadRoute(startCoords, destCoords);
      if (!pts || pts.length < 2) return;

      let currentIndex = 0;

      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % pts.length;
        const currentPt = pts[currentIndex];
        const nextPt = pts[(currentIndex + 1) % pts.length];

        if (vehicleMarkerRef.current) {
          vehicleMarkerRef.current.setLatLng(currentPt);

          const dy = nextPt[0] - currentPt[0];
          const dx = nextPt[1] - currentPt[1];
          const angleDeg = Math.atan2(dx, dy) * (180 / Math.PI);

          const el = document.getElementById('live-car-hud-carpool');
          if (el) {
            el.style.transform = `rotate(${Math.round(angleDeg)}deg)`;
          }
        }

        const progressPercent = currentIndex / pts.length;
        const currentRoadName = progressPercent < 0.25
          ? 'Park Circus 7-Point / Suhrawardy Ave'
          : progressPercent < 0.55
          ? 'Maa Flyover (AJC Bose Rd to EM Bypass)'
          : progressPercent < 0.8
          ? 'EM Bypass / Chingrighata Flyover'
          : 'Salt Lake Bypass / Sector V Ring';

        setTelemetry({
          speed: Math.floor(44 + Math.sin(currentIndex) * 6),
          eta: Math.max(1, Math.round(5 - progressPercent * 4)),
          roadName: currentRoadName,
          heading: `${Math.round(Math.abs(Math.sin(currentIndex) * 360))}° Corridor`,
          status: 'Exact Satellite Road Asphalt Matched',
        });
      }, 600);

      return () => clearInterval(interval);
    }, [roadPoints, startCoords, destCoords]);destName]);

    // Handle Map Mode Toggle
    const handleModeChange = (newMode) => {
      setMapMode(newMode);
      if (mapInstanceRef.current) {
        updateTileLayers(mapInstanceRef.current, newMode);
      }
    };

    // Locate Vehicle in Real-Time
    const handleLocateVehicle = () => {
      if (mapInstanceRef.current && vehicleMarkerRef.current) {
        const pos = vehicleMarkerRef.current.getLatLng();
        mapInstanceRef.current.flyTo(pos, 15, { animate: true, duration: 1.5 });
        vehicleMarkerRef.current.openPopup();
      }
    };

    return React.createElement(
      'div',
      {
        className: `w-full rounded-3xl border overflow-hidden shadow-2xl relative z-0 ${
          isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950'
        }`,
        style: { height },
      },
      // Map DOM container
      React.createElement('div', { ref: mapRef, className: 'w-full h-full z-0' }),

      // Top-Right Interactive Map Controls & Satellite Switcher
      React.createElement(
        'div',
        { className: 'absolute top-3 right-3 z-10 flex items-center gap-1.5' },
        React.createElement(
          'button',
          {
            onClick: () => handleModeChange('satellite'),
            className: `px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-lg transition backdrop-blur-md ${
              mapMode === 'satellite'
                ? isLight
                  ? 'bg-yellow-400 text-black border border-yellow-500 ring-2 ring-yellow-400/40'
                  : 'bg-cyan-500 text-slate-950 font-extrabold ring-2 ring-cyan-400/50'
                : isLight
                ? 'bg-white/90 text-slate-700 hover:bg-white border border-slate-200'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`,
            title: 'High-Resolution Satellite Earth Imagery',
          },
          '🛰️ Satellite'
        ),
        React.createElement(
          'button',
          {
            onClick: () => handleModeChange('street'),
            className: `px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-lg transition backdrop-blur-md ${
              mapMode === 'street'
                ? isLight
                  ? 'bg-yellow-400 text-black border border-yellow-500 ring-2 ring-yellow-400/40'
                  : 'bg-blue-600 text-white font-extrabold ring-2 ring-blue-400/50'
                : isLight
                ? 'bg-white/90 text-slate-700 hover:bg-white border border-slate-200'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`,
            title: 'Theme-Adaptive Street Vector Map',
          },
          '🗺️ Streets'
        ),
        React.createElement(
          'button',
          {
            onClick: handleLocateVehicle,
            className: `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg transition backdrop-blur-md ${
              isLight
                ? 'bg-white/90 hover:bg-yellow-100 text-black border border-slate-200'
                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800'
            }`,
            title: 'Center Camera on Current Vehicle Location',
          },
          '🎯 Locate Vehicle'
        )
      ),

      // Top-Left Live Telemetry HUD Overlay
      React.createElement(
        'div',
        {
          className: `absolute top-3 left-3 z-10 p-3 rounded-2xl border shadow-xl backdrop-blur-xl text-xs max-w-xs transition-colors ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900'
              : 'bg-slate-950/90 border-slate-800 text-white'
          }`,
        },
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 font-extrabold mb-1' },
          React.createElement('span', { className: 'flex h-2.5 w-2.5 relative' },
            React.createElement('span', { className: 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' }),
            React.createElement('span', { className: 'relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500' })
          ),
          React.createElement('span', { className: isLight ? 'text-black' : 'text-cyan-300' }, 'Live Vehicle Telemetry')
        ),
        React.createElement('div', { className: `text-[11px] font-medium truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}` }, telemetry.locationName),
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 mt-1.5 pt-1.5 border-t border-slate-200/50 font-mono text-[11px]' },
          React.createElement('span', { className: `font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}` }, `${telemetry.speed} km/h`),
          React.createElement('span', { className: 'text-slate-400' }, '•'),
          React.createElement('span', { className: `font-bold ${isLight ? 'text-yellow-800' : 'text-yellow-400'}` }, `ETA: ${telemetry.eta} min`),
          React.createElement('span', { className: 'text-slate-400' }, '•'),
          React.createElement('span', { className: isLight ? 'text-slate-700' : 'text-cyan-400' }, 'Swift Dzire')
        )
      ),

      // Bottom Route Summary Pill
      React.createElement(
        'div',
        { className: 'absolute bottom-3 left-3 z-10' },
        React.createElement(
          'div',
          {
            className: `px-3.5 py-2 rounded-2xl border shadow-xl backdrop-blur-xl text-xs flex items-center gap-2 font-bold ${
              isLight
                ? 'bg-white/95 border-slate-200 text-black'
                : 'bg-slate-950/90 border-slate-800 text-white'
            }`,
          },
          React.createElement('span', { className: 'text-emerald-500' }, '●'),
          React.createElement('span', { className: 'truncate max-w-[110px]' }, startName.split(',')[0]),
          React.createElement('span', { className: 'text-slate-400' }, '→'),
          React.createElement('span', { className: 'text-rose-500' }, '●'),
          React.createElement('span', { className: 'truncate max-w-[110px]' }, destName.split(',')[0]),
          React.createElement('span', { className: `ml-1 text-[10px] uppercase px-1.5 py-0.5 rounded font-mono ${mapMode === 'satellite' ? (isLight ? 'bg-yellow-200 text-yellow-950' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30') : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'}` }, mapMode)
        )
      )
    );
  }

    const isLightContainer = document.documentElement.classList.contains('light');
    return React.createElement('div', {
      ref: mapRef,
      className: isLightContainer ? 'w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl relative z-0' : 'w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative z-0',
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
