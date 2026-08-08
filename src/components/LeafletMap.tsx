import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Car, Compass, Layers, Maximize2, ShieldCheck, Zap } from 'lucide-react';

interface LeafletMapProps {
  startCoords?: [number, number];
  destCoords?: [number, number];
  startLocationName?: string;
  destLocationName?: string;
  interactive?: boolean;
  showVehicleSimulation?: boolean;
  vehicleModel?: string;
  driverName?: string;
  height?: string;
  onLocationSelect?: (coords: [number, number], name: string) => void;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

// Comprehensive Kolkata Geocoding Lookup Table
export function getKolkataGeoCoords(name: string, fallback: [number, number]): [number, number] {
  if (!name) return fallback;
  const str = name.toLowerCase().trim();
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

  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
  const latOffset = ((Math.abs(hash) % 1000) / 1000) * 0.12 - 0.06;
  const lngOffset = ((Math.abs(hash >> 3) % 1000) / 1000) * 0.12 - 0.06;
  return [22.5650 + latOffset, 88.3800 + lngOffset];
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  startCoords: initialStartCoords,
  destCoords: initialDestCoords,
  startLocationName = 'Park Street, Kolkata',
  destLocationName = 'Sector V, Salt Lake, Kolkata',
  interactive = true,
  showVehicleSimulation = false,
  vehicleModel = 'Swift Dzire',
  driverName = 'Raj Patel',
  height = '420px',
  onLocationSelect,
  className = '',
}) => {
  const startCoords = initialStartCoords || getKolkataGeoCoords(startLocationName, [22.5510, 88.3524]);
  const destCoords = initialDestCoords || getKolkataGeoCoords(destLocationName, [22.5804, 88.4378]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const [simProgress, setSimProgress] = useState(0.35); // 35% along journey
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Generate exact intermediate waypoint coordinates connecting start and destination
  const generateRouteWaypoints = (start: [number, number], end: [number, number]) => {
    const mid1: [number, number] = [
      (start[0] * 2 + end[0]) / 3 + 0.004,
      (start[1] * 2 + end[1]) / 3 + 0.006,
    ];
    const mid2: [number, number] = [
      (start[0] + end[0] * 2) / 3 - 0.003,
      (start[1] + end[1] * 2) / 3 + 0.004,
    ];
    return [start, mid1, mid2, end];
  };


  // Interpolate position along route
  const getInterpolatedPoint = (waypoints: [number, number][], progress: number): [number, number] => {
    const totalSegments = waypoints.length - 1;
    const scaledProgress = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const p1 = waypoints[segmentIndex];
    const p2 = waypoints[segmentIndex + 1];

    return [
      p1[0] + (p2[0] - p1[0]) * segmentProgress,
      p1[1] + (p2[1] - p1[1]) * segmentProgress,
    ];
  };

  useEffect(() => {
    // Check if Leaflet is loaded on window
    const checkLeaflet = () => {
      if (window.L) {
        setIsLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 200);
      }
    };
    checkLeaflet();
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;

  const [mapMode, setMapMode] = useState<'satellite' | 'street'>('satellite');
  const [telemetry, setTelemetry] = useState({
    speed: 46,
    eta: 4,
    locationName: 'EM Bypass / Maa Flyover',
    heading: 'North-East 45°',
    status: 'Live GPS Telemetry Synced',
  });

  const tileLayerRef = useRef<any>(null);
  const labelsLayerRef = useRef<any>(null);

  const updateTileLayers = (map: any, mode: 'satellite' | 'street') => {
    const L = window.L;
    if (!L || !map) return;

    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);

    if (mode === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Tiles &copy; Esri &mdash; Kolkata Satellite' }
      ).addTo(map);

      labelsLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    }
  };

  useEffect(() => {
    // Check if Leaflet is loaded on window
    const checkLeaflet = () => {
      if (window.L) {
        setIsLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 200);
      }
    };
    checkLeaflet();
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;

    const L = window.L;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const centerLat = (startCoords[0] + destCoords[0]) / 2;
      const centerLng = (startCoords[1] + destCoords[1]) / 2;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLng], 12);

      mapInstanceRef.current = map;
      updateTileLayers(map, mapMode);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const waypoints = generateRouteWaypoints(startCoords, destCoords);

      // Route Polyline (Glow effect & main line)
      const glowColor = mapMode === 'satellite' ? '#facc15' : '#38bdf8';
      L.polyline(waypoints, {
        color: glowColor,
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
      }).addTo(map);

      // Custom Start Icon (Green)
      const startHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-xl border-2 border-slate-900 font-bold text-xs">
          A
        </div>
      `;
      const startIcon = L.divIcon({
        className: 'custom-start-marker',
        html: startHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Custom Destination Icon (Red)
      const destHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white shadow-xl border-2 border-slate-900 font-bold text-xs">
          B
        </div>
      `;
      const destIcon = L.divIcon({
        className: 'custom-dest-marker',
        html: destHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const startMarker = L.marker(startCoords, { icon: startIcon }).addTo(map);
      startMarker.bindPopup(`<b>Pickup Location:</b> ${startLocationName}`).openPopup();

      const destMarker = L.marker(destCoords, { icon: destIcon }).addTo(map);
      destMarker.bindPopup(`<b>Destination Hub:</b> ${destLocationName}`);

      // LIVE MOVING VEHICLE MARKER WITH RADAR PULSE
      const carHtml = `
        <div class="relative flex items-center justify-center w-10 h-10">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <div class="relative flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400 text-black border-2 border-black shadow-2xl font-bold text-base">
            🚗
          </div>
        </div>
      `;
      const carIcon = L.divIcon({
        className: 'custom-car-marker',
        html: carHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const vehicleMarker = L.marker(waypoints[1], { icon: carIcon }).addTo(map);
      vehicleMarker.bindPopup(`
        <div class="p-1 text-slate-900 font-sans text-xs">
          <p class="font-extrabold text-sm text-blue-600">🚗 ${vehicleModel}</p>
          <p class="font-semibold">Driver: ${driverName}</p>
          <p class="text-slate-600">Location: EM Bypass / Maa Flyover</p>
          <p class="text-emerald-600 font-bold mt-1">Speed: 48 km/h • ETA: 4 mins</p>
        </div>
      `);
      vehicleMarkerRef.current = vehicleMarker;

      // Fit bounds to exact route
      map.fitBounds(L.polyline([startCoords, destCoords]).getBounds().pad(0.35));

      // Click to select location
      if (interactive && onLocationSelect) {
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          onLocationSelect([lat, lng], `Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        });
      }
    } catch (err) {
      console.error('Error initializing map:', err);
    }
  }, [isLeafletReady, startCoords, destCoords, startLocationName, destLocationName, interactive]);

  // Smooth live vehicle animation
  useEffect(() => {
    if (!mapInstanceRef.current || !vehicleMarkerRef.current || !window.L) return;

    let step = 0;
    const totalSteps = 100;
    const waypoints = generateRouteWaypoints(startCoords, destCoords);

    const interval = setInterval(() => {
      step = (step + 1) % totalSteps;
      const progress = step / totalSteps;

      const nextPoint = getInterpolatedPoint(waypoints, progress);
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLatLng(nextPoint);
      }

      setTelemetry({
        speed: Math.floor(42 + Math.sin(step) * 8),
        eta: Math.max(1, Math.round(5 - progress * 4)),
        locationName: progress < 0.35 ? 'EM Bypass / Maa Flyover' : progress < 0.7 ? 'Chingrighata Flyover' : 'Approaching Sector V Salt Lake',
        heading: 'North-East 45°',
        status: 'Live Satellite Telemetry 100% Synced',
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [startCoords, destCoords]);

  const handleModeChange = (mode: 'satellite' | 'street') => {
    setMapMode(mode);
    if (mapInstanceRef.current) {
      updateTileLayers(mapInstanceRef.current, mode);
    }
  };

  const handleLocateVehicle = () => {
    if (mapInstanceRef.current && vehicleMarkerRef.current) {
      const pos = vehicleMarkerRef.current.getLatLng();
      mapInstanceRef.current.flyTo(pos, 15, { animate: true, duration: 1.5 });
      vehicleMarkerRef.current.openPopup();
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-[9999] h-[calc(100vh-2rem)]' : ''
      } ${className}`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Right Interactive Map Controls & Satellite Switcher */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={() => handleModeChange('satellite')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-lg transition backdrop-blur-md ${
            mapMode === 'satellite'
              ? 'bg-yellow-400 text-black border border-yellow-500 ring-2 ring-yellow-400/40'
              : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
          title="High-Resolution Satellite Earth Imagery"
        >
          🛰️ Satellite
        </button>

        <button
          onClick={() => handleModeChange('street')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-lg transition backdrop-blur-md ${
            mapMode === 'street'
              ? 'bg-blue-600 text-white font-extrabold ring-2 ring-blue-400/50'
              : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
          title="Theme-Adaptive Street Vector Map"
        >
          🗺️ Streets
        </button>

        <button
          onClick={handleLocateVehicle}
          className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg transition backdrop-blur-md bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800"
          title="Center Camera on Current Vehicle Location"
        >
          🎯 Locate Vehicle
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Top-Left Live Telemetry HUD Overlay */}
      <div className="absolute top-3 left-3 z-10 p-3 rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-2xl backdrop-blur-xl text-xs max-w-xs text-white">
        <div className="flex items-center gap-2 font-extrabold mb-1">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-cyan-300">Live Vehicle Telemetry</span>
        </div>
        <div className="text-[11px] font-medium text-slate-400 truncate">{telemetry.locationName}</div>
        <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-slate-800 font-mono text-[11px]">
          <span className="font-bold text-emerald-400">{telemetry.speed} km/h</span>
          <span className="text-slate-500">•</span>
          <span className="font-bold text-yellow-400">ETA: {telemetry.eta} min</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-400">{vehicleModel}</span>
        </div>
      </div>

      {/* Bottom Route Summary Pill */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="px-3.5 py-2 rounded-2xl border border-slate-800/90 bg-slate-950/90 shadow-2xl backdrop-blur-xl text-xs flex items-center gap-2 font-bold text-white">
          <span className="text-emerald-400">●</span>
          <span className="truncate max-w-[120px]">{startLocationName.split(',')[0]}</span>
          <span className="text-slate-500">→</span>
          <span className="text-rose-400">●</span>
          <span className="truncate max-w-[120px]">{destLocationName.split(',')[0]}</span>
          <span className="ml-1 text-[10px] uppercase px-1.5 py-0.5 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">{mapMode}</span>
        </div>
      </div>
    </div>
  );
};
